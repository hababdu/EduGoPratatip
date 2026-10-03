import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Smartphone,
  Monitor,
  Flame,
  Zap,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ChevronDown,
  Check,
  Download,
  Server,
  Globe,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    deviceMode,
    setDeviceMode,
    currentUser,
    notifications,
    activeTab,
    setActiveTab,
    setSelectedLessonId,
    setSelectedGroupId,
    setActiveTestTakingId,
    setIsBackendModalOpen,
    backendConfig,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    setSelectedLessonId(null);
    setSelectedGroupId(null);
    setActiveTestTakingId(null);
  };

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0e1124]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Zone 1: Single element Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo(role === 'STUDENT' ? 'dashboard' : 'overview')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#ffb020] to-[#ffd275] text-[#0b0d19] font-bold text-lg shadow-md shadow-[#ffb020]/20 group-hover:scale-105 transition-transform">
              EG
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                EduGo
                <span className="h-1.5 w-1.5 rounded-full bg-[#34d0a0] animate-pulse" />
              </span>
              <span className="text-[10px] text-white/50 block -mt-1 font-medium">LMS & Telegram Mini App</span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links for Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/70">
          {role === 'STUDENT' && (
            <>
              <button
                onClick={() => navigateTo('dashboard')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'dashboard' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Bosh sahifa
              </button>
              <button
                onClick={() => navigateTo('lessons')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'lessons' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Darslar
              </button>
              <button
                onClick={() => navigateTo('tests')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'tests' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Testlar
              </button>
              <button
                onClick={() => navigateTo('groups')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'groups' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Guruhlarim
              </button>
              <button
                onClick={() => navigateTo('ranking')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'ranking' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Liderlar reytingi
              </button>
            </>
          )}

          {role === 'TEACHER' && (
            <>
              <button
                onClick={() => navigateTo('overview')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'overview' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Ustoz Paneli
              </button>
              <button
                onClick={() => navigateTo('groups')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'groups' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Guruhlar & Davomat
              </button>
              <button
                onClick={() => navigateTo('assignments')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'assignments' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Uy vazifalari
              </button>
              <button
                onClick={() => navigateTo('questions')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'questions' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Savollar banki & Testlar
              </button>
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <button
                onClick={() => navigateTo('overview')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'overview' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Tizim statistikasi
              </button>
              <button
                onClick={() => navigateTo('users')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'users' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Foydalanuvchilar
              </button>
              <button
                onClick={() => navigateTo('groups')}
                className={`transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                  activeTab === 'groups' ? 'text-[#ffb020] font-semibold' : ''
                }`}
              >
                Barcha Guruhlar
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions (Role Switcher, Device Preview Toggle, Notifications, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Streak & XP Pill for Student */}
          {role === 'STUDENT' && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="flex items-center gap-1 text-[#ffb020] font-semibold tabular-nums">
                <Flame className="w-3.5 h-3.5 fill-[#ffb020]" />
                {currentUser.streak} kun
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1 text-[#34d0a0] font-semibold tabular-nums">
                <Zap className="w-3.5 h-3.5 fill-[#34d0a0]" />
                {currentUser.xp} XP
              </span>
            </div>
          )}

          {/* Device Frame Viewport Toggle */}
          <button
            onClick={() => setDeviceMode(deviceMode === 'responsive' ? 'mobile_preview' : 'responsive')}
            title={deviceMode === 'responsive' ? "Mobil TMA rejimida ko'rish" : "Keng ekran rejimiga o'tish"}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            {deviceMode === 'responsive' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span className="hidden md:inline">Mobil TMA</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#34d0a0]" />
                <span className="hidden md:inline">To'liq ekran</span>
              </>
            )}
          </button>

          {/* Backend Integration Settings Button */}
          <button
            onClick={() => setIsBackendModalOpen(true)}
            title="Backend integratsiyasi va API sozlamalari"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
              backendConfig.isCustom
                ? 'border-[#38bdf8]/40 bg-[#38bdf8]/15 text-[#38bdf8] hover:bg-[#38bdf8]/25'
                : 'border-[#34d0a0]/40 bg-[#34d0a0]/15 text-[#34d0a0] hover:bg-[#34d0a0]/25'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {backendConfig.isCustom ? 'Tashqi API' : 'Backend'}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendConfig.isCustom ? 'bg-[#38bdf8] animate-pulse' : 'bg-[#34d0a0]'
              }`}
            />
          </button>

          {/* Notifications button */}
          <button
            onClick={() => navigateTo('notifications')}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Bildirishnomalar"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f0654b] px-1 text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition cursor-pointer"
            >
              {role === 'STUDENT' && <GraduationCap className="w-3.5 h-3.5 text-[#34d0a0]" />}
              {role === 'TEACHER' && <Briefcase className="w-3.5 h-3.5 text-[#ffb020]" />}
              {role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />}
              <span className="hidden sm:inline">
                {role === 'STUDENT' ? "O'quvchi" : role === 'TEACHER' ? "O'qituvchi" : 'Admin'}
              </span>
              <ChevronDown className="w-3 h-3 text-white/50" />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#161a33] p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                    Rolni almashtirish
                  </div>
                  <button
                    onClick={() => handleRoleSelect('STUDENT')}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      role === 'STUDENT'
                        ? 'bg-[#34d0a0]/15 text-[#34d0a0]'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#34d0a0]" />
                      <span>O'quvchi (Student)</span>
                    </div>
                    {role === 'STUDENT' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('TEACHER')}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      role === 'TEACHER'
                        ? 'bg-[#ffb020]/15 text-[#ffb020]'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#ffb020]" />
                      <span>O'qituvchi (Teacher)</span>
                    </div>
                    {role === 'TEACHER' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('ADMIN')}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      role === 'ADMIN'
                        ? 'bg-[#38bdf8]/15 text-[#38bdf8]'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                      <span>Admin (Boshqaruv)</span>
                    </div>
                    {role === 'ADMIN' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Profile Avatar trigger */}
          <button
            onClick={() => navigateTo('profile')}
            className="flex items-center gap-1.5 p-0.5 rounded-full border border-white/15 hover:border-[#ffb020] transition-colors cursor-pointer"
            title="Mening profilim"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
