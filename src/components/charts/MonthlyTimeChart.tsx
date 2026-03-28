import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface MonthlyTimeChartProps {
  data: Array<{ date: string; time: number }>;
}

export default function MonthlyTimeChart({ data }: MonthlyTimeChartProps) {
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, number>();
    const months = ['1鏈?', '2鏈?', '3鏈?', '4鏈?', '5鏈?', '6鏈?', '7鏈?', '8鏈?', '9鏈?', '10鏈?', '11鏈?', '12鏈?'];
    const today = new Date();

    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthMap.set(months[d.getMonth()], 0);
    }

    data.forEach((item) => {
      const d = new Date(item.date);
      const monthKey = months[d.getMonth()];
      if (monthMap.has(monthKey)) {
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + (item.time || 0));
      }
    });

    return Array.from(monthMap.entries()).map(([date, time]) => ({ date, time }));
  }, [data]);

  const totalTime = useMemo(() => {
    return monthlyData.reduce((sum, d) => sum + d.time, 0);
  }, [monthlyData]);

  const formattedTime = useMemo(() => {
    const hours = Math.floor(totalTime / 60);
    const mins = totalTime % 60;
    return hours > 0 ? `${hours}灏忔椂${mins}鍒嗛挓` : `${mins}鍒嗛挓`;
  }, [totalTime]);

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <div className="w-full">
      <div className="h-28 w-full">
        <ResponsiveContainer width="100%" height={112}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="monthlyTimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A572F7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A572F7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e5e5e5'} />
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
              formatter={(value) => {
                const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
                return [`${numericValue} 鍒嗛挓`, '瀛︿範鏃堕棿'] as [string, string];
              }}
            />
            <Area
              type="monotone"
              dataKey="time"
              stroke="#A572F7"
              strokeWidth={3}
              fill="url(#monthlyTimeGradient)"
              dot={{ r: 3, fill: '#A572F7', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="pb-3 text-center text-xs text-apple-gray6 dark:text-slate-400">
        杩?2涓湀瀛︿範 <span className="font-bold text-duo-purple">{formattedTime}</span>
      </div>
    </div>
  );
}
