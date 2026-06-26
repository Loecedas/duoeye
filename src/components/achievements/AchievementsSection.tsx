import { useEffect, useMemo, useRef, useState } from 'react';
import type { Achievement, UserData } from '../../types';
import EmojiIcon from '../icons/EmojiIcon';
import { useEmojiIconMode } from '../icons/EmojiMode';
import { getLanguageCourses } from '../../utils/languageCourses';

interface AchievementsSectionProps {
  userData: UserData;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'streak_7', title: '一周坚持', description: '连续学习 7 天', icon: '🔥', category: 'streak' },
  { id: 'streak_30', title: '月度坚持', description: '连续学习 30 天', icon: '🚀', category: 'streak' },
  { id: 'streak_100', title: '百日坚持', description: '连续学习 100 天', icon: '🎯', category: 'streak' },
  { id: 'streak_365', title: '年度坚持', description: '连续学习 365 天', icon: '🏆', category: 'streak' },
  { id: 'xp_1k', title: '初学者', description: '累计获得 1,000 XP', icon: '⭐', category: 'xp' },
  { id: 'xp_10k', title: '进阶学习者', description: '累计获得 10,000 XP', icon: '🎖️', category: 'xp' },
  { id: 'xp_50k', title: '大师级', description: '累计获得 50,000 XP', icon: '🥇', category: 'xp' },
  { id: 'xp_100k', title: '熟练掌握', description: '累计获得 100,000 XP', icon: '🏅', category: 'xp' },
  { id: 'daily_xp_100', title: '状态在线', description: '单日最高达到 100 XP', icon: '⚡', category: 'xp' },
  { id: 'daily_xp_500', title: '火力全开', description: '单日最高达到 500 XP', icon: '💥', category: 'xp' },
  { id: 'daily_xp_1000', title: '爆发日', description: '单日最高达到 1,000 XP', icon: '👑', category: 'xp' },
  { id: 'daily_xp_2000', title: '极限冲刺', description: '单日最高达到 2,000 XP', icon: '📈', category: 'xp' },
  { id: 'lang_1', title: '语言探索者', description: '语言分布中有 1 个及以上选项卡', icon: '🦉', category: 'special' },
  { id: 'lang_3', title: '多语言者', description: '语言分布中有 3 个及以上选项卡', icon: '🌐', category: 'special' },
  { id: 'lang_5', title: '语言家', description: '语言分布中有 5 个及以上选项卡', icon: '🧭', category: 'special' },
];

const CATEGORY_COLORS: Record<string, string> = {
  streak: 'linear-gradient(135deg, #f87171 0%, #fb923c 100%)',
  xp: 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)',
  crowns: 'linear-gradient(135deg, #fde047 0%, #eab308 100%)',
  special: 'linear-gradient(135deg, #c084fc 0%, #ec4899 100%)',
};

const ACHIEVEMENT_CARD_STYLES: Record<string, string> = {
  streak_7: 'linear-gradient(135deg, #FFE1D3 0%, #FFBCA1 52%, #FF8C64 100%)',
  streak_30: 'linear-gradient(135deg, #E6CEFF 0%, #D2A7FF 52%, #B372FB 100%)',
  streak_100: 'linear-gradient(135deg, #C4F7DC 0%, #96F1C9 52%, #51E0A8 100%)',
  streak_365: 'linear-gradient(135deg, #FFD8DB 0%, #FFB8C2 52%, #FC8A9A 100%)',
  xp_1k: 'linear-gradient(135deg, #CEDFFF 0%, #AECDFE 52%, #79B5FC 100%)',
  xp_10k: 'linear-gradient(135deg, #FDDDF0 0%, #FBC0E0 52%, #F789C6 100%)',
  xp_50k: 'linear-gradient(135deg, #FFE6C3 0%, #FDC77B 52%, #FC9D3A 100%)',
  xp_100k: 'linear-gradient(135deg, #D9DEFF 0%, #B6C3FD 52%, #93A0FA 100%)',
  daily_xp_100: 'linear-gradient(135deg, #EAFFBF 0%, #D2FF80 52%, #B0EC4D 100%)',
  daily_xp_500: 'linear-gradient(135deg, #FFE9A4 0%, #FDD859 52%, #FDBF26 100%)',
  daily_xp_1000: 'linear-gradient(135deg, #FFF7B0 0%, #FEF271 52%, #FDE43E 100%)',
  daily_xp_2000: 'linear-gradient(135deg, #FFE0BF 0%, #FFB066 48%, #FF6A00 100%)',
  lang_1: 'linear-gradient(135deg, #DDF4FF 0%, #9EE7FF 48%, #48C5FF 100%)',
  lang_3: 'linear-gradient(135deg, #C0F4F8 0%, #92E8F3 52%, #46D7EA 100%)',
  lang_5: 'linear-gradient(135deg, #C9EBE8 0%, #A3E0DC 52%, #66CDC2 100%)',
};

