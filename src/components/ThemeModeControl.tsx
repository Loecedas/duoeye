import type { ResolvedTheme, ThemeMode } from '../utils/theme';

interface ThemeModeControlProps {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  onChange: (mode: ThemeMode) => void;
}

const shellClassName =
  'flex h-11 items-center gap-1 rounded-2xl border border-black/5 bg-white/88 p-1 text-apple-gray6 shadow-[0_6px_14px_rgba(15,23,42,0.04)] dark:border-white/15 dark:bg-white/12 dark:text-white/72';

function SunIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5" strokeLinecap="round" />
      <path d="M12 19.5V22" strokeLinecap="round" />
      <path d="M4.93 4.93 6.7 6.7" strokeLinecap="round" />
      <path d="m17.3 17.3 1.77 1.77" strokeLinecap="round" />
      <path d="M2 12h2.5" strokeLinecap="round" />
      <path d="M19.5 12H22" strokeLinecap="round" />
      <path d="m4.93 19.07 1.77-1.77" strokeLinecap="round" />
      <path d="m17.3 6.7 1.77-1.77" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SystemIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" strokeLinecap="round" />
      <path d="M12 16v4" strokeLinecap="round" />
    </svg>
  );
}

function getOptionClassName(active: boolean) {
  if (active) {
    return 'bg-[#111827] text-white shadow-[0_8px_20px_rgba(17,24,39,0.14)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(17,24,39,0.2)] dark:bg-white dark:text-apple-dark1 dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.22)]';
  }

  return 'text-apple-gray6 hover:-translate-y-0.5 hover:text-apple-dark1 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] dark:text-white/72 dark:hover:text-white dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.22)]';
}

export default function ThemeModeControl({ mode, resolvedTheme, onChange }: ThemeModeControlProps) {
  const systemTitle = `跟随系统（当前${resolvedTheme === 'dark' ? '深色' : '浅色'}）`;

  return (
    <div className={shellClassName} role="group" aria-label="主题模式">
      <button
        type="button"
        onClick={() => onChange('light')}
        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${getOptionClassName(mode === 'light')}`}
        aria-label="浅色模式"
        title="浅色模式"
      >
        <SunIcon />
      </button>
      <button
        type="button"
        onClick={() => onChange('dark')}
        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${getOptionClassName(mode === 'dark')}`}
        aria-label="深色模式"
        title="深色模式"
      >
        <MoonIcon />
      </button>
      <button
        type="button"
        onClick={() => onChange('system')}
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${getOptionClassName(mode === 'system')}`}
        aria-label={systemTitle}
        title={systemTitle}
      >
        <SystemIcon />
        {mode === 'system' ? (
          <span
            aria-hidden="true"
            className={`absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full ${resolvedTheme === 'dark' ? 'bg-[#1cb0f6]' : 'bg-[#58cc02]'}`}
          />
        ) : null}
      </button>
    </div>
  );
}
