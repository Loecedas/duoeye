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

  const lb = (rawAny._leaderboardHistory || rawAny._leaderboard) as any;
  if (lb !== undefined && lb !== null) {
    if (lb.active_leaderboard?.tier !== undefined) return lb.active_leaderboard.tier;
    if (lb.tier !== undefined && lb.tier >= 0) return lb.tier;
    if (lb.data?.tier !== undefined) return lb.data.tier;
    if (Array.isArray(lb.ranked_users) && lb.ranked_users[0]?.tier !== undefined)
      return lb.ranked_users[0].tier;
  }
  if (rawAny.tier !== undefined && rawAny.tier >= 0 && rawAny.tier <= 10) return rawAny.tier;
  if (rawData.trackingProperties?.league_tier !== undefined) return rawData.trackingProperties.league_tier;
  if (rawData.trackingProperties?.leaderboard_league !== undefined) return rawData.trackingProperties.leaderboard_league;
  if (rawData.tracking_properties?.league_tier !== undefined) return rawData.tracking_properties.league_tier;
  if (rawData.tracking_properties?.leaderboard_league !== undefined) return rawData.tracking_properties.leaderboard_league;
  return -1;
}

function parseCreationDate(
  creationDate: number | string | undefined,
  timeZone: string = DEFAULT_TIMEZONE,
): { dateStr: string; ageDays: number } {
  if (!creationDate) {
    return { dateStr: "未知", ageDays: 0 };
  }
  let cDate: Date;
  if (typeof creationDate === 'number') {
    const ts = creationDate < 10000000000 ? creationDate * 1000 : creationDate;
    cDate = new Date(ts);
  } else {
    cDate = new Date(creationDate);
  }
  if (!isNaN(cDate.getTime())) {
    return {
      dateStr: cDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone }),
      ageDays: calcDaysSince(cDate, timeZone)
    };
  }
  return { dateStr: "未知", ageDays: 0 };
}

function resolveStreakExtendedTime(
  streakExtendedToday: boolean,
  rawAny: any,
  timeZone: string = DEFAULT_TIMEZONE,
): string | undefined {
  if (!streakExtendedToday) return undefined;

  if (rawAny.streakData?.currentStreak?.lastExtendedDate) {
    const extDate = new Date(rawAny.streakData.currentStreak.lastExtendedDate);
    if (!isNaN(extDate.getTime())) {
      return extDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', timeZone });
    }
  }

  return undefined;
}

function normalizeSubjectAndTitle(rawCourse: any): { subject?: string; title: string } {
  const rawSubject = String(rawCourse.subject || '').toLowerCase().trim();
  const rawLearningLang = String(rawCourse.learningLanguage || '').toLowerCase().trim();
  const rawId = String(rawCourse.id || '').toLowerCase().trim();
  const rawTitle = String(rawCourse.title || '').trim();

  let subject: string | undefined = undefined;

  if (
    rawSubject === 'chess' ||
    rawLearningLang === 'chess' ||
    rawId.includes('chess') ||
    rawTitle.toLowerCase() === 'chess' ||
    rawTitle === '国际象棋'
  ) {
    subject = 'chess';
  } else if (
    rawSubject === 'math' ||
    rawLearningLang === 'math' ||
    rawId.includes('math') ||
    rawTitle.toLowerCase() === 'math' ||
    rawTitle === '数学'
  ) {
    subject = 'math';
  } else if (
    rawSubject === 'music' ||
    rawLearningLang === 'music' ||
    rawId.includes('music') ||
    rawTitle.toLowerCase() === 'music' ||
    rawTitle === '音乐'
  ) {
    subject = 'music';
  } else if (rawSubject) {
    subject = rawSubject;
  }

  let title = rawTitle;
  if (subject === 'chess') {
    title = '国际象棋';
  } else if (subject === 'math') {
    title = '数学';
  } else if (subject === 'music') {
    title = '音乐';
  } else if (!title) {
    title = rawCourse.learningLanguage || subject || '未知科目';
  }

  return { subject, title };
}

function parseCourseItem(rawCourse: any): Course | null {
  if (!rawCourse || typeof rawCourse !== 'object') return null;

  const xp = Number(rawCourse.xp || rawCourse.points || 0);
  const isCurrent = Boolean(rawCourse.current_learning || rawCourse.isCurrent);

  if (xp <= 0 && !isCurrent) {
    return null;
  }

  const { subject, title } = normalizeSubjectAndTitle(rawCourse);

  let rawTime = Number(rawCourse.timeSpent || rawCourse.duration || 0);
  if (rawTime > 1000000) {
    rawTime = Math.floor(rawTime / 1000);
  }
  const timeSpentMinutes = Math.floor(rawTime / 60);

  return {
    id: String(rawCourse.id || `${rawCourse.learningLanguage || 'course'}_${rawCourse.fromLanguage || 'en'}`),
    title,
    xp,
    crowns: Number(rawCourse.crowns || 0),
    fromLanguage: rawCourse.fromLanguage || 'en',
    learningLanguage: rawCourse.learningLanguage || subject || 'unknown',
    subject,
    timeSpent: timeSpentMinutes,
  };
}

