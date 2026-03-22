import { useState, useMemo } from 'react';
import type { Course } from '../../types';

interface CourseListProps {
  courses: Course[];
}

const LANGUAGE_FLAGS: Record<string, string> = {
  'en': '🇬🇧', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪',
  'it': '🇮🇹', 'pt': '🇵🇹', 'ja': '🇯🇵', 'ko': '🇰🇷',
  'zh': '🇨🇳', 'ru': '🇷🇺', 'ar': '🇸🇦', 'hi': '🇮🇳',
  'tr': '🇹🇷', 'vi': '🇻🇳', 'th': '🇹🇭', 'id': '🇮🇩',
  'pl': '🇵🇱', 'nl': '🇳🇱', 'sv': '🇸🇪', 'da': '🇩🇰',
  'no': '🇳🇴', 'fi': '🇫🇮', 'el': '🇬🇷', 'he': '🇮🇱',
  'cs': '🇨🇿', 'ro': '🇷🇴', 'hu': '🇭🇺', 'uk': '🇺🇦',
};

export default function CourseList({ courses }: CourseListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const sortedCourses = useMemo(() => 
    [...courses].sort((a, b) => b.xp - a.xp), 
    [courses]
  );

  const displayCourses = isExpanded ? sortedCourses : sortedCourses.slice(0, 4);

  return (
    <div className="bg-white dark:bg-apple-dark2 rounded-apple-xl p-6 shadow-apple transition-all duration-300 hover:shadow-apple-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-duo-blue/20 to-duo-purple/20 flex items-center justify-center">
            <span className="text-lg">📚</span>
          </div>
          <h2 className="text-lg font-semibold">学习课程</h2>
        </div>
        <span className="text-sm text-apple-gray6">{courses.length} 门</span>
      </div>
      
      <div className="space-y-2">
        {displayCourses.map((course, index) => (
          <div 
            key={course.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-apple-gray2 dark:bg-apple-dark3 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
              {LANGUAGE_FLAGS[course.learningLanguage] || '🌐'}
            </span>
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate text-sm">{course.title}</div>
              <div className="flex items-center gap-2 text-xs text-apple-gray6">
                <span className="flex items-center gap-1">
                  <span className="text-duo-yellow">👑</span>
                  {course.crowns}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-duo-blue text-sm">{course.xp.toLocaleString()}</div>
              <div className="text-xs text-apple-gray6">XP</div>
            </div>
          </div>
        ))}
      </div>

      {courses.length > 4 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 py-2 text-sm font-medium text-duo-blue hover:text-duo-blueDark transition-colors"
        >
          {isExpanded ? '收起' : `还有 ${courses.length - 4} 门课程`}
        </button>
      )}
    </div>
  );
}
