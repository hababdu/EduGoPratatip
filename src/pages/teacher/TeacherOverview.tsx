import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  PlusCircle,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const TeacherOverview: React.FC = () => {
  const { groups, assignments, setActiveTab, currentUser } = useApp();

  const totalStudents = groups.reduce((acc, g) => acc + g.activeStudentsCount, 0);
  const pendingAssignments = assignments.filter((a) => a.status === 'active').length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Teacher Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 rounded-3xl border border-white/10 bg-gradient-to-r from-[#171d3d] to-[#12152d] shadow-xl">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-[#ffb020] uppercase tracking-wider">
            O'qituvchi Boshqaruv Markazi
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Assalomu alaykum, {currentUser.name}! 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Guruhlaringiz davomati, topshiriqlar tekshiruvi va yangi dars materiallarini nazorat qiling.
          </p>
        </div>

        {/* Quick Action buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('assignments')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ffb020] hover:bg-[#e69e1c] text-[#0b0d19] text-xs font-bold transition cursor-pointer shadow-md shadow-[#ffb020]/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yangi vazifa</span>
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
          >
            <span>Savollar banki</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Mening Guruhlarim</span>
            <Users className="w-4 h-4 text-[#38bdf8]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{groups.length}</div>
          <div className="text-[11px] text-[#34d0a0]">Barchasi faol</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Jami O'quvchilar</span>
            <Users className="w-4 h-4 text-[#ffb020]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{totalStudents}</div>
          <div className="text-[11px] text-white/40">Faol tinglovchilar</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Kutilayotgan vazifalar</span>
            <ClipboardCheck className="w-4 h-4 text-[#34d0a0]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{pendingAssignments}</div>
          <div className="text-[11px] text-[#ffb020]">Tekshirish talab qilinadi</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>O'rtacha Davomat</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">91.4%</div>
          <div className="text-[11px] text-[#34d0a0]">Yuqori intizom</div>
        </div>
      </div>

      {/* Two Column Section: Upcoming Schedule & Pending Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Next Classes */}
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#38bdf8]" />
              <span>Yaqinlashib kelayotgan darslar</span>
            </h3>
            <button
              onClick={() => setActiveTab('groups')}
              className="text-xs text-[#ffb020] hover:underline cursor-pointer"
            >
              Guruhlar ro'yxati
            </button>
          </div>

          <div className="space-y-3">
            {groups.map((grp) => (
              <div
                key={grp.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">{grp.name}</div>
                  <div className="text-[11px] text-white/50 flex items-center gap-2">
                    <span>{grp.schedule}</span>
                    <span>·</span>
                    <span>{grp.room}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#ffb020] bg-[#ffb020]/10 px-2.5 py-1 rounded-full">
                    {grp.nextLessonTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#ffb020]" />
              <span>Tekshirish kutayotgan vazifalar</span>
            </h3>
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-xs text-[#ffb020] hover:underline cursor-pointer"
            >
              Barcha vazifalar
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map((ass) => (
              <div
                key={ass.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{ass.title}</h4>
                  <div className="text-[11px] text-white/50">{ass.groupName}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#34d0a0] tabular-nums">
                    {ass.submittedCount} / {ass.totalCount} topshirildi
                  </div>
                  <div className="text-[10px] text-white/40">{ass.deadline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
