'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { User, Mail, Calendar, Activity, Target, Moon, Zap, Edit2, Save, X, ArrowLeft, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [editedProfile, setEditedProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.replace('/login');
        return;
      }
      setUser(user);

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userProfile) {
        setProfile(userProfile);
        setEditedProfile(userProfile);
      } else {
        window.location.replace('/onboarding');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_profiles')
        .update(editedProfile)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(editedProfile);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setEditing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white text-4xl font-bold">
                {profile?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">@{profile?.username}</h2>
              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <Mail size={16} />
                {user?.email}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <Calendar size={16} />
                Member since {new Date(profile?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User size={24} />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                {editing ? (
                  <input
                    type="number"
                    value={editedProfile?.age || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile?.age} years</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                {editing ? (
                  <select
                    value={editedProfile?.gender || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl capitalize">{profile?.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                {editing ? (
                  <input
                    type="number"
                    value={editedProfile?.height || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, height: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile?.height} cm</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                {editing ? (
                  <input
                    type="number"
                    value={editedProfile?.weight || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, weight: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile?.weight} kg</p>
                )}
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity size={24} />
              Health Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-md">
                <p className="text-sm text-blue-600 font-medium mb-2">BMI</p>
                <p className="text-3xl font-bold text-blue-900">{profile?.bmi}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-md">
                <p className="text-sm text-green-600 font-medium mb-2">BMR</p>
                <p className="text-3xl font-bold text-green-900">{profile?.bmr} cal</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-md">
                <p className="text-sm text-purple-600 font-medium mb-2">Daily Calories</p>
                <p className="text-3xl font-bold text-purple-900">{profile?.maintenance_calories}</p>
              </div>
            </div>
          </div>

          {/* Lifestyle & Goals */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target size={24} />
              Lifestyle & Goals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Zap size={16} />
                  Activity Level
                </label>
                {editing ? (
                  <select
                    value={editedProfile?.activity_level || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, activity_level: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                ) : (
                  <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl capitalize">{profile?.activity_level?.replace('_', ' ')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Moon size={16} />
                  Average Sleep
                </label>
                {editing ? (
                  <input
                    type="number"
                    step="0.5"
                    value={editedProfile?.sleep_hours_avg || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, sleep_hours_avg: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile?.sleep_hours_avg} hours</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level</label>
                {editing ? (
                  <div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={editedProfile?.stress_level || 5}
                      onChange={(e) => setEditedProfile({ ...editedProfile, stress_level: parseInt(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                    <p className="text-center text-sm text-gray-600 mt-1">{editedProfile?.stress_level}/10</p>
                  </div>
                ) : (
                  <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{profile?.stress_level}/10</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Goal</label>
                {editing ? (
                  <select
                    value={editedProfile?.primary_goal || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, primary_goal: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  >
                    <option value="fat_loss">Fat Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="improve_sleep">Improve Sleep</option>
                    <option value="productivity">Boost Productivity</option>
                    <option value="general_wellness">General Wellness</option>
                  </select>
                ) : (
                  <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl capitalize">{profile?.primary_goal?.replace('_', ' ')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
