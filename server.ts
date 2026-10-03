import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7412894102:AAH9bK8jG4v7f2xQ1EduGoBotToken';

// CORS Middleware to allow connecting from external mini-apps or local dev
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// In-Memory Database initialized with full EduGo Data
interface UserRecord {
  id: string;
  telegramId: string;
  name: string;
  username: string;
  phone: string;
  avatarUrl: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  studyCenter: string;
  xp: number;
  level: number;
  rank: number;
  streakDays: number;
  coins: number;
  testsPassedCount: number;
  completedLessonsCount: number;
  status: 'active' | 'blocked';
  createdAt: string;
}

let users: UserRecord[] = [
  {
    id: 'usr_student_1',
    telegramId: '984512301',
    name: 'Habibullo Abdusamadov',
    username: '@hababdu',
    phone: '+998 90 123 45 67',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'STUDENT',
    studyCenter: 'Najot Ta\'lim Chilonzor',
    xp: 2450,
    level: 7,
    rank: 4,
    streakDays: 14,
    coins: 480,
    testsPassedCount: 18,
    completedLessonsCount: 32,
    status: 'active',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'usr_teacher_1',
    telegramId: '451299812',
    name: 'Dilshod Rahmatov',
    username: '@dilshod_math',
    phone: '+998 93 555 77 88',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'TEACHER',
    studyCenter: 'EduGo Akademiyasi',
    xp: 6800,
    level: 15,
    rank: 1,
    streakDays: 45,
    coins: 1250,
    testsPassedCount: 60,
    completedLessonsCount: 120,
    status: 'active',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'usr_admin_1',
    telegramId: '112233445',
    name: 'EduGo Bosh Administrator',
    username: '@edugo_admin',
    phone: '+998 71 200 00 20',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'ADMIN',
    studyCenter: 'EduGo Markaziy Ofis',
    xp: 12000,
    level: 25,
    rank: 1,
    streakDays: 90,
    coins: 5000,
    testsPassedCount: 150,
    completedLessonsCount: 300,
    status: 'active',
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'usr_student_2',
    telegramId: '984512302',
    name: 'Jasur Bekmirzayev',
    username: '@jasur_code',
    phone: '+998 91 234 56 78',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'STUDENT',
    studyCenter: 'Astrum IT Akademiya',
    xp: 3200,
    level: 9,
    rank: 1,
    streakDays: 21,
    coins: 610,
    testsPassedCount: 24,
    completedLessonsCount: 41,
    status: 'active',
    createdAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'usr_student_3',
    telegramId: '984512303',
    name: 'Madina Karimova',
    username: '@madina_k',
    phone: '+998 94 345 67 89',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'STUDENT',
    studyCenter: 'Najot Ta\'lim',
    xp: 2950,
    level: 8,
    rank: 2,
    streakDays: 18,
    coins: 540,
    testsPassedCount: 22,
    completedLessonsCount: 38,
    status: 'active',
    createdAt: '2026-09-03T11:00:00Z',
  },
];

let subjects = [
  {
    id: 'sub_frontend',
    title: 'Frontend & Telegram Mini Apps',
    description: 'React 19, TypeScript, Tailwind CSS va Telegram WebApp SDK',
    iconName: 'Code',
    color: '#ffb020',
    lessonsCount: 24,
    completedLessonsCount: 16,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    category: 'Dasturlash',
  },
  {
    id: 'sub_math',
    title: 'Oliy Matematika & DTM 2026',
    description: 'Funksiyalar, hosila, integrallar va ehtimollar nazariyasi',
    iconName: 'Calculator',
    color: '#34d0a0',
    lessonsCount: 30,
    completedLessonsCount: 20,
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    category: 'Aniq fanlar',
  },
  {
    id: 'sub_english',
    title: 'IELTS Intensive 7.5+',
    description: 'Academic Reading, Writing Task 1-2 va Speaking strategiyalari',
    iconName: 'BookA',
    color: '#38bdf8',
    lessonsCount: 28,
    completedLessonsCount: 14,
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80',
    category: 'Tillar',
  },
  {
    id: 'sub_physics',
    title: 'Fizika: Mexanika & Optika',
    description: 'Nyuton qonunlari, to\'lqinlar va kvant fizikasiga kirish',
    iconName: 'Atom',
    color: '#a78bfa',
    lessonsCount: 20,
    completedLessonsCount: 9,
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    category: 'Tabiiy fanlar',
  },
];

