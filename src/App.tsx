import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { AIRobotMascot } from './components/ai/AIRobotMascot';
import { BackendModal } from './components/backend/BackendModal';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { LessonsPage } from './pages/student/LessonsPage';
import { TestsPage } from './pages/student/TestsPage';
import { GroupsPage } from './pages/student/GroupsPage';
import { RankingPage } from './pages/student/RankingPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { ProfilePage } from './pages/student/ProfilePage';

// Teacher Pages
import { TeacherOverview } from './pages/teacher/TeacherOverview';
import { TeacherGroups } from './pages/teacher/TeacherGroups';
import { TeacherAssignments } from './pages/teacher/TeacherAssignments';
import { TeacherQuestions } from './pages/teacher/TeacherQuestions';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminGroups } from './pages/admin/AdminGroups';

const MainRouter: React.FC = () => {
  const {
    role,
    activeTab,
    toastMessage,
    isBackendModalOpen,
    setIsBackendModalOpen,
    reloadBackendData,
  } = useApp();

  const renderContent = () => {
    // Shared tabs across roles
    if (activeTab === 'notifications') return <NotificationsPage />;
    if (activeTab === 'profile') return <ProfilePage />;

    if (role === 'STUDENT') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'lessons':
          return <LessonsPage />;
        case 'tests':
          return <TestsPage />;
        case 'groups':
          return <GroupsPage />;
        case 'ranking':
          return <RankingPage />;
        default:
          return <StudentDashboard />;
      }
    }

    if (role === 'TEACHER') {
      switch (activeTab) {
        case 'overview':
          return <TeacherOverview />;
        case 'groups':
          return <TeacherGroups />;
        case 'assignments':
          return <TeacherAssignments />;
        case 'questions':
          return <TeacherQuestions />;
        default:
          return <TeacherOverview />;
      }
    }

    if (role === 'ADMIN') {
      switch (activeTab) {
        case 'overview':
          return <AdminOverview />;
        case 'users':
          return <AdminUsers />;
        case 'groups':
          return <AdminGroups />;
        default:
          return <AdminOverview />;
      }
    }

    return <StudentDashboard />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d19] text-[#f3f5fd]">
      <Navbar />

      <main className="flex-1 pb-20 lg:pb-8">
        <DeviceFrame>{renderContent()}</DeviceFrame>
      </main>

      {/* Floating & Draggable AI Robot Mascot across all pages */}
      <AIRobotMascot />

      {/* Backend Integration & API Configuration Modal */}
      <BackendModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        onConfigChanged={reloadBackendData}
      />

      {/* Floating in-app Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1e2447] border border-[#ffb020]/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#34d0a0] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
