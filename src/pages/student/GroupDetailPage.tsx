import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  Send,
  MessageSquare,
  Award,
  BookOpen,
} from 'lucide-react';

interface GroupDetailPageProps {
  groupId: string;
}

export const GroupDetailPage: React.FC<GroupDetailPageProps> = ({ groupId }) => {
  const { groups, assignments, setSelectedGroupId, showToast } = useApp();
  const group = groups.find((g) => g.id === groupId) || groups[0];

  const groupAssignments = assignments.filter((a) => a.groupId === group.id);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => setSelectedGroupId(null)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Guruhlar ro'yxatiga qaytish</span>
      </button>

      {/* Main Group Header Card */}
      <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-7 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
              {group.subjectTitle}
            </span>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
              {group.name}
            </h1>
            <p className="text-xs text-white/60">
              Xona: {group.room} · {group.activeStudentsCount} nafar tinglovchi
            </p>
          </div>

          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold transition shadow-md shadow-[#0088cc]/20 self-start sm:self-center"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Guruh Chat</span>
          </a>
        </div>

        {/* Schedule & Teacher Roster */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <img
              src={group.teacherAvatar}
              alt={group.teacherName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <div className="text-xs font-bold text-white">{group.teacherName}</div>
              <div className="text-[11px] text-white/50">Ustoz / Kurs rahbari</div>
              <div className="text-[10px] text-[#34d0a0] font-medium mt-0.5">● Onlayn konsultatsiya mavjud</div>
            </div>
          </div>

          <div className="flex flex-col justify-center p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Calendar className="w-3.5 h-3.5 text-[#ffb020]" />
              <span>{group.schedule}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/50">
              <Clock className="w-3.5 h-3.5 text-[#34d0a0]" />
              <span>Keyingi dars: {group.nextLessonTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Classmates & Homework Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Classmates List */}
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#ffb020]" />
              <span>Guruhdoshlar ({group.members.length})</span>
            </h3>
            <span className="text-[11px] text-white/40">Davomat & Ball</span>
          </div>

          <div className="space-y-2.5">
            {group.members.length === 0 ? (
              <p className="text-xs text-white/40 py-4 text-center">Guruh a'zolari ro'yxati yangilanmoqda.</p>
            ) : (
              group.members.map((member, idx) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/40 tabular-nums w-4">
                      {idx + 1}
                    </span>
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">{member.name}</div>
                      <div className="text-[10px] text-white/40">{member.username}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-[#ffb020] tabular-nums">
                      {member.xp} XP
                    </div>
                    <div className="text-[10px] text-[#34d0a0]">
                      Davomat: {member.attendanceRate}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Group Homework & Tasks */}
        <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#38bdf8]" />
              <span>Guruh vazifalari</span>
            </h3>
            <span className="text-[11px] text-white/40">Muddati</span>
          </div>

          <div className="space-y-3">
            {groupAssignments.length === 0 ? (
              <p className="text-xs text-white/40 py-4 text-center">Ushbu guruhda yangi vazifa yo'q.</p>
            ) : (
              groupAssignments.map((ass) => (
                <div
                  key={ass.id}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-white">{ass.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffb020]/20 text-[#ffb020] font-semibold shrink-0">
                      {ass.maxScore} ball
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 line-clamp-2">
                    {ass.description}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-white/40">
                    <span>Muddati: {ass.deadline}</span>
                    <button
                      onClick={() => showToast(`"${ass.title}" topshirish formasi ochildi.`)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#ffb020] hover:text-[#0b0d19] text-white font-semibold transition cursor-pointer"
                    >
                      Topshirish
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
