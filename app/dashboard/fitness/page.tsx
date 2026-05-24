'use client';

import { useState, useRef } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ExerciseLibrary from '@/components/fitness/ExerciseLibrary';
import WorkoutPrograms from '@/components/fitness/WorkoutPrograms';
import RestTimer from '@/components/fitness/RestTimer';
import ExerciseAnimation from '@/components/fitness/ExerciseAnimation';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  ChevronLeft, ChevronRight, Calendar, SlidersHorizontal,
  Clock, Flame, Play, Dumbbell, BookOpen, Timer, TrendingUp,
  Trophy, Zap,
} from 'lucide-react';

type Tab = 'activity' | 'library' | 'programs' | 'timer';

// ─── Data ─────────────────────────────────────────────────────────────────────
const DAYS = [
  { d: 15, day: 'Th' }, { d: 16, day: 'Fr' }, { d: 17, day: 'Sa' },
  { d: 18, day: 'Su' }, { d: 19, day: 'Mo' }, { d: 20, day: 'Tu' },
  { d: 21, day: 'We' }, { d: 22, day: 'Th' }, { d: 23, day: 'Fr' },
  { d: 24, day: 'Sa' }, { d: 25, day: 'Su' }, { d: 26, day: 'Mo' },
  { d: 27, day: 'Tu' }, { d: 28, day: 'We' }, { d: 29, day: 'Th' },
  { d: 30, day: 'Fr' },
];

const CHART_DATA = [
  { h: '00', v: 0 }, { h: '01', v: 0 }, { h: '02', v: 4 },
  { h: '03', v: 7 }, { h: '04', v: 10 }, { h: '05', v: 18 },
  { h: '06', v: 42 }, { h: '07', v: 78 }, { h: '08', v: 92 },
  { h: '09', v: 68 }, { h: '10', v: 48 }, { h: '11', v: 32 },
  { h: '12', v: 26 }, { h: '13', v: 36 }, { h: '14', v: 52 },
  { h: '15', v: 68 }, { h: '16', v: 80 }, { h: '17', v: 72 },
  { h: '18', v: 58 }, { h: '19', v: 40 }, { h: '20', v: 28 },
  { h: '21', v: 16 }, { h: '22', v: 7 }, { h: '23', v: 2 },
];

