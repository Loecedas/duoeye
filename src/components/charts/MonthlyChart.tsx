import { memo, useEffect, useMemo, useRef, useState } from 'react';
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
  metric?: 'xp' | 'time';
}

interface MonthlyChartPoint {
  date: string;
  axisLabel: string;
  value: number;
}

const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

function formatRollingMonthLabel(date: Date): string {
  return `${String(date.getFullYear()).slice(-2)}/${date.getMonth() + 1}`;
}

function formatRollingMonthLabelForNarrowScreen(value: string): string {
  const month = value.split('/')[1];
  return month ? `${month}月` : value;
}

function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`;
}

function MonthlyChart({
  data,
  selectedYear,
  viewMode = 'year',
  metric = 'xp',
}: MonthlyChartProps) {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const isExtraNarrowScreen = chartWidth > 0 && chartWidth <= 425;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setChartWidth(Math.round(entry.contentRect.width));
    });

    observer.observe(container);
    setChartWidth(Math.round(container.getBoundingClientRect().width));

    return () => observer.disconnect();
  }, []);

  const chartData = useMemo<MonthlyChartPoint[]>(() => {
    const valueKey = metric === 'time' ? 'time' : 'xp';

    if (viewMode === 'rolling12') {
      const monthlyValues = new Map<string, number>();
      const today = new Date();

      for (let i = 11; i >= 0; i -= 1) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
        monthlyValues.set(monthKey, 0);
      }

      data.forEach((item) => {
        const monthKey = item.date.slice(0, 7);
        if (!monthlyValues.has(monthKey)) return;
        monthlyValues.set(monthKey, (monthlyValues.get(monthKey) || 0) + (item[valueKey] || 0));
      });

      return Array.from(monthlyValues.entries()).map(([monthKey, value]) => {
        const [year, month] = monthKey.split('-');
        const fullLabel = formatRollingMonthLabel(new Date(Number(year), Number(month) - 1, 1));

        return {
          date: fullLabel,
          axisLabel: isExtraNarrowScreen ? formatRollingMonthLabelForNarrowScreen(fullLabel) : fullLabel,
          value,
        };
      });
    }

    const year = selectedYear || new Date().getFullYear().toString();
    const monthlyValues = new Array<number>(12).fill(0);

    data.forEach((item) => {
      if (!item.date.startsWith(year)) return;

      const month = Number(item.date.slice(5, 7));
      if (month < 1 || month > 12) return;

      monthlyValues[month - 1] += item[valueKey] || 0;
    });

    return MONTH_LABELS.map((label, index) => ({
      date: label,
      axisLabel: label,
      value: monthlyValues[index],
    }));
  }, [data, isExtraNarrowScreen, metric, selectedYear, viewMode]);

  const totalValue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  if (data.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center text-apple-gray6">
        暂无月度数据
      </div>
    );
  }

  const themeColor = metric === 'time' ? '#14b8a6' : '#6366f1';
  const gradientId = metric === 'time' ? 'monthTimeGradient' : 'monthXpGradient';
  const footerValue = metric === 'time' ? formatMinutes(totalValue) : `${totalValue.toLocaleString()} XP`;

  return (
    <div ref={containerRef} className="chart-shell flex h-full min-h-[220px] w-full flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 14, right: 25, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e5e5e5'} />
            <XAxis
              dataKey="axisLabel"
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
              tickFormatter={(value) => {
                if (metric === 'time') return value >= 60 ? `${Math.floor(value / 60)}h` : value;
                return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value;
              }}
            />
            <Tooltip
              labelFormatter={(_, payload) => {
                const entry = payload?.[0]?.payload as MonthlyChartPoint | undefined;
                return entry?.date || '';
              }}
              formatter={(value) => [
                `${Number(value ?? 0).toLocaleString()} ${metric === 'time' ? '分钟' : 'XP'}`,
                viewMode === 'rolling12' ? '近 12 个月' : (selectedYear || '当年'),
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
              dataKey="value"
              stroke={themeColor}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              dot={{ r: 3, fill: themeColor, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="pt-1 text-center text-xs text-apple-gray6 dark:text-slate-400">
        {metric === 'time' ? '累计学习 ' : '累计获得 '}
        <span className="font-bold" style={{ color: themeColor }}>
          {footerValue}
        </span>
      </div>
    </div>
  );
}

export default memo(MonthlyChart);
