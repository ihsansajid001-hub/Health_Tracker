'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MeditationLibrary from '@/components/mind/MeditationLibrary';
import BreathingExercise from '@/components/mind/BreathingExercise';
import MoodTracker from '@/components/mind/MoodTracker';
import Journal from '@/components/mind/Journal';
import CBTTechniques from '@/components/mind/CBTTechniques';
import MeditationCourses from '@/components/mind/MeditationCourses';
import {
  Brain, Wind, Book, Heart, Lightbulb, BookOpen,
  TrendingUp, TrendingDown, Play, Paperclip, MessageSquare,
  ChevronRight, AlertCircle, Calendar, Clock, ArrowLeft,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
} from 'recharts';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type DetailView = 'meditations' | 'breathing' | 'mood' | 'journal' | 'cbt' | 'courses' | null;

interface MoodEntry {
  id?: string;
  date: string;
  mood_score: number;
  energy_level?: number;
  stress_level?: number;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function getWeekDates() {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.getDate();
  });
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Stat card matching the top row in the design */
function StatCard({
  title,
  value,
  badge,
  badgeUp,
  subtitle,
  progress,
  items,
}: {
  title: string;
  value: number | string;
  badge?: string;
  badgeUp?: boolean;
  subtitle?: string;
  progress?: number; // 0-100
  items?: string[];
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 min-h-[140px]">
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-black text-gray-900">{value}</span>
        {badge && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
              badgeUp
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {badgeUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-400 leading-snug">{subtitle}</p>}
      {items && (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3.5 6L6.5 2" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}
      {progress !== undefined && (
        <div className="mt-auto">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/** Emotional state bar chart */
function EmotionalStateChart({
  data,
  period,
  onPeriodChange,
}: {
  data: { day: string; value: number }[];
  period: 'Week' | 'Month' | 'Year';
  onPeriodChange: (p: 'Week' | 'Month' | 'Year') => void;
}) {
  const PERIODS: ('Week' | 'Month' | 'Year')[] = ['Week', 'Month', 'Year'];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-gray-900">Emotional State</p>
          <p className="text-xs text-gray-400 mt-0.5 max-w-[220px]">
            Based on data collected during sessions with a therapist, self-tests and feedback
          </p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                period === p
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={18} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v}`, 'Score']}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.value >= 70 ? '#93c5fd' : entry.value >= 50 ? '#bfdbfe' : '#dbeafe'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Urgent support card */
function UrgentSupportCard() {
  return (
    <div className="rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden min-h-[220px]"
      style={{
        background: 'linear-gradient(135deg, #a8d8f0 0%, #c8e8f8 40%, #e8f4fd 100%)',
      }}
    >
      {/* Lotus flower decoration */}
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-60 pointer-events-none select-none flex items-end justify-end pr-2 pb-2">
        <span style={{ fontSize: 80 }}>🪷</span>
      </div>

      <div className="relative z-10">
        <p className="font-bold text-blue-900 text-base">Urgent Support</p>
        <p className="text-xs text-blue-700 mt-1 leading-snug max-w-[160px]">
          Quick access to crisis hotlines when you need immediate help
        </p>
      </div>

      <button className="relative z-10 w-full py-2.5 rounded-xl bg-white/70 backdrop-blur-sm text-blue-800 text-sm font-semibold hover:bg-white/90 transition-all border border-white/60 shadow-sm">
        Get help now
      </button>
    </div>
  );
}

/** Upcoming calendar + appointments */
function UpcomingPanel({ username }: { username: string }) {
  const today = new Date().getDate();
  const weekDates = getWeekDates();

  const appointments = [
    { name: 'Dr. McCoy', role: 'Psychotherapist', time: '12:00', date: 'Today', avatar: '👨‍⚕️' },
    { name: 'Darlene Robertson', role: 'Family therapist', time: '18:30', date: '24 Aug', avatar: '👩‍⚕️' },
    { name: 'Dr. McCoy', role: 'Psychotherapist', time: '12:00', date: '28 Aug', avatar: '👨‍⚕️' },
    { name: 'Darlene Robertson', role: 'Family therapist', time: '18:30', date: '30 Aug', avatar: '👩‍⚕️' },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
      <p className="font-bold text-gray-900">Upcoming</p>

      {/* Mini calendar */}
      <div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-gray-400">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDates.map((date, i) => (
            <div
              key={i}
              className={`text-center text-xs font-bold py-1 rounded-lg transition-all ${
                date === today
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {date}
            </div>
          ))}
        </div>
      </div>

      {/* Appointments */}
      <div className="space-y-3">
        {appointments.map((apt, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
              {apt.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{apt.name}</p>
              <p className="text-[10px] text-gray-400">{apt.role}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold text-gray-700">{apt.time}</p>
              <p className="text-[10px] text-gray-400">{apt.date}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors">
        Schedule a new consultation
      </button>
    </div>
  );
}

/** Records of recent sessions */
function RecentSessionsPanel() {
  const sessions = [
    { title: 'Protecting personal space', therapist: 'Dr. McCoy', duration: '45min' },
    { title: 'Respectful relationship s3', therapist: 'Darlene Robertson', duration: '1h 7min' },
    { title: 'Respectful relationship s2', therapist: 'Darlene Robertson', duration: '58min' },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
      <div>
        <p className="font-bold text-gray-900">Records of recent sessions</p>
        <p className="text-xs text-gray-400 mt-0.5">
          View or download recordings of your sessions for review and analysis
        </p>
      </div>

      <div className="space-y-3">
        {sessions.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors shadow-sm">
              <Play size={12} className="text-white ml-0.5" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{s.title}</p>
              <p className="text-[10px] text-gray-400">{s.therapist} · {s.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Exercise row */
function ExerciseRow({
  icon,
  name,
  progress,
  duration,
  tag,
  attachments,
  messages,
  onClick,
}: {
  icon: string;
  name: string;
  progress: number;
  duration: string;
  tag: string;
  attachments?: number;
  messages?: number;
  onClick: () => void;
}) {
  return (
    <div
      className="flex items-center gap-4 py-3 px-1 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors group"
      onClick={onClick}
    >
      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
          <span className="text-xs font-bold text-blue-600">{progress}%</span>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{duration}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{tag}</span>
          {messages !== undefined && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MessageSquare size={10} /> {messages}
            </span>
          )}
          {attachments !== undefined && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Paperclip size={10} /> {attachments}
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function MindPage() {
  const [detailView, setDetailView] = useState<DetailView>(null);
  const [moodPeriod, setMoodPeriod] = useState<'Week' | 'Month' | 'Year'>('Week');
  const [username, setUsername] = useState('there');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('user_profiles')
        .select('username')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.username) setUsername(data.username);
        });

      // Load mood entries for chart
      supabase
        .from('mood_logs')
        .select('date, mood_score, energy_level, stress_level')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30)
        .then(({ data }) => {
          if (data) setMoodEntries(data);
        });
    });
  }, []);

  // Build chart data from mood entries (last 7 days)
  const chartData = (() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const entry = moodEntries.find((e) => e.date === dateStr);
      const dayLabel = d.toLocaleDateString('en', { day: 'numeric', month: 'short' });
      // Normalize mood_score (1-6 scale) to 0-100
      const value = entry ? Math.round((entry.mood_score / 6) * 100) : Math.floor(30 + Math.random() * 50);
      return { day: dayLabel, value };
    });
  })();

  // Stats derived from mood entries
  const avgMood = moodEntries.length
    ? Math.round((moodEntries.slice(0, 7).reduce((s, e) => s + e.mood_score, 0) / Math.min(moodEntries.length, 7)) * 10) / 10
    : 0;

  // If a detail view is active, render it full-screen within the layout
  if (detailView) {
    const detailTitles: Record<NonNullable<DetailView>, string> = {
      meditations: 'Meditations',
      breathing: 'Breathing Exercises',
      mood: 'Mood Tracker',
      journal: 'Journal',
      cbt: 'CBT Techniques',
      courses: 'Meditation Courses',
    };

    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          {/* Back button */}
          <button
            onClick={() => setDetailView(null)}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Mind Dashboard
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">{detailTitles[detailView]}</h2>
            {detailView === 'meditations' && <MeditationLibrary onStartMeditation={(id) => console.log('Start:', id)} />}
            {detailView === 'breathing' && <BreathingExercise />}
            {detailView === 'courses' && <MeditationCourses />}
            {detailView === 'cbt' && <CBTTechniques />}
            {detailView === 'mood' && <MoodTracker />}
            {detailView === 'journal' && <Journal />}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">

        {/* ── Greeting ── */}
        <div className="flex items-center justify-between pt-1">
          <h1 className="text-2xl font-black text-gray-900">
            Hey, {username}! Glad to have you back 🙌
          </h1>
        </div>

        {/* ── Main grid: left content + right sidebar ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">

            {/* ── Top stats row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Progress Tracking"
                value={14}
                badge="+15%"
                badgeUp
                subtitle="Therapy goals achieved over the last 3 months"
                progress={68}
              />
              <StatCard
                title="Educational Sources"
                value={22}
                badge="-30%"
                badgeUp={false}
                items={['Breathing and meditation techniques', 'Identifying sources of stress']}
              />
              <StatCard
                title="Therapeutic Sessions"
                value={6}
                badge="+5%"
                badgeUp
                subtitle="Sessions were held this month"
                progress={45}
              />
            </div>

            {/* ── Emotional State + Urgent Support ── */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
              <EmotionalStateChart
                data={chartData}
                period={moodPeriod}
                onPeriodChange={setMoodPeriod}
              />
              <UrgentSupportCard />
            </div>

            {/* ── My Exercises ── */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="mb-1">
                <p className="font-bold text-gray-900">My exercises</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Exercises to help maintain good physical health and support the progress of therapy
                </p>
              </div>

              <div className="divide-y divide-gray-50">
                <ExerciseRow
                  icon="📓"
                  name="Gratitude journal"
                  progress={98}
                  duration="6h 32min"
                  tag="Positive thinking"
                  messages={16}
                  attachments={3}
                  onClick={() => setDetailView('journal')}
                />
                <ExerciseRow
                  icon="🧘"
                  name="The power of awareness"
                  progress={55}
                  duration="11h 40min"
                  tag="Mindfulness"
                  attachments={1}
                  onClick={() => setDetailView('meditations')}
                />
                <ExerciseRow
                  icon="💨"
                  name="Breathing techniques"
                  progress={72}
                  duration="3h 15min"
                  tag="Stress relief"
                  attachments={2}
                  onClick={() => setDetailView('breathing')}
                />
                <ExerciseRow
                  icon="🧠"
                  name="CBT thought record"
                  progress={40}
                  duration="2h 10min"
                  tag="Thought challenging"
                  messages={4}
                  onClick={() => setDetailView('cbt')}
                />
              </div>

              {/* Quick-access buttons — one for every component not already in the exercise rows */}
              <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: 'Mood Tracker',        view: 'mood'        as DetailView, icon: '❤️' },
                  { label: 'Meditation Courses',  view: 'courses'     as DetailView, icon: '🎓' },
                  { label: 'All Meditations',     view: 'meditations' as DetailView, icon: '🧘' },
                  { label: 'Breathing Exercises', view: 'breathing'   as DetailView, icon: '💨' },
                  { label: 'CBT Techniques',      view: 'cbt'         as DetailView, icon: '💡' },
                  { label: 'Journal',             view: 'journal'     as DetailView, icon: '📓' },
                ].map((item) => (
                  <button
                    key={item.view}
                    onClick={() => setDetailView(item.view)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-4">
            <UpcomingPanel username={username} />
            <RecentSessionsPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
