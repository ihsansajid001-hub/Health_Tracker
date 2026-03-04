import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
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

    // Get all tracking dates (any log counts as a tracked day)
    const today = new Date();
    const trackedDates = new Set<string>();

    // Check last 90 days for streak calculation
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);

      const [sleep, workout, nutrition, mood, hydration] = await Promise.all([
        supabaseAdmin.from('sleep_logs').select('id').eq('user_id', user.id).eq('date', dateStr).limit(1),
        supabaseAdmin.from('workout_logs').select('id').eq('user_id', user.id).eq('date', dateStr).limit(1),
        supabaseAdmin.from('nutrition_logs').select('id').eq('user_id', user.id).eq('date', dateStr).limit(1),
        supabaseAdmin.from('mood_logs').select('id').eq('user_id', user.id).eq('date', dateStr).limit(1),
        supabaseAdmin.from('hydration_logs').select('id').eq('user_id', user.id).eq('date', dateStr).limit(1),
      ]);

      if (
        (sleep.data && sleep.data.length > 0) ||
        (workout.data && workout.data.length > 0) ||
        (nutrition.data && nutrition.data.length > 0) ||
        (mood.data && mood.data.length > 0) ||
        (hydration.data && hydration.data.length > 0)
      ) {
        trackedDates.add(dateStr);
      }
    }

    // Calculate current streak
    let currentStreak = 0;
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);

      if (trackedDates.has(dateStr)) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);

      if (trackedDates.has(dateStr)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return NextResponse.json({
      current: currentStreak,
      longest: longestStreak,
    });
  } catch (error) {
    console.error('Streak calculation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
