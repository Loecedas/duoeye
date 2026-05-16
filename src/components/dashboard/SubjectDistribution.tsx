import { useMemo } from 'react';
import type { Course } from '../../types';
import EmojiIcon from '../icons/EmojiIcon';

interface SubjectDistributionProps {
  courses: Course[];
  totalXp: number;
}

function resolveSubjectLabel(course: Course): string {
  const subject = String(course.subject || '').toLowerCase();
  if (subject === 'chess') return '国际象棋';
  if (subject === 'math') return '数学';
  if (subject === 'music') return '音乐';
  return course.title;
}

export default function SubjectDistribution({ courses, totalXp }: SubjectDistributionProps) {
  // Filter only subjects (chess, math, music)
  const subjectCourses = useMemo(() => 
    courses.filter(c => ['chess', 'math', 'music'].includes(String(c.subject || '').toLowerCase()))
    .sort((a, b) => b.xp - a.xp), 
  [courses]);

  const colors = ['#1CB0F6', '#58CC02', '#FF9600', '#A572F7', '#FF4B4B'];

  if (subjectCourses.length === 0) {
    return (
      <div className="flex h-full min-h-[160px] items-center justify-center rounded-[22px] border border-dashed border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/5">
        <p className="text-sm text-apple-gray6 dark:text-apple-dark6">暂无非语言类课程数据</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 md:flex-row">
      {subjectCourses.map((course, index) => {
        const percentage = totalXp > 0 ? Math.round((course.xp / totalXp) * 100) : 0;
        const color = colors[index % colors.length];

        return (
          <div
            key={course.id}
            className="group relative flex flex-1 flex-col justify-between rounded-3xl border border-white/60 bg-white/40 p-4 shadow-sm transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-base font-bold text-apple-dark1 dark:text-white">
                  {resolveSubjectLabel(course)}
                </span>
                <span className="mt-0.5 text-xs text-apple-gray6 dark:text-apple-dark6">
                  累计学习进度
                </span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-white/10">
                <EmojiIcon 
                  symbol={course.subject === 'chess' ? '♟️' : course.subject === 'math' ? '🔢' : '🎵'} 
                  className="text-xl" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight" style={{ color }}>
                    {course.xp.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-apple-gray6 dark:text-apple-dark6">
                    Total XP
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-apple-dark1 dark:text-white">
                    {percentage}%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-apple-gray6 dark:text-apple-dark6">
                    Share
                  </span>
                </div>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className="relative h-full overflow-hidden rounded-full transition-[width] duration-1000 ease-out"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </div>
              </div>
              
              {course.timeSpent !== undefined && course.timeSpent > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-apple-gray6 dark:text-apple-dark6">
                  <EmojiIcon symbol="⏱️" className="text-xs" />
                  <span>已投入约 {course.timeSpent} 分钟</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
