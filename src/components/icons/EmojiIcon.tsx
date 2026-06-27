import { useId, type CSSProperties, type ReactNode } from 'react';
import { useEmojiIconMode } from './EmojiMode';

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
    case '\u{265F}\u{FE0F}':
    case '\u{265F}':
      return '#5b6cff';
    case '\u{1F522}':
      return '#1cb0f6';
    case '\u{1F3B5}':
      return '#a855f7';
    case '\u{1F9ED}':
      return '#4e98ff';
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
    case '\u{23F3}':
    case '\u{23F3}\u{FE0F}':
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
  const uid = useId().replace(/:/g, '');

  const PlasticFilter = ({ id }: { id: string }) => (
    <filter id={id} primitiveUnits="userSpaceOnUse" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="blur" />
      <feOffset dx="-0.6" dy="-0.6" result="offset" />
      <feComposite in="SourceGraphic" in2="offset" operator="over" />
    </filter>
  );

  const SharpPlasticFilter = ({ id }: { id: string }) => (
    <filter id={id} primitiveUnits="userSpaceOnUse" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.2" result="blur" />
      <feOffset dx="-0.4" dy="-0.4" result="offset" />
      <feComposite in="SourceGraphic" in2="offset" operator="over" />
    </filter>
  );

  switch (symbol) {
    case '\u{1F525}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-flame-shell`} x1="22" y1="10" x2="42" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9B4D" />
              <stop offset="0.5" stopColor="#FF6A00" />
              <stop offset="1" stopColor="#E63900" />
            </linearGradient>
            <linearGradient id={`${uid}-flame-core`} x1="31" y1="20" x2="34" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFCE5" />
              <stop offset="1" stopColor="#FFD200" />
            </linearGradient>
          </defs>
          <path
            filter={`url(#${uid}-p)`}
            d="M36.1 8c1.8 6.4 5.5 10.6 8.9 14.4 4.1 4.7 6 8.8 6 14.1C51 46 42.5 54 31.8 54 21.3 54 13 46.3 13 36.4c0-4.6 1.5-8.9 4.2-12.2 1.7-2.1 3.8-4.4 5.3-7.5 1.1-2.3 1.8-4.6 1.9-6.7 6.1 3.1 10 8.4 10.4 15.3 1.9-2.3 3.1-5.4 3.5-9.3Z"
            fill={`url(#${uid}-flame-shell)`}
            stroke="#C42B00"
            strokeWidth="0.5"
          />
          <path
            d="M32.1 23.3c4 3.3 6.4 6.8 6.4 11 0 6.2-4 10.9-9.8 10.9-5.3 0-9.1-4-9.1-9.1 0-3.4 1.5-6.1 4.1-8.7 1.5-1.5 2.8-3.4 3.7-5.8 1.5 1.1 2.8 2.3 4.7 4.2Z"
            fill={`url(#${uid}-flame-core)`}
          />
          <path
            d="M25.7 16.6c2.9 1.9 5.1 4.3 6.8 7.4 1.6-1.6 2.8-4 3.6-7"
            stroke="white"
            strokeOpacity="0.6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case '\u{1F680}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-rocket-body`} x1="24" y1="10" x2="40" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.3" stopColor="#F8FAFC" />
              <stop offset="0.75" stopColor="#E2E8F0" />
              <stop offset="1" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id={`${uid}-rocket-nose`} x1="25" y1="10" x2="39" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF6B6B" />
              <stop offset="0.5" stopColor="#FF4B4B" />
              <stop offset="1" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id={`${uid}-rocket-wing`} x1="18" y1="37" x2="24" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF8C00" />
              <stop offset="1" stopColor="#E63900" />
            </linearGradient>
            <linearGradient id={`${uid}-rocket-wing-right`} x1="40" y1="37" x2="46" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF8C00" />
              <stop offset="1" stopColor="#E63900" />
            </linearGradient>
            <linearGradient id={`${uid}-rocket-flame-outer`} x1="29" y1="48" x2="35" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9600" />
              <stop offset="0.5" stopColor="#FF4B4B" />
              <stop offset="1" stopColor="#D91A1A" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${uid}-rocket-flame-inner`} x1="30.5" y1="48" x2="33.5" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF9C4" />
              <stop offset="0.6" stopColor="#FFEB3B" />
              <stop offset="1" stopColor="#FF9800" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={`${uid}-porthole-glow`} cx="32" cy="26" r="3.5" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) scale(1)">
              <stop stopColor="#A5F3FC" />
              <stop offset="0.7" stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#0369A1" />
            </radialGradient>
          </defs>
          
          <g transform="translate(32, 32) rotate(45) translate(-32, -32)">
            {/* Flames */}
            <path d="M 29,48 C 26,52 28,58 32,60 C 36,58 38,52 35,48 Q 32,50 29,48 Z" fill={`url(#${uid}-rocket-flame-outer)`} />
            <path d="M 30.5,48 C 29,51 30.5,55 32,56 C 33.5,55 35,51 33.5,48 Q 32,49 30.5,48 Z" fill={`url(#${uid}-rocket-flame-inner)`} />
            
            {/* Fins / Wings */}
            <path filter={`url(#${uid}-p)`} d="M 24,37 C 20,38 18,42 18,46 C 18,47 19,47 21,46 L 24,43 Z" fill={`url(#${uid}-rocket-wing)`} stroke="#B32D00" strokeWidth="0.4" />
            <path filter={`url(#${uid}-p)`} d="M 40,37 C 44,38 46,42 46,46 C 46,47 45,47 43,46 L 40,43 Z" fill={`url(#${uid}-rocket-wing-right)`} stroke="#B32D00" strokeWidth="0.4" />
            
            {/* Engine Nozzle */}
            <path d="M 28,44 L 36,44 L 35,48 L 29,48 Z" fill="#475569" stroke="#334155" strokeWidth="0.4" />
            
            {/* Rocket Body */}
            <path
              filter={`url(#${uid}-p)`}
              d="M 24,44 C 24,30 25,18 32,10 C 39,18 40,30 40,44 Q 32,46.5 24,44 Z"
              fill={`url(#${uid}-rocket-body)`}
              stroke="#64748B"
              strokeWidth="0.4"
            />
            
            {/* Nosecone */}
            <path
              d="M 25.2,24 C 27.5,17 29.5,10 32,10 C 34.5,10 36.5,17 38.8,24 Q 32,26.5 25.2,24 Z"
              fill={`url(#${uid}-rocket-nose)`}
              stroke="#B91C1C"
              strokeWidth="0.4"
            />
            
            {/* Highlight Line */}
            <path d="M 26,38 C 25.3,29 27.3,19 31.2,13" stroke="white" strokeOpacity="0.45" strokeWidth="1" strokeLinecap="round" fill="none" />
            
            {/* Porthole */}
            <circle cx="32" cy="26" r="5" fill="#E2E8F0" stroke="#475569" strokeWidth="0.6" />
            <circle cx="32" cy="26" r="3.6" fill={`url(#${uid}-porthole-glow)`} />
            <path d="M 30.2,25.2 A 1.8 1.8 0 0 1 33.5,24" stroke="white" strokeWidth="0.6" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      );
    case '\u{1F3AF}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <radialGradient id={`${uid}-target-core`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(28 30) rotate(45) scale(30)">
              <stop stopColor="#FF9BAD" />
              <stop offset="0.5" stopColor="#E63955" />
              <stop offset="1" stopColor="#CC001F" />
            </radialGradient>
            <linearGradient id={`${uid}-target-ring`} x1="18" y1="14" x2="46" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFCB4D" />
              <stop offset="1" stopColor="#E67E1F" />
            </linearGradient>
          </defs>
          <circle filter={`url(#${uid}-p)`} cx="28" cy="36" r="17" fill={`url(#${uid}-target-ring)`} stroke="#C45A00" strokeWidth="0.5" />
          <circle cx="28" cy="36" r="10.2" fill="white" />
          <circle cx="28" cy="36" r="5.6" fill={`url(#${uid}-target-core)`} />
          <path filter={`url(#${uid}-p)`} d="m34.8 29.6 11.7-11.7c1.3-1.3 3.5-.7 4 1.1l1.4 5.2c.2.8 0 1.6-.6 2.2L39.6 38.2c-.5.5-1.1.7-1.8.7h-4.1v-4.1c0-.7.3-1.3.7-1.8Z" fill={`url(#${uid}-target-core)`} />
          <path d="M45.2 17.6 51 23.4" stroke="white" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F3C6}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-trophy-cup`} x1="20" y1="11" x2="44" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFEB8A" />
              <stop offset="0.5" stopColor="#FFBB00" />
              <stop offset="1" stopColor="#E68A00" />
            </linearGradient>
            <linearGradient id={`${uid}-trophy-base`} x1="27" y1="40" x2="38" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9D4D" />
              <stop offset="1" stopColor="#E65C00" />
            </linearGradient>
          </defs>
          <path filter={`url(#${uid}-p)`} d="M20 13h24v8c0 7.7-5.4 14-12 14s-12-6.3-12-14v-8Z" fill={`url(#${uid}-trophy-cup)`} stroke="#B36200" strokeWidth="0.5" />
          <path d="M20 18h-4c-3.3 0-6 2.7-6 6s2.7 6 6 6h4M44 18h4c3.3 0 6 2.7 6 6s-2.7 6-6 6h-4" stroke="#FF9D00" strokeWidth="4.5" strokeLinecap="round" />
          <path filter={`url(#${uid}-p)`} d="M28 37h8v7c0 1.7 1.3 3 3 3h1c1.7 0 3 1.3 3 3v1H21v-1c0-1.7 1.3-3 3-3h1c1.7 0 3-1.3 3-3v-7Z" fill={`url(#${uid}-trophy-base)`} stroke="#B34700" strokeWidth="0.5" />
          <path d="M22 17.5c4-2 16-2 20 0" stroke="white" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case '\u{2B50}':
    case '\u{1F31F}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-star-fill`} x1="22" y1="14" x2="42" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF48A" />
              <stop offset="0.5" stopColor="#FFBB00" />
              <stop offset="1" stopColor="#E68A00" />
            </linearGradient>
          </defs>
          <path filter={`url(#${uid}-p)`} d="m32 10 6.2 12.5 13.8 2-10 9.7 2.4 13.7L32 41.3 19.6 48l2.4-13.8-10-9.7 13.8-2L32 10Z" fill={`url(#${uid}-star-fill)`} stroke="#B36200" strokeWidth="0.5" />
          <path d="M25.7 19.5c2-.8 4.1-1.2 6.3-1.2 4.2 0 8.2 1.6 11.2 4.4" stroke="white" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F3C5}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-medal-ribbon-left`} x1="16" y1="10" x2="29" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6B79FF" />
              <stop offset="1" stopColor="#9C3BFF" />
            </linearGradient>
            <linearGradient id={`${uid}-medal-ribbon-right`} x1="48" y1="10" x2="35" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3BBDFF" />
              <stop offset="1" stopColor="#29D69E" />
            </linearGradient>
            <radialGradient id={`${uid}-medal-body`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 38) rotate(90) scale(18)">
              <stop stopColor="#FFF28A" />
              <stop offset="0.6" stopColor="#FFB000" />
              <stop offset="1" stopColor="#CC7A00" />
            </radialGradient>
          </defs>
          <path d="M18 10c0-1.7 1.3-3 3-3h8c1.4 0 2.5.9 2.9 2.2L35 22c.3 1-.5 2-1.6 2h-7.9c-1 0-1.8-.7-2-1.7L18 10Z" fill={`url(#${uid}-medal-ribbon-left)`} />
          <path d="M46 10c0-1.7-1.3-3-3-3h-8c-1.4 0-2.5.9-2.9 2.2L29 22c-.3 1 .5 2 1.6 2h7.9c1 0 1.8-.7 2-1.7L46 10Z" fill={`url(#${uid}-medal-ribbon-right)`} />
          <circle filter={`url(#${uid}-p)`} cx="32" cy="38" r="16" fill={`url(#${uid}-medal-body)` } stroke="#995C00" strokeWidth="0.5" />
          <path d="m32 27.6 3.4 6.8 7.5 1.1-5.4 5.2 1.3 7.4-6.8-3.5-6.8 3.5 1.3-7.4-5.4-5.2 7.5-1.1 3.4-6.8Z" fill="white" fillOpacity="0.4" />
          <path d="M25.4 25.7c2.1-.8 4.3-1.2 6.6-1.2 5.7 0 10.9 2.4 14.4 6.3" stroke="white" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F947}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-gold-ribbon-left`} x1="17" y1="10" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF6B5C" />
              <stop offset="1" stopColor="#E6394F" />
            </linearGradient>
            <linearGradient id={`${uid}-gold-ribbon-right`} x1="47" y1="10" x2="36" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5CD6FF" />
              <stop offset="1" stopColor="#3B8FFF" />
            </linearGradient>
            <radialGradient id={`${uid}-gold-medal`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 38) rotate(90) scale(17)">
              <stop stopColor="#FFF28A" />
              <stop offset="0.6" stopColor="#FFB000" />
              <stop offset="1" stopColor="#CC7A00" />
            </radialGradient>
          </defs>
          <path d="M18 10c0-1.7 1.3-3 3-3h7.8c1.4 0 2.5.9 2.9 2.2L34.6 21c.3 1-.5 2-1.6 2h-7.3c-1 0-1.8-.7-2-1.7L18 10Z" fill={`url(#${uid}-gold-ribbon-left)`} />
          <path d="M46 10c0-1.7-1.3-3-3-3h-7.8c-1.4 0-2.5.9-2.9 2.2L29.4 21c-.3 1 .5 2 1.6 2h7.3c1 0 1.8-.7 2-1.7L46 10Z" fill={`url(#${uid}-gold-ribbon-right)`} />
          <circle filter={`url(#${uid}-p)`} cx="32" cy="38" r="15.5" fill={`url(#${uid}-gold-medal)`} stroke="#995C00" strokeWidth="0.5" />
          <path d="M30.4 30.7h5.2v14.6h-3.8V34.8h-1.4v-4.1Z" fill="white" />
        </svg>
      );
    case '\u{1F396}\u{FE0F}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-honor-top`} x1="21" y1="11" x2="43" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ADFFF" />
              <stop offset="1" stopColor="#3B8FFF" />
            </linearGradient>
            <linearGradient id={`${uid}-honor-bottom`} x1="24" y1="30" x2="42" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFDC4D" />
              <stop offset="1" stopColor="#E68A00" />
            </linearGradient>
          </defs>
          <path filter={`url(#${uid}-p)` } d="m24 11 8 10 8-10 4 12-12 7-12-7 4-12Z" fill={`url(#${uid}-honor-top)`} stroke="#2D6DB3" strokeWidth="0.5" />
          <circle filter={`url(#${uid}-p)`} cx="32" cy="39" r="12.5" fill={`url(#${uid}-honor-bottom)`} stroke="#B36200" strokeWidth="0.5" />
          <path d="m32 30.7 2.5 4.9 5.4.8-3.9 3.8.9 5.3-4.9-2.5-4.9 2.5.9-5.3-3.9-3.8 5.4-.8 2.5-4.9Z" fill="white" fillOpacity="0.5" />
        </svg>
      );
    case '\u{26A1}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-bolt-shell`} x1="21" y1="8" x2="43" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ED957" />
              <stop offset="0.5" stopColor="#48A302" />
              <stop offset="1" stopColor="#1E8C00" />
            </linearGradient>
            <linearGradient id={`${uid}-bolt-core`} x1="28" y1="13" x2="34" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5FFCC" />
              <stop offset="1" stopColor="#D9FF33" />
            </linearGradient>
          </defs>
          <path
            filter={`url(#${uid}-p)`}
            d="M37.2 8c1.5 0 2.6 1.4 2.3 2.8L37 26h10c1.9 0 3 2.1 1.9 3.7L29 55.3c-1.5 2-4.6.7-4.2-1.8L28 38H17.7c-1.8 0-3-2-2-3.5L35 9.1c.5-.7 1.3-1.1 2.2-1.1Z"
            fill={`url(#${uid}-bolt-shell)`}
            stroke="#1E8C00"
            strokeWidth="0.5"
          />
          <path
            d="M34.6 12.4h3.4L35.8 25c-.2 1.3.8 2.5 2.1 2.5h5.3L29.3 45.8l2.1-10.8c.2-1.3-.8-2.5-2.1-2.5h-7L34.6 12.4Z"
            fill={`url(#${uid}-bolt-core)`}
          />
          <path d="M35 13 25.2 29.1h8" stroke="white" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case '\u{1F4A5}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-burst-fill`} x1="18" y1="15" x2="46" y2="49" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFEB8A" />
              <stop offset="0.5" stopColor="#FF9D00" />
              <stop offset="1" stopColor="#E63900" />
            </linearGradient>
          </defs>
          <path filter={`url(#${uid}-p)`} d="m32 8 4.5 11 12-3.8-3.8 12L56 32l-11.3 4.8 3.8 12-12-3.8L32 56l-4.5-11-12 3.8 3.8-12L8 32l11.3-4.8-3.8-12 12 3.8L32 8Z" fill={`url(#${uid}-burst-fill)`} stroke="#B32B00" strokeWidth="0.5" />
          <circle cx="32" cy="32" r="7" fill="white" fillOpacity="0.4" />
        </svg>
      );
    case '\u{1F451}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-crown-fill`} x1="16" y1="17" x2="48" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFEB8A" />
              <stop offset="0.5" stopColor="#FFBB00" />
              <stop offset="1" stopColor="#E68A00" />
            </linearGradient>
          </defs>
          <path filter={`url(#${uid}-p)`} d="m16 42 4-18 10 8 5-16 6 16 9-8 4 18c.6 2.7-1.5 5.2-4.2 5.2H20.2c-2.7 0-4.8-2.5-4.2-5.2Z" fill={`url(#${uid}-crown-fill)` } stroke="#B36200" strokeWidth="0.5" />
          <circle cx="20" cy="23" r="3.2" fill="white" />
          <circle cx="35" cy="15.5" r="3.2" fill="white" />
          <circle cx="50" cy="23" r="3.2" fill="white" />
          <path d="M20 50h30" stroke="white" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F30D}':
    case '\u{1F310}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <radialGradient id={`${uid}-globe-ocean`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 18) rotate(54) scale(38)">
              <stop stopColor="#7ADFFF" />
              <stop offset="0.6" stopColor="#2D6DB3" />
              <stop offset="1" stopColor="#1E4799" />
            </radialGradient>
            <linearGradient id={`${uid}-globe-land`} x1="20" y1="20" x2="45" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ED957" />
              <stop offset="1" stopColor="#3E8C02" />
            </linearGradient>
          </defs>
          <circle filter={`url(#${uid}-p)`} cx="32" cy="32" r="21" fill={`url(#${uid}-globe-ocean)`} stroke="#1E4799" strokeWidth="0.5" />
          <path d="M23 22.8c2.8-3.2 8.8-5.8 12.1-2.9 1.9 1.7 4.8 2.2 6.8 4.2 2.1 2.2 2 5.1.4 7-1.5 1.9-4.4 1.8-6.7 2.3-2.7.5-4.8 2.4-7.4 3.4-2.4.9-5.3.8-7.2-1.1-3.4-3.5-.7-9.8 2-12.9Z" fill={`url(#${uid}-globe-land)`} />
          <path d="M35.7 37.6c2.1-1.7 5.3-1.9 7.3-.3 2.7 2.1 3.3 6.4.8 9.2-1.7 2-4.9 3.4-8.1 2.8-2.5-.4-4.7-2.1-5-4.5-.4-2.9 2.8-5 5-7.2Z" fill={`url(#${uid}-globe-land)`} />
          <path d="M22.4 17.8c2.9-1.9 6.4-3 10.1-3 7 0 13.2 3.6 16.9 9" stroke="white" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F512}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-lock-body`} x1="20" y1="26" x2="44" y2="53" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E6EDFF" />
              <stop offset="0.5" stopColor="#7E9EFF" />
              <stop offset="1" stopColor="#4D5FFF" />
            </linearGradient>
          </defs>
          <rect filter={`url(#${uid}-p)`} x="17" y="28" width="30" height="24" rx="8" fill={`url(#${uid}-lock-body)`} stroke="#3D4BB3" strokeWidth="0.5" />
          <path d="M23 28v-5c0-5 4-9 9-9s9 4 9 9v5" stroke="#7E9EFF" strokeWidth="5" strokeLinecap="round" />
          <path d="M32 37.5a3.8 3.8 0 0 1 2.2 6.9v3.1a2.2 2.2 0 0 1-4.4 0v-3.1a3.8 3.8 0 0 1 2.2-6.9Z" fill="#1E2A4D" />
        </svg>
      );
    case '\u{265F}\u{FE0F}':
    case '\u{265F}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <SharpPlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-chess-g`} x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#475569" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          {/* Adjusted Proportions Pawn */}
          <g filter={`url(#${uid}-p)`}>
            {/* Sturdier Body */}
            <path d="M22 50 L42 50 L36 21 L28 21 Z" fill={`url(#${uid}-chess-g)` } stroke="#020617" strokeWidth="0.5" />
            {/* Smaller Head */}
            <circle cx="32" cy="16" r="6.5" fill={`url(#${uid}-chess-g)`} stroke="#020617" strokeWidth="0.5" />
            {/* Wider Base */}
            <rect x="18" y="50" width="28" height="6" rx="3" fill={`url(#${uid}-chess-g)`} stroke="#020617" strokeWidth="0.5" />
          </g>
          {/* Top Highlight */}
          <circle cx="30" cy="14" r="2.5" fill="white" fillOpacity="0.2" />
        </svg>
      );
    case '\u{1F522}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <SharpPlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-math-g`} x1="32" y1="10" x2="32" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#0369A1" />
            </linearGradient>
          </defs>
          <rect filter={`url(#${uid}-p)`} x="14" y="10" width="36" height="44" rx="10" fill={`url(#${uid}-math-g)`} stroke="#082F49" strokeWidth="0.5" />
          <rect x="20" y="16" width="24" height="12" rx="4" fill="#E0F2FE" />
          <path d="M24 22h8" stroke="#0369A1" strokeWidth="3" strokeLinecap="round" />
          <rect x="20" y="32" width="10" height="8" rx="3" fill="#BAE6FD" />
          <rect x="34" y="32" width="10" height="8" rx="3" fill="#BAE6FD" />
          <rect x="20" y="42" width="10" height="8" rx="3" fill="#BAE6FD" />
          <rect x="34" y="42" width="10" height="8" rx="3" fill="#FF9600" />
          <path d="M18 13h28" stroke="white" strokeOpacity="0.5" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case '\u{2728}':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-sparkle`} x1="0" y1="0" x2="24" y2="24">
              <stop stopColor="#D98AFF" />
              <stop offset="1" stopColor="#7E3BFF" />
            </linearGradient>
          </defs>
          <path filter={`url(#${uid}-p)`} d="m12 3 1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" fill="url(#${uid}-sparkle)" stroke="#4D1E99" strokeWidth="0.5" />
          <path filter={`url(#${uid}-p)`} d="m18.5 15 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" fill="url(#${uid}-sparkle)" stroke="#4D1E99" strokeWidth="0.5" />
        </svg>
      );
    case '\u{1F4DA}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-book-left`} x1="14" y1="18" x2="29" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ADFFF" />
              <stop offset="1" stopColor="#1E4799" />
            </linearGradient>
            <linearGradient id={`${uid}-book-center`} x1="22" y1="15" x2="38" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ED957" />
              <stop offset="1" stopColor="#1E8C00" />
            </linearGradient>
            <linearGradient id={`${uid}-book-right`} x1="35" y1="18" x2="50" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFCB4D" />
              <stop offset="1" stopColor="#E65C00" />
            </linearGradient>
          </defs>
          <path filter={`url(#${uid}-p)`} d="M14.4 23.3c0-3.4 2.8-6.2 6.2-6.2h8.2c1.8 0 3.2 1.4 3.2 3.2v25.1c0 1.8-1.4 3.2-3.2 3.2h-9c-3 0-5.4-2.4-5.4-5.4V23.3Z" fill={`url(#${uid}-book-left)`} transform="rotate(-7 23 32)" stroke="#1E4799" strokeWidth="0.5" />
          <path filter={`url(#${uid}-p)`} d="M23 16.5c0-3.6 2.9-6.5 6.5-6.5h9.2c1.9 0 3.3 1.5 3.3 3.3v30.9c0 1.9-1.5 3.3-3.3 3.3h-9.7c-3.3 0-6-2.7-6-6V16.5Z" fill={`url(#${uid}-book-center)`} stroke="#1E8C00" strokeWidth="0.5" />
          <path filter={`url(#${uid}-p)`} d="M33 23.5c0-3.3 2.7-6 6-6h7.8c1.7 0 3.1 1.4 3.1 3.1v24.3c0 1.7-1.4 3.1-3.1 3.1h-8.6c-2.9 0-5.2-2.3-5.2-5.2V23.5Z" fill={`url(#${uid}-book-right)`} transform="rotate(7 41 32)" stroke="#B34700" strokeWidth="0.5" />
          <path d="M27.8 15.4v24.8M38 15.4v24.8M45.8 20.8v22" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F4C8}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-trend-base`} x1="14" y1="44" x2="52" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ED957" />
              <stop offset="0.5" stopColor="#3B8FFF" />
              <stop offset="1" stopColor="#1E4799" />
            </linearGradient>
          </defs>
          <path d="M14 48h36" stroke="#DDE7FF" strokeWidth="5" strokeLinecap="round" />
          <path filter={`url(#${uid}-p)`} d="M18 40.5 28 30l8 6 13-15" stroke={`url(#${uid}-trend-base)`} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path filter={`url(#${uid}-p)`} d="M43 20h6v6" stroke={`url(#${uid}-trend-base)` } strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="28" cy="30" r="3" fill="white" />
        </svg>
      );
    case '\u{1F5D3}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-calendar-head`} x1="18" y1="10" x2="46" y2="23" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9C3BFF" />
              <stop offset="1" stopColor="#5C3BFF" />
            </linearGradient>
            <linearGradient id={`${uid}-calendar-body`} x1="20" y1="22" x2="44" y2="53" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5F8FF" />
              <stop offset="1" stopColor="#DDE7FF" />
            </linearGradient>
          </defs>
          <rect filter={`url(#${uid}-p)`} x="15" y="14" width="34" height="38" rx="10" fill={`url(#${uid}-calendar-body)`} stroke="#B3C1FF" strokeWidth="0.5" />
          <path filter={`url(#${uid}-p)`} d="M15 24c0-5.5 4.5-10 10-10h14c5.5 0 10 4.5 10 10v6H15v-6Z" fill={`url(#${uid}-calendar-head)`} stroke="#3D1E99" strokeWidth="0.5" />
          <path d="M23 11v8M41 11v8" stroke="#7E5CFF" strokeWidth="5" strokeLinecap="round" />
          <path d="M24 36h16M24 43h10" stroke="#7E9EFF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F4CA}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-chart-bar-a`} x1="16" y1="40" x2="24" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ADFFF" />
              <stop offset="1" stopColor="#1E4799" />
            </linearGradient>
            <linearGradient id={`${uid}-chart-bar-b`} x1="28" y1="28" x2="36" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ED957" />
              <stop offset="1" stopColor="#1E8C00" />
            </linearGradient>
            <linearGradient id={`${uid}-chart-bar-c`} x1="40" y1="20" x2="49" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFCB4D" />
              <stop offset="1" stopColor="#E65C00" />
            </linearGradient>
          </defs>
          <rect filter={`url(#${uid}-p)`} x="14" y="32" width="10" height="20" rx="5" fill={`url(#${uid}-chart-bar-a)`} stroke="#1E4799" strokeWidth="0.5" />
          <rect filter={`url(#${uid}-p)`} x="27" y="22" width="10" height="30" rx="5" fill={`url(#${uid}-chart-bar-b)` } stroke="#1E8C00" strokeWidth="0.5" />
          <rect filter={`url(#${uid}-p)` } x="40" y="14" width="10" height="38" rx="5" fill={`url(#${uid}-chart-bar-c)`} stroke="#B34700" strokeWidth="0.5" />
          <path d="M13 46 25.5 34l9.5 4.8L49 23" stroke="white" strokeOpacity="0.5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case '\u{23F1}':
    case '\u{23F1}\u{FE0F}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <SharpPlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-timer-g`} x1="32" y1="10" x2="32" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ADFFF" />
              <stop offset="1" stopColor="#1E4799" />
            </linearGradient>
          </defs>
          <g filter={`url(#${uid}-p)`}>
            {/* Body */}
            <circle cx="32" cy="34" r="22" fill={`url(#${uid}-timer-g)`} stroke="#1E4799" strokeWidth="0.5" />
            <circle cx="32" cy="34" r="16" fill="white" />
            {/* Hands */}
            <path d="M32 34V24M32 34l8 8" stroke={`url(#${uid}-timer-g)`} strokeWidth="4" strokeLinecap="round" />
            {/* Top Buttons */}
            <rect x="28" y="8" width="8" height="4" rx="2" fill={`url(#${uid}-timer-g)`} />
            <rect x="44" y="16" width="6" height="4" rx="2" transform="rotate(45 44 16)" fill={`url(#${uid}-timer-g)`} />
          </g>
          {/* Top Highlight */}
          <path d="M22 22c4-4 16-4 20 0" stroke="white" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case '\u{23F3}':
    case '\u{23F3}\u{FE0F}':
    case '\u{231B}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-hourglass-glass`} x1="21" y1="11" x2="45" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ADFFF" />
              <stop offset="1" stopColor="#1E4799" />
            </linearGradient>
            <linearGradient id={`${uid}-hourglass-sand`} x1="31" y1="21" x2="35" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFDC4D" />
              <stop offset="1" stopColor="#E68A00" />
            </linearGradient>
          </defs>
          <rect filter={`url(#${uid}-p)`} x="18" y="10" width="28" height="6" rx="3" fill={`url(#${uid}-hourglass-glass)`} stroke="#1E4799" strokeWidth="0.5" />
          <rect filter={`url(#${uid}-p)`} x="18" y="48" width="28" height="6" rx="3" fill={`url(#${uid}-hourglass-glass)`} stroke="#1E4799" strokeWidth="0.5" />
          <path
            d="M24 16h16c1.1 0 2 .9 2 2 0 .4-.1.8-.3 1.1L35.4 29.4c-1.6 2.4-1.6 2.8 0 5.2l6.3 10.3c.2.3.3.7.3 1.1 0 1.1-.9 2-2 2H24c-1.1 0-2-.9-2-2 0-.4.1-.8.3-1.1l6.3-10.3c1.6-2.4 1.6-2.8 0-5.2l-6.3-10.3A2 2 0 0 1 22 18c0-1.1.9-2 2-2Z"
            fill={`url(#${uid}-hourglass-glass)`}
            fillOpacity="0.6"
          />
          <path d="M26 20h12l-3.7 4.6c-1.2 1.5-3.5 1.5-4.7 0L26 20Z" fill={`url(#${uid}-hourglass-sand)`} />
          <path d="M30.5 30.3c.5-.7 1.5-.7 2 0l1.3 1.8c.7.9.7 2.2 0 3.1L32.5 37c-.5.7-1.5.7-2 0l-1.3-1.8c-.7-.9-.7-2.2 0-3.1l1.3-1.8Z" fill={`url(#${uid}-hourglass-sand)`} />
          <path d="M26 44h12l-1.7-2.2c-1.9-2.5-5.7-2.5-7.6 0L26 44Z" fill={`url(#${uid}-hourglass-sand)`} />
          <path d="M24.8 18.6h14.6" stroke="white" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F989}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-owl-face`} x1="20" y1="16" x2="44" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ED957" />
              <stop offset="0.5" stopColor="#48A302" />
              <stop offset="1" stopColor="#1E8C00" />
            </linearGradient>
            <linearGradient id={`${uid}-owl-beak`} x1="29" y1="34" x2="35" y2="43" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFDC4D" />
              <stop offset="1" stopColor="#E68A00" />
            </linearGradient>
          </defs>
          <path filter={`url(#${uid}-p)`} d="M32 11c11.6 0 19 8.5 19 18.8V44c0 4.4-3.6 8-8 8H21c-4.4 0-8-3.6-8-8V29.8C13 19.5 20.4 11 32 11Z" fill={`url(#${uid}-owl-face)`} stroke="#1E8C00" strokeWidth="0.5" />
          <path d="m22.8 18.4-4.5 5.6M41.2 18.4l4.5 5.6" stroke="#58CC02" strokeWidth="6" strokeLinecap="round" />
          <circle cx="25.5" cy="31.5" r="7.5" fill="white" />
          <circle cx="38.5" cy="31.5" r="7.5" fill="white" />
          <circle cx="25.5" cy="31.5" r="3.2" fill="#122431" />
          <circle cx="38.5" cy="31.5" r="3.2" fill="#122431" />
          <path d="m32 36.2-4.6 3.1 4.6 4.3 4.6-4.3-4.6-3.1Z" fill={`url(#${uid}-owl-beak)`} />
          <path d="M24.2 45.5c2.5 1.7 5 2.5 7.8 2.5 2.8 0 5.3-.8 7.8-2.5" stroke="white" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F3B5}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <SharpPlasticFilter id={`${uid}-p`} />
            <linearGradient id={`${uid}-music-shell`} x1="20" y1="12" x2="44" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D98AFF" />
              <stop offset="0.5" stopColor="#A855F7" />
              <stop offset="1" stopColor="#7E3BFF" />
            </linearGradient>
            <linearGradient id={`${uid}-music-core`} x1="26" y1="20" x2="38" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5EBFF" />
              <stop offset="1" stopColor="#E0B3FF" />
            </linearGradient>
          </defs>
          <path
            filter={`url(#${uid}-p)`}
            d="M22 18h4v20.3c-.6-.2-1.3-.3-2-.3-4.4 0-8 2.7-8 6s3.6 6 8 6 8-2.7 8-6V22.4l16-4v14.9c-.6-.2-1.3-.3-2-.3-4.4 0-8 2.7-8 6s3.6 6 8 6 8-2.7 8-6V12c0-1.1-.9-2-2-2h-.8L22 16.5V18Z"
            fill={`url(#${uid}-music-shell)`}
            stroke="#4D1E99"
            strokeWidth="0.5"
          />
          <path
            d="M23.5 19.5v18.8c1.5-1.2 3.5-2 5.5-2v-16l16-4V29c1.5-1.2 3.5-2 5.5-2v-15l-27 4.5Z"
            fill={`url(#${uid}-music-core)`}
            opacity="0.3"
          />
          <path d="M23 20.5l19-4.5" stroke="white" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M23 22v20M43 18v20" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case '\u{1F9ED}':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <PlasticFilter id={`${uid}-p`} />
            <radialGradient id={`${uid}-compass-ring`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(26 20) rotate(50) scale(32)">
              <stop stopColor="#FDFEFF" />
              <stop offset="1" stopColor="#B3C1FF" />
            </radialGradient>
            <linearGradient id={`${uid}-compass-needle-a`} x1="24" y1="20" x2="39" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF8A7A" />
              <stop offset="1" stopColor="#E6394F" />
            </linearGradient>
            <linearGradient id={`${uid}-compass-needle-b`} x1="40" y1="42" x2="26" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7ADFFF" />
              <stop offset="1" stopColor="#1E4799" />
            </linearGradient>
          </defs>
          <circle filter={`url(#${uid}-p)` } cx="32" cy="32" r="20" fill={`url(#${uid}-compass-ring)`} stroke="#7E9EFF" strokeWidth="0.5" />
          <circle cx="32" cy="32" r="14" fill="white" />
          <path filter={`url(#${uid}-p)`} d="m37 19.2 4.3 14.5L27 47.9l-4.3-14.5L37 19.2Z" fill={`url(#${uid}-compass-needle-a)`} />
          <path filter={`url(#${uid}-p)`} d="m27 47.9-4.3-14.5L37 19.2l4.3 14.5L27 47.9Z" fill={`url(#${uid}-compass-needle-b)`} />
          <circle cx="32" cy="32" r="3.8" fill="white" stroke="#B3C1FF" strokeWidth="0.5" />
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
  const mode = useEmojiIconMode();
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
      <span className={`${getContentClassName()} ${mode === 'emoji' ? 'inline-flex' : 'hidden'} duo-emoji-native`}>
        <span className="block leading-none" style={tone === 'intrinsic' ? { color: 'initial' } : undefined}>{symbol}</span>
      </span>
      <span className={`${getContentClassName()} ${mode === 'svg' ? 'inline-flex' : 'hidden'} duo-emoji-svg`}>
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
  const mode = useEmojiIconMode();

  return (
    <Wrapper className={`${className} inline-flex items-center justify-center leading-none`} label={label}>
      <span className={`${mode === 'emoji' ? 'block' : 'hidden'} duo-emoji-native`}>{emoji}</span>
      <span className={`${mode === 'svg' ? 'inline-flex' : 'hidden'} duo-emoji-svg min-w-[1.6em] items-center justify-center rounded-[0.45em] border border-current/16 bg-current/8 px-[0.22em] py-[0.12em] text-[0.42em] font-black uppercase tracking-[0.12em] text-current`}>
        {languageCode.slice(0, 2) || '?'}
      </span>
    </Wrapper>
  );
}
