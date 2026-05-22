import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get recent data from the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const dateStr = sevenDaysAgo.toISOString().split('T')[0]

    // Fetch recent data from multiple tables
    const [sleepData, workoutData, nutritionData, moodData, hydrationData] = await Promise.all([
      supabase
        .from('sleep_logs')
        .select('date, hours, quality')
        .eq('user_id', user.id)
        .gte('date', dateStr)
        .order('date', { ascending: false }),
      
      supabase
        .from('workout_logs')
        .select('date, duration_minutes, workout_type')
        .eq('user_id', user.id)
        .gte('date', dateStr)
        .order('date', { ascending: false }),
      
      supabase
        .from('daily_nutrition_summary')
        .select('date, total_calories, meals_logged')
        .eq('user_id', user.id)
        .gte('date', dateStr)
        .order('date', { ascending: false }),
      
      supabase
        .from('mood_entries')
        .select('timestamp, mood_score, energy_level, stress_level')
        .eq('user_id', user.id)
        .gte('timestamp', sevenDaysAgo.toISOString())
        .order('timestamp', { ascending: false }),
      
      supabase
        .from('hydration_logs')
        .select('date, water_ml, target_ml')
        .eq('user_id', user.id)
        .gte('date', dateStr)
        .order('date', { ascending: false })
    ])

    // Generate insights based on the data
    const insights = []

    // Sleep insights
    if (sleepData.data && sleepData.data.length > 0) {
      const avgSleep = sleepData.data.reduce((sum, log) => sum + log.hours, 0) / sleepData.data.length
      const avgQuality = sleepData.data.reduce((sum, log) => sum + log.quality, 0) / sleepData.data.length
      
      if (avgSleep < 7) {
        insights.push({
          type: 'sleep',
          title: 'Sleep Duration Below Target',
          message: `Your average sleep this week is ${avgSleep.toFixed(1)} hours. Consider going to bed earlier to reach 7-8 hours.`,
          priority: 'high',
          category: 'sleep'
        })
      }
      
      if (avgQuality < 6) {
        insights.push({
          type: 'sleep',
          title: 'Sleep Quality Could Improve',
          message: `Your sleep quality average is ${avgQuality.toFixed(1)}/10. Try establishing a consistent bedtime routine.`,
          priority: 'medium',
          category: 'sleep'
        })
      }
    }

    // Workout insights
    if (workoutData.data && workoutData.data.length > 0) {
      const workoutDays = workoutData.data.length
      if (workoutDays >= 4) {
        insights.push({
          type: 'fitness',
          title: 'Great Workout Consistency!',
          message: `You've worked out ${workoutDays} times this week. Keep up the excellent routine!`,
          priority: 'positive',
          category: 'fitness'
        })
      } else if (workoutDays < 2) {
        insights.push({
          type: 'fitness',
          title: 'Increase Workout Frequency',
          message: `Only ${workoutDays} workout${workoutDays === 1 ? '' : 's'} this week. Try to aim for at least 3 sessions.`,
          priority: 'medium',
          category: 'fitness'
        })
      }
    } else {
      insights.push({
        type: 'fitness',
        title: 'No Workouts Logged',
        message: 'Start your fitness journey by logging your first workout this week!',
        priority: 'high',
        category: 'fitness'
      })
    }

    // Nutrition insights
    if (nutritionData.data && nutritionData.data.length > 0) {
      const avgMeals = nutritionData.data.reduce((sum, log) => sum + log.meals_logged, 0) / nutritionData.data.length
      if (avgMeals < 2) {
        insights.push({
          type: 'nutrition',
          title: 'Log More Meals',
          message: `You're averaging ${avgMeals.toFixed(1)} meals logged per day. Try to log all your meals for better tracking.`,
          priority: 'medium',
          category: 'nutrition'
        })
      }
    }

    // Hydration insights
    if (hydrationData.data && hydrationData.data.length > 0) {
      const hydrationRate = hydrationData.data.filter(log => log.water_ml >= log.target_ml).length / hydrationData.data.length
      if (hydrationRate < 0.5) {
        insights.push({
          type: 'hydration',
          title: 'Increase Water Intake',
          message: `You're meeting your hydration goal only ${Math.round(hydrationRate * 100)}% of the time. Set reminders to drink more water.`,
          priority: 'medium',
          category: 'hydration'
        })
      } else if (hydrationRate >= 0.8) {
        insights.push({
          type: 'hydration',
          title: 'Excellent Hydration!',
          message: `You're consistently meeting your water goals ${Math.round(hydrationRate * 100)}% of the time. Great job!`,
          priority: 'positive',
          category: 'hydration'
        })
      }
    }

    // Mood insights
    if (moodData.data && moodData.data.length > 0) {
      const avgMood = moodData.data.reduce((sum, entry) => sum + entry.mood_score, 0) / moodData.data.length
      const avgStress = moodData.data.reduce((sum, entry) => sum + (entry.stress_level || 5), 0) / moodData.data.length
      
      if (avgMood < 3) {
        insights.push({
          type: 'mental',
          title: 'Mood Support Needed',
          message: `Your mood has been lower than usual. Consider meditation or talking to someone you trust.`,
          priority: 'high',
          category: 'mental'
        })
      }
      
      if (avgStress > 7) {
        insights.push({
          type: 'mental',
          title: 'High Stress Levels',
          message: `Your stress levels are elevated. Try breathing exercises or take short breaks throughout the day.`,
          priority: 'high',
          category: 'mental'
        })
      }
    }

    // If no specific insights, add general encouragement
    if (insights.length === 0) {
      insights.push({
        type: 'general',
        title: 'Keep Up the Good Work!',
        message: 'Your wellness journey is on track. Continue logging your activities to get more personalized insights.',
        priority: 'positive',
        category: 'general'
      })
    }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}