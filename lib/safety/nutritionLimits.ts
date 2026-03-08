// Nutrition Safety Limits
// Based on WHO, FDA, AHA, medical research

export interface NutritionIntake {
  calories: number;
  protein: number; // grams
  carbs: number;
  fats: number;
  sugar: number; // added sugars only
  sodium: number; // mg
  caffeine: number; // mg
  water: number; // ml
}

export interface NutritionLimits {
  caloriesMin: number;
  caloriesMax: number;
  proteinMin: number;
  proteinMax: number;
  sugarMax: number;
  sodiumMax: number;
  caffeineMax: number;
  waterMin: number;
  waterMax: number;
}

export interface NutritionSafetyCheck {
  isSafe: boolean;
  warnings: string[];
  dangers: string[];
  recommendations: string[];
}

// Calculate safe nutrition limits based on user profile
export function calculateNutritionLimits(
  weight: number, // kg
  tdee: number, // Total Daily Energy Expenditure
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance',
  conditions: string[]
): NutritionLimits {
  // CALORIE LIMITS
  let caloriesMin = 1200; // Absolute minimum for women
  let caloriesMax = tdee + 500;
  
  if (goal === 'weight_loss') {
    caloriesMax = tdee - 500; // Safe deficit
    caloriesMin = Math.max(1200, tdee - 1000); // Never more than 1000 cal deficit
  } else if (goal === 'muscle_gain') {
    caloriesMax = tdee + 500; // Safe surplus
  }
  
  // Adjust for pregnancy/breastfeeding
  if (conditions.includes('pregnancy_trimester2')) {
    caloriesMin = tdee + 340;
    caloriesMax = tdee + 450;
  } else if (conditions.includes('pregnancy_trimester3')) {
    caloriesMin = tdee + 450;
    caloriesMax = tdee + 550;
  } else if (conditions.includes('breastfeeding')) {
    caloriesMin = Math.max(1800, tdee + 450); // NEVER below 1800 when breastfeeding
    caloriesMax = tdee + 600;
  }

  // PROTEIN LIMITS (g/kg body weight)
  const proteinMin = weight * 0.8; // RDA minimum
  let proteinMax = weight * 3.0; // Safe upper limit
  
  // Reduce for kidney disease
  if (conditions.includes('kidney_disease')) {
    proteinMax = weight * 0.8;
  }

  // SUGAR LIMITS (WHO recommendations)
  const sugarMax = 25; // grams per day (women)
  // Men: 36g, but we'll use conservative 25g default

  // SODIUM LIMITS
  let sodiumMax = 2300; // mg per day (general population)
  if (conditions.includes('hypertension')) {
    sodiumMax = 1500; // Strict limit for high blood pressure
  }

  // CAFFEINE LIMITS
  let caffeineMax = 400; // mg per day (FDA safe limit)
  if (conditions.includes('pregnancy')) {
    caffeineMax = 200; // Reduced for pregnancy
  }
  if (conditions.includes('anxiety') || conditions.includes('heart_disease')) {
    caffeineMax = 200; // Reduced for anxiety/heart conditions
  }

  // WATER LIMITS
  const waterMin = weight * 30; // ml (minimum hydration)
  const waterMax = 5000; // ml (safety cap to prevent water intoxication)

  return {
    caloriesMin,
    caloriesMax,
    proteinMin,
    proteinMax,
    sugarMax,
    sodiumMax,
    caffeineMax,
    waterMin,
    waterMax
  };
}

