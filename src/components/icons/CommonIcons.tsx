import { useId } from 'react';
import { useEmojiIconMode } from './EmojiMode';

interface IconProps {
  className?: string;
}

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

export function SunIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
        <linearGradient id={`${id}-g`} x1="4" y1="4" x2="20" y2="20">
          <stop stopColor="#FFCB4D" />
          <stop offset="1" stopColor="#FF9600" />
        </linearGradient>
      </defs>
      <circle filter={`url(#${id}-p)`} cx="12" cy="12" r="5" fill={`url(#${id}-g)`} stroke="#B36200" strokeWidth="0.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="11.25"
          y="2"
          width="1.5"
          height="4"
          rx="0.75"
          fill={`url(#${id}-g)`}
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </svg>
  );
}

export function MoonIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
        <linearGradient id={`${id}-g`} x1="4" y1="4" x2="20" y2="20">
          <stop stopColor="#A7B6FF" />
          <stop offset="1" stopColor="#5B6CFF" />
        </linearGradient>
      </defs>
      <path
        filter={`url(#${id}-p)`}
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        fill={`url(#${id}-g)`}
        stroke="#2D3B99"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export function SystemIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
        <linearGradient id={`${id}-g`} x1="3" y1="4" x2="21" y2="20">
          <stop stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      <rect filter={`url(#${id}-p)`} x="3" y="4" width="18" height="12" rx="2.5" fill={`url(#${id}-g)`} stroke="#475569" strokeWidth="0.5" />
      <path d="M8 20h8" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16v4" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SparkleIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
        <linearGradient id={`${id}-g`} x1="4" y1="4" x2="20" y2="20">
          <stop stopColor="#D98AFF" />
          <stop offset="1" stopColor="#7E3BFF" />
        </linearGradient>
      </defs>
      <path filter={`url(#${id}-p)`} d="m12 3 1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" fill={`url(#${id}-g)`} stroke="#4D1E99" strokeWidth="0.5" />
      <path filter={`url(#${id}-p)`} d="m18.5 15 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z" fill={`url(#${id}-g)`} stroke="#4D1E99" strokeWidth="0.5" />
    </svg>
  );
}

export function PauseIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
        <linearGradient id={`${id}-g`} x1="6" y1="5" x2="18" y2="19">
          <stop stopColor="#FF8C82" />
          <stop offset="1" stopColor="#FF4B4B" />
        </linearGradient>
      </defs>
      <rect filter={`url(#${id}-p)`} x="6" y="5" width="4.5" height="14" rx="1.5" fill={`url(#${id}-g)` } stroke="#B32B2B" strokeWidth="0.5" />
      <rect filter={`url(#${id}-p)`} x="13.5" y="5" width="4.5" height="14" rx="1.5" fill={`url(#${id}-g)`} stroke="#B32B2B" strokeWidth="0.5" />
    </svg>
  );
}

export function CameraIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
        <linearGradient id={`${id}-g`} x1="3" y1="4" x2="21" y2="20">
          <stop stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      <path filter={`url(#${id}-p)`} d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" fill={`url(#${id}-g)`} stroke="#475569" strokeWidth="0.5" />
      <circle cx="12" cy="13" r="3.5" fill="white" stroke="#475569" strokeWidth="1" />
    </svg>
  );
}