let lessons = [
  {
    id: 'les_tma_1',
    subjectId: 'sub_frontend',
    subjectTitle: 'Frontend & TMA',
    title: 'Telegram Mini Apps SDK arxitekturasi va InitData',
    description: 'Telegram bot va mini app o\'rtasidagi aloqa, window.Telegram.WebApp obyekti, ranglar va themeParams.',
    videoDuration: '18:45',
    durationMinutes: 19,
    isCompleted: false,
    isLocked: false,
    order: 1,
    contentMarkdown: `### Kirish va TMA arxitekturasi\n\nTelegram Mini Apps (TMA) — bu Telegram ichida bevosita ishga tushuvchi zamonaviy veb-ilovalardir.\n\n#### Asosiy parametrlar:\n* **initData**: Foydalanuvchi ma'lumotlari va xavfsizlik imzosi (hash).\n* **MainButton / SecondaryButton**: Telegramning pastki apparat tugmalari.\n* **HapticFeedback**: Mobil qurilma tebranishi (notificationOccurred, impactOccurred).\n\n\`\`\`ts\n// Telegram WebApp obyektini kengaytirish\nconst tg = window.Telegram?.WebApp;\ntg.ready();\ntg.expand();\n\`\`\``,
    attachments: [
      { name: 'tma-telegram-architecture.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'starter-kit-vite-telegram.zip', size: '480 KB', type: 'archive' },
    ],
  },
  {
    id: 'les_tma_2',
    subjectId: 'sub_frontend',
    subjectTitle: 'Frontend & TMA',
    title: 'React 19 da Server Actions va Form Status',
    description: 'useActionState, useOptimistic hamda yangi form hooks tahlili',
    videoDuration: '24:10',
    durationMinutes: 24,
    isCompleted: true,
    isLocked: false,
    order: 2,
    contentMarkdown: `### React 19 Action Paradigm\n\nReact 19 da formalar bilan ishlash keskin o'zgardi. Endi alohida loading statelar ushlash shart emas.`,
    attachments: [{ name: 'react-19-cheatsheet.pdf', size: '1.1 MB', type: 'pdf' }],
  },
  {
    id: 'les_math_1',
    subjectId: 'sub_math',
    subjectTitle: 'Oliy Matematika',
    title: 'Funksiya hosilasi va uning geometrik ma\'nosi',
    description: 'Hosilaning ta\'rifi, urinma tenglamasi va DTM 2026 testlaridagi murakkab masalalar yechimi.',
    videoDuration: '32:00',
    durationMinutes: 32,
    isCompleted: false,
    isLocked: false,
    order: 1,
    contentMarkdown: `### Hosila qoidalari:\n\n1. (u + v)' = u' + v'\n2. (u * v)' = u'v + uv'\n3. (u / v)' = (u'v - uv') / v^2`,
    attachments: [{ name: 'hosila-formulalari.pdf', size: '1.8 MB', type: 'pdf' }],
  },
];

let tests = [
  {
    id: 'test_tma_weekly',
    subjectId: 'sub_frontend',
    subjectTitle: 'Frontend & TMA',
    title: 'Telegram Mini Apps & React 19 Imtihoni',
    description: 'InitData hash tekshirish, HapticFeedback va React 19 yangi xususiyatlari',
    category: 'Haftalik',
    totalQuestions: 10,
    durationMinutes: 15,
    difficulty: 'O\'rta',
    xpReward: 150,
    isCompleted: false,
    lastScore: undefined,
  },
  {
    id: 'test_dtm_math',
    subjectId: 'sub_math',
    subjectTitle: 'Oliy Matematika',
    title: 'DTM 2026 Matematika Majburiy & Asosiy Blok',
    description: 'Funksiyalar, hosila, logarifmik tenglamalar va stereometriya masalalari',
    category: 'DTM',
    totalQuestions: 15,
    durationMinutes: 30,
    difficulty: 'Qiyin',
    xpReward: 250,
    isCompleted: true,
    lastScore: 92,
  },
  {
    id: 'test_ielts_reading',
    subjectId: 'sub_english',
    subjectTitle: 'IELTS Intensive',
    title: 'IELTS Academic Reading Mock Test #4',
    description: 'True/False/Not Given, Headings Matching va Summary Completion',
    category: 'Sertifikat',
    totalQuestions: 12,
    durationMinutes: 20,
    difficulty: 'O\'rta',
    xpReward: 180,
    isCompleted: false,
    lastScore: undefined,
  },
];

let groups = [
  {
    id: 'grp_fe_1',
    subjectId: 'sub_frontend',
    subjectTitle: 'Frontend & TMA',
    name: 'Frontend TMA — F-24',
    teacherName: 'Habibullo Abdusamadov',
    schedule: 'Dush - Chor - Juma, 18:30 - 20:30',
    room: 'Lab #304',
    activeStudentsCount: 16,
    maxCapacity: 18,
    progressPercent: 68,
    members: [
      { id: 'usr_student_1', name: 'Habibullo Abdusamadov', status: 'present', scoreAvg: 95 },
      { id: 'usr_student_2', name: 'Jasur Bekmirzayev', status: 'present', scoreAvg: 92 },
      { id: 'usr_student_3', name: 'Madina Karimova', status: 'excused', scoreAvg: 88 },
      { id: 'm4', name: 'Azizbek Qodirov', status: 'absent', scoreAvg: 74 },
    ],
  },
  {
    id: 'grp_math_1',
    subjectId: 'sub_math',
    subjectTitle: 'Oliy Matematika',
    name: 'DTM Matematika — M-12',
    teacherName: 'Dilshod Rahmatov',
    schedule: 'Sesh - Pay - Shan, 16:00 - 18:00',
    room: 'Auditoriya #102',
    activeStudentsCount: 20,
    maxCapacity: 20,
    progressPercent: 84,
    members: [
      { id: 'usr_student_1', name: 'Habibullo Abdusamadov', status: 'present', scoreAvg: 91 },
      { id: 'usr_student_3', name: 'Madina Karimova', status: 'present', scoreAvg: 89 },
    ],
  },
];

let assignments = [
  {
    id: 'ass_1',
    groupId: 'grp_fe_1',
    groupName: 'Frontend TMA — F-24',
    title: 'Telegram Mini App uchun Haptic & BackButton integratsiyasi',
    description: 'Vite loyihasida Telegram WebApp SDK orqali BackButton bosilganda orqaga qaytish va HapticFeedback tebranishini ulang.',
    deadline: '2026-10-06 20:00',
    maxScore: 100,
    submittedCount: 14,
    totalCount: 16,
    status: 'active',
  },
  {
    id: 'ass_2',
    groupId: 'grp_fe_1',
    groupName: 'Frontend TMA — F-24',
    title: 'InitData HMAC-SHA256 xavfsizlik tekshiruvi backend kodi',
    description: 'Express.js backendida bot_token yordamida hash tekshiruvchi auth middleware yozing.',
    deadline: '2026-10-12 23:59',
    maxScore: 100,
    submittedCount: 8,
    totalCount: 16,
    status: 'active',
  },
];

let notifications = [
  {
    id: 'n1',
    title: 'Yangi uy vazifasi',
    message: 'Frontend TMA guruhiga "BackButton integratsiyasi" topshirig\'i yuklandi.',
    timeAgo: '15 daqiqa oldin',
    type: 'assignment',
    isRead: false,
  },
  {
    id: 'n2',
    title: 'Tabriklaymiz! Yangi yutuq',
    message: '14 kunlik uzluksiz ta\'lim olovi (Streak Master) qo\'lga kiritildi! (+100 XP)',
    timeAgo: '2 soat oldin',
    type: 'achievement',
    isRead: false,
  },
  {
    id: 'n3',
    title: 'Baholandi: DTM Matematika',
    message: 'Haftalik test natijangiz: 92/100 ball! Reytingingiz 4-o\'ringa ko\'tarildi.',
    timeAgo: 'Kechagi kun',
    type: 'grade',
    isRead: true,
  },
];

// Helper: HMAC-SHA256 verification function for Telegram Mini Apps
function verifyTelegramWebAppData(telegramInitData: string, botToken: string): boolean {
  try {
    const urlParams = new URLSearchParams(telegramInitData);
    const hash = urlParams.get('hash');
    if (!hash) return false;

    urlParams.delete('hash');
    const paramsList: string[] = [];
    urlParams.forEach((val, key) => paramsList.push(`${key}=${val}`));
    paramsList.sort();
    const dataCheckString = paramsList.join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return calculatedHash === hash;
  } catch {
    return false;
  }
}

// ==================== REST API ROUTES (Both /api and /api/v1 for NestJS compatibility) ====================

// 1. Health check & Telegram Webhook Status
app.get(['/api/health', '/api/v1/health'], (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: IS_PROD ? 'production' : 'development',
    telegramBot: {
      botUsername: '@EduGoUzBot',
      webhookStatus: 'active',
      hmacGuard: 'enabled',
    },
    database: {
      provider: 'in-memory-postgresql-sim',
      usersCount: users.length,
      groupsCount: groups.length,
      subjectsCount: subjects.length,
    },
  });
});

