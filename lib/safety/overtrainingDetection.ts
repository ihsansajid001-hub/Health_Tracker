// Overtraining Syndrome Detection
// Based on sports medicine research

export interface WorkoutLog {
  date: string;
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high';
  type: string;
  completed: boolean;
}

export interface OvertrainingCheck {
  isOvertraining: boolean;
  riskLevel: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  warnings: string[];
  recommendations: string[];
  mandatoryRestDays: number;
}

// Check for overtraining syndrome
export function detectOvertraining(
  recentWorkouts: WorkoutLog[], // Last 14 days
  restingHeartRate?: number, // Current vs baseline
  baselineHeartRate?: number,
  sleepQuality?: number[], // Last 7 days (1-10 scale)
  moodScore?: number[], // Last 7 days (1-10 scale)
  performanceDecline?: boolean
): OvertrainingCheck {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let riskLevel: 'none' | 'low' | 'moderate' | 'high' | 'severe' = 'none';
  let isOvertraining = false;
  let mandatoryRestDays = 0;

  // Count consecutive workout days
  const last7Days = recentWorkouts.slice(-7);
  const last14Days = recentWorkouts;
  
  const consecutiveDays = countConsecutiveWorkoutDays(last7Days);
  const totalWorkoutsLast7Days = last7Days.filter(w => w.completed).length;
  const totalWorkoutsLast14Days = last14Days.filter(w => w.completed).length;

  // Calculate average workout duration
  const avgDuration = last7Days.reduce((sum, w) => sum + w.duration, 0) / last7Days.length;
  
  // Count high-intensity workouts
  const highIntensityCount = last7Days.filter(w => w.intensity === 'high').length;

  // RISK FACTOR 1: Consecutive days without rest
  if (consecutiveDays >= 7) {
    warnings.push('🚨 SEVERE: 7+ consecutive workout days without rest');
    warnings.push('Risk: Overtraining syndrome, injury, immune suppression');
    riskLevel = 'severe';
    isOvertraining = true;
    mandatoryRestDays = 2;
  } else if (consecutiveDays >= 6) {
    warnings.push('⚠️ HIGH RISK: 6 consecutive workout days');
    warnings.push('Mandatory rest day required');
    riskLevel = 'high';
    mandatoryRestDays = 1;
  } else if (consecutiveDays >= 5) {
    warnings.push('⚠️ MODERATE RISK: 5 consecutive workout days');
    warnings.push('Consider taking a rest day');
    riskLevel = 'moderate';
  }

  // RISK FACTOR 2: Excessive workout frequency
  if (totalWorkoutsLast7Days === 7) {
    warnings.push('⚠️ No rest days in past week');
    warnings.push('Rest is essential for recovery and muscle growth');
    if (riskLevel === 'none') riskLevel = 'moderate';
  }

  if (totalWorkoutsLast14Days >= 13) {
    warnings.push('⚠️ Only 1 rest day in past 2 weeks');
    warnings.push('Insufficient recovery time');
    if (riskLevel === 'none' || riskLevel === 'low') riskLevel = 'moderate';
  }

  // RISK FACTOR 3: Excessive duration
  if (avgDuration > 120) {
    warnings.push('⚠️ Average workout duration > 2 hours');
    warnings.push('Risk: Overtraining, cortisol elevation, muscle breakdown');
    if (riskLevel === 'none') riskLevel = 'low';
  }

  // RISK FACTOR 4: Too many high-intensity workouts
  if (highIntensityCount >= 5) {
    warnings.push('⚠️ 5+ high-intensity workouts in past week');
    warnings.push('High-intensity training requires 48-72 hours recovery');
    if (riskLevel === 'none' || riskLevel === 'low') riskLevel = 'moderate';
  }

  // RISK FACTOR 5: Elevated resting heart rate
  if (restingHeartRate && baselineHeartRate) {
    const hrIncrease = restingHeartRate - baselineHeartRate;
    if (hrIncrease >= 10) {
      warnings.push('🚨 Elevated resting heart rate (+10 bpm above baseline)');
      warnings.push('Strong indicator of overtraining syndrome');
      isOvertraining = true;
      if (riskLevel === 'none' || riskLevel === 'low') riskLevel = 'high';
    } else if (hrIncrease >= 5) {
      warnings.push('⚠️ Elevated resting heart rate (+5 bpm above baseline)');
      warnings.push('Possible early sign of overtraining');
      if (riskLevel === 'none') riskLevel = 'low';
    }
  }

  // RISK FACTOR 6: Poor sleep quality
  if (sleepQuality && sleepQuality.length >= 3) {
    const avgSleepQuality = sleepQuality.reduce((a, b) => a + b, 0) / sleepQuality.length;
    if (avgSleepQuality < 5) {
      warnings.push('⚠️ Poor sleep quality (< 5/10 average)');
      warnings.push('Sleep disruption is a key symptom of overtraining');
      if (riskLevel === 'none') riskLevel = 'low';
    }
  }

  // RISK FACTOR 7: Low mood/motivation
  if (moodScore && moodScore.length >= 3) {
    const avgMood = moodScore.reduce((a, b) => a + b, 0) / moodScore.length;
    if (avgMood < 5) {
      warnings.push('⚠️ Low mood/motivation (< 5/10 average)');
      warnings.push('Psychological symptoms of overtraining');
      if (riskLevel === 'none') riskLevel = 'low';
    }
  }

  // RISK FACTOR 8: Performance decline
  if (performanceDecline) {
    warnings.push('⚠️ Performance decline detected');
    warnings.push('Getting weaker despite training = overtraining');
    isOvertraining = true;
    if (riskLevel === 'none' || riskLevel === 'low') riskLevel = 'moderate';
  }

  // RECOMMENDATIONS based on risk level
  if (riskLevel === 'severe' || isOvertraining) {
    recommendations.push('🛑 STOP TRAINING IMMEDIATELY');
    recommendations.push(`Take ${mandatoryRestDays} full rest days (no exercise)`);
    recommendations.push('Recovery may take weeks to months');
    recommendations.push('Consider consulting sports medicine doctor');
    recommendations.push('Focus on: Sleep, nutrition, stress management');
  } else if (riskLevel === 'high') {
    recommendations.push('🛑 MANDATORY REST DAY');
    recommendations.push('Do not exercise today');
    recommendations.push('Light stretching or walking only');
    recommendations.push('Ensure 8+ hours sleep tonight');
  } else if (riskLevel === 'moderate') {
    recommendations.push('⚠️ Take a rest day within next 24 hours');
    recommendations.push('Reduce workout intensity this week');
    recommendations.push('Ensure adequate sleep (7-9 hours)');
    recommendations.push('Consider active recovery (light yoga, walking)');
  } else if (riskLevel === 'low') {
    recommendations.push('✅ Schedule rest days: Minimum 1-2 per week');
    recommendations.push('✅ Vary intensity: Not every workout should be hard');
    recommendations.push('✅ Listen to your body: Rest if feeling fatigued');
  } else {
    recommendations.push('✅ Good training balance');
    recommendations.push('✅ Continue with 1-2 rest days per week');
  }

  // General recommendations
  recommendations.push('');
  recommendations.push('📚 Overtraining Syndrome Symptoms:');
  recommendations.push('  • Persistent fatigue (not relieved by rest)');
  recommendations.push('  • Performance decline');
  recommendations.push('  • Elevated resting heart rate');
  recommendations.push('  • Sleep disturbances');
  recommendations.push('  • Mood changes (irritability, depression)');
  recommendations.push('  • Frequent illness');
  recommendations.push('  • Chronic muscle soreness');
  recommendations.push('  • Loss of motivation');

  return {
    isOvertraining,
    riskLevel,
    warnings,
    recommendations,
    mandatoryRestDays
  };
}