const ACHIEVEMENT_CARD_SHADOWS: Record<string, string> = {
  streak_7: 'shadow-[0_8px_18px_rgba(255,94,98,0.18)] hover:shadow-[0_14px_28px_rgba(255,94,98,0.26)]',
  streak_30: 'shadow-[0_8px_18px_rgba(121,86,236,0.18)] hover:shadow-[0_14px_28px_rgba(121,86,236,0.26)]',
  streak_100: 'shadow-[0_8px_18px_rgba(5,213,161,0.18)] hover:shadow-[0_14px_28px_rgba(5,213,161,0.26)]',
  streak_365: 'shadow-[0_8px_18px_rgba(252,103,103,0.18)] hover:shadow-[0_14px_28px_rgba(252,103,103,0.26)]',
  xp_1k: 'shadow-[0_8px_18px_rgba(29,168,247,0.18)] hover:shadow-[0_14px_28px_rgba(29,168,247,0.26)]',
  xp_10k: 'shadow-[0_8px_18px_rgba(242,108,195,0.18)] hover:shadow-[0_14px_28px_rgba(242,108,195,0.26)]',
  xp_50k: 'shadow-[0_8px_18px_rgba(255,89,100,0.18)] hover:shadow-[0_14px_28px_rgba(255,89,100,0.26)]',
  xp_100k: 'shadow-[0_8px_18px_rgba(92,127,255,0.18)] hover:shadow-[0_14px_28px_rgba(92,127,255,0.26)]',
  daily_xp_100: 'shadow-[0_8px_18px_rgba(74,222,128,0.18)] hover:shadow-[0_14px_28px_rgba(74,222,128,0.26)]',
  daily_xp_500: 'shadow-[0_8px_18px_rgba(249,115,22,0.18)] hover:shadow-[0_14px_28px_rgba(249,115,22,0.26)]',
  daily_xp_1000: 'shadow-[0_8px_18px_rgba(250,204,21,0.18)] hover:shadow-[0_14px_28px_rgba(250,204,21,0.26)]',
  daily_xp_2000: 'shadow-[0_8px_18px_rgba(255,106,0,0.18)] hover:shadow-[0_14px_28px_rgba(255,106,0,0.26)]',
  lang_1: 'shadow-[0_8px_18px_rgba(59,173,255,0.18)] hover:shadow-[0_14px_28px_rgba(59,173,255,0.26)]',
  lang_3: 'shadow-[0_8px_18px_rgba(16,185,129,0.18)] hover:shadow-[0_14px_28px_rgba(16,185,129,0.26)]',
  lang_5: 'shadow-[0_8px_18px_rgba(99,102,241,0.18)] hover:shadow-[0_14px_28px_rgba(99,102,241,0.26)]',
};

function getAchievementCardIconClassName(mode: 'emoji' | 'svg'): string {
  const base = 'text-[1.3rem] max-[520px]:text-[1.02rem] min-[1024px]:max-[1110px]:text-[1.1rem]';
  if (mode !== 'emoji') return base;
  return base;
}

