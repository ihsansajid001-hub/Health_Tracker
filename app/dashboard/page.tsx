'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LifeScoreCard from '@/components/dashboard/LifeScoreCard';
import RadarChart from '@/components/charts/RadarChart';
import TrendChart from '@/components/charts/TrendChart';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentInsights from '@/components/dashboard/RecentInsights';
import StreakCard from '@/components/dashboard/StreakCard';
import MedicalDisclaimer from '@/components/safety/MedicalDisclaimer';
import EmergencyButton from '@/components/safety/EmergencyButton';
import { supabase } from '@/lib/supabase/client';
import { LifeScore } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lifeScore, setLifeScore] = useState<LifeScore | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    // Check if user has accepted medical disclaimer
    const accepted = localStorage.getItem('medical_disclaimer_accepted');
    if (!accepted) {
      setShowDisclaimer(true);
    }
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('Not authenticated, redirecting to login');
        window.location.replace('/login');
        return;
      }
      setUser(user);

      // Fetch user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError || !userProfile) {
        // No profile found, redirect to onboarding
        console.log('No profile found, redirecting to onboarding');
        window.location.replace('/onboarding');
        return;
      }

      setProfile(userProfile);

      // Fetch life score from API
      const response = await fetch(`/api/score/current?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setLifeScore(data.lifeScore);
      }
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false);
  };

  const handleDisclaimerDecline = () => {
    // Redirect to home page if user declines
    window.location.href = '/';
  };

  return (
    <>
      {showDisclaimer && (
        <MedicalDisclaimer
          onAccept={handleDisclaimerAccept}
          onDecline={handleDisclaimerDecline}
        />
      )}
      
      <EmergencyButton />
      
      <DashboardLayout>
        <div className="space-y-6">
        {/* Welcome Header - Personalized */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.username || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="mt-2 text-blue-100">
            {profile?.primary_goal && (
              <>Your goal: {profile.primary_goal.replace('_', ' ').charAt(0).toUpperCase() + profile.primary_goal.replace('_', ' ').slice(1)}</>
            )}
          </p>
          {profile && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="opacity-90">BMI:</span> <span className="font-semibold">{profile.bmi}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="opacity-90">Daily Calories:</span> <span className="font-semibold">{profile.maintenance_calories}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="opacity-90">Activity:</span> <span className="font-semibold capitalize">{profile.activity_level?.replace('_', ' ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Top Row - Life Score & Streak */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LifeScoreCard score={lifeScore} />
          </div>
          <div>
            <StreakCard />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RadarChart data={lifeScore} />
          <TrendChart />
        </div>

        {/* Quick Actions & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActions />
          <RecentInsights />
        </div>
        </div>
      </DashboardLayout>
    </>
  );
}
