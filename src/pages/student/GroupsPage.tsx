import React from 'react';
import { useApp } from '../../context/AppContext';
import { GroupDetailPage } from './GroupDetailPage';
import {
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const GroupsPage: React.FC = () => {
  const { groups, selectedGroupId, setSelectedGroupId } = useApp();

  if (selectedGroupId) {
    return <GroupDetailPage groupId={selectedGroupId} />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white">Mening O'quv Guruhlarim</h1>
        <p className="text-xs text-white/50">
          Siz qatnashayotgan guruhlar jadvali, mentorlar va guruhdoshlar o'rtasidagi hamkorlik
        </p>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((grp) => (
          <div
            key={grp.id}
            onClick={() => setSelectedGroupId(grp.id)}
            className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 flex flex-col justify-between hover:border-white/20 transition cursor-pointer group space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#38bdf8] uppercase tracking-wider">
                  {grp.subjectTitle}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#ffb020] bg-[#ffb020]/10 px-2.5 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  {grp.nextLessonTime}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-[#ffb020] transition-colors">
                {grp.name}
              </h3>

              {/* Teacher Info */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <img
                  src={grp.teacherAvatar}
                  alt={grp.teacherName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-white">{grp.teacherName}</div>
                  <div className="text-[10px] text-white/50">Yetakchi o'qituvchi / Mentor</div>
                </div>
              </div>

              {/* Schedule and Room */}
              <div className="space-y-1.5 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-white/40" />
                  <span>{grp.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-white/40" />
                  <span>{grp.activeStudentsCount} / {grp.maxCapacity} ta o'quvchi · {grp.room}</span>
                </div>
              </div>
            </div>

            {/* Progress & CTA */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Dastur o'zlashtirilishi</span>
                <span className="font-bold text-white tabular-nums">{grp.progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ffb020] to-[#34d0a0] rounded-full"
                  style={{ width: `${grp.progressPercent}%` }}
                />
              </div>

              <div className="pt-2 flex items-center justify-end text-xs font-semibold text-[#ffb020] group-hover:translate-x-1 transition-transform">
                <span className="flex items-center gap-1">
                  Guruh tafsilotlari
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Group Support Note */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-[#ffb020] shrink-0" />
        <p className="text-xs text-white/70">
          Guruh mashg'ulotlarida faol qatnashgan o'quvchilar qo'shimcha rag'batlantiruvchi XP ballariga va EduGo stipendiyasiga tavsiya etiladi.
        </p>
      </div>
    </div>
  );
};
