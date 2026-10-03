export interface Course {
  title: string;
  xp: number;
  fromLanguage: string;
  learningLanguage: string;
  crowns: number;
  id: string;
  subject?: string;
  timeSpent?: number;
}

export interface DailyStats {
  date: string;
  xp: number;
  time: number;
}

export interface UserData {
  streak: number;
  totalXp: number;
  gems: number;
  league: string;
  leagueTier: number;
  courses: Course[];
  dailyXpHistory: { date: string; xp: number }[];
  dailyTimeHistory?: { date: string; time: number }[];
  yearlyXpHistory?: { date: string; xp: number; time?: number }[];
  monthlyXpHistory?: { date: string; xp: number }[];
  weeklyXpHistory?: { date: string; xp: number; isFuture: boolean }[];
  weeklyTimeHistory?: { date: string; time: number; isFuture: boolean }[];
  learningLanguage: string;
  creationDate: string;
  accountAgeDays: number;
  isPlus: boolean;
  dailyGoal: number;
  estimatedLearningTime: string;
  xpToday?: number;
  lessonsToday?: number;
  streakExtendedToday?: boolean;
  streakExtendedTime?: string;
  numSessionsCompleted?: number;
  streakFreezeCount?: number;
  weeklyXp?: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type AiProvider =
  | 'bigmodel'
  | 'gemini'
  | 'openrouter'
  | 'deepseek'
  | 'siliconflow'
  | 'moonshot'
  | 'zenmux'
  | 'custom';

export interface AiConfig {
  provider: AiProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export type DuolingoRawCourse = Course;

export interface DuolingoTrackingProperties {
  gems?: number;
  league_tier?: number;
  leaderboard_league?: number;
  user_id?: number;
}

export interface DuolingoStreakData {
  currentStreak?: {
    startDate?: string;
    endDate?: string;
    lastExtendedDate?: string;
    length?: number;
  };
  previousStreak?: {
    startDate?: string;
    endDate?: string;
    length?: number;
  };
}

export interface DuolingoXpSummary {
  date: number | string;
  numSessions?: number;
  gainedXp?: number;
  gained_xp?: number;
  frozen?: boolean;
  streakExtended?: boolean;
  totalSessionTime?: number;
  total_session_time?: number;
}

export interface DuolingoRawUser {
  id?: number | string;
  user_id?: number | string;
  username: string;
  name?: string;
  fullname?: string;
  picture?: string;
  avatar?: string;
  streak: number;
  totalXp?: number;
  gems?: number;
  gemsTotalCount?: number;
  totalGems?: number;
  tier?: number;
  creationDate?: number | string;
  hasPlus?: boolean;
  hasSuper?: boolean;
  plusStatus?: string;
  dailyGoal?: number;
  xpGoal?: number;
  streakExtendedToday?: boolean;
  numSessionsCompleted?: number;
  streakFreezeCount?: number;
  weeklyXp?: number;
  courses?: DuolingoRawCourse[];
  currentCourse?: DuolingoRawCourse;
  currentCourseId?: string;
  tracking_properties?: DuolingoTrackingProperties;
  trackingProperties?: DuolingoTrackingProperties;
  streakData?: DuolingoStreakData;
  _xpSummaries?: DuolingoXpSummary[];
  _leaderboardHistory?: unknown;
  _detailedData?: unknown;
  _amebaData?: unknown;
  _inventoryGems?: number;
  _fieldsData?: Record<string, unknown>;
  _leaderboardTier?: number;
}

export interface XpSummary {
  date: string;
  numSessions: number;
  gainedXp: number;
  frozen: boolean;
  streakExtended: boolean;
  totalSessionTime: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface TooltipPayload {
  payload: {
    title: string;
    xp: number;
    [key: string]: unknown;
  };
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  category: 'streak' | 'xp' | 'crowns' | 'time' | 'social' | 'special';
}

export interface LanguageDistribution {
  language: string;
  xp: number;
  percentage: number;
  crowns: number;
  level: number;
}
