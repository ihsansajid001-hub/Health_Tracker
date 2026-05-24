'use client';

import { useState, useEffect } from 'react';
import { Calendar, Edit3, Save, Plus, BookOpen, Heart, Star, Target } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface JournalEntry {
  id?: string;
  date: string;
  title: string;
  content: string;
  mood_score?: number;
  gratitude_items?: string[];
  goals?: string[];
  created_at?: string;
}

const JOURNAL_PROMPTS = [
  {
    category: 'Gratitude',
    icon: '🙏',
    prompts: [
      'What are three things you\'re grateful for today?',
      'Who made your day better and how?',
      'What small moment brought you joy today?',
      'What challenge are you grateful to have overcome?',
    ]
  },
  {
    category: 'Reflection',
    icon: '🤔',
    prompts: [
      'What did you learn about yourself today?',
      'How did you grow or improve today?',
      'What would you do differently if you could repeat today?',
      'What emotions did you experience and why?',
    ]
  },
  {
    category: 'Goals',
    icon: '🎯',
    prompts: [
      'What progress did you make toward your goals today?',
      'What obstacles did you face and how did you handle them?',
      'What do you want to accomplish tomorrow?',
      'How can you improve your daily routine?',
    ]
  },
  {
    category: 'Wellness',
    icon: '💚',
    prompts: [
      'How did you take care of your mental health today?',
      'What activities made you feel energized?',
      'How was your stress level and what affected it?',
      'What self-care practices did you engage in?',
    ]
  }
];

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
    gratitude_items: ['', '', ''],
    goals: [''],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [view, setView] = useState<'write' | 'entries'>('write');

  useEffect(() => {
    loadEntries();
    checkTodayEntry();
  }, []);

  const loadEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const checkTodayEntry = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (data) {
        setCurrentEntry({
          ...data,
          gratitude_items: data.gratitude_items || ['', '', ''],
          goals: data.goals || [''],
        });
        setIsEditing(true);
      }
    } catch (error) {
      // No entry today, which is fine
    }
  };

  const saveEntry = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const entryData = {
        user_id: user.id,
        date: currentEntry.date,
        title: currentEntry.title || `Journal Entry - ${new Date(currentEntry.date).toLocaleDateString()}`,
        content: currentEntry.content,
        gratitude_items: currentEntry.gratitude_items?.filter(item => item.trim()) || [],
        goals: currentEntry.goals?.filter(goal => goal.trim()) || [],
      };

      if (isEditing && currentEntry.id) {
        // Update existing entry
        const { error } = await supabase
          .from('journal_entries')
          .update(entryData)
          .eq('id', currentEntry.id);
        
        if (error) throw error;
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('journal_entries')
          .insert(entryData)
          .select()
          .single();
        
        if (error) throw error;
        setCurrentEntry({ ...currentEntry, id: data.id });
        setIsEditing(true);
      }

      await loadEntries();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addGratitudeItem = () => {
    setCurrentEntry({
      ...currentEntry,
      gratitude_items: [...(currentEntry.gratitude_items || []), '']
    });
  };

  const updateGratitudeItem = (index: number, value: string) => {
    const newItems = [...(currentEntry.gratitude_items || [])];
    newItems[index] = value;
    setCurrentEntry({ ...currentEntry, gratitude_items: newItems });
  };

  const addGoal = () => {
    setCurrentEntry({
      ...currentEntry,
      goals: [...(currentEntry.goals || []), '']
    });
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...(currentEntry.goals || [])];
    newGoals[index] = value;
    setCurrentEntry({ ...currentEntry, goals: newGoals });
  };

  const usePrompt = (prompt: string) => {
    setCurrentEntry({
      ...currentEntry,
      content: currentEntry.content + (currentEntry.content ? '\n\n' : '') + prompt + '\n\n'
    });
    setSelectedPrompt(null);
  };

  if (view === 'entries') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Journal Entries
          </h3>
          <button
            onClick={() => setView('write')}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            Write Entry
          </button>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {entry.title}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                {entry.content}
              </p>

              {entry.gratitude_items && entry.gratitude_items.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Gratitude:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {entry.gratitude_items.slice(0, 2).map((item, index) => (
                      <span
                        key={index}
                        className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-2 py-1 rounded"
                      >
                        {item}
                      </span>
                    ))}
                    {entry.gratitude_items.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{entry.gratitude_items.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setCurrentEntry(entry);
                  setIsEditing(true);
                  setView('write');
                }}
                className="text-sm text-orange-500 dark:text-orange-400 hover:underline"
              >
                Read & Edit
              </button>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                No journal entries yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Start writing to track your thoughts and feelings
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Journal Entry
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('entries')}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            View Entries
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(currentEntry.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Writing Prompts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Need inspiration? Try a writing prompt:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {JOURNAL_PROMPTS.map((category) => (
            <div key={category.category}>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {category.icon} {category.category}
              </h5>
              <div className="space-y-1">
                {category.prompts.slice(0, 2).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => usePrompt(prompt)}
                    className="block w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Journal Entry */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
              placeholder="Give your entry a title..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Edit3 className="w-4 h-4 inline mr-1" />
              Your Thoughts
            </label>
            <textarea
              value={currentEntry.content}
              onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
              placeholder="What's on your mind? How are you feeling? What happened today?"
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={8}
            />
          </div>
        </div>
      </div>

      {/* Gratitude Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            <Heart className="w-4 h-4 inline mr-1 text-red-500" />
            Gratitude List
          </h4>
          <button
            onClick={addGratitudeItem}
            className="text-sm text-orange-500 dark:text-orange-400 hover:underline"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Add Item
          </button>
        </div>
        <div className="space-y-2">
          {(currentEntry.gratitude_items || []).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-yellow-500">⭐</span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateGratitudeItem(index, e.target.value)}
                placeholder="What are you grateful for?"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            <Target className="w-4 h-4 inline mr-1 text-orange-500" />
            Goals & Intentions
          </h4>
          <button
            onClick={addGoal}
            className="text-sm text-orange-500 dark:text-orange-400 hover:underline"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Add Goal
          </button>
        </div>
        <div className="space-y-2">
          {(currentEntry.goals || []).map((goal, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-orange-500">🎯</span>
              <input
                type="text"
                value={goal}
                onChange={(e) => updateGoal(index, e.target.value)}
                placeholder="What do you want to accomplish?"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveEntry}
        disabled={loading || (!currentEntry.content.trim() && !currentEntry.gratitude_items?.some(item => item.trim()))}
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Entry' : 'Save Entry'}
          </>
        )}
      </button>
    </div>
  );
}