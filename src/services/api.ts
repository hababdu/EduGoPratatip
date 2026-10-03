// Client service communicating with Express backend or user's custom external backend

export interface BackendConfig {
  baseUrl: string;
  token: string;
  isCustom: boolean;
  useProxy: boolean;
}

const STORAGE_KEY_URL = 'edugo_backend_url';
const STORAGE_KEY_TOKEN = 'edugo_backend_token';
const STORAGE_KEY_PROXY = 'edugo_backend_proxy';

export function getBackendConfig(): BackendConfig {
  if (typeof window === 'undefined') {
    return { baseUrl: '', token: '', isCustom: false, useProxy: false };
  }
  const customUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
  const token = localStorage.getItem(STORAGE_KEY_TOKEN) || '';
  const useProxy = localStorage.getItem(STORAGE_KEY_PROXY) === 'true';
  const envUrl = (import.meta.env.VITE_BACKEND_API_URL as string) || '';

  const activeUrl = customUrl || envUrl || '';

  return {
    baseUrl: activeUrl.replace(/\/+$/, ''),
    token,
    isCustom: !!activeUrl,
    useProxy,
  };
}

export function saveBackendConfig(baseUrl: string, token: string = '', useProxy: boolean = false): void {
  const cleanUrl = baseUrl.trim().replace(/\/+$/, '');
  if (cleanUrl) {
    localStorage.setItem(STORAGE_KEY_URL, cleanUrl);
  } else {
    localStorage.removeItem(STORAGE_KEY_URL);
  }

  if (token.trim()) {
    localStorage.setItem(STORAGE_KEY_TOKEN, token.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }

  localStorage.setItem(STORAGE_KEY_PROXY, useProxy ? 'true' : 'false');
}

export function resetBackendConfig(): void {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  localStorage.removeItem(STORAGE_KEY_PROXY);
}

export function resolveApiUrl(path: string): string {
  const config = getBackendConfig();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If using local built-in server
  if (!config.baseUrl) {
    return cleanPath;
  }

  // If external backend configured
  const fullTargetUrl = `${config.baseUrl}${cleanPath}`;
  if (config.useProxy) {
    // Route through local Express proxy to bypass CORS / Mixed Content
    return `/api/proxy?url=${encodeURIComponent(fullTargetUrl)}`;
  }

  return fullTargetUrl;
}

export function getRequestHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const config = getBackendConfig();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (config.token) {
    headers['Authorization'] = `Bearer ${config.token}`;
  }

  return headers;
}

// Test health of any candidate backend URL
export async function testBackendHealth(candidateUrl?: string, token?: string) {
  const urlToTest = (candidateUrl || getBackendConfig().baseUrl || '').replace(/\/+$/, '');
  const start = performance.now();

  try {
    const target = urlToTest ? `${urlToTest}/api/health` : '/api/health';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(target, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(6000),
    });

    const latencyMs = Math.round(performance.now() - start);
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        latencyMs,
        error: `Server javobi xato berdi: HTTP ${res.status}`,
      };
    }

    const data = await res.json().catch(() => ({}));
    return {
      ok: true,
      status: res.status,
      latencyMs,
      data,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      ok: false,
      status: 0,
      latencyMs,
      error: err?.message || 'Serverga ulanib bo\'lmadi (CORS yoki tarmoq xatosi)',
    };
  }
}

// ================= API CALLS =================

