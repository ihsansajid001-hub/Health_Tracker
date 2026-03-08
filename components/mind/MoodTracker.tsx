'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils/calculations';
import { Smile, Meh, Frown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MoodTracker() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    mood_score: 7,
    stress_level: 5,
    anxiety_level: 5,
    energy_level: 7,
    notes: '',
  });

  const moods = [
    { value: 1, emoji: '😢', label: 'Terrible', color: 'text-red-500' },
    { value: 3, emoji: '😟', label: 'Bad', color: 'text-orange-500' },
    { value: 5, emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
    { value: 7, emoji: '🙂', label: 'Good', color: 'text-lime-500' },
    { value: 9, emoji: '😄', label: 'Great', color: 'text-green-500' },
    { value: 10, emoji: '🤩', label: 'Amazing', color: 'text-emerald-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('mood_logs').upsert({
        user_id: user.id,
        ...formData,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to log mood:', error);
      alert('Failed to log mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          How are you feeling today?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your mood, stress, anxiety, and energy levels
        </p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-400">✅ Mood logged successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Overall Mood
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => setFormData({ ...formData, mood_score: mood.value })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.mood_score === mood.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-110'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                }`}
              >
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <div className={`text-xs font-semibold ${mood.color}`}>{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stress Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stress Level: {formData.stress_level}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.stress_level}
            onChange={(e) => setFormData({ ...formData, stress_level: parseInt(e.target.value) })}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>😌 Relaxed</span>
            <span>😰 Very Stressed</span>
          </div>
        </div>

        {/* Anxiety Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Anxiety Level: {formData.anxiety_level}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.anxiety_level}
            onChange={(e) => setFormData({ ...formData, anxiety_level: parseInt(e.target.value) })}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>😊 Calm</span>
            <span>😨 Very Anxious</span>
          </div>
        </div>

        {/* Energy Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Energy Level: {formData.energy_level}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.energy_level}
            onChange={(e) => setFormData({ ...formData, energy_level: parseInt(e.target.value) })}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>😴 Exhausted</span>
            <span>⚡ Energized</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={4}
            placeholder="What's on your mind? Any specific thoughts or feelings?"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50"
        >
          {loading ? 'Logging...' : 'Log Mood'}
        </button>
      </form>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-3xl mb-1">😊</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mood</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{formData.mood_score}/10</div>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-1">😰</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Stress</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{formData.stress_level}/10</div>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-1">⚡</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Energy</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{formData.energy_level}/10</div>
        </div>
      </div>
    </div>
  );
}
