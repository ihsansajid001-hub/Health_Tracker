'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Heart, Brain, Zap, Smile } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface MoodEntry {
  id?: string;
  date: string;
  mood_score: number;
  energy_level: number;
  stress_level: number;
  anxiety_level: number;
  notes?: string;
  emotions: string[];
}

const MOODS = [
  { value: 1, emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
  { value: 2, emoji: '😔', label: 'Sad', color: 'text-red-400' },
  { value: 3, emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
  { value: 4, emoji: '🙂', label: 'Good', color: 'text-green-400' },
  { value: 5, emoji: '😊', label: 'Great', color: 'text-green-500' },
  { value: 6, emoji: '😄', label: 'Amazing', color: 'text-green-600' },
];

const EMOTIONS = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'excited', emoji: '🤩', label: 'Excited' },
  { value: 'calm', emoji: '😌', label: 'Calm' },
  { value: 'grateful', emoji: '🙏', label: 'Grateful' },
  { value: 'confident', emoji: '💪', label: 'Confident' },
  { value: 'loved', emoji: '🥰', label: 'Loved' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'stressed', emoji: '😤', label: 'Stressed' },
  { value: 'frustrated', emoji: '😠', label: 'Frustrated' },
  { value: 'lonely', emoji: '😞', label: 'Lonely' },
  { value: 'tired', emoji: '😴', label: 'Tired' },
  { value: 'overwhelmed', emoji: '🤯', label: 'Overwhelmed' },
];

export default function MoodTracker() {
  const [currentEntry, setCurrentEntry] = useState<MoodEntry>({
    date: new Date().toISOString().split('T')[0],
    mood_score: 3,
    energy_level: 3,
    stress_level: 3,
    anxiety_level: 3,
    emotions: [],
    notes: '',
  });
  
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasEntryToday, setHasEntryToday] = useState(false);

  useEffect(() => {
    loadRecentEntries();
    checkTodayEntry();
  }, []);

  const loadRecentEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(7);

      if (error) throw error;
      setRecentEntries(data || []);
    } catch (error) {
      console.error('Error loading mood entries:', error);
    }
  };

  const checkTodayEntry = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (data) {
        setCurrentEntry(data);
        setHasEntryToday(true);
      }
    } catch (error) {
      // No entry today, which is fine
      setHasEntryToday(false);
    }
  };

  const handleEmotionToggle = (emotion: string) => {
    const newEmotions = currentEntry.emotions.includes(emotion)
      ? currentEntry.emotions.filter(e => e !== emotion)
      : [...currentEntry.emotions, emotion];
    
    setCurrentEntry({ ...currentEntry, emotions: newEmotions });
  };

  const saveMoodEntry = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const entryData = {
        user_id: user.id,
        date: currentEntry.date,
        mood_score: currentEntry.mood_score,
        energy_level: currentEntry.energy_level,
        stress_level: currentEntry.stress_level,
        anxiety_level: currentEntry.anxiety_level,
        emotions: currentEntry.emotions,
        notes: currentEntry.notes || null,
      };

      if (hasEntryToday && currentEntry.id) {
        // Update existing entry
        const { error } = await supabase
          .from('mood_logs')
          .update(entryData)
          .eq('id', currentEntry.id);
        
        if (error) throw error;
      } else {
        // Create new entry
        const { error } = await supabase
          .from('mood_logs')
          .insert(entryData);
        
        if (error) throw error;
        setHasEntryToday(true);
      }

      await loadRecentEntries();
    } catch (error) {
      console.error('Error saving mood entry:', error);
      alert('Failed to save mood entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (score: number) => {
    const mood = MOODS.find(m => m.value === score);
    return mood ? mood.emoji : '😐';
  };

  const getMoodColor = (score: number) => {
    const mood = MOODS.find(m => m.value === score);
    return mood ? mood.color : 'text-gray-500';
  };

  const getAverageScore = () => {
    if (recentEntries.length === 0) return 0;
    const sum = recentEntries.reduce((acc, entry) => acc + entry.mood_score, 0);
    return Math.round((sum / recentEntries.length) * 10) / 10;
  };

  return (
    <div className="space-y-6">
      {/* Today's Mood Entry */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            How are you feeling today?
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Mood Scale */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Overall Mood
          </label>
          <div className="grid grid-cols-6 gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setCurrentEntry({ ...currentEntry, mood_score: mood.value })}
                className={`p-3 rounded-lg border-2 transition-colors text-center ${
                  currentEntry.mood_score === mood.value
                    ? 'border-orange-500 bg-orange-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {mood.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Energy, Stress, Anxiety Levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Zap className="w-4 h-4 inline mr-1" />
              Energy Level: {currentEntry.energy_level}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={currentEntry.energy_level}
              onChange={(e) => setCurrentEntry({ ...currentEntry, energy_level: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Brain className="w-4 h-4 inline mr-1" />
              Stress Level: {currentEntry.stress_level}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={currentEntry.stress_level}
              onChange={(e) => setCurrentEntry({ ...currentEntry, stress_level: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Calm</span>
              <span>Stressed</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Heart className="w-4 h-4 inline mr-1" />
              Anxiety Level: {currentEntry.anxiety_level}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={currentEntry.anxiety_level}
              onChange={(e) => setCurrentEntry({ ...currentEntry, anxiety_level: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Relaxed</span>
              <span>Anxious</span>
            </div>
          </div>
        </div>

        {/* Emotions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            What emotions are you experiencing? (Select all that apply)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.value}
                onClick={() => handleEmotionToggle(emotion.value)}
                className={`p-2 rounded-lg border-2 transition-colors text-center ${
                  currentEntry.emotions.includes(emotion.value)
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="text-lg mb-1">{emotion.emoji}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {emotion.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={currentEntry.notes}
            onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
            placeholder="What's on your mind? Any thoughts about your day..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            rows={3}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={saveMoodEntry}
          disabled={loading}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : hasEntryToday ? (
            'Update Entry'
          ) : (
            'Save Entry'
          )}
        </button>
      </div>

      {/* Recent Entries & Stats */}
      {recentEntries.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Mood Trends
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>7-day average: {getAverageScore()}</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {recentEntries.slice(0, 7).reverse().map((entry, index) => (
              <div key={entry.id || index} className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {new Date(entry.date).toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className={`text-2xl ${getMoodColor(entry.mood_score)}`}>
                  {getMoodEmoji(entry.mood_score)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {entry.mood_score}/6
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <Smile className="w-4 h-4 inline mr-1" />
              Keep tracking your mood daily to identify patterns and improve your mental wellness!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}