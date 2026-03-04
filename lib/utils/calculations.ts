import { OnboardingData } from '@/types';

// Calculate BMI
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
}

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
export function calculateBMR(data: OnboardingData): number {
  const { weight, height, age, gender } = data;
  
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  return Math.round(bmr);
}

// Calculate Maintenance Calories (TDEE)
export function calculateMaintenanceCalories(bmr: number, activityLevel: string): number {
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  
  const multiplier = activityMultipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

// Calculate recommended water intake (ml)
export function calculateWaterIntake(weight: number, activityLevel: string): number {
  let baseWater = weight * 33; // 33ml per kg
  
  if (activityLevel === 'active' || activityLevel === 'very_active') {
    baseWater += 500; // Add 500ml for active individuals
  }
  
  return Math.round(baseWater);
}

// Calculate protein target (grams)
export function calculateProteinTarget(weight: number, goal: string): number {
  const proteinMultipliers: Record<string, number> = {
    fat_loss: 2.2,
    muscle_gain: 2.4,
    improve_sleep: 1.6,
    productivity: 1.8,
    general_wellness: 1.8,
  };
  
  const multiplier = proteinMultipliers[goal] || 1.8;
  return Math.round(weight * multiplier);
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get date range for week
export function getWeekRange(date: Date = new Date()): { start: string; end: string } {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}
