import type { CSSProperties, ReactNode } from 'react';

interface EmojiIconProps {
  symbol: string;
  className?: string;
  label?: string;
  tone?: 'intrinsic' | 'inherit';
}

interface LanguageBadgeIconProps {
  emoji: string;
  languageCode: string;
  className?: string;
  label?: string;
}

function Wrapper({
  className,
  label,
  style,
  children,
}: {
  className: string;
  label?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <span aria-hidden={label ? undefined : 'true'} aria-label={label} className={className} style={style}>
      {children}
    </span>
  );
}

function getGlyphClassName(): string {
  return 'block h-[1.22em] w-[1.22em] shrink-0';
}

function getFrameClassName(className: string): string {
  return `${className} relative inline-flex h-[1em] w-[1em] shrink-0 items-center justify-center overflow-visible align-middle leading-none`;
}

function getContentClassName(): string {
  return 'pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center leading-none';
}

function getIntrinsicColor(symbol: string): string | undefined {
  switch (symbol) {
    case '\u{1F525}':
      return '#ff6b35';
    case '\u{1F680}':
      return '#7c5cff';
    case '\u{1F3AF}':
      return '#ef4444';
    case '\u{1F3C6}':
    case '\u{2B50}':
    case '\u{1F31F}':
    case '\u{1F3C5}':
    case '\u{1F947}':
    case '\u{1F396}\u{FE0F}':
    case '\u{1F4DA}':
    case '\u{1F451}':
      return '#f59e0b';
    case '\u{26A1}':
      return '#58cc02';
    case '\u{1F4A5}':
      return '#f97316';
    case '\u{1F30D}':
    case '\u{1F310}':
      return '#1cb0f6';
    case '\u{1F512}':
      return '#9ca3af';
    case '\u{2728}':
      return '#a855f7';
    case '\u{1F4C8}':
    case '\u{1F4CA}':
      return '#1cb0f6';
    case '\u{1F5D3}':
      return '#a572f7';
    case '\u{23F1}':
    case '\u{23F1}\u{FE0F}':
    case '\u{231B}':
      return '#1cb0f6';
    case '\u{1F989}':
      return '#58cc02';
    default:
      return undefined;
  }
}

