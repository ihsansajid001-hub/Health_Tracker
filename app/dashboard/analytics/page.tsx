'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TrendChart from '@/components/charts/TrendChart';
import RadarChart from '@/components/charts/RadarChart';
import { BarChart3, TrendingUp, Calendar, Target, Award, Clock } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ScoreData { date: string; score: number; breakdown: { sleep: number; fitness: number; nutrition: number; hydration: number; mental: number }; }
interface AnalyticsData { trend: string; data: ScoreData[]; summary: { currentScore: number; averageScore: number; bestScore: number; daysTracked: number }; }
interface WeeklyStats { sleep: { average: number }; fitness: { workouts: number; totalMinutes: number }; nutrition: { mealsLogged: number; avgCalories: number }; hydration: { goalsMet: number; totalDays: number }; mental: { avgMood: number; entriesLogged: number }; }

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => { fetchAnalyticsData(); fetchWeeklyStats(); }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const res = await fetch(`/api/score/trend?days=${timeRange}`);
      if (res.ok) setAnalyticsData(await res.json());
    } catch {}
  };

  const fetchWeeklyStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const dateStr = sevenDaysAgo.toISOString().split('T')[0];
      const [sleepData, workoutData, nutritionData, moodData, hydrationData] = await Promise.all([
        supabase.from('sleep_logs').select('hours, quality').eq('user_id', user.id).gte('date', dateStr),
        supabase.from('workout_logs').select('duration_minutes').eq('user_id', user.id).gte('date', dateStr),
        supabase.from('daily_nutrition_summary').select('total_calories, meals_logged').eq('user_id', user.id).gte('date', dateStr),
        supabase.from('mood_entries').select('mood_score').eq('user_id', user.id).gte('timestamp', sevenDaysAgo.toISOString()),
        supabase.from('hydration_logs').select('water_ml, target_ml').eq('user_id', user.id).gte('date', dateStr),
      ]);
      setWeeklyStats({
        sleep: { average: sleepData.data?.length ? sleepData.data.reduce((s, l) => s + l.hours, 0) / sleepData.data.length : 0 },
        fitness: { workouts: workoutData.data?.length || 0, totalMinutes: workoutData.data?.reduce((s, l) => s + l.duration_minutes, 0) || 0 },
        nutrition: { mealsLogged: nutritionData.data?.reduce((s, l) => s + l.meals_logged, 0) || 0, avgCalories: nutritionData.data?.length ? nutritionData.data.reduce((s, l) => s + l.total_calories, 0) / nutritionData.data.length : 0 },
        hydration: { goalsMet: hydrationData.data?.filter(l => l.water_ml >= l.target_ml).length || 0, totalDays: hydrationData.data?.length || 0 },
        mental: { avgMood: moodData.data?.length ? moodData.data.reduce((s, e) => s + e.mood_score, 0) / moodData.data.length : 0, entriesLogged: moodData.data?.length || 0 },
      });
    } catch {} finally { setLoading(false); }
  };

  const getRadarData = () => {
    if (!analyticsData?.data.length) return [];
    const recent = analyticsData.data.slice(-7);
    const avg = (key: keyof ScoreData['breakdown']) => recent.reduce((s, d) => s + d.breakdown[key], 0) / recent.length;
    return [
      { category: 'Sleep', value: Math.round(avg('sleep')), max: 25 },
      { category: 'Fitness', value: Math.round(avg('fitness')), max: 25 },
      { category: 'Nutrition', value: Math.round(avg('nutrition')), max: 25 },
      { category: 'Hydration', value: Math.round(avg('hydration')), max: 15 },
      { category: 'Mental', value: Math.round(avg('mental')), max: 10 },
    ];
  };

  const summaryCards = [
    { label: 'Current Score', value: analyticsData?.summary.currentScore ?? 0, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', badge: analyticsData?.trend },
    { label: 'Average Score', value: analyticsData?.summary.averageScore ?? 0, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Best Score', value: analyticsData?.summary.bestScore ?? 0, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Days Tracked', value: analyticsData?.summary.daysTracked ?? 0, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto animate-pulse space-y-6">
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
          <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl" />)}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* Page header */}
        <div className="bg-orange-500 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
                <BarChart3 size={28} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-200 mb-1">// Dashboard</p>
                <h1 className="text-3xl font-black">Analytics</h1>
                <p className="text-orange-200 text-sm mt-1">Deep dive into your wellness data</p>
              </div>
            </div>
            {/* Time range */}
            <div className="flex gap-2">
              {[7, 30, 90].map(d => (
                <button key={d} onClick={() => setTimeRange(d)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${timeRange === d ? 'bg-white text-orange-600' : 'bg-white/15 text-white hover:bg-white/25'}`}>
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
                <s.icon size={18} className={s.color} />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">{s.value}</div>
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{s.label}</div>
              {s.badge && (
                <span className={`mt-2 inline-block text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                  s.badge === 'improving' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  s.badge === 'declining' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>{s.badge}</span>
              )}
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">// Trend</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Life Score Trend</h3>
            {analyticsData?.data && <TrendChart data={analyticsData.data.map(d => ({ date: d.date, value: d.score }))} color="#f97316" />}
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">// Radar</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Wellness Balance</h3>
            <RadarChart data={getRadarData()} />
          </div>
        </div>

        {/* Weekly highlights */}
        {weeklyStats && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">// This Week</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Weekly Highlights</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              {[
                { icon: Clock, label: 'Avg Sleep', value: `${weeklyStats.sleep.average.toFixed(1)}h`, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { icon: Target, label: 'Workouts', value: weeklyStats.fitness.workouts, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
                { icon: Award, label: 'Meals Logged', value: weeklyStats.nutrition.mealsLogged, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                { icon: TrendingUp, label: 'Hydration Goals', value: `${weeklyStats.hydration.totalDays > 0 ? Math.round((weeklyStats.hydration.goalsMet / weeklyStats.hydration.totalDays) * 100) : 0}%`, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
                { icon: BarChart3, label: 'Avg Mood', value: weeklyStats.mental.avgMood.toFixed(1), color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              ].map((s, i) => (
                <div key={i} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <s.icon size={20} className={s.color} />
                  </div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</div>
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
