import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Flame,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';

export const RankingPage: React.FC = () => {
  const { leaderboard, currentUser } = useApp();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeaderboard = leaderboard.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#ffb020]" />
            <span>Liderlar Reytingi</span>
          </h1>
          <p className="text-xs text-white/50">
            Darslar, testlar va faollik uchun berilgan XP ballari bo'yicha eng yaxshi talabalar
          </p>
        </div>

        {/* Timeframe Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              timeframe === 'weekly'
                ? 'bg-[#ffb020] text-[#0b0d19]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Haftalik
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              timeframe === 'monthly'
                ? 'bg-[#ffb020] text-[#0b0d19]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Oylik
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              timeframe === 'all'
                ? 'bg-[#ffb020] text-[#0b0d19]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Barcha vaqt
          </button>
        </div>
      </div>

      {/* Podium for Top 3 */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-6 pb-2 max-w-lg mx-auto">
        {/* 2nd Place */}
        {top2 && (
          <div className="flex flex-col items-center space-y-2 order-1">
            <div className="relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm">🥈</span>
              <img
                src={top2.avatarUrl}
                alt={top2.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-300 shadow-md"
              />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-white truncate max-w-[90px] sm:max-w-none">
                {top2.name.split(' ')[0]}
              </div>
              <div className="text-[11px] font-bold text-[#ffb020] tabular-nums">
                {top2.xp} XP
              </div>
            </div>
            <div className="w-full h-24 rounded-t-2xl bg-gradient-to-t from-white/10 to-white/5 border-t border-x border-white/10 flex items-center justify-center font-display font-bold text-lg text-slate-300">
              2
            </div>
          </div>
        )}

        {/* 1st Place */}
        {top1 && (
          <div className="flex flex-col items-center space-y-2 order-2">
            <div className="relative">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg">👑</span>
              <img
                src={top1.avatarUrl}
                alt={top1.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#ffb020] shadow-xl shadow-[#ffb020]/20"
              />
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm font-bold text-[#ffb020] truncate max-w-[100px] sm:max-w-none">
                {top1.name.split(' ')[0]}
              </div>
              <div className="text-xs font-bold text-white tabular-nums">
                {top1.xp} XP
              </div>
            </div>
            <div className="w-full h-32 rounded-t-2xl bg-gradient-to-t from-[#ffb020]/25 to-[#ffb020]/10 border-t border-x border-[#ffb020]/30 flex items-center justify-center font-display font-bold text-2xl text-[#ffb020]">
              1
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3 && (
          <div className="flex flex-col items-center space-y-2 order-3">
            <div className="relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm">🥉</span>
              <img
                src={top3.avatarUrl}
                alt={top3.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-700 shadow-md"
              />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-white truncate max-w-[90px] sm:max-w-none">
                {top3.name.split(' ')[0]}
              </div>
              <div className="text-[11px] font-bold text-[#ffb020] tabular-nums">
                {top3.xp} XP
              </div>
            </div>
            <div className="w-full h-18 rounded-t-2xl bg-gradient-to-t from-white/10 to-white/5 border-t border-x border-white/10 flex items-center justify-center font-display font-bold text-base text-amber-600">
              3
            </div>
          </div>
        )}
      </div>

      {/* Current User Standing Card */}
      <div className="rounded-3xl border border-[#ffb020]/30 bg-[#ffb020]/10 p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#ffb020] text-[#0b0d19] font-bold text-sm">
            #{currentUser.rank}
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Sizning o'rningiz ({currentUser.name})</span>
              <Sparkles className="w-3.5 h-3.5 text-[#ffb020]" />
            </div>
            <div className="text-[11px] text-white/60">
              2-o'rindagi tinglovchidan atigi 110 XP farq qilmoqda!
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold text-[#ffb020] tabular-nums">
            {currentUser.xp} XP
          </div>
          <div className="text-[10px] text-white/50">{currentUser.streak} kun streak</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Talaba ismini qidirish..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#ffb020]"
        />
      </div>

      {/* Leaderboard Table / Rows */}
      <div className="rounded-3xl border border-white/10 bg-[#12162a] p-4 sm:p-5 space-y-2">
        {filteredLeaderboard.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-2xl transition ${
              item.isCurrentUser
                ? 'bg-[#ffb020]/15 border border-[#ffb020]/40'
                : 'bg-white/5 border border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white/40 tabular-nums w-5 text-center">
                {item.rank}
              </span>
              <img
                src={item.avatarUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl object-cover"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] text-[#ffb020] font-normal hidden sm:inline">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-white/40 flex items-center gap-2">
                  <span>{item.testsPassed} ta test topshirgan</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-[#ffb020]">
                    <Flame className="w-3 h-3 fill-[#ffb020]" />
                    {item.streak} kun
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-white tabular-nums">
              <Zap className="w-3.5 h-3.5 text-[#ffb020] fill-[#ffb020]" />
              <span>{item.xp} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
