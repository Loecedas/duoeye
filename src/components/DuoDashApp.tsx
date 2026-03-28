import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { UserData } from '../types';
import { Component, type ErrorInfo } from 'react';
import { toPng } from 'html-to-image';
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

type WeeklyRangeMode = 'week' | 'recent7';

interface RenderBoundaryProps {
  label: string;
  children: ReactNode;
  className?: string;
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
  icon: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeClassName?: string;
  actions?: ReactNode;
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

const surfaceClassName =
  'render-isolate screenshot-solid-surface relative overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,252,0.94))] shadow-[0_12px_28px_rgba(15,23,42,0.05)] dark:border-0 dark:[background-clip:border-box] dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.92),rgba(28,28,30,0.96))] dark:shadow-none';

const headerBadgeClassName =
  'inline-flex items-center rounded-full border border-black/5 bg-white/88 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-apple-gray6 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-white/20 dark:bg-white/16 dark:text-white/85';

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
  className = '',
  children,
}: DashboardCardProps) {
  return (
    <section data-screenshot-lock="true" className={`group ${surfaceClassName} transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.26)] ${className}`}>
      <div
        aria-hidden="true"
        className="screenshot-soft-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.58),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.04),transparent_30%)]"
      />

      <div className="relative flex h-full min-h-[260px] flex-col p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-xl shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition-transform duration-200 group-hover:scale-[1.03] dark:border-white/20 dark:bg-white/92 dark:text-apple-dark1">
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
    <div data-screenshot-lock="true" className={`${animationClass} space-y-6`}>
      <section data-screenshot-lock="true" className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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

      <div className={`grid grid-cols-1 gap-6 xl:grid-cols-12 ${animationClass}`} style={animated ? { animationDelay: '0.14s' } : undefined}>
        <div className="xl:col-span-8">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <DashboardCard
              icon="📈"
              title="本周经验"
              subtitle={weeklyXpRangeMode === 'week' ? '查看本周每日 XP 分布' : '观察最近 7 天的 XP 变化'}
              actions={<WeeklyRangeActions value={weeklyXpRangeMode} onChange={onSelectWeeklyXpRangeMode} />}
            >
              <WeeklyChart data={weeklyXpData} />
            </DashboardCard>

            <DashboardCard
              icon="⏱"
              title="本周学习时间"
              subtitle={weeklyTimeRangeMode === 'week' ? '查看本周每日学习投入' : '查看最近 7 天的学习投入'}
              actions={<WeeklyRangeActions value={weeklyTimeRangeMode} onChange={onSelectWeeklyTimeRangeMode} />}
            >
              <WeeklyTimeChart data={weeklyTimeData} />
            </DashboardCard>

            <DashboardCard
              icon="🗓"
              title="月度经验对比"
              subtitle="支持查看指定年份和近 12 个月"
              className="xl:col-span-2"
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
              icon="📊"
              title="年度经验对比"
              subtitle="按年份查看累计 XP"
              badge="历史"
              badgeClassName="inline-flex items-center rounded-full bg-[#a572f7]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#7b4bc2] dark:bg-[#a572f7]/15 dark:text-[#d6b8ff]"
            >
              <YearlyChart data={userData.yearlyXpHistory || []} />
            </DashboardCard>

            <DashboardCard
              icon="⌛"
              title="年度学习时间"
              subtitle="按年份查看累计学习时长"
              badge="分钟"
              badgeClassName="inline-flex items-center rounded-full bg-[#ff9600]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#c47505] dark:bg-[#ff9600]/15 dark:text-[#ffd39a]"
            >
              <YearlyTimeChart data={userData.yearlyXpHistory || []} />
            </DashboardCard>
          </div>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <div className={animationClass} style={animated ? { animationDelay: '0.2s' } : undefined}>
            <RenderBoundary label="语言分布">
              <LanguageDistribution courses={userData.courses} totalXp={userData.totalXp} />
            </RenderBoundary>
          </div>

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
        </aside>
      </div>

      <section className={`deferred-section group ${surfaceClassName} transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(15,23,42,0.1)] dark:hover:shadow-[0_22px_42px_rgba(0,0,0,0.28)] ${animationClass}`} style={animated ? { animationDelay: '0.32s' } : undefined}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.32),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(28,176,246,0.06),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(28,176,246,0.1),transparent_28%)]"
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
  const [isScreenshotting, setIsScreenshotting] = useState(false);
  const [loading, setLoading] = useState(Boolean(initialUsername) && !initialUserData && !initialLoadError);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMonthlyYear, setSelectedMonthlyYear] = useState('');
  const [monthlyViewMode, setMonthlyViewMode] = useState<'year' | 'rolling12'>('rolling12');
  const [weeklyXpRangeMode, setWeeklyXpRangeMode] = useState<WeeklyRangeMode>('recent7');
  const [weeklyTimeRangeMode, setWeeklyTimeRangeMode] = useState<WeeklyRangeMode>('recent7');
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();
    const storedAnimations = localStorage.getItem('duoeye_animations_enabled');
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

        setUserData(initialUserData);
        setLoadError('');
        setLoading(false);
        sessionStorage.setItem(USERDATA_STORAGE_KEY, JSON.stringify(initialUserData));
        localStorage.setItem(USERDATA_STORAGE_KEY, JSON.stringify(initialUserData));
        return;
      }

      if (hasServerError) {
        if (isCancelled) return;

        setUserData(null);
        setLoadError(initialLoadError);
        setLoading(false);
        return;
      }

      if (storedUserData && (!urlUsername || urlUsername === storedUsername)) {
        try {
          if (isCancelled) return;

          setUserData(JSON.parse(storedUserData));
          setLoadError('');
          setLoading(false);
          return;
        } catch {
          sessionStorage.removeItem(USERDATA_STORAGE_KEY);
          localStorage.removeItem(USERDATA_STORAGE_KEY);
        }
      }

      if (!activeUsername) {
        if (isCancelled) return;

        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/data?username=${encodeURIComponent(activeUsername)}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(typeof result?.error === 'string' ? result.error : '获取学习数据失败');
        }

        if (isCancelled) return;

        setUserData(result.data);
        setLoadError('');
        sessionStorage.setItem(USERDATA_STORAGE_KEY, JSON.stringify(result.data));
        localStorage.setItem(USERDATA_STORAGE_KEY, JSON.stringify(result.data));
      } catch (error) {
        if (controller.signal.aborted || isCancelled) return;

        sessionStorage.removeItem(USERDATA_STORAGE_KEY);
        localStorage.removeItem(USERDATA_STORAGE_KEY);
        setUserData(null);
        setLoadError(error instanceof Error ? error.message : '获取学习数据失败');
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

  function getScreenshotFileName(): string {
    const rawName = userData?.learningLanguage || 'dashboard';
    const safeName = rawName.replace(/[\\/:*?"<>|]+/g, '-').trim() || 'dashboard';
    return `duoeye-${safeName}-${Date.now()}`;
  }

  function downloadDataUrl(dataUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName}.png`;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      const isLikelyMobileBrowser = window.innerWidth < 1024 || navigator.maxTouchPoints > 0;
      if (isLikelyMobileBrowser && document.visibilityState === 'visible') {
        window.open(dataUrl, '_blank', 'noopener,noreferrer');
      }
    }, 160);
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

  async function handleScreenshot(): Promise<void> {
    if (!userData || !pageRef.current || isScreenshotting) return;

    const root = document.documentElement;
    const fileName = getScreenshotFileName();
    const hadAnimationsDisabled = root.classList.contains('animations-off');
    const hadScreenshotMode = root.classList.contains('screenshot-mode');

    try {
      root.classList.add('animations-off');
      root.classList.add('screenshot-mode');
      setIsScreenshotting(true);
      await waitForStableFrame(360);

      const pageNode = pageRef.current;
      const unlockScreenshotLayout = lockScreenshotLayout(pageNode);
      const captureWidth = Math.ceil(pageNode.getBoundingClientRect().width || window.innerWidth || 0);
      const captureHeight = Math.ceil(pageNode.scrollHeight);
      let dataUrl = '';

      try {
        dataUrl = await toPng(pageNode, {
          cacheBust: true,
          pixelRatio: 2,
          skipAutoScale: true,
          width: captureWidth,
          height: captureHeight,
          canvasWidth: captureWidth * 2,
          canvasHeight: captureHeight * 2,
          backgroundColor: root.classList.contains('dark') ? '#1c1c1e' : '#f5f5f7',
          filter: (domNode) => !(domNode instanceof HTMLElement && domNode.dataset.screenshotIgnore === 'true'),
          style: {
            margin: '0',
            width: `${captureWidth}px`,
            minWidth: `${captureWidth}px`,
            maxWidth: `${captureWidth}px`,
            minHeight: `${captureHeight}px`,
          },
        });
      } finally {
        unlockScreenshotLayout();
      }

      downloadDataUrl(dataUrl, fileName);
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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-apple-gray1 transition-colors duration-500 dark:bg-apple-dark1">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_22%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_20%),linear-gradient(180deg,#f8f8fb_0%,#f2f4f7_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.1),transparent_20%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_20%),linear-gradient(180deg,#141416_0%,#1c1c1e_100%)]" />
        <div className="relative flex flex-col items-center gap-5 px-6">
          <AppIcon className="mb-3 h-32 w-32 animate-bounce sm:h-44 sm:w-44" />
          <div className="text-center">
            <p className="text-xl font-bold text-apple-dark1 dark:text-white sm:text-2xl">正在获取学习数据...</p>
            <p className="mt-2 text-sm text-apple-gray6 dark:text-apple-dark6">界面会在几秒内准备好</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-apple-gray1 transition-colors duration-500 dark:bg-apple-dark1">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_22%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_20%),linear-gradient(180deg,#f8f8fb_0%,#f2f4f7_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.1),transparent_20%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_20%),linear-gradient(180deg,#141416_0%,#1c1c1e_100%)]" />
        <div className="relative text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/80 bg-white/88 shadow-[0_14px_32px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/8">
            <span className="text-5xl">📊</span>
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
    );
  }

  return (
    <div ref={pageRef} data-screenshot-root="true" data-screenshot-lock="true" className="relative min-h-screen overflow-x-hidden bg-apple-gray1 transition-colors duration-500 dark:bg-apple-dark1">
      <div className="screenshot-soft-glow pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_22%),linear-gradient(180deg,#fbfbfd_0%,rgba(245,245,247,0.72)_44%,transparent_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.1),transparent_22%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_22%),linear-gradient(180deg,rgba(28,28,30,0.94)_0%,rgba(28,28,30,0.72)_42%,transparent_100%)]" />

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
      >
        <Navbar
          username={username}
          themeMode={themeMode}
          resolvedTheme={resolvedTheme}
          animationsEnabled={animationsEnabled}
          isScreenshotting={isScreenshotting}
          onThemeChange={handleThemeChange}
          onToggleAnimations={toggleAnimations}
          onScreenshot={handleScreenshot}
          onLogout={() => {
            sessionStorage.removeItem(USERNAME_STORAGE_KEY);
            sessionStorage.removeItem(USERDATA_STORAGE_KEY);
            localStorage.removeItem(USERNAME_STORAGE_KEY);
            localStorage.removeItem(USERDATA_STORAGE_KEY);
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
          <p className="mt-4 w-full max-w-[760px] text-sm leading-7 text-apple-gray6 dark:text-apple-dark6 sm:whitespace-nowrap">
            多邻国学习数据可视化工具。输入用户名，快速生成和首页一致风格的数据仪表盘。
          </p>
          <p className="mt-6 text-xs text-apple-gray6/80 dark:text-apple-dark6/80">
            © {new Date().getFullYear()} DuoEye · 非官方第三方工具
          </p>
        </div>
      </footer>
    </div>
  );
}