// Count consecutive workout days
function countConsecutiveWorkoutDays(workouts: WorkoutLog[]): number {
  if (workouts.length === 0) return 0;

  // Sort by date (most recent first)
  const sorted = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let consecutive = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const workout of sorted) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === consecutive && workout.completed) {
      consecutive++;
    } else {
      break;
    }
  }

  return consecutive;
}

// Check if user should be blocked from working out
export function shouldBlockWorkout(overtrainingCheck: OvertrainingCheck): {
  blocked: boolean;
  message: string;
} {
  if (overtrainingCheck.mandatoryRestDays > 0) {
    return {
      blocked: true,
      message: `🛑 MANDATORY REST DAY\n\nYou've worked out ${overtrainingCheck.mandatoryRestDays >= 2 ? '7+' : '6'} consecutive days without rest.\n\nOvertraining can cause:\n• Injury\n• Illness\n• Performance decline\n• Hormonal imbalances\n\nRest is when your body gets stronger.\n\nTake ${overtrainingCheck.mandatoryRestDays} day(s) off, then come back stronger! 💪`
    };
  }

  if (overtrainingCheck.isOvertraining) {
    return {
      blocked: true,
      message: '⚠️ OVERTRAINING DETECTED\n\nMultiple warning signs indicate you may be overtraining.\n\nPlease take at least 1 rest day before continuing.\n\nYour health and safety are our priority.'
    };
  }

  return {
    blocked: false,
    message: ''
  };
}

// Calculate recommended rest days per week based on training intensity
export function calculateRecommendedRestDays(
  workoutsPerWeek: number,
  avgIntensity: 'low' | 'moderate' | 'high',
  age: number
): number {
  let restDays = 2; // Default minimum

  // Adjust for workout frequency
  if (workoutsPerWeek <= 3) {
    restDays = 4;
  } else if (workoutsPerWeek <= 4) {
    restDays = 3;
  } else if (workoutsPerWeek <= 5) {
    restDays = 2;
  } else {
    restDays = 1; // Minimum for very active individuals
  }

  // Adjust for intensity
  if (avgIntensity === 'high') {
    restDays += 1;
  }

  // Adjust for age (older adults need more recovery)
  if (age >= 50) {
    restDays += 1;
  } else if (age >= 40) {
    restDays += 0.5;
  }

  return Math.min(Math.round(restDays), 4); // Cap at 4 rest days
}
