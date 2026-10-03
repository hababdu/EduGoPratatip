import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  fetchHealth,
  completeLessonApi,
  submitTestApi,
  markAttendanceApi,
  createAssignmentApi,
  toggleUserStatusApi,
  updateUserRoleApi,
  markNotificationsReadApi,
  getBackendConfig,
  BackendConfig,
  fetchSubjectsApi,
  fetchLessonsApi,
  fetchTestsApi,
  fetchGroupsApi,
  fetchAssignmentsApi,
  fetchLeaderboardApi,
  fetchNotificationsApi,
} from '../services/api';
import {
  UserRole,
  DeviceMode,
  User,
  Subject,
  Lesson,
  TestItem,
  Group,
  Assignment,
  LeaderboardUser,
  NotificationItem,
  QuizQuestion,
} from '../types';
import {
  INITIAL_CURRENT_USER,
  INITIAL_TEACHER_USER,
  INITIAL_ADMIN_USER,
  ALL_USERS,
  SUBJECTS,
  LESSONS,
  TESTS,
  GROUPS,
  ASSIGNMENTS,
  LEADERBOARD,
  NOTIFICATIONS,
  SAMPLE_QUESTIONS,
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
  activeTestTakingId: string | null;
  setActiveTestTakingId: (id: string | null) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;

  // Backend Integration
  isBackendModalOpen: boolean;
  setIsBackendModalOpen: (open: boolean) => void;
  backendConfig: BackendConfig;
  reloadBackendData: () => Promise<void>;

  // Data lists
  subjects: Subject[];
  lessons: Lesson[];
  tests: TestItem[];
  groups: Group[];
  assignments: Assignment[];
  leaderboard: LeaderboardUser[];
  notifications: NotificationItem[];
  users: User[];
  questions: QuizQuestion[];

  // Actions
  completeLesson: (lessonId: string) => void;
  submitTestResults: (testId: string, score: number, xpEarned: number) => void;
  markAttendance: (groupId: string, memberId: string, status: 'present' | 'absent' | 'excused') => void;
  createAssignment: (assignment: Partial<Assignment>) => void;
  createQuestion: (question: Partial<QuizQuestion>) => void;
  toggleUserStatus: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  markNotificationsAsRead: () => void;
  fireConfetti: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  backendSynced: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('STUDENT');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_CURRENT_USER);
  const [backendSynced, setBackendSynced] = useState<boolean>(true);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);
  const [backendConfig, setBackendConfig] = useState<BackendConfig>(getBackendConfig());

  // Tabs
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [activeTestTakingId, setActiveTestTakingId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // State arrays
  const [subjects, setSubjects] = useState<Subject[]>(SUBJECTS);
  const [lessons, setLessons] = useState<Lesson[]>(LESSONS);
  const [tests, setTests] = useState<TestItem[]>(TESTS);
  const [groups, setGroups] = useState<Group[]>(GROUPS);
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(LEADERBOARD);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [users, setUsers] = useState<User[]>(ALL_USERS);
  const [questions, setQuestions] = useState<QuizQuestion[]>(SAMPLE_QUESTIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Synchronize current user with role switch
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'STUDENT') {
      setCurrentUser(INITIAL_CURRENT_USER);
      setActiveTab('dashboard');
    } else if (newRole === 'TEACHER') {
      setCurrentUser(INITIAL_TEACHER_USER);
      setActiveTab('overview');
    } else if (newRole === 'ADMIN') {
      setCurrentUser(INITIAL_ADMIN_USER);
      setActiveTab('overview');
    }
    // reset drilldowns
    setSelectedLessonId(null);
    setSelectedGroupId(null);
    setActiveTestTakingId(null);
    setSelectedStudentId(null);
  };

  // Check backend server on load
  useEffect(() => {
    fetchHealth().then((health) => {
      if (health && health.status === 'ok') {
        setBackendSynced(true);
      }
    });
  }, []);

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ffb020', '#34d0a0', '#38bdf8', '#ffffff'],
      });
    } catch {
      // safe fallback
    }
  };

  const completeLesson = (lessonId: string) => {
    setLessons((prev) =>
      prev.map((les) => (les.id === lessonId ? { ...les, isCompleted: true } : les))
    );
    setCurrentUser((prev) => ({
      ...prev,
      xp: prev.xp + 50,
      coins: prev.coins + 15,
      completedLessonsCount: prev.completedLessonsCount + 1,
    }));
    fireConfetti();
    // Real backend sync
    completeLessonApi(lessonId).catch(() => {});
  };

  const submitTestResults = (testId: string, score: number, xpEarned: number) => {
    setTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, isCompleted: true, lastScore: score } : t))
    );
    setCurrentUser((prev) => ({
      ...prev,
      xp: prev.xp + xpEarned,
      coins: prev.coins + Math.round(xpEarned / 5),
      testsPassedCount: prev.testsPassedCount + (score >= 60 ? 1 : 0),
    }));

    // Update notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Yangi test topshirildi',
      message: `Test natijangiz: ${score} ball! (+${xpEarned} XP)`,
      timeAgo: 'Hozirgina',
      type: 'grade',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Update leaderboard XP
    setLeaderboard((prev) =>
      prev.map((item) =>
        item.isCurrentUser
          ? { ...item, xp: item.xp + xpEarned, testsPassed: item.testsPassed + 1 }
          : item
      )
    );

    fireConfetti();
    // Real backend sync
    submitTestApi(testId, score, xpEarned).catch(() => {});
  };

  const markAttendance = (groupId: string, memberId: string, status: 'present' | 'absent' | 'excused') => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== groupId) return grp;
        return {
          ...grp,
          members: grp.members.map((m) => (m.id === memberId ? { ...m, status } : m)),
        };
      })
    );
    // Real backend sync
    markAttendanceApi(groupId, memberId, status).catch(() => {});
  };

  const createAssignment = (assignmentData: Partial<Assignment>) => {
    const newAss: Assignment = {
      id: `ass_${Date.now()}`,
      groupId: assignmentData.groupId || groups[0]?.id || '',
      groupName: assignmentData.groupName || groups[0]?.name || '',
      title: assignmentData.title || 'Yangi vazifa',
      description: assignmentData.description || '',
      deadline: assignmentData.deadline || '2026-10-15 20:00',
      maxScore: assignmentData.maxScore || 100,
      submittedCount: 0,
      totalCount: 16,
      status: 'active',
      teacherNotes: assignmentData.teacherNotes,
    };
    setAssignments((prev) => [newAss, ...prev]);
    // Real backend sync
    createAssignmentApi(newAss).catch(() => {});
  };

  const createQuestion = (questionData: Partial<QuizQuestion>) => {
    const newQ: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: questionData.question || 'Yangi savol',
      options: questionData.options || [
        { id: 'opt_1', text: 'A varianti' },
        { id: 'opt_2', text: 'B varianti' },
      ],
      correctOptionId: questionData.correctOptionId || 'opt_1',
      explanation: questionData.explanation || '',
      points: questionData.points || 10,
      subjectId: questionData.subjectId || 'sub_frontend',
      difficulty: questionData.difficulty || 'Oson',
    };
    setQuestions((prev) => [newQ, ...prev]);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
      )
    );
    // Real backend sync
    toggleUserStatusApi(userId).catch(() => {});
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    // Real backend sync
    updateUserRoleApi(userId, newRole).catch(() => {});
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    // Real backend sync
    markNotificationsReadApi().catch(() => {});
  };

  const reloadBackendData = async () => {
    const config = getBackendConfig();
    setBackendConfig(config);
    try {
      const [healthRes, subsRes, lessonsRes, testsRes, grpsRes, assRes, leadRes, notifRes] =
        await Promise.allSettled([
          fetchHealth(),
          fetchSubjectsApi(),
          fetchLessonsApi(),
          fetchTestsApi(),
          fetchGroupsApi(),
          fetchAssignmentsApi(),
          fetchLeaderboardApi(),
          fetchNotificationsApi(),
        ]);

      if (healthRes.status === 'fulfilled' && healthRes.value) {
        setBackendSynced(true);
      } else {
        setBackendSynced(false);
      }

      if (subsRes.status === 'fulfilled' && Array.isArray(subsRes.value) && subsRes.value.length > 0) {
        setSubjects(subsRes.value);
      }
      if (lessonsRes.status === 'fulfilled' && Array.isArray(lessonsRes.value) && lessonsRes.value.length > 0) {
        setLessons(lessonsRes.value);
      }
      if (testsRes.status === 'fulfilled' && Array.isArray(testsRes.value) && testsRes.value.length > 0) {
        setTests(testsRes.value);
      }
      if (grpsRes.status === 'fulfilled' && Array.isArray(grpsRes.value) && grpsRes.value.length > 0) {
        setGroups(grpsRes.value);
      }
      if (assRes.status === 'fulfilled' && Array.isArray(assRes.value) && assRes.value.length > 0) {
        setAssignments(assRes.value);
      }
      if (leadRes.status === 'fulfilled' && Array.isArray(leadRes.value) && leadRes.value.length > 0) {
        setLeaderboard(leadRes.value);
      }
      if (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value) && notifRes.value.length > 0) {
        setNotifications(notifRes.value);
      }

      showToast("Backend ma'lumotlari muvaffaqiyatli yangilandi! 🚀");
    } catch {
      showToast("Backenddan ma'lumot olishda xatolik yuz berdi");
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        deviceMode,
        setDeviceMode,
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        selectedLessonId,
        setSelectedLessonId,
        selectedGroupId,
        setSelectedGroupId,
        activeTestTakingId,
        setActiveTestTakingId,
        selectedStudentId,
        setSelectedStudentId,
        isBackendModalOpen,
        setIsBackendModalOpen,
        backendConfig,
        reloadBackendData,
        subjects,
        lessons,
        tests,
        groups,
        assignments,
        leaderboard,
        notifications,
        users,
        questions,
        completeLesson,
        submitTestResults,
        markAttendance,
        createAssignment,
        createQuestion,
        toggleUserStatus,
        updateUserRole,
        markNotificationsAsRead,
        fireConfetti,
        toastMessage,
        showToast,
        backendSynced,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
