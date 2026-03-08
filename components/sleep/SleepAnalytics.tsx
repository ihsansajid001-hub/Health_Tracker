'use client';

import { useState } from 'react';
import { TrendingUp, Moon, Clock, Star, Calendar } from 'lucide-react';

export default function SleepAnalytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Mock data - replace with real data from database
  const weeklyData = {
    averageHours: 7.2,
    averageQuality: 7.5,
    sleepScore: 78,
    consistency: 85,
    totalNights: 7,
    goalNights: 5,
  };

  const sleepTrend = [
    { day: 'Mon', hours: 7.5, quality: 8 },
    { day: 'Tue', hours: 6.8, quality: 6 },
    { day: 'Wed', hours: 7.2, quality: 7 },
    { day: 'Thu', hours: 8.0, quality: 9 },
    { day: 'Fri', hours: 6.5, quality: 6 },
    { day: 'Sat', hours: 8.5, quality: 9 },
    { day: 'Sun', hours: 7.8, quality: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex space-x-2">
        {(['week', 'month', 'year'] as const).map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors ${
              timeRange === range
                ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Sleep Score Card */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <p className="text-purple-100 mb-2">Your Sleep Score</p>
          <div className="text-7xl font-bold mb-2">{weeklyData.sleepScore}</div>
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp size={20} />
            <span className="text-purple-100">+5 from last week</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Clock size={24} className="text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg Hours</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {weeklyData.averageHours}h
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Star size={24} className="text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg Quality</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {weeklyData.averageQuality}/10
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Moon size={24} className="text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Consistency</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {weeklyData.consistency}%
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar size={24} className="text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Goal Nights</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {weeklyData.goalNights}/{weeklyData.totalNights}
          </div>
        </div>
      </div>

      {/* Sleep Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Sleep Duration Trend
        </h3>
        <div className="space-y-3">
          {sleepTrend.map((day, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <span className="w-12 text-sm text-gray-600 dark:text-gray-400">{day.day}</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-end pr-3"
                  style={{ width: `${(day.hours / 12) * 100}%` }}
                >
                  <span className="text-white text-sm font-semibold">{day.hours}h</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{day.quality}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sleep Insights */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-3">
          💡 Sleep Insights
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li>• You sleep best on weekends (8+ hours)</li>
          <li>• Your sleep quality drops on Tuesdays and Fridays</li>
          <li>• Try going to bed 30 minutes earlier on weekdays</li>
          <li>• Your consistency is excellent - keep it up!</li>
        </ul>
      </div>

      {/* Sleep Patterns */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Sleep Patterns
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Light Sleep</span>
              <span className="font-semibold text-gray-900 dark:text-white">45%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div className="bg-blue-400 h-3 rounded-full" style={{ width: '45%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Deep Sleep</span>
              <span className="font-semibold text-gray-900 dark:text-white">25%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '25%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">REM Sleep</span>
              <span className="font-semibold text-gray-900 dark:text-white">20%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div className="bg-purple-500 h-3 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Awake</span>
              <span className="font-semibold text-gray-900 dark:text-white">10%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div className="bg-orange-400 h-3 rounded-full" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