export function transformDuolingoData(rawData: DuolingoRawUser, rawTimeZone: string = DEFAULT_TIMEZONE): UserData {
  if (!rawData || typeof rawData !== 'object') {
    throw new TypeError('transformDuolingoData: 输入必须是有效的用户数据对象');
  }

  const timeZone = sanitizeTimeZone(rawTimeZone);
  const rawAny = rawData as any;
  const streak = rawData.streak ?? 0;

  const gems: number =
    rawAny.gemsTotalCount ??
    rawAny.totalGems ??
    rawAny.gems ??
    rawData.gemsTotalCount ??
    rawData.totalGems ??
    rawData.gems ??
    rawData.trackingProperties?.gems ??
    rawData.tracking_properties?.gems ??
    rawAny._inventoryGems ??
    rawAny._detailedData?.gemsTotalCount ??
    rawAny._detailedData?.totalGems ??
    rawAny._detailedData?.gems ??
    0;

  let totalXp =
    rawAny._detailedData?.totalXp ??
    rawAny._amebaData?.totalXp ??
    rawData.totalXp ??
    0;

  const dailyGoal = rawData.dailyGoal ?? rawData.xpGoal ?? 0;
  const creationDate = rawData.creationDate;

  // --- 2023 Courses Parsing (Languages & New Subjects: Chess, Math, Music) ---
  const rawCourseList: any[] = [];
  const detailedCourses = rawAny._detailedData?.courses || rawAny._amebaData?.courses;
  if (Array.isArray(detailedCourses)) {
    rawCourseList.push(...detailedCourses);
  }
  if (Array.isArray(rawData.courses)) {
    rawCourseList.push(...rawData.courses);
  }

  const courseMap = new Map<string, Course>();
  for (const rc of rawCourseList) {
    const course = parseCourseItem(rc);
    if (!course) continue;

    const key = (course.id && course.id.length > 2)
      ? course.id
      : `${course.learningLanguage}::${course.fromLanguage}`;

    const existing = courseMap.get(key);
    if (!existing) {
      courseMap.set(key, course);
    } else {
      existing.xp = Math.max(existing.xp, course.xp);
      existing.crowns = Math.max(existing.crowns, course.crowns);
      if (!existing.subject && course.subject) {
        existing.subject = course.subject;
        existing.title = course.title;
      }
      if ((course.timeSpent || 0) > (existing.timeSpent || 0)) {
        existing.timeSpent = course.timeSpent;
      }
    }
  }

  // 补充历史语言课程（2017 与 2023 互补，取长补短，保留历史重置语言）
  if (Array.isArray(rawAny.languages)) {
    for (const l of rawAny.languages) {
      if ((l.points || 0) <= 0 && !l.current_learning) continue;
      const key = l.language || l.learning_language;
      if (key && !courseMap.has(key)) {
        courseMap.set(key, {
          id: key,
          title: l.language_string || key,
          xp: l.points || 0,
          crowns: l.crowns || 0,
          fromLanguage: 'en',
          learningLanguage: key,
          timeSpent: 0,
        });
      }
    }
  }

  if (rawAny.language_data && typeof rawAny.language_data === 'object') {
    for (const [langCode, detail] of Object.entries(rawAny.language_data as Record<string, any>)) {
      const xp = detail.points || detail.level_progress || 0;
      if (xp <= 0 && !detail.current_learning) continue;
      const key = detail.learning_language || langCode;
      if (key && !courseMap.has(key)) {
        courseMap.set(key, {
          id: key,
          title: detail.language_string || key,
          xp,
          crowns: detail.crowns || 0,
          fromLanguage: detail.from_language || 'en',
          learningLanguage: key,
          timeSpent: 0,
        });
      }
    }
  }

  const courses: Course[] = Array.from(courseMap.values());
  const coursesXpSum = courses.reduce((sum, c) => sum + (c.xp || 0), 0);
  totalXp = Math.max(totalXp, coursesXpSum);

  let learningLanguage = "None";
  if (rawData.currentCourse) {
    const currentSubject = normalizeSubjectAndTitle(rawData.currentCourse);
    learningLanguage = currentSubject.title;
  } else if (courses.length > 0) {
    learningLanguage = courses[0].title;
  }

  const xpByDate = new Map<string, number>();
  const timeByDate = new Map<string, number>();

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
  }

  const now = new Date();
  const localTodayDateKey = toLocalDateKey(now, timeZone);
  const streakExtendedToday = Boolean(
    rawData.streakExtendedToday ||
    rawAny.streakData?.currentStreak?.lastExtendedDate
  );
  const streakExtendedTime = resolveStreakExtendedTime(streakExtendedToday, rawAny, timeZone);

  let xpToday = 0;
  let lessonsToday = 0;

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
    if (todayXpFromHistory > 0) {
      xpToday = todayXpFromHistory;
    }
  }

  // 保证今日数据与历史流水对齐，若流水有延迟则自动同步到今日图表
  if (xpToday > 0) {
    xpByDate.set(localTodayDateKey, Math.max(xpByDate.get(localTodayDateKey) || 0, xpToday));
  }

  // 1. Determine official total minutes from 2023 course metrics or xpSummaries
  const coursesTimeSum = courses.reduce((sum, c) => sum + (c.timeSpent || 0), 0);
  let totalMinutes = coursesTimeSum;
  let hasRealTimeData = totalMinutes > 0;

  if (!hasRealTimeData) {
    let dailyTimeSum = 0;
    timeByDate.forEach(t => { dailyTimeSum += t; });
    totalMinutes = dailyTimeSum;
    hasRealTimeData = totalMinutes > 0;
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

  const { dateStr: creationDateStr, ageDays: accountAgeDays } = parseCreationDate(creationDate, timeZone);

  const isPlus = Boolean(
    rawData.hasPlus ||
    rawData.hasSuper ||
    rawData.plusStatus === 'active' ||
    rawAny._detailedData?.hasPlus ||
    rawAny._detailedData?.hasSuper
  );

  const estimatedLearningTime = hasRealTimeData && totalMinutes > 0
    ? `${Math.floor(totalMinutes / 60)}小时 ${totalMinutes % 60}分钟`
    : '0小时 0分钟';

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
