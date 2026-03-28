import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import HeatmapChart from '../dashboard/HeatmapChart';

interface LandingPreviewSectionProps {
  badgeClassName: string;
  sectionCardClassName: string;
  xpChartData: Array<{ date: string; xp: number }>;
  timeChartData: Array<{ date: string; time: number }>;
  landingHeatmapPreviewData: Array<{ date: string; xp: number; time: number }>;
  totalXp: number;
  totalTime: number;
  averageXp: number;
}

function TooltipCard({
  active,
  payload,
  label,
  color,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
  color: string;
  unit: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-black/5 bg-white/96 px-3 py-2 text-xs shadow-[0_10px_24px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-[rgba(44,44,46,0.94)]">
      <span className="text-apple-gray6 dark:text-apple-dark6">{label}:</span>
      <span className="ml-1 font-bold" style={{ color }}>
        {payload[0].value ?? 0} {unit}
      </span>
    </div>
  );
}

function PreviewChartCard({
  title,
  description,
  color,
  unit,
  data,
  dataKey,
  gradientId,
  footer,
  icon,
  referenceLine,
  sectionCardClassName,
}: {
  title: string;
  description: string;
  color: string;
  unit: string;
  data: Array<Record<string, string | number>>;
  dataKey: string;
  gradientId: string;
  footer: string;
  icon: React.ReactNode;
  referenceLine?: number;
  sectionCardClassName: string;
}) {
  return (
    <div className={`${sectionCardClassName} h-full p-6`}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-apple-dark1 dark:text-white">
        <span style={{ color }}>{icon}</span>
        <span>{title}</span>
      </div>
      <p className="mb-3 text-sm leading-6 text-apple-gray6 dark:text-apple-dark6">{description}</p>
      <ResponsiveContainer width="100%" height={168}>
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          {referenceLine ? <ReferenceLine y={referenceLine} stroke={color} strokeDasharray="4 4" strokeOpacity={0.45} /> : null}
          <Tooltip content={<TooltipCard color={color} unit={unit} />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center text-xs text-apple-gray6 dark:text-apple-dark6">{footer}</div>
    </div>
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

export default function LandingPreviewSection({
  badgeClassName,
  sectionCardClassName,
  xpChartData,
  timeChartData,
  landingHeatmapPreviewData,
  totalXp,
  totalTime,
  averageXp,
}: LandingPreviewSectionProps) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className={badgeClassName}>PREVIEW</span>
          <h2 className="mt-4 text-[clamp(1.9rem,3vw,3rem)] font-semibold tracking-tight text-apple-dark1 dark:text-white">
            首页预览也沿用仪表盘的卡片系统
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeClassName}>热力图</span>
          <span className={badgeClassName}>经验曲线</span>
          <span className={badgeClassName}>学习时长</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className={`${sectionCardClassName} overflow-hidden p-4 md:col-span-12 sm:p-5`}>
          <HeatmapChart data={landingHeatmapPreviewData} closeTooltipOnScroll controlOrder="dashboard" />
        </div>

        <div className="md:col-span-6">
          <PreviewChartCard
            title="最近 7 天经验"
            description="通过经验曲线看一周里什么时候最强，什么时候明显掉速。"
            color="#58cc02"
            unit="XP"
            data={xpChartData}
            dataKey="xp"
            gradientId="landing-xp-gradient"
            footer={`本周共获得 ${totalXp} XP`}
            icon={<BoltIcon className="h-4 w-4" />}
            referenceLine={averageXp}
            sectionCardClassName={sectionCardClassName}
          />
        </div>

        <div className="md:col-span-6">
          <PreviewChartCard
            title="最近 7 天学习时长"
            description="把投入时间单独拎出来，更容易判断你的学习节奏。"
            color="#1cb0f6"
            unit="分钟"
            data={timeChartData}
            dataKey="time"
            gradientId="landing-time-gradient"
            footer={`本周累计投入 ${totalTime} 分钟`}
            icon={<ClockIcon className="h-4 w-4" />}
            sectionCardClassName={sectionCardClassName}
          />
        </div>
      </div>
    </>
  );
}
