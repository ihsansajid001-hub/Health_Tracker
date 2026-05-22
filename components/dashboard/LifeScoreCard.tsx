'use client';

import { LifeScore } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props { score: LifeScore | null; previousScore?: number; }

export default function LifeScoreCard({ score, previousScore }: Props) {
  if (!score) return (
    <div className="card p-8 animate-pulse">
      <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
    </div>
  );

  const getLevel = (s: number) => {
    if (s >= 90) return { level: 'Exceptional', color: '#22c55e' };
    if (s >= 80) return { level: 'Excellent',   color: '#f97316' };
    if (s >= 70) return { level: 'Good',         color: '#3b82f6' };
    if (s >= 60) return { level: 'Fair',         color: '#f59e0b' };
    return              { level: 'Needs Work',   color: '#ef4444' };
  };

  const { level, color } = getLevel(score.overall);
  const change = previousScore ? score.overall - previousScore : 0;
  const circ   = 2 * Math.PI * 80;
  const dash   = (score.overall / 100) * circ;

  return (
    <div className="card p-7 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="section-tag mb-1">// Life Score</p>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Life Performance Score</h2>
        </div>
        {change !== 0 && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${
            change > 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'
          }`}>
            {change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)} pts
          </div>
        )}
      </div>

      {/* Ring */}
      <div className="flex items-center justify-center mb-7">
        <div className="relative">
          <svg className="-rotate-90" width="200" height="200">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-100 dark:text-gray-800" />
            <circle cx="100" cy="100" r="80" stroke={color} strokeWidth="8" fill="none"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black tabular-nums" style={{ color }}>{score.overall}</span>
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">{level}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'Sleep',     value: score.sleep,     emoji: '😴' },
          { label: 'Fitness',   value: score.fitness,   emoji: '💪' },
          { label: 'Nutrition', value: score.nutrition, emoji: '🥗' },
          { label: 'Mind',      value: score.mind,      emoji: '🧘' },
          { label: 'Hydration', value: score.hydration, emoji: '💧' },
        ].map(c => (
          <div key={c.label} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <div className="text-lg mb-1">{c.emoji}</div>
            <div className="text-lg font-black text-gray-900 dark:text-white tabular-nums">{c.value}</div>
            <div className="text-[9px] font-black uppercase tracking-wide text-gray-300 dark:text-gray-600 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
