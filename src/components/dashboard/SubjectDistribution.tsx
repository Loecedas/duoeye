import { useMemo } from 'react';
import type { Course } from '../../types';
import EmojiIcon from '../icons/EmojiIcon';
import {
  formatCompactMinutes,
  formatSharePercentage,
  getCourseMinutes,
  getCoursesTotalMinutes,
} from '../../utils/courseMetrics';

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

function resolveSubjectIcon(subject: string | undefined): string {
  if (subject === 'chess') return '♟️';
  if (subject === 'math') return '🔢';
  if (subject === 'music') return '🎵';
  return '📘';
}

export default function SubjectDistribution({ courses, totalXp }: SubjectDistributionProps) {
  const subjectCourses = useMemo(
    () =>
      courses
        .filter((course) => ['chess', 'math', 'music'].includes(String(course.subject || '').toLowerCase()))
        .sort((a, b) => b.xp - a.xp),
    [courses],
  );
  const totalTime = useMemo(() => getCoursesTotalMinutes(courses), [courses]);

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
        const percentage = totalXp > 0 ? (course.xp / totalXp) * 100 : 0;
        const timeMinutes = getCourseMinutes(course);
        const timePercentage = totalTime > 0 ? (timeMinutes / totalTime) * 100 : 0;
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
              <div className="flex h-10 w-10 items-center justify-center">
                <EmojiIcon symbol={resolveSubjectIcon(course.subject)} className="text-3xl" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col">
                  <span className="flex items-baseline gap-1.5 tracking-tight" style={{ color }}>
                    <span className="text-xl font-black">
                      {course.xp.toLocaleString()}{' '}
                      <span className="text-sm">XP</span>
                    </span>
                    <span className="text-xs font-semibold tracking-normal text-apple-gray6 dark:text-apple-dark6">
                      ({formatCompactMinutes(timeMinutes)})
                    </span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-apple-gray6 dark:text-apple-dark6">
                    Total XP (Time)
                  </span>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="flex items-baseline gap-1">
                    <span className="text-[13px] font-semibold text-apple-dark1 dark:text-white">
                      {formatSharePercentage(percentage)}
                    </span>
                    <span className="text-[11px] font-medium text-apple-gray6 dark:text-apple-dark6">
                      ({formatSharePercentage(timePercentage)})
                    </span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-apple-gray6 dark:text-apple-dark6">
                    Share (Time)
                  </span>
                </div>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className="relative h-full overflow-hidden rounded-full transition-[width] duration-1000 ease-out"
                  style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
