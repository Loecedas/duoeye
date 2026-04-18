import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { UserData } from '../types';
import { Component, type ErrorInfo } from 'react';
import { toCanvas } from 'html-to-image';
import AppIcon from './AppIcon';
import DuoWordmark from './DuoWordmark';
import AchievementsSection from './achievements/AchievementsSection';
import MonthlyChart from './charts/MonthlyChart';
import WeeklyChart from './charts/WeeklyChart';
import WeeklyTimeChart from './charts/WeeklyTimeChart';
import YearlyChart from './charts/YearlyChart';
import YearlyTimeChart from './charts/YearlyTimeChart';
import HeatmapChart from './dashboard/HeatmapChart';
import DuoReview from './dashboard/DuoReview';
import LanguageDistribution from './dashboard/LanguageDistribution';
import Navbar from './dashboard/Navbar';
import TodayOverview from './dashboard/TodayOverview';
import EmojiIcon from './icons/EmojiIcon';
import {
  EmojiModeProvider,
  EMOJI_ICON_MODE_STORAGE_KEY,
  resolveEmojiIconMode,
  type EmojiIconMode,
} from './icons/EmojiMode';
import {
  THEME_STORAGE_KEY,
  applyResolvedTheme,
  getResolvedTheme,
  type ResolvedTheme,
  resolveThemeMode,
  type ThemeMode,
} from '../utils/theme';

const USERNAME_STORAGE_KEY = 'duoeye_username';
const USERDATA_STORAGE_KEY = 'duoeye_userdata';
const LAST_LOADED_AT_STORAGE_KEY = 'duoeye_last_loaded_at';
const MAX_SCREENSHOT_BYTES = 10 * 1024 * 1024;
const MAX_SCREENSHOT_CANVAS_PIXELS = 12_000_000;
const SCREENSHOT_BASE_PIXEL_RATIO = 1.6;

function getInitialEmojiIconMode(): EmojiIconMode {
  if (typeof window === 'undefined') return 'emoji';
  return resolveEmojiIconMode(window.localStorage.getItem(EMOJI_ICON_MODE_STORAGE_KEY));
}

function readStoredLoadedAt(): number | null {
  if (typeof window === 'undefined') return null;

  const rawValue =
    window.sessionStorage.getItem(LAST_LOADED_AT_STORAGE_KEY) ||
    window.localStorage.getItem(LAST_LOADED_AT_STORAGE_KEY);
  const parsedValue = Number(rawValue);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) return null;
  return parsedValue;
}

interface DuoDashAppProps {
  initialUsername?: string;
  initialUserData?: UserData | null;
  initialLoadError?: string;
}

