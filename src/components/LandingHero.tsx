import { Suspense, lazy, startTransition, useEffect, useRef, useState } from 'react';
import AppIcon from './AppIcon';
import DuoWordmark from './DuoWordmark';
import ThemeModeControl from './ThemeModeControl';
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

function getInitialEmojiIconMode(): EmojiIconMode {
  if (typeof window === 'undefined') return 'emoji';
  return resolveEmojiIconMode(window.localStorage.getItem(EMOJI_ICON_MODE_STORAGE_KEY));
}

const heatmapXpScale = [0, 8, 22, 38, 60];
const heatmapTimeScale = [0, 4, 9, 16, 28];

const xpChartData = [
  { date: '周一', xp: 100 },
  { date: '周二', xp: 12 },
  { date: '周三', xp: 18 },
  { date: '周四', xp: 25 },
  { date: '周五', xp: 92 },
  { date: '周六', xp: 15 },
  { date: '周日', xp: 0 },
];

const timeChartData = [
  { date: '周一', time: 20 },
  { date: '周二', time: 2 },
  { date: '周三', time: 2 },
  { date: '周四', time: 4 },
  { date: '周五', time: 9 },
  { date: '周六', time: 1 },
  { date: '周日', time: 0 },
];

const LandingPreviewSection = lazy(() => import('./home/LandingPreviewSection'));

const featureCards = [
  {
    title: '年度活跃记录',
    description: '用热力图查看一整年的学习密度，快速看出你的坚持节奏。',
    tone: 'text-[#58cc02] dark:text-[#9be36d]',
    icon: '📊',
  },
  {
    title: '投入时间分析',
    description: '把学习时长单独拉出来看，更容易识别强度、波动和空档。',
    tone: 'text-[#1cb0f6] dark:text-[#7ed9ff]',
    icon: '⏱️',
  },
  {
    title: '核心数据总览',
    description: '经验、时长、热力图和趋势图放在同一页里，进入就能看重点。',
    tone: 'text-[#ff9600] dark:text-[#ffd08b]',
    icon: '⚡',
  },
];

const faqItems = [
  {
    question: '需要登录多邻国账号吗？',
    answer: '不用，只要输入用户名就能生成仪表盘，不需要密码。',
  },
  {
    question: '为什么有时获取不到数据？',
    answer: '通常是用户名错误，或者该用户没有可读取的公开学习数据。',
  },
  {
    question: '会长期保存我的数据吗？',
    answer: '首页只会把结果暂存在当前浏览器会话里，方便直接进入仪表盘查看。',
  },
];

const landingHeatmapPreviewData = buildLandingHeatmapPreviewData();
const totalXp = xpChartData.reduce((sum, item) => sum + item.xp, 0);
const totalTime = timeChartData.reduce((sum, item) => sum + item.time, 0);
const averageXp = Math.round(totalXp / xpChartData.filter((item) => item.xp > 0).length);

const floatingNavClassName =
  'mx-auto flex max-w-[1560px] items-center justify-between overflow-visible rounded-[28px] px-4 py-3.5 transition-[background-color,box-shadow] duration-300 sm:px-5';
const sectionCardClassName =
  'screenshot-solid-panel relative overflow-hidden rounded-[30px] border border-black/[0.06] dark:border-transparent bg-[rgba(255,255,255,0.9)] transition-[transform,background-color,filter] duration-300 will-change-transform hover:-translate-y-1 dark:bg-[rgba(44,44,46,0.92)]';
const sectionCardStaticClassName =
  'screenshot-solid-panel relative overflow-hidden rounded-[30px] border border-black/[0.06] dark:border-transparent bg-[rgba(255,255,255,0.9)] transition-[transform,background-color,filter] duration-300 will-change-transform hover:-translate-y-1 dark:bg-[rgba(44,44,46,0.92)]';
