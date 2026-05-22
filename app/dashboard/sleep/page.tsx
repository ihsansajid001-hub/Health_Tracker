'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SleepSoundPlayer from '@/components/sleep/SleepSoundPlayer';
import SmartAlarm from '@/components/sleep/SmartAlarm';
import SleepAnalytics from '@/components/sleep/SleepAnalytics';
import SleepCycleTracker from '@/components/sleep/SleepCycleTracker';
import SnoringDetection from '@/components/sleep/SnoringDetection';
import { Moon, Plus, ChevronRight, ChevronDown, Trophy, Clock, Trash2, X, TrendingUp, Award, Sunrise, Sunset, Music, BarChart3, AlarmClock, Mic } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils/calculations';

interface SleepEntry {
  id: string;
  bedtime: string;
  wake_time: string;
  total_hours: number;
  sleep_quality: number;
  date: string;
}

const WEEKLY_DATA = [
  { day: 'Mon', value: 75, hours: 6.5 },
  { day: 'Tue', value: 88, hours: 7.5 },
  { day: 'Wed', value: 62, hours: 5.5 },
  { day: 'Thu', value: 88, hours: 7.5 },
  { day: 'Fri', value: 100, hours: 8.5 },
  { day: 'Sat', value: 50, hours: 4.5 },
  { day: 'Sun', value: 75, hours: 6.5 },
];

const ACHIEVEMENTS = [
  { level: 1, title: 'Early Riser', desc: 'Log sleep for 3 days', unlocked: true },
  { level: 2, title: 'Consistent Sleeper', desc: 'Hit goal 5 days in a row', unlocked: true },
  { level: 3, title: 'Sleep Hero', desc: 'Hit goal 10 days in a row', unlocked: true },
  { level: 4, title: 'Rest Champion', desc: 'Hit goal 20 days in a row', unlocked: false },
  { level: 5, title: 'Sleep Master', desc: 'Hit goal 30 days in a row', unlocked: false },
  { level: 6, title: 'Legend', desc: 'Hit goal 60 days in a row', unlocked: false },
];

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
        <Moon size={40} className="text-white mb-2" fill="rgba(255,255,255,0.9)" />
        <div className="text-5xl font-black text-white leading-none tabular-nums">{current.toFixed(1)}</div>
        <div className="text-sm text-white/70 font-semibold mt-1">/ {target}h goal</div>
      </div>
    </div>
  );
}

