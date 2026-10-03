import React from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProgressChart } from '../../components/dashboard/StudentProgressChart';
import {
  Flame,
  Zap,
  Play,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    subjects,
    lessons,
    tests,
    setActiveTab,
    setSelectedLessonId,
    setActiveTestTakingId,
  } = useApp();

  // Find in-progress lesson
  const currentLesson = lessons.find((l) => !l.isCompleted && !l.isLocked) || lessons[0];
  const activeTest = tests.find((t) => !t.isCompleted) || tests[0];

  const handleOpenLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab('lessons');
  };

  const handleStartTest = (testId: string) => {
    setActiveTestTakingId(testId);
  };

  // Level XP calculations
  const currentLevel = currentUser.level;
  const nextLevelXp = (currentLevel + 1) * 500;
  const currentLevelProgress = Math.min(
    100,
    Math.round(((currentUser.xp % 500) / 500) * 100)
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Hero Banner with Generated Asset & Telegram Sync */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#141733] via-[#1a1f42] to-[#12152f] p-5 sm:p-7 shadow-xl">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-[#ffb020]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 lg:opacity-30 pointer-events-none overflow-hidden">
          <img
            src="/src/assets/images/edugo_hero_banner_1790979418494.jpg"
            alt="EduGo Hero Visual"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#34d0a0]/15 border border-[#34d0a0]/30 text-[#34d0a0] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#34d0a0] animate-pulse" />
                Telegram WebApp sinxronlangan
              </span>
              <span className="text-xs text-white/50">{currentUser.username}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Salom, {currentUser.name}! 👋
            </h1>

            <p className="text-sm text-white/70 leading-relaxed">
              Bugun ta'lim safaringizda ajoyib natijalar kutmoqda. O'zlashtirish sur'atini saqlab qoling va kunlik vazifalarni bajaring!
            </p>

            {/* Quick stats chips */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <Flame className="w-4 h-4 text-[#ffb020] fill-[#ffb020]" />
                <span className="font-bold text-white tabular-nums">{currentUser.streak} kun</span>
                <span className="text-white/40">uzluksiz o'qish</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <Zap className="w-4 h-4 text-[#34d0a0] fill-[#34d0a0]" />
                <span className="font-bold text-white tabular-nums">{currentUser.xp} XP</span>
                <span className="text-white/40">ballar</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <Award className="w-4 h-4 text-[#38bdf8]" />
                <span className="font-bold text-white tabular-nums">#{currentUser.rank}</span>
                <span className="text-white/40">umumiy o'rin</span>
              </div>
            </div>
          </div>

          {/* Level Progress Circle / Widget */}
          <div className="flex sm:flex-col items-center justify-between sm:justify-center p-4 rounded-2xl bg-white/5 border border-white/10 shrink-0 text-center gap-2">
            <div className="flex items-center gap-3 sm:flex-col">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ffb020]/20 border border-[#ffb020]/40 text-[#ffb020] font-display text-xl font-bold">
                {currentLevel}
                <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-[#ffb020]" />
              </div>
              <div className="text-left sm:text-center">
                <div className="text-xs font-semibold text-white">Daraja: Lvl {currentLevel}</div>
                <div className="text-[11px] text-white/50">{currentUser.xp} / {nextLevelXp} XP</div>
              </div>
            </div>
            <div className="w-24 sm:w-28 bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#ffb020] to-[#34d0a0] h-full rounded-full transition-all duration-500"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Continue Learning & Daily Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Continue Learning */}
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 flex flex-col justify-between hover:border-white/20 transition group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#34d0a0] uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-3 h-3 fill-[#34d0a0]" />
                Darsni davom ettirish
              </span>
              <span className="text-xs text-white/40">{currentLesson.subjectTitle}</span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-[#ffb020] transition-colors">
              {currentLesson.title}
            </h3>
            <p className="text-xs text-white/60 line-clamp-2">
              {currentLesson.description}
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentLesson.durationMinutes} daqiqa</span>
            </div>
            <button
              onClick={() => handleOpenLesson(currentLesson.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#34d0a0] hover:bg-[#2eb98e] text-[#0b0d19] text-xs font-bold transition shadow-md shadow-[#34d0a0]/20 cursor-pointer active:scale-95"
            >
              <span>Davom etish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Daily Challenge / Test */}
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 flex flex-col justify-between hover:border-white/20 transition group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#ffb020] uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 fill-[#ffb020]" />
                Bugungi Test Sinovi
              </span>
              <span className="text-xs font-semibold text-white/40 tabular-nums">+{activeTest.xpReward} XP</span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-[#ffb020] transition-colors">
              {activeTest.title}
            </h3>
            <p className="text-xs text-white/60">
              {activeTest.subjectTitle} bo'yicha {activeTest.questionsCount} ta tanqidiy savol va avtomatik reyting.
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock className="w-3.5 h-3.5" />
              <span>{activeTest.durationMinutes} daqiqa</span>
            </div>
            <button
              onClick={() => handleStartTest(activeTest.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ffb020] hover:bg-[#e69e1c] text-[#0b0d19] text-xs font-bold transition shadow-md shadow-[#ffb020]/20 cursor-pointer active:scale-95"
            >
              <span>Testni boshlash</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recharts Data Visualization: Monthly Progress & Completion Rates */}
      <StudentProgressChart subjects={subjects} />

      {/* Fanlar va Kurslar (Subjects Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Mening Fanlarim</h2>
            <p className="text-xs text-white/50">Faol o'rganilayotgan o'quv dasturlari va taraqqiyot</p>
          </div>
          <button
            onClick={() => setActiveTab('lessons')}
            className="text-xs font-semibold text-[#ffb020] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Barchasi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((sub) => {
            const progress = Math.round(
              (sub.completedLessonsCount / sub.lessonsCount) * 100
            );
            return (
              <div
                key={sub.id}
                onClick={() => {
                  setSelectedLessonId(null);
                  setActiveTab('lessons');
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#12162a] hover:border-white/20 transition cursor-pointer flex flex-col"
              >
                {/* Image header with fallback */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                  <img
                    src={sub.posterUrl}
                    alt={sub.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12162a] via-transparent to-transparent" />
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white/90">
                    {sub.teacherName}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#ffb020] transition-colors line-clamp-1">
                      {sub.title}
                    </h4>
                    <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                      {sub.subtitle}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-white/60">
                      <span>{sub.completedLessonsCount}/{sub.lessonsCount} dars</span>
                      <span className="font-bold text-white tabular-nums">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: sub.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column: Recent Tests & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Results */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#12162a] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#34d0a0]" />
              Oxirgi topshirilgan testlar
            </h3>
            <button
              onClick={() => setActiveTab('tests')}
              className="text-xs text-[#ffb020] hover:underline cursor-pointer"
            >
              Barcha testlar
            </button>
          </div>

          <div className="space-y-2.5">
            {tests.slice(0, 3).map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">{test.title}</div>
                  <div className="text-[11px] text-white/50">
                    {test.subjectTitle} · {test.questionsCount} savol
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {test.isCompleted ? (
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#34d0a0] tabular-nums">
                        {test.lastScore || 90}%
                      </div>
                      <div className="text-[10px] text-white/40">Muvaffaqiyatli</div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartTest(test.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#ffb020] hover:text-[#0b0d19] text-xs font-medium transition cursor-pointer"
                    >
                      Topshirish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges / Motivation */}
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-[#ffb020]" />
              Yutuqlar va Noma'lum Marralar
            </h3>
            <p className="text-xs text-white/50">Bilimlaringiz evaziga medallarga ega bo'ling</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-[#ffb020]/20 flex items-center justify-center text-lg">
                🔥
              </div>
              <div className="text-left flex-1">
                <div className="text-xs font-bold text-white">14 kunlik Streak</div>
                <div className="text-[10px] text-white/50">Har kuni uzluksiz o'qish</div>
              </div>
              <span className="text-[10px] font-bold text-[#34d0a0]">Ochilgan</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-[#34d0a0]/20 flex items-center justify-center text-lg">
                🎯
              </div>
              <div className="text-left flex-1">
                <div className="text-xs font-bold text-white">Test Ustasi</div>
                <div className="text-[10px] text-white/50">20+ test 80%+ ball bilan</div>
              </div>
              <span className="text-[10px] font-bold text-[#34d0a0]">Ochilgan</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 opacity-60">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                👑
              </div>
              <div className="text-left flex-1">
                <div className="text-xs font-bold text-white">Top 1 Chempion</div>
                <div className="text-[10px] text-white/50">Umumiy reytingda 1-o'rin</div>
              </div>
              <span className="text-[10px] font-medium text-white/40">Qulflangan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