export default function AchievementsSection({ userData }: AchievementsSectionProps) {
  const emojiIconMode = useEmojiIconMode();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const maxDailyXp = useMemo(() => {
    if (!userData.yearlyXpHistory?.length) return 0;
    return userData.yearlyXpHistory.reduce((max, item) => Math.max(max, item.xp || 0), 0);
  }, [userData.yearlyXpHistory]);

  const languageDistributionCardCount = useMemo(
    () => getLanguageCourses(userData.courses).length,
    [userData.courses],
  );

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
        case 'daily_xp_2000':
          isUnlocked = maxDailyXp >= 2000;
          break;
        case 'lang_1':
          isUnlocked = languageDistributionCardCount >= 1;
          break;
        case 'lang_3':
          isUnlocked = languageDistributionCardCount >= 3;
          break;
        case 'lang_5':
          isUnlocked = languageDistributionCardCount >= 5;
          break;
      }

      if (isUnlocked) {
        unlockedList.push(achievement);
        return;
      }

      lockedList.push(achievement);
    });

    return { unlocked: unlockedList, locked: lockedList };
  }, [languageDistributionCardCount, maxDailyXp, userData.streak, userData.totalXp]);

  const allAchievements = [...unlocked, ...locked];
  const selectedUnlocked = selectedAchievement
    ? unlocked.some((achievement) => achievement.id === selectedAchievement.id)
    : false;
  const modalBgGradient = selectedAchievement
    ? (ACHIEVEMENT_CARD_STYLES[selectedAchievement.id] || 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)')
    : '';

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
    <div className="screenshot-solid-surface relative flex h-full flex-col overflow-hidden rounded-apple-xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,252,0.94))] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] max-[520px]:p-4 min-[768px]:max-[1023px]:mx-auto min-[768px]:max-[1023px]:max-w-[860px] min-[768px]:max-[1279px]:p-4 dark:border-transparent dark:[background-clip:border-box] dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.92),rgba(28,28,30,0.96))] dark:shadow-none dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,200,0,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,200,0,0.2),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.14),transparent_46%)]"
      />
      <div className="mb-4 flex items-center justify-between max-[520px]:mb-3 min-[768px]:max-[1279px]:mb-3">
        <div className="flex items-center gap-2">
          <EmojiIcon symbol="🏅" className="text-[1.32rem] leading-none max-[520px]:text-[1.12rem] min-[768px]:max-[1279px]:text-[1.14rem]" />
          <h2 className="whitespace-nowrap text-lg font-semibold max-[520px]:text-base">成就勋章</h2>
        </div>
        <span className="text-sm text-apple-gray6 max-[520px]:text-xs min-[768px]:max-[1279px]:text-xs">
          {unlocked.length} / {ALL_ACHIEVEMENTS.length}
        </span>
      </div>

      <div className="mb-4 max-[520px]:mb-3 min-[768px]:max-[1279px]:mb-3">
        <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-duo-yellow/10 to-orange-400/10 p-3 max-[520px]:rounded-[18px] max-[520px]:p-2.5 min-[768px]:max-[1279px]:rounded-[18px] min-[768px]:max-[1279px]:p-2.5">
          <EmojiIcon symbol="⚡" className="text-[1.84rem] max-[520px]:text-[1.55rem] min-[1024px]:max-[1110px]:text-[1.62rem]" />
          <div>
            <div className="text-xs text-apple-gray6 max-[520px]:text-[11px]">单日最高经验</div>
            <div className="text-xl font-bold text-duo-yellow max-[520px]:text-lg min-[768px]:max-[1279px]:text-lg">
              {maxDailyXp.toLocaleString()} XP
            </div>
          </div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-5 gap-2 max-[520px]:grid-cols-4 max-[520px]:gap-1.5 md:grid-cols-4 md:gap-2.5 lg:grid-cols-5 xl:grid-cols-5">
        {allAchievements.map((achievement) => {
          const isUnlocked = unlocked.some((item) => item.id === achievement.id);
          const color = CATEGORY_COLORS[achievement.category] || 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
          const cardStyle = ACHIEVEMENT_CARD_STYLES[achievement.id] || color;

          return (
            <button
              key={achievement.id}
              onClick={() => setSelectedAchievement(achievement)}
              className={`group relative aspect-square overflow-hidden rounded-2xl border bg-white p-1 transition-transform duration-200 hover:scale-[1.02] max-[520px]:rounded-[18px] max-[520px]:p-0.5 min-[768px]:max-[1279px]:aspect-[1/0.82] min-[768px]:max-[1279px]:rounded-[18px] min-[768px]:max-[1279px]:p-0.5 dark:bg-[#2c2c2e] ${
                isUnlocked
                  ? `border-white/60 ${ACHIEVEMENT_CARD_SHADOWS[achievement.id] || 'shadow-[0_8px_18px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_28px_rgba(15,23,42,0.1)]'} dark:border-white/10 dark:[background-clip:border-box]`
                  : 'border-apple-gray3/60 hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)] dark:border-apple-dark4/60'
              }`}
            >
              {isUnlocked ? (
                <>
                  <div aria-hidden="true" className="absolute inset-0 opacity-[0.91] dark:opacity-[0.16]" style={{ backgroundImage: cardStyle }} />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.48),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.22))] dark:hidden"
                  />
                </>
              ) : (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.38] saturate-[0.7] contrast-[0.9] dark:opacity-[0.06]"
                    style={{ backgroundImage: cardStyle }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)] bg-black/[0.02] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)] dark:bg-black/[0.12] dark:hidden"
                  />
                </>
              )}

              <div className="relative flex h-full flex-col items-center justify-center gap-1.5">
                <div className="flex h-[1.6rem] w-[1.9rem] items-center justify-center max-[520px]:h-[1.24rem] max-[520px]:w-[1.44rem] min-[1024px]:max-[1110px]:h-[1.36rem] min-[1024px]:max-[1110px]:w-[1.64rem]">
                  <EmojiIcon
                    symbol={isUnlocked ? achievement.icon : '🔒'}
                    className={getAchievementCardIconClassName(emojiIconMode)}
                  />
                </div>
                <span className="w-full truncate px-1 text-center text-[9px] font-medium leading-tight text-apple-dark1 max-[520px]:text-[8px] min-[1024px]:max-[1110px]:text-[11px] dark:text-white/90">
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
            className="pointer-events-auto relative w-[260px] animate-scale-in overflow-hidden rounded-3xl border border-white/60 bg-white/18 px-5 py-6 text-center shadow-[0_24px_58px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-200 dark:border-white/20 dark:bg-[#2c2c2e]/24 dark:backdrop-blur-xl"
          >
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.24] dark:opacity-[0.12]" style={{ backgroundImage: modalBgGradient }} />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.48),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.18))] dark:hidden"
            />

            <div className="relative flex flex-col items-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center">
                <EmojiIcon
                  symbol={selectedUnlocked ? selectedAchievement.icon : '🔒'}
                  className="block text-[3rem] filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
                />
              </div>

              <h3 className="mb-1.5 text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                {selectedAchievement.title}
              </h3>

              <p className="mx-auto mb-4 max-w-[200px] text-sm font-medium leading-relaxed text-slate-700 dark:text-white/80">
                {selectedAchievement.description}
              </p>

              <div
                className={`mx-auto inline-flex rounded-full border px-4 py-1 text-xs font-bold shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
                  selectedUnlocked
                    ? 'border-emerald-500/25 bg-emerald-500/20 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/30 dark:text-emerald-300'
                    : 'border-slate-400/20 bg-slate-500/10 text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-white/70'
                }`}
              >
                {selectedUnlocked ? '已解锁' : '未解锁'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
