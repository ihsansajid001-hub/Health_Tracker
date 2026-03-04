'use client';

import { LifeScore } from '@/types';
import { LifeScoreEngine } from '@/services/lifeScoreEngine';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  score: LifeScore | null;
  previousScore?: number;
}

export default function LifeScoreCard({ score, previousScore }: Props) {
  if (!score) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  const { level, color, message } = LifeScoreEngine.getScoreLevel(score.overall);
  const change = previousScore ? score.overall - previousScore : 0;

  const getColorClasses = (colorName: string) => {
    const colors: Record<string, string> = {
      green: 'from-green-500 to-green-700',
      blue: 'from-blue-500 to-blue-700',
      yellow: 'from-yellow-500 to-yellow-700',
      orange: 'from-orange-500 to-orange-700',
      red: 'from-red-500 to-red-700',
    };
    return colors[colorName] || colors.blue;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Life Performance Score
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>
        {change !== 0 && (
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
            change > 0 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
            'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-semibold">{Math.abs(change)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          {/* Circular Progress */}
          <svg className="transform -rotate-90" width="200" height="200">
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${(score.overall / 100) * 565} 565`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={`text-${color}-500`} stopColor="currentColor" />
                <stop offset="100%" className={`text-${color}-700`} stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-6xl font-bold bg-gradient-to-r ${getColorClasses(color)} bg-clip-text text-transparent`}>
              {score.overall}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {level}
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sleep', value: score.sleep, icon: '😴' },
          { label: 'Fitness', value: score.fitness, icon: '💪' },
          { label: 'Nutrition', value: score.nutrition, icon: '🥗' },
          { label: 'Mind', value: score.mind, icon: '🧘' },
          { label: 'Hydration', value: score.hydration, icon: '💧' },
          { label: 'Consistency', value: score.consistency, icon: '🎯' },
        ].map((category) => (
          <div key={category.label} className="text-center">
            <div className="text-2xl mb-1">{category.icon}</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {category.value}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {category.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
