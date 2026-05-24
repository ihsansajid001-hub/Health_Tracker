'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Droplet, Plus, ChevronRight, Trophy, Clock, Trash2, Coffee, Waves, X, Target, TrendingUp, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatDate, calculateWaterIntake } from '@/lib/utils/calculations';

interface DrinkEntry {
  id: string;
  type: string;
  amount: number;
  time: string;
  icon: 'water' | 'tea' | 'juice';
}

const DRINK_OPTIONS = [
  { label: 'Water', amount: 250, icon: 'water' as const, color: '#4FACFE' },
  { label: 'Water', amount: 500, icon: 'water' as const, color: '#4FACFE' },
  { label: 'Water', amount: 750, icon: 'water' as const, color: '#4FACFE' },
  { label: 'Tea', amount: 200, icon: 'tea' as const, color: '#FF6B6B' },
  { label: 'Juice', amount: 300, icon: 'juice' as const, color: '#FFD93D' },
];

const WEEKLY_DATA = [
  { day: 'Mon', value: 75, ml: 1500 },
  { day: 'Tue', value: 90, ml: 1800 },
  { day: 'Wed', value: 60, ml: 1200 },
  { day: 'Thu', value: 85, ml: 1700 },
  { day: 'Fri', value: 100, ml: 2000 },
  { day: 'Sat', value: 45, ml: 900 },
  { day: 'Sun', value: 70, ml: 1400 },
];

const ACHIEVEMENTS = [
  { level: 1, title: 'Hydration Starter', desc: 'Log water for 3 days', unlocked: true },
  { level: 2, title: 'Consistent Sipper', desc: 'Hit goal 5 days in a row', unlocked: true },
  { level: 3, title: 'Hydration Hero', desc: 'Hit goal 10 days in a row', unlocked: true },
  { level: 4, title: 'Water Champion', desc: 'Hit goal 20 days in a row', unlocked: false },
  { level: 5, title: 'Hydration Master', desc: 'Hit goal 30 days in a row', unlocked: false },
  { level: 6, title: 'Legend', desc: 'Hit goal 60 days in a row', unlocked: false },
];

function DrinkIcon({ type, size = 20 }: { type: string; size?: number }) {
  if (type === 'tea') return <Coffee size={size} className="text-red-400" />;
  if (type === 'juice') return <Waves size={size} className="text-yellow-400" />;
  return <Droplet size={size} className="text-orange-400" />;
}