const TRAININGS = [
  { id: 'cycle',    label: 'Cycle',    accent: '#F97316', bg: '#FFF7ED', duration: '17.5 min', kcal: '30.7 Kcal',  img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { id: 'strength', label: 'Strength', accent: '#EF4444', bg: '#FEF2F2', duration: '18.5 min', kcal: '77.7 Kcal',  img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
  { id: 'combat',   label: 'Combat',   accent: '#3B82F6', bg: '#EFF6FF', duration: '30.0 min', kcal: '292.8 Kcal', img: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&q=80' },
  { id: 'yoga',     label: 'Yoga',     accent: '#F59E0B', bg: '#FFFBEB', duration: '8.5 min',  kcal: '20.2 Kcal',  img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80' },
];

const TIPS = [
  {
    title: 'Connect your smart watches',
    desc: 'Track your activity, get reminders and achievements automatically.',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80',
    tag: 'Device Sync',
  },
  {
    title: 'Intermittent Fasting Tracker',
    desc: 'Keep up with your schedule and turn on daily reminders.',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&q=80',
    tag: 'Nutrition',
  },
];

// ─── Ring SVG ─────────────────────────────────────────────────────────────────
function Ring({ pct, color }: { pct: number; color: string }) {
  const r = 17; const c = 2 * Math.PI * r;
  return (
    <div className="relative w-11 h-11 flex items-center justify-center">
      <svg width="44" height="44" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="#F3F4F6" strokeWidth="3.5" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round" />
      </svg>
      <span className="text-[9px] font-black relative z-10" style={{ color }}>{pct}%</span>
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function ChartTip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white rounded-xl px-3 py-2.5 text-xs shadow-2xl border border-white/10">
      <p className="font-black text-white mb-1">Yoga</p>
      <p className="text-gray-400">⏱ 8.5 min</p>
      <p className="text-gray-400">🔥 {payload[0]?.value} Kcal</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FitnessPage() {
  const [tab, setTab] = useState<Tab>('activity');
  const [day, setDay] = useState(15);
  const [exercise, setExercise] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (d: 'l' | 'r') =>
    carouselRef.current?.scrollBy({ left: d === 'l' ? -260 : 260, behavior: 'smooth' });

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'activity', label: 'Activity',         icon: TrendingUp },
    { id: 'library',  label: 'Exercise Library', icon: BookOpen },
    { id: 'programs', label: 'Programs',         icon: Dumbbell },
    { id: 'timer',    label: 'Rest Timer',       icon: Timer },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto pb-14">

        {/* ── Page hero ── */}
        <div className="flex items-center justify-between pt-2 pb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Fitness</p>
            <h1 className="text-2xl font-black text-gray-900">Your Workouts</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-2xl px-3 py-2 shadow-sm">
              <Zap size={13} className="text-amber-500" />
              <span className="text-xs font-black text-gray-700">7-day streak</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-2xl px-3 py-2 shadow-sm">
              <Trophy size={13} className="text-yellow-500" />
              <span className="text-xs font-black text-gray-700">3 achievements</span>
            </div>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-0.5 scrollbar-hide">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[13px] whitespace-nowrap transition-all ${
                tab === t.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
              }`}>
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ACTIVITY
        ══════════════════════════════════════════════════════════════════ */}
        {tab === 'activity' && (
          <div className="space-y-4">

            {/* Activity chart card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[13px] font-black uppercase tracking-widest text-gray-800">Your Activity</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-gray-400 mr-1">OCT</span>
                    <button className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <Calendar size={12} className="text-gray-500" />
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <SlidersHorizontal size={12} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Date scrubber */}
                <div className="flex items-center gap-1.5 mb-5">
                  <button className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors">
                    <ChevronLeft size={12} className="text-gray-600" />
                  </button>
                  <div className="flex gap-1 overflow-x-auto flex-1 scrollbar-hide">
                    {DAYS.map(({ d, day: lbl }) => (
                      <button key={d} onClick={() => setDay(d)}
                        className={`flex flex-col items-center px-2 py-1.5 rounded-xl min-w-[36px] transition-all ${
                          day === d
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                        }`}>
                        <span className="text-[12px] font-black leading-tight">{d}</span>
                        <span className="text-[9px] font-semibold leading-tight opacity-70">{lbl}</span>
                      </button>
                    ))}
                  </div>
                  <button className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors">
                    <ChevronRight size={12} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div style={{ height: 170 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.18} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="0" stroke="#F9FAFB" vertical={false} />
                    <XAxis dataKey="h" tick={{ fill: '#D1D5DB', fontSize: 9, fontWeight: 700 }}
                      axisLine={false} tickLine={false} interval={2} />
                    <YAxis hide />
                    <Tooltip content={<ChartTip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />
                    <ReferenceLine x="08" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 3"
                      label={{ value: 'Yoga', position: 'insideTopRight', fill: '#F59E0B', fontSize: 9, fontWeight: 800, dy: -4 }} />
                    <ReferenceLine x="17" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="3 3"
                      label={{ value: 'Training', position: 'insideTopRight', fill: '#EF4444', fontSize: 9, fontWeight: 800, dy: -4 }} />
                    <Area type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2}
                      fill="url(#grad1)" dot={false} activeDot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Steps */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Steps</p>
                  <Ring pct={73} color="#3B82F6" />
                </div>
                <p className="text-[28px] font-black text-gray-900 leading-none tracking-tight">10 025</p>
                <p className="text-[11px] text-gray-400 mt-1.5">1 366 to goal</p>
              </div>

              {/* Distance */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Distance</p>
                  <Ring pct={83} color="#10B981" />
                </div>
                <p className="text-[28px] font-black text-gray-900 leading-none tracking-tight">9.6 km</p>
                <p className="text-[11px] text-gray-400 mt-1.5">1.2 km to goal</p>
              </div>

              {/* Calories */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Calories</p>
                  <Ring pct={63} color="#F59E0B" />
                </div>
                <div className="flex items-end gap-3">
                  <div>
                    <p className="text-[9px] font-black uppercase text-gray-400 mb-0.5">Burned</p>
                    <p className="text-[28px] font-black text-gray-900 leading-none">667</p>
                  </div>
                  <div className="mb-0.5">
                    <p className="text-[9px] font-black uppercase text-gray-400 mb-0.5">Eaten</p>
                    <p className="text-[28px] font-black text-gray-900 leading-none">1 236</p>
                  </div>
                </div>
              </div>

              {/* Active time */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Active Time</p>
                <p className="text-[28px] font-black text-gray-900 leading-none tabular-nums tracking-tight">03:02:56</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <p className="text-[11px] text-gray-400">Goal reached</p>
                </div>
              </div>
            </div>

            {/* Trainings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[13px] font-black uppercase tracking-widest text-gray-800">Trainings</h2>
                <div className="flex gap-1">
                  <button onClick={() => scroll('l')} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <ChevronLeft size={13} className="text-gray-600" />
                  </button>
                  <button onClick={() => scroll('r')} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <ChevronRight size={13} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div ref={carouselRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                {TRAININGS.map(tr => (
                  <div key={tr.id} onClick={() => setTab('library')}
                    className="flex-shrink-0 w-[200px] rounded-xl overflow-hidden border border-gray-100 cursor-pointer group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    style={{ background: tr.bg }}>
                    <div className="relative h-[130px] overflow-hidden">
                      <img src={tr.img} alt={tr.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={11} fill="currentColor" className="text-gray-800 ml-0.5" />
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="w-[3px] h-4 rounded-full flex-shrink-0" style={{ background: tr.accent }} />
                        <span className="text-[13px] font-black text-gray-900">{tr.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
                        <Clock size={10} className="flex-shrink-0" />
                        <span>{tr.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Flame size={10} className="flex-shrink-0 text-orange-400" />
                        <span>{tr.kcal}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-[13px] font-black uppercase tracking-widest text-gray-800 mb-4">Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TIPS.map((tip, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100/60 transition-all cursor-pointer group">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-[9px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full mb-2">{tip.tag}</span>
                      <h3 className="text-[13px] font-black text-gray-900 mb-1 leading-snug">{tip.title}</h3>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{tip.desc}</p>
                    </div>
                    <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                      <img src={tip.img} alt={tip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            EXERCISE LIBRARY
        ══════════════════════════════════════════════════════════════════ */}
        {tab === 'library' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <ExerciseLibrary userConditions={[]} onStartExercise={name => setExercise(name)} />
            </div>
            {exercise && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-black text-gray-900">Now: {exercise}</h3>
                  <button onClick={() => setExercise(null)}
                    className="text-[11px] font-bold text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                    ✕ Close
                  </button>
                </div>
                <ExerciseAnimation exerciseName={exercise} duration={30} reps={10}
                  onComplete={() => setExercise(null)} showVoiceCoach />
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            PROGRAMS
        ══════════════════════════════════════════════════════════════════ */}
        {tab === 'programs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <WorkoutPrograms />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            REST TIMER
        ══════════════════════════════════════════════════════════════════ */}
        {tab === 'timer' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <RestTimer />
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
