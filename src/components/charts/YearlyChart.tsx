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

interface YearlyChartProps {
  data: Array<{ date: string; xp: number; time?: number }>;
}

interface YearData {
  year: string;
  xp: number;
}

export default function YearlyChart({ data }: YearlyChartProps) {
  const yearlyData = useMemo<YearData[]>(() => {
    const yearMap = new Map<string, number>();

    data.forEach((item) => {
      const year = item.date.substring(0, 4);
      yearMap.set(year, (yearMap.get(year) || 0) + item.xp);
    });

    return Array.from(yearMap.entries())
      .map(([year, xp]) => ({ year, xp }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [data]);

  const growthRate = useMemo(() => {
    if (yearlyData.length < 2) return null;
    const current = yearlyData[yearlyData.length - 1].xp;
    const previous = yearlyData[yearlyData.length - 2].xp;
    if (previous === 0) return null;
    return ((current / previous) * 100 - 100).toFixed(0);
  }, [yearlyData]);

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  if (yearlyData.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center text-apple-gray6">
        暂无年度数据
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="min-h-[180px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yearlyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="yearXpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A572F7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A572F7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#334155' : '#e5e5e5'}
            />
            <XAxis
              dataKey="year"
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
              tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value)}
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
              stroke="#A572F7"
              strokeWidth={3}
              fill="url(#yearXpGradient)"
              dot={{ r: 4, fill: '#A572F7', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {yearlyData.length > 1 && growthRate && (
        <div className="flex items-center justify-center gap-2 pt-1">
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              parseFloat(growthRate) >= 0 ? 'bg-duo-green/20 text-duo-green' : 'bg-red-500/20 text-red-500'
            }`}
          >
            {parseFloat(growthRate) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(growthRate))}%
          </span>
        </div>
      )}
    </div>
  );
}
