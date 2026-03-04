'use client';

import { useEffect, useState } from 'react';
import { Flame, Trophy } from 'lucide-react';

export default function StreakCard() {
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const response = await fetch('/api/streak');
      if (response.ok) {
        const data = await response.json();
        setStreak(data);
      }
    } catch (error) {
      console.error('Failed to fetch streak:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl shadow-lg p-8 text-white animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Your Streak</h3>
        <Flame size={32} className="animate-pulse" />
      </div>

      <div className="text-center mb-6">
        <div className="text-6xl font-bold mb-2">{streak.current}</div>
        <div className="text-white/80">Days in a row!</div>
      </div>

      <div className="flex items-center justify-center space-x-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
        <Trophy size={20} />
        <span className="text-sm">
          Personal Best: <strong>{streak.longest} days</strong>
        </span>
      </div>

      {streak.current >= 7 && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg text-center text-sm backdrop-blur-sm animate-celebration">
          🎉 Amazing! Keep it going!
        </div>
      )}
    </div>
  );
}
