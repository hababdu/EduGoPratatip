import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Zap,
  Award,
  BookOpen,
  Calendar,
  Send,
  Phone,
  Building,
  CheckCircle2,
  Edit2,
  Check,
  Server,
  Globe,
  ChevronRight,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, setIsBackendModalOpen, backendConfig } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [bio, setBio] = useState(currentUser.bio || '');

  const handleSaveProfile = () => {
    setCurrentUser((prev) => ({
      ...prev,
      name,
      phone,
      bio,
    }));
    setIsEditing(false);
  };

  // Generate 28-day streak heatmap blocks
  const days = Array.from({ length: 28 }, (_, i) => {
    const isCompleted = i % 3 !== 0; // simulated activity
    return { day: i + 1, active: isCompleted };
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Profile ID Card */}
      <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffb020]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-[#ffb020] shadow-lg shadow-[#ffb020]/20"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#34d0a0] text-[9px] font-bold text-[#0b0d19]">
                LVL {currentUser.level}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg sm:text-xl font-bold text-white">
                  {currentUser.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#34d0a0]/15 text-[#34d0a0] text-[10px] font-bold">
                  {currentUser.role}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span className="text-[#38bdf8]">{currentUser.username}</span>
                <span>·</span>
                <span>ID: {currentUser.id}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditing) {
                handleSaveProfile();
              } else {
                setIsEditing(true);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition self-start sm:self-center cursor-pointer"
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#34d0a0]" />
                <span>Saqlash</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                <span>Tahrirlash</span>
              </>
            )}
          </button>
        </div>

        {/* Edit fields or info text */}
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5">
            <div>
              <label className="text-[11px] text-white/50 block mb-1">To'liq ism</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/50 block mb-1">Telefon raqam</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] text-white/50 block mb-1">Bio / Maqsad</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-white/70 italic border-t border-white/5 pt-3">
            "{currentUser.bio || "Maqsad: Bilim va intizom orqali yuksak cho'qqilarni zabt etish!"}"
          </p>
        )}

        {/* Contact info metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-[#38bdf8]" />
            <span>{currentUser.username} (Telegram)</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#34d0a0]" />
            <span>{currentUser.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-[#ffb020]" />
            <span className="truncate">{currentUser.studyCenter}</span>
          </div>
        </div>
      </div>

      {/* Numerical Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 text-center space-y-1">
          <div className="flex items-center justify-center text-[#ffb020] mb-1">
            <Flame className="w-5 h-5 fill-[#ffb020]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
            {currentUser.streak} kun
          </div>
          <div className="text-[11px] text-white/50">Uzluksiz Streak</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 text-center space-y-1">
          <div className="flex items-center justify-center text-[#34d0a0] mb-1">
            <Zap className="w-5 h-5 fill-[#34d0a0]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
            {currentUser.xp}
          </div>
          <div className="text-[11px] text-white/50">Jamg'arilgan XP</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 text-center space-y-1">
          <div className="flex items-center justify-center text-[#38bdf8] mb-1">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
            {currentUser.completedLessonsCount}
          </div>
          <div className="text-[11px] text-white/50">Tugallangan darslar</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#12162a] border border-white/10 text-center space-y-1">
          <div className="flex items-center justify-center text-purple-400 mb-1">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
            {currentUser.testsPassedCount}
          </div>
          <div className="text-[11px] text-white/50">Topshirilgan testlar</div>
        </div>
      </div>

      {/* Streak Calendar Activity Heatmap */}
      <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#ffb020]" />
            <span>Oylik Faollik Matritsasi</span>
          </h3>
          <span className="text-[11px] text-[#34d0a0] font-semibold">14 kunlik streak faol</span>
        </div>

        <p className="text-xs text-white/50">
          Har kuni kamida bitta dars ko'rish yoki test yechish orqali odatni mustahkamlang:
        </p>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
          {days.map((d) => (
            <div
              key={d.day}
              className={`h-9 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold transition ${
                d.active
                  ? 'bg-[#34d0a0]/20 text-[#34d0a0] border border-[#34d0a0]/40'
                  : 'bg-white/5 text-white/30 border border-white/5'
              }`}
            >
              <span>{d.day}</span>
              {d.active && <span className="w-1 h-1 rounded-full bg-[#34d0a0] mt-0.5" />}
            </div>
          ))}
        </div>
      </div>

      {/* Backend Integration Settings Card */}
      <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffb020]/15 text-[#ffb020] border border-[#ffb020]/30">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Backend Integratsiyasi & API</span>
                {backendConfig.isCustom ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] text-[9px] font-bold border border-[#38bdf8]/30">
                    Tashqi API
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#34d0a0]/15 text-[#34d0a0] text-[9px] font-bold border border-[#34d0a0]/30">
                    O'rnatilgan server
                  </span>
                )}
              </h3>
              <p className="text-xs text-white/50">
                {backendConfig.baseUrl
                  ? backendConfig.baseUrl
                  : "Loyiha o'zining Express backend serveriga ulangan"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBackendModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#ffb020]/10 hover:bg-[#ffb020]/20 text-[#ffb020] border border-[#ffb020]/30 text-xs font-semibold transition cursor-pointer"
          >
            <span>Sozlash</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Telegram Mini App & Settings Notice */}
      <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 space-y-3">
        <h3 className="text-sm font-bold text-white">Xavfsizlik va Telegram Bog'lanish</h3>
        <p className="text-xs text-white/60 leading-relaxed">
          Sizning hisobingiz Telegram bot orqali avtomatik himoyalangan. Parolsiz, xavfsiz va bir teginishda (One-Tap) kirish imkoni faollashtirilgan.
        </p>
        <div className="flex items-center gap-2 text-xs text-[#34d0a0]">
          <CheckCircle2 className="w-4 h-4" />
          <span>Telegram HMAC-SHA256 tekshiruvi tasdiqlangan</span>
        </div>
      </div>
    </div>
  );
};