const heroGlowClassName =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(88,204,2,0.12)_0%,transparent_58%),radial-gradient(ellipse_at_bottom_right,rgba(28,176,246,0.1)_0%,transparent_70%),linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,249,252,0.95)_52%,rgba(242,245,249,0.92)_100%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(88,204,2,0.2)_0%,transparent_56%),radial-gradient(ellipse_at_bottom_right,rgba(28,176,246,0.18)_0%,transparent_68%),linear-gradient(180deg,rgba(58,58,60,0.96)_0%,rgba(40,40,42,0.95)_52%,rgba(32,32,34,0.98)_100%)]';
const overviewGlowClassName =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_46%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.1),transparent_52%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.2),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.16),transparent_48%)]';
const featuresGlowClassName =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,200,0,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.1),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,200,0,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.16),transparent_46%)]';
const previewGlowClassName =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.13),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.1),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.19),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.16),transparent_46%)]';
const faqGlowClassName =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,113,133,0.11),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.1),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(251,113,133,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.16),transparent_46%)]';
const pageGlowBackgroundClassName =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.08),transparent_28%),linear-gradient(180deg,#fbfbfd_0%,#f5f5f7_46%,#f7f7fa_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.1),transparent_26%),linear-gradient(180deg,rgba(20,20,22,0.98)_0%,rgba(28,28,30,0.96)_48%,rgba(18,18,20,1)_100%)]';
const badgeClassName =
  'inline-flex items-center rounded-full border border-black/5 bg-white/88 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-apple-gray6 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-transparent dark:bg-white/10 dark:text-apple-dark6';
const navTabClassName =
  'inline-flex h-11 items-center justify-center rounded-2xl border border-black/5 bg-white/88 px-4 text-xs font-semibold tracking-[0.18em] text-apple-gray6 shadow-[0_6px_14px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,color,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(15,23,42,0.08)] hover:text-apple-dark1 dark:border-white/15 dark:bg-white/12 dark:text-white/72 dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.22)] dark:hover:text-white';
const anchorSectionClassName = 'deferred-section mt-6';
const mobileMenuCompactItemClassName =
  'flex min-h-[50px] items-center gap-2 rounded-[20px] border border-black/5 bg-white/72 px-3 py-2 text-left shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.06] dark:hover:shadow-[0_14px_24px_rgba(0,0,0,0.18)]';
const mobileMenuExpandedItemClassName =
  'flex min-h-[68px] flex-col items-center justify-center rounded-[24px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,249,252,0.92))] px-4 py-2 text-center shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.72),rgba(34,34,36,0.9))] dark:hover:shadow-[0_16px_28px_rgba(0,0,0,0.2)]';

function formatDateKey(date: Date): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Shanghai',
    }).format(date);
  } catch {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}

function buildLandingHeatmapPreviewData() {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear - 1, 0, 1);
  const endDate = new Date(currentYear, 11, 31);
  const entries: Array<{ date: string; xp: number; time: number }> = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const year = cursor.getFullYear();
    const dayOfYear = Math.floor((cursor.getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
    const seed = year * 1000 + dayOfYear * 97 + (cursor.getDay() + 1) * 193;
    const normalized = ((Math.sin(seed * 12.9898) * 43758.5453) % 1 + 1) % 1;

    let level = 0;
    if (normalized > 0.8) level = 4;
    else if (normalized > 0.6) level = 3;
    else if (normalized > 0.4) level = 2;
    else if (normalized > 0.25) level = 1;

    entries.push({
      date: formatDateKey(cursor),
      xp: heatmapXpScale[level],
      time: heatmapTimeScale[level],
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return entries;
}

function SearchIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function BoltIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChartIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M4 20V8" strokeLinecap="round" />
      <path d="M10 20V4" strokeLinecap="round" />
      <path d="M16 20v-6" strokeLinecap="round" />
      <path d="M22 20v-9" strokeLinecap="round" />
      <path d="M2 20h20" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="m12 5 6 6" strokeLinecap="round" />
      <path d="m12 5-6 6" strokeLinecap="round" />
      <path d="M12 5v14" strokeLinecap="round" />
    </svg>
  );
}

function SearchButtonSpinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-80" />
    </svg>
  );
}

function QuestionIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17h.01" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function SparkleIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="m12 3 1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="m18.5 15 0.9 2.6L22 18.5l-2.6 0.9-0.9 2.6-0.9-2.6-2.6-0.9 2.6-0.9 0.9-2.6Z" />
    </svg>
  );
}

function PauseIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1.2" />
      <rect x="14" y="5" width="4" height="14" rx="1.2" />
    </svg>
  );
}

function EmojiModeIcon({
  mode,
  className = 'h-4 w-4',
}: {
  mode: EmojiIconMode;
  className?: string;
}) {
  if (mode === 'svg') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <rect x="4" y="4" width="6" height="6" rx="1.5" strokeWidth="1.8" />
        <circle cx="17" cy="7" r="3" strokeWidth="1.8" />
        <path d="m8 15 3 5 3-5 3 5 3-5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="8" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      <path d="M8.5 14c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ThemeCycleIcon({ resolvedTheme }: { resolvedTheme: ResolvedTheme }) {
  if (resolvedTheme === 'dark') {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
      <path strokeLinecap="round" strokeWidth="1.8" d="M12 2.5V5" />
      <path strokeLinecap="round" strokeWidth="1.8" d="M12 19v2.5" />
      <path strokeLinecap="round" strokeWidth="1.8" d="M4.93 4.93 6.7 6.7" />
      <path strokeLinecap="round" strokeWidth="1.8" d="m17.3 17.3 1.77 1.77" />
      <path strokeLinecap="round" strokeWidth="1.8" d="M2.5 12H5" />
      <path strokeLinecap="round" strokeWidth="1.8" d="M19 12h2.5" />
      <path strokeLinecap="round" strokeWidth="1.8" d="m4.93 19.07 1.77-1.77" />
      <path strokeLinecap="round" strokeWidth="1.8" d="m17.3 6.7 1.77-1.77" />
    </svg>
  );
}

function getNextThemeMode(mode: ThemeMode): ThemeMode {
  if (mode === 'light') return 'dark';
  if (mode === 'dark') return 'system';
  return 'light';
}

function getThemeLabel(mode: ThemeMode): string {
  if (mode === 'light') return '浅色';
  if (mode === 'dark') return '深色';
  return '跟随系统';
}

function getNavbarActionIconClassName(variant: 'sparkle' | 'pause' | 'emoji'): string {
  const base = 'h-4 w-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform';

  if (variant === 'sparkle') {
    return `${base} group-hover:-translate-y-0.5 group-hover:rotate-12`;
  }

  if (variant === 'emoji') {
    return `${base} group-hover:-translate-y-0.5 group-hover:rotate-6`;
  }

  return `${base} group-hover:-translate-y-0.5`;
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m6 6 12 12M18 6 6 18" />
      ) : (
        <>
          <path strokeLinecap="round" strokeWidth="1.8" d="M4 7h16" />
          <path strokeLinecap="round" strokeWidth="1.8" d="M4 12h16" />
          <path strokeLinecap="round" strokeWidth="1.8" d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

function HeroMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="render-isolate overflow-hidden rounded-[22px] border border-black/[0.06] dark:border-transparent bg-[rgba(255,255,255,0.84)] px-4 py-4 shadow-[0_6px_16px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(15,23,42,0.07)] dark:bg-[rgba(44,44,46,0.92)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.22)]">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-apple-gray6 dark:text-apple-dark6">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

export default function LandingHero() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [emojiIconMode, setEmojiIconMode] = useState<EmojiIconMode>(getInitialEmojiIconMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldRenderPreview, setShouldRenderPreview] = useState(false);
  const scrollFrameRef = useRef<number | null>(null);
  const showBackToTopRef = useRef(false);
  const isScrolledRef = useRef(false);
  const previewSectionRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const storedAnimations = localStorage.getItem('duoeye_animations_enabled');
    const storedEmojiIconMode = resolveEmojiIconMode(localStorage.getItem(EMOJI_ICON_MODE_STORAGE_KEY));
    const initialThemeMode = resolveThemeMode(localStorage.getItem(THEME_STORAGE_KEY));
    const initialResolvedTheme = getResolvedTheme(initialThemeMode);

    setThemeMode(initialThemeMode);
    setResolvedTheme(initialResolvedTheme);
    setEmojiIconMode(storedEmojiIconMode);
    applyResolvedTheme(initialResolvedTheme);
    if (storedAnimations === 'false') {
      setAnimationsEnabled(false);
      document.documentElement.classList.add('animations-off');
    }

    function commitScrollState(scrollTop: number): void {
      const nextShowBackToTop = scrollTop > 420;
      const nextIsScrolled = scrollTop > 12;

      if (
        nextShowBackToTop === showBackToTopRef.current &&
        nextIsScrolled === isScrolledRef.current
      ) {
        return;
      }

      showBackToTopRef.current = nextShowBackToTop;
      isScrolledRef.current = nextIsScrolled;
      startTransition(() => {
        setShowBackToTop(nextShowBackToTop);
        setIsScrolled(nextIsScrolled);
      });
    }

    function handleScroll(): void {
      if (scrollFrameRef.current !== null) return;

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        commitScrollState(window.scrollY);
      });
    }

    commitScrollState(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function syncTheme() {
      const nextResolvedTheme = getResolvedTheme(themeMode);
      setResolvedTheme(nextResolvedTheme);
      applyResolvedTheme(nextResolvedTheme);
    }

    syncTheme();
    mediaQuery.addEventListener('change', syncTheme);
    return () => mediaQuery.removeEventListener('change', syncTheme);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('animations-off', !animationsEnabled);
    localStorage.setItem('duoeye_animations_enabled', String(animationsEnabled));
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem(EMOJI_ICON_MODE_STORAGE_KEY, emojiIconMode);
  }, [emojiIconMode]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent): void {
      if (navRef.current?.contains(event.target as Node)) return;
      setIsMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    function handleResize(): void {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const previewSection = previewSectionRef.current;
    if (!previewSection || shouldRenderPreview) return;

    if (!('IntersectionObserver' in window)) {
      setShouldRenderPreview(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setShouldRenderPreview(true);
        observer.disconnect();
      },
      { rootMargin: '520px 0px' },
    );

    observer.observe(previewSection);
    return () => observer.disconnect();
  }, [shouldRenderPreview]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = username.trim();

    if (!trimmed) return;

    setLoading(true);
    sessionStorage.setItem(USERNAME_STORAGE_KEY, trimmed);
    sessionStorage.removeItem(USERDATA_STORAGE_KEY);
    localStorage.setItem(USERNAME_STORAGE_KEY, trimmed);
    localStorage.removeItem(USERDATA_STORAGE_KEY);
    window.location.assign(`/dashboard?username=${encodeURIComponent(trimmed)}`);
  }

  function handleThemeChange(mode: ThemeMode) {
    setThemeMode(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }

  function toggleAnimations() {
    setAnimationsEnabled((current) => !current);
  }

  function toggleEmojiIconMode() {
    setEmojiIconMode((current) => (current === 'emoji' ? 'svg' : 'emoji'));
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <EmojiModeProvider mode={emojiIconMode}>
      <div className="relative min-h-screen overflow-x-hidden bg-apple-gray1 text-apple-dark1 transition-colors duration-500 dark:bg-apple-dark1 dark:text-white">
        <div className={pageGlowBackgroundClassName} />

      <nav ref={navRef} data-floating-navbar="true" className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
        <div
          className={`${floatingNavClassName} ${
            isScrolled
              ? 'bg-[rgba(255,255,255,0.92)] shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:bg-[rgba(44,44,46,0.88)]'
              : 'bg-[rgba(255,255,255,0.9)] shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:bg-[rgba(44,44,46,0.82)]'
          }`}
        >
          <a href="#hero" className="flex min-w-0 items-center gap-1 overflow-visible py-1">
            <AppIcon className="h-11 w-11 shrink-0" />
            <DuoWordmark size="xs" className="shrink-0 overflow-visible" />
            <span className="-mx-0.5 shrink-0 text-[11px] font-medium text-apple-gray6/70 dark:text-white/38">-</span>
            <div className="min-w-0 truncate text-[11px] text-apple-gray6 dark:text-white/55">多邻国学习数据仪表盘</div>
          </a>

          <div className="hidden items-center gap-2 min-[768px]:flex">
            <div className="flex items-center gap-1.5 min-[900px]:gap-2">
              <a href="#features" className={navTabClassName}>
                功能亮点
              </a>
              <a href="#preview" className={navTabClassName}>
                数据预览
              </a>
              <a href="#faq" className={navTabClassName}>
                常见问题
              </a>
            </div>
            <button
              type="button"
              onClick={toggleAnimations}
              className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-white/88 text-apple-gray6 shadow-[0_6px_14px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,color,background-color,border-color] duration-200 hover:text-apple-dark1 dark:border-white/15 dark:bg-white/12 dark:text-white/72 dark:hover:text-white"
              title={animationsEnabled ? '关闭动效' : '开启动效'}
              aria-label={animationsEnabled ? '关闭动效' : '开启动效'}
            >
              {animationsEnabled ? (
                <SparkleIcon className={getNavbarActionIconClassName('sparkle')} />
              ) : (
                <PauseIcon className={getNavbarActionIconClassName('pause')} />
              )}
            </button>
            <button
              type="button"
              onClick={toggleEmojiIconMode}
              className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-white/88 text-apple-gray6 shadow-[0_6px_14px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,color,background-color,border-color] duration-200 hover:text-apple-dark1 dark:border-white/15 dark:bg-white/12 dark:text-white/72 dark:hover:text-white"
              title={emojiIconMode === 'svg' ? '切换到 Emoji 图标' : '切换到 SVG 图标'}
              aria-label={emojiIconMode === 'svg' ? '切换到 Emoji 图标' : '切换到 SVG 图标'}
            >
              <EmojiModeIcon mode={emojiIconMode} className={getNavbarActionIconClassName('emoji')} />
            </button>
            <ThemeModeControl mode={themeMode} resolvedTheme={resolvedTheme} onChange={handleThemeChange} />
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-white/88 text-apple-gray6 shadow-[0_6px_14px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,color,background-color,border-color] duration-200 hover:text-apple-dark1 dark:border-white/15 dark:bg-white/12 dark:text-white/72 dark:hover:text-white min-[768px]:hidden"
            aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
            title={isMenuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={isMenuOpen}
          >
            <MenuIcon open={isMenuOpen} />
          </button>
        </div>

        <div
          className={`overflow-hidden transition-[max-height,opacity,transform,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] min-[768px]:hidden ${
            isMenuOpen ? 'mt-3 max-h-[360px] opacity-100 translate-y-0' : 'pointer-events-none max-h-0 opacity-0 -translate-y-2'
          }`}
        >
          <div className="mx-auto max-w-[1560px] rounded-[28px] bg-[rgba(255,255,255,0.9)] px-4 py-4 shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:bg-[rgba(44,44,46,0.82)]">
            <div className="grid grid-cols-3 gap-2.5">
              <a href="#features" onClick={() => setIsMenuOpen(false)} className={mobileMenuCompactItemClassName}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[14px] border border-black/5 bg-white/92 text-apple-dark1 shadow-[0_4px_10px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/10 dark:text-white">
                  <BarChartIcon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold tracking-tight text-apple-dark1 dark:text-white">功能</div>
                  <div className="text-[10px] leading-tight text-apple-gray6 dark:text-white/62">亮点速览</div>
                </div>
              </a>
              <a href="#preview" onClick={() => setIsMenuOpen(false)} className={mobileMenuCompactItemClassName}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[14px] border border-black/5 bg-white/92 text-apple-dark1 shadow-[0_4px_10px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/10 dark:text-white">
                  <SearchIcon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold tracking-tight text-apple-dark1 dark:text-white">预览</div>
                  <div className="text-[10px] leading-tight text-apple-gray6 dark:text-white/62">查看界面</div>
                </div>
              </a>
              <a href="#faq" onClick={() => setIsMenuOpen(false)} className={mobileMenuCompactItemClassName}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[14px] border border-black/5 bg-white/92 text-apple-dark1 shadow-[0_4px_10px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/10 dark:text-white">
                  <QuestionIcon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold tracking-tight text-apple-dark1 dark:text-white">问题</div>
                  <div className="text-[10px] leading-tight text-apple-gray6 dark:text-white/62">常见问答</div>
                </div>
              </a>
            </div>

            <div className="mt-2.5 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  toggleAnimations();
                  setIsMenuOpen(false);
                }}
                className={mobileMenuExpandedItemClassName}
              >
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-[15px] border border-black/5 bg-white/92 text-apple-dark1 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/10 dark:text-white">
                  {animationsEnabled ? <SparkleIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
                </div>
                <div className="mt-1">
                  <div className="text-[17px] font-semibold tracking-tight text-apple-dark1 dark:text-white">动效</div>
                  <div className="mt-0 text-[11px] text-apple-gray6 dark:text-white/62">{animationsEnabled ? '当前开启' : '当前关闭'}</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleEmojiIconMode();
                  setIsMenuOpen(false);
                }}
                className={mobileMenuExpandedItemClassName}
              >
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-[15px] border border-black/5 bg-white/92 text-apple-dark1 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/10 dark:text-white">
                  <EmojiModeIcon mode={emojiIconMode} className="h-4 w-4" />
                </div>
                <div className="mt-1">
                  <div className="text-[17px] font-semibold tracking-tight text-apple-dark1 dark:text-white">图标</div>
                  <div className="mt-0 text-[11px] text-apple-gray6 dark:text-white/62">{emojiIconMode === 'svg' ? '当前 SVG' : '当前 Emoji'}</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleThemeChange(getNextThemeMode(themeMode));
                  setIsMenuOpen(false);
                }}
                className={mobileMenuExpandedItemClassName}
              >
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-[15px] border border-black/5 bg-white/92 text-apple-dark1 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/10 dark:text-white">
                  <ThemeCycleIcon resolvedTheme={resolvedTheme} />
                </div>
                <div className="mt-1">
                  <div className="text-[17px] font-semibold tracking-tight text-apple-dark1 dark:text-white">主题</div>
                  <div className="mt-0 text-[11px] text-apple-gray6 dark:text-white/62">{getThemeLabel(themeMode)}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-[1560px] px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-32">
        <section id="hero" className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className={`${sectionCardClassName} overflow-hidden xl:col-span-7`}>
            <div className="relative h-full p-7 sm:p-8">
              <div className={heroGlowClassName} />
              <div className="relative">
                <span className={badgeClassName}>DUOEYE HOME</span>
                <h1 className="mt-5 max-w-4xl text-[clamp(2.4rem,4vw,4.6rem)] font-semibold tracking-tight text-apple-dark1 dark:text-white">
                  用仪表盘的方式看你的多邻国学习轨迹
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-apple-gray6 dark:text-apple-dark6 sm:text-lg">
                  输入用户名，快速生成和首页同风格的 Apple 风数据面板。热力图、经验趋势、学习时长和关键统计会集中呈现。
                </p>
                <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="输入你的多邻国用户名"
                      disabled={loading}
                      className="render-isolate w-full overflow-hidden rounded-[24px] border border-white/72 bg-[rgba(255,255,255,0.92)] [background-clip:padding-box] py-4 pl-5 pr-14 text-base text-apple-dark1 shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none transition-[box-shadow,border-color,background-color,color] duration-200 focus:border-[#58cc02]/40 focus:ring-4 focus:ring-[#58cc02]/10 disabled:cursor-not-allowed disabled:opacity-70 dark:border-transparent dark:bg-[rgba(44,44,46,0.78)] dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={loading || !username.trim()}
                      aria-label="提交用户名"
                      className="absolute right-4 text-apple-gray6 transition-colors duration-200 hover:text-[#58cc02] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? <SearchButtonSpinner /> : <SearchIcon />}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading || !username.trim()}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(17,24,39,0.14)] transition-[transform,box-shadow,background-color,opacity] duration-200 hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-55 dark:bg-white dark:text-apple-dark1 dark:hover:bg-white/92"
                    >
                      {loading ? <SearchButtonSpinner /> : null}
                      {loading ? '正在生成...' : '生成我的仪表盘'}
                    </button>
                    <span className="text-sm text-apple-gray6 dark:text-apple-dark6">只需要用户名，不需要密码</span>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="xl:col-span-5">
            <div className={`${sectionCardClassName} h-full p-6 sm:p-7`}>
              <div aria-hidden="true" className={overviewGlowClassName} />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-apple-dark1 dark:text-white">预览概览</div>
                  <div className="mt-1 text-sm text-apple-gray6 dark:text-apple-dark6">和仪表盘同一套视觉语言</div>
                </div>
                <span className={badgeClassName}>APPLE STYLE</span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <HeroMetric label="本周经验" value="1268 XP" accent="#58cc02" />
                <HeroMetric label="本周时长" value="73 分钟" accent="#1cb0f6" />
                <HeroMetric label="日均经验" value="88 XP" accent="#ff9600" />
                <HeroMetric label="热力活跃" value="365 天" accent="#a572f7" />
              </div>

              <div className="render-isolate mt-4 overflow-hidden rounded-[24px] border border-black/[0.06] dark:border-transparent bg-[rgba(255,255,255,0.82)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-1 dark:bg-[rgba(44,44,46,0.92)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold text-apple-dark1 dark:text-white">体验重点</div>
                  <span className="rounded-full bg-[#58cc02]/10 px-2.5 py-1 text-[11px] font-semibold text-[#3d8f09] dark:bg-[#58cc02]/15 dark:text-[#b6ef89]">
                    流畅感优先
                  </span>
                </div>
                <div className="mt-3 space-y-3 text-sm text-apple-gray6 dark:text-apple-dark6">
                  <div className="rounded-2xl bg-black/[0.02] px-4 py-3 dark:bg-white/[0.04]">轻玻璃、轻阴影、弱动效，不堆重特效。</div>
                  <div className="rounded-2xl bg-black/[0.02] px-4 py-3 dark:bg-white/[0.04]">首页和仪表盘保持同一套卡片、按钮和字体节奏。</div>
                  <div className="rounded-2xl bg-black/[0.02] px-4 py-3 dark:bg-white/[0.04]">进入后直接过渡到数据页，视觉不会断层。</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className={anchorSectionClassName}>
          <div className={`${sectionCardClassName} p-7 sm:p-8`}>
            <div aria-hidden="true" className={featuresGlowClassName} />
            <div className="max-w-3xl">
              <span className={badgeClassName}>FEATURES</span>
              <h2 className="mt-4 text-[clamp(1.9rem,3vw,3rem)] font-semibold tracking-tight text-apple-dark1 dark:text-white">
                首屏先讲清楚价值，再展示图表结果
              </h2>
              <p className="mt-3 text-base leading-7 text-apple-gray6 dark:text-apple-dark6">
                不做花哨首页，重点是让你一进来就知道这个项目能看什么、值不值得用、生成后会是什么样子。
              </p>

            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {featureCards.map((item) => (
                <article
                  key={item.title}
                  className="render-isolate overflow-hidden rounded-[26px] border border-black/[0.06] dark:border-transparent bg-[rgba(255,255,255,0.88)] p-6 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.07)] dark:bg-[rgba(44,44,46,0.92)] dark:hover:shadow-[0_14px_28px_rgba(0,0,0,0.22)]"
                >
                  <div className={`flex h-12 items-center text-[1.45rem] leading-none ${item.tone}`}>
                    <EmojiIcon symbol={item.icon} className="inline-flex items-center justify-center leading-none" tone="inherit" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-apple-dark1 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-apple-gray6 dark:text-apple-dark6">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section ref={previewSectionRef} id="preview" className={anchorSectionClassName}>
          <div className={`${sectionCardClassName} p-4 sm:p-6`}>
            <div aria-hidden="true" className={previewGlowClassName} />
            {shouldRenderPreview ? (
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    <div className={`${sectionCardStaticClassName} min-h-[320px] md:col-span-12`} />
                    <div className={`${sectionCardClassName} min-h-[280px] md:col-span-6`} />
                    <div className={`${sectionCardClassName} min-h-[280px] md:col-span-6`} />
                  </div>
                }
              >
                <LandingPreviewSection
                  badgeClassName={badgeClassName}
                  sectionCardClassName={sectionCardStaticClassName}
                  xpChartData={xpChartData}
                  timeChartData={timeChartData}
                  landingHeatmapPreviewData={landingHeatmapPreviewData}
                  totalXp={totalXp}
                  totalTime={totalTime}
                  averageXp={averageXp}
                />
              </Suspense>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                <div className={`${sectionCardStaticClassName} min-h-[320px] md:col-span-12`} />
                <div className={`${sectionCardClassName} min-h-[280px] md:col-span-6`} />
                <div className={`${sectionCardClassName} min-h-[280px] md:col-span-6`} />
              </div>
            )}
          </div>
        </section>

        <section id="faq" className={anchorSectionClassName}>
          <div className={`${sectionCardClassName} p-7 sm:p-8`}>
            <div aria-hidden="true" className={faqGlowClassName} />
            <div className="max-w-2xl">
              <span className={badgeClassName}>FAQ</span>
              <h2 className="mt-4 text-[clamp(1.8rem,2.8vw,2.8rem)] font-semibold tracking-tight text-apple-dark1 dark:text-white">
                常见问题
              </h2>
            </div>

            <div className="mt-8 space-y-4">
              {faqItems.map((item) => (
                <article
                  key={item.question}
                  className="render-isolate overflow-hidden rounded-[24px] border border-black/[0.06] dark:border-transparent bg-[rgba(255,255,255,0.84)] p-6 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_22px_rgba(15,23,42,0.06)] dark:bg-[rgba(44,44,46,0.92)] dark:shadow-[0_10px_22px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_12px_22px_rgba(0,0,0,0.2)]"
                >
                  <h3 className="text-base font-semibold tracking-tight text-apple-dark1 dark:text-white">Q. {item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-apple-gray6 dark:text-apple-dark6">A. {item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-black/5 bg-white/92 py-12 dark:border-transparent dark:bg-[rgba(20,20,22,0.92)]">
        <div className="mx-auto flex w-full max-w-[1560px] flex-col items-center overflow-visible px-4 text-center sm:px-6 lg:px-8">
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

      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-white shadow-[0_14px_30px_rgba(17,24,39,0.16)] transition-all duration-200 dark:bg-white dark:text-apple-dark1 ${
          showBackToTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
        }`}
        aria-label="回到顶部"
      >
        <ArrowUpIcon />
      </button>
      </div>
    </EmojiModeProvider>
  );
}