export async function fetchHealth() {
  try {
    const res = await fetch(resolveApiUrl('/api/health'), {
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function telegramAuth(initData?: string, role?: string) {
  try {
    const res = await fetch(resolveApiUrl('/api/auth/telegram'), {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify({ initData, role }),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchSubjectsApi() {
  try {
    const res = await fetch(resolveApiUrl('/api/subjects'), {
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchLessonsApi(subjectId?: string) {
  try {
    const query = subjectId ? `?subjectId=${encodeURIComponent(subjectId)}` : '';
    const res = await fetch(resolveApiUrl(`/api/lessons${query}`), {
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function completeLessonApi(lessonId: string) {
  try {
    const res = await fetch(resolveApiUrl(`/api/lessons/${lessonId}/complete`), {
      method: 'POST',
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchTestsApi() {
  try {
    const res = await fetch(resolveApiUrl('/api/tests'), {
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function submitTestApi(testId: string, score: number, xpEarned: number) {
  try {
    const res = await fetch(resolveApiUrl(`/api/tests/${testId}/submit`), {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify({ score, xpEarned }),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchGroupsApi() {
  try {
    const res = await fetch(resolveApiUrl('/api/groups'), {
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function markAttendanceApi(groupId: string, memberId: string, status: string) {
  try {
    const res = await fetch(resolveApiUrl(`/api/groups/${groupId}/attendance`), {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify({ memberId, status }),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAssignmentsApi() {
  try {
    const res = await fetch(resolveApiUrl('/api/assignments'), {
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function createAssignmentApi(assignmentData: any) {
  try {
    const res = await fetch(resolveApiUrl('/api/assignments'), {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify(assignmentData),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchLeaderboardApi() {
  try {
    const res = await fetch(resolveApiUrl('/api/leaderboard'), {
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchNotificationsApi() {
  try {
    const res = await fetch(resolveApiUrl('/api/notifications'), {
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function markNotificationsReadApi() {
  try {
    const res = await fetch(resolveApiUrl('/api/notifications/read'), {
      method: 'POST',
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAdminUsersApi() {
  try {
    const res = await fetch(resolveApiUrl('/api/admin/users'), {
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function updateUserRoleApi(userId: string, role: string) {
  try {
    const res = await fetch(resolveApiUrl(`/api/admin/users/${userId}/role`), {
      method: 'PATCH',
      headers: getRequestHeaders(),
      body: JSON.stringify({ role }),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function toggleUserStatusApi(userId: string) {
  try {
    const res = await fetch(resolveApiUrl(`/api/admin/users/${userId}/status`), {
      method: 'PATCH',
      headers: getRequestHeaders(),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function askAiApi(question: string) {
  try {
    const res = await fetch(resolveApiUrl('/api/ai/ask'), {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify({ question }),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

// Contract definitions for external backends
export interface EndpointDoc {
  method: string;
  path: string;
  title: string;
  description?: string;
  sampleRequest?: any;
  sampleResponse?: any;
}

export interface EndpointGroup {
  category: string;
  endpoints: EndpointDoc[];
}

export const BACKEND_ENDPOINT_DOCS: EndpointGroup[] = [
  {
    category: 'Avtorizatsiya & Holat',
    endpoints: [
      {
        method: 'GET',
        path: '/api/health',
        title: 'Server holati & Ping',
        description: 'Server ishlayotganini va baza ulanishini tekshirish uchun.',
        sampleResponse: {
          status: 'ok',
          environment: 'production',
          timestamp: '2026-10-02T12:00:00.000Z',
        },
      },
      {
        method: 'POST',
        path: '/api/auth/telegram',
        title: 'Telegram Mini App Auth',
        description: 'Telegram initData yoki rolni qabul qilib, JWT token va foydalanuvchi obyektini qaytaradi.',
        sampleRequest: {
          initData: 'query_id=AA...&user=%7B%22id%22%3A984512301...%7D&hash=...',
          role: 'STUDENT',
        },
        sampleResponse: {
          success: true,
          token: 'edugo_jwt_usr_12345',
          user: {
            id: 'usr_student_1',
            name: 'Habibullo Abdusamadov',
            role: 'STUDENT',
            xp: 2450,
          },
        },
      },
      {
        method: 'GET',
        path: '/api/users/me',
        title: 'Joriy foydalanuvchi profili',
        description: 'Kirgan foydalanuvchining to\'liq ma\'lumotlarini olish.',
      },
    ],
  },
  {
    category: 'Darslar & Testlar',
    endpoints: [
      {
        method: 'GET',
        path: '/api/subjects',
        title: 'Fanlar va Kurslar ro\'yxati',
        description: 'Platformadagi mavjud kurslar, kategoriyalar va darslar soni.',
      },
      {
        method: 'GET',
        path: '/api/lessons?subjectId=...',
        title: 'Darslar ro\'yxati',
        description: 'Mavzular, video davomiyligi, markdown konspekti va fayllar.',
      },
      {
        method: 'POST',
        path: '/api/lessons/:id/complete',
        title: 'Darsni tugatish',
        description: 'Darsni tamomlash, XP va tangalar berish.',
        sampleResponse: {
          success: true,
          xpAwarded: 50,
          coinsAwarded: 15,
        },
      },
      {
        method: 'GET',
        path: '/api/tests',
        title: 'Testlar ro\'yxati',
        description: 'Haftalik, DTM va sertifikat sinov testlari.',
      },
      {
        method: 'POST',
        path: '/api/tests/:id/submit',
        title: 'Test javoblarini topshirish',
        sampleRequest: { score: 85, xpEarned: 180 },
        sampleResponse: { success: true, score: 85 },
      },
    ],
  },
  {
    category: 'Guruhlar & Topshiriqlar',
    endpoints: [
      {
        method: 'GET',
        path: '/api/groups',
        title: 'Guruhlar ro\'yxati',
        description: 'Guruhlar, dars jadvali, xona va talabalar ro\'yxati.',
      },
      {
        method: 'POST',
        path: '/api/groups/:groupId/attendance',
        title: 'Davomatni belgilash',
        sampleRequest: { memberId: 'usr_student_1', status: 'present' },
      },
      {
        method: 'GET',
        path: '/api/assignments',
        title: 'Uy vazifalari',
        description: 'Topshiriqlar, muddat (deadline) va ballar.',
      },
      {
        method: 'POST',
        path: '/api/assignments',
        title: 'Yangi vazifa yaratish',
        sampleRequest: {
          title: 'Telegram Mini App topshirig\'i',
          deadline: '2026-10-15 20:00',
          maxScore: 100,
        },
      },
      {
        method: 'GET',
        path: '/api/leaderboard',
        title: 'Liderlar reytingi',
      },
      {
        method: 'GET',
        path: '/api/notifications',
        title: 'Bildirishnomalar',
      },
    ],
  },
];
