import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  PlusCircle,
  Clock,
  CheckCircle2,
  X,
  Check,
} from 'lucide-react';

export const TeacherAssignments: React.FC = () => {
  const { assignments, groups, createAssignment, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  // New assignment form state
  const [title, setTitle] = useState('');
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-10-18 22:00');
  const [maxScore, setMaxScore] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const grp = groups.find((g) => g.id === groupId);
    createAssignment({
      title,
      groupId,
      groupName: grp?.name || 'Umumiy Guruh',
      description,
      deadline,
      maxScore,
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setModalOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#ffb020]" />
            <span>Uy Vazifalari & Baholash</span>
          </h1>
          <p className="text-xs text-white/50">
            O'quvchilarga amaliy topshiriqlar bering, muddatlarni belgilang va tekshiring
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ffb020] hover:bg-[#e69e1c] text-[#0b0d19] text-xs font-bold transition shadow-lg shadow-[#ffb020]/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi vazifa berish</span>
        </button>
      </div>

      {/* Assignment Cards */}
      <div className="space-y-3">
        {assignments.map((ass) => (
          <div
            key={ass.id}
            className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 space-y-3 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider">
                  {ass.groupName}
                </span>
                <h3 className="text-base font-bold text-white">{ass.title}</h3>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold text-[#ffb020] bg-[#ffb020]/15 px-3 py-1 rounded-full border border-[#ffb020]/30">
                  Maksimal: {ass.maxScore} ball
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">{ass.description}</p>

            <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-white/50">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Muddati: {ass.deadline}
                </span>
                <span>·</span>
                <span className="font-semibold text-white">
                  {ass.submittedCount} / {ass.totalCount} topshirdi
                </span>
              </div>

              <button
                onClick={() => showToast(`"${ass.title}" bo'yicha talabalar yuborgan ishlar ko'rib chiqishga tayyor.`)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition cursor-pointer self-start sm:self-auto"
              >
                Topshiriqlarni tekshirish
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Assignment */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#161a33] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Yangi Uy Vazifasi Berish</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-white/60 block mb-1 font-semibold">Vazifa sarlavhasi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Mini App autentifikatsiyasini sinash"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ffb020]"
                />
              </div>

              <div>
                <label className="text-white/60 block mb-1 font-semibold">Guruhni tanlang</label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12162a] border border-white/10 text-white focus:outline-none focus:border-[#ffb020]"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.subjectTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 block mb-1 font-semibold">Topshirish muddati</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#ffb020]"
                  />
                </div>
                <div>
                  <label className="text-white/60 block mb-1 font-semibold">Maksimal ball</label>
                  <input
                    type="number"
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#ffb020]"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/60 block mb-1 font-semibold">Batafsil talablar va yo'riqnoma</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Vazifa shartlari, foydalaniladigan texnologiyalar..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ffb020]"
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
                  className="px-5 py-2 rounded-xl bg-[#ffb020] hover:bg-[#e69e1c] text-[#0b0d19] font-bold transition cursor-pointer shadow-md shadow-[#ffb020]/20"
                >
                  Vazifani e'lon qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
