import type { UserData, DuolingoRawUser, Course } from "../types";
import {
  DEFAULT_TIMEZONE,
  getBrowserTimeZone,
  getDateKeyInTimeZone,
  sanitizeTimeZone,
} from '../utils/timezone';

const LEAGUE_TIERS = [
  "青铜", "白银", "黄金", "蓝宝石", "红宝石",
  "祖母绿", "紫水晶", "珍珠", "黑曜石", "钻石"
];

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const formatters = {
  localDate: new Map<string, Intl.DateTimeFormat>(),
  startOfDay: new Map<string, Intl.DateTimeFormat>(),
  monday: new Map<string, Intl.DateTimeFormat>(),
};

function toLocalDateKey(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  return getDateKeyInTimeZone(date, timeZone);
}

function getStartOfDayInTimezone(date: Date, timeZone: string = DEFAULT_TIMEZONE): number {
  const normalizedTimeZone = sanitizeTimeZone(timeZone);
  const dateKey = toLocalDateKey(date, timeZone);
  let formatter = formatters.startOfDay.get(normalizedTimeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: normalizedTimeZone,
      timeZoneName: 'shortOffset'
    });
    formatters.startOfDay.set(normalizedTimeZone, formatter);
  }
  const parts = formatter.formatToParts(date);
  const offsetPart = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+00:00';
  const offsetMatch = offsetPart.match(/([+-])(\d+)(?::(\d+))?/);
  const offset = offsetMatch
    ? `${offsetMatch[1]}${offsetMatch[2].padStart(2, '0')}:${(offsetMatch[3] || '0').padStart(2, '0')}`
    : '+00:00';
  return new Date(`${dateKey}T00:00:00${offset}`).getTime();
}

function parseSummaryDateKey(date: number | string, timeZone: string = DEFAULT_TIMEZONE): string | null {
  if (typeof date === 'number') {
    const d = new Date(date < 10000000000 ? date * 1000 : date);
    if (isNaN(d.getTime())) return null;
    return toLocalDateKey(d, timeZone);
  }
  const dateStr = String(date).trim().replace(/\//g, '-');
  const plainDateMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (plainDateMatch) {
    const [, year, month, day] = plainDateMatch;
    const normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const validationDate = new Date(`${normalizedDate}T12:00:00Z`);
    if (!isNaN(validationDate.getTime())) {
      return normalizedDate;
    }
    return null;
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return toLocalDateKey(d, timeZone);
}

function getMonday(date: Date, timeZone: string = DEFAULT_TIMEZONE): Date {
  let formatter = formatters.monday.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
      timeZone
    });
    formatters.monday.set(timeZone, formatter);
  }

  const parts = formatter.formatToParts(date);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '2024');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '1') - 1;
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');

  const localDate = new Date(year, month, day);
  const dayOfWeek = localDate.getDay();

  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(localDate);
  monday.setDate(localDate.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);

  return monday;
}

function calcDaysSince(createdAt: Date, timeZone: string = DEFAULT_TIMEZONE): number {
  const todayKey = toLocalDateKey(new Date(), timeZone);
  const createdKey = toLocalDateKey(createdAt, timeZone);
  const diffMs = new Date(todayKey).getTime() - new Date(createdKey).getTime();
  return Math.max(0, Math.floor(diffMs / MS_PER_DAY));
}

function resolveTierIndex(rawAny: any, rawData: DuolingoRawUser): number {
  if (rawAny._leaderboardTier !== undefined && rawAny._leaderboardTier >= 0) return rawAny._leaderboardTier;

  const lb = rawAny._leaderboard as any;
  if (lb !== undefined && lb !== null) {
    if (lb.active_leaderboard?.tier !== undefined) return lb.active_leaderboard.tier;
    if (lb.tier !== undefined && lb.tier >= 0) return lb.tier;
    if (lb.data?.tier !== undefined) return lb.data.tier;
    if (Array.isArray(lb.ranked_users) && lb.ranked_users[0]?.tier !== undefined)
      return lb.ranked_users[0].tier;
  }
  if (rawAny.tier !== undefined && rawAny.tier >= 0 && rawAny.tier <= 10) return rawAny.tier;
  if (rawAny.trackingProperties?.league_tier !== undefined) return rawAny.trackingProperties.league_tier;
  if (rawAny.trackingProperties?.leaderboard_league !== undefined) return rawAny.trackingProperties.leaderboard_league;
  if (rawAny.tracking_properties?.league_tier !== undefined) return rawAny.tracking_properties.league_tier;
  if (rawAny.tracking_properties?.leaderboard_league !== undefined) return rawAny.tracking_properties.leaderboard_league;
  if (rawData.language_data) {
    const currentLang = Object.values(rawData.language_data).find((l: any) => l.current_learning) as any;
    if (currentLang?.tier !== undefined) return currentLang.tier;
  }
  return -1;
}

