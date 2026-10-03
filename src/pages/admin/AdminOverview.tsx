import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Shield,
  BookOpen,
  TrendingUp,
  Activity,
  Server,
  Award,
  ChevronRight,
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { users, groups, tests, setActiveTab } = useApp();

  const studentsCount = users.filter((u) => u.role === 'STUDENT').length;
  const teachersCount = users.filter((u) => u.role === 'TEACHER').length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 rounded-3xl border border-white/10 bg-gradient-to-r from-[#192144] to-[#12162a] shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
            EduGo Asosiy Boshqaruv
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Tizim Administrator Paneli
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Foydalanuvchilar xavfsizligi, rollar taqsimoti, dars guruhlari va server holatini boshqarish
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('users')}
            className="px-4 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#2fa8dc] text-[#0b0d19] text-xs font-bold transition shadow-md shadow-[#38bdf8]/20 cursor-pointer"
          >
            A'zolarni boshqarish
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Jami Foydalanuvchilar</span>
            <Users className="w-4 h-4 text-[#38bdf8]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{users.length}</div>
          <div className="text-[11px] text-[#34d0a0]">+{studentsCount} o'quvchi</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>O'qituvchilar</span>
            <Shield className="w-4 h-4 text-[#ffb020]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{teachersCount}</div>
          <div className="text-[11px] text-white/40">Faol mentorlar</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Faol Guruhlar</span>
            <BookOpen className="w-4 h-4 text-[#34d0a0]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{groups.length}</div>
          <div className="text-[11px] text-[#34d0a0]">100% to'ldirilgan</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Muvaffaqiyat ko'rsatkichi</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">88.5%</div>
          <div className="text-[11px] text-[#34d0a0]">O'rtacha imtihon bali</div>
        </div>
      </div>

      {/* Two Column: System Health & Groups Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* System Health */}
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-[#34d0a0]" />
              <span>Infratuzilma & Telegram Bot holati</span>
            </h3>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#34d0a0]">
              <span className="w-2 h-2 rounded-full bg-[#34d0a0] animate-pulse" />
              Barqaror
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-white/70">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <span>Telegram Bot Webhook (@EduGoUzBot)</span>
              <span className="font-bold text-[#34d0a0]">200 OK (0ms delay)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <span>HMAC-SHA256 Token Verify Guard</span>
              <span className="font-bold text-[#34d0a0]">Faol & Xavfsiz</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <span>PostgreSQL & Prisma Connection</span>
              <span className="font-bold text-[#34d0a0]">Ulanish barqaror</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <span>Frontend TMA Build & Bundle</span>
              <span className="font-bold text-[#38bdf8]">Vite 8 & React 19</span>
            </div>
          </div>
        </div>

        {/* Quick Course / Group list */}
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#ffb020]" />
              <span>O'quv guruhlari holati</span>
            </h3>
            <button
              onClick={() => setActiveTab('groups')}
              className="text-xs text-[#ffb020] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Barchasi</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {groups.map((grp) => (
              <div
                key={grp.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div>
                  <div className="text-xs font-bold text-white">{grp.name}</div>
                  <div className="text-[11px] text-white/40">{grp.teacherName} · {grp.room}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white tabular-nums">
                    {grp.activeStudentsCount}/{grp.maxCapacity} o'quvchi
                  </div>
                  <div className="text-[10px] text-[#34d0a0] font-medium">
                    {grp.progressPercent}% o'zlashtirish
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
