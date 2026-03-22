import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface WeeklyChartProps {
  data: Array<{ date: string; xp: number; isFuture?: boolean }>;
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  const totalXp = useMemo(() => data.reduce((sum, item) => sum + (item.xp || 0), 0), [data]);
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="min-h-[180px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#58CC02" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#58CC02" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#334155' : '#e5e5e5'}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#cbd5e1' : '#6b7280', fontSize: 10 }}
              dy={5}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#cbd5e1' : '#6b7280', fontSize: 10 }}
              width={40}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(71, 85, 105, 0.8)' : 'none',
                boxShadow: isDark ? '0 10px 24px rgba(0,0,0,0.45)' : '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
              }}
            />
            <Area
              type="monotone"
              dataKey="xp"
              stroke="#58CC02"
              strokeWidth={3}
              fill="url(#xpGradient)"
              dot={{ r: 3, fill: '#58CC02', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="pt-1 text-center text-xs text-apple-gray6 dark:text-slate-400">
        本周学习 <span className="font-bold text-duo-green">{totalXp.toLocaleString()} XP</span>
      </div>
    </div>
  );
}
