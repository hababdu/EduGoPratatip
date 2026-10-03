import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  BookOpen,
  Zap,
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Subject } from '../../types';

interface StudentProgressChartProps {
  subjects: Subject[];
}

const MONTHLY_PROGRESS_DATA = [
  { month: 'May', xp: 620, lessons: 5, completionRate: 64 },
  { month: 'Iyun', xp: 840, lessons: 8, completionRate: 71 },
  { month: 'Iyul', xp: 1120, lessons: 11, completionRate: 78 },
  { month: 'Avgust', xp: 1450, lessons: 15, completionRate: 83 },
  { month: 'Sentyabr', xp: 1980, lessons: 22, completionRate: 89 },
  { month: 'Oktyabr', xp: 2450, lessons: 28, completionRate: 94 },
];

export const StudentProgressChart: React.FC<StudentProgressChartProps> = ({ subjects }) => {
  const [chartView, setChartView] = useState<'monthly' | 'subjects'>('monthly');

  // Prepare subjects completion data
  const subjectProgressData = subjects.map((sub) => {
    const rate = Math.round((sub.completedLessonsCount / sub.lessonsCount) * 100);
    return {
      name: sub.title.split(' ')[0], // short title
      fullName: sub.title,
      completed: sub.completedLessonsCount,
      total: sub.lessonsCount,
      rate: rate,
      color: sub.color,
    };
  });

  return (
    <div className="rounded-3xl border border-white/10 bg-[#12162a] p-5 sm:p-6 space-y-5 shadow-xl">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#ffb020]/15 text-[#ffb020]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              O'quv Taraqqiyoti & Natijalar Statistikasi
            </h3>
          </div>
          <p className="text-xs text-white/50">
            Recharts vizualizatsiyasi orqali oylik dinamika va darslarni o'zlashtirish sur'ati
          </p>
        </div>

        {/* View Toggle (Monthly vs Subjects) */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setChartView('monthly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              chartView === 'monthly'
                ? 'bg-[#ffb020] text-[#0b0d19] shadow-md shadow-[#ffb020]/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Oylik Dinamika</span>
          </button>
          <button
            onClick={() => setChartView('subjects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              chartView === 'subjects'
                ? 'bg-[#ffb020] text-[#0b0d19] shadow-md shadow-[#ffb020]/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Fanlar Bo'yicha</span>
          </button>
        </div>
      </div>

      {/* Numerical KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-white/50">
            <span>Oylik O'sish</span>
            <Zap className="w-3.5 h-3.5 text-[#ffb020]" />
          </div>
          <div className="text-lg font-bold text-white tabular-nums">+470 XP</div>
          <div className="text-[10px] text-[#34d0a0] font-semibold flex items-center gap-1">
            <span>↑ 24% o'tgan oyga nisbatan</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-white/50">
            <span>O'zlashtirish Darajasi</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#34d0a0]" />
          </div>
          <div className="text-lg font-bold text-white tabular-nums">94.0%</div>
          <div className="text-[10px] text-white/40">Imtihon topshirish me'yori</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-white/50">
            <span>Tugallangan Darslar</span>
            <BookOpen className="w-3.5 h-3.5 text-[#38bdf8]" />
          </div>
          <div className="text-lg font-bold text-white tabular-nums">28 / 32</div>
          <div className="text-[10px] text-[#38bdf8]">Jami 87.5% qamrov</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-white/50">
            <span>Faol O'qish Vaqti</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-white tabular-nums">34.5 soat</div>
          <div className="text-[10px] text-[#ffb020]">Oy bo'yicha muntazam</div>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="w-full h-64 sm:h-72 pt-3">
        {chartView === 'monthly' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_PROGRESS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb020" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ffb020" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d0a0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34d0a0" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />

              <XAxis
                dataKey="month"
                stroke="#6c7293"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              />

              <YAxis
                stroke="#6c7293"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}`}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-2xl border border-white/15 bg-[#161a33]/95 backdrop-blur-md p-3 shadow-2xl space-y-1.5 text-xs">
                        <div className="font-bold text-white border-b border-white/10 pb-1 flex items-center justify-between gap-4">
                          <span>{label} oyi hisoboti</span>
                          <span className="text-[#34d0a0] font-semibold">{data.completionRate}% o'zlashtirish</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-white/80">
                          <span className="flex items-center gap-1 text-[#ffb020]">
                            <Zap className="w-3 h-3 fill-[#ffb020]" />
                            XP ballari:
                          </span>
                          <span className="font-bold tabular-nums text-white">{data.xp} XP</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-white/80">
                          <span className="flex items-center gap-1 text-[#34d0a0]">
                            <BookOpen className="w-3 h-3" />
                            Yakunlangan darslar:
                          </span>
                          <span className="font-bold tabular-nums text-white">{data.lessons} ta dars</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="xp"
                name="Jamg'arilgan XP"
                stroke="#ffb020"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorXp)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />

              <XAxis
                dataKey="name"
                stroke="#6c7293"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              />

              <YAxis
                stroke="#6c7293"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-2xl border border-white/15 bg-[#161a33]/95 backdrop-blur-md p-3 shadow-2xl space-y-1.5 text-xs">
                        <div className="font-bold text-white border-b border-white/10 pb-1">
                          {data.fullName}
                        </div>
                        <div className="flex items-center justify-between gap-4 text-white/80">
                          <span className="text-[#38bdf8]">O'zlashtirish foizi:</span>
                          <span className="font-bold tabular-nums text-[#34d0a0]">{data.rate}%</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-white/80">
                          <span className="text-white/60">Tugallangan darslar:</span>
                          <span className="font-bold tabular-nums text-white">
                            {data.completed} / {data.total} dars
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar
                dataKey="rate"
                name="Tugallanish foizi"
                fill="#34d0a0"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart legend / footnote */}
      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/5 text-[11px] text-white/50">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb020]" />
            <span>Oylik jamg'arilgan XP ko'rsatkichi</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34d0a0]" />
            <span>Darslarni yakunlash foizi</span>
          </span>
        </div>
        <span className="text-white/40">Yangilanish: Bugun, 15:40</span>
      </div>
    </div>
  );
};