function CollapsibleCard({
  icon,
  title,
  badge,
  defaultOpen = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-black text-gray-900">{title}</h3>
          {badge && (
            <span className="text-xs bg-purple-50 text-purple-600 font-black px-2 py-0.5 rounded-full">{badge}</span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

export default function SleepPage() {
  const [targetHours] = useState(8);
  const [currentHours, setCurrentHours] = useState(6.5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statsView, setStatsView] = useState<'weekly' | 'monthly'>('weekly');
  const [history, setHistory] = useState<SleepEntry[]>([
    { id: '1', bedtime: '11:00 PM', wake_time: '6:30 AM', total_hours: 7.5, sleep_quality: 8, date: 'Today' },
    { id: '2', bedtime: '10:30 PM', wake_time: '6:00 AM', total_hours: 7.5, sleep_quality: 9, date: 'Yesterday' },
    { id: '3', bedtime: '12:00 AM', wake_time: '6:30 AM', total_hours: 6.5, sleep_quality: 6, date: '2 days ago' },
  ]);

  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    bedtime: '23:00',
    wake_time: '07:00',
    total_hours: 8,
    sleep_quality: 7,
    notes: '',
  });

  const percentage = Math.min((currentHours / targetHours) * 100, 100);
  const remaining = Math.max(targetHours - currentHours, 0);

  const addSleep = async () => {
    const { bedtime, wake_time, total_hours, sleep_quality, date, notes } = formData;
    const now = new Date();
    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      bedtime: formatTime(bedtime),
      wake_time: formatTime(wake_time),
      total_hours,
      sleep_quality,
      date: 'Today',
    };
    setHistory(prev => [newEntry, ...prev]);
    setCurrentHours(total_hours);
    setShowAddModal(false);
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('sleep_logs').upsert({
        user_id: user.id,
        date,
        bedtime,
        wake_time,
        total_hours,
        sleep_quality,
        notes,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {}
    finally { setLoading(false); }
  };

  const removeEntry = (id: string) => {
    const entry = history.find(h => h.id === id);
    if (entry) {
      setCurrentHours(prev => Math.max(0, prev - entry.total_hours));
      setHistory(prev => prev.filter(h => h.id !== id));
    }
  };

  function formatTime(time24: string) {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
  }

  const qualityColor = (q: number) =>
    q >= 8 ? 'text-green-500' : q >= 5 ? 'text-yellow-500' : 'text-red-400';

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        {/* Page heading */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sleep</h1>
            <p className="text-sm text-gray-400 mt-0.5">Track your nightly rest and improve sleep quality</p>
          </div>
          <div className="flex items-center gap-3">
            {success && (
              <span className="text-xs bg-purple-50 text-purple-600 border border-purple-200 px-3 py-1.5 rounded-full font-bold">
                Saved
              </span>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm text-white transition-all hover:-translate-y-0.5 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}
            >
              <Plus size={16} />
              Log Sleep
            </button>
          </div>
        </div>

        {/* Main 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT: Circular gauge */}
          <div
            className="lg:col-span-1 rounded-3xl overflow-hidden relative flex flex-col"
            style={{ background: 'linear-gradient(160deg, #3B0764 0%, #7C3AED 45%, #A78BFA 100%)', minHeight: '500px' }}
          >
            <div className="absolute top-[-50px] right-[-50px] w-44 h-44 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
            <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />

            <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-0">
              <div>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Tonight</p>
                <h2 className="text-white text-lg font-black">Sleep Duration</h2>
              </div>
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Moon size={17} className="text-white" />
              </div>
            </div>

            <div className="relative z-10 flex justify-center items-center flex-1 py-4">
              <CircularProgress percentage={percentage} current={currentHours} target={targetHours} />
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-2 px-5 pb-4">
              {[
                { label: 'Slept', value: `${currentHours}h` },
                { label: 'Remaining', value: `${remaining.toFixed(1)}h` },
                { label: 'Progress', value: `${Math.round(percentage)}%` },
              ].map(s => (
                <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
                  <p className="text-white font-black text-sm leading-none">{s.value}</p>
                  <p className="text-white/50 text-[10px] font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="relative z-10 px-5 pb-6">
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Quick Log</p>
              <div className="grid grid-cols-4 gap-2">
                {[5, 6, 7, 8].map(h => (
                  <button
                    key={h}
                    onClick={() => setCurrentHours(h)}
                    className="py-2.5 rounded-xl text-xs font-black text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
                  >
                    {h}h
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
                  <TrendingUp size={16} className="text-purple-500" />
                  <h3 className="font-black text-gray-900">Sleep Duration</h3>
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                  {(['weekly', 'monthly'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setStatsView(v)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                        statsView === v ? 'text-white shadow-sm' : 'text-gray-400'
                      }`}
                      style={statsView === v ? { background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' } : {}}
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
                          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
                        >
                          {d.hours}h
                        </div>
                      )}
                      <div
                        className="w-full rounded-xl transition-all duration-700"
                        style={{
                          height: `${d.value}%`,
                          background: i === 4
                            ? 'linear-gradient(180deg, #A78BFA 0%, #7C3AED 100%)'
                            : 'linear-gradient(180deg, #EDE9FE 0%, #DDD6FE 100%)',
                          minHeight: '8px',
                        }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${i === 4 ? 'text-purple-500' : 'text-gray-400'}`}>{d.day}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Avg Sleep', value: '7.1 hrs', color: 'text-purple-400' },
                  { label: 'Best Night', value: '9.0 hrs', color: 'text-yellow-500' },
                  { label: 'Goal Hit', value: '5 / 7 days', color: 'text-green-500' },
                ].map(s => (
                  <div key={s.label} className="bg-purple-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-400 font-semibold mb-1">{s.label}</p>
                    <p className="text-base font-black text-purple-700">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-purple-500" />
                  <h3 className="font-black text-gray-900">Achievements</h3>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
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
                    style={{ background: a.unlocked ? 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' : '#F9FAFB' }}
                    title={a.desc}
                  >
                    <div
                      className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{ background: a.unlocked ? 'linear-gradient(135deg, #7C3AED, #A78BFA)' : '#D1D5DB' }}
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
              <Clock size={16} className="text-purple-500" />
              <h3 className="font-black text-gray-900">Sleep History</h3>
              <span className="text-xs bg-purple-50 text-purple-600 font-black px-2 py-0.5 rounded-full">{history.length} entries</span>
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-purple-500 hover:text-purple-700 transition-colors">
              View All <ChevronRight size={14} />
            </button>
          </div>

          {history.length === 0 ? (
            <div className="py-16 text-center">
              <Moon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-semibold">No sleep logged yet</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
              >
                Log your first night
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-50">
              {history.map(entry => (
                <div key={entry.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors group">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)' }}
                  >
                    <Moon size={22} className="text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 text-sm">{entry.total_hours}h sleep</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1">
                        <Sunset size={11} className="text-gray-400" />
                        <p className="text-xs text-gray-400 font-medium">{entry.bedtime}</p>
                      </div>
                      <span className="text-gray-300">→</span>
                      <div className="flex items-center gap-1">
                        <Sunrise size={11} className="text-gray-400" />
                        <p className="text-xs text-gray-400 font-medium">{entry.wake_time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-black ${qualityColor(entry.sleep_quality)}`}>
                      {entry.sleep_quality}/10
                    </span>
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

        {/* Sleep Analytics */}
        <CollapsibleCard
          icon={<BarChart3 size={16} className="text-purple-500" />}
          title="Sleep Analytics"
          badge="Insights"
          defaultOpen
        >
          <SleepAnalytics />
        </CollapsibleCard>

        {/* Sleep Cycle Tracker */}
        <CollapsibleCard
          icon={<Moon size={16} className="text-purple-500" />}
          title="Sleep Cycle Analysis"
          badge={`${formData.total_hours}h logged`}
        >
          <SleepCycleTracker
            totalSleepHours={formData.total_hours}
            sleepQuality={formData.sleep_quality}
            onCycleComplete={c => console.log('Cycles:', c)}
          />
        </CollapsibleCard>

        {/* Sleep Sounds */}
        <CollapsibleCard
          icon={<Music size={16} className="text-purple-500" />}
          title="Sleep Sounds"
          badge="Ambient"
        >
          <SleepSoundPlayer />
        </CollapsibleCard>

        {/* Smart Alarm */}
        <CollapsibleCard
          icon={<AlarmClock size={16} className="text-purple-500" />}
          title="Smart Alarm"
          badge="Wake gently"
        >
          <SmartAlarm />
        </CollapsibleCard>

        {/* Snoring Detection */}
        <CollapsibleCard
          icon={<Mic size={16} className="text-purple-500" />}
          title="Snoring Detection"
          badge="Microphone"
        >
          <SnoringDetection onRecordingComplete={e => console.log('Snoring events:', e)} />
        </CollapsibleCard>

      </div>

      {/* Log Sleep Modal */}
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

            <h3 className="text-xl font-black text-gray-900 mb-1">Log Sleep</h3>
            <p className="text-sm text-gray-400 mb-6">Record your sleep for last night</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Bedtime</label>
                  <input
                    type="time"
                    value={formData.bedtime}
                    onChange={e => setFormData({ ...formData, bedtime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Wake Time</label>
                  <input
                    type="time"
                    value={formData.wake_time}
                    onChange={e => setFormData({ ...formData, wake_time: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Hours Slept: <span className="text-purple-600">{formData.total_hours}h</span>
                </label>
                <input
                  type="range" min="0" max="12" step="0.5"
                  value={formData.total_hours}
                  onChange={e => setFormData({ ...formData, total_hours: parseFloat(e.target.value) })}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0h</span><span>12h</span></div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Sleep Quality: <span className="text-purple-600">{formData.sleep_quality}/10</span>
                </label>
                <input
                  type="range" min="1" max="10"
                  value={formData.sleep_quality}
                  onChange={e => setFormData({ ...formData, sleep_quality: parseInt(e.target.value) })}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Poor</span><span>Excellent</span></div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="How did you sleep? Any dreams?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
              </div>

              <button
                onClick={addSleep}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-black text-white text-sm disabled:opacity-40 transition-all active:scale-95 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}
              >
                {loading ? 'Saving…' : 'Log Sleep'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
