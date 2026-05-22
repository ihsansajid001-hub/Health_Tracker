'use client';

import { useState, useEffect } from 'react';
import { Play, Clock, Target, Trophy, CheckCircle, ChevronRight, Dumbbell, Calendar, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  target_muscle_groups: string[];
  workouts_per_week: number;
  estimated_time_minutes: number;
  benefits: string[];
  equipment_needed: string[];
  workouts: ProgramWorkout[];
}

interface ProgramWorkout {
  day: number;
  week: number;
  name: string;
  exercises: { name: string; sets: number; reps: string; rest_seconds: number; notes?: string }[];
  estimated_duration: number;
}

interface UserProgress {
  program_id: string;
  current_week: number;
  current_day: number;
  completed_workouts: number;
  start_date: string;
  last_workout_date?: string;
}

const DIFFICULTY_CONFIG = {
  beginner:     { label: 'Beginner',     pill: 'bg-emerald-50 text-emerald-600 border border-emerald-100', bar: 'bg-emerald-400', w: 'w-1/3' },
  intermediate: { label: 'Intermediate', pill: 'bg-amber-50 text-amber-600 border border-amber-100',       bar: 'bg-amber-400',   w: 'w-2/3' },
  advanced:     { label: 'Advanced',     pill: 'bg-red-50 text-red-600 border border-red-100',             bar: 'bg-red-400',     w: 'w-full' },
};

const PROGRAMS: WorkoutProgram[] = [
  {
    id: 'beginner-30-day',
    name: '30-Day Beginner Challenge',
    description: 'Build strength and endurance from scratch with progressive bodyweight exercises.',
    duration_weeks: 4, difficulty: 'beginner',
    target_muscle_groups: ['Full Body', 'Core', 'Legs', 'Arms'],
    workouts_per_week: 4, estimated_time_minutes: 20,
    benefits: ['Build basic strength', 'Improve cardiovascular health', 'Establish exercise routine', 'Learn proper form'],
    equipment_needed: ['None — Bodyweight only'],
    workouts: [{
      day: 1, week: 1, name: 'Full Body Foundation', estimated_duration: 20,
      exercises: [
        { name: 'Bodyweight Squats', sets: 2, reps: '8–12', rest_seconds: 60 },
        { name: 'Push-ups', sets: 2, reps: '5–10', rest_seconds: 60 },
        { name: 'Plank Hold', sets: 2, reps: '15–30 sec', rest_seconds: 60 },
        { name: 'Glute Bridges', sets: 2, reps: '8–12', rest_seconds: 60 },
        { name: 'Wall Sit', sets: 2, reps: '15–30 sec', rest_seconds: 60 },
      ],
    }],
  },
  {
    id: 'abs-blast-21',
    name: '21-Day Abs Blast',
    description: 'Sculpt your core with targeted abdominal exercises and progressive difficulty.',
    duration_weeks: 3, difficulty: 'intermediate',
    target_muscle_groups: ['Abs', 'Core', 'Obliques'],
    workouts_per_week: 5, estimated_time_minutes: 15,
    benefits: ['Stronger core', 'Better posture', 'Improved stability', 'Defined abs'],
    equipment_needed: ['None — Bodyweight only'],
    workouts: [{
      day: 1, week: 1, name: 'Core Activation', estimated_duration: 15,
      exercises: [
        { name: 'Crunches', sets: 3, reps: '12–15', rest_seconds: 30 },
        { name: 'Bicycle Crunches', sets: 3, reps: '10 each side', rest_seconds: 30 },
        { name: 'Plank Hold', sets: 3, reps: '20–30 sec', rest_seconds: 30 },
        { name: 'Russian Twists', sets: 3, reps: '10 each side', rest_seconds: 30 },
        { name: 'Dead Bug', sets: 3, reps: '8 each side', rest_seconds: 30 },
      ],
    }],
  },
  {
    id: 'hiit-cardio-28',
    name: '28-Day HIIT Cardio',
    description: 'High-intensity intervals for maximum calorie burn and cardiovascular fitness.',
    duration_weeks: 4, difficulty: 'advanced',
    target_muscle_groups: ['Full Body', 'Cardiovascular'],
    workouts_per_week: 5, estimated_time_minutes: 25,
    benefits: ['Burn maximum calories', 'Boost metabolism', 'Improve cardio', 'Time-efficient'],
    equipment_needed: ['None — Bodyweight only'],
    workouts: [{
      day: 1, week: 1, name: 'HIIT Basics', estimated_duration: 25,
      exercises: [
        { name: 'Jumping Jacks', sets: 4, reps: '30 sec', rest_seconds: 30 },
        { name: 'Burpees', sets: 4, reps: '20 sec', rest_seconds: 40 },
        { name: 'High Knees', sets: 4, reps: '30 sec', rest_seconds: 30 },
        { name: 'Mountain Climbers', sets: 4, reps: '30 sec', rest_seconds: 30 },
        { name: 'Jump Squats', sets: 4, reps: '20 sec', rest_seconds: 40 },
      ],
    }],
  },
];

