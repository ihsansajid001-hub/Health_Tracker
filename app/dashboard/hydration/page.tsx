'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Droplet } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatDate, calculateWaterIntake } from '@/lib/utils/calculations';

export default function HydrationPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [targetWater, setTargetWater] = useState(2000);
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    water_ml: 0,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('weight, activity_level')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        const target = calculateWaterIntake(profile.weight, profile.activity_level);
        setTargetWater(target);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('hydration_logs').upsert({
        user_id: user.id,
        date: formData.date,
        water_ml: formData.water_ml,
        target_ml: targetWater,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to log hydration:', error);
      alert('Failed to log hydration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addWater = (amount: number) => {
    setFormData({ ...formData, water_ml: formData.water_ml + amount });
  };

  const percentage = Math.min((formData.water_ml / targetWater) * 100, 100);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl flex items-center justify-center">
            <Droplet size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Hydration Tracking
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay hydrated throughout the day
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-fade-in">
            <p className="text-green-700 dark:text-green-400">✅ Hydration logged successfully!</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
              {formData.water_ml}ml
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              of {targetWater}ml goal
            </div>
          </div>

          <div className="mb-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-700 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              {Math.round(percentage)}% Complete
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {[250, 500, 750, 1000].map((amount) => (
              <button
                key={amount}
                onClick={() => addWater(amount)}
                className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
              >
                <Droplet size={20} className="mx-auto mb-1 text-cyan-600 dark:text-cyan-400" />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  +{amount}ml
                </div>
              </button>
            ))}
          </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Water (ml)
              </label>
              <input
                type="number"
                value={formData.water_ml}
                onChange={(e) => setFormData({ ...formData, water_ml: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? 'Logging...' : 'Log Hydration'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