export function RefreshIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
        <linearGradient id={`${id}-g`} x1="4" y1="4" x2="20" y2="20">
          <stop stopColor="#7ADFFF" />
          <stop offset="1" stopColor="#1CB0F6" />
        </linearGradient>
      </defs>
      <path
        filter={`url(#${id}-p)`}
        d="M20 12a8 8 0 1 1-2.34-5.66"
        stroke={`url(#${id}-g)`}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        filter={`url(#${id}-p)`}
        d="M20 4v6h-6"
        stroke={`url(#${id}-g)`}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExitIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
        <linearGradient id={`${id}-g`} x1="4" y1="4" x2="20" y2="20">
          <stop stopColor="#FF8C82" />
          <stop offset="1" stopColor="#FF4B4B" />
        </linearGradient>
      </defs>
      <path filter={`url(#${id}-p)`} d="M17 16l4-4m0 0-4-4m4 4H9" stroke={`url(#${id}-g)`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 20H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h6" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function EmojiModeIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  const mode = useEmojiIconMode();

  return (
    <div className={`${className} relative flex items-center justify-center`}>
      <svg className={`${mode === 'emoji' ? 'block' : 'hidden'} duo-emoji-native absolute inset-0 h-full w-full`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs>
          <PlasticFilter id={`${id}-p1`} />
          <linearGradient id={`${id}-g1`} x1="4" y1="4" x2="20" y2="20">
            <stop stopColor="#FFF48A" />
            <stop offset="1" stopColor="#FFBB00" />
          </linearGradient>
        </defs>
        <circle filter={`url(#${id}-p1)`} cx="12" cy="12" r="9" fill={`url(#${id}-g1)`} stroke="#B38A00" strokeWidth="0.5" />
        <circle cx="8.5" cy="10" r="1.2" fill="#1E293B" />
        <circle cx="15.5" cy="10" r="1.2" fill="#1E293B" />
        <path d="M8 14.5c1 1.5 2.5 2.2 4 2.2s3-.7 4-2.2" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className={`${mode === 'svg' ? 'block' : 'hidden'} duo-emoji-svg absolute inset-0 h-full w-full`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs>
          <PlasticFilter id={`${id}-p2`} />
          <linearGradient id={`${id}-g2`} x1="4" y1="4" x2="20" y2="20">
            <stop stopColor="#7ADFFF" />
            <stop offset="1" stopColor="#1CB0F6" />
          </linearGradient>
        </defs>
        <rect filter={`url(#${id}-p2)`} x="4" y="4" width="7" height="7" rx="2" fill={`url(#${id}-g2)`} stroke="#1E4799" strokeWidth="0.5" />
        <circle filter={`url(#${id}-p2)`} cx="17.5" cy="7.5" r="3.5" fill={`url(#${id}-g2)`} stroke="#1E4799" strokeWidth="0.5" />
        <path d="m7 16 3 5 3-5 3 5 3-5" stroke={`url(#${id}-g2)`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function MenuIcon({ open, className = 'h-4 w-4' }: { open: boolean; className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
      </defs>
      {open ? (
        <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <path d="M4 7h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4 12h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function SearchIcon({ className = 'h-4 w-4', colorful }: IconProps & { colorful?: boolean }) {
  const id = useId().replace(/:/g, '');
  if (colorful) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <defs>
          <PlasticFilter id={`${id}-p`} />
          <linearGradient id={`${id}-g`} x1="4" y1="4" x2="20" y2="20">
            <stop stopColor="#7ADFFF" />
            <stop offset="1" stopColor="#1CB0F6" />
          </linearGradient>
        </defs>
        {/* Handle Outline */}
        <path d="m14.5 14.5 5.5 5.5" stroke="#1E4799" strokeWidth="4.2" strokeLinecap="round" />
        {/* Handle Gradient */}
        <path filter={`url(#${id}-p)`} d="m14.5 14.5 5.5 5.5" stroke={`url(#${id}-g)`} strokeWidth="3.2" strokeLinecap="round" />
        {/* Handle specularity highlight */}
        <path d="m15 15 3.5 3.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.45" />

        {/* Frame Outlines */}
        <circle cx="10.5" cy="10.5" r="7.1" fill="none" stroke="#1E4799" strokeWidth="0.5" />
        <circle cx="10.5" cy="10.5" r="3.9" fill="none" stroke="#1E4799" strokeWidth="0.5" />
        {/* Glass lens background fill */}
        <circle cx="10.5" cy="10.5" r="3.9" fill={`url(#${id}-g)`} fillOpacity="0.25" />
        {/* Glass lens glossy frame */}
        <circle filter={`url(#${id}-p)`} cx="10.5" cy="10.5" r="5.5" fill="none" stroke={`url(#${id}-g)`} strokeWidth="3" />
        {/* Glass lens top-left curved specular reflection highlight */}
        <path d="M8 9.5a2.5 2.5 0 0 1 2.5-2.5" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
      </defs>
      <circle filter={`url(#${id}-p)`} cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.5" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function BoltIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
        <linearGradient id={`${id}-g`} x1="4" y1="2" x2="20" y2="22">
          <stop stopColor="#FFCB4D" />
          <stop offset="1" stopColor="#FF9600" />
        </linearGradient>
      </defs>
      <path
        filter={`url(#${id}-p)`}
        d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z"
        fill={`url(#${id}-g)`}
        stroke="#B36200"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClockIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
        <linearGradient id={`${id}-g`} x1="4" y1="4" x2="20" y2="20">
          <stop stopColor="#7ADFFF" />
          <stop offset="1" stopColor="#1CB0F6" />
        </linearGradient>
      </defs>
      <circle filter={`url(#${id}-p)`} cx="12" cy="12" r="9" stroke={`url(#${id}-g)`} strokeWidth="2.5" />
      <path d="M12 7v5l3 2" stroke={`url(#${id}-g)`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BarChartIcon({ className = 'h-4 w-4', colorful }: IconProps & { colorful?: boolean }) {
  const id = useId().replace(/:/g, '');
  if (colorful) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <defs>
          <PlasticFilter id={`${id}-p`} />
          <linearGradient id={`${id}-g`} x1="4" y1="4" x2="20" y2="20">
            <stop stopColor="#8CE63F" />
            <stop offset="1" stopColor="#58CC02" />
          </linearGradient>
        </defs>
        {/* Bar 1 */}
        <rect filter={`url(#${id}-p)`} x="4.5" y="11" width="3.5" height="9" rx="1.5" fill={`url(#${id}-g)`} stroke="#256600" strokeWidth="0.5" />
        <path d="M5.5 12.5v5.5" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.6" />

        {/* Bar 2 */}
        <rect filter={`url(#${id}-p)`} x="10.25" y="4" width="3.5" height="16" rx="1.5" fill={`url(#${id}-g)`} stroke="#256600" strokeWidth="0.5" />
        <path d="M11.25 5.5v11.5" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.6" />

        {/* Bar 3 */}
        <rect filter={`url(#${id}-p)`} x="16" y="8" width="3.5" height="12" rx="1.5" fill={`url(#${id}-g)`} stroke="#256600" strokeWidth="0.5" />
        <path d="M17 9.5v8.5" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
      </defs>
      <path
        filter={`url(#${id}-p)`}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        d="M4 20V8 M10 20V4 M16 20v-6 M22 20v-9 M2 20h20"
      />
    </svg>
  );
}

export function ArrowUpIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
      </defs>
      <g filter={`url(#${id}-p)`} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 5 6 6" />
        <path d="m12 5-6 6" />
        <path d="M12 5v14" />
      </g>
    </svg>
  );
}

export function QuestionIcon({ className = 'h-4 w-4', colorful }: IconProps & { colorful?: boolean }) {
  const id = useId().replace(/:/g, '');
  if (colorful) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <defs>
          <PlasticFilter id={`${id}-p`} />
          <linearGradient id={`${id}-g`} x1="4" y1="4" x2="20" y2="20">
            <stop stopColor="#FFAE33" />
            <stop offset="1" stopColor="#FF7A00" />
          </linearGradient>
        </defs>
        {/* Question mark main curve outlines & gradients */}
        <path d="M9.5 8.5c0-2.5 5-2.5 5 0 0 1.8-2.5 2.2-2.5 4.5" stroke="#B36200" strokeWidth="4.8" strokeLinecap="round" fill="none" />
        <path filter={`url(#${id}-p)`} d="M9.5 8.5c0-2.5 5-2.5 5 0 0 1.8-2.5 2.2-2.5 4.5" stroke={`url(#${id}-g)`} strokeWidth="3.8" strokeLinecap="round" fill="none" />
        {/* Curved specular highlight reflection inside the question curve */}
        <path d="M9.8 8.8c0-1.8 3.5-1.8 3.5 0 0 1.2-1.7 1.5-1.7 3.5" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.65" fill="none" />

        {/* Dot outlines & gradients */}
        <circle cx="12" cy="17" r="2.2" fill="#B36200" />
        <circle filter={`url(#${id}-p)`} cx="12" cy="17" r="1.7" fill={`url(#${id}-g)`} />
        {/* Specular highlight point inside dot */}
        <circle cx="11.4" cy="16.4" r="0.55" fill="white" fillOpacity="0.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <PlasticFilter id={`${id}-p`} />
      </defs>
      <g filter={`url(#${id}-p)`} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4" />
        <path d="M12 17h.01" />
        <circle cx="12" cy="12" r="9" />
      </g>
    </svg>
  );
}

export function ChatIcon({ className = 'h-4 w-4' }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <defs>
        <SharpPlasticFilter id={`${id}-p`} />
        <linearGradient id={`${id}-chat-g`} x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#58CC02" />
          <stop offset="1" stopColor="#46A302" />
        </linearGradient>
      </defs>
      <path filter={`url(#${id}-p)` } d="M32 12c-11.046 0-20 8.059-20 18 0 3.774 1.3 7.25 3.5 10.057L12 48l8.36-2.613C23.633 47.456 27.65 48 32 48c11.046 0 20-8.059 20-18s-8.954-18-20-18Z" fill={`url(#${id}-chat-g)`} stroke="#1E4D00" strokeWidth="0.5" />
      <circle cx="22" cy="30" r="3" fill="#FFFFFF" />
      <circle cx="32" cy="30" r="3" fill="#FFFFFF" />
      <circle cx="42" cy="30" r="3" fill="#FFFFFF" />
      <path d="M18 22c4-4 12-6 24-2" stroke="white" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
