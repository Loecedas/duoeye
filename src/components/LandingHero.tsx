import { Suspense, lazy, startTransition, useEffect, useRef, useState } from 'react';
import AppIcon from './AppIcon';
import DuoWordmark from './DuoWordmark';
import ThemeModeControl from './ThemeModeControl';
import {
  THEME_STORAGE_KEY,
  applyResolvedTheme,
  getResolvedTheme,
  type ResolvedTheme,
  resolveThemeMode,
  type ThemeMode,
} from '../utils/theme';

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
    tone: 'bg-[#eef8e7] text-[#58cc02] dark:bg-[#58cc02]/12 dark:text-[#9be36d]',
    icon: BarChartIcon,
  },
  {
    title: '投入时间分析',
    description: '把学习时长单独拉出来看，更容易识别强度、波动和空档。',
    tone: 'bg-[#edf7fe] text-[#1cb0f6] dark:bg-[#1cb0f6]/12 dark:text-[#7ed9ff]',
    icon: ClockIcon,
  },
  {
    title: '核心数据总览',
    description: '经验、时长、热力图和趋势图放在同一页里，进入就能看重点。',
    tone: 'bg-[#fff5e8] text-[#ff9600] dark:bg-[#ff9600]/12 dark:text-[#ffd08b]',
    icon: BoltIcon,
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
  'mx-auto flex max-w-[1560px] items-center justify-between overflow-visible rounded-[28px] border px-4 py-3.5 transition-[background-color,border-color,box-shadow] duration-300 sm:px-5';
const sectionCardClassName =
  'render-isolate screenshot-solid-panel overflow-hidden rounded-[30px] border border-white/72 bg-[rgba(255,255,255,0.9)] [background-clip:padding-box] shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[rgba(44,44,46,0.92)] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)]';
const sectionCardStaticClassName =
  'render-isolate screenshot-solid-panel overflow-hidden rounded-[30px] border border-white/72 bg-[rgba(255,255,255,0.9)] [background-clip:padding-box] shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-shadow duration-300 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[rgba(44,44,46,0.92)] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)]';
const badgeClassName =
  'inline-flex items-center rounded-full border border-black/5 bg-white/88 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-apple-gray6 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-white/15 dark:bg-white/10 dark:text-apple-dark6';
const navTabClassName =
  'inline-flex items-center rounded-full border border-black/5 bg-white/88 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-apple-gray6 shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,color,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(15,23,42,0.08)] hover:text-apple-dark1 dark:border-white/15 dark:bg-white/10 dark:text-apple-dark6 dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.22)] dark:hover:text-white';

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 365 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (364 - index));

    const seed = (index + 1) * 97 + (date.getDay() + 1) * 193;
    const normalized = ((Math.sin(seed * 12.9898) * 43758.5453) % 1 + 1) % 1;

    let level = 0;
    if (normalized > 0.8) level = 4;
    else if (normalized > 0.6) level = 3;
    else if (normalized > 0.4) level = 2;
    else if (normalized > 0.25) level = 1;

    return {
      date: formatDateKey(date),
      xp: heatmapXpScale[level],
      time: heatmapTimeScale[level],
    };
  });
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
    <div className="render-isolate overflow-hidden rounded-[22px] border border-white/72 bg-[rgba(255,255,255,0.84)] [background-clip:padding-box] px-4 py-4 shadow-[0_6px_16px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.07)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.94),rgba(34,34,36,0.98))] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.22)]">
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
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldRenderPreview, setShouldRenderPreview] = useState(false);
  const scrollFrameRef = useRef<number | null>(null);
  const showBackToTopRef = useRef(false);
  const isScrolledRef = useRef(false);
  const previewSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const storedAnimations = localStorage.getItem('duoeye_animations_enabled');
    const initialThemeMode = resolveThemeMode(localStorage.getItem(THEME_STORAGE_KEY));
    const initialResolvedTheme = getResolvedTheme(initialThemeMode);

    setThemeMode(initialThemeMode);
    setResolvedTheme(initialResolvedTheme);
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
    sessionStorage.setItem('duoeye_username', trimmed);
    sessionStorage.removeItem('duoeye_userdata');
    window.location.href = '/dashboard';
  }

  function handleThemeChange(mode: ThemeMode) {
    setThemeMode(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }

  function toggleAnimations() {
    setAnimationsEnabled((current) => !current);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-apple-gray1 text-apple-dark1 transition-colors duration-500 dark:bg-apple-dark1 dark:text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.1),transparent_24%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.08),transparent_22%),linear-gradient(180deg,#fbfbfd_0%,rgba(245,245,247,0.76)_48%,transparent_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_22%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_22%),linear-gradient(180deg,rgba(28,28,30,0.96)_0%,rgba(28,28,30,0.72)_46%,transparent_100%)]" />

      <nav data-floating-navbar="true" className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
        <div
          className={`${floatingNavClassName} ${
            isScrolled
              ? 'border-white/78 bg-[rgba(255,255,255,0.92)] shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-[rgba(44,44,46,0.88)]'
              : 'border-white/68 bg-[rgba(255,255,255,0.9)] shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:border-white/12 dark:bg-[rgba(44,44,46,0.82)]'
          }`}
        >
          <a href="#hero" className="flex min-w-0 items-center gap-1 overflow-visible py-1">
            <AppIcon className="h-11 w-11 shrink-0" />
            <DuoWordmark size="xs" className="shrink-0 overflow-visible" />
            <span className="-mx-0.5 shrink-0 text-[11px] font-medium text-apple-gray6/70 dark:text-white/38">-</span>
            <div className="min-w-0 truncate text-[11px] text-apple-gray6 dark:text-white/55">多邻国学习数据仪表盘</div>
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 md:flex">
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
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-white/88 text-apple-gray6 shadow-[0_6px_14px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,color,background-color,border-color] duration-200 hover:text-apple-dark1 dark:border-white/15 dark:bg-white/12 dark:text-white/72 dark:hover:text-white"
              title={animationsEnabled ? '关闭动效' : '开启动效'}
              aria-label={animationsEnabled ? '关闭动效' : '开启动效'}
            >
              <span className="text-sm">{animationsEnabled ? '✨' : '⏸'}</span>
            </button>
            <ThemeModeControl mode={themeMode} resolvedTheme={resolvedTheme} onChange={handleThemeChange} />
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-[1560px] px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-32">
        <section id="hero" className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className={`${sectionCardClassName} overflow-hidden xl:col-span-7`}>
            <div className="relative p-7 sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.1),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.08),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.12),transparent_32%)]" />
              <div className="relative">
                <span className={badgeClassName}>DUOEYE HOME</span>
                <h1 className="mt-5 max-w-4xl text-[clamp(2.4rem,4vw,4.6rem)] font-semibold tracking-tight text-apple-dark1 dark:text-white">
                  用仪表盘的方式看你的多邻国学习轨迹
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-apple-gray6 dark:text-apple-dark6 sm:text-lg">
                  输入用户名，快速生成和首页同风格的 Apple 风数据面板。热力图、经验趋势、学习时长和关键统计会集中呈现。
                </p>
                <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="输入你的多邻国用户名"
                      disabled={loading}
                      className="render-isolate w-full overflow-hidden rounded-[24px] border border-white/72 bg-[rgba(255,255,255,0.92)] [background-clip:padding-box] py-4 pl-5 pr-14 text-base text-apple-dark1 shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none transition-[box-shadow,border-color,background-color,color] duration-200 focus:border-[#58cc02]/40 focus:ring-4 focus:ring-[#58cc02]/10 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-[rgba(44,44,46,0.78)] dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={loading || !username.trim()}
                      aria-label="提交用户名"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray6 transition-colors duration-200 hover:text-[#58cc02] disabled:cursor-not-allowed disabled:opacity-50"
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
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-apple-dark1 dark:text-white">预览概览</div>
                  <div className="mt-1 text-sm text-apple-gray6 dark:text-apple-dark6">和仪表盘同一套视觉语言</div>
                </div>
                <span className={badgeClassName}>APPLE STYLE</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <HeroMetric label="本周经验" value="1268 XP" accent="#58cc02" />
                <HeroMetric label="本周时长" value="73 分钟" accent="#1cb0f6" />
                <HeroMetric label="日均经验" value="88 XP" accent="#ff9600" />
                <HeroMetric label="热力活跃" value="365 天" accent="#a572f7" />
              </div>

              <div className="render-isolate mt-4 overflow-hidden rounded-[24px] border border-white/72 bg-[rgba(255,255,255,0.82)] [background-clip:padding-box] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(52,52,54,0.96),rgba(30,30,32,0.98))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="flex items-center justify-between">
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

        <section id="features" className="deferred-section mt-6">
          <div className={`${sectionCardClassName} p-7 sm:p-8`}>
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
              {featureCards.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="render-isolate overflow-hidden rounded-[26px] border border-white/72 bg-[rgba(255,255,255,0.88)] [background-clip:padding-box] p-6 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-[rgba(44,44,46,0.92)] dark:hover:shadow-[0_14px_28px_rgba(0,0,0,0.22)]"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone}`}>
                      <Icon />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-apple-dark1 dark:text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-apple-gray6 dark:text-apple-dark6">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={previewSectionRef} id="preview" className="deferred-section mt-6">
          <div className={`${sectionCardClassName} p-4 sm:p-6`}>
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

        <section id="faq" className="deferred-section mt-6">
          <div className={`${sectionCardClassName} p-7 sm:p-8`}>
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
                  className="render-isolate overflow-hidden rounded-[24px] border border-white/72 bg-[rgba(255,255,255,0.84)] [background-clip:padding-box] p-6 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_22px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(56,56,58,0.96),rgba(32,32,34,0.98))] dark:shadow-[0_10px_22px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_12px_22px_rgba(0,0,0,0.2)]"
                >
                  <h3 className="text-base font-semibold tracking-tight text-apple-dark1 dark:text-white">Q. {item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-apple-gray6 dark:text-apple-dark6">A. {item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-black/5 bg-white/92 py-12 dark:border-white/10 dark:bg-[rgba(20,20,22,0.92)]">
        <div className="mx-auto flex w-full max-w-[1560px] flex-col items-center overflow-visible px-4 text-center sm:px-6 lg:px-8">
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
  );
}
