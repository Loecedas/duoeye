export { renderers } from '../../renderers.mjs';

const LEAGUE_TIERS = [
  "青铜",
  "白银",
  "黄金",
  "蓝宝石",
  "红宝石",
  "祖母绿",
  "紫水晶",
  "珍珠",
  "黑曜石",
  "钻石"
];
const MS_PER_DAY = 1e3 * 60 * 60 * 24;
const DEFAULT_TIMEZONE = "Asia/Shanghai";
function toLocalDateKey(date, timeZone = DEFAULT_TIMEZONE) {
  if (!date || isNaN(date.getTime())) return "1970-01-01";
  try {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone
    }).format(date);
  } catch (e) {
    const offsetDate = new Date(date.getTime() + (timeZone === "Asia/Shanghai" ? 8 : 0) * 36e5);
    return offsetDate.toISOString().split("T")[0];
  }
}
function getStartOfDayInTimezone(date, timeZone = DEFAULT_TIMEZONE) {
  const dateKey = toLocalDateKey(date, timeZone);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset"
  });
  const parts = formatter.formatToParts(date);
  const offsetPart = parts.find((p) => p.type === "timeZoneName")?.value || "+08:00";
  const offsetMatch = offsetPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
  const offset = offsetMatch ? `${offsetMatch[1]}${offsetMatch[2].padStart(2, "0")}:${(offsetMatch[3] || "0").padStart(2, "0")}` : "+08:00";
  return (/* @__PURE__ */ new Date(`${dateKey}T00:00:00${offset}`)).getTime();
}
function parseSummaryDateKey(date) {
  if (typeof date === "number") {
    const d2 = new Date(date < 1e10 ? date * 1e3 : date);
    if (isNaN(d2.getTime())) return null;
    return toLocalDateKey(d2);
  }
  const dateStr = String(date).replace(/\//g, "-");
  const d = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00Z`);
  if (isNaN(d.getTime())) return null;
  return toLocalDateKey(d);
}
function getMonday(date, timeZone = DEFAULT_TIMEZONE) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone
  });
  const parts = formatter.formatToParts(date);
  const year = parseInt(parts.find((p) => p.type === "year")?.value || "2024");
  const month = parseInt(parts.find((p) => p.type === "month")?.value || "1") - 1;
  const day = parseInt(parts.find((p) => p.type === "day")?.value || "1");
  const localDate = new Date(year, month, day);
  const dayOfWeek = localDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(localDate);
  monday.setDate(localDate.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}
function calcDaysSince(createdAt) {
  const todayKey = toLocalDateKey(/* @__PURE__ */ new Date());
  const createdKey = toLocalDateKey(createdAt);
  const diffMs = new Date(todayKey).getTime() - new Date(createdKey).getTime();
  return Math.max(0, Math.floor(diffMs / MS_PER_DAY));
}
function resolveTierIndex(rawAny, rawData) {
  if (rawAny._leaderboardTier !== void 0 && rawAny._leaderboardTier >= 0) return rawAny._leaderboardTier;
  const lb = rawAny._leaderboard;
  if (lb !== void 0 && lb !== null) {
    if (lb.active_leaderboard?.tier !== void 0) return lb.active_leaderboard.tier;
    if (lb.tier !== void 0 && lb.tier >= 0) return lb.tier;
    if (lb.data?.tier !== void 0) return lb.data.tier;
    if (Array.isArray(lb.ranked_users) && lb.ranked_users[0]?.tier !== void 0)
      return lb.ranked_users[0].tier;
  }
  if (rawAny.tier !== void 0 && rawAny.tier >= 0 && rawAny.tier <= 10) return rawAny.tier;
  if (rawAny.trackingProperties?.league_tier !== void 0) return rawAny.trackingProperties.league_tier;
  if (rawAny.trackingProperties?.leaderboard_league !== void 0) return rawAny.trackingProperties.leaderboard_league;
  if (rawAny.tracking_properties?.league_tier !== void 0) return rawAny.tracking_properties.league_tier;
  if (rawAny.tracking_properties?.leaderboard_league !== void 0) return rawAny.tracking_properties.leaderboard_league;
  if (rawData.language_data) {
    const currentLang = Object.values(rawData.language_data).find((l) => l.current_learning);
    if (currentLang?.tier !== void 0) return currentLang.tier;
  }
  return -1;
}
function parseCreationDate(creationTs, created) {
  if (creationTs) {
    const ts = creationTs < 1e10 ? creationTs * 1e3 : creationTs;
    const cDate = new Date(ts);
    if (!isNaN(cDate.getTime())) {
      return {
        dateStr: cDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }),
        ageDays: calcDaysSince(cDate)
      };
    }
  }
  if (created) {
    const cDate = new Date(created);
    if (!isNaN(cDate.getTime())) {
      return {
        dateStr: cDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }),
        ageDays: calcDaysSince(cDate)
      };
    }
  }
  return { dateStr: "未知", ageDays: 0 };
}
function resolveStreakExtendedTime(streakExtendedToday, rawAny, rawData, localTodayStart) {
  if (!streakExtendedToday) return void 0;
  if (rawAny.streakData?.currentStreak?.lastExtendedDate) {
    return new Date(rawAny.streakData.currentStreak.lastExtendedDate).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  }
  if (rawData.calendar?.length) {
    const todayStr = (/* @__PURE__ */ new Date()).toDateString();
    const todayEvents = rawData.calendar.filter((e) => e && e.datetime && new Date(e.datetime).toDateString() === todayStr).sort((a, b) => a.datetime - b.datetime);
    if (todayEvents.length > 0) {
      return new Date(todayEvents[0].datetime).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    }
  }
  if (rawAny.xpGains?.length) {
    const todayGains = rawAny.xpGains.filter((g) => g && typeof g.time === "number" && g.time * 1e3 >= localTodayStart).sort((a, b) => a.time - b.time);
    if (todayGains.length > 0) {
      return new Date(todayGains[0].time * 1e3).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    }
  }
  return void 0;
}
function sumPoints(items) {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (item.points || item.xp || 0), 0);
}
function transformDuolingoData(rawData) {
  if (!rawData || typeof rawData !== "object") {
    throw new TypeError("transformDuolingoData: 输入必须是有效的用户数据对象");
  }
  const rawAny = rawData;
  const streak = rawData.site_streak ?? rawData.streak ?? 0;
  const gems = rawAny._inventoryGems ?? rawAny._fieldsData?.gems ?? rawAny._inventory?.gems ?? rawAny._inventory?.lingots ?? rawAny._inventory?.gem_count ?? rawData.gemsTotalCount ?? rawData.totalGems ?? rawData.gems ?? rawData.tracking_properties?.gems ?? rawData.lingots ?? rawData.rupees ?? 0;
  let totalXp = rawData.total_xp ?? rawData.totalXp ?? 0;
  if (totalXp === 0) totalXp = sumPoints(rawData.languages);
  if (totalXp === 0 && rawData.language_data) totalXp = sumPoints(Object.values(rawData.language_data));
  if (totalXp === 0) totalXp = sumPoints(rawData.courses);
  const dailyGoal = rawData.dailyGoal ?? rawData.daily_goal ?? rawData.xpGoal ?? 0;
  const creationTs = rawData.creation_date || rawData.creationDate;
  let courses = [];
  if (rawData.courses?.length) {
    courses = rawData.courses.filter((c) => (c.xp || 0) > 0 || c.current_learning).map((c) => ({
      title: c.title,
      xp: c.xp,
      fromLanguage: c.fromLanguage,
      learningLanguage: c.learningLanguage,
      crowns: c.crowns || 0,
      id: c.id
    }));
  }
  if (rawAny.languages?.length) {
    const v1Courses = rawAny.languages.filter((l) => l.points > 0 || l.current_learning).map((l) => ({
      id: l.language,
      title: l.language_string,
      xp: l.points || 0,
      crowns: l.crowns || 0,
      fromLanguage: "en",
      learningLanguage: l.language
    }));
    for (const v1c of v1Courses) {
      const exists = courses.some(
        (c) => c.title === v1c.title || c.learningLanguage === v1c.learningLanguage || c.id && v1c.id && v1c.id.length > 0 && c.id.includes(v1c.id)
      );
      if (!exists) courses.push(v1c);
    }
  }
  if (courses.length === 0 && rawData.language_data) {
    courses = Object.entries(rawData.language_data).filter(([_, langDetail]) => {
      const xp = langDetail.points || langDetail.level_progress || 0;
      return xp > 0 || langDetail.current_learning;
    }).map(([langCode, langDetail]) => {
      let crowns = langDetail.crowns || 0;
      if (crowns === 0 && langDetail.skills?.length) {
        crowns = langDetail.skills.reduce((acc, skill) => acc + (skill.levels_finished || skill.crowns || skill.finishedLevels || 0), 0);
      }
      return {
        id: langDetail.learning_language || langCode,
        title: langDetail.language_string,
        xp: langDetail.points || langDetail.level_progress || 0,
        crowns,
        fromLanguage: langDetail.from_language || "en",
        learningLanguage: langDetail.learning_language || langCode
      };
    });
  }
  let learningLanguage = "None";
  if (rawData.language_data) {
    const current = Object.values(rawData.language_data).find((l) => l.current_learning);
    learningLanguage = current?.language_string ?? courses[0]?.title ?? "None";
  } else if (rawData.currentCourse) {
    learningLanguage = rawData.currentCourse.title;
  } else if (courses.length > 0) {
    learningLanguage = courses[0].title;
  }
  const xpByDate = /* @__PURE__ */ new Map();
  const timeByDate = /* @__PURE__ */ new Map();
  function addCalendarEvent(event) {
    if (!event || !event.datetime) return;
    const d = new Date(event.datetime);
    if (isNaN(d.getTime())) return;
    const dateKey = toLocalDateKey(d);
    const improvement = event.improvement || 0;
    xpByDate.set(dateKey, (xpByDate.get(dateKey) || 0) + improvement);
    timeByDate.set(dateKey, (timeByDate.get(dateKey) || 0) + Math.ceil((improvement || 10) / 3));
  }
  if (rawAny._xpSummaries?.length) {
    for (const summary of rawAny._xpSummaries) {
      const dateKey = parseSummaryDateKey(summary.date);
      if (!dateKey) continue;
      const gainedXp = summary.gainedXp ?? summary.gained_xp ?? 0;
      xpByDate.set(dateKey, gainedXp);
      const sessionTimeSeconds = summary.totalSessionTime ?? summary.total_session_time ?? 0;
      const minutes = Math.round(sessionTimeSeconds / 60);
      timeByDate.set(dateKey, minutes > 0 ? minutes : Math.ceil(gainedXp / 3));
    }
  } else if (rawData.calendar?.length) {
    rawData.calendar.forEach(addCalendarEvent);
  } else if (rawData.language_data) {
    Object.values(rawData.language_data).forEach((lang) => {
      if (lang.calendar?.length) lang.calendar.forEach(addCalendarEvent);
    });
  }
  const dailyXpHistory = [];
  const dailyTimeHistory = [];
  const today = /* @__PURE__ */ new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = toLocalDateKey(d);
    const dayLabel = d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
    dailyXpHistory.push({ date: dayLabel, xp: xpByDate.get(dateKey) || 0 });
    dailyTimeHistory.push({ date: dayLabel, time: timeByDate.get(dateKey) || 0 });
  }
  const weeklyXpHistory = [];
  const weeklyTimeHistory = [];
  const monday = getMonday(today);
  const todayDateKey = toLocalDateKey(today);
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateKey = toLocalDateKey(d);
    const dayLabel = d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
    const isFuture = dateKey > todayDateKey;
    weeklyXpHistory.push({
      date: dayLabel,
      xp: isFuture ? 0 : xpByDate.get(dateKey) || 0,
      isFuture
    });
    weeklyTimeHistory.push({
      date: dayLabel,
      time: isFuture ? 0 : timeByDate.get(dateKey) || 0,
      isFuture
    });
  }
  const yearlyXpHistory = [];
  xpByDate.forEach((xp, date) => yearlyXpHistory.push({ date, xp, time: timeByDate.get(date) }));
  const monthlyXpHistory = generateMonthlyXpHistory(xpByDate);
  const tierIndex = resolveTierIndex(rawAny, rawData);
  const leagueName = tierIndex >= 0 && tierIndex < LEAGUE_TIERS.length ? LEAGUE_TIERS[tierIndex] : "—";
  const { dateStr: creationDateStr, ageDays: accountAgeDays } = parseCreationDate(creationTs, rawData.created);
  const hasInventoryPremium = rawAny.inventory?.premium_subscription || rawAny.inventory?.super_subscription;
  const hasItemPremium = rawAny.has_item_premium_subscription || rawAny.has_item_immersive_subscription;
  const isPlus = !!(rawData.hasPlus || rawData.hasSuper || rawData.plusStatus === "active" || rawAny.has_plus || rawAny.is_plus || hasInventoryPremium || hasItemPremium);
  let totalMinutes = 0;
  let hasRealTimeData = false;
  if (rawAny._xpSummaries?.length) {
    const totalSeconds = rawAny._xpSummaries.reduce((acc, s) => acc + (s.totalSessionTime ?? s.total_session_time ?? 0), 0);
    totalMinutes = Math.floor(totalSeconds / 60);
    hasRealTimeData = totalSeconds > 0;
  }
  const estimatedLearningTime = hasRealTimeData ? `${Math.floor(totalMinutes / 60)}小时 ${totalMinutes % 60}分钟` : "暂无数据";
  let xpToday = 0;
  let lessonsToday = 0;
  const streakExtendedToday = rawAny.streak_extended_today ?? rawAny.streakExtendedToday ?? false;
  const now = /* @__PURE__ */ new Date();
  const localTodayStart = getStartOfDayInTimezone(now);
  const localTodayEnd = localTodayStart + MS_PER_DAY;
  const localTodayDateKey = toLocalDateKey(now);
  const streakExtendedTime = resolveStreakExtendedTime(streakExtendedToday, rawAny, rawData, localTodayStart);
  if (rawAny._xpSummaries?.length) {
    const todaySummary = rawAny._xpSummaries.find(
      (s) => parseSummaryDateKey(s.date) === localTodayDateKey
    );
    if (todaySummary) {
      xpToday = todaySummary.gainedXp ?? todaySummary.gained_xp ?? 0;
      lessonsToday = todaySummary.numSessions ?? 0;
    }
  }
  if (xpToday === 0) {
    const todayXpFromHistory = xpByDate.get(localTodayDateKey) || 0;
    if (rawAny.xp_today !== void 0) {
      xpToday = rawAny.xp_today;
    } else if (todayXpFromHistory > 0) {
      xpToday = todayXpFromHistory;
    } else if (rawAny.streakData?.currentStreak?.endDate) {
      const streakEndTs = new Date(rawAny.streakData.currentStreak.endDate).getTime();
      if (streakEndTs >= localTodayStart && streakEndTs < localTodayEnd) {
        xpToday = rawAny.streakData.currentStreak.lastExtendedDate ? 1 : 0;
      }
    } else if (rawData.calendar?.length) {
      const todayEvents = rawData.calendar.filter(
        (e) => e.datetime >= localTodayStart && e.datetime < localTodayEnd
      );
      xpToday = todayEvents.reduce((acc, e) => acc + (e.improvement || 0), 0);
      if (lessonsToday === 0) lessonsToday = todayEvents.length;
    }
  }
  if (xpToday === 0 && rawAny.xpGains?.length) {
    const todayGains = rawAny.xpGains.filter((g) => {
      const gainTs = g.time * 1e3;
      return gainTs >= localTodayStart && gainTs < localTodayEnd;
    });
    xpToday = todayGains.reduce((acc, g) => acc + (g.xp || 0), 0);
    if (lessonsToday === 0) lessonsToday = todayGains.length;
  }
  return {
    streak,
    totalXp,
    gems,
    league: leagueName,
    leagueTier: tierIndex,
    courses,
    dailyXpHistory,
    dailyTimeHistory,
    yearlyXpHistory,
    monthlyXpHistory,
    weeklyXpHistory,
    weeklyTimeHistory,
    learningLanguage,
    creationDate: creationDateStr,
    accountAgeDays,
    isPlus,
    dailyGoal,
    estimatedLearningTime,
    xpToday,
    lessonsToday: lessonsToday || void 0,
    streakExtendedToday,
    streakExtendedTime,
    weeklyXp: rawAny.weeklyXp,
    numSessionsCompleted: rawAny.numSessionsCompleted,
    streakFreezeCount: rawAny.streakFreezeCount
  };
}
function generateMonthlyXpHistory(xpByDate) {
  const monthlyData = /* @__PURE__ */ new Map();
  const today = /* @__PURE__ */ new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyData.set(monthKey, 0);
  }
  xpByDate.forEach((xp, dateStr) => {
    const monthKey = dateStr.substring(0, 7);
    if (monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + xp);
    }
  });
  const result = [];
  monthlyData.forEach((xp, monthKey) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const label = date.toLocaleDateString("zh-CN", { year: "numeric", month: "short" });
    result.push({ date: label, xp });
  });
  return result;
}

const CACHE = /* @__PURE__ */ new Map();
const CACHE_TTL = 5 * 60 * 1e3;
const CACHE_MAX_ENTRIES = 200;
const DUOLINGO_BASE_URL = "https://www.duolingo.com";
const DUOLINGO_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjYzMDcyMDAwMDAsImlhdCI6MCwic3ViIjoyNjEyMTc4MDAzMzg5NjN9.NsaoMcgSYYH-TNo4KDfFxkg33zbIXZU1yvDeVshr9B0";
async function fetchWithTimeout(url, headers, timeoutMs = 8e3) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { data: null, status: res.status };
    return { data: await res.json(), status: res.status };
  } catch {
    clearTimeout(timeoutId);
    return { data: null, status: 0 };
  }
}
function isValidUsername(username) {
  return /^[a-zA-Z0-9_\-.]{1,64}$/.test(username);
}
function jsonResponse(data, status, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers }
  });
}
function pruneCache(now) {
  for (const [key, entry] of CACHE.entries()) {
    if (now - entry.timestamp >= CACHE_TTL) {
      CACHE.delete(key);
    }
  }
  while (CACHE.size >= CACHE_MAX_ENTRIES) {
    const oldestKey = CACHE.keys().next().value;
    if (!oldestKey) break;
    CACHE.delete(oldestKey);
  }
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { username } = body;
    if (!username) {
      return jsonResponse({ error: "Username is required" }, 400);
    }
    if (!isValidUsername(username)) {
      return jsonResponse({ error: "用户名格式无效" }, 400);
    }
    const cacheKey = username.toLowerCase();
    const now = Date.now();
    pruneCache(now);
    const cached = CACHE.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return jsonResponse({ data: cached.data }, 200);
    }
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Referer": "https://www.duolingo.com/",
      "Origin": "https://www.duolingo.com",
      "sec-ch-ua": '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin"
    };
    const [v2Result, v1Result, api1Result] = await Promise.all([
      fetchWithTimeout(
        `${DUOLINGO_BASE_URL}/2017-06-30/users?username=${encodeURIComponent(username)}`,
        headers,
        1e4
      ),
      fetchWithTimeout(
        `${DUOLINGO_BASE_URL}/users/${encodeURIComponent(username)}`,
        headers,
        8e3
      ),
      fetchWithTimeout(
        `${DUOLINGO_BASE_URL}/api/1/users/show?username=${encodeURIComponent(username)}`,
        headers,
        8e3
      )
    ]);
    if (v2Result.status === 401 || v2Result.status === 403) {
      return jsonResponse({ error: "该账号设置为私密，无法访问" }, 403);
    }
    const v2Raw = v2Result.data;
    const v2Data = v2Raw?.users?.[0] || v2Raw;
    const v1Data = v1Result.data;
    const api1Data = api1Result.data;
    if (!v2Data && !v1Data && !api1Data) {
      return jsonResponse({ error: "找不到该用户，请检查用户名是否正确" }, 404);
    }
    const userData = {
      ...v1Data || {},
      ...api1Data || {},
      ...v2Data || {},
      tracking_properties: {
        ...v1Data?.tracking_properties || v1Data?.trackingProperties || {},
        ...api1Data?.tracking_properties || api1Data?.trackingProperties || {},
        ...v2Data?.tracking_properties || v2Data?.trackingProperties || {}
      }
    };
    const userId = userData.id || userData.user_id || userData.tracking_properties?.user_id;
    if (userId && DUOLINGO_JWT) {
      const authHeaders = { ...headers, "Authorization": `Bearer ${DUOLINGO_JWT}` };
      const [xpResult, lbResult] = await Promise.all([
        fetchWithTimeout(
          `${DUOLINGO_BASE_URL}/2017-06-30/users/${userId}/xp_summaries?startDate=1970-01-01`,
          authHeaders,
          12e3
        ),
        fetchWithTimeout(
          `${DUOLINGO_BASE_URL}/2017-06-30/users/${userId}/leaderboards?active=true`,
          authHeaders,
          1e4
        )
      ]);
      if (xpResult.data?.summaries) userData._xpSummaries = xpResult.data.summaries;
      if (lbResult.data) userData._leaderboardHistory = lbResult.data;
    }
    if (!userData || typeof userData !== "object") {
      return jsonResponse({ error: "数据格式异常" }, 502);
    }
    const transformed = transformDuolingoData(userData);
    pruneCache(now);
    CACHE.set(cacheKey, { data: transformed, timestamp: now });
    return jsonResponse({ data: transformed }, 200);
  } catch (err) {
    return jsonResponse({ error: "获取数据时出错：" + (err?.message || "未知错误") }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
