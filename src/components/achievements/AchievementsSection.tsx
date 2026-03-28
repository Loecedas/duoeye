import { useEffect, useMemo, useRef, useState } from 'react';
import type { Achievement, UserData } from '../../types';

interface AchievementsSectionProps {
  userData: UserData;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'streak_7', title: '一周坚持', description: '连续学习 7 天', icon: '🔥', category: 'streak' },
  { id: 'streak_30', title: '月度坚持', description: '连续学习 30 天', icon: '🚀', category: 'streak' },
  { id: 'streak_100', title: '百日坚持', description: '连续学习 100 天', icon: '🎯', category: 'streak' },
  { id: 'streak_365', title: '年度坚持', description: '连续学习 365 天', icon: '🏆', category: 'streak' },
  { id: 'xp_1k', title: '初学者', description: '累计获得 1,000 XP', icon: '⭐', category: 'xp' },
  { id: 'xp_10k', title: '进阶学习者', description: '累计获得 10,000 XP', icon: '🏅', category: 'xp' },
  { id: 'xp_50k', title: '大师级', description: '累计获得 50,000 XP', icon: '🥇', category: 'xp' },
  { id: 'xp_100k', title: '熟练掌握', description: '累计获得 100,000 XP', icon: '🎖️', category: 'xp' },
  { id: 'daily_xp_100', title: '状态在线', description: '单日最高达到 100 XP', icon: '⚡', category: 'xp' },
  { id: 'daily_xp_500', title: '火力全开', description: '单日最高达到 500 XP', icon: '💥', category: 'xp' },
  { id: 'daily_xp_1000', title: '爆发日', description: '单日最高达到 1,000 XP', icon: '👑', category: 'xp' },
  { id: 'lang_3', title: '语言探索者', description: '学习 3 门语言', icon: '🌍', category: 'special' },
  { id: 'lang_5', title: '多语言者', description: '学习 5 门语言', icon: '🔒', category: 'special' },
  { id: 'plus', title: '超级会员', description: '开通 Super 会员', icon: '✨', category: 'special' },
];

const CATEGORY_COLORS: Record<string, string> = {
  streak: 'from-red-400 to-orange-400',
  xp: 'from-yellow-400 to-amber-500',
  crowns: 'from-yellow-300 to-yellow-500',
  special: 'from-purple-400 to-pink-500',
};

const ACHIEVEMENT_CARD_STYLES: Record<string, string> = {
  streak_7: 'from-[#ff8a66] via-[#ff9f5a] to-[#ffb36b]',
  streak_30: 'from-[#ff7f6e] via-[#ff9161] to-[#ffb14c]',
  streak_100: 'from-[#ff9360] via-[#ffa24f] to-[#ffbf47]',
  streak_365: 'from-[#ff8f66] via-[#ff9a63] to-[#ffb86a]',
  xp_1k: 'from-[#ffcd38] via-[#ffc21e] to-[#ffb100]',
  xp_10k: 'from-[#ffd23f] via-[#ffc720] to-[#ffbb00]',
  xp_50k: 'from-[#ffcb36] via-[#ffbf15] to-[#ffac00]',
  xp_100k: 'from-[#ffd95a] via-[#ffc928] to-[#ffb100]',
  daily_xp_100: 'from-[#ffe15c] via-[#ffd73a] to-[#ffc91d]',
  daily_xp_500: 'from-[#ffe76d] via-[#ffda47] to-[#ffcb21]',
  daily_xp_1000: 'from-[#f5d54b] via-[#e6c12d] to-[#cfa317]',
  lang_3: 'from-[#b879f1] via-[#cf63cb] to-[#f04d8e]',
  lang_5: 'from-[#c8c8cc] via-[#d9d9df] to-[#eeeeef]',
  plus: 'from-[#b56df1] via-[#cb61da] to-[#ef5aa6]',
};

