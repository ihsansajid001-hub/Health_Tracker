import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { LifeScoreEngine } from '@/services/lifeScoreEngine';
import { formatDate } from '@/lib/utils/calculations';

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

    // Get last 7 days
    const trend = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);

      // Fetch data for this day
      const [sleepLogs, workoutLogs, nutritionLogs, moodLogs, hydrationLogs, profile] = await Promise.all([
        supabaseAdmin.from('sleep_logs').select('*').eq('user_id', user.id).eq('date', dateStr),
        supabaseAdmin.from('workout_logs').select('*').eq('user_id', user.id).eq('date', dateStr),
        supabaseAdmin.from('nutrition_logs').select('*').eq('user_id', user.id).eq('date', dateStr),
        supabaseAdmin.from('mood_logs').select('*').eq('user_id', user.id).eq('date', dateStr),
        supabaseAdmin.from('hydration_logs').select('*').eq('user_id', user.id).eq('date', dateStr),
        supabaseAdmin.from('user_profiles').select('*').eq('user_id', user.id).single(),
      ]);

      if (profile.data) {
        const lifeScore = LifeScoreEngine.calculateLifeScore({
          sleepLogs: sleepLogs.data || [],
          workoutLogs: workoutLogs.data || [],
          nutritionLogs: nutritionLogs.data || [],
          moodLogs: moodLogs.data || [],
          hydrationLogs: hydrationLogs.data || [],
          profile: profile.data,
        });

        trend.push({
          date: dateStr,
          score: lifeScore.overall,
        });
      }
    }

    return NextResponse.json({ trend });
  } catch (error) {
    console.error('Trend calculation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
