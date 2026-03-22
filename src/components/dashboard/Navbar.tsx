import { useEffect, useState } from 'react';
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
  'flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-white/88 text-apple-gray6 shadow-[0_6px_14px_rgba(15,23,42,0.04)] transition-all duration-200 hover:text-apple-dark1 dark:border-white/15 dark:bg-white/12 dark:text-white/72 dark:hover:text-white';

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

  useEffect(() => {
    function handleScroll(): void {
      setIsScrolled(window.scrollY > 12);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div
        className={`screenshot-solid-panel screenshot-disable-blur mx-auto flex max-w-[1560px] flex-col gap-3 overflow-visible rounded-[28px] border px-4 py-3.5 backdrop-blur-md transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
          isScrolled
            ? 'border-white/70 bg-white/72 shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-[rgba(44,44,46,0.72)]'
            : 'border-white/55 bg-white/58 shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:border-white/12 dark:bg-[rgba(44,44,46,0.62)]'
        }`}
      >
        <div className="flex min-w-0 items-center justify-between gap-2 overflow-visible py-1 sm:justify-start sm:gap-3">
          <a href="/" className="group flex items-center gap-1 overflow-visible py-1">
            <AppIcon className="h-11 w-11 shrink-0" />
            <DuoWordmark size="xs" className="shrink-0 max-w-full overflow-visible" />
            <span className="hidden -mx-0.5 shrink-0 text-[11px] font-medium text-apple-gray6/70 dark:text-white/38 sm:inline">-</span>
            <div className="hidden min-w-0 truncate text-[11px] text-apple-gray6 dark:text-white/55 sm:block">@{username || 'duolingo'}</div>
          </a>
        </div>

        <div className="flex items-center justify-end gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onToggleAnimations}
            className={iconButtonClassName}
            title={animationsEnabled ? '关闭动效' : '开启动效'}
            aria-label={animationsEnabled ? '关闭动效' : '开启动效'}
          >
            <span className="text-sm">{animationsEnabled ? '✨' : '⏸'}</span>
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
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>

          <ThemeModeControl mode={themeMode} resolvedTheme={resolvedTheme} onChange={onThemeChange} />

          <button type="button" onClick={onLogout} className={iconButtonClassName} title="退出登录" aria-label="退出登录">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
