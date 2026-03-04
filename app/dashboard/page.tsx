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
import { supabase } from '@/lib/supabase/client';
import { LifeScore } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lifeScore, setLifeScore] = useState<LifeScore | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch life score from API
      const response = await fetch('/api/score/current');
      if (response.ok) {
        const data = await response.json();
        setLifeScore(data.lifeScore);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your wellness overview for today
          </p>
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
  );
}
