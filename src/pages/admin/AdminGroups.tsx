import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Users,
  Calendar,
  PlusCircle,
  Building,
} from 'lucide-react';

export const AdminGroups: React.FC = () => {
  const { groups, showToast } = useApp();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#34d0a0]" />
            <span>O'quv Kurslari & Guruhlarni Boshqarish</span>
          </h1>
          <p className="text-xs text-white/50">
            Mavjud o'quv guruhlari quvvati, dars xonalari va o'qituvchilar taqsimoti
          </p>
        </div>

        <button
          onClick={() => showToast("Yangi guruh ochish shakli tez kunda ishga tushadi.")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#34d0a0] hover:bg-[#2eb98e] text-[#0b0d19] text-xs font-bold transition shadow-lg shadow-[#34d0a0]/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi guruh ochish</span>
        </button>
      </div>

      {/* Group List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((grp) => (
          <div
            key={grp.id}
            className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 space-y-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider">
                {grp.subjectTitle}
              </span>
              <span className="text-xs font-bold text-[#34d0a0] bg-[#34d0a0]/10 px-2.5 py-0.5 rounded-full">
                Faol Guruh
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">{grp.name}</h3>

            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-white/40" />
                <span>
                  O'qituvchi: <strong className="text-white">{grp.teacherName}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-white/40" />
                <span>{grp.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-white/40" />
                <span>Xona: {grp.room}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Sig'im bandligi</span>
                <span className="font-bold text-white tabular-nums">
                  {grp.activeStudentsCount} / {grp.maxCapacity} ({Math.round((grp.activeStudentsCount / grp.maxCapacity) * 100)}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ffb020] to-[#34d0a0] rounded-full"
                  style={{
                    width: `${Math.round((grp.activeStudentsCount / grp.maxCapacity) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
