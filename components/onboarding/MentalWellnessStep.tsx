'use client';

import { useState } from 'react';

interface MentalWellnessStepProps {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function MentalWellnessStep({ data, setData, onNext, onBack }: MentalWellnessStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mentalHealthGoals = [
    { value: 'reduce_anxiety', label: 'Reduce Anxiety', icon: '😌' },
    { value: 'better_sleep', label: 'Better Sleep', icon: '😴' },
    { value: 'manage_stress', label: 'Manage Stress', icon: '🧘' },
    { value: 'increase_self_love', label: 'Increase Self-Love', icon: '💝' },
    { value: 'improve_focus', label: 'Improve Focus', icon: '🎯' },
    { value: 'build_confidence', label: 'Build Confidence', icon: '💪' },
    { value: 'emotional_balance', label: 'Emotional Balance', icon: '⚖️' },
    { value: 'mindfulness', label: 'Practice Mindfulness', icon: '🌸' }
  ];

  const meditationExperience = [
    { value: 'never', label: 'Never tried', description: 'New to meditation', icon: '🌱' },
    { value: 'beginner', label: 'Beginner', description: 'Tried a few times', icon: '🌿' },
    { value: 'intermediate', label: 'Intermediate', description: 'Regular practice', icon: '🌳' },
    { value: 'experienced', label: 'Experienced', description: 'Daily practitioner', icon: '🧘‍♀️' }
  ];

  const sessionLengths = [
    { value: 3, label: '3 minutes', description: 'Quick relief' },
    { value: 5, label: '5 minutes', description: 'Short session' },
    { value: 10, label: '10 minutes', description: 'Standard' },
    { value: 15, label: '15 minutes', description: 'Deep practice' },
    { value: 20, label: '20+ minutes', description: 'Extended' }
  ];

  const handleGoalToggle = (goal: string) => {
    const currentGoals = data.mental_health_goals || [];
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g: string) => g !== goal)
      : [...currentGoals, goal];
    setData({ ...data, mental_health_goals: newGoals });
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.mental_health_goals || data.mental_health_goals.length === 0) {
      newErrors.mental_health_goals = 'Please select at least one mental health goal';
    }
    if (!data.meditation_experience) {
      newErrors.meditation_experience = 'Please select your meditation experience level';
    }
    if (!data.preferred_session_length) {
      newErrors.preferred_session_length = 'Please select your preferred session length';
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
        <div className="text-6xl mb-4">🧘‍♀️</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mental Wellness
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let's create a personalized mental health plan for you
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Mental Health Goals (Select all that apply)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mentalHealthGoals.map((goal) => (
              <button
                key={goal.value}
                onClick={() => handleGoalToggle(goal.value)}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  (data.mental_health_goals || []).includes(goal.value)
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">{goal.icon}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {goal.label}
                </div>
              </button>
            ))}
          </div>
          {errors.mental_health_goals && (
            <p className="text-red-500 text-sm mt-1">{errors.mental_health_goals}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            How often do you feel stressed? (1 = Rarely, 10 = Daily)
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Rarely</span>
            <input
              type="range"
              min="1"
              max="10"
              value={data.stress_level || 5}
              onChange={(e) => setData({ ...data, stress_level: parseInt(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500">Daily</span>
          </div>
          <div className="text-center mt-2">
            <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              {data.stress_level || 5}/10
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Meditation Experience
          </label>
          <div className="grid gap-3">
            {meditationExperience.map((exp) => (
              <button
                key={exp.value}
                onClick={() => setData({ ...data, meditation_experience: exp.value })}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  data.meditation_experience === exp.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{exp.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {exp.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {exp.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.meditation_experience && (
            <p className="text-red-500 text-sm mt-1">{errors.meditation_experience}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preferred Session Length
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sessionLengths.map((length) => (
              <button
                key={length.value}
                onClick={() => setData({ ...data, preferred_session_length: length.value })}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  data.preferred_session_length === length.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white">
                  {length.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {length.description}
                </div>
              </button>
            ))}
          </div>
          {errors.preferred_session_length && (
            <p className="text-red-500 text-sm mt-1">{errors.preferred_session_length}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preferred Time for Mental Wellness Activities
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'morning', label: 'Morning', icon: '🌅' },
              { value: 'afternoon', label: 'Afternoon', icon: '☀️' },
              { value: 'evening', label: 'Evening', icon: '🌆' },
              { value: 'bedtime', label: 'Before Bed', icon: '🌙' },
              { value: 'flexible', label: 'Flexible', icon: '⏰' },
              { value: 'stressed', label: 'When Stressed', icon: '😰' }
            ].map((time) => (
              <button
                key={time.value}
                onClick={() => setData({ ...data, preferred_wellness_time: time.value })}
                className={`p-3 border-2 rounded-lg text-left transition-colors ${
                  data.preferred_wellness_time === time.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
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
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Mental Wellness Features</h4>
          <div className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
            <p>• 20+ guided meditations for different goals</p>
            <p>• 6 breathing exercises for quick stress relief</p>
            <p>• Mood tracking and journaling</p>
            <p>• CBT techniques and coping strategies</p>
            <p>• Sleep stories and relaxation content</p>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">🚨 Crisis Resources</h4>
          <div className="text-sm text-red-800 dark:text-red-200 space-y-1">
            <p>• Emergency button always available</p>
            <p>• 988 Suicide Prevention Lifeline</p>
            <p>• Crisis Text Line: Text HOME to 741741</p>
            <p>• This app supplements, not replaces, professional care</p>
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