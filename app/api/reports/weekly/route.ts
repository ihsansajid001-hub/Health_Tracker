import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const weekStart = searchParams.get('weekStart')
    
    if (!weekStart) {
      return NextResponse.json({ error: 'Week start date required' }, { status: 400 })
    }

    // Calculate week end date
    const startDate = new Date(weekStart)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Check if report already exists
    const { data: existingReport } = await supabase
      .from('weekly_reports')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', startDateStr)
      .single()

    if (existingReport) {
      return NextResponse.json({ report: existingReport })
    }

    // Fetch data for the week
    const [sleepData, workoutData, nutritionData, moodData, hydrationData] = await Promise.all([
      supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr),
      
      supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr),
      
      supabase
        .from('daily_nutrition_summary')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr),
      
      supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString()),
      
      supabase
        .from('hydration_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
    ])

    // Calculate scores for each area
    const sleepScore = calculateSleepScore(sleepData.data || [])
    const fitnessScore = calculateFitnessScore(workoutData.data || [])
    const nutritionScore = calculateNutritionScore(nutritionData.data || [])
    const mentalScore = calculateMentalScore(moodData.data || [])
    const hydrationScore = calculateHydrationScore(hydrationData.data || [])

    // Calculate overall life score
    const lifeScore = Math.round(
      sleepScore * 0.25 +
      fitnessScore * 0.20 +
      nutritionScore * 0.25 +
      mentalScore * 0.20 +
      hydrationScore * 0.10
    )

    // Determine strongest and weakest areas
    const areas = [
      { name: 'sleep', score: sleepScore },
      { name: 'fitness', score: fitnessScore },
      { name: 'nutrition', score: nutritionScore },
      { name: 'mental', score: mentalScore },
      { name: 'hydration', score: hydrationScore }
    ]
    
    const strongest = areas.reduce((max, area) => area.score > max.score ? area : max)
    const weakest = areas.reduce((min, area) => area.score < min.score ? area : min)

    // Generate insights and recommendations
    const insights = generateWeeklyInsights({
      sleepData: sleepData.data || [],
      workoutData: workoutData.data || [],
      nutritionData: nutritionData.data || [],
      moodData: moodData.data || [],
      hydrationData: hydrationData.data || []
    })

    const recommendations = generateRecommendations(areas)

    // Create the report
    const reportData = {
      user_id: user.id,
      week_start: startDateStr,
      week_end: endDateStr,
      life_score: lifeScore,
      strongest_area: strongest.name,
      weakest_area: weakest.name,
      insights: {
        sleep: sleepScore,
        fitness: fitnessScore,
        nutrition: nutritionScore,
        mental: mentalScore,
        hydration: hydrationScore,
        summary: insights
      },
      recommendations
    }

    const { data: newReport, error } = await supabase
      .from('weekly_reports')
      .insert(reportData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ report: newReport })
  } catch (error) {
    console.error('Error generating weekly report:', error)
    return NextResponse.json(
      { error: 'Failed to generate weekly report' },
      { status: 500 }
    )
  }
}

function calculateSleepScore(sleepData: any[]): number {
  if (sleepData.length === 0) return 0
  
  const avgHours = sleepData.reduce((sum, log) => sum + log.hours, 0) / sleepData.length
  const avgQuality = sleepData.reduce((sum, log) => sum + log.quality, 0) / sleepData.length
  
  let score = 0
  
  // Hours score (50 points)
  if (avgHours >= 7 && avgHours <= 9) {
    score += 50
  } else if (avgHours >= 6 && avgHours < 7) {
    score += 35
  } else if (avgHours >= 5 && avgHours < 6) {
    score += 20
  }
  
  // Quality score (50 points)
  score += (avgQuality / 10) * 50
  
  return Math.round(score)
}

