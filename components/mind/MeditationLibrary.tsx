'use client';

import { useState } from 'react';
import { Play, Clock, Star } from 'lucide-react';
import meditationsData from '@/data/meditations.json';

interface MeditationLibraryProps {
  onStartMeditation?: (meditationId: string) => void;
}

export default function MeditationLibrary({ onStartMeditation }: MeditationLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState(meditationsData.categories[0].id);

  const currentCategory = meditationsData.categories.find(c => c.id === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'advanced': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {meditationsData.categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Meditation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCategory?.sessions.map(session => (
          <div
            key={session.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Session Header */}
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
              <h3 className="text-lg font-bold text-white">{session.name}</h3>
              <div className="flex items-center space-x-2 mt-2">
                <Clock size={16} className="text-white/80" />
                <span className="text-white/90 text-sm">{session.duration} minutes</span>
              </div>
            </div>

            {/* Session Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(session.difficulty)}`}>
                  {session.difficulty}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {session.description}
              </p>

              {/* Benefits */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Benefits:
                </p>
                <div className="flex flex-wrap gap-1">
                  {session.benefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={() => onStartMeditation?.(session.id)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transform hover:scale-[1.02] transition-all"
              >
                <Play size={20} />
                <span>Start Meditation</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