function getMonthlyYears(data: Array<{ date: string; xp: number; time?: number }> | undefined): string[] {
  if (!data?.length) return [];

  return Array.from(new Set(data.map((item) => item.date.slice(0, 4))))
    .filter((year) => /^\d{4}$/.test(year))
    .sort((a, b) => Number(b) - Number(a));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

type WeeklyRangeMode = 'week' | 'recent7';

interface RenderBoundaryProps {
  label: string;
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
}

interface RenderBoundaryState {
  hasError: boolean;
}

class RenderBoundary extends Component<RenderBoundaryProps, RenderBoundaryState> {
  state: RenderBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RenderBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[dashboard:${this.props.label}] render failed`, error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div
        className={
          this.props.className ||
          'flex min-h-[180px] items-center justify-center rounded-[28px] border border-dashed border-black/10 bg-white/72 px-6 py-8 text-center text-sm text-apple-gray6 dark:border-white/12 dark:bg-white/6 dark:text-apple-dark6'
        }
      >
        <div>
          <div className="font-semibold text-apple-dark1 dark:text-white">{this.props.label} 暂时无法显示</div>
          <div className="mt-2">刷新页面后重试。</div>
        </div>
      </div>
    );
  }
}

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeClassName?: string;
  actions?: ReactNode;
  glowClassName?: string;
  className?: string;
  children: ReactNode;
}

interface DashboardSectionsProps {
  userData: UserData;
  isLoaded: boolean;
  selectedMonthlyYear: string;
  monthlyViewMode: 'year' | 'rolling12';
  weeklyXpRangeMode: WeeklyRangeMode;
  weeklyTimeRangeMode: WeeklyRangeMode;
  onSelectMonthlyYear: (year: string) => void;
  onSelectRollingMonths: () => void;
  onSelectWeeklyXpRangeMode: (mode: WeeklyRangeMode) => void;
  onSelectWeeklyTimeRangeMode: (mode: WeeklyRangeMode) => void;
  animated?: boolean;
}

interface ScreenshotFile {
  blob: Blob;
  extension: 'png' | 'jpg';
}

const surfaceClassName =
  'render-isolate screenshot-solid-surface relative overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,252,0.94))] shadow-[0_12px_28px_rgba(15,23,42,0.05)] dark:border-0 dark:[background-clip:border-box] dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.92),rgba(28,28,30,0.96))] dark:shadow-none';

const headerBadgeClassName =
  'inline-flex items-center rounded-full border border-black/5 bg-white/88 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-apple-gray6 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-white/20 dark:bg-white/16 dark:text-white/85';
const pageGlowBackgroundClassName =
  'absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.08),transparent_28%),linear-gradient(180deg,#fbfbfd_0%,#f5f5f7_46%,#f7f7fa_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.1),transparent_26%),linear-gradient(180deg,rgba(20,20,22,0.98)_0%,rgba(28,28,30,0.96)_48%,rgba(18,18,20,1)_100%)]';

function getHeaderActionClassName(isActive: boolean): string {
  return `inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-[transform,box-shadow,color,background-color,border-color] duration-200 ${
    isActive
      ? 'border-transparent bg-[#111827] text-white shadow-[0_8px_20px_rgba(17,24,39,0.14)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(17,24,39,0.2)] dark:bg-white dark:text-apple-dark1 dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.22)]'
      : 'border-black/5 bg-white/88 text-apple-gray6 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] hover:text-apple-dark1 dark:border-white/10 dark:bg-white/8 dark:text-apple-dark6 dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.22)] dark:hover:text-white'
  }`;
}

interface WeeklyRangeActionsProps {
  value: WeeklyRangeMode;
  onChange: (mode: WeeklyRangeMode) => void;
}

function WeeklyRangeActions({ value, onChange }: WeeklyRangeActionsProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => onChange('recent7')}
        className={`${getHeaderActionClassName(value === 'recent7')} min-w-[76px]`}
      >
        最近七天
      </button>
      <button
        type="button"
        onClick={() => onChange('week')}
        className={`${getHeaderActionClassName(value === 'week')} min-w-[58px]`}
      >
        本周
      </button>
    </>
  );
}

function DashboardCard({
  icon,
  title,
  subtitle,
  badge,
  badgeClassName,
  actions,
  glowClassName,
  className = '',
  children,
}: DashboardCardProps) {
  return (
    <section data-screenshot-lock="true" className={`group ${surfaceClassName} transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.26)] ${className}`}>
      <div
        aria-hidden="true"
        className={`screenshot-soft-glow pointer-events-none absolute inset-0 ${
          glowClassName || 'bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.58),transparent_46%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.04),transparent_42%)] dark:bg-none'
        }`}
      />

      <div className="relative flex h-full min-h-[260px] flex-col p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 items-center justify-center text-[1.35rem] leading-none transition-transform duration-200 group-hover:scale-[1.03]">
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-apple-dark1 dark:text-white">{title}</h2>
              {subtitle ? <p className="mt-1 text-sm text-apple-gray6 dark:text-white/72">{subtitle}</p> : null}
            </div>
          </div>

          {actions || badge ? (
            <div className="flex flex-wrap items-center justify-end gap-2 md:flex-nowrap">
              {actions}
              {badge ? <span className={badgeClassName || headerBadgeClassName}>{badge}</span> : null}
            </div>
          ) : null}
        </div>

        <div className="min-h-0 flex-1">
          <RenderBoundary label={title}>{children}</RenderBoundary>
        </div>
      </div>
    </section>
  );
}

function DashboardSections({
  userData,
  isLoaded,
  selectedMonthlyYear,
  monthlyViewMode,
  weeklyXpRangeMode,
  weeklyTimeRangeMode,
  onSelectMonthlyYear,
  onSelectRollingMonths,
  onSelectWeeklyXpRangeMode,
  onSelectWeeklyTimeRangeMode,
  animated = true,
}: DashboardSectionsProps) {
  const monthlyYears = getMonthlyYears(userData.yearlyXpHistory);
  const animationClass = animated ? (isLoaded ? 'animate-fade-in-up' : 'opacity-0') : '';
  const weeklyXpData =
    weeklyXpRangeMode === 'week'
      ? userData.weeklyXpHistory || []
      : (userData.dailyXpHistory || []).map((item) => ({ date: item.date, xp: item.xp }));
  const weeklyTimeData =
    weeklyTimeRangeMode === 'week'
      ? userData.weeklyTimeHistory || []
      : (userData.dailyTimeHistory || []).map((item) => ({ date: item.date, time: item.time }));

  return (
    <div data-screenshot-lock="true" className={`${animationClass} space-y-8`}>
      <section data-screenshot-lock="true" className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/88 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-apple-gray6 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/8 dark:text-apple-dark6">
            DUOEYE DASHBOARD
          </div>
          <h1 className="mt-3 text-[clamp(2rem,3vw,3rem)] font-semibold tracking-tight text-apple-dark1 dark:text-white">
            学习数据总览
          </h1>
          <p className="mt-2 text-sm text-apple-gray6 dark:text-apple-dark6">
            统一展示你的经验、时间、成就和热力分布。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={headerBadgeClassName}>{userData.learningLanguage || '未知语言'}</span>
          <span className={headerBadgeClassName}>{userData.totalXp.toLocaleString()} XP</span>
          <span className={headerBadgeClassName}>{userData.streak} 天连续学习</span>
        </div>
      </section>

      <div className={animationClass} style={animated ? { animationDelay: '0.08s' } : undefined}>
        <RenderBoundary label="今日概览">
          <TodayOverview userData={userData} />
        </RenderBoundary>
      </div>

      <div className={`grid grid-cols-1 gap-8 xl:grid-cols-12 ${animationClass}`} style={animated ? { animationDelay: '0.14s' } : undefined}>
        <div className="xl:col-span-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <DashboardCard
              icon={<EmojiIcon symbol="📈" className="text-[1.35rem] leading-none" />}
              title="本周经验"
              subtitle={weeklyXpRangeMode === 'week' ? '查看本周每日 XP 分布' : '观察最近 7 天的 XP 变化'}
              glowClassName="bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(132,204,22,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.2),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(132,204,22,0.12),transparent_46%)]"
              actions={<WeeklyRangeActions value={weeklyXpRangeMode} onChange={onSelectWeeklyXpRangeMode} />}
            >
              <WeeklyChart data={weeklyXpData} />
            </DashboardCard>

            <DashboardCard
              icon={<EmojiIcon symbol="⏱" className="text-[1.35rem] leading-none" />}
              title="本周学习时间"
              subtitle={weeklyTimeRangeMode === 'week' ? '查看本周每日学习投入' : '查看最近 7 天的学习投入'}
              glowClassName="bg-[radial-gradient(circle_at_top_left,rgba(28,176,246,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(28,176,246,0.2),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_46%)]"
              actions={<WeeklyRangeActions value={weeklyTimeRangeMode} onChange={onSelectWeeklyTimeRangeMode} />}
            >
              <WeeklyTimeChart data={weeklyTimeData} />
            </DashboardCard>

            <DashboardCard
              icon={<EmojiIcon symbol="🗓" className="text-[1.35rem] leading-none" />}
              title="月度经验对比"
              subtitle="支持查看指定年份和近 12 个月"
              glowClassName="bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.1),transparent_46%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.2),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.16),transparent_44%)]"
              className="md:col-span-2"
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onSelectRollingMonths}
                    className={getHeaderActionClassName(monthlyViewMode === 'rolling12')}
                  >
                    近 12 个月
                  </button>

                  {monthlyYears.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => onSelectMonthlyYear(year)}
                      className={getHeaderActionClassName(monthlyViewMode === 'year' && selectedMonthlyYear === year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              }
            >
              <MonthlyChart
                data={userData.yearlyXpHistory || []}
                selectedYear={selectedMonthlyYear}
                viewMode={monthlyViewMode}
              />
            </DashboardCard>

            <DashboardCard
              icon={<EmojiIcon symbol="📊" className="text-[1.35rem] leading-none" />}
              title="年度经验对比"
              subtitle="按年份查看累计 XP"
              glowClassName="bg-[radial-gradient(circle_at_top_left,rgba(165,114,247,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(165,114,247,0.2),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.14),transparent_46%)]"
              badge="历史"
              badgeClassName="inline-flex items-center rounded-full bg-[#a572f7]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#7b4bc2] dark:bg-[#a572f7]/15 dark:text-[#d6b8ff]"
            >
              <YearlyChart data={userData.yearlyXpHistory || []} />
            </DashboardCard>
 
            <DashboardCard
              icon={<EmojiIcon symbol="⌛" className="text-[1.35rem] leading-none" />}
              title="年度学习时间"
              subtitle="按年份查看累计学习时长"
              glowClassName="bg-[radial-gradient(circle_at_top_left,rgba(255,150,0,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,150,0,0.2),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_46%)]"
              badge="分钟"
              badgeClassName="inline-flex items-center rounded-full bg-[#ff9600]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#c47505] dark:bg-[#ff9600]/15 dark:text-[#ffd39a]"
            >
              <YearlyTimeChart data={userData.yearlyXpHistory || []} />
            </DashboardCard>
          </div>
        </div>

        <aside className="flex flex-col gap-8 xl:col-span-4">
          <div className={animationClass} style={animated ? { animationDelay: '0.2s' } : undefined}>
            <RenderBoundary label="语言分布">
              <LanguageDistribution courses={userData.courses} totalXp={userData.totalXp} />
            </RenderBoundary>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-1">
            <div className={animationClass} style={animated ? { animationDelay: '0.24s' } : undefined}>
              <RenderBoundary label="成就">
                <AchievementsSection userData={userData} />
              </RenderBoundary>
            </div>

            <div className={animationClass} style={animated ? { animationDelay: '0.28s' } : undefined}>
              <RenderBoundary label="AI 总结">
                <DuoReview userData={userData} />
              </RenderBoundary>
            </div>
          </div>
        </aside>
      </div>

      <section className={`deferred-section group ${surfaceClassName} transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(15,23,42,0.1)] dark:hover:shadow-[0_22px_42px_rgba(0,0,0,0.28)] ${animationClass}`} style={animated ? { animationDelay: '0.32s' } : undefined}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.08),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.14),transparent_42%)]"
        />
        <div className="relative p-6">
          <RenderBoundary label="学习热力图">
            <HeatmapChart data={userData.yearlyXpHistory || []} />
          </RenderBoundary>
        </div>
      </section>
    </div>
  );
}

export default function DuoDashApp({
  initialUsername = '',
  initialUserData = null,
  initialLoadError = '',
}: DuoDashAppProps) {
  const [userData, setUserData] = useState<UserData | null>(initialUserData);
  const [username, setUsername] = useState(initialUsername);
  const [loadError, setLoadError] = useState(initialLoadError);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [emojiIconMode, setEmojiIconMode] = useState<EmojiIconMode>(getInitialEmojiIconMode);
  const [isScreenshotting, setIsScreenshotting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastLoadedAt, setLastLoadedAt] = useState<number | null>(() => (initialUserData ? Date.now() : readStoredLoadedAt()));
  const [loading, setLoading] = useState(Boolean(initialUsername) && !initialUserData && !initialLoadError);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMonthlyYear, setSelectedMonthlyYear] = useState('');
  const [monthlyViewMode, setMonthlyViewMode] = useState<'year' | 'rolling12'>('rolling12');
  const [weeklyXpRangeMode, setWeeklyXpRangeMode] = useState<WeeklyRangeMode>('recent7');
  const [weeklyTimeRangeMode, setWeeklyTimeRangeMode] = useState<WeeklyRangeMode>('recent7');
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  function applyDashboardState(nextUserData: UserData, loadedAt: number | null): void {
    setUserData(nextUserData);
    setLoadError('');
    setLastLoadedAt(loadedAt);
  }

  function persistDashboardState(nextUserData: UserData, loadedAt = Date.now()): void {
    applyDashboardState(nextUserData, loadedAt);
    sessionStorage.setItem(USERDATA_STORAGE_KEY, JSON.stringify(nextUserData));
    localStorage.setItem(USERDATA_STORAGE_KEY, JSON.stringify(nextUserData));
    sessionStorage.setItem(LAST_LOADED_AT_STORAGE_KEY, String(loadedAt));
    localStorage.setItem(LAST_LOADED_AT_STORAGE_KEY, String(loadedAt));
  }

  function clearStoredDashboardState(): void {
    sessionStorage.removeItem(USERDATA_STORAGE_KEY);
    localStorage.removeItem(USERDATA_STORAGE_KEY);
    sessionStorage.removeItem(LAST_LOADED_AT_STORAGE_KEY);
    localStorage.removeItem(LAST_LOADED_AT_STORAGE_KEY);
  }

  async function fetchDashboardData(activeUsername: string, signal?: AbortSignal): Promise<UserData> {
    const response = await fetch(`/api/data?username=${encodeURIComponent(activeUsername)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(typeof result?.error === 'string' ? result.error : '获取学习数据失败');
    }

    return result.data;
  }

  async function reloadDashboardData(): Promise<void> {
    const activeUsername = username.trim();
    if (!activeUsername || isRefreshing) return;

    setIsRefreshing(true);

    try {
      const nextUserData = await fetchDashboardData(activeUsername);
      persistDashboardState(nextUserData);
    } catch (error) {
      window.alert('重新加载失败：' + (error instanceof Error ? error.message : '请稍后重试。'));
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();
    const storedAnimations = localStorage.getItem('duoeye_animations_enabled');
    const storedEmojiIconMode = resolveEmojiIconMode(localStorage.getItem(EMOJI_ICON_MODE_STORAGE_KEY));
    const timer = window.setTimeout(() => setIsLoaded(true), 120);

    async function bootstrap(): Promise<void> {
      const urlUsername = new URLSearchParams(window.location.search).get('username')?.trim() || '';
      const sessionUsername = sessionStorage.getItem(USERNAME_STORAGE_KEY)?.trim() || '';
      const localUsername = localStorage.getItem(USERNAME_STORAGE_KEY)?.trim() || '';
      const storedUsername = sessionUsername || localUsername;
      const activeUsername = urlUsername || storedUsername;
      const sessionUserData = sessionStorage.getItem(USERDATA_STORAGE_KEY);
      const localUserData = localStorage.getItem(USERDATA_STORAGE_KEY);
      const storedUserData = sessionUserData || localUserData;
      const hasServerData = Boolean(initialUserData);
      const hasServerError = Boolean(initialLoadError);

      setUsername(activeUsername);

      if (activeUsername) {
        sessionStorage.setItem(USERNAME_STORAGE_KEY, activeUsername);
        localStorage.setItem(USERNAME_STORAGE_KEY, activeUsername);
      }

      if (hasServerData && initialUserData) {
        if (isCancelled) return;

        persistDashboardState(initialUserData);
        setLoading(false);
        return;
      }

      if (hasServerError) {
        if (isCancelled) return;

        setUserData(null);
        setLoadError(initialLoadError);
        setLastLoadedAt(null);
        setLoading(false);
        return;
      }

      if (storedUserData && (!urlUsername || urlUsername === storedUsername)) {
        try {
          if (isCancelled) return;

          applyDashboardState(JSON.parse(storedUserData), readStoredLoadedAt());
          setLoading(false);
          return;
        } catch {
          clearStoredDashboardState();
        }
      }

      if (!activeUsername) {
        if (isCancelled) return;

        setLastLoadedAt(null);
        setLoading(false);
        return;
      }

      try {
        const nextUserData = await fetchDashboardData(activeUsername, controller.signal);

        if (isCancelled) return;

        persistDashboardState(nextUserData);
      } catch (error) {
        if (controller.signal.aborted || isCancelled) return;

        clearStoredDashboardState();
        setUserData(null);
        setLoadError(error instanceof Error ? error.message : '获取学习数据失败');
        setLastLoadedAt(null);
      } finally {
        if (isCancelled) return;
        setLoading(false);
      }
    }

    if (storedAnimations === 'false') {
      setAnimationsEnabled(false);
      document.documentElement.classList.add('animations-off');
    }

    const initialThemeMode = resolveThemeMode(localStorage.getItem(THEME_STORAGE_KEY));
    const initialResolvedTheme = getResolvedTheme(initialThemeMode);
    setThemeMode(initialThemeMode);
    setResolvedTheme(initialResolvedTheme);
    setEmojiIconMode(storedEmojiIconMode);
    applyResolvedTheme(initialResolvedTheme);
    bootstrap();

    return () => {
      isCancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('animations-off', !animationsEnabled);
    localStorage.setItem('duoeye_animations_enabled', String(animationsEnabled));
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem(EMOJI_ICON_MODE_STORAGE_KEY, emojiIconMode);
  }, [emojiIconMode]);

  useEffect(() => {
    const years = getMonthlyYears(userData?.yearlyXpHistory);
    if (!years.length) {
      if (selectedMonthlyYear) setSelectedMonthlyYear('');
      return;
    }

    if (!years.includes(selectedMonthlyYear)) {
      setSelectedMonthlyYear(years[0]);
    }
  }, [selectedMonthlyYear, userData]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function syncTheme(): void {
      const nextResolvedTheme = getResolvedTheme(themeMode);
      setResolvedTheme(nextResolvedTheme);
      applyResolvedTheme(nextResolvedTheme);
    }

    syncTheme();
    mediaQuery.addEventListener('change', syncTheme);
    return () => mediaQuery.removeEventListener('change', syncTheme);
  }, [themeMode]);

  function handleThemeChange(mode: ThemeMode): void {
    setThemeMode(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }

  function toggleAnimations(): void {
    setAnimationsEnabled((current) => !current);
  }

  function toggleEmojiIconMode(): void {
    setEmojiIconMode((current) => (current === 'emoji' ? 'svg' : 'emoji'));
  }

  function getScreenshotFileName(): string {
    const rawName = userData?.learningLanguage || 'dashboard';
    const safeName = rawName.replace(/[\\/:*?"<>|]+/g, '-').trim() || 'dashboard';
    return `duoeye-${safeName}-${Date.now()}`;
  }

  function downloadScreenshotFile(file: ScreenshotFile, fileName: string): void {
    const objectUrl = URL.createObjectURL(file.blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${fileName}.${file.extension}`;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      const isLikelyMobileBrowser = window.innerWidth < 1024 || navigator.maxTouchPoints > 0;
      if (isLikelyMobileBrowser && document.visibilityState === 'visible') {
        window.open(objectUrl, '_blank', 'noopener,noreferrer');
      }
    }, 160);

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  }

  function waitForStableFrame(delayMs = 0): Promise<void> {
    return new Promise((resolve) => {
      const run = () => window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
      if (delayMs <= 0) {
        run();
        return;
      }

      window.setTimeout(run, delayMs);
    });
  }

  function lockScreenshotLayout(rootNode: HTMLElement): () => void {
    const targets = new Set<HTMLElement>();
    const selectors = ['[data-screenshot-lock="true"]', '.recharts-responsive-container', '.recharts-wrapper', '.recharts-surface'];

    if (rootNode.matches('[data-screenshot-lock="true"]')) {
      targets.add(rootNode);
    }

    selectors.forEach((selector) => {
      rootNode.querySelectorAll(selector).forEach((node) => {
        if (node instanceof HTMLElement) {
          targets.add(node);
        }
      });
    });

    const snapshots = Array.from(targets).map((node) => ({
      node,
      style: node.getAttribute('style'),
      width: Math.ceil(node.getBoundingClientRect().width),
      height: Math.ceil(node.getBoundingClientRect().height),
    }));

    snapshots.forEach(({ node, width, height }) => {
      if (!width || !height) return;

      node.style.width = `${width}px`;
      node.style.minWidth = `${width}px`;
      node.style.maxWidth = `${width}px`;
      node.style.height = `${height}px`;
      node.style.minHeight = `${height}px`;
      node.style.maxHeight = `${height}px`;
    });

    return () => {
      snapshots.forEach(({ node, style }) => {
        if (style === null) {
          node.removeAttribute('style');
          return;
        }

        node.setAttribute('style', style);
      });
    };
  }

  function canvasToBlob(canvas: HTMLCanvasElement, type: 'image/png' | 'image/jpeg', quality?: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error('截图导出失败'));
      }, type, quality);
    });
  }

  function createScaledCanvas(sourceCanvas: HTMLCanvasElement, scale: number): HTMLCanvasElement {
    if (scale === 1) return sourceCanvas;

    const width = Math.max(1, Math.round(sourceCanvas.width * scale));
    const height = Math.max(1, Math.round(sourceCanvas.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('截图导出失败');
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(sourceCanvas, 0, 0, width, height);
    return canvas;
  }

  function getScreenshotPixelRatio(captureWidth: number, captureHeight: number): number {
    const viewportRatio = Math.max(window.devicePixelRatio || 1, 1);
    const preferredRatio = Math.min(viewportRatio, SCREENSHOT_BASE_PIXEL_RATIO);
    const area = Math.max(captureWidth * captureHeight, 1);
    const areaLimitedRatio = Math.sqrt(MAX_SCREENSHOT_CANVAS_PIXELS / area);
    return clamp(Math.min(preferredRatio, areaLimitedRatio), 1, SCREENSHOT_BASE_PIXEL_RATIO);
  }

  async function exportScreenshotWithinLimit(sourceCanvas: HTMLCanvasElement): Promise<ScreenshotFile> {
    const basePng = await canvasToBlob(sourceCanvas, 'image/png');
    if (basePng.size <= MAX_SCREENSHOT_BYTES) {
      return { blob: basePng, extension: 'png' };
    }

    const estimatedScale = clamp(Math.sqrt(MAX_SCREENSHOT_BYTES / basePng.size) * 0.96, 0.45, 0.92);
    const scaledCanvas = createScaledCanvas(sourceCanvas, estimatedScale);
    const scaledPng = await canvasToBlob(scaledCanvas, 'image/png');
    if (scaledPng.size <= MAX_SCREENSHOT_BYTES) {
      return { blob: scaledPng, extension: 'png' };
    }

    const jpegBlob = await canvasToBlob(scaledCanvas, 'image/jpeg', 0.86);
    if (jpegBlob.size <= MAX_SCREENSHOT_BYTES) {
      return { blob: jpegBlob, extension: 'jpg' };
    }

    const fallbackScale = clamp(estimatedScale * 0.86, 0.36, 0.84);
    const fallbackCanvas = createScaledCanvas(sourceCanvas, fallbackScale);
    const fallbackBlob = await canvasToBlob(fallbackCanvas, 'image/jpeg', 0.78);

    return { blob: fallbackBlob, extension: 'jpg' };
  }

  function identifyDeviceType(): 'mobile' | 'tablet' | 'laptop' | 'desktop' {
    const width = window.innerWidth;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    if (width <= 1536) return 'laptop';
    return isTouch ? 'tablet' : 'desktop';
  }

  function getStandardizedCaptureDimensions(currentWidth: number, type: 'mobile' | 'tablet' | 'laptop' | 'desktop') {
    if (type === 'mobile') {
      return { width: currentWidth < 414 ? 393 : 430 };
    }
    if (type === 'tablet') {
      return { width: 768 };
    }
    if (type === 'laptop') {
      // 对于笔记本，保持原始宽度，避免强制 1024 导致界面变窄
      return { width: currentWidth };
    }
  
  
  

    return { width: Math.min(currentWidth, 1560) };
  }

  async function handleScreenshot(): Promise<void> {
    if (!userData || !pageRef.current || isScreenshotting) return;

    const root = document.documentElement;
    const pageNode = pageRef.current;
    const fileName = getScreenshotFileName();
    const hadAnimationsDisabled = root.classList.contains('animations-off');
    const hadScreenshotMode = root.classList.contains('screenshot-mode');

    // 识别并计算标准化尺寸
    const deviceType = identifyDeviceType();
    const { width: targetWidth } = getStandardizedCaptureDimensions(window.innerWidth, deviceType);

    try {
      root.classList.add('animations-off');
      root.classList.add('screenshot-mode');
      setIsScreenshotting(true);

      // --- [鲁棒性增强: 原始样式备份序列] ---
      const originalPageStyle = pageNode.getAttribute('style');
      const navbar = document.querySelector('[data-floating-navbar="true"]') as HTMLElement | null;
      const originalNavbarStyle = navbar?.getAttribute('style') || null;

      // 临时应用标准化宽度以触发布局重绘
      pageNode.style.width = `${targetWidth}px`;
      pageNode.style.minWidth = `${targetWidth}px`;
      pageNode.style.maxWidth = `${targetWidth}px`;
      pageNode.style.margin = '0 auto';
      pageNode.style.position = 'relative';

      // 对于笔记本（宽度 1024）导出时，不强制修改导航栏宽度，保持其 100% 自适应，以避免偏移
      if (navbar && deviceType !== 'laptop') {
        navbar.style.width = `${targetWidth}px`;
        navbar.style.left = '50%';
        navbar.style.right = 'auto';
        navbar.style.transform = 'translateX(-50%)';
      }

      // 等待布局和图片资源稳定
      await waitForStableFrame(500);

      // 在标准化后的布局上通过 lockScreenshotLayout 锁定所有卡片尺寸
      const unlockScreenshotLayout = lockScreenshotLayout(pageNode);
      
      // 重新测量高度：在目标宽度下的实际内容高度
      const captureWidth = targetWidth;
      const captureHeight = Math.ceil(pageNode.scrollHeight);
      
      // 智能识别笔记本高度：如果实际高度接近 941 或处于笔记本模式，优化输出比例
      const finalCaptureHeight = (deviceType === 'laptop' && captureHeight < 1100) ? Math.max(captureHeight, 941) : captureHeight;

      const pixelRatio = getScreenshotPixelRatio(captureWidth, finalCaptureHeight);
      let screenshotFile: ScreenshotFile | null = null;

      try {
        const canvas = await toCanvas(pageNode, {
          cacheBust: true,
          pixelRatio,
          skipAutoScale: true,
          width: captureWidth,
          height: finalCaptureHeight,
          canvasWidth: Math.round(captureWidth * pixelRatio),
          canvasHeight: Math.round(finalCaptureHeight * pixelRatio),
          backgroundColor: root.classList.contains('dark') ? '#1c1c1e' : '#f5f5f7',
          filter: (domNode) => !(domNode instanceof HTMLElement && domNode.dataset.screenshotIgnore === 'true'),
          style: {
            margin: '0',
            width: `${captureWidth}px`,
            minWidth: `${captureWidth}px`,
            maxWidth: `${captureWidth}px`,
            minHeight: `${finalCaptureHeight}px`,
          },
        });
        screenshotFile = await exportScreenshotWithinLimit(canvas);
      } finally {
        unlockScreenshotLayout();
        
        // --- [鲁棒性增强: 样式完全恢复序列] ---
        if (originalPageStyle === null) {
          pageNode.removeAttribute('style');
        } else {
          pageNode.setAttribute('style', originalPageStyle);
        }

        if (navbar) {
          if (originalNavbarStyle === null) {
            navbar.removeAttribute('style');
          } else {
            navbar.setAttribute('style', originalNavbarStyle);
          }
        }
      }

      if (!screenshotFile) {
        throw new Error('截图导出失败');
      }

      downloadScreenshotFile(screenshotFile, fileName);
    } catch (error) {
      console.error('Screenshot failed:', error);
      window.alert('截图失败：' + (error instanceof Error ? error.message : '请刷新后重试。'));
    } finally {
      root.classList.toggle('animations-off', hadAnimationsDisabled);
      root.classList.toggle('screenshot-mode', hadScreenshotMode);
      window.setTimeout(() => setIsScreenshotting(false), 80);
    }
  }

  if (loading) {
    return (
      <EmojiModeProvider mode={emojiIconMode}>
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-apple-gray1 transition-colors duration-500 dark:bg-apple-dark1">
          <div className={pageGlowBackgroundClassName} />
          <div className="relative flex flex-col items-center gap-5 px-6">
            <AppIcon className="mb-3 h-32 w-32 animate-bounce sm:h-44 sm:w-44" />
            <div className="text-center">
              <p className="text-xl font-bold text-apple-dark1 dark:text-white sm:text-2xl">正在获取学习数据...</p>
              <p className="mt-2 text-sm text-apple-gray6 dark:text-apple-dark6">界面会在几秒内准备好</p>
            </div>
          </div>
        </div>
      </EmojiModeProvider>
    );
  }

  if (!userData) {
    return (
      <EmojiModeProvider mode={emojiIconMode}>
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-apple-gray1 transition-colors duration-500 dark:bg-apple-dark1">
          <div className={pageGlowBackgroundClassName} />
          <div className="relative text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/80 bg-white/88 shadow-[0_14px_32px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/8">
              <EmojiIcon symbol="📊" className="text-5xl" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-apple-dark1 dark:text-white">
              {loadError ? '学习数据加载失败' : '还没有可展示的数据'}
            </h1>
            <p className="mt-2 text-sm text-apple-gray6 dark:text-apple-dark6">
              {loadError || '先回到首页输入用户名，再生成学习面板。'}
            </p>
            {username ? <p className="mt-2 text-xs text-apple-gray6/80 dark:text-apple-dark6/80">@{username}</p> : null}
            <a
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(17,24,39,0.14)] transition-colors duration-200 dark:bg-white dark:text-apple-dark1"
            >
              返回首页
            </a>
          </div>
        </div>
      </EmojiModeProvider>
    );
  }

  return (
    <EmojiModeProvider mode={emojiIconMode}>
      <div ref={pageRef} data-screenshot-root="true" data-screenshot-lock="true" className="relative min-h-screen overflow-x-hidden bg-apple-gray1 transition-colors duration-500 dark:bg-apple-dark1">
        <div className={`screenshot-soft-glow pointer-events-none ${pageGlowBackgroundClassName}`} />

      {isScreenshotting ? (
        <div data-screenshot-ignore="true" className="fixed right-6 top-24 z-[70] rounded-[24px] border border-black/5 bg-white px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[rgba(28,28,30,0.96)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-black/8 border-t-[#58cc02] animate-spin dark:border-white/12 dark:border-t-[#58cc02]" />
            <div>
              <p className="text-sm font-semibold text-apple-dark1 dark:text-white">正在生成截图...</p>
              <p className="mt-1 text-xs text-apple-gray6 dark:text-apple-dark6">已锁定颜色与布局</p>
            </div>
          </div>
        </div>
      ) : null}

        <RenderBoundary
          label="导航栏"
          className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8"
          fallback={
            <div className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
              <div className="mx-auto flex max-w-[1560px] items-center justify-between rounded-[28px] border border-black/5 bg-[rgba(255,255,255,0.92)] px-4 py-3.5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[rgba(44,44,46,0.9)]">
                <a href="/" className="flex min-w-0 items-center gap-3">
                  <AppIcon className="h-11 w-11 shrink-0" />
                  <div className="min-w-0">
                    <DuoWordmark size="xs" className="shrink-0 overflow-visible" />
                    <div className="mt-1 text-xs text-apple-gray6 dark:text-white/55">导航栏加载失败，可先返回首页</div>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/5 bg-white/88 px-4 text-sm font-semibold text-apple-dark1 shadow-[0_6px_14px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-white/12 dark:text-white"
                >
                  刷新
                </button>
              </div>
            </div>
          }
        >
          <Navbar
            username={username}
            themeMode={themeMode}
            resolvedTheme={resolvedTheme}
            animationsEnabled={animationsEnabled}
            emojiIconMode={emojiIconMode}
            isScreenshotting={isScreenshotting}
            isRefreshing={isRefreshing}
            lastLoadedAt={lastLoadedAt}
            onThemeChange={handleThemeChange}
            onToggleAnimations={toggleAnimations}
            onToggleEmojiIconMode={toggleEmojiIconMode}
            onRefresh={reloadDashboardData}
            onScreenshot={handleScreenshot}
            onLogout={() => {
              sessionStorage.removeItem(USERNAME_STORAGE_KEY);
              sessionStorage.removeItem(USERDATA_STORAGE_KEY);
              sessionStorage.removeItem(LAST_LOADED_AT_STORAGE_KEY);
              localStorage.removeItem(USERNAME_STORAGE_KEY);
              localStorage.removeItem(USERDATA_STORAGE_KEY);
              localStorage.removeItem(LAST_LOADED_AT_STORAGE_KEY);
              window.location.assign('/');
            }}
          />
        </RenderBoundary>

        <main ref={contentRef} data-screenshot-lock="true" className="relative mx-auto max-w-[1560px] px-4 pb-10 pt-40 sm:px-6 sm:pt-32 lg:px-8 lg:pt-32">
          <DashboardSections
            userData={userData}
            isLoaded={isLoaded}
            selectedMonthlyYear={selectedMonthlyYear}
            monthlyViewMode={monthlyViewMode}
            weeklyXpRangeMode={weeklyXpRangeMode}
            weeklyTimeRangeMode={weeklyTimeRangeMode}
            onSelectMonthlyYear={(year) => {
              setSelectedMonthlyYear(year);
              setMonthlyViewMode('year');
            }}
            onSelectRollingMonths={() => setMonthlyViewMode('rolling12')}
            onSelectWeeklyXpRangeMode={setWeeklyXpRangeMode}
            onSelectWeeklyTimeRangeMode={setWeeklyTimeRangeMode}
          />
        </main>

        <footer className="render-isolate screenshot-solid-panel screenshot-disable-blur relative z-10 border-t border-black/5 bg-white/78 py-12 dark:border-white/10 dark:bg-[rgba(20,20,22,0.82)]">
          <div data-screenshot-lock="true" className="mx-auto flex w-full max-w-[1560px] flex-col items-center overflow-visible px-4 text-center sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-visible py-1">
              <AppIcon className="h-11 w-11 shrink-0" />
              <DuoWordmark size="xs" className="shrink-0 overflow-visible" />
            </div>
            <p className="mt-4 w-full max-w-[760px] text-sm leading-7 text-apple-gray6 dark:text-apple-dark6">
              多邻国学习数据可视化工具。输入用户名，快速生成和首页一致风格的数据仪表盘。
            </p>
            <p className="mt-6 text-xs text-apple-gray6/80 dark:text-apple-dark6/80">
              © {new Date().getFullYear()} DuoEye · 非官方第三方工具
            </p>
          </div>
        </footer>
      </div>
    </EmojiModeProvider>
  );
}
