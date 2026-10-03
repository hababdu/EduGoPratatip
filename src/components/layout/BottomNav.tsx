import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Users,
  Trophy,
  User as UserIcon,
  ClipboardList,
  HelpCircle,
  Shield,
  Layers,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    role,
    activeTab,
    setActiveTab,
    setSelectedLessonId,
    setSelectedGroupId,
    setActiveTestTakingId,
    activeTestTakingId,
  } = useApp();

  // If a student is actively taking a timed test, minimize distraction
  if (activeTestTakingId) {
    return null;
  }

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setSelectedLessonId(null);
    setSelectedGroupId(null);
    setActiveTestTakingId(null);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-white/10 bg-[#0e1124]/95 backdrop-blur-xl pb-safe">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {role === 'STUDENT' && (
          <>
            <button
              onClick={() => handleNav('dashboard')}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium tracking-tight">Asosiy</span>
              {activeTab === 'dashboard' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNav('lessons')}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'lessons' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <BookOpen className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium tracking-tight">Darslar</span>
              {activeTab === 'lessons' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNav('tests')}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'tests' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <FileQuestion className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium tracking-tight">Testlar</span>
              {activeTab === 'tests' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNav('groups')}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'groups' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Users className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium tracking-tight">Guruhlar</span>
              {activeTab === 'groups' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNav('ranking')}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'ranking' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Trophy className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium tracking-tight">Reyting</span>
              {activeTab === 'ranking' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNav('profile')}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'profile' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <UserIcon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium tracking-tight">Profil</span>
              {activeTab === 'profile' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>
          </>
        )}

        {role === 'TEACHER' && (
          <>
            <button
              onClick={() => handleNav('overview')}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Xulosa</span>
              {activeTab === 'overview' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNav('groups')}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'groups' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Users className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Guruhlar</span>
              {activeTab === 'groups' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNav('assignments')}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'assignments' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <ClipboardList className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Vazifalar</span>
              {activeTab === 'assignments' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNav('questions')}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'questions' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <HelpCircle className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Savollar</span>
              {activeTab === 'questions' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>
          </>
        )}

        {role === 'ADMIN' && (
          <>
            <button
              onClick={() => handleNav('overview')}
              className={`flex flex-col items-center justify-center min-w-[70px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Shield className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Boshqaruv</span>
              {activeTab === 'overview' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNav('users')}
              className={`flex flex-col items-center justify-center min-w-[70px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'users' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Users className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">A'zolar</span>
              {activeTab === 'users' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>

            <button
              onClick={() => handleNav('groups')}
              className={`flex flex-col items-center justify-center min-w-[70px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                activeTab === 'groups' ? 'text-[#ffb020]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Layers className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Guruhlar</span>
              {activeTab === 'groups' && (
                <span className="w-1 h-1 rounded-full bg-[#ffb020] mt-0.5" />
              )}
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
