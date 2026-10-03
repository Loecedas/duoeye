import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { UserData } from '../types';
import { Component, type ErrorInfo } from 'react';
import AppIcon from './shared/AppIcon';
import DuoWordmark from './shared/DuoWordmark';
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
import SubjectDistribution from './dashboard/SubjectDistribution';
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
import { getBrowserTimeZone, isSameTimeZoneDay } from '../utils/timezone';

const USERNAME_STORAGE_KEY = 'duoeye_username';
const USERDATA_STORAGE_KEY = 'duoeye_userdata';
const LAST_LOADED_AT_STORAGE_KEY = 'duoeye_last_loaded_at';
const LAST_TIMEZONE_STORAGE_KEY = 'duoeye_last_timezone';

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

function readStoredTimeZone(): string | null {
  if (typeof window === 'undefined') return null;

  return (
    window.sessionStorage.getItem(LAST_TIMEZONE_STORAGE_KEY) ||
    window.localStorage.getItem(LAST_TIMEZONE_STORAGE_KEY)
  );
}

interface DuoDashAppProps {
  initialUsername?: string;
  initialUserData?: UserData | null;
  initialLoadError?: string;
}

function getMonthlyYears(
  data: Array<{ date: string; xp: number; time?: number }> | undefined,
  registrationYear?: number
): string[] {
  const currentYear = new Date().getFullYear();
  const yearSet = new Set<number>();

  if (data?.length) {
    data.forEach((item) => {
      const yr = Number(item.date.slice(0, 4));
      if (!Number.isNaN(yr) && yr > 2010 && yr <= currentYear) {
        yearSet.add(yr);
      }
    });
  }

  const minYear = registrationYear && registrationYear > 2010 && registrationYear <= currentYear
    ? registrationYear
    : yearSet.size > 0 ? Math.min(...yearSet) : currentYear;

  for (let y = minYear; y <= currentYear; y++) {
    yearSet.add(y);
  }

  const sorted = Array.from(yearSet).sort((a, b) => b - a);
  if (!sorted.length) sorted.push(currentYear);
  return sorted.map(String);
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
  resolvedTheme?: ResolvedTheme;
}

