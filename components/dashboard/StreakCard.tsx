'use client';

import { useEffect, useState } from 'react';
import { Flame, Trophy } from 'lucide-react';

export default function StreakCard() {
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    fetch('/api/streak').then(r => r.ok ? r.json() : null).then(d => d && setStreak(d)).catch(() => {});
  }, []);

  return (
    <div className="bg-gray-900 dark:bg-black rounded-3xl p-7 text-white h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/15 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="section-tag text-white/30 mb-1">// Streak</p>
            <h3 className="text-xl font-black">Your Streak</h3>
          </div>
          <div className="w-11 h-11 bg-orange-500/20 rounded-2xl flex items-center justify-center">
            <Flame size={22} className="text-orange-400" />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
          <div className="text-8xl font-black leading-none tabular-nums mb-2">{streak.current}</div>
          <div className="text-white/40 font-semibold text-sm">Days in a row</div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <Trophy size={16} className="text-orange-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-white/60">
            Best: <strong className="text-white">{streak.longest} days</strong>
          </span>
        </div>

        {streak.current >= 7 && (
          <div className="mt-3 p-3 bg-orange-500/15 border border-orange-500/20 rounded-2xl text-center text-sm font-bold text-orange-300">
            🎉 Amazing! Keep it going!
          </div>
        )}
      </div>
    </div>
  );
}
