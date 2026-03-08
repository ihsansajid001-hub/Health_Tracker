'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ExerciseLibrary from '@/components/fitness/ExerciseLibrary';
import WorkoutPrograms from '@/components/fitness/WorkoutPrograms';
import RestTimer from '@/components/fitness/RestTimer';
import { Dumbbell, Library, TrendingUp, Timer } from 'lucide-react';

type Tab = 'library' | 'programs' | 'timer' | 'progress';

export default function FitnessPage() {
  const [activeTab, setActiveTab] = useState<Tab>('library');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
            <Dumbbell size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Fitness & Workouts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              100+ bodyweight exercises, workout programs, and progress tracking
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'library'
                ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <Library size={20} />
            <span>Exercise Library</span>
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'programs'
                ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <Dumbbell size={20} />
            <span>Workout Programs</span>
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'timer'
                ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <Timer size={20} />
            <span>Rest Timer</span>
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'progress'
                ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <TrendingUp size={20} />
            <span>Progress</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'library' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <ExerciseLibrary
              userConditions={[]}
              onStartExercise={(id) => console.log('Start exercise:', id)}
            />
          </div>
        )}

        {activeTab === 'programs' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <WorkoutPrograms />
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <RestTimer />
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Progress
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Coming soon: Workout history, achievements, and progress tracking
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
