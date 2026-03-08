'use client';

import { useState } from 'react';
import { Play, Clock, Flame, AlertTriangle } from 'lucide-react';
import exercisesData from '@/data/exercises.json';
import { checkExerciseSafety } from '@/lib/safety/medicalConditions';

interface ExerciseLibraryProps {
  userConditions?: string[];
  onStartExercise?: (exerciseId: string) => void;
}

export default function ExerciseLibrary({ userConditions = [], onStartExercise }: ExerciseLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState(exercisesData.categories[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const currentCategory = exercisesData.categories.find(c => c.id === selectedCategory);

  const filteredExercises = currentCategory?.exercises.filter(exercise => {
    if (selectedDifficulty === 'all') return true;
    return exercise.difficulty === selectedDifficulty;
  }) || [];

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
      {/* Category Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {exercisesData.categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Difficulty Filter */}
      <div className="flex space-x-2">
        {['all', 'beginner', 'intermediate', 'advanced'].map(difficulty => (
          <button
            key={difficulty}
            onClick={() => setSelectedDifficulty(difficulty)}
            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors ${
              selectedDifficulty === difficulty
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            {difficulty}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map(exercise => {
          // Check safety
          const safetyCheck = checkExerciseSafety(
            exercise.name,
            exercise.difficulty,
            {
              conditions: userConditions as any[],
              allergies: [],
              medications: [],
              age: 30,
              weight: 70,
              height: 170,
              gender: 'male'
            }
          );

          const isBlocked = !safetyCheck.isSafe;

          return (
            <div
              key={exercise.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${
                isBlocked ? 'opacity-60' : ''
              }`}
            >
              {/* Exercise Header */}
              <div className="p-4 bg-gradient-to-r from-red-500 to-orange-500">
                <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                </div>
              </div>

              {/* Exercise Details */}
              <div className="p-4 space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {exercise.instructions}
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {exercise.reps && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Reps:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{exercise.reps}</span>
                    </div>
                  )}
                  {exercise.sets && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Sets:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{exercise.sets}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">{exercise.duration}s</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flame size={16} className="text-orange-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">{exercise.calories} cal</span>
                  </div>
                </div>

                {/* Target Muscles */}
                <div className="flex flex-wrap gap-1">
                  {exercise.targetMuscles.map(muscle => (
                    <span
                      key={muscle}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded"
                    >
                      {muscle.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                {/* Safety Warnings */}
                {isBlocked && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 rounded">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-red-700 dark:text-red-400 mb-1">
                          ⛔ Exercise Blocked
                        </p>
                        {safetyCheck.blockers.map((blocker, idx) => (
                          <p key={idx} className="text-red-600 dark:text-red-300 text-xs">
                            {blocker}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {safetyCheck.warnings.length > 0 && !isBlocked && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 rounded">
                    <div className="text-sm">
                      <p className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                        ⚠️ Caution
                      </p>
                      {safetyCheck.warnings.slice(0, 2).map((warning, idx) => (
                        <p key={idx} className="text-yellow-600 dark:text-yellow-300 text-xs">
                          {warning}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Start Button */}
                <button
                  onClick={() => !isBlocked && onStartExercise?.(exercise.id)}
                  disabled={isBlocked}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
                    isBlocked
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:shadow-lg transform hover:scale-[1.02]'
                  }`}
                >
                  <Play size={20} />
                  <span>{isBlocked ? 'Not Safe for You' : 'Start Exercise'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No exercises found for this difficulty level</p>
        </div>
      )}
    </div>
  );
}
