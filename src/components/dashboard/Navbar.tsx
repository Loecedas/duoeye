import { startTransition, useEffect, useRef, useState } from 'react';
import AppIcon from '../AppIcon';
import DuoWordmark from '../DuoWordmark';
import ThemeModeControl from '../ThemeModeControl';
import type { ResolvedTheme, ThemeMode } from '../../utils/theme';

interface NavbarProps {
  username: string;
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  animationsEnabled: boolean;
  isScreenshotting: boolean;
  onThemeChange: (mode: ThemeMode) => void;
  onToggleAnimations: () => void;
  onScreenshot: () => void;
  onLogout: () => void;
}

const iconButtonClassName =
  'flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-white/88 text-apple-gray6 shadow-[0_6px_14px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,color,background-color,border-color,opacity] duration-200 hover:text-apple-dark1 dark:border-transparent dark:bg-white/12 dark:text-white/72 dark:hover:text-white min-[768px]:h-10 min-[768px]:w-10 min-[1024px]:h-11 min-[1024px]:w-11';
const compactMenuActionClassName =
  'flex w-full items-center justify-between rounded-[18px] px-3 py-3 text-left text-sm font-medium text-apple-dark1 transition-[background-color,transform] duration-200 hover:bg-black/[0.04] dark:text-white dark:hover:bg-white/[0.08]';
const compactThemeOptionClassName =
  'flex h-11 items-center justify-center rounded-[16px] border border-black/5 bg-white/88 text-apple-dark1 transition-[transform,box-shadow,color,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] dark:border-transparent dark:bg-white/10 dark:text-white';

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m6 6 12 12M18 6 6 18" />
      ) : (
        <>
          <path strokeLinecap="round" strokeWidth={1.8} d="M4 7h16" />
          <path strokeLinecap="round" strokeWidth={1.8} d="M4 12h16" />
          <path strokeLinecap="round" strokeWidth={1.8} d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

function SparkleIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="m12 3 1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="m18.5 15 0.9 2.6L22 18.5l-2.6 0.9-0.9 2.6-0.9-2.6-2.6-0.9 2.6-0.9 0.9-2.6Z" />
    </svg>
  );
}

function PauseIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1.2" />
      <rect x="14" y="5" width="4" height="14" rx="1.2" />
    </svg>
  );
}

function CameraIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function ExitIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0-4-4m4 4H9" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 20H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h6" />
    </svg>
  );
}

function SunIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="4" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeWidth={1.8} d="M12 2.5V5" />
      <path strokeLinecap="round" strokeWidth={1.8} d="M12 19v2.5" />
      <path strokeLinecap="round" strokeWidth={1.8} d="M4.93 4.93 6.7 6.7" />
      <path strokeLinecap="round" strokeWidth={1.8} d="m17.3 17.3 1.77 1.77" />
      <path strokeLinecap="round" strokeWidth={1.8} d="M2.5 12H5" />
      <path strokeLinecap="round" strokeWidth={1.8} d="M19 12h2.5" />
      <path strokeLinecap="round" strokeWidth={1.8} d="m4.93 19.07 1.77-1.77" />
      <path strokeLinecap="round" strokeWidth={1.8} d="m17.3 6.7 1.77-1.77" />
    </svg>
  );
}

function MoonIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function SystemIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" strokeWidth={1.8} />
      <path d="M8 20h8" strokeLinecap="round" strokeWidth={1.8} />
      <path d="M12 16v4" strokeLinecap="round" strokeWidth={1.8} />
    </svg>
  );
}

