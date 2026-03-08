// Life Performance Score Calculation Engine
// Combines Sleep, Fitness, Nutrition, Mind, and Hydration into one score

export interface SleepData {
  totalHours: number;
  sleepQuality: number; // 1-10
  sleepScore?: number; // 0-100
  consistency: number; // Days with good sleep in last 7 days
}

export interface FitnessData {
  workoutsThisWeek: number;
  avgDuration: number; // minutes
  caloriesBurned: number;
  consistency: number; // Workout streak
}

export interface NutritionData {
  caloriesConsumed: number;
  calorieGoal: number;
  proteinGrams: number;
  proteinGoal: number;
  mealsLogged: number;
  waterIntakeMl: number;
  waterGoalMl: number;
}

export interface MindData {
  moodScore: number; // 1-10
  stressLevel: number; // 1-10
  meditationMinutes: number;
  journalEntries: number;
}

export interface HydrationData {
  waterIntakeMl: number;
  waterGoalMl: number;
  consistency: number; // Days goal reached in last 7 days
}

export interface LifeScore {
  overall: number; // 0-100
  sleep: number; // 0-100
  fitness: number; // 0-100
  nutrition: number; // 0-100
  mind: number; // 0-100
  hydration: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  insights: string[];
}

// Calculate Sleep Score (0-100)
export function calculateSleepScore(data: SleepData): number {
  let score = 0;

  // Duration Score (30 points)
  // Optimal: 7-9 hours
  if (data.totalHours >= 7 && data.totalHours <= 9) {
    score += 30;
  } else if (data.totalHours >= 6 && data.totalHours < 7) {
    score += 20;
  } else if (data.totalHours >= 5 && data.totalHours < 6) {
    score += 10;
  } else if (data.totalHours > 9 && data.totalHours <= 10) {
    score += 20;
  }

  // Quality Score (40 points)
  // Based on user-reported quality (1-10 scale)
  score += (data.sleepQuality / 10) * 40;

  // Consistency Score (20 points)
  // Based on how many days in last week had good sleep
  score += (data.consistency / 7) * 20;

  // Sleep Score from tracking (10 points bonus if available)
  if (data.sleepScore) {
    score += (data.sleepScore / 100) * 10;
  }

  return Math.min(Math.round(score), 100);
}

// Calculate Fitness Score (0-100)
export function calculateFitnessScore(data: FitnessData): number {
  let score = 0;

  // Workout Frequency (40 points)
  // Optimal: 3-5 workouts per week
  if (data.workoutsThisWeek >= 3 && data.workoutsThisWeek <= 5) {
    score += 40;
  } else if (data.workoutsThisWeek === 2) {
    score += 25;
  } else if (data.workoutsThisWeek === 6) {
    score += 35;
  } else if (data.workoutsThisWeek === 1) {
    score += 15;
  } else if (data.workoutsThisWeek >= 7) {
    score += 20; // Penalize overtraining
  }

  // Workout Duration (30 points)
  // Optimal: 30-60 minutes average
  if (data.avgDuration >= 30 && data.avgDuration <= 60) {
    score += 30;
  } else if (data.avgDuration >= 20 && data.avgDuration < 30) {
    score += 20;
  } else if (data.avgDuration > 60 && data.avgDuration <= 90) {
    score += 25;
  } else if (data.avgDuration >= 15 && data.avgDuration < 20) {
    score += 15;
  }

  // Consistency/Streak (20 points)
  // Reward consistent exercise habits
  if (data.consistency >= 7) {
    score += 20;
  } else if (data.consistency >= 5) {
    score += 15;
  } else if (data.consistency >= 3) {
    score += 10;
  } else if (data.consistency >= 1) {
    score += 5;
  }

  // Calorie Burn (10 points)
  // Bonus for active lifestyle
  if (data.caloriesBurned >= 2000) {
    score += 10;
  } else if (data.caloriesBurned >= 1500) {
    score += 7;
  } else if (data.caloriesBurned >= 1000) {
    score += 5;
  }

  return Math.min(Math.round(score), 100);
}

