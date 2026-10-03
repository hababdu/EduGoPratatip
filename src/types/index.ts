// EduGo - Domain Types

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type DeviceMode = 'responsive' | 'mobile_preview';

export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  avatarUrl: string;
  role: UserRole;
  xp: number;
  level: number;
  streak: number;
  rank: number;
  studyCenter: string;
  bio?: string;
  coins: number;
  completedLessonsCount: number;
  testsPassedCount: number;
  status: 'active' | 'blocked';
  joinedDate: string;
}

export interface Subject {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  bgGradient: string;
  posterUrl: string;
  lessonsCount: number;
  completedLessonsCount: number;
  testsCount: number;
  teacherName: string;
  category: 'it' | 'exact' | 'languages' | 'science';
}

export interface Lesson {
  id: string;
  subjectId: string;
  subjectTitle: string;
  title: string;
  description: string;
  durationMinutes: number;
  videoUrl?: string;
  order: number;
  isCompleted: boolean;
  isLocked: boolean;
  contentMarkdown: string;
  keyPoints: string[];
  attachments: { name: string; size: string; type: string }[];
  quizQuestions?: QuizQuestion[];
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  points: number;
  subjectId?: string;
  difficulty?: 'Oson' | "O'rta" | 'Qiyin';
}

export interface TestItem {
  id: string;
  title: string;
  subjectId: string;
  subjectTitle: string;
  durationMinutes: number;
  questionsCount: number;
  passingScorePercent: number;
  xpReward: number;
  questions: QuizQuestion[];
  isCompleted?: boolean;
  lastScore?: number;
  dueDate?: string;
  category: 'Olimpiada' | 'DTM' | 'Haftalik' | 'Sertifikat';
}

export interface GroupMember {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  xp: number;
  attendanceRate: number; // percentage
  averageScore: number;
  status: 'present' | 'absent' | 'excused';
}

export interface Group {
  id: string;
  name: string;
  subjectTitle: string;
  subjectId: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  schedule: string; // e.g. "Dush, Chor, Juma · 15:00 - 17:00"
  room: string;
  activeStudentsCount: number;
  maxCapacity: number;
  progressPercent: number;
  members: GroupMember[];
  nextLessonTime: string;
  announcementsCount: number;
}

export interface Assignment {
  id: string;
  groupId: string;
  groupName: string;
  title: string;
  description: string;
  deadline: string;
  maxScore: number;
  submittedCount: number;
  totalCount: number;
  status: 'active' | 'reviewing' | 'completed';
  teacherNotes?: string;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatarUrl: string;
  xp: number;
  streak: number;
  testsPassed: number;
  isCurrentUser?: boolean;
  badge?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'grade' | 'assignment' | 'announcement' | 'system';
  isRead: boolean;
  linkAction?: string;
}
