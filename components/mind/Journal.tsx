'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils/calculations';
import { BookOpen, Sparkles } from 'lucide-react';

export default function Journal() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    title: '',
    content: '',
    tags: [] as string[],
  });

  const prompts = [
    "What are you grateful for today?",
    "What made you smile today?",
    "What challenged you today and how did you handle it?",
    "What's one thing you learned about yourself today?",
    "Describe a moment when you felt proud of yourself.",
    "What's worrying you right now? How can you address it?",
    "What are your top 3 priorities for tomorrow?",
    "How did you take care of yourself today?",
    "What would you like to let go of?",
    "What brings you peace?",
  ];

  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setFormData({ ...formData, title: prompt });
    setShowPrompts(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('meditation_logs').insert({
        user_id: user.id,
        date: formData.date,
        meditation_id: 'journal',
        duration_minutes: 0,
        notes: `${formData.title}\n\n${formData.content}`,
      });

      if (error) throw error;

      setSuccess(true);
      setFormData({ ...formData, title: '', content: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save journal:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
          <BookOpen size={28} />
          <span>Daily Journal</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Reflect on your day, express your thoughts, and track your mental wellness journey
        </p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-400">✅ Journal entry saved successfully!</p>
        </div>
      )}

      {showPrompts && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles size={20} className="text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Need inspiration? Try these prompts:
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {prompts.slice(0, 6).map((prompt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePromptSelect(prompt)}
                className="text-left p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                💭 {prompt}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowPrompts(false)}
            className="mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            Or write freely without a prompt →
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title (Optional)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Give your entry a title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Thoughts
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={12}
            placeholder="Start writing... Let your thoughts flow freely."
            required
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formData.content.length} characters
            </p>
            {!showPrompts && (
              <button
                type="button"
                onClick={() => setShowPrompts(true)}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                Show prompts
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.content}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Journal Entry'}
        </button>
      </form>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Journaling Tips</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Write without judgment - there's no right or wrong</li>
          <li>• Be honest with yourself about your feelings</li>
          <li>• Focus on specific moments and details</li>
          <li>• Notice patterns in your thoughts and emotions</li>
          <li>• Celebrate small wins and progress</li>
        </ul>
      </div>
    </div>
  );
}
