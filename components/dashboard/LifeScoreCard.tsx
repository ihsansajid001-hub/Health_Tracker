'use client';

import { LifeScore } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props { score: LifeScore | null; previousScore?: number; }

export default function LifeScoreCard({ score, previousScore }: Props) {
  if (!score) return (
    <div className="card p-8 animate-pulse">
      <div className="h-48 bg-gray-100 rounded-2xl" />
    </div>
  );

  const getLevel = (s: number) => {
    if (s >= 90) return { level: 'Exceptional', color: '#F97316' };
    if (s >= 80) return { level: 'Excellent',   color: '#FB923C' };
    if (s >= 70) return { level: 'Good',         color: '#FDBA74' };
    if (s >= 60) return { level: 'Fair',         color: '#FED7AA' };
    return              { level: 'Needs Work',   color: '#1A1A1A' };
  };

  const { level, color } = getLevel(score.overall);
  const change = previousScore ? score.overall - previousScore : 0;
  const circ   = 2 * Math.PI * 80;
  const dash   = (score.overall / 100) * circ;

  // Each category gets a different orange shade
  const categories = [
    { label: 'Sleep',     value: score.sleep,     color: '#F97316' },
    { label: 'Fitness',   value: score.fitness,   color: '#EA580C' },
    { label: 'Nutrition', value: score.nutrition, color: '#FB923C' },
    { label: 'Mind',      value: score.mind,      color: '#FDBA74' },
    { label: 'Hydration', value: score.hydration, color: '#1A1A1A' },
  ];

  return (
    <div className="card p-7 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="section-tag mb-1">// Life Score</p>
          <h2 className="text-2xl font-black text-gray-900">Life Performance Score</h2>
        </div>
        {change !== 0 && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${
            change > 0 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
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
            <circle cx="100" cy="100" r="80" stroke="#f3f4f6" strokeWidth="8" fill="none" />
            <circle cx="100" cy="100" r="80" stroke={color} strokeWidth="8" fill="none"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
              className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black tabular-nums" style={{ color }}>{score.overall}</span>
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">{level}</span>
          </div>
        </div>
      </div>

      {/* Category bars */}
      <div className="space-y-2.5">
        {categories.map(c => (
          <div key={c.label} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-16 font-semibold">{c.label}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${c.value}%`, backgroundColor: c.color }} />
            </div>
            <span className="text-xs font-black text-gray-700 w-7 text-right tabular-nums">{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
