import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AIInsightsService } from '@/services/aiInsightsService';
import { LifeScoreEngine } from '@/services/lifeScoreEngine';
import { getWeekRange } from '@/lib/utils/calculations';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current week data
    const { start, end } = getWeekRange();

    const [sleepLogs, workoutLogs, nutritionLogs, moodLogs, hydrationLogs, profile] = await Promise.all([
      supabaseAdmin.from('sleep_logs').select('*').eq('user_id', user.id).gte('date', start).lte('date', end),
      supabaseAdmin.from('workout_logs').select('*').eq('user_id', user.id).gte('date', start).lte('date', end),
      supabaseAdmin.from('nutrition_logs').select('*').eq('user_id', user.id).gte('date', start).lte('date', end),
      supabaseAdmin.from('mood_logs').select('*').eq('user_id', user.id).gte('date', start).lte('date', end),
      supabaseAdmin.from('hydration_logs').select('*').eq('user_id', user.id).gte('date', start).lte('date', end),
      supabaseAdmin.from('user_profiles').select('*').eq('user_id', user.id).single(),
    ]);

    if (!profile.data) {
      return NextResponse.json({ insights: [] });
    }

    // Calculate life score
    const lifeScore = LifeScoreEngine.calculateLifeScore({
      sleepLogs: sleepLogs.data || [],
      workoutLogs: workoutLogs.data || [],
      nutritionLogs: nutritionLogs.data || [],
      moodLogs: moodLogs.data || [],
      hydrationLogs: hydrationLogs.data || [],
      profile: profile.data,
    });

    // Calculate streak
    const trackedDays = new Set([
      ...sleepLogs.data?.map(l => l.date) || [],
      ...workoutLogs.data?.map(l => l.date) || [],
      ...nutritionLogs.data?.map(l => l.date) || [],
      ...moodLogs.data?.map(l => l.date) || [],
      ...hydrationLogs.data?.map(l => l.date) || [],
    ]).size;

    // Generate insights
    const { insights } = await AIInsightsService.generateWeeklyInsights({
      lifeScore,
      streakDays: trackedDays,
      missedDays: 7 - trackedDays,
    });

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Insights generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
