import type { Course } from '../types';

const ESTIMATED_XP_PER_MINUTE = 3;

export function getCourseMinutes(course: Course): number {
  const recordedMinutes = Number(course.timeSpent ?? 0);
  if (recordedMinutes > 0) return Math.round(recordedMinutes);
  if (course.xp > 0) return Math.ceil(course.xp / ESTIMATED_XP_PER_MINUTE);
  return 0;
}

export function getCoursesTotalMinutes(courses: Course[]): number {
  return courses.reduce((sum, course) => sum + getCourseMinutes(course), 0);
}

export function formatCompactMinutes(minutes: number): string {
  const normalizedMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(normalizedMinutes / 60);
  const remainingMinutes = normalizedMinutes % 60;

  if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}min`;
  if (hours > 0) return `${hours}h`;
  return `${normalizedMinutes}min`;
}

export function formatSharePercentage(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0%';
  if (value < 1) return `${value.toFixed(2).replace(/\.?0+$/, '')}%`;
  if (value < 10) return `${value.toFixed(1).replace(/\.0$/, '')}%`;
  return `${value.toFixed(value % 1 === 0 ? 0 : 1).replace(/\.0$/, '')}%`;
}