// Calculate Nutrition Score (0-100)
export function calculateNutritionScore(data: NutritionData): number {
  let score = 0;

  // Calorie Goal Adherence (35 points)
  const calorieRatio = data.caloriesConsumed / data.calorieGoal;
  if (calorieRatio >= 0.9 && calorieRatio <= 1.1) {
    score += 35; // Within 10% of goal
  } else if (calorieRatio >= 0.8 && calorieRatio <= 1.2) {
    score += 25; // Within 20% of goal
  } else if (calorieRatio >= 0.7 && calorieRatio <= 1.3) {
    score += 15;
  } else if (calorieRatio >= 0.6 && calorieRatio <= 1.4) {
    score += 5;
  }

  // Protein Goal Adherence (25 points)
  const proteinRatio = data.proteinGrams / data.proteinGoal;
  if (proteinRatio >= 0.9 && proteinRatio <= 1.1) {
    score += 25;
  } else if (proteinRatio >= 0.8 && proteinRatio <= 1.2) {
    score += 18;
  } else if (proteinRatio >= 0.7 && proteinRatio <= 1.3) {
    score += 10;
  }

  // Meal Logging Consistency (20 points)
  // Optimal: 3-5 meals logged
  if (data.mealsLogged >= 3 && data.mealsLogged <= 5) {
    score += 20;
  } else if (data.mealsLogged === 2) {
    score += 12;
  } else if (data.mealsLogged === 6) {
    score += 15;
  } else if (data.mealsLogged === 1) {
    score += 6;
  }

  // Hydration Integration (20 points)
  const waterRatio = data.waterIntakeMl / data.waterGoalMl;
  if (waterRatio >= 0.9 && waterRatio <= 1.0) {
    score += 20;
  } else if (waterRatio >= 0.8 && waterRatio < 0.9) {
    score += 15;
  } else if (waterRatio >= 0.7 && waterRatio < 0.8) {
    score += 10;
  } else if (waterRatio > 1.0 && waterRatio <= 1.1) {
    score += 15;
  }

  return Math.min(Math.round(score), 100);
}

// Calculate Mind Score (0-100)
export function calculateMindScore(data: MindData): number {
  let score = 0;

  // Mood Score (40 points)
  // Higher mood = better score
  score += (data.moodScore / 10) * 40;

  // Stress Level (30 points)
  // Lower stress = better score (inverted)
  score += ((10 - data.stressLevel) / 10) * 30;

  // Meditation Practice (20 points)
  // Optimal: 10-30 minutes per day
  if (data.meditationMinutes >= 10 && data.meditationMinutes <= 30) {
    score += 20;
  } else if (data.meditationMinutes >= 5 && data.meditationMinutes < 10) {
    score += 12;
  } else if (data.meditationMinutes > 30 && data.meditationMinutes <= 60) {
    score += 15;
  } else if (data.meditationMinutes >= 3 && data.meditationMinutes < 5) {
    score += 8;
  }

  // Journaling (10 points)
  // Bonus for self-reflection
  if (data.journalEntries >= 1) {
    score += 10;
  }

  return Math.min(Math.round(score), 100);
}

// Calculate Hydration Score (0-100)
export function calculateHydrationScore(data: HydrationData): number {
  let score = 0;

  // Daily Goal Achievement (70 points)
  const waterRatio = data.waterIntakeMl / data.waterGoalMl;
  if (waterRatio >= 0.9 && waterRatio <= 1.0) {
    score += 70; // Perfect hydration
  } else if (waterRatio >= 0.8 && waterRatio < 0.9) {
    score += 55;
  } else if (waterRatio >= 0.7 && waterRatio < 0.8) {
    score += 40;
  } else if (waterRatio >= 0.6 && waterRatio < 0.7) {
    score += 25;
  } else if (waterRatio >= 0.5 && waterRatio < 0.6) {
    score += 15;
  } else if (waterRatio > 1.0 && waterRatio <= 1.1) {
    score += 60; // Slightly over is okay
  } else if (waterRatio > 1.1 && waterRatio <= 1.2) {
    score += 40; // Too much water
  } else if (waterRatio > 1.2) {
    score += 10; // Dangerous overconsumption
  }

  // Consistency (30 points)
  // Days goal reached in last 7 days
  score += (data.consistency / 7) * 30;

  return Math.min(Math.round(score), 100);
}

