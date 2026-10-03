import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Users,
  Search,
  Shield,
  GraduationCap,
  Briefcase,
  Ban,
  CheckCircle,
  MoreVertical,
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, toggleUserStatus, updateUserRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-[#38bdf8]" />
          <span>Foydalanuvchilarni Boshqarish</span>
        </h1>
        <p className="text-xs text-white/50">
          O'quvchilar, o'qituvchilar va administratorlar huquqlarini belgilash hamda monitoring qilish
        </p>
      </div>

      {/* Toolbar: Search & Role Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism, Telegram username yoki telefon..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#38bdf8]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { key: 'all', label: 'Barchasi' },
            { key: 'STUDENT', label: "O'quvchilar" },
            { key: 'TEACHER', label: "O'qituvchilar" },
            { key: 'ADMIN', label: 'Adminlar' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setRoleFilter(item.key)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                roleFilter === item.key
                  ? 'bg-[#38bdf8] text-[#0b0d19]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* User Table / Cards */}
      <div className="space-y-3">
        {filteredUsers.map((user) => {
          const isBlocked = user.status === 'blocked';

          return (
            <div
              key={user.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition gap-3 ${
                isBlocked
                  ? 'bg-[#1a1215]/50 border-red-500/20 opacity-70'
                  : 'bg-[#12162a] border-white/10'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-2xl object-cover"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{user.name}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        user.role === 'ADMIN'
                          ? 'bg-[#38bdf8]/15 text-[#38bdf8]'
                          : user.role === 'TEACHER'
                          ? 'bg-[#ffb020]/15 text-[#ffb020]'
                          : 'bg-[#34d0a0]/15 text-[#34d0a0]'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/50 flex flex-wrap items-center gap-2">
                    <span className="text-[#38bdf8]">{user.username}</span>
                    <span>·</span>
                    <span>{user.phone}</span>
                    <span>·</span>
                    <span>{user.studyCenter}</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                {/* Role Switcher Select */}
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-[#38bdf8] cursor-pointer"
                >
                  <option value="STUDENT">Talaba (Student)</option>
                  <option value="TEACHER">O'qituvchi (Teacher)</option>
                  <option value="ADMIN">Admin</option>
                </select>

                {/* Status Toggle Button */}
                <button
                  onClick={() => toggleUserStatus(user.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isBlocked
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-[#34d0a0]/15 text-[#34d0a0] hover:bg-[#34d0a0]/25'
                  }`}
                >
                  {isBlocked ? (
                    <>
                      <Ban className="w-3.5 h-3.5" />
                      <span>Blokdan chiqarish</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Faol</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
