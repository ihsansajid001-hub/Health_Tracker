'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface Props {
  exerciseName: string;
  duration?: number;
  reps?: number;
  onComplete?: () => void;
  showVoiceCoach?: boolean;
}

const ICONS: Record<string, string> = {
  'push-ups': '🤸', 'push ups': '🤸', 'squats': '🏋️', 'plank': '🧘',
  'burpees': '💪', 'jumping jacks': '🏃', 'crunches': '🔥',
  'bicycle crunches': '🚴', 'mountain climbers': '⛰️',
};

const PHASE_CONFIG = {
  prepare:  { label: 'Get Ready!',   color: 'text-amber-500',   bg: 'bg-amber-50 border-amber-100' },
  exercise: { label: 'Keep Going!',  color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
  rest:     { label: 'Rest…',        color: 'text-orange-500',    bg: 'bg-orange-50 border-orange-100' },
  complete: { label: 'Complete! 🎉', color: 'text-purple-500',  bg: 'bg-purple-50 border-purple-100' },
};

export default function ExerciseAnimation({ exerciseName, duration = 30, reps = 10, onComplete, showVoiceCoach = true }: Props) {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [rep, setRep] = useState(0);
  const [voice, setVoice] = useState(true);
  const [phase, setPhase] = useState<'prepare' | 'exercise' | 'rest' | 'complete'>('prepare');

  useEffect(() => {
    if (!playing || time >= duration) return;
    const id = setInterval(() => {
      setTime(prev => {
        const t = prev + 1;
        const newRep = Math.floor(t / (duration / reps));
        if (newRep !== rep && newRep < reps) {
          setRep(newRep);
          if (voice && showVoiceCoach) speak(`${newRep + 1}`);
        }
        if (t >= duration) {
          setPhase('complete'); setPlaying(false); onComplete?.();
          if (voice && showVoiceCoach) speak('Exercise complete! Great job!');
        } else if (t > 3) setPhase('exercise');
        return t;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, time, duration, reps, rep, voice, showVoiceCoach, onComplete]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.8; speechSynthesis.speak(u);
    }
  };

  const handleStart = () => {
    setPlaying(true); setPhase('prepare');
    if (voice && showVoiceCoach) speak(`Starting ${exerciseName}. Get ready!`);
  };
  const handleReset = () => { setPlaying(false); setTime(0); setRep(0); setPhase('prepare'); };

  const pct = (time / duration) * 100;
  const icon = ICONS[exerciseName.toLowerCase()] ?? '🏃';
  const ph = PHASE_CONFIG[phase];

  const R = 60; const circ = 2 * Math.PI * R;

  return (
    <div className="max-w-sm mx-auto space-y-5">

      {/* Exercise name */}
      <div className="text-center">
        <h2 className="text-[18px] font-black text-gray-900">{exerciseName}</h2>
      </div>

      {/* Ring + emoji */}
      <div className="relative flex items-center justify-center" style={{ height: 160 }}>
        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          <circle cx="80" cy="80" r={R} fill="none" stroke="#F3F4F6" strokeWidth="6" />
          <circle cx="80" cy="80" r={R} fill="none" stroke="#111827" strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="relative z-10 text-center">
          <div className={`text-5xl ${playing ? 'animate-bounce' : ''}`}>{icon}</div>
        </div>
      </div>

      {/* Phase badge */}
      <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl border text-[12px] font-black mx-auto w-fit ${ph.bg}`}>
        <span className={ph.color}>{ph.label}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Time', value: `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}` },
          { label: 'Reps', value: `${rep + 1}/${reps}` },
          { label: 'Left', value: `${duration - time}s` },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 rounded-xl border border-gray-100 p-3 text-center">
            <p className="text-[18px] font-black text-gray-900 tabular-nums">{s.value}</p>
            <p className="text-[10px] text-gray-400 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gray-900 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!playing && time === 0 ? (
          <button onClick={handleStart}
            className="flex items-center gap-2 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-[13px] font-black transition-all active:scale-[0.97]">
            <Play size={14} fill="currentColor" /> Start
          </button>
        ) : (
          <>
            <button onClick={playing ? () => setPlaying(false) : () => setPlaying(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-[13px] font-black transition-all active:scale-[0.97]">
              {playing ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              {playing ? 'Pause' : 'Resume'}
            </button>
            <button onClick={handleReset}
              className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <RotateCcw size={15} className="text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Voice toggle */}
      {showVoiceCoach && (
        <div className="flex justify-center">
          <button onClick={() => setVoice(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black transition-all ${
              voice ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-500'
            }`}>
            {voice ? <Volume2 size={13} /> : <VolumeX size={13} />}
            Voice Coach {voice ? 'On' : 'Off'}
          </button>
        </div>
      )}
    </div>
  );
}