// Calculate Overall Life Performance Score
export function calculateLifeScore(
  sleep: SleepData,
  fitness: FitnessData,
  nutrition: NutritionData,
  mind: MindData,
  hydration: HydrationData,
  previousScore?: number
): LifeScore {
  // Calculate individual scores
  const sleepScore = calculateSleepScore(sleep);
  const fitnessScore = calculateFitnessScore(fitness);
  const nutritionScore = calculateNutritionScore(nutrition);
  const mindScore = calculateMindScore(mind);
  const hydrationScore = calculateHydrationScore(hydration);

  // Weighted average for overall score
  // Sleep: 25%, Fitness: 20%, Nutrition: 25%, Mind: 20%, Hydration: 10%
  const overall = Math.round(
    sleepScore * 0.25 +
    fitnessScore * 0.20 +
    nutritionScore * 0.25 +
    mindScore * 0.20 +
    hydrationScore * 0.10
  );

  // Determine trend
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (previousScore) {
    if (overall > previousScore + 3) {
      trend = 'up';
    } else if (overall < previousScore - 3) {
      trend = 'down';
    }
  }

  // Generate insights
  const insights = generateInsights({
    overall,
    sleep: sleepScore,
    fitness: fitnessScore,
    nutrition: nutritionScore,
    mind: mindScore,
    hydration: hydrationScore,
  });

  return {
    overall,
    sleep: sleepScore,
    fitness: fitnessScore,
    nutrition: nutritionScore,
    mind: mindScore,
    hydration: hydrationScore,
    trend,
    insights,
  };
}

// Generate personalized insights
function generateInsights(scores: Omit<LifeScore, 'trend' | 'insights'>): string[] {
  const insights: string[] = [];

  // Overall performance
  if (scores.overall >= 90) {
    insights.push('🌟 Exceptional! You\'re crushing your wellness goals!');
  } else if (scores.overall >= 80) {
    insights.push('💪 Great job! You\'re maintaining excellent habits.');
  } else if (scores.overall >= 70) {
    insights.push('👍 Good progress! Keep building those healthy habits.');
  } else if (scores.overall >= 60) {
    insights.push('📈 You\'re on the right track. Small improvements add up!');
  } else {
    insights.push('🌱 Every journey starts somewhere. Focus on one area at a time.');
  }

  // Identify strongest area
  const areas = [
    { name: 'Sleep', score: scores.sleep },
    { name: 'Fitness', score: scores.fitness },
    { name: 'Nutrition', score: scores.nutrition },
    { name: 'Mind', score: scores.mind },
    { name: 'Hydration', score: scores.hydration },
  ];
  const strongest = areas.reduce((max, area) => area.score > max.score ? area : max);
  if (strongest.score >= 80) {
    insights.push(`✨ ${strongest.name} is your superpower! Keep it up.`);
  }

  // Identify area needing attention
  const weakest = areas.reduce((min, area) => area.score < min.score ? area : min);
  if (weakest.score < 60) {
    insights.push(`🎯 Focus on ${weakest.name} for the biggest impact.`);
  }

  // Specific recommendations
  if (scores.sleep < 70) {
    insights.push('😴 Prioritize 7-9 hours of sleep tonight.');
  }
  if (scores.fitness < 70) {
    insights.push('🏃 Aim for 3-5 workouts this week.');
  }
  if (scores.nutrition < 70) {
    insights.push('🥗 Track your meals to stay on target.');
  }
  if (scores.mind < 70) {
    insights.push('🧘 Try a 5-minute meditation today.');
  }
  if (scores.hydration < 70) {
    insights.push('💧 Drink more water throughout the day.');
  }

  return insights.slice(0, 4); // Return top 4 insights
}
