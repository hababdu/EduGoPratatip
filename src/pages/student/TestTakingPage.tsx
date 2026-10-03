import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface TestTakingPageProps {
  testId: string;
}

export const TestTakingPage: React.FC<TestTakingPageProps> = ({ testId }) => {
  const { tests, setActiveTestTakingId, submitTestResults } = useApp();
  const test = tests.find((t) => t.id === testId) || tests[0];

  const questions = test.questions && test.questions.length > 0 ? test.questions : [];

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(test.durationMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [scoreReport, setScoreReport] = useState<{
    correctCount: number;
    totalCount: number;
    percentage: number;
    isPassed: boolean;
    xpEarned: number;
  } | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (optionId: string) => {
    if (isFinished) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handleFinishTest = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) {
        correct++;
      }
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const isPassed = percentage >= test.passingScorePercent;
    const xpEarned = isPassed ? test.xpReward : Math.round(test.xpReward * 0.3);

    setScoreReport({
      correctCount: correct,
      totalCount: total,
      percentage,
      isPassed,
      xpEarned,
    });
    setIsFinished(true);
    submitTestResults(test.id, percentage, xpEarned);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If test has been finished, show Results View
  if (isFinished && scoreReport) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Results Banner */}
        <div className="text-center rounded-3xl border border-white/10 bg-[#12162a] p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#ffb020]/20 flex items-center justify-center text-3xl shadow-lg shadow-[#ffb020]/20">
            {scoreReport.isPassed ? '🏆' : '📚'}
          </div>

          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {scoreReport.isPassed ? 'Ajoyib natija! Tabriklaymiz!' : 'Yaxshi harakat, biroz mashq qiling!'}
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              "{test.title}" testi muvaffaqiyatli yakunlandi.
            </p>
          </div>

          {/* Score breakdown metrics */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                {scoreReport.percentage}%
              </div>
              <div className="text-[10px] text-white/40">Umumiy ball</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-xl sm:text-2xl font-bold text-[#34d0a0] tabular-nums">
                {scoreReport.correctCount}/{scoreReport.totalCount}
              </div>
              <div className="text-[10px] text-white/40">To'g'ri javob</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-xl sm:text-2xl font-bold text-[#ffb020] tabular-nums">
                +{scoreReport.xpEarned}
              </div>
              <div className="text-[10px] text-white/40">XP qo'shildi</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsFinished(false);
                setAnswers({});
                setFlagged({});
                setSecondsRemaining(test.durationMinutes * 60);
                setCurrentIndex(0);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Qayta urinish</span>
            </button>
            <button
              onClick={() => setActiveTestTakingId(null)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ffb020] hover:bg-[#e69e1c] text-[#0b0d19] text-xs font-bold transition shadow-lg shadow-[#ffb020]/25 cursor-pointer"
            >
              <span>Testlar ro'yxatiga qaytish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Question by Question Review */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ffb020]" />
            <span>Savollar tahlili va to'g'ri javoblar:</span>
          </h3>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const studentAnswer = answers[q.id];
              const isCorrect = studentAnswer === q.correctOptionId;
              const correctOption = q.options.find((o) => o.id === q.correctOptionId);
              const studentOption = q.options.find((o) => o.id === studentAnswer);

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition ${
                    isCorrect
                      ? 'bg-[#12162a] border-[#34d0a0]/30'
                      : 'bg-[#12162a] border-[#f0654b]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      {idx + 1}. {q.question}
                    </div>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#34d0a0] shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        To'g'ri
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#f0654b] shrink-0">
                        <XCircle className="w-4 h-4" />
                        Xato
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {!isCorrect && (
                      <div className="text-white/60">
                        Sizning javobingiz:{' '}
                        <span className="text-[#f0654b] font-medium">
                          {studentOption ? studentOption.text : "Belgilanmagan"}
                        </span>
                      </div>
                    )}
                    <div className="text-white/80">
                      To'g'ri javob:{' '}
                      <span className="text-[#34d0a0] font-semibold">
                        {correctOption?.text}
                      </span>
                    </div>
                    {q.explanation && (
                      <div className="p-2.5 rounded-xl bg-white/5 text-[11px] text-white/70 mt-2">
                        <span className="font-bold text-[#ffb020]">Izoh: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Test-Taking Mode View
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Top Bar during exam */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#12162a] border border-white/10 shadow-lg">
        <div className="space-y-0.5">
          <div className="text-[10px] sm:text-xs text-[#38bdf8] font-bold uppercase tracking-wider">
            {test.subjectTitle}
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
            {test.title}
          </h2>
        </div>

        {/* Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs sm:text-sm font-bold tabular-nums ${
            secondsRemaining < 120
              ? 'bg-[#f0654b]/20 border-[#f0654b] text-[#f0654b] animate-pulse'
              : 'bg-white/5 border-white/10 text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{formatTime(secondsRemaining)}</span>
        </div>

        {/* Finish Early button */}
        <button
          onClick={handleFinishTest}
          className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#34d0a0] hover:bg-[#2eb98e] text-[#0b0d19] text-xs font-bold transition cursor-pointer"
        >
          Yakunlash
        </button>
      </div>

      {/* Question Number Pills Navigation */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-[#12162a] border border-white/10">
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = idx === currentIndex;
          const isFlagged = !!flagged[q.id];

          let btnColor = 'bg-white/5 text-white/50 border-transparent';
          if (isCurrent) {
            btnColor = 'bg-[#ffb020] text-[#0b0d19] font-bold shadow-md shadow-[#ffb020]/20';
          } else if (isAnswered) {
            btnColor = 'bg-[#34d0a0]/20 text-[#34d0a0] border-[#34d0a0]/30 font-semibold';
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex items-center justify-center min-w-[40px] h-10 rounded-xl text-xs border transition cursor-pointer ${btnColor}`}
            >
              <span>{idx + 1}</span>
              {isFlagged && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f0654b]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      {currentQ ? (
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-7 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs font-bold text-white/50">
              Savol {currentIndex + 1} / {questions.length}
            </span>

            <button
              onClick={handleToggleFlag}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                flagged[currentQ.id]
                  ? 'bg-[#f0654b]/20 text-[#f0654b] border border-[#f0654b]/40'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{flagged[currentQ.id] ? 'Belgilangan' : 'Belgilab qo\'yish'}</span>
            </button>
          </div>

          <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
            {currentQ.question}
          </div>

          {/* Options (Radio style with min-h-44px touch targets) */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, optIndex) => {
              const isSelected = answers[currentQ.id] === opt.id;
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer(opt.id)}
                  className={`w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border text-left text-xs sm:text-sm transition cursor-pointer min-h-[48px] ${
                    isSelected
                      ? 'bg-[#ffb020]/15 border-[#ffb020] text-white font-medium shadow-md shadow-[#ffb020]/10'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-xl text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-[#ffb020] text-[#0b0d19]'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {optionLetters[optIndex] || '•'}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Prev / Next Nav */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                currentIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-white/40'
                  : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Oldingisi</span>
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleFinishTest}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#34d0a0] hover:bg-[#2eb98e] text-[#0b0d19] text-xs font-bold transition shadow-lg shadow-[#34d0a0]/20 cursor-pointer active:scale-95"
              >
                <span>Testni yakunlash</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#ffb020] hover:bg-[#e69e1c] text-[#0b0d19] text-xs font-bold transition cursor-pointer active:scale-95"
              >
                <span>Keyingisi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