function Glyph({ symbol }: { symbol: string }) {
  const className = getGlyphClassName();

  switch (symbol) {
    case '\u{1F525}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case '\u{1F680}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="M14 4c3.5 0 6 2.5 6 6-2.4 1.4-5.2 2.4-8.2 2.8L8 17l-1-4-4-1 4.2-3.8C7.6 5.2 8.6 2.4 10 0c3.5 0 4 .5 4 4Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform="translate(1 2)" />
          <circle cx="15" cy="9" r="1.6" strokeWidth="1.7" />
          <path d="M7 16 4 20" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F3AF}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <circle cx="12" cy="12" r="8.5" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="4.5" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <path d="m13 11 6-6" strokeWidth="1.7" strokeLinecap="round" />
          <path d="m15 5 4 0 0 4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case '\u{1F3C6}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8 6H5a2 2 0 0 0 2 4h1M16 6h3a2 2 0 0 1-2 4h-1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 11v4M9 20h6M10 15h4v5h-4z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case '\u{2B50}':
    case '\u{1F31F}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.3 6.7 19l1-5.7-4.2-4.1 5.9-.9L12 3Z" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    case '\u{1F3C5}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="M8 3h3l1 4H9L8 3Zm8 0-1 4h-3l1-4h3Z" strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="12" cy="15" r="5" strokeWidth="1.8" />
          <path d="m12 12 1.2 2.3 2.5.4-1.8 1.8.4 2.5-2.3-1.2-2.3 1.2.4-2.5-1.8-1.8 2.5-.4L12 12Z" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case '\u{1F947}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="M8 3h3l1 4H9L8 3Zm8 0-1 4h-3l1-4h3Z" strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="12" cy="15" r="5" strokeWidth="1.8" />
          <path d="M12 12.4v5.2M10.5 14h1.5a1 1 0 0 0 0-2h-1" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case '\u{1F396}\u{FE0F}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="m9 3 3 4 3-4 2 5-5 3-5-3 2-5Z" strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="12" cy="16" r="4.5" strokeWidth="1.8" />
          <path d="m12 13.6 1 1.9 2.1.3-1.5 1.5.4 2.1-2-1-2 1 .4-2.1-1.5-1.5 2.1-.3 1-1.9Z" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    case '\u{26A1}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case '\u{1F4A5}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="m12 2 1.8 5 5.2-1.6-1.6 5.2L22 12l-4.6 1.4 1.6 5.2-5.2-1.6L12 22l-1.8-5-5.2 1.6 1.6-5.2L2 12l4.6-1.4-1.6-5.2 5.2 1.6L12 2Z" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case '\u{1F451}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="m4 15.5 1.7-8 4.3 4 2-6 2 6 4.3-4L20 15.5H4Z" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M5 18.5h14" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F30D}':
    case '\u{1F310}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F512}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <rect x="5" y="10.5" width="14" height="10" rx="2" strokeWidth="1.8" />
          <path d="M8 10.5v-3a4 4 0 1 1 8 0v3" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case '\u{2728}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="m12 3 1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="m18.5 15 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case '\u{1F4DA}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <rect x="3.5" y="8" width="4.5" height="12" rx="1" strokeWidth="1.8" />
          <rect x="10" y="5" width="4.5" height="15" rx="1" strokeWidth="1.8" />
          <rect x="16.5" y="7" width="4.5" height="13" rx="1" strokeWidth="1.8" />
          <path d="M3.5 11h4.5M10 8h4.5M16.5 10h4.5" strokeWidth="1.8" />
          <path d="M2 20h20" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F4C8}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="M4 19h16" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m6 15 4-4 3 2 5-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 7h2v2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case '\u{1F5D3}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <rect x="4" y="5" width="16" height="15" rx="2.5" strokeWidth="1.8" />
          <path d="M8 3v4M16 3v4M4 10h16" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F4CA}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="M4 20h16" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M7 20v-7M12 20V8M17 20v-4" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case '\u{23F1}':
    case '\u{23F1}\u{FE0F}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <circle cx="12" cy="13" r="7" strokeWidth="1.8" />
          <path d="M12 13V9m0-6h3M9 3h3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case '\u{231B}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="M7 4.5h10l-4 7.5 4 7.5H7l4-7.5Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case '\u{1F989}':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="10" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="13" cy="10" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="17" cy="10" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

export default function EmojiIcon({
  symbol,
  className = 'inline-flex items-center justify-center leading-none',
  label,
  tone = 'intrinsic',
}: EmojiIconProps) {
  const glyph = <Glyph symbol={symbol} />;
  
  if (!glyph) {
    return (
      <Wrapper className={getFrameClassName(className)} label={label}>
        <span className={getContentClassName()}>
          <span className="block leading-none">{symbol}</span>
        </span>
      </Wrapper>
    );
  }

  const style = tone === 'intrinsic' ? { color: getIntrinsicColor(symbol) } : undefined;

  return (
    <Wrapper className={getFrameClassName(className)} label={label} style={style}>
      <span className={`${getContentClassName()} duo-emoji-native`}>
        <span className="block leading-none" style={tone === 'intrinsic' ? { color: 'initial' } : undefined}>{symbol}</span>
      </span>
      <span className={`${getContentClassName()} duo-emoji-svg`}>
        {glyph}
      </span>
    </Wrapper>
  );
}

export function LanguageBadgeIcon({
  emoji,
  languageCode,
  className = 'inline-flex items-center justify-center leading-none',
  label,
}: LanguageBadgeIconProps) {
  return (
    <Wrapper className={`${className} inline-flex items-center justify-center leading-none`} label={label}>
      <span className="duo-emoji-native block">{emoji}</span>
      <span className="duo-emoji-svg inline-flex min-w-[1.6em] items-center justify-center rounded-[0.45em] border border-current/16 bg-current/8 px-[0.22em] py-[0.12em] text-[0.42em] font-black uppercase tracking-[0.12em] text-current">
        {languageCode.slice(0, 2) || '?'}
      </span>
    </Wrapper>
  );
}
