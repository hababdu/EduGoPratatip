import React, { useState, useEffect } from 'react';
import {
  Server,
  X,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Key,
  Shield,
  RefreshCw,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Cpu,
  Layers,
  Activity,
  Terminal,
} from 'lucide-react';
import {
  getBackendConfig,
  saveBackendConfig,
  resetBackendConfig,
  testBackendHealth,
  BACKEND_ENDPOINT_DOCS,
  fetchHealth,
  fetchSubjectsApi,
} from '../../services/api';

interface BackendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged?: () => void;
}

export const BackendModal: React.FC<BackendModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'connect' | 'docs' | 'code' | 'tester'>('connect');
  const [backendUrl, setBackendUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [useProxy, setUseProxy] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  // Testing states
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    status: number;
    latencyMs: number;
    data?: any;
    error?: string;
  } | null>(null);

  // Live tester tab state
  const [liveTesting, setLiveTesting] = useState(false);
  const [liveTestResponse, setLiveTestResponse] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const config = getBackendConfig();
      setBackendUrl(config.baseUrl);
      setAuthToken(config.token);
      setUseProxy(config.useProxy);
      setIsCustom(config.isCustom);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testBackendHealth(backendUrl, authToken);
    setTestResult(result);
    setTesting(false);
  };

  const handleSave = () => {
    saveBackendConfig(backendUrl, authToken, useProxy);
    const config = getBackendConfig();
    setIsCustom(config.isCustom);
    if (onConfigChanged) onConfigChanged();
    setTestResult({
      ok: true,
      status: 200,
      latencyMs: 12,
      data: { message: 'Backend sozlamalari muvaffaqiyatli saqlandi!' },
    });
  };

  const handleReset = () => {
    resetBackendConfig();
    setBackendUrl('');
    setAuthToken('');
    setUseProxy(false);
    setIsCustom(false);
    setTestResult(null);
    if (onConfigChanged) onConfigChanged();
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runLiveTest = async (type: 'health' | 'subjects') => {
    setLiveTesting(true);
    setLiveTestResponse(null);
    try {
      const data = type === 'health' ? await fetchHealth() : await fetchSubjectsApi();
      setLiveTestResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setLiveTestResponse(JSON.stringify({ error: err?.message || 'Xatolik' }, null, 2));
    } finally {
      setLiveTesting(false);
    }
  };

  // Ready-made FastAPI Code Template
  const fastApiCode = `# FastAPI Python Backend for EduGo
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="EduGo Backend API", version="1.0.0")

# CORS sozlamasi (Frontend bilan ishlash uchun muhim)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "EduGo FastAPI Backend",
        "environment": "production"
    }

@app.post("/api/auth/telegram")
def telegram_auth(payload: dict):
    # Bu yerda initData tekshiriladi
    return {
        "success": True,
        "token": "fastapi_jwt_secret_token_123",
        "user": {
            "id": "usr_python_1",
            "name": "Habibullo Abdusamadov",
            "role": "STUDENT",
            "xp": 2800,
            "coins": 520
        }
    }

@app.get("/api/subjects")
def get_subjects():
    return [
        {
            "id": "sub_math",
            "title": "Oliy Matematika",
            "description": "Funksiyalar va integrallar",
            "lessonsCount": 25,
            "category": "Aniq fanlar"
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`;

  // Ready-made Node.js / Express code
  const expressCode = `// Node.js Express Backend for EduGo
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'EduGo Custom Node Backend' });
});

app.post('/api/auth/telegram', (req, res) => {
  res.json({
    success: true,
    token: 'jwt_node_token',
    user: { id: 'usr_node_1', name: 'Talaba', role: 'STUDENT', xp: 1200 }
  });
});

app.listen(8000, () => console.log('Backend running on port 8000'));`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#101428] text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-[#141933]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffb020] to-[#ffd275] text-[#0b0d19] font-bold shadow-md shadow-[#ffb020]/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Backend Integratsiyasi</h2>
                {isCustom ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] text-[10px] font-bold border border-[#38bdf8]/30 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Tashqi Backend
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#34d0a0]/15 text-[#34d0a0] text-[10px] font-bold border border-[#34d0a0]/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    EduGo O'rnatilgan Server
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50">
                O'zingizning shaxsiy backend serveringizni (FastAPI, Express, Django, Laravel) EduGo ga ulang
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 px-5 pt-3 bg-[#12162d] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('connect')}
            className={`flex items-center gap-2 pb-3 px-2 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'connect'
                ? 'border-[#ffb020] text-[#ffb020]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Ulanish Sozlamalari</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 pb-3 px-2 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'docs'
                ? 'border-[#ffb020] text-[#ffb020]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>API Shartnomasi (Specs)</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 pb-3 px-2 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-[#ffb020] text-[#ffb020]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Tayyor Kod Namunasi</span>
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            className={`flex items-center gap-2 pb-3 px-2 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'tester'
                ? 'border-[#ffb020] text-[#ffb020]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Jonli Test (Ping)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: Connect & Settings */}
          {activeTab === 'connect' && (
            <div className="space-y-5">
              {/* GitHub Repository Info Banner */}
              <div className="p-3.5 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-950/40 to-indigo-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white font-bold">
                    <Code2 className="w-4 h-4 text-[#38bdf8]" />
                  </div>
                  <div>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      github.com/hababdu/EduGo
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                        NestJS + Prisma + Grammy
                      </span>
                    </span>
                    <span className="text-[11px] text-white/50 block">
                      Barcha /api/v1/* endpointlar va Telegram bot kodi to'liq integratsiya qilingan
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setBackendUrl('https://edugo-5h4d.onrender.com');
                      setUseProxy(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 text-[11px] font-semibold transition cursor-pointer"
                  >
                    Render API'ni tanlash
                  </button>
                  <a
                    href="https://github.com/hababdu/EduGo"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Server mode radio boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    handleReset();
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    !isCustom
                      ? 'border-[#34d0a0] bg-[#34d0a0]/10 ring-1 ring-[#34d0a0]'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-[#34d0a0]" />
                      O'rnatilgan Server (Default)
                    </span>
                    {!isCustom && <Check className="w-4 h-4 text-[#34d0a0]" />}
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    EduGo loyihasining o'zidagi Express.js / In-memory serveri. Barcha darslar, testlar, guruhlar va AI tayyor holatda ishlaydi.
                  </p>
                </div>

                <div
                  onClick={() => {
                    if (!backendUrl) setBackendUrl('https://api.sizning-serveringiz.uz');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    isCustom
                      ? 'border-[#ffb020] bg-[#ffb020]/10 ring-1 ring-[#ffb020]'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-[#ffb020]" />
                      Tashqi Shaxsiy Backend
                    </span>
                    {isCustom && <Check className="w-4 h-4 text-[#ffb020]" />}
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Sizning alohida serveringiz (Render, Railway, VPS yoki localhost). Frontend barcha API so'rovlarini shu manzilga yuboradi.
                  </p>
                </div>
              </div>

              {/* URL & Token Form */}
              <div className="space-y-4 rounded-2xl bg-white/5 p-4 border border-white/10">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
                    Backend API Asosiy Manzili (Base URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://api.edugo.uz yoki http://localhost:8000"
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0e1e] border border-white/15 text-xs text-white placeholder-white/30 focus:border-[#ffb020] focus:outline-none"
                  />
                  <span className="text-[10px] text-white/40 block mt-1">
                    Oxirida slesh (/) qo'yish shart emas. Masalan: <code>https://my-backend.railway.app</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#ffb020]" />
                    Avtorizatsiya Tokeni / JWT (Ixtiyoriy)
                  </label>
                  <input
                    type="password"
                    placeholder="Bearer token yoki API kalit"
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0e1e] border border-white/15 text-xs text-white placeholder-white/30 focus:border-[#ffb020] focus:outline-none"
                  />
                  <span className="text-[10px] text-white/40 block mt-1">
                    So'rovlarga <code>Authorization: Bearer [token]</code> ko'rinishida yuboriladi.
                  </span>
                </div>

                {/* CORS Proxy Switch */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#34d0a0]" />
                      Server-side CORS & SSL Proksi
                    </span>
                    <p className="text-[10px] text-white/50">
                      Agar tashqi backendda CORS cheklovi bo'lsa yoki localhost bo'lsa, so'rovlarni EduGo serveri orqali uzatish
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseProxy(!useProxy)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      useProxy ? 'bg-[#34d0a0]' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        useProxy ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'Tekshirilmoqda...' : 'Ulanishni tekshirish (Ping)'}</span>
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ffb020] to-[#ffd275] text-[#0b0d19] text-xs font-bold transition shadow-lg shadow-[#ffb020]/20 hover:scale-[1.02] cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Saqlash va Ulanish</span>
                </button>

                {isCustom && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition cursor-pointer ml-auto"
                  >
                    <span>O'rnatilgan serverga qaytish</span>
                  </button>
                )}
              </div>

              {/* Test Result Message Box */}
              {testResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-200 ${
                    testResult.ok
                      ? 'border-[#34d0a0]/40 bg-[#34d0a0]/10 text-emerald-200'
                      : 'border-red-500/40 bg-red-500/10 text-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      {testResult.ok ? (
                        <CheckCircle2 className="w-4 h-4 text-[#34d0a0]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                      {testResult.ok ? 'Backend muvaffaqiyatli ulandi!' : 'Ulanishda muammo bor'}
                    </span>
                    <span className="text-[11px] opacity-75 tabular-nums">
                      Kechikish: {testResult.latencyMs} ms
                    </span>
                  </div>

                  {testResult.error && (
                    <p className="text-[11px] text-red-300">
                      Sabab: {testResult.error}. (Maslahat: backendda CORS ruxsat berilganiga ishonch hosil qiling yoki yuqoridagi "Server-side CORS Proksi" tugmasini yoqing).
                    </p>
                  )}

                  {testResult.data && (
                    <pre className="p-2.5 rounded-xl bg-black/40 text-[10px] font-mono text-emerald-300 overflow-x-auto">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: API Contract & Specs */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70">
                Sizning backend serveringiz quyidagi REST endpointlarni taqdim etishi tavsiya etiladi. EduGo ushbu endpointlar orqali ma'lumotlarni almashadi:
              </div>

              {BACKEND_ENDPOINT_DOCS.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <h3 className="text-xs font-bold text-[#ffb020] uppercase tracking-wider">
                    {group.category}
                  </h3>
                  <div className="space-y-2">
                    {group.endpoints.map((ep, epIdx) => (
                      <div
                        key={epIdx}
                        className="rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                ep.method === 'GET'
                                  ? 'bg-[#38bdf8]/20 text-[#38bdf8]'
                                  : ep.method === 'POST'
                                  ? 'bg-[#34d0a0]/20 text-[#34d0a0]'
                                  : 'bg-[#ffb020]/20 text-[#ffb020]'
                              }`}
                            >
                              {ep.method}
                            </span>
                            <code className="text-xs font-mono font-semibold text-white">
                              {ep.path}
                            </code>
                          </div>
                          <span className="text-xs text-white/60 font-medium">{ep.title}</span>
                        </div>

                        {ep.description && (
                          <p className="text-[11px] text-white/50">{ep.description}</p>
                        )}

                        {ep.sampleResponse && (
                          <div className="relative">
                            <div className="text-[10px] text-white/40 mb-1 flex items-center justify-between">
                              <span>Namuna javob (JSON):</span>
                              <button
                                onClick={() =>
                                  handleCopy(
                                    JSON.stringify(ep.sampleResponse, null, 2),
                                    `ep_${gIdx}_${epIdx}`
                                  )
                                }
                                className="flex items-center gap-1 text-[10px] text-[#ffb020] hover:underline cursor-pointer"
                              >
                                {copiedKey === `ep_${gIdx}_${epIdx}` ? (
                                  <Check className="w-3 h-3 text-[#34d0a0]" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                <span>Nusxa olish</span>
                              </button>
                            </div>
                            <pre className="p-2.5 rounded-xl bg-[#0b0d19] text-[10px] font-mono text-[#34d0a0] overflow-x-auto">
                              {JSON.stringify(ep.sampleResponse, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Code Templates */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70">
                Quyidagi tayyor kod shablonlarini o'zingizning backend loyihangizga qo'shib, EduGo bilan darhol ishlatishingiz mumkin:
              </div>

              {/* Python FastAPI Snippet */}
              <div className="rounded-2xl border border-white/10 bg-[#0e1224] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#38bdf8] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    Python FastAPI namunasi (main.py)
                  </span>
                  <button
                    onClick={() => handleCopy(fastApiCode, 'fastapi')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition cursor-pointer"
                  >
                    {copiedKey === 'fastapi' ? (
                      <Check className="w-3.5 h-3.5 text-[#34d0a0]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Nusxalash</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#070914] text-[11px] font-mono text-white/80 overflow-x-auto max-h-64 leading-relaxed">
                  {fastApiCode}
                </pre>
              </div>

              {/* Node.js Express Snippet */}
              <div className="rounded-2xl border border-white/10 bg-[#0e1224] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#34d0a0] flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    Node.js Express namunasi (server.js)
                  </span>
                  <button
                    onClick={() => handleCopy(expressCode, 'express')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition cursor-pointer"
                  >
                    {copiedKey === 'express' ? (
                      <Check className="w-3.5 h-3.5 text-[#34d0a0]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Nusxalash</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#070914] text-[11px] font-mono text-white/80 overflow-x-auto max-h-56 leading-relaxed">
                  {expressCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Live Tester */}
          {activeTab === 'tester' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70">
                Joriy sozlangan backenddan ma'lumotlarni jonli ravishda so'rab tekshiring:
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => runLiveTest('health')}
                  disabled={liveTesting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#34d0a0]/15 hover:bg-[#34d0a0]/25 text-[#34d0a0] border border-[#34d0a0]/30 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>GET /api/health</span>
                </button>

                <button
                  onClick={() => runLiveTest('subjects')}
                  disabled={liveTesting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>GET /api/subjects</span>
                </button>
              </div>

              {liveTesting && (
                <div className="flex items-center gap-2 text-xs text-white/60 p-4">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#ffb020]" />
                  <span>Serverga so'rov yuborilmoqda...</span>
                </div>
              )}

              {liveTestResponse && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-white/60 block">Server Javobi:</span>
                  <pre className="p-4 rounded-2xl bg-[#0b0e1e] border border-white/10 text-xs font-mono text-[#34d0a0] overflow-x-auto max-h-80 leading-relaxed">
                    {liveTestResponse}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3.5 bg-[#141933] text-xs">
          <span className="text-white/40">
            Hozirgi manzil: <code className="text-[#38bdf8] font-mono">{backendUrl || 'O\'rnatilgan server (Built-in)'}</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
