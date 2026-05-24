'use client';

import { useState } from 'react';

interface FitnessBasicsStepProps {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function FitnessBasicsStep({ data, setData, onNext, onBack }: FitnessBasicsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fitnessLevels = [
    {
      value: 'beginner',
      title: 'Beginner',
      description: 'New to exercise or returning after a break',
      icon: '🌱'
    },
    {
      value: 'intermediate',
      title: 'Intermediate',
      description: 'Exercise regularly, comfortable with basic movements',
      icon: '💪'
    },
    {
      value: 'advanced',
      title: 'Advanced',
      description: 'Experienced with complex exercises and high intensity',
      icon: '🔥'
    }
  ];

  const workoutTimes = [
    { value: 'morning', label: 'Morning (6-10 AM)', icon: '🌅' },
    { value: 'afternoon', label: 'Afternoon (12-4 PM)', icon: '☀️' },
    { value: 'evening', label: 'Evening (5-8 PM)', icon: '🌆' },
    { value: 'night', label: 'Night (8-11 PM)', icon: '🌙' },
    { value: 'flexible', label: 'Flexible', icon: '⏰' }
  ];

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.fitness_level) {
      newErrors.fitness_level = 'Please select your fitness level';
    }
    if (!data.workout_days_per_week || data.workout_days_per_week < 1 || data.workout_days_per_week > 7) {
      newErrors.workout_days_per_week = 'Please select 1-7 workout days per week';
    }
    if (!data.preferred_workout_time) {
      newErrors.preferred_workout_time = 'Please select your preferred workout time';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🏋️</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Fitness Level
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help us create the perfect workout plan for you
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Current Fitness Level
          </label>
          <div className="grid gap-3">
            {fitnessLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => setData({ ...data, fitness_level: level.value })}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  data.fitness_level === level.value
                    ? 'border-orange-500 bg-orange-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{level.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {level.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {level.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.fitness_level && (
            <p className="text-red-500 text-sm mt-1">{errors.fitness_level}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Workout Days Per Week: {data.workout_days_per_week || 3} days
          </label>
          <input
            type="range"
            min="1"
            max="7"
            value={data.workout_days_per_week || 3}
            onChange={(e) => setData({ ...data, workout_days_per_week: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 day</span>
            <span>4 days</span>
            <span>7 days</span>
          </div>
          {errors.workout_days_per_week && (
            <p className="text-red-500 text-sm mt-1">{errors.workout_days_per_week}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preferred Workout Time
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {workoutTimes.map((time) => (
              <button
                key={time.value}
                onClick={() => setData({ ...data, preferred_workout_time: time.value })}
                className={`p-3 border-2 rounded-lg text-left transition-colors ${
                  data.preferred_workout_time === time.value
                    ? 'border-orange-500 bg-orange-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{time.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {time.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {errors.preferred_workout_time && (
            <p className="text-red-500 text-sm mt-1">{errors.preferred_workout_time}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Any injuries or limitations? (Optional)
          </label>
          <textarea
            value={data.injuries_limitations || ''}
            onChange={(e) => setData({ ...data, injuries_limitations: e.target.value })}
            placeholder="e.g., knee injury, back problems, etc."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            This helps us recommend safe exercises for you
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Fitness Benefits</h4>
          <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <p>• Bodyweight exercises require no equipment</p>
            <p>• Progressive difficulty based on your level</p>
            <p>• Safety checks for medical conditions</p>
            <p>• Track progress and celebrate achievements</p>
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