function parseCreationDate(
  creationTs: number | undefined,
  created: string | undefined,
  timeZone: string = DEFAULT_TIMEZONE,
): { dateStr: string; ageDays: number } {
  if (creationTs) {
    const ts = creationTs < 10000000000 ? creationTs * 1000 : creationTs;
    const cDate = new Date(ts);
    if (!isNaN(cDate.getTime())) {
      return {
        dateStr: cDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone }),
        ageDays: calcDaysSince(cDate, timeZone)
      };
    }
  }
  if (created) {
    const cDate = new Date(created);
    if (!isNaN(cDate.getTime())) {
      return {
        dateStr: cDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone }),
        ageDays: calcDaysSince(cDate, timeZone)
      };
    }
  }
  return { dateStr: "未知", ageDays: 0 };
}

function resolveStreakExtendedTime(
  streakExtendedToday: boolean,
  rawAny: any,
  rawData: DuolingoRawUser,
  localTodayStart: number,
  timeZone: string = DEFAULT_TIMEZONE,
): string | undefined {
  if (!streakExtendedToday) return undefined;

  if (rawAny.streakData?.currentStreak?.lastExtendedDate) {
    return new Date(rawAny.streakData.currentStreak.lastExtendedDate)
      .toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', timeZone });
  }

  if (rawData.calendar?.length) {
    const todayStr = toLocalDateKey(new Date(), timeZone);
    const todayEvents = rawData.calendar
      .filter(e => e && e.datetime && toLocalDateKey(new Date(e.datetime), timeZone) === todayStr)
      .sort((a, b) => a.datetime - b.datetime);
    if (todayEvents.length > 0) {
      return new Date(todayEvents[0].datetime)
        .toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', timeZone });
    }
  }

  if (rawAny.xpGains?.length) {
    const todayGains = rawAny.xpGains
      .filter((g: any) => g && typeof g.time === 'number' && g.time * 1000 >= localTodayStart)
      .sort((a: any, b: any) => a.time - b.time);
    if (todayGains.length > 0) {
      return new Date(todayGains[0].time * 1000)
        .toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', timeZone });
    }
  }

  return undefined;
}

function sumPoints(items: Array<{ points?: number; xp?: number }> | undefined): number {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (item.points || item.xp || 0), 0);
}

