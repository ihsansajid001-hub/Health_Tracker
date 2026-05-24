'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MedicalDisclaimer from '@/components/safety/MedicalDisclaimer';
import EmergencyButton from '@/components/safety/EmergencyButton';
import { supabase } from '@/lib/supabase/client';
import { LifeScore } from '@/types';
import { MoreHorizontal, TrendingUp, TrendingDown, Flame, Zap, Heart, Activity, Droplets, Brain, Moon } from 'lucide-react';

/* ── tiny helpers ── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-3xl shadow-sm p-5 ${className}`}>{children}</div>;
}

function DarkCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-[#1A1A1A] rounded-3xl p-5 ${className}`}>{children}</div>;
}

function MoreBtn() {
  return (
    <button className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
      <MoreHorizontal size={14} />
    </button>
  );
}

/* ── Sleep bar chart (pure CSS) ── */
const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SLEEP_DATA = [65, 70, 60, 85, 55, 68, 72]; // % of 8h goal
const CURRENT_MONTH = 3; // Sep

function SleepBars() {
  return (
    <div className="flex items-end gap-2 h-24 mt-4">
      {MONTHS.map((m, i) => {
        const h = (SLEEP_DATA[i] / 100) * 96;
        const active = i === CURRENT_MONTH;
        return (
          <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex flex-col gap-0.5 items-center" style={{ height: 96 }}>
              {active ? (
                <div className="w-full rounded-full flex flex-col gap-0.5 overflow-hidden" style={{ height: h, marginTop: 96 - h }}>
                  <div className="flex-1 bg-orange-500 rounded-full" style={{ flex: 0.6 }} />
                  <div className="flex-1 bg-orange-500 rounded-full" style={{ flex: 0.4 }} />
                </div>
              ) : (
                <div
                  className="w-full bg-white/10 rounded-full"
                  style={{ height: h, marginTop: 96 - h }}
                />
              )}
            </div>
            <span className={`text-[10px] font-bold ${active ? 'text-orange-500' : 'text-gray-600'}`}>
              {active ? `${m} ↗` : m}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Wellness dot grid ── */
function WellnessDots({ value }: { value: number }) {
  const total = 35;
  const filled = Math.round((value / 100) * total);
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < filled ? 'bg-orange-500' : 'bg-gray-100'}`} />
      ))}
    </div>
  );
}

/* ── Progress bar ── */
function ProgressBar({ label, value, color, dot }: { label: string; value: number; color: string; dot: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-black text-gray-900">{value} <span className="text-gray-400 font-semibold text-xs">%</span></span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
          <span className="text-xs text-gray-400 font-semibold">{label}</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function DashboardPage() {
  const [loading, setLoading]   = useState(true);
  const [lifeScore, setLifeScore] = useState<LifeScore | null>(null);
  const [user, setUser]         = useState<any>(null);
  const [profile, setProfile]   = useState<any>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [streak, setStreak]     = useState({ current: 0, longest: 0 });

  useEffect(() => {
    const accepted = localStorage.getItem('medical_disclaimer_accepted');
    if (!accepted) setShowDisclaimer(true);

    // Hard timeout — show dashboard after 3s no matter what
    const timeout = setTimeout(() => setLoading(false), 3000);

    init().finally(() => clearTimeout(timeout));
  }, []);

  const init = async () => {
    try {
      // Use getSession() first — it's instant (reads from localStorage, no network call)
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        // No session in storage — redirect to login
        window.location.replace('/login');
        return;
      }

      const user = session.user;
      setUser(user);

      // Show dashboard immediately — don't wait for profile or APIs
      setLoading(false);

      // Fetch profile in background
      Promise.resolve(
        supabase.from('user_profiles').select('*').eq('user_id', user.id).single()
      ).then(({ data: p }) => { if (p) setProfile(p); }).catch(() => {});

      // Fetch score in background
      fetch(`/api/score/current?userId=${user.id}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.lifeScore) setLifeScore(d.lifeScore); })
        .catch(() => {});

      // Fetch streak in background
      if (session.access_token) {
        fetch('/api/streak', { headers: { authorization: `Bearer ${session.access_token}` } })
          .then(r => r.ok ? r.json() : null)
          .then(d => { if (d) setStreak(d); })
          .catch(() => {});
      }
    } catch (e) {
      console.error('Dashboard init error:', e);
      setLoading(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-orange-500 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-gray-400">Loading your dashboard…</p>
        </div>
      </div>
    </DashboardLayout>
  );

  const overall   = lifeScore?.overall   ?? 0;
  const sleep     = lifeScore?.sleep     ?? 0;
  const fitness   = lifeScore?.fitness   ?? 0;
  const nutrition = lifeScore?.nutrition ?? 0;
  const mind      = lifeScore?.mind      ?? 0;
  const hydration = lifeScore?.hydration ?? 0;

  /* derive some display values from scores */
  const heartRate   = Math.round(60 + (100 - overall) * 0.3);
  const activityKm  = ((fitness / 100) * 10).toFixed(1);
  const activeMin   = Math.round((fitness / 100) * 120);
  const sleepHours  = ((sleep / 100) * 9).toFixed(0);
  const sleepMins   = Math.round(((sleep / 100) * 9 % 1) * 60);
  const sleepEff    = sleep;
  const wellnessIdx = overall;
  const calories    = profile?.maintenance_calories ?? 2000;

  return (
    <>
      {showDisclaimer && <MedicalDisclaimer onAccept={() => setShowDisclaimer(false)} onDecline={() => window.location.href = '/'} />}
      <EmergencyButton />

      <DashboardLayout>
        <div className="space-y-5 animate-fade-in">

          {/* ── Page heading ── */}
          <div className="flex items-end justify-between pt-2">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Health Overview</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Welcome back, <span className="font-bold text-gray-600">{profile?.username || user?.email?.split('@')[0]}</span>. Take control of your health today!
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 shadow-sm text-sm font-bold text-gray-700">
              <span className="text-gray-400 text-xs font-semibold">Today</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* ── Row 1: Energy Used | Heart Rate + Activity | Wellness Index ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Energy Used */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-orange-500" />
                  <span className="text-sm font-black text-gray-700">Energy Used</span>
                </div>
                <MoreBtn />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black text-gray-900 tabular-nums">{(calories / 1000).toFixed(1)}k</span>
                <span className="text-xs font-bold text-gray-400">kcal today</span>
                <span className="ml-auto text-xs font-black text-orange-500 bg-orange-500/15 px-2 py-0.5 rounded-full">+5%</span>
              </div>

              {/* Bubble chart */}
              <div className="relative flex items-center justify-center h-36 mt-2">
                {/* Big purple bubble */}
                <div className="absolute w-28 h-28 bg-orange-500/20 rounded-full flex flex-col items-center justify-center left-4 top-2">
                  <span className="text-2xl font-black text-orange-500">{Math.round(calories * 0.55 / 100) / 10}k</span>
                  <span className="text-[10px] text-orange-500/70 font-bold">kcal</span>
                </div>
                {/* Dark bubble */}
                <div className="absolute w-24 h-24 bg-[#1A1A1A] rounded-full flex flex-col items-center justify-center right-4 top-2">
                  <span className="text-xl font-black text-white">{Math.round(calories * 0.35 / 100) / 10}k</span>
                  <span className="text-[10px] text-gray-400 font-bold">kcal</span>
                </div>
                {/* Lime small bubble */}
                <div className="absolute w-16 h-16 bg-orange-500 rounded-full flex flex-col items-center justify-center bottom-0 left-1/2 -translate-x-1/2">
                  <span className="text-base font-black text-black">{Math.round(calories * 0.1 / 100) / 10}k</span>
                  <span className="text-[9px] text-black/60 font-bold">kcal</span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3 mt-4">
                <ProgressBar label="Running"  value={Math.min(fitness, 45)}   color="#F97316" dot="#F97316" />
                <ProgressBar label="Workouts" value={Math.min(fitness, 30)}   color="#1A1A1A" dot="#1A1A1A" />
                <ProgressBar label="Walking"  value={Math.min(hydration, 25)} color="#F97316" dot="#F97316" />
              </div>
            </Card>

            {/* Heart Rate + Activity stacked */}
            <div className="flex flex-col gap-4">
              {/* Heart Rate */}
              <Card className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-red-400" />
                    <span className="text-sm font-black text-gray-700">Heart Rate</span>
                  </div>
                  <MoreBtn />
                </div>
                <div className="flex items-end gap-3">
                  <div>
                    <span className="text-4xl font-black text-gray-900 tabular-nums">{heartRate}</span>
                    <span className="text-sm text-gray-400 font-semibold ml-1">bpm</span>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-400 font-semibold">Avg</p>
                    <p className="text-sm font-black text-gray-700">{heartRate + 16} Bpm</p>
                  </div>
                </div>
                {/* Mini pulse line */}
                <svg className="w-full h-10 mt-3" viewBox="0 0 120 40" fill="none">
                  <polyline points="0,20 15,20 25,5 35,35 45,20 60,20 70,10 80,30 90,20 105,20 120,20"
                    stroke="#F97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Card>

              {/* Activity */}
              <Card className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-orange-500" />
                    <span className="text-sm font-black text-gray-700">Activity</span>
                  </div>
                  <MoreBtn />
                </div>
                <div className="flex items-end gap-3">
                  <div>
                    <span className="text-4xl font-black text-gray-900 tabular-nums">{activityKm}</span>
                    <span className="text-sm text-gray-400 font-semibold ml-1">km</span>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-400 font-semibold">Active</p>
                    <p className="text-sm font-black text-gray-700">{activeMin} Min</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Wellness Index */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain size={16} className="text-orange-500" />
                  <span className="text-sm font-black text-gray-700">Wellness Index</span>
                </div>
                <MoreBtn />
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-black text-gray-900 tabular-nums">{wellnessIdx}</span>
                <span className="text-sm text-gray-400 font-semibold">%</span>
                <span className="ml-auto text-xs font-black text-orange-500 bg-orange-500/15 px-2 py-0.5 rounded-full">+10%</span>
              </div>
              <WellnessDots value={wellnessIdx} />
            </Card>
          </div>

          {/* ── Row 2: Sleep Analysis (dark) | Life Score + Streak ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Sleep Analysis — dark card */}
            <DarkCard>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                    <Moon size={14} className="text-orange-500" />
                  </div>
                  <span className="text-sm font-black text-white">Sleep Analysis</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-300">
                  Monthly
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span className="text-xs text-gray-500 font-semibold">Sleep Efficiency</span>
                  </div>
                  <span className="text-3xl font-black text-white tabular-nums">{sleepEff}<span className="text-lg text-gray-400"> %</span></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span className="text-xs text-gray-500 font-semibold">Sleep Duration</span>
                  </div>
                  <span className="text-3xl font-black text-white tabular-nums">{sleepHours}h {sleepMins > 0 ? `${sleepMins}m` : ''}</span>
                </div>
              </div>

              <SleepBars />
            </DarkCard>

            {/* Life Score + Streak side by side */}
            <div className="flex flex-col gap-4">

              {/* Life Score ring */}
              <Card className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-black text-gray-700">Life Score</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${overall >= 70 ? 'bg-orange-500/20 text-orange-700' : 'bg-red-100 text-red-600'}`}>
                    {overall >= 90 ? 'Exceptional' : overall >= 80 ? 'Excellent' : overall >= 70 ? 'Good' : overall >= 60 ? 'Fair' : 'Needs Work'}
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  {/* Mini ring */}
                  <div className="relative flex-shrink-0">
                    <svg width="90" height="90" className="-rotate-90">
                      <circle cx="45" cy="45" r="38" stroke="#f3f4f6" strokeWidth="7" fill="none" />
                      <circle cx="45" cy="45" r="38" stroke="#F97316" strokeWidth="7" fill="none"
                        strokeDasharray={`${(overall / 100) * 239} 239`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-black text-gray-900 tabular-nums">{overall}</span>
                    </div>
                  </div>
                  {/* Category breakdown */}
                  <div className="flex-1 space-y-2">
                    {[
                      { label: 'Sleep',     val: sleep,     color: '#F97316' },
                      { label: 'Fitness',   val: fitness,   color: '#F97316' },
                      { label: 'Nutrition', val: nutrition, color: '#F97316' },
                      { label: 'Mind',      val: mind,      color: '#F97316' },
                      { label: 'Hydration', val: hydration, color: '#F97316' },
                    ].map(c => (
                      <div key={c.label} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-16 font-semibold">{c.label}</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${c.val}%`, backgroundColor: c.color }} />
                        </div>
                        <span className="text-xs font-black text-gray-700 w-7 text-right tabular-nums">{c.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Streak */}
              <Card className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Flame size={26} className="text-black" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Current Streak</p>
                  <p className="text-3xl font-black text-gray-900 tabular-nums">{streak.current} <span className="text-base text-gray-400 font-semibold">days</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-semibold">Best</p>
                  <p className="text-xl font-black text-gray-700 tabular-nums">{streak.longest}</p>
                </div>
              </Card>
            </div>
          </div>

          {/* ── Row 3: Quick Actions | Nutrition | Hydration ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Quick Actions */}
            <Card>
              <p className="text-sm font-black text-gray-700 mb-4">Quick Log</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Sleep',     href: '/dashboard/sleep',     color: '#F97316', icon: '😴' },
                  { label: 'Workout',   href: '/dashboard/fitness',   color: '#F97316', icon: '💪' },
                  { label: 'Meal',      href: '/dashboard/nutrition', color: '#F97316', icon: '🥗' },
                  { label: 'Mood',      href: '/dashboard/mind',      icon: '🧘', color: '#F97316' },
                  { label: 'Water',     href: '/dashboard/hydration', icon: '💧', color: '#F97316' },
                  { label: 'Analytics', href: '/dashboard/analytics', icon: '📊', color: '#1A1A1A' },
                ].map(a => (
                  <a key={a.label} href={a.href}
                    className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                      style={{ backgroundColor: a.color + '20' }}>
                      {a.icon}
                    </div>
                    <span className="text-xs font-black text-gray-700 group-hover:text-gray-900">{a.label}</span>
                  </a>
                ))}
              </div>
            </Card>

            {/* Nutrition */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">🥗</span>
                  <span className="text-sm font-black text-gray-700">Nutrition</span>
                </div>
                <MoreBtn />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1 tabular-nums">{nutrition}<span className="text-base text-gray-400 font-semibold"> /100</span></div>
              <p className="text-xs text-gray-400 font-semibold mb-4">Nutrition score today</p>
              <div className="space-y-3">
                <ProgressBar label="Protein"  value={Math.min(nutrition, 60)} color="#F97316" dot="#F97316" />
                <ProgressBar label="Carbs"    value={Math.min(nutrition, 45)} color="#F97316" dot="#F97316" />
                <ProgressBar label="Fats"     value={Math.min(nutrition, 30)} color="#F97316" dot="#F97316" />
              </div>
              <a href="/dashboard/nutrition"
                className="mt-4 block w-full py-2.5 bg-[#1A1A1A] text-white text-xs font-black rounded-2xl text-center hover:bg-gray-800 transition-colors">
                Log Meal →
              </a>
            </Card>

            {/* Hydration */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets size={16} className="text-orange-500" />
                  <span className="text-sm font-black text-gray-700">Hydration</span>
                </div>
                <MoreBtn />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1 tabular-nums">
                {Math.round((hydration / 100) * 2500)}<span className="text-base text-gray-400 font-semibold"> ml</span>
              </div>
              <p className="text-xs text-gray-400 font-semibold mb-4">of {profile?.daily_water_goal ?? 2500}ml goal</p>

              {/* Water fill visual */}
              <div className="relative h-24 bg-orange-50 rounded-2xl overflow-hidden mb-4">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-orange-400/30 transition-all duration-700"
                  style={{ height: `${hydration}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-orange-500 tabular-nums">{hydration}%</span>
                </div>
              </div>

              {/* Quick add buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {[250, 500, 750, 1000].map(ml => (
                  <a key={ml} href="/dashboard/hydration"
                    className="py-2 bg-orange-50 hover:bg-orange-100 rounded-xl text-center text-[10px] font-black text-orange-600 transition-colors">
                    +{ml < 1000 ? ml : '1k'}
                  </a>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </DashboardLayout>
    </>
  );
}
