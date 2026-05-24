'use client';

import { useState } from 'react';

interface SleepBasicsStepProps {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SleepBasicsStep({ data, setData, onNext, onBack }: SleepBasicsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.target_bedtime) {
      newErrors.target_bedtime = 'Please select your typical bedtime';
    }
    if (!data.target_wake_time) {
      newErrors.target_wake_time = 'Please select your typical wake time';
    }
    if (!data.target_sleep_hours || data.target_sleep_hours < 4 || data.target_sleep_hours > 12) {
      newErrors.target_sleep_hours = 'Sleep hours should be between 4-12 hours';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  const calculateSleepHours = () => {
    if (data.target_bedtime && data.target_wake_time) {
      const bedtime = new Date(`2000-01-01T${data.target_bedtime}:00`);
      let waketime = new Date(`2000-01-01T${data.target_wake_time}:00`);
      
      // If wake time is earlier than bedtime, it's next day
      if (waketime <= bedtime) {
        waketime = new Date(`2000-01-02T${data.target_wake_time}:00`);
      }
      
      const diffMs = waketime.getTime() - bedtime.getTime();
      const hours = Math.round(diffMs / (1000 * 60 * 60) * 10) / 10;
      
      setData({ ...data, target_sleep_hours: hours });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">😴</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Sleep Routine
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help us understand your sleep patterns to provide better recommendations
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Typical Bedtime
          </label>
          <input
            type="time"
            value={data.target_bedtime || '23:00'}
            onChange={(e) => {
              setData({ ...data, target_bedtime: e.target.value });
              setTimeout(calculateSleepHours, 100);
            }}
            className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.target_bedtime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.target_bedtime && (
            <p className="text-red-500 text-sm mt-1">{errors.target_bedtime}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Typical Wake Time
          </label>
          <input
            type="time"
            value={data.target_wake_time || '07:00'}
            onChange={(e) => {
              setData({ ...data, target_wake_time: e.target.value });
              setTimeout(calculateSleepHours, 100);
            }}
            className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.target_wake_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.target_wake_time && (
            <p className="text-red-500 text-sm mt-1">{errors.target_wake_time}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Sleep Hours: {data.target_sleep_hours || 8} hours
          </label>
          <input
            type="range"
            min="4"
            max="12"
            step="0.5"
            value={data.target_sleep_hours || 8}
            onChange={(e) => setData({ ...data, target_sleep_hours: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4h</span>
            <span>8h</span>
            <span>12h</span>
          </div>
          {errors.target_sleep_hours && (
            <p className="text-red-500 text-sm mt-1">{errors.target_sleep_hours}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Sleep Quality (1-10)
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Poor</span>
            <input
              type="range"
              min="1"
              max="10"
              value={data.sleep_quality || 7}
              onChange={(e) => setData({ ...data, sleep_quality: parseInt(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500">Excellent</span>
          </div>
          <div className="text-center mt-2">
            <span className="text-lg font-semibold text-orange-500 dark:text-orange-400">
              {data.sleep_quality || 7}/10
            </span>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Sleep Insights</h4>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p>• Recommended sleep: 7-9 hours for adults</p>
            <p>• Consistent sleep schedule improves quality</p>
            <p>• We'll track your progress and provide personalized tips</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-6">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-purple-700 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}