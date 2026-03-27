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

interface MonthlyChartProps {
  data: Array<{ date: string; xp: number; time?: number }>;
  selectedYear?: string;
  viewMode?: 'year' | 'rolling12';
}

const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

function formatRollingMonthLabel(date: Date): string {
  return `${String(date.getFullYear()).slice(-2)}/${date.getMonth() + 1}`;
}

export default function MonthlyChart({ data, selectedYear, viewMode = 'year' }: MonthlyChartProps) {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const chartData = useMemo(() => {
    if (viewMode === 'rolling12') {
      const monthlyXp = new Map<string, number>();
      const today = new Date();

      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
        monthlyXp.set(monthKey, 0);
      }

      data.forEach((item) => {
        const monthKey = item.date.slice(0, 7);
        if (!monthlyXp.has(monthKey)) return;
        monthlyXp.set(monthKey, (monthlyXp.get(monthKey) || 0) + (item.xp || 0));
      });

      return Array.from(monthlyXp.entries()).map(([monthKey, xp]) => {
        const [year, month] = monthKey.split('-');
        return {
          date: formatRollingMonthLabel(new Date(Number(year), Number(month) - 1, 1)),
          xp,
        };
      });
    }

    const year = selectedYear || new Date().getFullYear().toString();
    const monthlyXp = new Array<number>(12).fill(0);

    data.forEach((item) => {
      if (!item.date.startsWith(year)) return;

      const month = Number(item.date.slice(5, 7));
      if (month < 1 || month > 12) return;

      monthlyXp[month - 1] += item.xp || 0;
    });

    return MONTH_LABELS.map((label, index) => ({
      date: label,
      xp: monthlyXp[index],
    }));
  }, [data, selectedYear, viewMode]);

  if (data.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center text-apple-gray6">
        暂无月度数据
      </div>
    );
  }

  return (
    <div className="h-full min-h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="monthXpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1CB0F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#1CB0F6" stopOpacity={0} />
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
            interval={0}
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
            formatter={(value: number) => [
              `${value.toLocaleString()} XP`,
              viewMode === 'rolling12' ? '近12个月' : (selectedYear || '当年'),
            ]}
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
            stroke="#1CB0F6"
            strokeWidth={3}
            fill="url(#monthXpGradient)"
            dot={{ r: 3, fill: '#1CB0F6', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
