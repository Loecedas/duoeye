import { useId } from 'react';

interface DuoWordmarkProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  xs: {
    width: 74,
    height: 24,
    duoSize: 17,
    eyeSize: 18,
    duoY: 18,
    eyeX: 33,
    eyeY: 18,
  },
  sm: {
    width: 103,
    height: 34,
    duoSize: 23,
    eyeSize: 25,
    duoY: 24,
    eyeX: 46,
    eyeY: 24,
  },
  md: {
    width: 128,
    height: 42,
    duoSize: 28,
    eyeSize: 31,
    duoY: 29,
    eyeX: 56,
    eyeY: 29,
  },
  lg: {
    width: 174,
    height: 58,
    duoSize: 39,
    eyeSize: 43,
    duoY: 40,
    eyeX: 77,
    eyeY: 40,
  },
} as const;

export default function DuoWordmark({ size = 'md', className = '' }: DuoWordmarkProps) {
  const style = sizeMap[size];
  const id = useId().replace(/:/g, '');
  const duoGradientId = `duo-wordmark-duo-${id}`;
  const eyeGradientId = `duo-wordmark-eye-${id}`;
  const shadowId = `duo-wordmark-shadow-${id}`;

  return (
    <svg
      width={style.width}
      height={style.height}
      viewBox={`0 0 ${style.width} ${style.height}`}
      className={className}
      aria-label="DuoEye"
      role="img"
    >
      <defs>
        <linearGradient id={duoGradientId} x1="0" y1="0" x2="0" y2={style.height} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id={eyeGradientId} x1={style.eyeX} y1="0" x2={style.eyeX} y2={style.height} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9be15d" />
          <stop offset="55%" stopColor="#58cc02" />
          <stop offset="100%" stopColor="#2f7d0d" />
        </linearGradient>
        <filter id={shadowId} x="-20%" y="-20%" width="160%" height="180%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#58cc02" floodOpacity="0.22" />
        </filter>
      </defs>

      <text
        x="0"
        y={style.duoY}
        fill={`url(#${duoGradientId})`}
        fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", sans-serif'
        fontSize={style.duoSize}
        fontWeight="650"
        letterSpacing={size === 'xs' ? '-1.15' : '-1.5'}
      >
        Duo
      </text>
      <text
        x={style.eyeX}
        y={style.eyeY}
        fill={`url(#${eyeGradientId})`}
        filter={`url(#${shadowId})`}
        fontFamily='-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", sans-serif'
        fontSize={style.eyeSize}
        fontWeight="800"
        letterSpacing={size === 'xs' ? '-1.6' : '-2'}
      >
        Eye
      </text>
    </svg>
  );
}
