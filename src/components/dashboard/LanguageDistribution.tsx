import { useMemo } from 'react';
import type { Course } from '../../types';

interface LanguageDistributionProps {
  courses: Course[];
  totalXp: number;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: '英语',
  es: '西班牙语',
  fr: '法语',
  de: '德语',
  it: '意大利语',
  pt: '葡萄牙语',
  ja: '日语',
  ko: '韩语',
  zh: '中文',
  zs: '中文',
  zt: '中文',
  yue: '粤语',
  zh_hk: '粤语',
  zh_cn: '中文',
  ru: '俄语',
  ar: '阿拉伯语',
  hi: '印地语',
  tr: '土耳其语',
  vi: '越南语',
  th: '泰语',
  id: '印尼语',
  pl: '波兰语',
  nl: '荷兰语',
  sv: '瑞典语',
  da: '丹麦语',
  no: '挪威语',
  fi: '芬兰语',
  el: '希腊语',
  he: '希伯来语',
  cs: '捷克语',
  ro: '罗马尼亚语',
  hu: '匈牙利语',
  uk: '乌克兰语',
};

const TITLE_ALIASES: Record<string, string> = {
  'Chinese (Cantonese)': '粤语',
  Cantonese: '粤语',
  Chinese: '中文',
  English: '英语',
  Japanese: '日语',
  Korean: '韩语',
  French: '法语',
  German: '德语',
  Spanish: '西班牙语',
  Portuguese: '葡萄牙语',
  Italian: '意大利语',
};

function resolveLanguageLabel(course: Course): string {
  return LANGUAGE_NAMES[course.learningLanguage] || TITLE_ALIASES[course.title] || course.title;
}

export default function LanguageDistribution({ courses, totalXp }: LanguageDistributionProps) {
  const sortedCourses = useMemo(() => [...courses].sort((a, b) => b.xp - a.xp).slice(0, 4), [courses]);
  const colors = ['#58CC02', '#1CB0F6', '#A572F7', '#FF9600', '#FF4B4B'];

  return (
    <div className="screenshot-solid-surface relative overflow-hidden rounded-apple-xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,252,0.94))] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] dark:border-transparent dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.92),rgba(28,28,30,0.96))] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-[0_6px_16px_rgba(15,23,42,0.05)] dark:border-transparent dark:bg-white/8">
            <span className="text-lg">🌍</span>
          </div>
          <h2 className="text-lg font-semibold text-apple-dark1 dark:text-white">语言分布</h2>
        </div>
      </div>

      <div className="space-y-4">
        {sortedCourses.map((course, index) => {
          const percentage = totalXp > 0 ? Math.round((course.xp / totalXp) * 100) : 0;
          const color = colors[index % colors.length];

          return (
            <div
              key={course.id}
              className="group rounded-2xl px-2 py-2 transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-black/[0.02] hover:shadow-[0_10px_20px_rgba(15,23,42,0.06)] dark:hover:bg-white/[0.03] dark:hover:shadow-[0_12px_22px_rgba(0,0,0,0.2)]"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-apple-dark1 dark:text-white">{resolveLanguageLabel(course)}</span>
                <span className="text-sm font-semibold" style={{ color }}>
                  {percentage}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-apple-gray3 dark:bg-apple-dark3">
                <div
                  className="relative h-full overflow-hidden rounded-full transition-[width,filter] duration-700 ease-out group-hover:brightness-[1.03]"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                >
                  <div className="absolute inset-0 opacity-60 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
              </div>

              <div className="mt-1.5 flex items-center text-xs text-apple-gray6 dark:text-apple-dark6">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{course.xp.toLocaleString()}</span>
                  XP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {courses.length > 4 ? (
        <div className="mt-4 border-t border-apple-gray3 pt-4 dark:border-apple-dark4">
          <div className="text-sm text-apple-gray6 dark:text-apple-dark6">
            还有 <span className="font-semibold">{courses.length - 4}</span> 门语言正在学习
          </div>
        </div>
      ) : null}
    </div>
  );
}