function CircularProgress({ percentage, current, target }: { percentage: number; current: number; target: number }) {
  const size = 280;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (270 / 360);
  const offset = arcLength - (arcLength * Math.min(percentage, 100)) / 100;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(135deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="rgba(255,255,255,0.2)" strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`} strokeLinecap="round" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="white" strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingBottom: '24px' }}>
        <svg width="52" height="62" viewBox="0 0 48 56" fill="none" className="mb-2">
          <path d="M24 4 C24 4 6 22 6 34 C6 44.5 14.1 52 24 52 C33.9 52 42 44.5 42 34 C42 22 24 4 24 4Z" fill="rgba(255,255,255,0.95)" />
          <path d="M24 4 C24 4 6 22 6 34 C6 44.5 14.1 52 24 52 C33.9 52 42 44.5 42 34 C42 22 24 4 24 4Z" fill="url(#dropGrad)" opacity="0.5" />
          <defs>
            <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4FACFE" />
              <stop offset="100%" stopColor="#00F2FE" />
            </linearGradient>
          </defs>
        </svg>
        <div className="text-5xl font-black text-white leading-none tabular-nums">{current}</div>
        <div className="text-sm text-white/70 font-semibold mt-1">/ {target} ml</div>
      </div>
    </div>
  );
}

export default function HydrationPage() {
  const [targetWater, setTargetWater] = useState(2000);
  const [currentWater, setCurrentWater] = useState(1650);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [customType, setCustomType] = useState<'water' | 'tea' | 'juice'>('water');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statsView, setStatsView] = useState<'weekly' | 'monthly'>('weekly');
  const [history, setHistory] = useState<DrinkEntry[]>([
    { id: '1', type: 'Water', amount: 500, time: '8:00 AM', icon: 'water' },
    { id: '2', type: 'Tea', amount: 200, time: '10:30 AM', icon: 'tea' },
    { id: '3', type: 'Water', amount: 750, time: '12:15 PM', icon: 'water' },
    { id: '4', type: 'Juice', amount: 200, time: '3:00 PM', icon: 'juice' },
  ]);

  const percentage = Math.min((currentWater / targetWater) * 100, 100);
  const remaining = Math.max(targetWater - currentWater, 0);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('user_profiles').select('weight, activity_level').eq('user_id', user.id).single();
      if (profile) setTargetWater(calculateWaterIntake(profile.weight, profile.activity_level));
    } catch {}
  };

  const addDrink = async (type: string, amount: number, icon: 'water' | 'tea' | 'juice') => {
    if (amount <= 0) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const newEntry: DrinkEntry = { id: Date.now().toString(), type, amount, time: timeStr, icon };
    setHistory(prev => [newEntry, ...prev]);
    const newTotal = currentWater + amount;
    setCurrentWater(newTotal);
    setShowAddModal(false);
    setCustomAmount('');
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('hydration_logs').upsert({
        user_id: user.id, date: formatDate(now), water_ml: newTotal, target_ml: targetWater,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {}
    finally { setLoading(false); }
  };

  const removeEntry = (id: string) => {
    const entry = history.find(h => h.id === id);
    if (entry) {
      setCurrentWater(prev => Math.max(0, prev - entry.amount));
      setHistory(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        {/* Page heading */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hydration</h1>
            <p className="text-sm text-gray-400 mt-0.5">Track your daily water intake and stay hydrated</p>
          </div>
          <div className="flex items-center gap-3">
            {success && (
              <span className="text-xs bg-orange-50 text-orange-500 border border-orange-200 px-3 py-1.5 rounded-full font-bold">
                Saved
              </span>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm text-white transition-all hover:-translate-y-0.5 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #1E90FF, #4FACFE)', boxShadow: '0 4px 20px rgba(30,144,255,0.35)' }}
            >
              <Plus size={16} />
              Add Water
            </button>
          </div>
        </div>

        {/* Main 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT: Circular gauge */}
          <div
            className="lg:col-span-1 rounded-3xl overflow-hidden relative flex flex-col"
            style={{ background: 'linear-gradient(160deg, #1565C0 0%, #1E90FF 45%, #4FACFE 100%)', minHeight: '500px' }}
          >
            <div className="absolute top-[-50px] right-[-50px] w-44 h-44 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
            <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />

            <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-0">
              <div>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Today</p>
                <h2 className="text-white text-lg font-black">Water Intake</h2>
              </div>
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Droplet size={17} className="text-white" />
              </div>
            </div>

            <div className="relative z-10 flex justify-center items-center flex-1 py-4">
              <CircularProgress percentage={percentage} current={currentWater} target={targetWater} />
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-2 px-5 pb-4">
              {[
                { label: 'Consumed', value: `${currentWater}ml` },
                { label: 'Remaining', value: `${remaining}ml` },
                { label: 'Progress', value: `${Math.round(percentage)}%` },
              ].map(s => (
                <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
                  <p className="text-white font-black text-sm leading-none">{s.value}</p>
                  <p className="text-white/50 text-[10px] font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="relative z-10 px-5 pb-6">
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Quick Add</p>
              <div className="grid grid-cols-4 gap-2">
                {[250, 500, 750, 1000].map(ml => (
                  <button
                    key={ml}
                    onClick={() => addDrink('Water', ml, 'water')}
                    className="py-2.5 rounded-xl text-xs font-black text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
                  >
                    +{ml < 1000 ? ml : '1k'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Stats + Achievements */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Stats card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex-1">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-orange-500" />
                  <h3 className="font-black text-gray-900">Drink Completion</h3>
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                  {(['weekly', 'monthly'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setStatsView(v)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                        statsView === v ? 'text-white shadow-sm' : 'text-gray-400'
                      }`}
                      style={statsView === v ? { background: 'linear-gradient(135deg, #1E90FF, #4FACFE)' } : {}}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end gap-3 mb-4" style={{ height: '160px' }}>
                {WEEKLY_DATA.map((d, i) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative flex items-end justify-center" style={{ height: '128px' }}>
                      {i === 4 && (
                        <div
                          className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-white text-[10px] font-black whitespace-nowrap"
                          style={{ background: 'linear-gradient(135deg, #1E90FF, #4FACFE)' }}
                        >
                          {d.ml}ml
                        </div>
                      )}
                      <div
                        className="w-full rounded-xl transition-all duration-700"
                        style={{
                          height: `${d.value}%`,
                          background: i === 4
                            ? 'linear-gradient(180deg, #4FACFE 0%, #1E90FF 100%)'
                            : 'linear-gradient(180deg, #BFDBFE 0%, #93C5FD 100%)',
                          minHeight: '8px',
                        }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${i === 4 ? 'text-orange-500' : 'text-gray-400'}`}>{d.day}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Avg Daily', value: '1,820 ml', color: 'text-orange-400' },
                  { label: 'Best Day', value: '2,400 ml', color: 'text-yellow-500' },
                  { label: 'Goal Hit', value: '5 / 7 days', color: 'text-orange-500' },
                ].map(s => (
                  <div key={s.label} className="bg-orange-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-400 font-semibold mb-1">{s.label}</p>
                    <p className="text-base font-black text-orange-600">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-orange-500" />
                  <h3 className="font-black text-gray-900">Achievements</h3>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #1E90FF, #4FACFE)' }}
                >
                  <Trophy size={12} />
                  Level 3
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {ACHIEVEMENTS.map(a => (
                  <div
                    key={a.level}
                    className={`rounded-2xl p-3 text-center transition-all ${a.unlocked ? '' : 'opacity-40'}`}
                    style={{ background: a.unlocked ? 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' : '#F9FAFB' }}
                    title={a.desc}
                  >
                    <div
                      className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ background: a.unlocked ? 'linear-gradient(135deg, #1E90FF, #4FACFE)' : '#D1D5DB' }}
                    >
                      <Trophy size={16} className="text-white" />
                    </div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wide">Lv {a.level}</p>
                    <p className="text-[10px] font-bold text-gray-700 mt-0.5 leading-tight">{a.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full-width History */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-500" />
              <h3 className="font-black text-gray-900">Today's History</h3>
              <span className="text-xs bg-orange-50 text-orange-500 font-black px-2 py-0.5 rounded-full">{history.length} drinks</span>
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
              View All <ChevronRight size={14} />
            </button>
          </div>

          {history.length === 0 ? (
            <div className="py-16 text-center">
              <Droplet className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-semibold">No drinks logged yet today</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg, #1E90FF, #4FACFE)' }}
              >
                Log your first drink
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-50">
              {history.map(entry => (
                <div key={entry.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors group">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: entry.icon === 'tea'
                        ? 'linear-gradient(135deg, #FFE0E0, #FFBABA)'
                        : entry.icon === 'juice'
                        ? 'linear-gradient(135deg, #FFF3CD, #FFE082)'
                        : 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
                    }}
                  >
                    <DrinkIcon type={entry.icon} size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 text-sm">{entry.type}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock size={11} className="text-gray-400" />
                      <p className="text-xs text-gray-400 font-medium">{entry.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-orange-500">{entry.amount} ml</span>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400"
                      aria-label="Remove entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Add Water Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl font-black text-gray-900 mb-1">Add a Drink</h3>
            <p className="text-sm text-gray-400 mb-6">Select a preset or enter a custom amount</p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {DRINK_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => addDrink(opt.label, opt.amount, opt.icon)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-transparent hover:border-orange-200 transition-all active:scale-95"
                  style={{ background: `${opt.color}15` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${opt.color}25` }}>
                    <DrinkIcon type={opt.icon} size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-gray-800">{opt.label}</p>
                    <p className="text-xs text-gray-400 font-semibold">{opt.amount} ml</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-semibold">or custom</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="flex gap-2 mb-3">
              {(['water', 'tea', 'juice'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setCustomType(t)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all border-2 ${
                    customType === t ? 'border-blue-400 bg-orange-50 text-orange-500' : 'border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <DrinkIcon type={t} size={14} />
                  {t}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Amount in ml"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => {
                  const amt = parseInt(customAmount);
                  if (amt > 0) addDrink(customType.charAt(0).toUpperCase() + customType.slice(1), amt, customType);
                }}
                disabled={!customAmount || parseInt(customAmount) <= 0}
                className="px-6 py-3 rounded-2xl font-black text-white text-sm disabled:opacity-40 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #1E90FF, #4FACFE)' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
