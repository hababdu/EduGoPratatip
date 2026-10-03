import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LessonDetailPage } from './LessonDetailPage';
import {
  Search,
  PlayCircle,
  CheckCircle,
  Lock,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const LessonsPage: React.FC = () => {
  const { lessons, subjects, selectedLessonId, setSelectedLessonId } = useApp();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // If a specific lesson is clicked, render the detailed lesson page
  if (selectedLessonId) {
    return <LessonDetailPage lessonId={selectedLessonId} />;
  }

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSubject =
      selectedSubjectFilter === 'all' || lesson.subjectId === selectedSubjectFilter;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Page Title & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white">Darslar & Video Ma'ruzalar</h1>
          <p className="text-xs text-white/50">Mavzularni ketma-ketlikda o'rganing va amaliy bilimlarni mustahkamlang</p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Dars mavzusini qidirish..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#ffb020]/60 transition"
            />
          </div>

          {/* Subject Filter Pills (interactive segmented control) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedSubjectFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSubjectFilter === 'all'
                  ? 'bg-[#ffb020] text-[#0b0d19]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Barcha Fanlar
            </button>
            {subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectFilter(sub.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedSubjectFilter === sub.id
                    ? 'bg-[#ffb020] text-[#0b0d19]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {sub.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div className="space-y-3">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-white/5 bg-[#12162a] p-6 space-y-2">
            <Filter className="w-8 h-8 text-white/20 mx-auto" />
            <div className="text-sm font-semibold text-white">Hech qanday dars topilmadi</div>
            <p className="text-xs text-white/40">Qidiruv so'zini yoki fan filtrini o'zgartirib ko'ring.</p>
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            return (
              <div
                key={lesson.id}
                onClick={() => {
                  if (!lesson.isLocked) {
                    setSelectedLessonId(lesson.id);
                  }
                }}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition ${
                  lesson.isLocked
                    ? 'bg-[#0f1222]/50 border-white/5 opacity-60 cursor-not-allowed'
                    : 'bg-[#12162a] border-white/10 hover:border-white/25 hover:bg-[#161a33] cursor-pointer'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 mb-3 sm:mb-0">
                  <div className="mt-0.5 sm:mt-0 flex items-center justify-center w-10 h-10 rounded-xl shrink-0 bg-white/5 border border-white/10">
                    {lesson.isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-[#34d0a0]" />
                    ) : lesson.isLocked ? (
                      <Lock className="w-5 h-5 text-white/40" />
                    ) : (
                      <PlayCircle className="w-5 h-5 text-[#ffb020]" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-[#38bdf8]">
                        {lesson.subjectTitle}
                      </span>
                      {lesson.isCompleted && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#34d0a0]/15 text-[#34d0a0] font-bold">
                          Tugallangan
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#ffb020]">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-white/60 line-clamp-1">
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.durationMinutes} daqiqa</span>
                  </div>

                  {!lesson.isLocked ? (
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#ffb020] hover:text-[#0b0d19] text-xs font-semibold text-white transition cursor-pointer">
                      <span>Darsni ochish</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-white/30 font-medium">Qulflangan</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
