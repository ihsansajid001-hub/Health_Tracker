'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

const PRESETS = [30, 60, 90, 120];

export default function RestTimer() {
  const [restTime, setRestTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setActive(false);
          setDone(true);
          new Audio('/sounds/beep.mp3').play().catch(() => {});
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const start  = () => { setActive(true); setDone(false); };
  const pause  = () => setActive(false);
  const reset  = () => { setActive(false); setTimeLeft(restTime); setDone(false); };
  const adjust = (n: number) => {
    const v = Math.max(10, Math.min(300, restTime + n));
    setRestTime(v);
    if (!active) setTimeLeft(v);
  };
  const pick = (s: number) => { setRestTime(s); setTimeLeft(s); setDone(false); setActive(false); };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const pct = ((restTime - timeLeft) / restTime) * 100;

  const R = 88;
  const circ = 2 * Math.PI * R;

  return (
    <div className="max-w-sm mx-auto space-y-6">

      {/* Ring */}
      <div className="relative flex items-center justify-center" style={{ height: 220 }}>
        <svg width="220" height="220" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          <circle cx="110" cy="110" r={R} fill="none" stroke="#F3F4F6" strokeWidth="8" />
          <circle cx="110" cy="110" r={R} fill="none"
            stroke={done ? '#10B981' : '#111827'}
            strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct / 100)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
          />
        </svg>
        <div className="relative z-10 text-center">
          <p className={`text-[52px] font-black tabular-nums leading-none ${done ? 'text-emerald-500' : 'text-gray-900'}`}>
            {fmt(timeLeft)}
          </p>
          <p className="text-[12px] font-semibold text-gray-400 mt-1">
            {done ? '✓ Rest complete' : active ? 'Resting…' : 'Ready'}
          </p>
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map(s => (
          <button key={s} onClick={() => pick(s)}
            className={`py-2 rounded-xl text-[12px] font-black transition-all ${
              restTime === s && !active
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {s}s
          </button>
        ))}
      </div>

      {/* Adjust */}
      {!active && !done && (
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => adjust(-10)}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <Minus size={16} className="text-gray-600" />
          </button>
          <span className="text-[15px] font-black text-gray-700 w-16 text-center">{restTime}s</span>
          <button onClick={() => adjust(10)}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!active ? (
          <button onClick={start}
            className="flex items-center gap-2 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-[13px] font-black transition-all active:scale-[0.97]">
            <Play size={15} fill="currentColor" /> Start
          </button>
        ) : (
          <button onClick={pause}
            className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[13px] font-black transition-all active:scale-[0.97]">
            <Pause size={15} /> Pause
          </button>
        )}
        <button onClick={reset}
          className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <RotateCcw size={16} className="text-gray-600" />
        </button>
      </div>

      <p className="text-center text-[11px] text-gray-400">
        Rest between sets to maximise performance and prevent injury
      </p>
    </div>
  );
}
