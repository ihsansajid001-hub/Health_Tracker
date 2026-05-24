'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { User, Mail, Calendar, Activity, Target, Moon, Zap, Edit2, Save, X, ArrowLeft, LogOut, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [editing, setEditing]       = useState(false);
  const [toast, setToast]           = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [user, setUser]             = useState<any>(null);
  const [profile, setProfile]       = useState<any>(null);
  const [editedProfile, setEditedProfile] = useState<any>(null);

  useEffect(() => { fetchProfile(); }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { window.location.replace('/login'); return; }
      setUser(session.user);
      const { data: p } = await supabase.from('user_profiles').select('*').eq('user_id', session.user.id).single();
      if (p) { setProfile(p); setEditedProfile(p); }
      else { window.location.replace('/onboarding'); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('user_profiles').update(editedProfile).eq('user_id', user.id);
      if (error) throw error;
      setProfile(editedProfile);
      setEditing(false);
      showToast('success', 'Profile updated successfully!');
    } catch (e: any) {
      showToast('error', e.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace('/');
  };

  const inp = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 text-sm font-medium";

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-[3px] border-orange-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F0]">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl font-bold text-sm animate-fade-in ${
          toast.type === 'success' ? 'bg-white border border-orange-200 text-gray-900' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} className="text-orange-500" /> : <AlertCircle size={16} className="text-red-500" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-semibold text-sm">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">L</span>
            </div>
            <span className="font-black text-gray-900">LifeScore</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Page title */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">// Profile</p>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Profile</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your personal information and preferences</p>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white font-bold rounded-full transition-all text-sm">
              <Edit2 size={15} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => { setEditedProfile(profile); setEditing(false); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition-all text-sm">
                <X size={15} /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-all text-sm disabled:opacity-50">
                <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Avatar + basic info */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-5">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 flex-shrink-0">
              <span className="text-white text-3xl font-black">{profile?.username?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">@{profile?.username}</h2>
              <p className="text-gray-400 flex items-center gap-2 mt-1 text-sm">
                <Mail size={14} /> {user?.email}
              </p>
              <p className="text-gray-300 flex items-center gap-2 mt-0.5 text-xs">
                <Calendar size={12} /> Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Health Metrics — read-only calculated values */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: 'BMI',            value: profile?.bmi,                  unit: '',    bg: 'bg-orange-50',  text: 'text-orange-600' },
            { label: 'BMR',            value: profile?.bmr,                  unit: ' cal', bg: 'bg-gray-50',   text: 'text-gray-700' },
            { label: 'Daily Calories', value: profile?.maintenance_calories, unit: '',    bg: 'bg-orange-50',  text: 'text-orange-600' },
          ].map((m, i) => (
            <div key={i} className={`${m.bg} rounded-2xl p-5 border border-gray-100`}>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{m.label}</p>
              <p className={`text-3xl font-black ${m.text} tabular-nums`}>{m.value}{m.unit}</p>
            </div>
          ))}
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-5">
          <div className="flex items-center gap-2 mb-6">
            <User size={18} className="text-orange-500" />
            <h3 className="text-xl font-black text-gray-900">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Age', key: 'age', type: 'number', display: `${profile?.age} years` },
              { label: 'Height (cm)', key: 'height', type: 'number', display: `${profile?.height} cm` },
              { label: 'Weight (kg)', key: 'weight', type: 'number', display: `${profile?.weight} kg` },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{f.label}</label>
                {editing ? (
                  <input type={f.type} value={editedProfile?.[f.key] || ''} onChange={e => setEditedProfile({ ...editedProfile, [f.key]: parseFloat(e.target.value) })} className={inp} />
                ) : (
                  <p className="text-base font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-2xl">{f.display}</p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Gender</label>
              {editing ? (
                <select value={editedProfile?.gender || ''} onChange={e => setEditedProfile({ ...editedProfile, gender: e.target.value })} className={inp}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Prefer not to say</option>
                </select>
              ) : (
                <p className="text-base font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-2xl capitalize">{profile?.gender}</p>
              )}
            </div>
          </div>
        </div>

        {/* Lifestyle & Goals */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Target size={18} className="text-orange-500" />
            <h3 className="text-xl font-black text-gray-900">Lifestyle & Goals</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Activity Level</label>
              {editing ? (
                <select value={editedProfile?.activity_level || ''} onChange={e => setEditedProfile({ ...editedProfile, activity_level: e.target.value })} className={inp}>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              ) : (
                <p className="text-base font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-2xl capitalize">{profile?.activity_level?.replace('_', ' ')}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Primary Goal</label>
              {editing ? (
                <select value={editedProfile?.primary_goal || ''} onChange={e => setEditedProfile({ ...editedProfile, primary_goal: e.target.value })} className={inp}>
                  <option value="fat_loss">Fat Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="improve_sleep">Improve Sleep</option>
                  <option value="productivity">Boost Productivity</option>
                  <option value="general_wellness">General Wellness</option>
                </select>
              ) : (
                <p className="text-base font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-2xl capitalize">{profile?.primary_goal?.replace(/_/g, ' ')}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Average Sleep Hours</label>
              {editing ? (
                <input type="number" step="0.5" value={editedProfile?.sleep_hours_avg || ''} onChange={e => setEditedProfile({ ...editedProfile, sleep_hours_avg: parseFloat(e.target.value) })} className={inp} />
              ) : (
                <p className="text-base font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-2xl">{profile?.sleep_hours_avg} hours</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                Stress Level: <span className="text-orange-500">{editing ? editedProfile?.stress_level : profile?.stress_level}/10</span>
              </label>
              {editing ? (
                <input type="range" min="1" max="10" value={editedProfile?.stress_level || 5} onChange={e => setEditedProfile({ ...editedProfile, stress_level: parseInt(e.target.value) })} className="w-full accent-orange-500" />
              ) : (
                <div className="bg-gray-50 px-4 py-3 rounded-2xl">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(profile?.stress_level / 10) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
