import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateLifeScore } from '@/services/lifeScoreEngine';
import { formatDate } from '@/lib/utils/calculations';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: Request) {
  try {
    // Get user from cookie-based auth
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get today and last 7 days
    const today = formatDate(new Date());
    const sevenDaysAgo = formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    // Fetch all data for the last 7 days
    const [sleepLogs, workoutLogs, nutritionLogs, moodLogs, hydrationLogs, profile] = await Promise.all([
      supabaseAdmin.from('sleep_logs').select('*').eq('user_id', userId).gte('date', sevenDaysAgo).lte('date', today),
      supabaseAdmin.from('workout_logs').select('*').eq('user_id', userId).gte('date', sevenDaysAgo).lte('date', today),
      supabaseAdmin.from('nutrition_logs').select('*').eq('user_id', userId).gte('date', sevenDaysAgo).lte('date', today),
      supabaseAdmin.from('mood_logs').select('*').eq('user_id', userId).gte('date', sevenDaysAgo).lte('date', today),
      supabaseAdmin.from('hydration_logs').select('*').eq('user_id', userId).gte('date', sevenDaysAgo).lte('date', today),
      supabaseAdmin.from('user_profiles').select('*').eq('user_id', userId).single(),
    ]);

    if (!profile.data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Aggregate sleep data
    const sleepData = {
      totalHours: sleepLogs.data?.[0]?.total_hours || 7,
      sleepQuality: sleepLogs.data?.[0]?.sleep_quality || 7,
      sleepScore: sleepLogs.data?.[0]?.sleep_score || 70,
      consistency: sleepLogs.data?.length || 0,
    };

    // Aggregate fitness data
    const fitnessData = {
      workoutsThisWeek: workoutLogs.data?.length || 0,
      avgDuration: workoutLogs.data?.reduce((sum, w) => sum + (w.duration_minutes || 0), 0) / (workoutLogs.data?.length || 1) || 0,
      caloriesBurned: workoutLogs.data?.reduce((sum, w) => sum + (w.calories_burned || 0), 0) || 0,
      consistency: workoutLogs.data?.length || 0,
    };

    // Aggregate nutrition data
    const todayNutrition = nutritionLogs.data?.filter(n => n.date === today) || [];
    const nutritionData = {
      caloriesConsumed: todayNutrition.reduce((sum, n) => sum + (n.calories || 0), 0),
      calorieGoal: profile.data.daily_calorie_goal || 2000,
      proteinGrams: todayNutrition.reduce((sum, n) => sum + (n.protein || 0), 0),
      proteinGoal: profile.data.weight * 1.6 || 100,
      mealsLogged: todayNutrition.length,
      waterIntakeMl: hydrationLogs.data?.filter(h => h.date === today).reduce((sum, h) => sum + (h.amount_ml || 0), 0) || 0,
      waterGoalMl: profile.data.daily_water_goal || 2500,
    };

    // Aggregate mind data
    const todayMood = moodLogs.data?.find(m => m.date === today);
    const mindData = {
      moodScore: todayMood?.mood_score || 7,
      stressLevel: todayMood?.stress_level || 5,
      meditationMinutes: 0, // TODO: Add meditation tracking
      journalEntries: 0, // TODO: Add journal tracking
    };

    // Aggregate hydration data
    const hydrationData = {
      waterIntakeMl: hydrationLogs.data?.filter(h => h.date === today).reduce((sum, h) => sum + (h.amount_ml || 0), 0) || 0,
      waterGoalMl: profile.data.daily_water_goal || 2500,
      consistency: hydrationLogs.data?.length || 0,
    };

    // Calculate life score
    const lifeScore = calculateLifeScore(
      sleepData,
      fitnessData,
      nutritionData,
      mindData,
      hydrationData
    );

    return NextResponse.json({ lifeScore });
  } catch (error) {
    console.error('Score calculation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