// Check if daily nutrition intake is safe
export function checkNutritionSafety(
  intake: NutritionIntake,
  limits: NutritionLimits,
  conditions: string[]
): NutritionSafetyCheck {
  const warnings: string[] = [];
  const dangers: string[] = [];
  const recommendations: string[] = [];
  let isSafe = true;

  // CALORIE CHECKS
  if (intake.calories < limits.caloriesMin) {
    dangers.push(`🚨 DANGEROUSLY LOW CALORIES: ${intake.calories} kcal`);
    dangers.push(`Minimum safe intake: ${limits.caloriesMin} kcal`);
    dangers.push('Risk: Malnutrition, muscle loss, metabolic damage');
    isSafe = false;
  } else if (intake.calories < limits.caloriesMin * 1.1) {
    warnings.push(`⚠️ Very low calories: ${intake.calories} kcal`);
    warnings.push('Consider eating more to meet minimum requirements');
  }

  if (intake.calories > limits.caloriesMax) {
    warnings.push(`⚠️ Exceeded calorie goal: ${intake.calories} kcal`);
    warnings.push(`Target: ${limits.caloriesMax} kcal`);
  }

  // PROTEIN CHECKS
  if (intake.protein > limits.proteinMax) {
    dangers.push(`🚨 EXCESSIVE PROTEIN: ${intake.protein}g`);
    dangers.push(`Safe maximum: ${Math.round(limits.proteinMax)}g`);
    dangers.push('Risk: Kidney stress, liver stress, dehydration');
    
    if (conditions.includes('kidney_disease')) {
      dangers.push('⚠️ CRITICAL: You have kidney disease - high protein is dangerous');
      isSafe = false;
    } else {
      warnings.push('⚠️ Ensure adequate hydration with high protein intake');
    }
  }

  if (intake.protein < limits.proteinMin) {
    warnings.push(`⚠️ Low protein: ${intake.protein}g`);
    warnings.push(`Minimum recommended: ${Math.round(limits.proteinMin)}g`);
    recommendations.push('✅ Add protein-rich foods: chicken, fish, eggs, legumes');
  }

  // SUGAR CHECKS
  if (intake.sugar > limits.sugarMax) {
    warnings.push(`⚠️ EXCESSIVE SUGAR: ${intake.sugar}g added sugars`);
    warnings.push(`WHO recommendation: < ${limits.sugarMax}g per day`);
    warnings.push('Risk: Diabetes, obesity, heart disease, tooth decay');
    
    if (conditions.includes('diabetes_type1') || conditions.includes('diabetes_type2')) {
      dangers.push('🚨 CRITICAL: You have diabetes - high sugar is dangerous');
      isSafe = false;
    }
    
    recommendations.push('✅ Reduce: Soda, candy, baked goods, sweetened drinks');
    recommendations.push('✅ Choose: Fruit, unsweetened foods');
  }

  // SODIUM CHECKS
  if (intake.sodium > limits.sodiumMax) {
    warnings.push(`⚠️ EXCESSIVE SODIUM: ${intake.sodium}mg`);
    warnings.push(`Limit: ${limits.sodiumMax}mg per day`);
    
    if (conditions.includes('hypertension')) {
      dangers.push('🚨 CRITICAL: You have high blood pressure - high sodium is dangerous');
      dangers.push('Risk: Stroke, heart attack, kidney damage');
      isSafe = false;
    }
    
    recommendations.push('✅ Reduce: Processed foods, restaurant meals, salty snacks');
    recommendations.push('✅ Choose: Fresh foods, cook at home, use herbs/spices');
  }

  // CAFFEINE CHECKS
  if (intake.caffeine > limits.caffeineMax) {
    warnings.push(`⚠️ EXCESSIVE CAFFEINE: ${intake.caffeine}mg`);
    warnings.push(`Safe limit: ${limits.caffeineMax}mg per day`);
    
    if (intake.caffeine > 600) {
      dangers.push('🚨 DANGEROUS CAFFEINE LEVELS');
      dangers.push('Risk: Heart palpitations, anxiety, insomnia');
      isSafe = false;
    }
    
    if (intake.caffeine > 1000) {
      dangers.push('🚨 SEVERE CAFFEINE TOXICITY RISK');
      dangers.push('Risk: Seizures, cardiac arrhythmia');
      dangers.push('⚠️ SEEK MEDICAL ATTENTION if experiencing symptoms');
      isSafe = false;
    }
    
    if (conditions.includes('pregnancy')) {
      dangers.push('🚨 CRITICAL: Excessive caffeine during pregnancy');
      dangers.push('Risk: Miscarriage, low birth weight');
      isSafe = false;
    }
    
    recommendations.push('✅ Reduce: Coffee, energy drinks, pre-workout supplements');
  }

  // WATER CHECKS
  if (intake.water > limits.waterMax) {
    dangers.push('🚨 WATER INTOXICATION RISK');
    dangers.push(`You've consumed ${intake.water}ml today`);
    dangers.push('STOP DRINKING WATER - Too much water can be FATAL');
    dangers.push('Risk: Hyponatremia (low sodium), brain swelling, death');
    dangers.push('Symptoms: Headache, nausea, confusion, seizures');
    isSafe = false;
  } else if (intake.water > limits.waterMax * 0.8) {
    warnings.push(`⚠️ High water intake: ${intake.water}ml`);
    warnings.push('Approaching dangerous levels - do not exceed 5L per day');
  }

  if (intake.water < limits.waterMin) {
    warnings.push(`⚠️ Low water intake: ${intake.water}ml`);
    warnings.push(`Minimum recommended: ${limits.waterMin}ml`);
    recommendations.push('✅ Drink more water throughout the day');
  }

  return {
    isSafe,
    warnings,
    dangers,
    recommendations
  };
}