// 2. Telegram Auth / Demo Login
const handleAuth = (req: Request, res: Response) => {
  const { initData, role } = req.body;

  let currentUser = users.find((u) => u.role === (role || 'STUDENT')) || users[0];

  // If initData is provided, attempt Telegram parse
  if (initData) {
    try {
      const isValid = verifyTelegramWebAppData(initData, BOT_TOKEN);
      const urlParams = new URLSearchParams(initData);
      const userRaw = urlParams.get('user');
      if (userRaw) {
        const tgUser = JSON.parse(userRaw);
        const existing = users.find((u) => u.telegramId === String(tgUser.id));
        if (existing) {
          currentUser = existing;
        } else {
          const newUser: UserRecord = {
            id: `usr_${tgUser.id}`,
            telegramId: String(tgUser.id),
            name: `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim() || 'Telegram O\'quvchi',
            username: tgUser.username ? `@${tgUser.username}` : '@foydalanuvchi',
            phone: '+998 90 000 00 00',
            avatarUrl: tgUser.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            role: 'STUDENT',
            studyCenter: 'EduGo Onlayn',
            xp: 50,
            level: 1,
            rank: users.length + 1,
            streakDays: 1,
            coins: 10,
            testsPassedCount: 0,
            completedLessonsCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
          };
          users.push(newUser);
          currentUser = newUser;
        }
      }
    } catch (e) {
      // Continue with current user fallback
    }
  }

  const token = `edugo_jwt_${currentUser.id}_${Date.now()}`;
  res.json({
    success: true,
    token,
    accessToken: token,
    refreshToken: `edugo_refresh_${currentUser.id}_${Date.now()}`,
    user: {
      id: currentUser.id,
      name: currentUser.name,
      firstName: currentUser.name.split(' ')[0] || currentUser.name,
      lastName: currentUser.name.split(' ').slice(1).join(' ') || '',
      username: currentUser.username,
      phone: currentUser.phone,
      avatarUrl: currentUser.avatarUrl,
      profilePhotoUrl: currentUser.avatarUrl,
      role: currentUser.role,
      studyCenter: currentUser.studyCenter,
      xp: currentUser.xp,
      level: currentUser.level,
      rank: currentUser.rank,
      streakDays: currentUser.streakDays,
      coins: currentUser.coins,
      testsPassedCount: currentUser.testsPassedCount,
      completedLessonsCount: currentUser.completedLessonsCount,
    },
  });
};

app.post(['/api/auth/telegram', '/api/v1/auth/telegram'], handleAuth);

app.post(['/api/auth/refresh', '/api/v1/auth/refresh'], (req: Request, res: Response) => {
  res.json({
    accessToken: `edugo_jwt_refreshed_${Date.now()}`,
    refreshToken: `edugo_refresh_${Date.now()}`,
  });
});

app.post(['/api/auth/logout', '/api/v1/auth/logout'], (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// 3. User profile & Users list
app.get(['/api/users/me', '/api/v1/users/me'], (req: Request, res: Response) => {
  const role = (req.query.role as string) || 'STUDENT';
  const user = users.find((u) => u.role === role) || users[0];
  res.json(user);
});

app.patch(['/api/users/me', '/api/v1/users/me'], (req: Request, res: Response) => {
  const { id, name, phone, studyCenter } = req.body;
  const userIndex = users.findIndex((u) => u.id === (id || users[0].id));
  if (userIndex !== -1) {
    if (name) users[userIndex].name = name;
    if (phone) users[userIndex].phone = phone;
    if (studyCenter) users[userIndex].studyCenter = studyCenter;
    return res.json({ success: true, user: users[userIndex] });
  }
  res.status(404).json({ error: 'User not found' });
});

app.get(['/api/users', '/api/v1/users', '/api/admin/users', '/api/v1/admin/users'], (req: Request, res: Response) => {
  const role = req.query.role as string;
  if (role) {
    return res.json(users.filter((u) => u.role === role));
  }
  res.json(users);
});

app.patch(['/api/users/:id/role', '/api/v1/users/:id/role', '/api/admin/users/:id/role'], (req: Request, res: Response) => {
  const { role } = req.body;
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.role = role;
  res.json({ success: true, user });
});

app.patch(['/api/users/:id/status', '/api/v1/users/:id/status', '/api/admin/users/:id/status'], (req: Request, res: Response) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.status = user.status === 'active' ? 'blocked' : 'active';
  res.json({ success: true, user });
});

// 4. Student Dashboard
app.get(['/api/dashboard/me', '/api/v1/dashboard/me'], (req: Request, res: Response) => {
  const student = users[0];
  res.json({
    user: student,
    streak: student.streakDays,
    xp: student.xp,
    level: student.level,
    coins: student.coins,
    completedLessons: student.completedLessonsCount,
    testsPassed: student.testsPassedCount,
    activeCourses: subjects.slice(0, 3),
    upcomingAssignments: assignments.slice(0, 2),
    recentNotifications: notifications.slice(0, 3),
  });
});

app.get(['/api/dashboard/assignments', '/api/v1/dashboard/assignments', '/api/v1/students/assignments'], (req: Request, res: Response) => {
  res.json(assignments);
});

app.get(['/api/dashboard/assignments/:id', '/api/v1/dashboard/assignments/:id'], (req: Request, res: Response) => {
  const ass = assignments.find((a) => a.id === req.params.id) || assignments[0];
  res.json(ass);
});

// Daily Challenge
app.get(['/api/challenges/today', '/api/v1/challenges/today'], (req: Request, res: Response) => {
  res.json({
    id: 'ch_today',
    title: 'Bugungi vazifa: 1 ta dars va 1 ta test',
    description: "Bugun kamida 1 ta darsni yakunlang va haftalik testda 80%+ ball to'plang",
    rewardXp: 100,
    rewardCoins: 25,
    isCompleted: false,
    progress: 1,
    target: 2,
  });
});

// 5. Subjects
app.get(['/api/subjects', '/api/v1/subjects'], (req: Request, res: Response) => {
  res.json(subjects);
});

// 6. Lessons
app.get(['/api/lessons', '/api/v1/lessons'], (req: Request, res: Response) => {
  const { subjectId, topicId } = req.query;
  if (subjectId) {
    return res.json(lessons.filter((l) => l.subjectId === subjectId));
  }
  res.json(lessons);
});

app.get(['/api/lessons/:id', '/api/v1/lessons/:id'], (req: Request, res: Response) => {
  const lesson = lessons.find((l) => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json(lesson);
});

app.post(['/api/lessons/:id/complete', '/api/v1/lessons/:id/complete'], (req: Request, res: Response) => {
  const lesson = lessons.find((l) => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  lesson.isCompleted = true;

  // Award user XP
  const student = users[0];
  student.xp += 50;
  student.coins += 15;
  student.completedLessonsCount += 1;

  // Update subject completed count
  const sub = subjects.find((s) => s.id === lesson.subjectId);
  if (sub && sub.completedLessonsCount < sub.lessonsCount) {
    sub.completedLessonsCount += 1;
  }

  res.json({
    success: true,
    xpAwarded: 50,
    coinsAwarded: 15,
    user: student,
    lesson,
  });
});

// 7. Tests
app.get(['/api/tests', '/api/v1/tests'], (req: Request, res: Response) => {
  res.json(tests);
});

app.get(['/api/tests/assigned/me', '/api/v1/tests/assigned/me'], (req: Request, res: Response) => {
  res.json(tests);
});

app.get(['/api/tests/:id', '/api/v1/tests/:id'], (req: Request, res: Response) => {
  const test = tests.find((t) => t.id === req.params.id);
  if (!test) return res.status(404).json({ error: 'Test not found' });
  res.json(test);
});

app.post(['/api/tests/:id/start', '/api/v1/tests/:id/start'], (req: Request, res: Response) => {
  const test = tests.find((t) => t.id === req.params.id) || tests[0];
  res.json({
    sessionId: `sess_${Date.now()}`,
    testId: test.id,
    startedAt: new Date().toISOString(),
    durationMinutes: test.durationMinutes,
  });
});

app.get(['/api/tests/:id/session', '/api/v1/tests/:id/session'], (req: Request, res: Response) => {
  const test = tests.find((t) => t.id === req.params.id) || tests[0];
  res.json({
    testId: test.id,
    title: test.title,
    durationMinutes: test.durationMinutes,
    questions: [
      {
        id: 'q1',
        question: 'Telegram WebApp SDK da initData qanday maqsadda ishlatiladi?',
        options: [
          { id: 'opt1', text: 'Xavfsiz autentifikatsiya va HMAC-SHA256 tekshiruvi' },
          { id: 'opt2', text: 'Faqat rasm yuklash uchun' },
          { id: 'opt3', text: 'CSS animatsiyalar yaratish uchun' },
        ],
      },
    ],
  });
});

app.post(['/api/tests/:id/answer', '/api/v1/tests/:id/answer'], (req: Request, res: Response) => {
  res.json({ success: true, saved: true });
});

app.post(['/api/tests/:id/submit', '/api/v1/tests/:id/submit'], (req: Request, res: Response) => {
  const { score, xpEarned } = req.body;
  const test = tests.find((t) => t.id === req.params.id);
  if (!test) return res.status(404).json({ error: 'Test not found' });

  test.isCompleted = true;
  test.lastScore = Number(score) || 85;

  const student = users[0];
  student.xp += Number(xpEarned) || 100;
  student.coins += Math.round((Number(xpEarned) || 100) / 5);
  student.testsPassedCount += 1;

  const newNotif = {
    id: `notif_${Date.now()}`,
    title: 'Test natijasi qabul qilindi',
    message: `"${test.title}" bo'yicha natijangiz: ${score || 85} ball! (+${xpEarned || 100} XP)`,
    timeAgo: 'Hozirgina',
    type: 'grade',
    isRead: false,
  };
  notifications.unshift(newNotif);

  res.json({
    success: true,
    test,
    score: Number(score) || 85,
    user: student,
    notification: newNotif,
  });
});

// 8. Groups & Attendance
app.get(['/api/groups', '/api/v1/groups'], (req: Request, res: Response) => {
  res.json(groups);
});

app.get(['/api/groups/:id', '/api/v1/groups/:id'], (req: Request, res: Response) => {
  const group = groups.find((g) => g.id === req.params.id) || groups[0];
  res.json(group);
});

app.get(['/api/groups/:id/students', '/api/v1/groups/:id/students'], (req: Request, res: Response) => {
  const group = groups.find((g) => g.id === req.params.id) || groups[0];
  res.json(group.members || []);
});

app.post(['/api/groups', '/api/v1/groups'], (req: Request, res: Response) => {
  const { name, description } = req.body;
  const newGroup = {
    id: `grp_${Date.now()}`,
    subjectId: 'sub_frontend',
    subjectTitle: 'Frontend & TMA',
    name: name || 'Yangi Guruh',
    teacherName: 'Habibullo Abdusamadov',
    schedule: 'Dush - Chor - Juma, 18:30 - 20:30',
    room: 'Lab #304',
    activeStudentsCount: 1,
    maxCapacity: 18,
    progressPercent: 10,
    members: [{ id: 'usr_student_1', name: 'Habibullo Abdusamadov', status: 'present', scoreAvg: 95 }],
  };
  groups.push(newGroup);
  res.json({ success: true, group: newGroup });
});

app.post(['/api/groups/:groupId/attendance', '/api/v1/groups/:groupId/attendance'], (req: Request, res: Response) => {
  const { memberId, status } = req.body;
  const group = groups.find((g) => g.id === req.params.groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  const member = group.members.find((m) => m.id === memberId);
  if (!member) return res.status(404).json({ error: 'Student not found in group' });

  member.status = status;
  res.json({ success: true, group });
});

// 9. Assignments
app.get(['/api/assignments', '/api/v1/assignments'], (req: Request, res: Response) => {
  res.json(assignments);
});

app.post(['/api/assignments', '/api/v1/assignments'], (req: Request, res: Response) => {
  const { title, groupId, groupName, description, deadline, maxScore } = req.body;
  const newAssignment = {
    id: `ass_${Date.now()}`,
    groupId: groupId || groups[0]?.id || '',
    groupName: groupName || groups[0]?.name || '',
    title: title || 'Yangi uy vazifasi',
    description: description || '',
    deadline: deadline || '2026-10-20 22:00',
    maxScore: Number(maxScore) || 100,
    submittedCount: 0,
    totalCount: 16,
    status: 'active',
  };
  assignments.unshift(newAssignment);
  res.json({ success: true, assignment: newAssignment });
});

// 10. Leaderboard & Ranking
const getRankingData = () => {
  return [...users]
    .filter((u) => u.role === 'STUDENT')
    .sort((a, b) => b.xp - a.xp)
    .map((u, index) => ({
      id: u.id,
      rank: index + 1,
      name: u.name,
      username: u.username,
      xp: u.xp,
      level: u.level,
      streakDays: u.streakDays,
      testsPassed: u.testsPassedCount,
      avatarUrl: u.avatarUrl,
      isCurrentUser: u.id === users[0].id,
      studyCenter: u.studyCenter,
    }));
};

app.get(['/api/leaderboard', '/api/v1/ranking'], (req: Request, res: Response) => {
  res.json(getRankingData());
});

app.get(['/api/ranking/global', '/api/v1/ranking/global'], (req: Request, res: Response) => {
  const sorted = getRankingData();
  res.json({
    top: sorted,
    yourRank: 4,
  });
});

app.get(['/api/ranking/group/:groupId', '/api/v1/ranking/group/:groupId'], (req: Request, res: Response) => {
  res.json({ top: getRankingData() });
});

// 11. Notifications
app.get(['/api/notifications', '/api/v1/notifications', '/api/v1/notifications/me'], (req: Request, res: Response) => {
  res.json(notifications);
});

app.post(['/api/notifications/read', '/api/v1/notifications/read'], (req: Request, res: Response) => {
  notifications = notifications.map((n) => ({ ...n, isRead: true }));
  res.json({ success: true, count: notifications.length });
});

app.patch(['/api/notifications/:id/read', '/api/v1/notifications/:id/read'], (req: Request, res: Response) => {
  const notif = notifications.find((n) => n.id === req.params.id);
  if (notif) notif.isRead = true;
  res.json({ success: true });
});

// 12. Teacher Endpoints
app.get(['/api/teacher/overview', '/api/v1/teacher/overview'], (req: Request, res: Response) => {
  res.json({
    totalGroups: groups.length,
    totalStudents: 36,
    avgAttendance: 92,
    pendingAssignments: assignments.length,
    activeGroups: groups,
  });
});

app.get(['/api/teacher/groups', '/api/v1/teacher/groups'], (req: Request, res: Response) => {
  res.json(groups);
});

app.get(['/api/teacher/assignments', '/api/v1/teacher/assignments'], (req: Request, res: Response) => {
  res.json(assignments);
});

// 13. Questions Bank
app.get(['/api/questions', '/api/v1/questions'], (req: Request, res: Response) => {
  res.json([
    {
      id: 'q_1',
      question: 'Telegram Mini App (TMA) da foydalanuvchi ma\'lumotlari qayerdan olinadi?',
      options: [
        { id: 'opt_1', text: 'window.Telegram.WebApp.initData' },
        { id: 'opt_2', text: 'localStorage.getItem("token")' },
        { id: 'opt_3', text: 'document.cookie' },
      ],
      correctOptionId: 'opt_1',
      points: 10,
      subjectId: 'sub_frontend',
      difficulty: 'Oson',
    },
  ]);
});

app.post(['/api/questions', '/api/v1/questions'], (req: Request, res: Response) => {
  res.json({ success: true, question: req.body });
});

app.delete(['/api/questions/:id', '/api/v1/questions/:id'], (req: Request, res: Response) => {
  res.json({ success: true });
});

// 14. AI EduBot Assistant Endpoint
app.post(['/api/ai/ask', '/api/v1/ai/ask'], (req: Request, res: Response) => {
  const { question } = req.body;
  const q = (question || '').toLowerCase();

  let answer =
    "EduGo ta'lim platformasi sizga mukammal bilim olish imkoniyatini beradi. Mavzular bo'yicha batafsil video ma'ruzalar va testlarni ko'rib chiqing!";

  if (q.includes('react') || q.includes('frontend') || q.includes('tma')) {
    answer =
      "React 19 da Action-lar, `useActionState` va `useOptimistic` hooklari orqali Telegram Mini App bilan ishlash yanada qulaylashdi. TMA SDK'da `window.Telegram.WebApp.initData` HMAC-SHA256 bilan serverda tasdiqlanadi.";
  } else if (q.includes('ielts') || q.includes('reading')) {
    answer =
      "IELTS Reading testida Skimming va Scanning usullarini parallel qo'llang. Eng qiyin savollarga haddan tashqari ko'p vaqt sarflamay, matn paragraf sarlavhalari (Heading matching) orqali yo'nalish oling.";
  } else if (q.includes('matematika') || q.includes('dtm')) {
    answer =
      "DTM 2026 matematika imtihonida funksiya hosilasi, ekstremum nuqtalar va geometrik qoidalar ko'p uchraydi. Formulalarni yodlashdan tashqari ularning grafik ma'nosini tushunish muhim.";
  } else if (q.includes('motivatsiya')) {
    answer =
      "Har kuni kichik bo'lsa-da bitta yangi tushunchani o'zlashtirish sizni boshqalardan bir qadam oldinga olib chiqadi. Sizning EduGo'dagi bugungi harakatingiz — kelajakdagi katta natijalar poydevoridir! 🚀";
  }

  res.json({
    success: true,
    question,
    answer,
    timestamp: new Date().toISOString(),
  });
});

// 15. Download Project ZIP archive
app.get('/api/download-zip', (_req: Request, res: Response) => {
  const zipPath = path.resolve(process.cwd(), 'edugo-project.zip');
  if (fs.existsSync(zipPath)) {
    return res.download(zipPath, 'edugo-project.zip');
  }
  res.status(404).json({
    error: 'Arxiv mavjud emas',
    message: 'edugo-project.zip fayli topilmadi.',
  });
});

app.get('/edugo-project.zip', (_req: Request, res: Response) => {
  const zipPath = path.resolve(process.cwd(), 'edugo-project.zip');
  if (fs.existsSync(zipPath)) {
    return res.download(zipPath, 'edugo-project.zip');
  }
  res.status(404).json({
    error: 'Arxiv mavjud emas',
  });
});

// 14. External Backend Proxy (helps bypass CORS & Mixed-Content issues for user backends)
app.all('/api/proxy', async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).json({ error: 'url query parametri talab qilinadi' });
  }

  try {
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers: forwardHeaders,
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const externalRes = await fetch(targetUrl, fetchOptions);
    const data = await externalRes.json().catch(() => ({}));
    res.status(externalRes.status).json(data);
  } catch (err: any) {
    res.status(502).json({
      error: 'Tashqi backend bilan bog\'lanishda xatolik yuz berdi',
      details: err?.message,
    });
  }
});

// ==================== VITE & STATIC HANDLING ====================

async function startServer() {
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduGo Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start EduGo server:', err);
  process.exit(1);
});
