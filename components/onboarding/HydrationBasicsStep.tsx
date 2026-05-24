'use client';

import { useState } from 'react';

interface HydrationBasicsStepProps {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function HydrationBasicsStep({ data, setData, onNext, onBack }: HydrationBasicsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reminderIntervals = [
    { value: 60, label: 'Every hour', icon: '⏰' },
    { value: 90, label: 'Every 1.5 hours', icon: '⏱️' },
    { value: 120, label: 'Every 2 hours', icon: '🕐' },
    { value: 180, label: 'Every 3 hours', icon: '🕒' },
    { value: 0, label: 'No reminders', icon: '🔕' }
  ];

  const containerSizes = [
    { value: 250, label: 'Small Glass', size: '250ml', icon: '🥃' },
    { value: 350, label: 'Large Glass', size: '350ml', icon: '🥛' },
    { value: 500, label: 'Water Bottle', size: '500ml', icon: '🍼' },
    { value: 750, label: 'Large Bottle', size: '750ml', icon: '🍶' },
    { value: 1000, label: 'Big Bottle', size: '1L', icon: '🧴' }
  ];

  const calculateWaterGoal = () => {
    const weight = data.weight || 70;
    let baseGoal = weight * 35; // 35ml per kg body weight
    
    // Adjust for activity level
    if (data.activity_level === 'very_active') {
      baseGoal += 500;
    } else if (data.activity_level === 'active') {
      baseGoal += 300;
    } else if (data.activity_level === 'moderate') {
      baseGoal += 200;
    }
    
    return Math.round(baseGoal);
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.wake_time) {
      newErrors.wake_time = 'Please select your wake-up time';
    }
    if (!data.bed_time) {
      newErrors.bed_time = 'Please select your bedtime';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Set calculated water goal
    const waterGoal = calculateWaterGoal();
    setData({ ...data, daily_water_goal: waterGoal });

    setErrors({});
    onNext();
  };

  const waterGoal = calculateWaterGoal();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">💧</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Stay Hydrated
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set up smart reminders to maintain optimal hydration
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-orange-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Your Personalized Water Goal
          </h4>
          <div className="text-2xl font-bold text-orange-500 dark:text-orange-400">
            {waterGoal.toLocaleString()} ml/day
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200 mt-1">
            Based on your weight ({data.weight || 70}kg) and activity level
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wake-up Time
            </label>
            <input
              type="time"
              value={data.wake_time || '07:00'}
              onChange={(e) => setData({ ...data, wake_time: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.wake_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.wake_time && (
              <p className="text-red-500 text-sm mt-1">{errors.wake_time}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bedtime
            </label>
            <input
              type="time"
              value={data.bed_time || '22:00'}
              onChange={(e) => setData({ ...data, bed_time: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.bed_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.bed_time && (
              <p className="text-red-500 text-sm mt-1">{errors.bed_time}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Reminder Frequency
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reminderIntervals.map((interval) => (
              <button
                key={interval.value}
                onClick={() => setData({ ...data, reminder_interval_minutes: interval.value })}
                className={`p-3 border-2 rounded-lg text-left transition-colors ${
                  data.reminder_interval_minutes === interval.value
                    ? 'border-orange-500 bg-orange-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{interval.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {interval.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preferred Container Size
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {containerSizes.map((container) => (
              <button
                key={container.value}
                onClick={() => setData({ ...data, preferred_container_size: container.value })}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  data.preferred_container_size === container.value
                    ? 'border-orange-500 bg-orange-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">{container.icon}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {container.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {container.size}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">Hydration Benefits</h4>
          <div className="text-sm text-cyan-800 dark:text-cyan-200 space-y-1">
            <p>• Improved energy and mental clarity</p>
            <p>• Better skin health and appearance</p>
            <p>• Enhanced physical performance</p>
            <p>• Optimal body temperature regulation</p>
            <p>• Supports kidney and liver function</p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Smart Reminders</h4>
          <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
            <p>• Wake-up reminder: Start your day hydrated</p>
            <p>• Pre-meal reminders: 30 minutes before meals</p>
            <p>• Regular intervals: Based on your preference</p>
            <p>• Bedtime reminder: Last chance to hydrate</p>
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