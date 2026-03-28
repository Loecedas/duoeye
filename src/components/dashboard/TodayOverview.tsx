import { useMemo } from 'react';
import type { UserData } from '../../types';

interface TodayOverviewProps {
  userData: UserData;
}

interface PrimaryStat {
  label: string;
  value: string;
  icon: string;
  valueClass: string;
  panelClass: string;
  darkPanelClass: string;
  glowClass: string;
}

function formatMinutes(minutes: number): string {
  if (minutes <= 0) return '0 分钟';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours <= 0) return `${remainingMinutes} 分钟`;
  if (remainingMinutes <= 0) return `${hours} 小时`;
  return `${hours} 小时 ${remainingMinutes} 分钟`;
}

export default function TodayOverview({ userData }: TodayOverviewProps) {
  const todayTimeMinutes = useMemo(() => {
    if (!userData.dailyTimeHistory?.length) return 0;
    return userData.dailyTimeHistory[userData.dailyTimeHistory.length - 1]?.time || 0;
  }, [userData.dailyTimeHistory]);

  const primaryStats = useMemo<PrimaryStat[]>(
    () => [
      {
        label: '今日 XP',
        value: (userData.xpToday || 0).toLocaleString(),
        icon: '⚡',
        valueClass: 'text-[#58cc02]',
        panelClass: 'from-[#f4fbe7] via-[#f8fdf0] to-[#ffffff]',
        darkPanelClass: 'dark:from-[rgba(88,204,2,0.16)] dark:via-[rgba(58,58,60,0.96)] dark:to-[rgba(44,44,46,0.98)]',
        glowClass: 'bg-[#9be15d]/30',
      },
      {
        label: '今日学习时间',
        value: formatMinutes(todayTimeMinutes),
        icon: '⏱',
        valueClass: 'text-[#1cb0f6]',
        panelClass: 'from-[#eef8ff] via-[#f6fbff] to-[#ffffff]',
        darkPanelClass: 'dark:from-[rgba(28,176,246,0.16)] dark:via-[rgba(58,58,60,0.96)] dark:to-[rgba(44,44,46,0.98)]',
        glowClass: 'bg-[#78d3ff]/26',
      },
      {
        label: '今日完成课次',
        value: `${userData.lessonsToday || 0}`,
        icon: '📚',
        valueClass: 'text-[#ff8a00]',
        panelClass: 'from-[#fff4ea] via-[#fff8f2] to-[#ffffff]',
        darkPanelClass: 'dark:from-[rgba(255,150,0,0.14)] dark:via-[rgba(58,58,60,0.96)] dark:to-[rgba(44,44,46,0.98)]',
        glowClass: 'bg-[#ffbe7a]/24',
      },
      {
        label: '连续天数',
        value: `${userData.streak}`,
        icon: '🔥',
        valueClass: 'text-[#ff6b00]',
        panelClass: 'from-[#fff1eb] via-[#fff7f3] to-[#ffffff]',
        darkPanelClass: 'dark:from-[rgba(255,107,0,0.14)] dark:via-[rgba(58,58,60,0.96)] dark:to-[rgba(44,44,46,0.98)]',
        glowClass: 'bg-[#ff9b6a]/24',
      },
    ],
    [todayTimeMinutes, userData.lessonsToday, userData.streak, userData.xpToday],
  );

  const secondaryStats = useMemo(() => {
    const items = [
      { label: '总经验', value: `${userData.totalXp.toLocaleString()} XP` },
      { label: '学习语言', value: userData.learningLanguage || '未知' },
      { label: '账户年龄', value: `${userData.accountAgeDays} 天` },
      { label: '总投入时间', value: userData.estimatedLearningTime || '暂无数据' },
    ];

    if (userData.gems > 0) {
      items.push({ label: '钻石', value: userData.gems.toLocaleString() });
    }

    if (userData.league && userData.league !== '—') {
      items.push({ label: '联赛段位', value: userData.league });
    }

    return items;
  }, [
    userData.accountAgeDays,
    userData.estimatedLearningTime,
    userData.gems,
    userData.league,
    userData.learningLanguage,
    userData.totalXp,
  ]);

  const secondaryGridClass = useMemo(() => {
    if (secondaryStats.length >= 6) return 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
    if (secondaryStats.length === 5) return 'grid-cols-2 lg:grid-cols-5';
    if (secondaryStats.length === 4) return 'grid-cols-2 lg:grid-cols-4';
    if (secondaryStats.length === 3) return 'grid-cols-1 sm:grid-cols-3';
    return 'grid-cols-1 sm:grid-cols-2';
  }, [secondaryStats.length]);

  return (
    <section className="screenshot-solid-surface overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,250,252,0.94))] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] dark:border-transparent dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.94),rgba(28,28,30,0.98))] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)]">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="screenshot-solid-panel group relative h-full overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.12),transparent_36%),linear-gradient(135deg,#ffffff_0%,#f5f7fb_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.14),transparent_34%),linear-gradient(135deg,rgba(72,72,74,0.98)_0%,rgba(44,44,46,0.98)_100%)] dark:hover:shadow-[0_18px_34px_rgba(0,0,0,0.24)]">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-apple-gray6 shadow-sm dark:bg-white/8 dark:text-apple-dark6">
              <span className="text-sm">📊</span>
              今日概览
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-[2rem] font-black tracking-tight text-apple-dark1 dark:text-white">今天也在稳步推进</h2>
                <p className="mt-2 text-base text-apple-gray6 dark:text-apple-dark6">
                  {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
                </p>
              </div>

              <div className="screenshot-solid-panel rounded-[22px] bg-white/88 px-4 py-4 shadow-[0_6px_16px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_22px_rgba(15,23,42,0.06)] dark:bg-[rgba(255,255,255,0.06)]">
                <div className="text-xs font-medium tracking-[0.18em] text-apple-gray6 dark:text-apple-dark6">TODAY SNAPSHOT</div>
                <p className="mt-3 text-sm leading-7 text-apple-dark1 dark:text-white/90">
                  今日已完成 <span className="font-bold text-[#58cc02]">{userData.lessonsToday || 0}</span> 课，学习{' '}
                  <span className="font-bold text-[#1cb0f6]">{formatMinutes(todayTimeMinutes)}</span>，当前连续{' '}
                  <span className="font-bold text-[#ff6b00]">{userData.streak}</span> 天。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {primaryStats.map((stat) => (
              <article
                key={stat.label}
                className={`group relative min-h-[168px] overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br ${stat.panelClass} ${stat.darkPanelClass} p-6 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)] dark:border-transparent dark:hover:shadow-[0_16px_30px_rgba(0,0,0,0.24)]`}
              >
                <div className={`absolute right-[-12px] top-[-12px] h-20 w-20 rounded-full opacity-70 blur-2xl transition-transform duration-200 group-hover:scale-105 ${stat.glowClass} dark:opacity-45`} />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-[2rem] leading-none transition-transform duration-300 group-hover:scale-110">{stat.icon}</span>
                    <div className="rounded-full bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-apple-gray6 shadow-sm dark:bg-white/8 dark:text-apple-dark6">
                      Today
                    </div>
                  </div>

                  <div>
                    <div className={`text-[2rem] font-black tracking-tight ${stat.valueClass}`}>{stat.value}</div>
                    <div className="mt-1 text-sm font-medium text-apple-gray6 dark:text-apple-dark6">{stat.label}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={`mt-5 grid gap-3 ${secondaryGridClass}`}>
        {secondaryStats.map((item) => (
          <div
            key={item.label}
            className="screenshot-solid-panel rounded-[22px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(246,247,250,0.92))] px-4 py-4 shadow-[0_4px_12px_rgba(15,23,42,0.03)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(15,23,42,0.06)] dark:border-transparent dark:bg-[linear-gradient(180deg,rgba(72,72,74,0.96),rgba(44,44,46,0.98))] dark:hover:shadow-[0_12px_22px_rgba(0,0,0,0.2)]"
          >
            <div className="text-xs font-medium text-apple-gray6 dark:text-apple-dark6">{item.label}</div>
            <div className="mt-2 text-lg font-semibold tracking-tight text-apple-dark1 dark:text-white">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
