import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils/calculations';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ current: 0, longest: 0 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ current: 0, longest: 0 });
    }

    const today = new Date();
    const ninetyDaysAgo = formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));

    // ONE query per table for the full 90-day window — not 90×5 queries
    const [sleep, workout, nutrition, mood, hydration] = await Promise.all([
      supabaseAdmin.from('sleep_logs').select('date').eq('user_id', user.id).gte('date', ninetyDaysAgo),
      supabaseAdmin.from('workout_logs').select('date').eq('user_id', user.id).gte('date', ninetyDaysAgo),
      supabaseAdmin.from('nutrition_logs').select('date').eq('user_id', user.id).gte('date', ninetyDaysAgo),
      supabaseAdmin.from('mood_logs').select('date').eq('user_id', user.id).gte('date', ninetyDaysAgo),
      supabaseAdmin.from('hydration_logs').select('date').eq('user_id', user.id).gte('date', ninetyDaysAgo),
    ]);

    // Build a set of all dates that have at least one log entry
    const trackedDates = new Set<string>();
    [sleep, workout, nutrition, mood, hydration].forEach(result => {
      result.data?.forEach((row: any) => trackedDates.add(row.date));
    });

    // Calculate current streak (backwards from today)
    let currentStreak = 0;
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (trackedDates.has(formatDate(d))) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let temp = 0;
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (trackedDates.has(formatDate(d))) {
        temp++;
        longestStreak = Math.max(longestStreak, temp);
      } else {
        temp = 0;
      }
    }

    return NextResponse.json({ current: currentStreak, longest: longestStreak });
  } catch (error) {
    console.error('Streak error:', error);
    return NextResponse.json({ current: 0, longest: 0 });
  }
}
