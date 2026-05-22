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
    const days = parseInt(searchParams.get('days') || '30')
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Fetch data for score calculation
    const [sleepData, workoutData, nutritionData, moodData, hydrationData] = await Promise.all([
      supabase
        .from('sleep_logs')
        .select('date, hours, quality')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true }),
      
      supabase
        .from('workout_logs')
        .select('date, duration_minutes')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true }),
      
      supabase
        .from('daily_nutrition_summary')
        .select('date, total_calories, meals_logged')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true }),
      
      supabase
        .from('mood_entries')
        .select('timestamp, mood_score, energy_level')
        .eq('user_id', user.id)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp', { ascending: true }),
      
      supabase
        .from('hydration_logs')
        .select('date, water_ml, target_ml')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true })
    ])

    // Get user profile for targets
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('daily_water_goal')
      .eq('user_id', user.id)
      .single()

    // Calculate daily scores
    const scoreData = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      
      // Sleep score (0-25 points)
      const sleepLog = sleepData.data?.find(log => log.date === dateStr)
      let sleepScore = 0
      if (sleepLog) {
        const hoursScore = Math.min(sleepLog.hours / 8 * 15, 15) // 15 points for 8+ hours
        const qualityScore = (sleepLog.quality / 10) * 10 // 10 points for quality
        sleepScore = hoursScore + qualityScore
      }

      // Fitness score (0-25 points)
      const workoutLog = workoutData.data?.find(log => log.date === dateStr)
      let fitnessScore = 0
      if (workoutLog) {
        fitnessScore = Math.min(workoutLog.duration_minutes / 30 * 25, 25) // 25 points for 30+ min workout
      }

      // Nutrition score (0-25 points)
      const nutritionLog = nutritionData.data?.find(log => log.date === dateStr)
      let nutritionScore = 0
      if (nutritionLog) {
        const mealsScore = Math.min(nutritionLog.meals_logged / 3 * 25, 25) // 25 points for 3+ meals
        nutritionScore = mealsScore
      }

      // Hydration score (0-15 points)
      const hydrationLog = hydrationData.data?.find(log => log.date === dateStr)
      let hydrationScore = 0
      if (hydrationLog && profile?.daily_water_goal) {
        const hydrationRate = hydrationLog.water_ml / profile.daily_water_goal
        hydrationScore = Math.min(hydrationRate * 15, 15)
      }

      // Mental wellness score (0-10 points)
      const dayStart = new Date(dateStr + 'T00:00:00')
      const dayEnd = new Date(dateStr + 'T23:59:59')
      const moodEntries = moodData.data?.filter(entry => {
        const entryDate = new Date(entry.timestamp)
        return entryDate >= dayStart && entryDate <= dayEnd
      })
      
      let mentalScore = 0
      if (moodEntries && moodEntries.length > 0) {
        const avgMood = moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length
        mentalScore = (avgMood / 6) * 10 // Convert 1-6 scale to 0-10 points
      }

      const totalScore = Math.round(sleepScore + fitnessScore + nutritionScore + hydrationScore + mentalScore)
      
      scoreData.push({
        date: dateStr,
        score: totalScore,
        breakdown: {
          sleep: Math.round(sleepScore),
          fitness: Math.round(fitnessScore),
          nutrition: Math.round(nutritionScore),
          hydration: Math.round(hydrationScore),
          mental: Math.round(mentalScore)
        }
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Calculate trend
    const recentScores = scoreData.slice(-7).map(d => d.score).filter(s => s > 0)
    const previousScores = scoreData.slice(-14, -7).map(d => d.score).filter(s => s > 0)
    
    let trend = 'stable'
    if (recentScores.length > 0 && previousScores.length > 0) {
      const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
      const previousAvg = previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length
      const change = ((recentAvg - previousAvg) / previousAvg) * 100
      
      if (change > 5) trend = 'improving'
      else if (change < -5) trend = 'declining'
    }

    return NextResponse.json({
      trend,
      data: scoreData,
      summary: {
        currentScore: scoreData[scoreData.length - 1]?.score || 0,
        averageScore: Math.round(scoreData.reduce((sum, d) => sum + d.score, 0) / scoreData.length) || 0,
        bestScore: Math.max(...scoreData.map(d => d.score)),
        daysTracked: scoreData.filter(d => d.score > 0).length
      }
    })
  } catch (error) {
    console.error('Error fetching score trend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch score trend' },
      { status: 500 }
    )
  }
}