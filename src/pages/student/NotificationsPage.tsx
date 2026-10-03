import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationsAsRead, setActiveTab } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'grade':
        return <Award className="w-5 h-5 text-[#ffb020]" />;
      case 'assignment':
        return <BookOpen className="w-5 h-5 text-[#38bdf8]" />;
      case 'announcement':
        return <Calendar className="w-5 h-5 text-[#34d0a0]" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#38bdf8]" />
            <span>Bildirishnomalar</span>
          </h1>
          <p className="text-xs text-white/50">
            Baholar, vazifalar, dars jadvali va tizim yangiliklari
          </p>
        </div>

        <button
          onClick={markNotificationsAsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition cursor-pointer self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-[#34d0a0]" />
          <span>Barchasini o'qilgan deb belgilash</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { key: 'all', label: 'Barchasi' },
          { key: 'grade', label: 'Baholar' },
          { key: 'assignment', label: 'Vazifalar' },
          { key: 'announcement', label: 'E\'lonlar' },
          { key: 'system', label: 'Tizim' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filter === tab.key
                ? 'bg-[#ffb020] text-[#0b0d19]'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-white/5 bg-[#12162a] p-6 space-y-2">
            <Bell className="w-8 h-8 text-white/20 mx-auto" />
            <div className="text-sm font-semibold text-white">Yangi bildirishnomalar yo'q</div>
            <p className="text-xs text-white/40">Hozircha barcha yangiliklardan xabardorsiz.</p>
          </div>
        ) : (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                !item.isRead
                  ? 'bg-[#181d3d] border-[#38bdf8]/40 shadow-lg'
                  : 'bg-[#12162a] border-white/10'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-white/40 whitespace-nowrap">
                    {item.timeAgo}
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  {item.message}
                </p>
                {item.type === 'grade' && (
                  <button
                    onClick={() => setActiveTab('tests')}
                    className="text-[11px] font-bold text-[#ffb020] hover:underline pt-1 cursor-pointer block"
                  >
                    Testlar paneliga o'tish →
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