const surfaceClassName =
  'render-isolate relative rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,252,0.94))] shadow-[0_12px_28px_rgba(15,23,42,0.05)] dark:border-transparent dark:[background-clip:border-box] dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.92),rgba(28,28,30,0.96))] dark:shadow-none';

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
    <div className="flex items-center gap-1.5 md:max-xl:gap-1">
      <button
        type="button"
        onClick={() => onChange('recent7')}
        className={`${getHeaderActionClassName(value === 'recent7')} min-w-[78px] md:max-xl:min-w-[72px] md:max-xl:px-2 md:max-xl:text-[11px]`}
      >
        最近七天
      </button>
      <button
        type="button"
        onClick={() => onChange('week')}
        className={`${getHeaderActionClassName(value === 'week')} min-w-[54px] md:max-xl:min-w-[48px] md:max-xl:px-2 md:max-xl:text-[11px]`}
      >
        本周
      </button>
    </div>
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
    <section className={`group ${surfaceClassName} transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.26)] ${className}`}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-[inherit] ${
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
  resolvedTheme,
}: DashboardSectionsProps) {
  const registrationYear = (() => {
    const m = userData.creationDate?.match(/(\d{4})/);
    return m ? Number(m[1]) : undefined;
  })();
  const monthlyYears = getMonthlyYears(userData.yearlyXpHistory, registrationYear);
  const [isMonthlyYearPanelOpen, setIsMonthlyYearPanelOpen] = useState(false);
  const [isMonthlyViewSwitching, setIsMonthlyViewSwitching] = useState(false);
  const [monthlyMetric, setMonthlyMetric] = useState<'xp' | 'time'>('xp');
  const monthlyYearPanelRef = useRef<HTMLDivElement>(null);
  const animationClass = animated ? (isLoaded ? 'animate-fade-in-up' : 'opacity-0') : '';

  useEffect(() => {
    if (!isMonthlyYearPanelOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (monthlyYearPanelRef.current && !monthlyYearPanelRef.current.contains(e.target as Node)) {
        setIsMonthlyYearPanelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMonthlyYearPanelOpen]);

  useEffect(() => {
    if (!isMonthlyViewSwitching) return;

    let timeoutId = 0;
    let frameId = 0;
    let nestedFrameId = 0;

    frameId = window.requestAnimationFrame(() => {
      nestedFrameId = window.requestAnimationFrame(() => {
        timeoutId = window.setTimeout(() => setIsMonthlyViewSwitching(false), 220);
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(nestedFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [isMonthlyViewSwitching, monthlyViewMode]);

  const handleSelectRollingMonths = () => {
    setIsMonthlyYearPanelOpen(false);
    setIsMonthlyViewSwitching(true);
    onSelectRollingMonths();
  };

  const handleToggleMonthlyYearPanel = () => {
    if (isMonthlyViewSwitching) return;
    setIsMonthlyYearPanelOpen((open) => !open);
  };

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
        {/* Main Column: XP/Time Charts */}
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
              icon={<EmojiIcon symbol="⏳" className="text-[1.35rem] leading-none" />}
              title="本周学习时间"
              subtitle={weeklyTimeRangeMode === 'week' ? '查看本周每日学习投入' : '查看最近 7 天的学习投入'}
              glowClassName="bg-[radial-gradient(circle_at_top_left,rgba(28,176,246,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(28,176,246,0.2),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_46%)]"
              actions={<WeeklyRangeActions value={weeklyTimeRangeMode} onChange={onSelectWeeklyTimeRangeMode} />}
            >
              <WeeklyTimeChart data={weeklyTimeData} />
            </DashboardCard>

            <DashboardCard
              icon={<EmojiIcon symbol={monthlyMetric === 'xp' ? "🗓" : "⏱️"} className="text-[1.35rem] leading-none" />}
              title={monthlyMetric === 'xp' ? "月度经验对比" : "月度学习时间"}
              subtitle="支持查看指定年份和近 12 个月"
              glowClassName={monthlyMetric === 'xp'
                ? "bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.1),transparent_46%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.2),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.16),transparent_44%)]"
                : "bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.15),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(13,148,136,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(13,148,136,0.14),transparent_46%)]"
              }
              className="md:col-span-2"
              actions={
                <div className="flex flex-wrap items-center justify-end gap-1.5 md:max-xl:gap-1">
                  {/* Switch Metric Button */}
                  <button
                    type="button"
                    onClick={() => setMonthlyMetric(monthlyMetric === 'xp' ? 'time' : 'xp')}
                    className={`${getHeaderActionClassName(monthlyMetric === 'time')} md:max-xl:px-2 md:max-xl:text-[11px]`}
                  >
                    {monthlyMetric === 'xp' ? '切换为时间' : '切换为经验'}
                  </button>

                  <button
                    type="button"
                    onClick={handleSelectRollingMonths}
                    className={`${getHeaderActionClassName(monthlyViewMode === 'rolling12')} md:max-xl:px-2 md:max-xl:text-[11px]`}
                  >
                    近 12 个月
                  </button>

                  {/* Collapsible year selector */}
                  {monthlyYears.length > 0 && (
                    <div ref={monthlyYearPanelRef} className="relative">
                      <button
                        type="button"
                        onClick={handleToggleMonthlyYearPanel}
                        aria-disabled={isMonthlyViewSwitching}
                        className={`inline-flex w-[72px] items-center justify-between rounded-[12px] border px-3 py-2 text-xs font-semibold [background-clip:padding-box] transition-[transform,box-shadow,color,background-color,border-color] duration-200 ${
                          isMonthlyYearPanelOpen || (monthlyViewMode === 'year')
                            ? 'border-transparent bg-[#111827] text-white shadow-[0_10px_24px_rgba(17,24,39,0.18)] dark:bg-white dark:text-apple-dark1'
                            : 'border-black/5 bg-white/72 text-apple-gray6 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] hover:text-apple-dark1 dark:border-white/10 dark:bg-white/10 dark:text-apple-dark6 dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.22)] dark:hover:text-white'
                        } ${isMonthlyViewSwitching ? 'pointer-events-none opacity-60' : ''}`}
                      >
                        <span>{monthlyViewMode === 'year' ? selectedMonthlyYear : monthlyYears[0]}</span>
                        <svg
                          className={`h-3 w-3 shrink-0 transition-transform duration-200 ${isMonthlyYearPanelOpen ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <div
                        className={`absolute right-0 top-[calc(100%+6px)] z-30 w-[72px] overflow-y-auto overflow-x-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.15)] transition-[opacity,transform,max-height] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/10 dark:bg-[#2c2c2e] ${
                          isMonthlyYearPanelOpen ? 'max-h-[320px] opacity-100 translate-y-0' : 'pointer-events-none max-h-0 opacity-0 -translate-y-2'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 p-1.5">
                          {monthlyYears.map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() => { onSelectMonthlyYear(year); setIsMonthlyYearPanelOpen(false); }}
                              className={`w-full rounded-[10px] px-2 py-2 text-center text-xs font-semibold transition-[background-color,color] duration-150 ${
                                monthlyViewMode === 'year' && selectedMonthlyYear === year
                                  ? 'bg-[#111827] text-white dark:bg-white dark:text-apple-dark1'
                                  : 'text-apple-gray6 hover:bg-black/[0.05] hover:text-apple-dark1 dark:text-apple-dark6 dark:hover:bg-white/[0.08] dark:hover:text-white'
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              }
            >
              <MonthlyChart
                data={userData.yearlyXpHistory || []}
                selectedYear={selectedMonthlyYear}
                viewMode={monthlyViewMode}
                metric={monthlyMetric}
                isDark={resolvedTheme === 'dark'}
              />
            </DashboardCard>

            <DashboardCard
              icon={<EmojiIcon symbol="📊" className="text-[1.35rem] leading-none" />}
              title="年度经验对比"
              subtitle="按年份查看累计 XP"
              glowClassName="bg-[radial-gradient(circle_at_top_left,rgba(165,114,247,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(165,114,247,0.2),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.14),transparent_46%)]"
              badge="经验"
              badgeClassName="inline-flex items-center rounded-full bg-[#a572f7]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#7b4bc2] dark:bg-[#a572f7]/15 dark:text-[#d6b8ff]"
            >
              <YearlyChart data={userData.yearlyXpHistory || []} isDark={resolvedTheme === 'dark'} />
            </DashboardCard>
 
            <DashboardCard
              icon={<EmojiIcon symbol="⌛" className="text-[1.35rem] leading-none" />}
              title="年度学习时间"
              subtitle="按年份查看累计学习时长"
              glowClassName="bg-[radial-gradient(circle_at_top_left,rgba(255,150,0,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,150,0,0.2),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_46%)]"
              badge="分钟"
              badgeClassName="inline-flex items-center rounded-full bg-[#ff9600]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#c47505] dark:bg-[#ff9600]/15 dark:text-[#ffd39a]"
            >
              <YearlyTimeChart data={userData.yearlyXpHistory || []} isDark={resolvedTheme === 'dark'} />
            </DashboardCard>
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="flex flex-col gap-8 xl:col-span-4 xl:row-span-2 xl:h-full">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-1">
            <div className={animationClass} style={animated ? { animationDelay: '0.2s' } : undefined}>
              <RenderBoundary label="成就">
                <AchievementsSection userData={userData} />
              </RenderBoundary>
            </div>

            <div className={animationClass} style={animated ? { animationDelay: '0.24s' } : undefined}>
              <RenderBoundary label="AI 总结">
                <DuoReview userData={userData} />
              </RenderBoundary>
            </div>
          </div>

          <div className={`${animationClass} flex-grow`} style={animated ? { animationDelay: '0.28s' } : undefined}>
            <RenderBoundary label="语言分布">
              <LanguageDistribution courses={userData.courses} totalXp={userData.totalXp} />
            </RenderBoundary>
          </div>
        </aside>

        {/* Other Courses: Placed after aside to ensure stacking order on non-xl */}
        <div className="xl:col-span-8">
          <DashboardCard
            icon={<EmojiIcon symbol="🧭" className="text-[1.35rem] leading-none" />}
            title="其他课程"
            subtitle="查看你的非语言类科目学习详情"
            className="h-full"
            glowClassName="bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(225,29,72,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(225,29,72,0.12),transparent_46%)]"
          >
            <SubjectDistribution courses={userData.courses} totalXp={userData.totalXp} />
          </DashboardCard>
        </div>
      </div>

      <section className={`deferred-section group ${surfaceClassName} transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(15,23,42,0.1)] dark:hover:shadow-[0_22px_42px_rgba(0,0,0,0.28)] ${animationClass}`} style={animated ? { animationDelay: '0.32s' } : undefined}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(88,204,2,0.08),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(88,204,2,0.14),transparent_42%)]"
        />
        <div className="relative p-6">
          <RenderBoundary label="学习热力图">
            <HeatmapChart
              data={userData.yearlyXpHistory || []}
              registrationYear={(() => { const m = userData.creationDate?.match(/(\d{4})/); return m ? Number(m[1]) : undefined; })()}
            />
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
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    return resolveThemeMode(localStorage.getItem(THEME_STORAGE_KEY));
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const mode = resolveThemeMode(savedTheme);
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return mode;
  });
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [emojiIconMode, setEmojiIconMode] = useState<EmojiIconMode>(getInitialEmojiIconMode);
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
    const timeZone = getBrowserTimeZone();
    applyDashboardState(nextUserData, loadedAt);
    sessionStorage.setItem(USERDATA_STORAGE_KEY, JSON.stringify(nextUserData));
    localStorage.setItem(USERDATA_STORAGE_KEY, JSON.stringify(nextUserData));
    sessionStorage.setItem(LAST_LOADED_AT_STORAGE_KEY, String(loadedAt));
    localStorage.setItem(LAST_LOADED_AT_STORAGE_KEY, String(loadedAt));
    sessionStorage.setItem(LAST_TIMEZONE_STORAGE_KEY, timeZone);
    localStorage.setItem(LAST_TIMEZONE_STORAGE_KEY, timeZone);
  }

  function clearStoredDashboardState(): void {
    sessionStorage.removeItem(USERDATA_STORAGE_KEY);
    localStorage.removeItem(USERDATA_STORAGE_KEY);
    sessionStorage.removeItem(LAST_LOADED_AT_STORAGE_KEY);
    localStorage.removeItem(LAST_LOADED_AT_STORAGE_KEY);
    sessionStorage.removeItem(LAST_TIMEZONE_STORAGE_KEY);
    localStorage.removeItem(LAST_TIMEZONE_STORAGE_KEY);
  }

  async function fetchDashboardData(activeUsername: string, signal?: AbortSignal): Promise<UserData> {
    const timeZone = getBrowserTimeZone();
    const response = await fetch(`/api/data?username=${encodeURIComponent(activeUsername)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-user-timezone': timeZone,
      },
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
      const sessionUsername = sessionStorage.getItem(USERNAME_STORAGE_KEY)?.trim() || localStorage.getItem(USERNAME_STORAGE_KEY)?.trim() || '';
      const storedUsername = sessionUsername || localStorage.getItem(USERNAME_STORAGE_KEY)?.trim() || '';
      const activeUsername = urlUsername || storedUsername || initialUsername?.trim() || '';
      const activeTimeZone = getBrowserTimeZone();
      const sessionUserData = sessionStorage.getItem(USERDATA_STORAGE_KEY);
      const localUserData = localStorage.getItem(USERDATA_STORAGE_KEY);
      const storedUserData = sessionUserData || localUserData;
      const storedLoadedAt = readStoredLoadedAt();
      const storedTimeZone = readStoredTimeZone();
      const isStoredStateFresh =
        !!storedLoadedAt &&
        storedTimeZone === activeTimeZone &&
        isSameTimeZoneDay(storedLoadedAt, Date.now(), activeTimeZone);
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

      if (storedUserData && isStoredStateFresh && (!urlUsername || urlUsername === storedUsername)) {
        try {
          if (isCancelled) return;

          applyDashboardState(JSON.parse(storedUserData), storedLoadedAt);
          setLoading(false);

          // Background refresh to keep the data updated in real-time
          fetchDashboardData(activeUsername, controller.signal)
            .then((nextUserData) => {
              if (!isCancelled) {
                persistDashboardState(nextUserData);
              }
            })
            .catch((err) => {
              console.error('Background refresh failed:', err);
            });
          return;
        } catch {
          clearStoredDashboardState();
        }
      } else if (storedUserData && !isStoredStateFresh) {
        clearStoredDashboardState();
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

    const returnToHome = () => {
      // 立即清除存储，确保返回首页时状态已重置
      sessionStorage.removeItem(USERNAME_STORAGE_KEY);
      sessionStorage.removeItem(USERDATA_STORAGE_KEY);
      sessionStorage.removeItem(LAST_LOADED_AT_STORAGE_KEY);
      sessionStorage.removeItem(LAST_TIMEZONE_STORAGE_KEY);
      localStorage.removeItem(USERNAME_STORAGE_KEY);
      localStorage.removeItem(USERDATA_STORAGE_KEY);
      localStorage.removeItem(LAST_LOADED_AT_STORAGE_KEY);
      localStorage.removeItem(LAST_TIMEZONE_STORAGE_KEY);
      window.location.href = '/';
    };

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        returnToHome();
      }
    };

    const handlePopState = () => {
      // 处理物理返回键
      returnToHome();
    };

    // 使用 capture: true 确保在捕获阶段就能截获事件，提高灵敏度
    window.addEventListener('keydown', handleGlobalKeyDown, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      isCancelled = true;
      controller.abort();
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleGlobalKeyDown, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('animations-off', !animationsEnabled);
    localStorage.setItem('duoeye_animations_enabled', String(animationsEnabled));
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem(EMOJI_ICON_MODE_STORAGE_KEY, emojiIconMode);
    document.documentElement.classList.toggle('duo-mode-svg', emojiIconMode === 'svg');
  }, [emojiIconMode]);

  useEffect(() => {
    const regYear = (() => {
      const m = userData?.creationDate?.match(/(\d{4})/);
      return m ? Number(m[1]) : undefined;
    })();
    const years = getMonthlyYears(userData?.yearlyXpHistory, regYear);
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

  if (loading) {
    return (
      <EmojiModeProvider mode={emojiIconMode}>
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-apple-gray1 dark:bg-apple-dark1">
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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-apple-gray1 dark:bg-apple-dark1">
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
      <div ref={pageRef} className={`relative min-h-screen overflow-x-hidden bg-apple-gray1 dark:bg-apple-dark1 ${emojiIconMode === 'svg' ? 'duo-mode-svg' : ''}`}>
        <div className={`pointer-events-none ${pageGlowBackgroundClassName}`} />

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
            isRefreshing={isRefreshing}
            lastLoadedAt={lastLoadedAt}
            onThemeChange={handleThemeChange}
            onToggleAnimations={toggleAnimations}
            onToggleEmojiIconMode={toggleEmojiIconMode}
            onRefresh={reloadDashboardData}
            onLogout={() => {
              sessionStorage.removeItem(USERNAME_STORAGE_KEY);
              sessionStorage.removeItem(USERDATA_STORAGE_KEY);
              sessionStorage.removeItem(LAST_LOADED_AT_STORAGE_KEY);
              sessionStorage.removeItem(LAST_TIMEZONE_STORAGE_KEY);
              localStorage.removeItem(USERNAME_STORAGE_KEY);
              localStorage.removeItem(USERDATA_STORAGE_KEY);
              localStorage.removeItem(LAST_LOADED_AT_STORAGE_KEY);
              localStorage.removeItem(LAST_TIMEZONE_STORAGE_KEY);
              window.location.assign('/');
            }}
          />
        </RenderBoundary>

        <main ref={contentRef} className="relative mx-auto max-w-[1560px] px-4 pb-10 pt-40 sm:px-6 sm:pt-32 lg:px-8 lg:pt-32">
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
            resolvedTheme={resolvedTheme}
          />
        </main>

        <footer className="render-isolate relative z-10 border-t border-black/5 bg-white/78 py-12 dark:border-white/10 dark:bg-[rgba(20,20,22,0.82)]">
          <div className="mx-auto flex w-full max-w-[1560px] flex-col items-center overflow-visible px-4 text-center sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-visible py-1">
              <AppIcon className="h-11 w-11 shrink-0" />
              <DuoWordmark size="xs" className="shrink-0 overflow-visible" />
            </div>
            <p className="mt-4 w-full max-w-[760px] text-sm leading-7 text-apple-gray6 dark:text-apple-dark6">
              多邻国学习数据可视化工具。
            </p>
            <p className="mt-6 text-xs text-apple-gray6/80 dark:text-apple-dark6/80">
              <span style={{ fontFamily: 'Arial, sans-serif' }}>©</span> {new Date().getFullYear()} DuoEye · 非官方第三方工具
            </p>
          </div>
        </footer>
      </div>
    </EmojiModeProvider>
  );
}