export function transformDuolingoData(rawData: DuolingoRawUser, rawTimeZone: string = DEFAULT_TIMEZONE): UserData {
  if (!rawData || typeof rawData !== 'object') {
    throw new TypeError('transformDuolingoData: 输入必须是有效的用户数据对象');
  }

  const timeZone = sanitizeTimeZone(rawTimeZone);
  const rawAny = rawData as any;
  const streak = rawData.site_streak ?? rawData.streak ?? 0;

  const gems: number = rawAny._inventoryGems ?? rawAny._fieldsData?.gems ?? rawAny._inventory?.gems
    ?? rawAny._inventory?.lingots ?? rawAny._inventory?.gem_count
    ?? rawData.gemsTotalCount ?? rawData.totalGems ?? rawData.gems
    ?? rawData.tracking_properties?.gems ?? rawData.lingots ?? rawData.rupees ?? 0;

  let totalXp = rawAny._amebaData?.totalXp ?? rawData.totalXp ?? rawData.total_xp ?? 0;

  const dailyGoal = rawData.dailyGoal ?? rawData.daily_goal ?? rawData.xpGoal ?? 0;
  const creationTs = rawData.creation_date || rawData.creationDate;

  let courses: Course[] = [];

  // --- Ameba Data Parsing (New Subjects Support) ---
  const amebaData = rawAny._amebaData;
  if (amebaData?.courses?.length) {
    courses = amebaData.courses.map((c: any) => {
      const subject = String(c.subject || '').toLowerCase();
      let title = c.title;
      if (subject) {
        if (subject === 'chess') title = '国际象棋';
        else if (subject === 'math') title = '数学';
        else if (subject === 'music') title = '音乐';
      } else if (title === '国际象棋') {
        title = 'Chess';
      }

      // Time spent extraction (from Ameba structure)
      let timeSpent = c.timeSpent || c.duration || 0;
      // If duration is in ms, convert to seconds
      if (timeSpent > 1000000) timeSpent = Math.floor(timeSpent / 1000);

      return {
        title: title || c.learningLanguage || subject,
        xp: c.xp || c.points || 0,
        fromLanguage: c.fromLanguage,
        learningLanguage: c.learningLanguage,
        crowns: c.crowns || 0,
        id: c.id || c.courseId,
        subject: subject,
        timeSpent: Math.floor(timeSpent / 60), // Store in minutes
      };
    });
  }

  // Fallback and legacy courses (Merge with Ameba courses if not already present)
  if (rawData.courses?.length) {
    rawData.courses.forEach((c: any) => {
      const exists = courses.some(ac => 
        (ac.id && c.id && ac.id === c.id) || 
        (ac.learningLanguage === c.learningLanguage && ac.fromLanguage === c.fromLanguage)
      );
      if (!exists && ((c.xp || c.points || 0) > 0 || c.current_learning)) {
        const subject = String(c.subject || '').toLowerCase();
        let title = c.title;
        if (subject === 'chess') title = '国际象棋';
        else if (subject === 'math') title = '数学';
        else if (subject === 'music') title = '音乐';
        else if (title === '国际象棋') title = 'Chess';

        courses.push({
          title: title || c.learningLanguage,
          xp: c.xp || c.points || 0,
          fromLanguage: c.fromLanguage,
          learningLanguage: c.learningLanguage,
          crowns: c.crowns || 0,
          id: c.id,
          subject: subject
        });
      }
    });
  }

  if (rawAny.languages?.length) {
    const v1Courses = rawAny.languages
      .filter((l: any) => l.points > 0 || l.current_learning)
      .map((l: any) => ({
        id: l.language,
        title: l.language_string,
        xp: l.points || 0,
        crowns: l.crowns || 0,
        fromLanguage: 'en',
        learningLanguage: l.language,
      }));

    for (const v1c of v1Courses) {
      const exists = courses.some(c =>
        c.title === v1c.title ||
        c.learningLanguage === v1c.learningLanguage ||
        (c.id && v1c.id && v1c.id.length > 0 && c.id.includes(v1c.id))
      );
      if (!exists) courses.push(v1c);
    }
  }

  if (courses.length === 0 && rawData.language_data) {
    courses = Object.entries(rawData.language_data)
      .filter(([_, langDetail]: [string, any]) => {
        const xp = langDetail.points || langDetail.level_progress || 0;
        return xp > 0 || langDetail.current_learning;
      })
      .map(([langCode, langDetail]: [string, any]) => {
        let crowns = langDetail.crowns || 0;
        if (crowns === 0 && langDetail.skills?.length) {
          crowns = langDetail.skills.reduce((acc: number, skill: any) =>
            acc + (skill.levels_finished || skill.crowns || skill.finishedLevels || 0), 0);
        }
        return {
          id: langDetail.learning_language || langCode,
          title: langDetail.language_string === '国际象棋' ? 'Chess' : langDetail.language_string,
          xp: langDetail.points || langDetail.level_progress || 0,
          crowns,
          fromLanguage: langDetail.from_language || 'en',
          learningLanguage: langDetail.learning_language || langCode,
        };
      });
  }

  const coursesXpSum = courses.reduce((sum, c) => sum + (c.xp || 0), 0);
  totalXp = Math.max(totalXp, coursesXpSum);

  let learningLanguage = "None";
  if (rawData.language_data) {
    const current = Object.values(rawData.language_data).find(l => l.current_learning);
    learningLanguage = current?.language_string ?? courses[0]?.title ?? "None";
  } else if (rawData.currentCourse) {
    learningLanguage = rawData.currentCourse.title;
  } else if (courses.length > 0) {
    learningLanguage = courses[0].title;
  }
  if (learningLanguage === '国际象棋') {
    learningLanguage = 'Chess';
  }

  const xpByDate = new Map<string, number>();
  const timeByDate = new Map<string, number>();

  function addCalendarEvent(event: { datetime: number; improvement?: number }): void {
    if (!event || !event.datetime) return;
    const d = new Date(event.datetime);
    if (isNaN(d.getTime())) return;
    const dateKey = toLocalDateKey(d, timeZone);
    const improvement = event.improvement || 0;
    xpByDate.set(dateKey, (xpByDate.get(dateKey) || 0) + improvement);
    timeByDate.set(dateKey, (timeByDate.get(dateKey) || 0) + Math.ceil((improvement || 10) / 3));
  }

  if (rawAny._xpSummaries?.length) {
    for (const summary of rawAny._xpSummaries) {
      const dateKey = parseSummaryDateKey(summary.date, timeZone);
      if (!dateKey) continue;

      const gainedXp = summary.gainedXp ?? summary.gained_xp ?? 0;
      xpByDate.set(dateKey, gainedXp);

      const sessionTimeSeconds = summary.totalSessionTime ?? summary.total_session_time ?? 0;
      const minutes = Math.round(sessionTimeSeconds / 60);
      timeByDate.set(dateKey, minutes);
    }
  } else if (rawData.calendar?.length) {
    rawData.calendar.forEach(addCalendarEvent);
  } else if (rawData.language_data) {
    Object.values(rawData.language_data).forEach((lang: any) => {
      if (lang.calendar?.length) lang.calendar.forEach(addCalendarEvent);
    });
  }



  // 1. Determine official total XP as the sum of daily histories (xpByDate)
  let totalXpSum = 0;
  xpByDate.forEach(xp => { totalXpSum += xp; });

  // 2. Determine official total minutes
  const coursesTimeSum = courses.reduce((sum, c) => sum + (c.timeSpent || 0), 0);
  let totalMinutes = coursesTimeSum;
  let hasRealTimeData = totalMinutes > 0;

  if (!hasRealTimeData) {
    let dailyTimeSum = 0;
    timeByDate.forEach(t => { dailyTimeSum += t; });
    totalMinutes = dailyTimeSum;
    hasRealTimeData = totalMinutes > 0;
  }

  // Fallback: if totalMinutes is 0, estimate it from totalXp
  if (totalMinutes === 0 && totalXp > 0) {
    totalMinutes = Math.ceil(totalXp / 3);
    hasRealTimeData = true;
  }



  const dailyXpHistory: { date: string; xp: number }[] = [];
  const dailyTimeHistory: { date: string; time: number }[] = [];
  const today = new Date();
  const dailyRangeEnd = getStartOfDayInTimezone(today, timeZone);
  const dayLabelFormatter = new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    timeZone,
  });

  for (let i = 6; i >= 0; i--) {
    const d = new Date(dailyRangeEnd - i * MS_PER_DAY);
    const dateKey = toLocalDateKey(d, timeZone);
    const dayLabel = dayLabelFormatter.format(d);
    dailyXpHistory.push({ date: dayLabel, xp: xpByDate.get(dateKey) || 0 });
    dailyTimeHistory.push({ date: dayLabel, time: timeByDate.get(dateKey) || 0 });
  }

  const weeklyXpHistory: { date: string; xp: number; isFuture: boolean }[] = [];
  const weeklyTimeHistory: { date: string; time: number; isFuture: boolean }[] = [];
  const monday = getMonday(today, timeZone);
  const weekStart = getStartOfDayInTimezone(monday, timeZone);
  const todayDateKey = toLocalDateKey(today, timeZone);

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart + i * MS_PER_DAY);
    const dateKey = toLocalDateKey(d, timeZone);
    const dayLabel = dayLabelFormatter.format(d);
    const isFuture = dateKey > todayDateKey;

    weeklyXpHistory.push({
      date: dayLabel,
      xp: isFuture ? 0 : (xpByDate.get(dateKey) || 0),
      isFuture
    });
    weeklyTimeHistory.push({
      date: dayLabel,
      time: isFuture ? 0 : (timeByDate.get(dateKey) || 0),
      isFuture
    });
  }

  const yearlyXpHistory: { date: string; xp: number; time?: number }[] = [];
  xpByDate.forEach((xp, date) => yearlyXpHistory.push({ date, xp, time: timeByDate.get(date) }));

  const monthlyXpHistory = generateMonthlyXpHistory(xpByDate);

  const tierIndex = resolveTierIndex(rawAny, rawData);
  const leagueName = (tierIndex >= 0 && tierIndex < LEAGUE_TIERS.length)
    ? LEAGUE_TIERS[tierIndex] : "—";

  const { dateStr: creationDateStr, ageDays: accountAgeDays } = parseCreationDate(creationTs, rawData.created, timeZone);

  const hasInventoryPremium = rawAny.inventory?.premium_subscription || rawAny.inventory?.super_subscription;
  const hasItemPremium = rawAny.has_item_premium_subscription || rawAny.has_item_immersive_subscription;
  const isPlus = !!(rawData.hasPlus || rawData.hasSuper || rawData.plusStatus === 'active' || rawAny.has_plus || rawAny.is_plus || hasInventoryPremium || hasItemPremium);

  // totalMinutes and hasRealTimeData are already calculated and calibrated above

  const estimatedLearningTime = hasRealTimeData
    ? `${Math.floor(totalMinutes / 60)}小时 ${totalMinutes % 60}分钟`
    : '暂无数据';

  let xpToday = 0;
  let lessonsToday = 0;
  const streakExtendedToday = rawAny.streak_extended_today ?? rawAny.streakExtendedToday ?? false;

  const now = new Date();
  const localTodayStart = getStartOfDayInTimezone(now, timeZone);
  const localTodayEnd = localTodayStart + MS_PER_DAY;
  const localTodayDateKey = toLocalDateKey(now, timeZone);

  const streakExtendedTime = resolveStreakExtendedTime(streakExtendedToday, rawAny, rawData, localTodayStart, timeZone);

  if (rawAny._xpSummaries?.length) {
    const todaySummary = rawAny._xpSummaries.find((s: any) =>
      parseSummaryDateKey(s.date, timeZone) === localTodayDateKey
    );
    if (todaySummary) {
      xpToday = todaySummary.gainedXp ?? todaySummary.gained_xp ?? 0;
      lessonsToday = todaySummary.numSessions ?? 0;
    }
  }

  if (xpToday === 0) {
    const todayXpFromHistory = xpByDate.get(localTodayDateKey) || 0;

    if (rawAny.xp_today !== undefined) {
      xpToday = rawAny.xp_today;
    } else if (todayXpFromHistory > 0) {
      xpToday = todayXpFromHistory;
    } else if (rawAny.streakData?.currentStreak?.endDate) {
      const streakEndTs = new Date(rawAny.streakData.currentStreak.endDate).getTime();
      if (streakEndTs >= localTodayStart && streakEndTs < localTodayEnd) {
        xpToday = rawAny.streakData.currentStreak.lastExtendedDate ? 1 : 0;
      }
    } else if (rawData.calendar?.length) {
      const todayEvents = rawData.calendar.filter(e =>
        e.datetime >= localTodayStart && e.datetime < localTodayEnd
      );
      xpToday = todayEvents.reduce((acc, e) => acc + (e.improvement || 0), 0);
      if (lessonsToday === 0) lessonsToday = todayEvents.length;
    }
  }

  if (xpToday === 0 && rawAny.xpGains?.length) {
    const todayGains = rawAny.xpGains.filter((g: any) => {
      const gainTs = g.time * 1000;
      return gainTs >= localTodayStart && gainTs < localTodayEnd;
    });
    xpToday = todayGains.reduce((acc: number, g: any) => acc + (g.xp || 0), 0);
    if (lessonsToday === 0) lessonsToday = todayGains.length;
  }

  return {
    streak, totalXp, gems,
    league: leagueName, leagueTier: tierIndex, courses, dailyXpHistory,
    dailyTimeHistory, yearlyXpHistory, monthlyXpHistory,
    weeklyXpHistory, weeklyTimeHistory,
    learningLanguage, creationDate: creationDateStr, accountAgeDays,
    isPlus, dailyGoal, estimatedLearningTime,
    xpToday,
    lessonsToday: lessonsToday || undefined,
    streakExtendedToday,
    streakExtendedTime,
    weeklyXp: rawAny.weeklyXp,
    numSessionsCompleted: rawAny.numSessionsCompleted,
    streakFreezeCount: rawAny.streakFreezeCount
  };
}

function generateMonthlyXpHistory(xpByDate: Map<string, number>): { date: string; xp: number }[] {
  const monthlyData = new Map<string, number>();
  const today = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyData.set(monthKey, 0);
  }

  xpByDate.forEach((xp, dateStr) => {
    const monthKey = dateStr.substring(0, 7);
    if (monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + xp);
    }
  });

  const result: { date: string; xp: number }[] = [];
  monthlyData.forEach((xp, monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const label = date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' });
    result.push({ date: label, xp });
  });

  return result;
}

export async function fetchDuolingoData(username: string): Promise<UserData> {
  const trimmedUsername = username.trim();
  const timeZone = getBrowserTimeZone();

  if (!trimmedUsername) {
    throw new Error('Username is required');
  }

  const response = await fetch('/api/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-timezone': timeZone,
    },
    body: JSON.stringify({ username: trimmedUsername }),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Fetch failed');
  }

  return result.data as UserData;
}
