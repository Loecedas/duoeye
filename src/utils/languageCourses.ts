import type { Course } from '../types';

const NON_LANGUAGE_SUBJECTS = new Set(['chess', 'math', 'music']);

export function getLanguageCourses(courses: Course[]): Course[] {
  return courses.filter(
    (course) => !NON_LANGUAGE_SUBJECTS.has(String(course.subject || '').toLowerCase()),
  );
}