// Check hourly water intake rate (prevent rapid overconsumption)
export function checkWaterIntakeRate(
  amountMl: number,
  timeWindowMinutes: number
): NutritionSafetyCheck {
  const warnings: string[] = [];
  const dangers: string[] = [];
  const recommendations: string[] = [];
  let isSafe = true;

  const hourlyRate = (amountMl / timeWindowMinutes) * 60;

  if (hourlyRate > 1000) {
    dangers.push('🚨 DRINKING TOO FAST');
    dangers.push(`Rate: ${Math.round(hourlyRate)}ml per hour`);
    dangers.push('Maximum safe rate: 1,000ml per hour');
    dangers.push('Risk: Water intoxication, hyponatremia');
    isSafe = false;
    recommendations.push('✅ Slow down - sip water gradually');
  } else if (hourlyRate > 800) {
    warnings.push('⚠️ Drinking water very quickly');
    warnings.push('Consider slowing down to prevent overconsumption');
  }

  return {
    isSafe,
    warnings,
    dangers,
    recommendations
  };
}

// Eating disorder warning signs detection
export function detectEatingDisorderSigns(
  dailyCalories: number[],  // Last 7 days
  dailyExerciseMinutes: number[], // Last 7 days
  appOpensPerDay: number[], // Last 7 days
  foodLogsPerDay: number[] // Last 7 days
): {
  hasWarningSign: boolean;
  concerns: string[];
  resources: string[];
} {
  const concerns: string[] = [];
  const resources: string[] = [];
  let hasWarningSign = false;

  // Check for very low calorie intake
  const avgCalories = dailyCalories.reduce((a, b) => a + b, 0) / dailyCalories.length;
  if (avgCalories < 1200) {
    concerns.push('⚠️ Consistently low calorie intake (< 1,200 kcal/day)');
    hasWarningSign = true;
  }

  // Check for excessive exercise
  const avgExercise = dailyExerciseMinutes.reduce((a, b) => a + b, 0) / dailyExerciseMinutes.length;
  if (avgExercise > 120) {
    concerns.push('⚠️ Excessive exercise (> 2 hours/day average)');
    hasWarningSign = true;
  }

  // Check for obsessive app usage
  const avgAppOpens = appOpensPerDay.reduce((a, b) => a + b, 0) / appOpensPerDay.length;
  if (avgAppOpens > 20) {
    concerns.push('⚠️ Obsessive tracking behavior (> 20 app opens/day)');
    hasWarningSign = true;
  }

  // Check for excessive food logging
  const avgFoodLogs = foodLogsPerDay.reduce((a, b) => a + b, 0) / foodLogsPerDay.length;
  if (avgFoodLogs > 10) {
    concerns.push('⚠️ Excessive food logging (> 10 entries/day)');
    hasWarningSign = true;
  }

  if (hasWarningSign) {
    concerns.push('');
    concerns.push('We care about your wellbeing. If you\'re struggling with food, exercise, or body image:');
    
    resources.push('📞 National Eating Disorders Association: 1-800-931-2237');
    resources.push('💬 Crisis Text Line: Text NEDA to 741741');
    resources.push('🌐 NEDA Website: nationaleatingdisorders.org');
  }

  return {
    hasWarningSign,
    concerns,
    resources
  };
}
