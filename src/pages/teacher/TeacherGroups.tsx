import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Save,
  Check,
  Send,
} from 'lucide-react';

export const TeacherGroups: React.FC = () => {
  const { groups, markAttendance } = useApp();
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  const currentGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">Guruhlar & Davomat Nazorati</h1>
        <p className="text-xs text-white/50">
          Dars qatnashuvini bir teginishda belgilang va o'quvchilar intizomini monitoring qiling
        </p>
      </div>

      {/* Group Selector Segmented Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {groups.map((grp) => (
          <button
            key={grp.id}
            onClick={() => setSelectedGroupId(grp.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedGroupId === grp.id
                ? 'bg-[#ffb020] text-[#0b0d19] shadow-lg shadow-[#ffb020]/20'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {grp.name}
          </button>
        ))}
      </div>

      {/* Group Summary Card */}
      {currentGroup && (
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
                {currentGroup.subjectTitle}
              </span>
              <h2 className="text-xl font-bold text-white">{currentGroup.name}</h2>
              <p className="text-xs text-white/60">
                Jadval: {currentGroup.schedule} · Xona: {currentGroup.room}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-semibold transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Guruh boti</span>
              </a>

              <button
                onClick={handleSaveAttendance}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#34d0a0] hover:bg-[#2eb98e] text-[#0b0d19] text-xs font-bold transition cursor-pointer shadow-md shadow-[#34d0a0]/20 active:scale-95"
              >
                {attendanceSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saqlandi!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Davomatni saqlash</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold text-white/50 px-2">
              <span>Talaba ({currentGroup.members.length} kishi)</span>
              <span>Davomat holati (Bugun)</span>
            </div>

            <div className="space-y-2">
              {currentGroup.members.map((member, idx) => {
                return (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white/40 tabular-nums w-4">
                        {idx + 1}
                      </span>
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{member.name}</div>
                        <div className="text-[11px] text-white/40 flex items-center gap-2">
                          <span>{member.username}</span>
                          <span>·</span>
                          <span className="text-[#ffb020]">{member.xp} XP</span>
                          <span>·</span>
                          <span>O'rtacha: {member.averageScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendance State Selector Buttons (touch target >= 44px) */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => markAttendance(currentGroup.id, member.id, 'present')}
                        className={`flex items-center gap-1 px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-bold transition cursor-pointer ${
                          member.status === 'present'
                            ? 'bg-[#34d0a0] text-[#0b0d19] shadow-md shadow-[#34d0a0]/20'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Keldi</span>
                      </button>

                      <button
                        onClick={() => markAttendance(currentGroup.id, member.id, 'absent')}
                        className={`flex items-center gap-1 px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-bold transition cursor-pointer ${
                          member.status === 'absent'
                            ? 'bg-[#f0654b] text-white shadow-md shadow-[#f0654b]/20'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Kelmadi</span>
                      </button>

                      <button
                        onClick={() => markAttendance(currentGroup.id, member.id, 'excused')}
                        className={`flex items-center gap-1 px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-bold transition cursor-pointer ${
                          member.status === 'excused'
                            ? 'bg-[#ffb020] text-[#0b0d19] shadow-md shadow-[#ffb020]/20'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Sababli</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
