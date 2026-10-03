import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  PlusCircle,
  Search,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

export const TeacherQuestions: React.FC = () => {
  const { questions, createQuestion, subjects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // New question form state
  const [questionText, setQuestionText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctOptIndex, setCorrectOptIndex] = useState('0');
  const [explanation, setExplanation] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'sub_frontend');
  const [difficulty, setDifficulty] = useState<'Oson' | "O'rta" | 'Qiyin'>("O'rta");

  const filteredQuestions = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const options = [
      { id: 'opt_1', text: opt1 || 'Variant A' },
      { id: 'opt_2', text: opt2 || 'Variant B' },
      { id: 'opt_3', text: opt3 || 'Variant C' },
      { id: 'opt_4', text: opt4 || 'Variant D' },
    ];

    const correctId = options[Number(correctOptIndex)]?.id || 'opt_1';

    createQuestion({
      question: questionText,
      options,
      correctOptionId: correctId,
      explanation,
      subjectId,
      difficulty,
      points: difficulty === 'Oson' ? 10 : difficulty === "O'rta" ? 15 : 20,
    });

    // Reset
    setQuestionText('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setExplanation('');
    setModalOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#34d0a0]" />
            <span>Savollar Banki & Testlar</span>
          </h1>
          <p className="text-xs text-white/50">
            Imtihonlar va darslar uchun test savollarini yarating va boshqaring
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#34d0a0] hover:bg-[#2eb98e] text-[#0b0d19] text-xs font-bold transition shadow-lg shadow-[#34d0a0]/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi savol qo'shish</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Savollar matni yoki izoh bo'yicha qidiruv..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#34d0a0]"
        />
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white/40">Savol #{idx + 1}</span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold text-white/70">
                  {q.difficulty || "O'rta"}
                </span>
                <span className="text-xs font-bold text-[#ffb020] tabular-nums">
                  {q.points} ball
                </span>
              </div>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
              {q.question}
            </h3>

            {/* Options grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {q.options.map((opt) => {
                const isCorrect = opt.id === q.correctOptionId;
                return (
                  <div
                    key={opt.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                      isCorrect
                        ? 'bg-[#34d0a0]/15 border-[#34d0a0]/40 text-[#34d0a0] font-semibold'
                        : 'bg-white/5 border-white/5 text-white/70'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 text-[#34d0a0]" />}
                  </div>
                );
              })}
            </div>

            {q.explanation && (
              <div className="pt-2 text-[11px] text-white/50 border-t border-white/5">
                <span className="text-[#ffb020] font-semibold">Tushuntirish: </span>
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Create Question */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#161a33] p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Yangi Test Savoli Yaratish</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="text-white/60 block mb-1 font-semibold">Savol matni</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Savolni kiriting..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#34d0a0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 block mb-1 font-semibold">Fanni tanlang</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12162a] border border-white/10 text-white focus:outline-none focus:border-[#34d0a0]"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/60 block mb-1 font-semibold">Murakkablik</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12162a] border border-white/10 text-white focus:outline-none focus:border-[#34d0a0]"
                  >
                    <option value="Oson">Oson (10 ball)</option>
                    <option value="O'rta">O'rta (15 ball)</option>
                    <option value="Qiyin">Qiyin (20 ball)</option>
                  </select>
                </div>
              </div>

              {/* 4 Choices */}
              <div className="space-y-2">
                <label className="text-white/60 block font-semibold">Javob variantlari</label>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Variant A matni"
                    value={opt1}
                    onChange={(e) => setOpt1(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white mb-2"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Variant B matni"
                    value={opt2}
                    onChange={(e) => setOpt2(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Variant C matni"
                    value={opt3}
                    onChange={(e) => setOpt3(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Variant D matni"
                    value={opt4}
                    onChange={(e) => setOpt4(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/60 block mb-1 font-semibold">To'g'ri javobni tanlang</label>
                <div className="flex items-center gap-3">
                  {['A', 'B', 'C', 'D'].map((letter, i) => (
                    <label key={letter} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctOptIndex === String(i)}
                        onChange={() => setCorrectOptIndex(String(i))}
                        className="accent-[#34d0a0]"
                      />
                      <span className="text-white font-bold">{letter}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/60 block mb-1 font-semibold">Izoh va tushuntirish</label>
                <textarea
                  rows={2}
                  placeholder="Nega aynan shu javob to'g'riligini tushuntiring..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#34d0a0]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#34d0a0] hover:bg-[#2eb98e] text-[#0b0d19] font-bold transition cursor-pointer shadow-md shadow-[#34d0a0]/20"
                >
                  Savolni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
