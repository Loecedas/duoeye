import { useId } from 'react';

interface AppIconProps {
  className?: string;
}

export default function AppIcon({ className = 'w-8 h-8' }: AppIconProps) {
  const id = useId().replace(/:/g, '');
  const filterA = `fa-${id}`;
  const filterB = `fb-${id}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className} aria-hidden="true">
      <defs>
        <filter id={filterA} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#0f172a" floodOpacity="0.12" />
        </filter>
        <filter id={filterB} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-8" dy="12" stdDeviation="8" floodColor="#000" floodOpacity="0.15" />
        </filter>
      </defs>
      <g transform="translate(0 16)" filter={`url(#${filterA})`}>
        <path d="M50 160h30M65 145v30" stroke="#1cb0f6" strokeWidth="8" strokeLinecap="round" />
        <circle cx="440" cy="120" r="12" fill="none" stroke="#ff9600" strokeWidth="6" />
        <path
          d="M70 340l10-20 10 20 20 10-20 10-10 20-10-20-20-10z"
          fill="#ff4b4b"
          transform="scale(.8) translate(20 80)"
        />
        <path d="M210 120l-80-30-20 80z" fill="#46a302" stroke="#46a302" strokeWidth="24" strokeLinejoin="round" />
        <path d="M210 104l-80-30-20 80z" fill="#58cc02" stroke="#58cc02" strokeWidth="24" strokeLinejoin="round" />
        <path d="M302 120l80-30 20 80z" fill="#46a302" stroke="#46a302" strokeWidth="24" strokeLinejoin="round" />
        <path d="M302 104l80-30 20 80z" fill="#58cc02" stroke="#58cc02" strokeWidth="24" strokeLinejoin="round" />
        <rect x="64" y="96" width="384" height="340" rx="170" fill="#46a302" />
        <rect x="64" y="80" width="384" height="340" rx="170" fill="#58cc02" />
        <path d="M130 140q126-50 252 0" fill="none" stroke="#a5ed5f" strokeWidth="14" strokeLinecap="round" opacity=".9" />
        <circle cx="180" cy="212" r="60" fill="#fff" />
        <circle cx="196" cy="212" r="24" fill="#4b4b4b" />
        <circle cx="204" cy="204" r="8" fill="#fff" />
        <circle cx="188" cy="220" r="4" fill="#fff" />
        <path d="M230 252h40l-20 36z" fill="#dfa500" stroke="#dfa500" strokeWidth="16" strokeLinejoin="round" />
        <path d="M230 240h40l-20 36z" fill="#ffc800" stroke="#ffc800" strokeWidth="16" strokeLinejoin="round" />
        <path d="M242 244h16" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".8" />
        <g filter={`url(#${filterB})`}>
          <path d="M370 290l70 80" stroke="#dfa500" strokeWidth="36" strokeLinecap="round" />
          <path d="M370 276l70 80" stroke="#ffc800" strokeWidth="36" strokeLinecap="round" />
          <path d="M384 300l32 36" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity=".6" />
          <circle cx="330" cy="212" r="80" fill="#94a3b8" />
          <circle cx="330" cy="204" r="80" fill="#f1f5f9" />
          <circle cx="330" cy="204" r="64" fill="#cbd5e1" />
          <circle cx="330" cy="204" r="60" fill="#fff" />
          <rect x="290" y="226" width="20" height="30" rx="10" fill="#ea2b2b" />
          <rect x="290" y="220" width="20" height="30" rx="10" fill="#ff4b4b" />
          <rect x="320" y="196" width="20" height="60" rx="10" fill="#e58600" />
          <rect x="320" y="190" width="20" height="60" rx="10" fill="#ff9600" />
          <rect x="350" y="166" width="20" height="90" rx="10" fill="#46a302" />
          <rect x="350" y="160" width="20" height="90" rx="10" fill="#58cc02" />
          <path d="M282 176a52 52 0 0184-14" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" opacity=".95" />
        </g>
        <circle cx="410" cy="328" r="32" fill="#46a302" />
        <circle cx="410" cy="316" r="32" fill="#58cc02" />
        <path d="M390 300a20 20 0 0136-6" fill="none" stroke="#a5ed5f" strokeWidth="8" strokeLinecap="round" />
      </g>
    </svg>
  );
}
