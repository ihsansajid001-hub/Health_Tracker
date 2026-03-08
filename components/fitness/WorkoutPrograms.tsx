'use client';

import { useState } from 'react';
import { Play, Calendar, Flame, TrendingUp, Lock } from 'lucide-react';

export default function WorkoutPrograms() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const programs = [
    {
      id: '30_day_abs',
      name: '30-Day Abs Challenge',
      difficulty: 'beginner',
      duration: 30,
      workoutsPerWeek: 5,
      avgDuration: 15,
      totalCalories: 3000,
      description: 'Build a strong core in 30 days with progressive ab workouts',
      goals: ['Six pack abs', 'Core strength', 'Better posture'],
      locked: false,
    },
    {
      id: '30_day_full_body',
      name: '30-Day Full Body Transform',
      difficulty: 'intermediate',
      duration: 30,
      workoutsPerWeek: 6,
      avgDuration: 30,
      totalCalories: 9000,
      description: 'Complete body transformation with varied workouts',
      goals: ['Weight loss', 'Muscle gain', 'Overall fitness'],
      locked: false,
    },
    {
      id: 'fat_burn_extreme',
      name: 'Fat Burn Extreme',
      difficulty: 'advanced',
      duration: 21,
      workoutsPerWeek: 6,
      avgDuration: 45,
      totalCalories: 12000,
      description: 'High-intensity program for maximum fat burning',
      goals: ['Rapid weight loss', 'Endurance', 'Cardio fitness'],
      locked: false,
    },
    {
      id: 'beginner_start',
      name: 'Beginner Start',
      difficulty: 'beginner',
      duration: 14,
      workoutsPerWeek: 3,
      avgDuration: 20,
      totalCalories: 1500,
      description: 'Perfect introduction to fitness for complete beginners',
      goals: ['Build habit', 'Basic fitness', 'Confidence'],
      locked: false,
    },
    {
      id: 'chest_builder',
      name: 'Chest Builder Pro',
      difficulty: 'intermediate',
      duration: 28,
      workoutsPerWeek: 4,
      avgDuration: 25,
      totalCalories: 4500,
      description: 'Focused chest development program',
      goals: ['Chest muscles', 'Upper body strength', 'Push-up mastery'],
      locked: false,
    },
    {
      id: 'leg_day_master',
      name: 'Leg Day Master',
      difficulty: 'intermediate',
      duration: 28,
      workoutsPerWeek: 4,
      avgDuration: 30,
      totalCalories: 5000,
      description: 'Build powerful legs with progressive training',
      goals: ['Leg strength', 'Squat mastery', 'Lower body power'],
      locked: false,
    },
  ];

  const filteredPrograms = programs.filter(program => {
    if (selectedDifficulty === 'all') return true;
    return program.difficulty === selectedDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Difficulty Filter */}
      <div className="flex space-x-2">
        {['all', 'beginner', 'intermediate', 'advanced'].map(difficulty => (
          <button
            key={difficulty}
            onClick={() => setSelectedDifficulty(difficulty)}
            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors ${
              selectedDifficulty === difficulty
                ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            {difficulty}
          </button>
        ))}
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map(program => (
          <div
            key={program.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Program Header */}
            <div className="p-6 bg-gradient-to-r from-red-500 to-orange-500">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white">{program.name}</h3>
                {program.locked && (
                  <Lock size={20} className="text-white/80" />
                )}
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(program.difficulty)}`}>
                {program.difficulty}
              </span>
            </div>

            {/* Program Details */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {program.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-gray-900 dark:text-white font-semibold">{program.duration} days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp size={16} className="text-gray-500" />
                  <span className="text-gray-900 dark:text-white font-semibold">{program.workoutsPerWeek}x/week</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Play size={16} className="text-gray-500" />
                  <span className="text-gray-900 dark:text-white font-semibold">{program.avgDuration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame size={16} className="text-orange-500" />
                  <span className="text-gray-900 dark:text-white font-semibold">{program.totalCalories} cal</span>
                </div>
              </div>

              {/* Goals */}
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Goals:</p>
                <div className="flex flex-wrap gap-2">
                  {program.goals.map((goal, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <button
                disabled={program.locked}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
                  program.locked
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:shadow-lg transform hover:scale-[1.02]'
                }`}
              >
                {program.locked ? (
                  <>
                    <Lock size={20} />
                    <span>Locked</span>
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    <span>Start Program</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