function calculateFitnessScore(workoutData: any[]): number {
  if (workoutData.length === 0) return 0
  
  const workoutCount = workoutData.length
  const avgDuration = workoutData.reduce((sum, workout) => sum + workout.duration_minutes, 0) / workoutData.length
  
  let score = 0
  
  // Frequency score (60 points)
  if (workoutCount >= 3 && workoutCount <= 5) {
    score += 60
  } else if (workoutCount === 2) {
    score += 40
  } else if (workoutCount === 6) {
    score += 50
  } else if (workoutCount === 1) {
    score += 20
  }
  
  // Duration score (40 points)
  if (avgDuration >= 30 && avgDuration <= 60) {
    score += 40
  } else if (avgDuration >= 20 && avgDuration < 30) {
    score += 25
  } else if (avgDuration > 60) {
    score += 30
  }
  
  return Math.round(score)
}

function calculateNutritionScore(nutritionData: any[]): number {
  if (nutritionData.length === 0) return 0
  
  const avgMeals = nutritionData.reduce((sum, day) => sum + day.meals_logged, 0) / nutritionData.length
  const daysWithData = nutritionData.length
  
  let score = 0
  
  // Consistency score (60 points)
  score += (daysWithData / 7) * 60
  
  // Meal logging score (40 points)
  if (avgMeals >= 3) {
    score += 40
  } else if (avgMeals >= 2) {
    score += 25
  } else if (avgMeals >= 1) {
    score += 15
  }
  
  return Math.round(score)
}

function calculateMentalScore(moodData: any[]): number {
  if (moodData.length === 0) return 0
  
  const avgMood = moodData.reduce((sum, entry) => sum + entry.mood_score, 0) / moodData.length
  const avgStress = moodData.reduce((sum, entry) => sum + (entry.stress_level || 5), 0) / moodData.length
  
  let score = 0
  
  // Mood score (60 points)
  score += (avgMood / 6) * 60
  
  // Stress score (40 points) - inverted
  score += ((10 - avgStress) / 10) * 40
  
  return Math.round(score)
}

function calculateHydrationScore(hydrationData: any[]): number {
  if (hydrationData.length === 0) return 0
  
  const goalsMetCount = hydrationData.filter(day => day.water_ml >= day.target_ml).length
  const consistency = goalsMetCount / hydrationData.length
  
  return Math.round(consistency * 100)
}

function generateWeeklyInsights(data: any): string[] {
  const insights = []
  
  if (data.sleepData.length > 0) {
    const avgSleep = data.sleepData.reduce((sum: number, log: any) => sum + log.hours, 0) / data.sleepData.length
    if (avgSleep >= 7.5) {
      insights.push(`Great sleep consistency with ${avgSleep.toFixed(1)} hours average`)
    } else {
      insights.push(`Sleep could improve - averaging ${avgSleep.toFixed(1)} hours`)
    }
  }
  
  if (data.workoutData.length > 0) {
    insights.push(`Completed ${data.workoutData.length} workouts this week`)
  } else {
    insights.push('No workouts logged this week - consider adding some physical activity')
  }
  
  if (data.moodData.length > 0) {
    const avgMood = data.moodData.reduce((sum: number, entry: any) => sum + entry.mood_score, 0) / data.moodData.length
    if (avgMood >= 4) {
      insights.push('Mood tracking shows positive mental wellness')
    } else {
      insights.push('Consider focusing on mental wellness activities')
    }
  }
  
  return insights
}

function generateRecommendations(areas: any[]): string[] {
  const recommendations = []
  const weakest = areas.reduce((min, area) => area.score < min.score ? area : min)
  
  switch (weakest.name) {
    case 'sleep':
      recommendations.push('Establish a consistent bedtime routine')
      recommendations.push('Aim for 7-9 hours of sleep nightly')
      break
    case 'fitness':
      recommendations.push('Schedule 3-4 workout sessions next week')
      recommendations.push('Start with 20-30 minute sessions')
      break
    case 'nutrition':
      recommendations.push('Log all meals to track nutrition goals')
      recommendations.push('Focus on balanced, whole food meals')
      break
    case 'mental':
      recommendations.push('Try 5-10 minutes of daily meditation')
      recommendations.push('Practice gratitude journaling')
      break
    case 'hydration':
      recommendations.push('Set hourly water reminders')
      recommendations.push('Carry a water bottle throughout the day')
      break
  }
  
  return recommendations
}