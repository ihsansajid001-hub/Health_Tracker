'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Settings, User, Bell, Shield, Palette, Save, CheckCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserProfile { username: string; full_name: string; age: number; gender: string; height: number; weight: number; target_weight: number; activity_level: string; primary_goal: string; units_system: string; daily_calorie_goal: number; daily_water_goal: number; }
interface NotificationSettings { hydration_reminders: boolean; workout_reminders: boolean; sleep_reminders: boolean; meal_reminders: boolean; mindfulness_reminders: boolean; }

const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings>({ hydration_reminders: true, workout_reminders: true, sleep_reminders: true, meal_reminders: true, mindfulness_reminders: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single();
      if (data) setProfile(data);
    } catch {} finally { setLoading(false); }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const h = profile.height / 100;
      const bmi = profile.weight / (h * h);
      const bmr = profile.gender === 'male'
        ? 88.362 + 13.397 * profile.weight + 4.799 * profile.height - 5.677 * profile.age
        : 447.593 + 9.247 * profile.weight + 3.098 * profile.height - 4.330 * profile.age;
      const mult: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
      const tdee = bmr * (mult[profile.activity_level] || 1.55);
      const { error } = await supabase.from('user_profiles').update({ ...profile, bmi: Math.round(bmi * 10) / 10, bmr: Math.round(bmr), tdee: Math.round(tdee), updated_at: new Date().toISOString() }).eq('user_id', user.id);
      if (error) throw error;
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch { setMessage('Error updating profile. Please try again.'); }
    finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white outline-none text-sm";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
          <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

        {/* Page header */}
        <div className="bg-gray-800 dark:bg-gray-700 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-700 dark:bg-gray-600 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
              <Settings size={28} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">// Dashboard</p>
              <h1 className="text-3xl font-black">Settings</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        {/* Success message */}
        {message && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center gap-3">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
            <span className="text-sm font-bold text-green-700 dark:text-green-400">{message}</span>
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Tab nav */}
          <div className="flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
            {settingsTabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === t.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}>
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'profile' && profile && (
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'Username', key: 'username', type: 'text' },
                    { label: 'Full Name', key: 'full_name', type: 'text' },
                    { label: 'Age', key: 'age', type: 'number' },
                    { label: 'Height (cm)', key: 'height', type: 'number' },
                    { label: 'Weight (kg)', key: 'weight', type: 'number', step: '0.1' },
                    { label: 'Target Weight (kg)', key: 'target_weight', type: 'number', step: '0.1' },
                    { label: 'Daily Calorie Goal', key: 'daily_calorie_goal', type: 'number' },
                    { label: 'Daily Water Goal (ml)', key: 'daily_water_goal', type: 'number' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{f.label}</label>
                      <input type={f.type} step={f.step} value={(profile as any)[f.key] || ''} onChange={e => setProfile({ ...profile, [f.key]: f.type === 'number' ? parseFloat(e.target.value) : e.target.value })} className={inputClass} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                    <select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })} className={inputClass}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Activity Level</label>
                    <select value={profile.activity_level} onChange={e => setProfile({ ...profile, activity_level: e.target.value })} className={inputClass}>
                      <option value="sedentary">Sedentary</option>
                      <option value="light">Light Activity</option>
                      <option value="moderate">Moderate Activity</option>
                      <option value="active">Active</option>
                      <option value="very_active">Very Active</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 disabled:opacity-50">
                    <Save size={16} />
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">// Preferences</p>
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white capitalize">{key.replace(/_/g, ' ')}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive reminders for {key.replace('_reminders', '').replace(/_/g, ' ')}</p>
                    </div>
                    <button onClick={() => setNotifications(n => ({ ...n, [key]: !value }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">// Privacy</p>
                <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Your data is private and secure. We never share your personal information with third parties. You can export or delete your data at any time.</p>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">// Appearance</p>
                <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Theme and appearance customization options coming soon!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
