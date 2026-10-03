import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  FileText,
  Download,
  Check,
  HelpCircle,
  Clock,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface LessonDetailPageProps {
  lessonId: string;
}

export const LessonDetailPage: React.FC<LessonDetailPageProps> = ({ lessonId }) => {
  const { lessons, setSelectedLessonId, completeLesson, showToast } = useApp();
  const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];

  // Video Simulator State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [videoProgress, setVideoProgress] = useState<number>(35);

  // Quick Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setShowExplanation((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const speeds = [1, 1.25, 1.5, 2];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedLessonId(null)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Darslar ro'yxatiga qaytish</span>
        </button>

        {lesson.isCompleted ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34d0a0]/15 text-[#34d0a0] text-xs font-bold border border-[#34d0a0]/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tugallangan</span>
          </div>
        ) : (
          <button
            onClick={() => completeLesson(lesson.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#34d0a0] hover:bg-[#2eb98e] text-[#0b0d19] text-xs font-bold transition shadow-md shadow-[#34d0a0]/20 cursor-pointer active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Darsni tugatish (+50 XP)</span>
          </button>
        )}
      </div>

      {/* Video Player Simulator */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1021] aspect-video flex flex-col justify-between shadow-2xl group">
        {/* Ambient video poster backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#12152f] via-[#1b2046] to-[#0c0e1e] flex items-center justify-center">
          <div className="text-center space-y-3 px-4">
            <div
              onClick={handleTogglePlay}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ffb020] text-[#0b0d19] flex items-center justify-center mx-auto shadow-xl shadow-[#ffb020]/30 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-[#0b0d19]" />
              ) : (
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-[#0b0d19] ml-1" />
              )}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-white/90">
              {isPlaying ? "Video ijro etilmoqda..." : "Videoma'ruzani boshlash uchun bosing"}
            </div>
          </div>
        </div>

        {/* Top Video Overlay: Title */}
        <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
          <div className="space-y-0.5">
            <span className="text-[10px] sm:text-xs font-medium text-[#38bdf8]">
              {lesson.subjectTitle}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
              {lesson.title}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <Clock className="w-3.5 h-3.5" />
            <span>{lesson.durationMinutes}:00</span>
          </div>
        </div>

        {/* Bottom Video Controls Overlay */}
        <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-2">
          {/* Progress scrubber */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              setVideoProgress(Math.round(pos * 100));
            }}
            className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden relative group/bar"
          >
            <div
              className="h-full bg-[#ffb020] rounded-full transition-all"
              style={{ width: `${videoProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className="hover:text-[#ffb020] transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <Volume2 className="w-4 h-4 text-white/70" />
              <span className="text-[11px] text-white/70 tabular-nums">
                {Math.floor((lesson.durationMinutes * videoProgress) / 100)}:24 / {lesson.durationMinutes}:00
              </span>
            </div>

            {/* Playback speed buttons */}
            <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    playbackSpeed === s ? 'bg-[#ffb020] text-[#0b0d19]' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Details & Overview */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
                {lesson.title}
              </h1>
              <p className="text-xs text-white/60 mt-1">{lesson.description}</p>
            </div>
            {!lesson.isCompleted && (
              <button
                onClick={() => completeLesson(lesson.id)}
                className="self-start sm:self-center px-4 py-2 rounded-xl bg-[#34d0a0] hover:bg-[#2eb98e] text-[#0b0d19] text-xs font-bold transition cursor-pointer active:scale-95"
              >
                Darsni tugatish
              </button>
            )}
          </div>

          {/* Key Takeaways */}
          {lesson.keyPoints && lesson.keyPoints.length > 0 && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffb020] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Asosiy xulosalar va qoidalar:
              </h3>
              <ul className="space-y-1.5 text-xs text-white/80">
                {lesson.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffb020] mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lecture Content Markdown */}
          <div className="space-y-3 pt-2 text-xs sm:text-sm text-white/80 leading-relaxed border-t border-white/5">
            <h4 className="text-sm font-bold text-white">Ma'ruza matni</h4>
            <div className="bg-[#0b0d19] p-4 rounded-2xl border border-white/5 whitespace-pre-wrap font-sans text-xs leading-relaxed text-white/70">
              {lesson.contentMarkdown}
            </div>
          </div>

          {/* Downloadable Attachments */}
          {lesson.attachments && lesson.attachments.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">
                Biriktirilgan materiallar
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lesson.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#38bdf8]" />
                      <div>
                        <div className="text-xs font-medium text-white">{att.name}</div>
                        <div className="text-[10px] text-white/40">{att.size}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast(`"${att.name}" muvaffaqiyatli yuklab olindi.`)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition cursor-pointer"
                      title="Yuklab olish"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* End-of-lesson Mini Quiz */}
        {lesson.quizQuestions && lesson.quizQuestions.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#ffb020]" />
              <div>
                <h3 className="text-sm font-bold text-white">Darsni mustahkamlash savollari</h3>
                <p className="text-[11px] text-white/50">O'zlashtirishingizni tekshirib ko'ring</p>
              </div>
            </div>

            <div className="space-y-5">
              {lesson.quizQuestions.map((q, qIndex) => {
                const selectedOpt = selectedAnswers[q.id];
                const isCorrect = selectedOpt === q.correctOptionId;
                const answered = !!selectedOpt;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3"
                  >
                    <div className="text-xs sm:text-sm font-bold text-white">
                      {qIndex + 1}. {q.question}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const isChosen = selectedOpt === opt.id;
                        let optionStyle =
                          'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20';

                        if (answered) {
                          if (opt.id === q.correctOptionId) {
                            optionStyle = 'border-[#34d0a0] bg-[#34d0a0]/15 text-[#34d0a0] font-bold';
                          } else if (isChosen && !isCorrect) {
                            optionStyle = 'border-[#f0654b] bg-[#f0654b]/15 text-[#f0654b]';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition cursor-pointer ${optionStyle}`}
                          >
                            <span>{opt.text}</span>
                            {answered && opt.id === q.correctOptionId && (
                              <CheckCircle2 className="w-4 h-4 text-[#34d0a0] shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation[q.id] && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 space-y-1">
                        <span className="font-bold text-[#ffb020]">Tushuntirish: </span>
                        <span>{q.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
