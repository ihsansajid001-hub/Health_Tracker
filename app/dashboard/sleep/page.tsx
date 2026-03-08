'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SleepSoundPlayer from '@/components/sleep/SleepSoundPlayer';
import SmartAlarm from '@/components/sleep/SmartAlarm';
import SleepAnalytics from '@/components/sleep/SleepAnalytics';
import { Moon, Music, BarChart3, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils/calculations';

type Tab = 'log' | 'sounds' | 'analytics' | 'settings';

export default function SleepPage() {
  const [activeTab, setActiveTab] = useState<Tab>('log');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    total_hours: 7,
    sleep_quality: 7,
    bedtime: '23:00',
    wake_time: '07:00',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('sleep_logs').upsert({
        user_id: user.id,
        ...formData,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to log sleep:', error);
      alert('Failed to log sleep. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
            <Moon size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sleep Tracking
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track sleep, play sounds, and improve rest quality
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('log')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'log'
                ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            <Moon size={20} />
            <span>Log Sleep</span>
          </button>
          <button
            onClick={() => setActiveTab('sounds')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'sounds'
                ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            <Music size={20} />
            <span>Sleep Sounds</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'log' && (
          <div className="max-w-2xl mx-auto">
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-fade-in">
                <p className="text-green-700 dark:text-green-400">✅ Sleep logged successfully!</p>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bedtime
                    </label>
                    <input
                      type="time"
                      value={formData.bedtime}
                      onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Wake Time
                    </label>
                    <input
                      type="time"
                      value={formData.wake_time}
                      onChange={(e) => setFormData({ ...formData, wake_time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hours Slept: {formData.total_hours}h
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={formData.total_hours}
                    onChange={(e) => setFormData({ ...formData, total_hours: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sleep Quality: {formData.sleep_quality}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.sleep_quality}
                    onChange={(e) => setFormData({ ...formData, sleep_quality: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="How did you sleep? Any dreams?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {loading ? 'Logging...' : 'Log Sleep'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'sounds' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <SleepSoundPlayer />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <SleepAnalytics />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <SmartAlarm />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