export default function WorkoutPrograms() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selected, setSelected] = useState<WorkoutProgram | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<ProgramWorkout | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'current' | 'workout'>('list');

  useEffect(() => { loadProgress(); }, []);

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const saved = localStorage.getItem(`wp_${user.id}`);
      if (saved) {
        const p = JSON.parse(saved);
        setProgress(p);
        const prog = PROGRAMS.find(x => x.id === p.program_id);
        if (prog) { setSelected(prog); setView('current'); }
      }
    } catch {}
  };

  const startProgram = async (prog: WorkoutProgram) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const p: UserProgress = { program_id: prog.id, current_week: 1, current_day: 1, completed_workouts: 0, start_date: new Date().toISOString().split('T')[0] };
      localStorage.setItem(`wp_${user.id}`, JSON.stringify(p));
      setProgress(p); setSelected(prog); setView('current');
    } catch {} finally { setLoading(false); }
  };

  const completeWorkout = async () => {
    if (!progress || !selected) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const np = { ...progress, completed_workouts: progress.completed_workouts + 1, last_workout_date: new Date().toISOString().split('T')[0] };
      if (progress.current_day < selected.workouts_per_week) np.current_day = progress.current_day + 1;
      else if (progress.current_week < selected.duration_weeks) { np.current_week = progress.current_week + 1; np.current_day = 1; }
      localStorage.setItem(`wp_${user.id}`, JSON.stringify(np));
      await supabase.from('workout_logs').insert({ user_id: user.id, date: np.last_workout_date, workout_type: 'program', program_name: selected.name, workout_name: currentWorkout?.name, duration_minutes: currentWorkout?.estimated_duration ?? 0, exercises_completed: currentWorkout?.exercises.length ?? 0 });
      setProgress(np); setCurrentWorkout(null); setView('current');
    } catch {} finally { setLoading(false); }
  };

  const pct = () => {
    if (!progress || !selected) return 0;
    return Math.round((progress.completed_workouts / (selected.duration_weeks * selected.workouts_per_week)) * 100);
  };

  const todayWorkout = () => selected?.workouts.find(w => w.week === progress?.current_week && w.day === progress?.current_day) ?? null;

  // ── Workout detail view ──────────────────────────────────────────────────────
  if (view === 'workout' && currentWorkout) return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setView('current')} className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-gray-900 transition-colors">
          <ChevronRight size={14} className="rotate-180" /> Back
        </button>
        <span className="text-[11px] font-black text-gray-400">Week {progress?.current_week} · Day {progress?.current_day}</span>
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
        <h3 className="text-[16px] font-black text-gray-900 mb-1">{currentWorkout.name}</h3>
        <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-5">
          <span className="flex items-center gap-1"><Clock size={11} />{currentWorkout.estimated_duration} min</span>
          <span className="flex items-center gap-1"><Target size={11} />{currentWorkout.exercises.length} exercises</span>
        </div>
        <div className="space-y-2">
          {currentWorkout.exercises.map((ex, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500">{i + 1}</span>
                  <span className="text-[13px] font-black text-gray-900">{ex.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  <span><strong className="text-gray-900">{ex.sets}</strong> sets</span>
                  <span><strong className="text-gray-900">{ex.reps}</strong> reps</span>
                  <span><strong className="text-gray-900">{ex.rest_seconds}s</strong> rest</span>
                </div>
              </div>
              {ex.notes && <p className="text-[10px] text-amber-600 mt-1.5 ml-8">💡 {ex.notes}</p>}
            </div>
          ))}
        </div>
        <button onClick={completeWorkout} disabled={loading}
          className="w-full mt-5 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-xl text-[13px] font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
          {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={15} />}
          {loading ? 'Saving…' : 'Complete Workout'}
        </button>
      </div>
    </div>
  );

  // ── Current program view ─────────────────────────────────────────────────────
  if (view === 'current' && selected && progress) {
    const today = todayWorkout();
    const done = pct();
    const completed = done >= 100;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronRight size={14} className="rotate-180" /> All Programs
          </button>
          <span className="text-[11px] font-black text-gray-400">Day {progress.completed_workouts + 1} of {selected.duration_weeks * selected.workouts_per_week}</span>
        </div>

        {/* Program header */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[16px] font-black text-gray-900">{selected.name}</h2>
              <p className="text-[12px] text-gray-500 mt-0.5">{selected.description}</p>
            </div>
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-black capitalize ${DIFFICULTY_CONFIG[selected.difficulty].pill}`}>
              {selected.difficulty}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-gray-400">Progress</span>
            <span className="text-[10px] font-black text-gray-700">{done}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gray-900 rounded-full transition-all duration-500" style={{ width: `${done}%` }} />
          </div>
        </div>

        {/* Today's workout */}
        {completed ? (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <Trophy size={20} className="text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-[13px] font-black text-emerald-800">Program Complete! 🎉</p>
              <p className="text-[11px] text-emerald-600">You finished {selected.name}</p>
            </div>
          </div>
        ) : today ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Today's Workout</p>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-black text-gray-900">{today.name}</h3>
                <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Clock size={11} />{today.estimated_duration} min</span>
                  <span className="flex items-center gap-1"><Target size={11} />{today.exercises.length} exercises</span>
                </div>
              </div>
              <button onClick={() => { setCurrentWorkout(today); setView('workout'); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-[12px] font-black hover:bg-gray-800 transition-colors">
                <Play size={12} fill="currentColor" /> Start
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
            <p className="text-[13px] text-gray-500">No workout today — rest and recover!</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Done', value: progress.completed_workouts, color: 'text-blue-600' },
            { label: 'Week', value: progress.current_week, color: 'text-emerald-600' },
            { label: 'Weeks', value: selected.duration_weeks, color: 'text-purple-600' },
            { label: '/Week', value: selected.workouts_per_week, color: 'text-orange-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className={`text-[22px] font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-400 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Programs list ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-black text-gray-900">Workout Programs</h2>
        {progress && (
          <button onClick={() => setView('current')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-xl text-[11px] font-black hover:bg-gray-800 transition-colors">
            <Zap size={11} /> Current Program
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROGRAMS.map(prog => {
          const cfg = DIFFICULTY_CONFIG[prog.difficulty];
          const isActive = progress?.program_id === prog.id;
          return (
            <div key={prog.id} className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${isActive ? 'border-gray-900' : 'border-gray-100'}`}>
              {/* Top accent bar */}
              <div className={`h-1 w-full ${cfg.bar}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[14px] font-black text-gray-900 leading-snug pr-2">{prog.name}</h3>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-black capitalize ${cfg.pill}`}>{prog.difficulty}</span>
                </div>
                <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">{prog.description}</p>

                {/* Meta */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { icon: Calendar, label: 'Duration', val: `${prog.duration_weeks}w` },
                    { icon: Dumbbell, label: 'Frequency', val: `${prog.workouts_per_week}×/wk` },
                    { icon: Clock, label: 'Per session', val: `~${prog.estimated_time_minutes}m` },
                  ].map(m => (
                    <div key={m.label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <m.icon size={12} className="text-gray-400 mx-auto mb-1" />
                      <p className="text-[12px] font-black text-gray-900">{m.val}</p>
                      <p className="text-[9px] text-gray-400">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Muscles */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {prog.target_muscle_groups.map(g => (
                    <span key={g} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-lg">{g}</span>
                  ))}
                </div>

                {/* Benefits */}
                <ul className="space-y-1 mb-4">
                  {prog.benefits.slice(0, 3).map((b, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                      <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />{b}
                    </li>
                  ))}
                </ul>

                <button onClick={() => startProgram(prog)} disabled={loading || isActive}
                  className={`w-full py-2.5 rounded-xl text-[12px] font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}>
                  {loading ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : isActive ? <><CheckCircle size={13} /> Active Program</>
                    : <><Play size={13} fill="currentColor" /> Start Program</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-[11px] font-black text-blue-700 mb-2">💡 Tips for success</p>
        <ul className="space-y-1">
          {['Choose a program matching your fitness level', 'Consistency beats intensity every time', 'Rest days are essential for muscle recovery'].map((t, i) => (
            <li key={i} className="text-[11px] text-blue-600 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />{t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