export default function Navbar({
  username,
  themeMode,
  resolvedTheme,
  animationsEnabled,
  isScreenshotting,
  onThemeChange,
  onToggleAnimations,
  onScreenshot,
  onLogout,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const scrollFrameRef = useRef<number | null>(null);
  const isScrolledRef = useRef(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function commitScrollState(scrollTop: number): void {
      const nextIsScrolled = scrollTop > 12;
      if (nextIsScrolled === isScrolledRef.current) return;

      isScrolledRef.current = nextIsScrolled;
      startTransition(() => {
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
    function handlePointerDown(event: MouseEvent): void {
      if (themeMenuRef.current?.contains(event.target as Node)) return;
      setIsThemeMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Escape') return;
      setIsThemeMenuOpen(false);
    }

    function handleResize(): void {
      if (window.innerWidth < 768) return;
      setIsThemeMenuOpen(false);
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

  return (
    <nav data-floating-navbar="true" className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div
        data-screenshot-lock="true"
        className={`screenshot-solid-panel screenshot-disable-blur mx-auto flex max-w-[1560px] flex-col gap-3 overflow-visible rounded-[28px] border border-white/68 px-4 py-3.5 transition-[background-color,border-color,box-shadow] duration-300 sm:px-5 min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between min-[768px]:gap-4 dark:border-transparent ${
          isScrolled
            ? 'bg-[rgba(255,255,255,0.92)] shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:bg-[rgba(44,44,46,0.88)]'
            : 'bg-[rgba(255,255,255,0.9)] shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:bg-[rgba(44,44,46,0.82)]'
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 overflow-visible py-1">
          <a href="/" className="group flex min-w-0 items-center gap-3 overflow-visible py-1">
            <AppIcon className="h-11 w-11 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1 overflow-visible">
                <DuoWordmark size="xs" className="shrink-0 max-w-full overflow-visible" />
                <span className="hidden shrink-0 text-[11px] font-medium text-apple-gray6/70 dark:text-white/38 min-[768px]:inline min-[1024px]:-mx-0.5">
                  ·
                </span>
                <div className="hidden min-w-0 truncate text-[11px] text-apple-gray6 dark:text-white/55 min-[768px]:block min-[768px]:max-w-[120px] min-[1024px]:max-w-[240px]">
                  @{username || 'duolingo'}
                </div>
              </div>
              <div className="min-w-0 max-w-[140px] truncate text-[11px] text-apple-gray6 dark:text-white/55 min-[768px]:hidden sm:max-w-[220px]">
                @{username || 'duolingo'}
              </div>
            </div>
          </a>

          <div className="flex items-center gap-2 min-[768px]:hidden">
            <button
              type="button"
              onClick={onScreenshot}
              disabled={isScreenshotting}
              className={`${iconButtonClassName} disabled:cursor-not-allowed disabled:opacity-55`}
              title={isScreenshotting ? 'Capturing screenshot' : 'Capture screenshot'}
              aria-label={isScreenshotting ? 'Capturing screenshot' : 'Capture screenshot'}
            >
              {isScreenshotting ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" className="opacity-25" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="opacity-90" />
                </svg>
              ) : (
                <CameraIcon className="h-4 w-4" />
              )}
            </button>

            <div ref={themeMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen((current) => !current)}
                className={iconButtonClassName}
                title={isThemeMenuOpen ? 'Close menu' : 'Open menu'}
                aria-label={isThemeMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isThemeMenuOpen}
              >
                <MenuIcon open={isThemeMenuOpen} />
              </button>

              <div
                className={`absolute right-0 top-[calc(100%+10px)] w-[220px] transition-[opacity,transform] duration-200 ${
                  isThemeMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
                }`}
              >
                <div className="rounded-[24px] border border-white/75 bg-[rgba(255,255,255,0.96)] p-2 shadow-[0_18px_34px_rgba(15,23,42,0.12)] dark:border-transparent dark:bg-[rgba(44,44,46,0.96)]">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleAnimations();
                      setIsThemeMenuOpen(false);
                    }}
                    className={compactMenuActionClassName}
                  >
                    <span>Motion</span>
                    {animationsEnabled ? <SparkleIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
                  </button>

                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onThemeChange('light');
                        setIsThemeMenuOpen(false);
                      }}
                      className={`${compactThemeOptionClassName} ${themeMode === 'light' ? 'bg-[#111827] text-white shadow-[0_10px_22px_rgba(17,24,39,0.16)] dark:bg-white dark:text-apple-dark1' : ''}`}
                      title="Light"
                      aria-label="Light"
                    >
                      <SunIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onThemeChange('dark');
                        setIsThemeMenuOpen(false);
                      }}
                      className={`${compactThemeOptionClassName} ${themeMode === 'dark' ? 'bg-[#111827] text-white shadow-[0_10px_22px_rgba(17,24,39,0.16)] dark:bg-white dark:text-apple-dark1' : ''}`}
                      title="Dark"
                      aria-label="Dark"
                    >
                      <MoonIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onThemeChange('system');
                        setIsThemeMenuOpen(false);
                      }}
                      className={`${compactThemeOptionClassName} ${themeMode === 'system' ? 'bg-[#111827] text-white shadow-[0_10px_22px_rgba(17,24,39,0.16)] dark:bg-white dark:text-apple-dark1' : ''}`}
                      title="System"
                      aria-label="System"
                    >
                      <div className="relative flex items-center justify-center">
                        <SystemIcon />
                        <span
                          aria-hidden="true"
                          className={`absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full ${resolvedTheme === 'dark' ? 'bg-[#1cb0f6]' : 'bg-[#58cc02]'}`}
                        />
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setIsThemeMenuOpen(false);
                    }}
                    className={`${compactMenuActionClassName} mt-1`}
                  >
                    <span>Exit</span>
                    <ExitIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden shrink-0 items-center justify-end gap-2 min-[768px]:flex min-[1024px]:gap-2.5">
          <button
            type="button"
            onClick={onToggleAnimations}
            className={iconButtonClassName}
            title={animationsEnabled ? '关闭动画' : '开启动画'}
            aria-label={animationsEnabled ? '关闭动画' : '开启动画'}
          >
            {animationsEnabled ? <SparkleIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onScreenshot}
            disabled={isScreenshotting}
            className={`${iconButtonClassName} disabled:cursor-not-allowed disabled:opacity-55`}
            title={isScreenshotting ? '正在截图' : '截图'}
            aria-label={isScreenshotting ? '正在截图' : '截图'}
          >
            {isScreenshotting ? (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" className="opacity-25" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="opacity-90" />
              </svg>
            ) : (
              <CameraIcon className="h-4 w-4" />
            )}
          </button>

          <div className="scale-[0.94] origin-right min-[1024px]:scale-100">
            <ThemeModeControl mode={themeMode} resolvedTheme={resolvedTheme} onChange={onThemeChange} />
          </div>

          <button type="button" onClick={onLogout} className={iconButtonClassName} title="退出" aria-label="退出">
            <ExitIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
