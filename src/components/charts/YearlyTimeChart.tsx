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

interface YearlyTimeChartProps {
  data: Array<{ date: string; xp: number; time?: number }>;
}

export default function YearlyTimeChart({ data }: YearlyTimeChartProps) {
  const yearlyData = useMemo(() => {
    const yearMap = new Map<string, number>();

    data.forEach((item) => {
      const year = item.date.substring(0, 4);
      yearMap.set(year, (yearMap.get(year) || 0) + (item.time || 0));
    });

    return Array.from(yearMap.entries())
      .map(([date, time]) => ({ date, time }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  const totalTime = useMemo(() => yearlyData.reduce((sum, item) => sum + item.time, 0), [yearlyData]);
  const formattedTime = useMemo(() => {
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`;
  }, [totalTime]);

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  if (yearlyData.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center text-apple-gray6">
        暂无时间数据
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="min-h-[180px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yearlyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="yearlyTimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9600" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF9600" stopOpacity={0} />
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
              tickFormatter={(value) => (value >= 60 ? `${Math.floor(value / 60)}h` : value)}
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
              dataKey="time"
              stroke="#FF9600"
              strokeWidth={3}
              fill="url(#yearlyTimeGradient)"
              dot={{ r: 3, fill: '#FF9600', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="pt-1 text-center text-xs text-apple-gray6 dark:text-slate-400">
        累计学习 <span className="font-bold text-duo-orange">{formattedTime}</span>
      </div>
    </div>
  );
}
