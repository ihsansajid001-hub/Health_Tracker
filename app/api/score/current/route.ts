import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { LifeScoreEngine } from '@/services/lifeScoreEngine';
import { formatDate, getWeekRange } from '@/lib/utils/calculations';

export async function GET(request: Request) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current week range
    const { start, end } = getWeekRange();

    // Fetch all data for the week
    const [sleepLogs, workoutLogs, nutritionLogs, moodLogs, hydrationLogs, profile] = await Promise.all([
      supabaseAdmin.from('sleep_logs').select('*').eq('user_id', user.id).gte('date', start).lte('date', end),
      supabaseAdmin.from('workout_logs').select('*').eq('user_id', user.id).gte('date', start).lte('date', end),
      supabaseAdmin.from('nutrition_logs').select('*').eq('user_id', user.id).gte('date', start).lte('date', end),
      supabaseAdmin.from('mood_logs').select('*').eq('user_id', user.id).gte('date', start).lte('date', end),
      supabaseAdmin.from('hydration_logs').select('*').eq('user_id', user.id).gte('date', start).lte('date', end),
      supabaseAdmin.from('user_profiles').select('*').eq('user_id', user.id).single(),
    ]);

    if (!profile.data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
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

    return NextResponse.json({ lifeScore });
  } catch (error) {
    console.error('Score calculation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
