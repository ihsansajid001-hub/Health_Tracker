import { LifeScore, SleepLog, WorkoutLog, NutritionLog, MoodLog, HydrationLog, UserProfile } from '@/types';

// Scoring weights
const WEIGHTS = {
  sleep: 0.25,
  fitness: 0.20,
  nutrition: 0.20,
  mind: 0.15,
  hydration: 0.10,
  consistency: 0.10,
};

interface WeeklyData {
  sleepLogs: SleepLog[];
  workoutLogs: WorkoutLog[];
  nutritionLogs: NutritionLog[];
  moodLogs: MoodLog[];
  hydrationLogs: HydrationLog[];
  profile: UserProfile;
}

export class LifeScoreEngine {
  // Calculate Sleep Score (0-100)
  static calculateSleepScore(sleepLogs: SleepLog[], targetHours: number = 8): number {
    if (sleepLogs.length === 0) return 0;

    let totalScore = 0;
    sleepLogs.forEach(log => {
      // Hours score (0-50 points)
      const hoursScore = Math.min((log.hours / targetHours) * 50, 50);
      
      // Quality score (0-50 points)
      const qualityScore = (log.quality / 10) * 50;
      
      totalScore += hoursScore + qualityScore;
    });

    const avgScore = totalScore / sleepLogs.length;
    return Math.round(Math.min(avgScore, 100));
  }

  // Calculate Fitness Score (0-100)
  static calculateFitnessScore(workoutLogs: WorkoutLog[]): number {
    if (workoutLogs.length === 0) return 0;

    // Frequency score (0-60 points) - 3-5 workouts per week is optimal
    const weeklyWorkouts = workoutLogs.length;
    let frequencyScore = 0;
    if (weeklyWorkouts >= 5) frequencyScore = 60;
    else if (weeklyWorkouts >= 3) frequencyScore = 50;
    else frequencyScore = weeklyWorkouts * 15;

    // Intensity score (0-40 points)
    const intensityMap = { low: 20, moderate: 30, high: 40 };
    const avgIntensity = workoutLogs.reduce((sum, log) => sum + intensityMap[log.intensity], 0) / workoutLogs.length;

    const totalScore = frequencyScore + avgIntensity;
    return Math.round(Math.min(totalScore, 100));
  }

  // Calculate Nutrition Score (0-100)
  static calculateNutritionScore(nutritionLogs: NutritionLog[], profile: UserProfile): number {
    if (nutritionLogs.length === 0) return 0;

    const targetCalories = profile.maintenance_calories;
    const targetProtein = profile.weight * 1.8; // 1.8g per kg

    let totalScore = 0;
    nutritionLogs.forEach(log => {
      // Calorie accuracy (0-50 points) - within 10% of target
      const calorieDeviation = Math.abs(log.calories - targetCalories) / targetCalories;
      const calorieScore = Math.max(0, 50 - (calorieDeviation * 100));

      // Protein score (0-50 points)
      const proteinScore = Math.min((log.protein / targetProtein) * 50, 50);

      totalScore += calorieScore + proteinScore;
    });

    const avgScore = totalScore / nutritionLogs.length;
    return Math.round(Math.min(avgScore, 100));
  }

  // Calculate Mind Score (0-100)
  static calculateMindScore(moodLogs: MoodLog[]): number {
    if (moodLogs.length === 0) return 0;

    let totalScore = 0;
    moodLogs.forEach(log => {
      // Mood score (0-40 points)
      const moodScore = (log.mood_score / 10) * 40;

      // Stress score (0-30 points) - lower stress is better
      const stressScore = ((10 - log.stress_level) / 10) * 30;

      // Energy score (0-30 points)
      const energyScore = (log.energy_level / 10) * 30;

      totalScore += moodScore + stressScore + energyScore;
    });

    const avgScore = totalScore / moodLogs.length;
    return Math.round(Math.min(avgScore, 100));
  }

  // Calculate Hydration Score (0-100)
  static calculateHydrationScore(hydrationLogs: HydrationLog[]): number {
    if (hydrationLogs.length === 0) return 0;

    let totalScore = 0;
    hydrationLogs.forEach(log => {
      const percentage = (log.water_ml / log.target_ml) * 100;
      totalScore += Math.min(percentage, 100);
    });

    const avgScore = totalScore / hydrationLogs.length;
    return Math.round(avgScore);
  }

  // Calculate Consistency Score (0-100)
  static calculateConsistencyScore(data: WeeklyData): number {
    const daysTracked = new Set([
      ...data.sleepLogs.map(l => l.date),
      ...data.workoutLogs.map(l => l.date),
      ...data.nutritionLogs.map(l => l.date),
      ...data.moodLogs.map(l => l.date),
      ...data.hydrationLogs.map(l => l.date),
    ]).size;

    // Perfect consistency = tracking every day (7 days)
    const consistencyScore = (daysTracked / 7) * 100;
    return Math.round(consistencyScore);
  }

  // Calculate Overall Life Score
  static calculateLifeScore(data: WeeklyData): LifeScore {
    const sleepScore = this.calculateSleepScore(data.sleepLogs, data.profile.sleep_hours_avg);
    const fitnessScore = this.calculateFitnessScore(data.workoutLogs);
    const nutritionScore = this.calculateNutritionScore(data.nutritionLogs, data.profile);
    const mindScore = this.calculateMindScore(data.moodLogs);
    const hydrationScore = this.calculateHydrationScore(data.hydrationLogs);
    const consistencyScore = this.calculateConsistencyScore(data);

    const overall = Math.round(
      sleepScore * WEIGHTS.sleep +
      fitnessScore * WEIGHTS.fitness +
      nutritionScore * WEIGHTS.nutrition +
      mindScore * WEIGHTS.mind +
      hydrationScore * WEIGHTS.hydration +
      consistencyScore * WEIGHTS.consistency
    );

    return {
      overall,
      sleep: sleepScore,
      fitness: fitnessScore,
      nutrition: nutritionScore,
      mind: mindScore,
      hydration: hydrationScore,
      consistency: consistencyScore,
      timestamp: new Date().toISOString(),
    };
  }

  // Get score level description
  static getScoreLevel(score: number): { level: string; color: string; message: string } {
    if (score >= 90) return { level: 'Excellent', color: 'green', message: 'Outstanding performance!' };
    if (score >= 75) return { level: 'Great', color: 'blue', message: 'You\'re doing great!' };
    if (score >= 60) return { level: 'Good', color: 'yellow', message: 'Good progress, keep going!' };
    if (score >= 40) return { level: 'Fair', color: 'orange', message: 'Room for improvement.' };
    return { level: 'Needs Work', color: 'red', message: 'Let\'s work on this together.' };
  }
}
