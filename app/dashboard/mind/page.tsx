'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MeditationLibrary from '@/components/mind/MeditationLibrary';
import BreathingExercise from '@/components/mind/BreathingExercise';
import MoodTracker from '@/components/mind/MoodTracker';
import Journal from '@/components/mind/Journal';
import { Brain, Wind, Book, Heart } from 'lucide-react';

type Tab = 'meditations' | 'breathing' | 'mood' | 'journal';

export default function MindPage() {
  const [activeTab, setActiveTab] = useState<Tab>('meditations');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mind & Mental Wellness
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Meditations, breathing exercises, mood tracking, and journaling
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('meditations')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'meditations'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            <Brain size={20} />
            <span>Meditations</span>
          </button>
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'breathing'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            <Wind size={20} />
            <span>Breathing</span>
          </button>
          <button
            onClick={() => setActiveTab('mood')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'mood'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            <Heart size={20} />
            <span>Mood Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'journal'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            <Book size={20} />
            <span>Journal</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'meditations' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <MeditationLibrary
              onStartMeditation={(id) => console.log('Start meditation:', id)}
            />
          </div>
        )}

        {activeTab === 'breathing' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <BreathingExercise />
          </div>
        )}

        {activeTab === 'mood' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <MoodTracker />
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <Journal />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
