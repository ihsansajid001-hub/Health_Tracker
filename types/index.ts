// User Types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  sleep_hours_avg: number;
  stress_level: number; // 1-10
  primary_goal: 'fat_loss' | 'muscle_gain' | 'improve_sleep' | 'productivity' | 'general_wellness';
  bmi: number;
  bmr: number;
  maintenance_calories: number;
  created_at: string;
  updated_at: string;
}

// Tracking Types
export interface SleepLog {
  id: string;
  user_id: string;
  date: string;
  hours: number;
  quality: number; // 1-10
  bedtime: string;
  wake_time: string;
  notes?: string;
  created_at: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  date: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high';
  calories_burned?: number;
  notes?: string;
  created_at: string;
}

export interface NutritionLog {
  id: string;
  user_id: string;
  date: string;
  calories: number;
  protein: number; // grams
  carbs?: number;
  fats?: number;
  meals_count: number;
  notes?: string;
  created_at: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  date: string;
  mood_score: number; // 1-10
  stress_level: number; // 1-10
  energy_level: number; // 1-10
  notes?: string;
  created_at: string;
}

export interface HydrationLog {
  id: string;
  user_id: string;
  date: string;
  water_ml: number;
  target_ml: number;
  created_at: string;
}

// Score Types
export interface LifeScore {
  overall: number;
  sleep: number;
  fitness: number;
  nutrition: number;
  mind: number;
  hydration: number;
  trend: 'up' | 'down' | 'stable';
  insights: string[];
}

export interface WeeklyReport {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  life_score: number;
  strongest_area: string;
  weakest_area: string;
  insights: string[];
  recommendations: string[];
  created_at: string;
}

// Dashboard Types
export interface DashboardStats {
  lifeScore: LifeScore;
  streaks: {
    current: number;
    longest: number;
  };
  weeklyTrend: Array<{
    date: string;
    score: number;
  }>;
  recentAchievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: string;
  category: 'sleep' | 'fitness' | 'nutrition' | 'mind' | 'hydration' | 'consistency';
}

// Onboarding Types
export interface OnboardingData {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  sleep_hours_avg: number;
  stress_level: number;
  primary_goal: 'fat_loss' | 'muscle_gain' | 'improve_sleep' | 'productivity' | 'general_wellness';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
