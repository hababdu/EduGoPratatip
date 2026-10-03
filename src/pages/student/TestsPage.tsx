import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestTakingPage } from './TestTakingPage';
import {
  FileQuestion,
  Clock,
  Zap,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const TestsPage: React.FC = () => {
  const { tests, activeTestTakingId, setActiveTestTakingId } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // If a student is taking a test, show the TestTaking view
  if (activeTestTakingId) {
    return <TestTakingPage testId={activeTestTakingId} />;
  }

  const categories = ['all', 'Haftalik', 'DTM', 'Sertifikat', 'Olimpiada'];

  const filteredTests = tests.filter((t) => {
    if (categoryFilter === 'all') return true;
    return t.category === categoryFilter;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white">Testlar & Imtihonlar</h1>
          <p className="text-xs text-white/50">
            Bilimingizni sinovdan o'tkazing, reyting ochkolarini (XP) jamg'aring va sertifikatlarga ega bo'ling
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#ffb020] text-[#0b0d19]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Barcha Testlar' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Test List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 flex flex-col justify-between hover:border-white/20 transition space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#38bdf8] uppercase tracking-wider">
                  {test.category} · {test.subjectTitle}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-[#ffb020] tabular-nums">
                  <Zap className="w-3.5 h-3.5 fill-[#ffb020]" />
                  +{test.xpReward} XP
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white">
                {test.title}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-white/40" />
                  {test.durationMinutes} daqiqa
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <FileQuestion className="w-3.5 h-3.5 text-white/40" />
                  {test.questionsCount} ta savol
                </span>
                <span>·</span>
                <span>O'tish bali: {test.passingScorePercent}%</span>
              </div>
            </div>

            {/* Bottom Status & CTA */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              {test.isCompleted ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#34d0a0]" />
                  <div className="text-xs">
                    <span className="text-white/60">Natija: </span>
                    <span className="font-bold text-[#34d0a0]">{test.lastScore}%</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-white/40">Topshirishga tayyor</div>
              )}

              <button
                onClick={() => setActiveTestTakingId(test.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer active:scale-95 ${
                  test.isCompleted
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-[#ffb020] hover:bg-[#e69e1c] text-[#0b0d19] shadow-[#ffb020]/20'
                }`}
              >
                {test.isCompleted ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Qayta topshirish</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-[#0b0d19]" />
                    <span>Testni boshlash</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DTM & IELTS Testing Advice banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#181d3d] to-[#12162a] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#34d0a0]">
            <Sparkles className="w-4 h-4" />
            <span>EduGo Test Tizimi Haqida</span>
          </div>
          <p className="text-xs text-white/70 max-w-xl leading-relaxed">
            Har bir test real imtihon andozalari asosida tuzilgan. Natijalar avtomatik tarzda umumiy reytingingizga va haftalik g'oliblar ro'yxatiga ta'sir qiladi.
          </p>
        </div>
      </div>
    </div>
  );
};