export default function AchievementsSection({ userData }: AchievementsSectionProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const maxDailyXp = useMemo(() => {
    if (!userData.yearlyXpHistory?.length) return 0;
    return userData.yearlyXpHistory.reduce((max, item) => Math.max(max, item.xp || 0), 0);
  }, [userData.yearlyXpHistory]);

  const { unlocked, locked } = useMemo(() => {
    const unlockedList: Achievement[] = [];
    const lockedList: Achievement[] = [];

    ALL_ACHIEVEMENTS.forEach((achievement) => {
      let isUnlocked = false;

      switch (achievement.id) {
        case 'streak_7':
          isUnlocked = userData.streak >= 7;
          break;
        case 'streak_30':
          isUnlocked = userData.streak >= 30;
          break;
        case 'streak_100':
          isUnlocked = userData.streak >= 100;
          break;
        case 'streak_365':
          isUnlocked = userData.streak >= 365;
          break;
        case 'xp_1k':
          isUnlocked = userData.totalXp >= 1000;
          break;
        case 'xp_10k':
          isUnlocked = userData.totalXp >= 10000;
          break;
        case 'xp_50k':
          isUnlocked = userData.totalXp >= 50000;
          break;
        case 'xp_100k':
          isUnlocked = userData.totalXp >= 100000;
          break;
        case 'daily_xp_100':
          isUnlocked = maxDailyXp >= 100;
          break;
        case 'daily_xp_500':
          isUnlocked = maxDailyXp >= 500;
          break;
        case 'daily_xp_1000':
          isUnlocked = maxDailyXp >= 1000;
          break;
        case 'lang_3':
          isUnlocked = userData.courses.length >= 3;
          break;
        case 'lang_5':
          isUnlocked = userData.courses.length >= 5;
          break;
        case 'plus':
          isUnlocked = userData.isPlus;
          break;
      }

      if (isUnlocked) {
        unlockedList.push(achievement);
        return;
      }

      lockedList.push(achievement);
    });

    return { unlocked: unlockedList, locked: lockedList };
  }, [maxDailyXp, userData.courses.length, userData.isPlus, userData.streak, userData.totalXp]);

  const allAchievements = [...unlocked, ...locked];
  const selectedUnlocked = selectedAchievement ? unlocked.some((achievement) => achievement.id === selectedAchievement.id) : false;

  useEffect(() => {
    if (!selectedAchievement) return;

    function handlePointerDown(event: MouseEvent): void {
      if (modalRef.current?.contains(event.target as Node)) return;
      setSelectedAchievement(null);
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [selectedAchievement]);

  return (
    <div className="screenshot-solid-surface relative overflow-hidden rounded-apple-xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,252,0.94))] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] min-[768px]:max-[1023px]:mx-auto min-[768px]:max-[1023px]:max-w-[860px] min-[768px]:max-[1279px]:p-4 dark:border-0 dark:[background-clip:border-box] dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.92),rgba(28,28,30,0.96))] dark:shadow-none dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)]">
      <div className="mb-4 flex items-center justify-between min-[768px]:max-[1279px]:mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-[0_6px_16px_rgba(15,23,42,0.05)] min-[768px]:max-[1279px]:h-8 min-[768px]:max-[1279px]:w-8 min-[768px]:max-[1279px]:rounded-[18px] dark:border-white/10 dark:bg-white/8">
            <span className="text-lg">🏅</span>
          </div>
          <h2 className="text-lg font-semibold">成就勋章</h2>
        </div>
        <span className="text-sm text-apple-gray6 min-[768px]:max-[1279px]:text-xs">
          {unlocked.length} / {ALL_ACHIEVEMENTS.length}
        </span>
      </div>

      <div className="mb-4 min-[768px]:max-[1279px]:mb-3">
        <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-duo-yellow/10 to-orange-400/10 p-3 min-[768px]:max-[1279px]:rounded-[18px] min-[768px]:max-[1279px]:p-2.5">
          <span className="text-2xl min-[1024px]:max-[1110px]:text-xl">⚡</span>
          <div>
            <div className="text-xs text-apple-gray6">单日最高经验</div>
            <div className="text-xl font-bold text-duo-yellow min-[768px]:max-[1279px]:text-lg">{maxDailyXp.toLocaleString()} XP</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 min-[768px]:max-[1279px]:grid-cols-7 min-[768px]:max-[1279px]:gap-1.5 xl:grid-cols-5">
        {allAchievements.map((achievement) => {
          const isUnlocked = unlocked.some((item) => item.id === achievement.id);
          const color = CATEGORY_COLORS[achievement.category] || 'from-gray-400 to-gray-500';
          const cardStyle = ACHIEVEMENT_CARD_STYLES[achievement.id] || color;

          return (
            <button
              key={achievement.id}
              onClick={() => setSelectedAchievement(achievement)}
              className={`group relative aspect-square overflow-hidden rounded-2xl border p-1 transition-transform duration-200 hover:scale-[1.02] min-[768px]:max-[1279px]:aspect-[1/0.82] min-[768px]:max-[1279px]:rounded-[18px] min-[768px]:max-[1279px]:p-0.5 ${
                isUnlocked
                  ? 'border-white/60 shadow-[0_8px_18px_rgba(251,146,60,0.14)] hover:shadow-[0_14px_28px_rgba(251,146,60,0.2)] dark:border-0 dark:[background-clip:border-box]'
                  : 'border-apple-gray3 bg-gradient-to-br from-[#f7f7f8] to-[#ececef] opacity-70 hover:opacity-90 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)] dark:border-apple-dark4 dark:from-apple-dark3 dark:to-apple-dark2 dark:hover:shadow-[0_14px_26px_rgba(0,0,0,0.22)]'
              }`}
            >
              {isUnlocked && (
                <>
                  <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${cardStyle} opacity-[0.78]`} />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.18))]"
                  />
                </>
              )}

              <div className="relative flex h-full flex-col items-center justify-center">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110 min-[1024px]:max-[1110px]:text-[13px]">{isUnlocked ? achievement.icon : '🔒'}</span>
                <span className="mt-0.5 w-full truncate px-1 text-center text-[9px] font-medium leading-tight text-apple-dark1 min-[1024px]:max-[1110px]:text-[11px] dark:text-white/90">
                  {achievement.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAchievement && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
          <div
            key={selectedAchievement.id}
            ref={modalRef}
            className="pointer-events-auto w-[260px] animate-scale-in rounded-3xl border border-black/6 bg-[rgba(255,255,255,0.94)] px-5 py-6 text-center shadow-[0_22px_52px_rgba(15,23,42,0.16)] transition-all duration-200 dark:border-white/10 dark:bg-[rgba(44,44,46,0.96)]"
          >
            <div
              className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[22px] bg-gradient-to-br ${
                CATEGORY_COLORS[selectedAchievement.category] || 'from-gray-400 to-gray-500'
              } shadow-[0_12px_28px_rgba(251,191,36,0.24)]`}
            >
              <span className="text-4xl">{selectedUnlocked ? selectedAchievement.icon : '🔒'}</span>
            </div>

            <h3 className="mb-2 text-2xl font-black tracking-tight">{selectedAchievement.title}</h3>
            <p className="mx-auto mb-4 text-base text-apple-gray6 dark:text-apple-dark6">{selectedAchievement.description}</p>

            <div
              className={`mx-auto inline-flex rounded-full px-4 py-1.5 text-sm font-bold ${
                selectedUnlocked
                  ? 'bg-duo-green/20 text-duo-green'
                  : 'bg-apple-gray2 text-apple-gray6 dark:bg-apple-dark3 dark:text-apple-dark6'
              }`}
            >
              {selectedUnlocked ? '已解锁' : '未解锁'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
