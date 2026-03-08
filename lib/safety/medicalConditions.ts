// Medical Conditions and Safety Checks
// Based on comprehensive medical research

export type MedicalCondition = 
  | 'hypertension'
  | 'diabetes_type1'
  | 'diabetes_type2'
  | 'heart_disease'
  | 'asthma'
  | 'pregnancy'
  | 'breastfeeding'
  | 'herniated_disc'
  | 'knee_injury'
  | 'shoulder_injury'
  | 'neck_injury'
  | 'osteoporosis'
  | 'eating_disorder_history'
  | 'anxiety'
  | 'depression';

export interface UserHealthProfile {
  conditions: MedicalCondition[];
  allergies: string[];
  medications: string[];
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  isPregnant?: boolean;
  isBreastfeeding?: boolean;
  trimester?: 1 | 2 | 3;
}

export interface SafetyCheck {
  isSafe: boolean;
  warnings: string[];
  blockers: string[];
  recommendations: string[];
}

// Check if exercise is safe for user's conditions
export function checkExerciseSafety(
  exerciseName: string,
  exerciseType: string,
  userProfile: UserHealthProfile
): SafetyCheck {
  const warnings: string[] = [];
  const blockers: string[] = [];
  const recommendations: string[] = [];
  let isSafe = true;

  // HYPERTENSION checks
  if (userProfile.conditions.includes('hypertension')) {
    const dangerousExercises = [
      'heavy squat',
      'heavy deadlift',
      'heavy bench press',
      'overhead press',
      'max effort',
      'powerlifting',
      'olympic lifting'
    ];
    
    if (dangerousExercises.some(ex => exerciseName.toLowerCase().includes(ex))) {
      blockers.push('⛔ BLOCKED: Heavy weightlifting can spike blood pressure to 300+ mmHg');
      blockers.push('Risk of stroke, heart attack, or aneurysm');
      isSafe = false;
    }
    
    if (exerciseType === 'high_intensity' || exerciseType === 'hiit') {
      blockers.push('⛔ BLOCKED: High-intensity exercise not recommended with hypertension');
      isSafe = false;
    }
    
    warnings.push('⚠️ NEVER hold your breath during exercise (Valsalva maneuver)');
    warnings.push('⚠️ Keep intensity low to moderate');
    recommendations.push('✅ Recommended: Walking, swimming, cycling, light resistance training');
  }

  // DIABETES checks
  if (userProfile.conditions.includes('diabetes_type1') || userProfile.conditions.includes('diabetes_type2')) {
    blockers.push('🩸 CRITICAL: Check blood glucose before exercise');
    blockers.push('DO NOT exercise if blood glucose < 100 or > 250 mg/dL');
    warnings.push('⚠️ Carry 15g fast-acting carbs during exercise');
    warnings.push('⚠️ Risk of hypoglycemia up to 24 hours after exercise');
    recommendations.push('✅ Check blood glucose every 30 min during long workouts');
  }

  // PREGNANCY checks
  if (userProfile.isPregnant) {
    const unsafeExercises = [
      'supine', 'lying', 'bench press', 'crunch', 'sit-up',
      'contact sport', 'boxing', 'martial arts',
      'jumping', 'plyometric', 'burpee',
      'hot yoga', 'bikram'
    ];
    
    if (unsafeExercises.some(ex => exerciseName.toLowerCase().includes(ex))) {
      if (userProfile.trimester && userProfile.trimester >= 2) {
        blockers.push('⛔ BLOCKED: Supine exercises (lying on back) dangerous after 16 weeks');
        blockers.push('Can cause Supine Hypotensive Syndrome - reduces fetal oxygen');
        isSafe = false;
      }
    }
    
    warnings.push('⚠️ STOP IMMEDIATELY if: vaginal bleeding, dizziness, chest pain, contractions');
    warnings.push('⚠️ Avoid contact sports, fall-risk activities, hot environments');
    recommendations.push('✅ Recommended: Walking, swimming, prenatal yoga, light resistance');
    recommendations.push('✅ Modify to incline position instead of flat');
  }

  // HERNIATED DISC / BACK INJURY checks
  if (userProfile.conditions.includes('herniated_disc')) {
    const dangerousExercises = [
      'sit-up', 'crunch', 'toe touch', 'forward bend',
      'russian twist', 'bicycle crunch', 'deadlift',
      'good morning', 'bent-over row'
    ];
    
    if (dangerousExercises.some(ex => exerciseName.toLowerCase().includes(ex))) {
      blockers.push('⛔ BLOCKED: Spinal flexion (forward bending) can cause disc rupture');
      blockers.push('Risk of nerve impingement, sciatica, paralysis');
      isSafe = false;
    }
    
    recommendations.push('✅ Recommended: Extension exercises (cobra, superman), neutral spine exercises');
  }

  // KNEE INJURY checks
  if (userProfile.conditions.includes('knee_injury')) {
    const dangerousExercises = [
      'deep squat', 'pistol squat', 'deep lunge',
      'jumping', 'box jump', 'jump rope', 'running'
    ];
    
    if (dangerousExercises.some(ex => exerciseName.toLowerCase().includes(ex))) {
      blockers.push('⛔ BLOCKED: Deep knee flexion or high-impact can worsen meniscus/ACL tears');
      isSafe = false;
    }
    
    recommendations.push('✅ Recommended: Partial squats (0-45°), swimming, cycling');
  }

  // SHOULDER INJURY checks
  if (userProfile.conditions.includes('shoulder_injury')) {
    const dangerousExercises = [
      'overhead press', 'military press', 'shoulder press',
      'upright row', 'behind-the-neck', 'deep dip'
    ];
    
    if (dangerousExercises.some(ex => exerciseName.toLowerCase().includes(ex))) {
      blockers.push('⛔ BLOCKED: Overhead pressing causes rotator cuff impingement');
      isSafe = false;
    }
    
    recommendations.push('✅ Recommended: Landmine press, rotator cuff exercises, face pulls');
  }

  // OSTEOPOROSIS checks
  if (userProfile.conditions.includes('osteoporosis')) {
    const dangerousExercises = [
      'sit-up', 'crunch', 'toe touch', 'forward bend',
      'twist', 'russian twist', 'jumping', 'running'
    ];
    
    if (dangerousExercises.some(ex => exerciseName.toLowerCase().includes(ex))) {
      blockers.push('⛔ BLOCKED: Spinal flexion can cause vertebral fractures');
      blockers.push('⚠️ CRITICAL: Most fractures happen during simple daily movements');
      isSafe = false;
    }
    
    recommendations.push('✅ Recommended: Extension exercises, walking, weight-bearing, balance training');
  }

  // HEART DISEASE checks
  if (userProfile.conditions.includes('heart_disease')) {
    blockers.push('🫀 CRITICAL: Requires medical clearance before starting exercise');
    warnings.push('⚠️ STOP if: chest pain, shortness of breath, dizziness, irregular heartbeat');
    recommendations.push('✅ Recommended: Cardiac rehabilitation, supervised exercise');
    recommendations.push('✅ Low-moderate intensity only: walking, cycling, swimming');
  }

  // ASTHMA checks
  if (userProfile.conditions.includes('asthma')) {
    warnings.push('⚠️ Use rescue inhaler 10-15 minutes before exercise');
    warnings.push('⚠️ Warm up for 10+ minutes');
    warnings.push('⚠️ STOP if: wheezing, chest tightness, severe shortness of breath');
    recommendations.push('✅ Avoid cold, dry air exercise');
  }

  return {
    isSafe,
    warnings,
    blockers,
    recommendations
  };
}

// Check if food is safe for user's allergies
export function checkFoodSafety(
  foodName: string,
  ingredients: string[],
  allergens: string[],
  userProfile: UserHealthProfile
): SafetyCheck {
  const warnings: string[] = [];
  const blockers: string[] = [];
  const recommendations: string[] = [];
  let isSafe = true;

  // Check for user's allergies
  for (const allergy of userProfile.allergies) {
    const allergyLower = allergy.toLowerCase();
    
    // Check food name
    if (foodName.toLowerCase().includes(allergyLower)) {
      blockers.push(`🚨 CRITICAL ALLERGEN DETECTED: ${allergy}`);
      blockers.push('This food contains your allergen - DO NOT CONSUME');
      isSafe = false;
    }
    
    // Check ingredients
    for (const ingredient of ingredients) {
      if (ingredient.toLowerCase().includes(allergyLower)) {
        blockers.push(`🚨 CRITICAL ALLERGEN DETECTED: ${allergy} in ingredients`);
        blockers.push(`Found in: ${ingredient}`);
        isSafe = false;
      }
    }
    
    // Check allergen list
    for (const allergen of allergens) {
      if (allergen.toLowerCase().includes(allergyLower)) {
        blockers.push(`🚨 CRITICAL ALLERGEN DETECTED: ${allergy}`);
        blockers.push('Manufacturer lists this allergen');
        isSafe = false;
      }
    }
  }

  if (!isSafe) {
    warnings.push('⚠️ SEVERE ALLERGIC REACTION RISK');
    warnings.push('⚠️ Can cause anaphylaxis - life-threatening');
    warnings.push('⚠️ Ensure you have EpiPen available');
    warnings.push('⚠️ Call 911 if: difficulty breathing, throat swelling, rapid pulse');
  }

  // Check for "may contain" warnings
  const mayContainWarnings = allergens.filter(a => 
    a.toLowerCase().includes('may contain') || 
    a.toLowerCase().includes('processed in facility')
  );
  
  if (mayContainWarnings.length > 0) {
    warnings.push('⚠️ CROSS-CONTAMINATION WARNING:');
    mayContainWarnings.forEach(w => warnings.push(`  - ${w}`));
  }

  recommendations.push('✅ Always verify ingredients with manufacturer');
  recommendations.push('✅ Read labels carefully every time');
  recommendations.push('✅ Inform restaurants of your allergies');

  return {
    isSafe,
    warnings,
    blockers,
    recommendations
  };
}

// Emergency stop conditions
export function checkEmergencyStopConditions(symptoms: string[]): {
  isEmergency: boolean;
  message: string;
  action: string;
} {
  const emergencySymptoms = [
    'chest pain',
    'difficulty breathing',
    'severe shortness of breath',
    'irregular heartbeat',
    'fainting',
    'loss of consciousness',
    'severe dizziness',
    'throat swelling',
    'severe allergic reaction',
    'seizure',
    'vaginal bleeding',
    'severe headache',
    'confusion'
  ];

  const hasEmergency = symptoms.some(symptom => 
    emergencySymptoms.some(emergency => 
      symptom.toLowerCase().includes(emergency)
    )
  );

  if (hasEmergency) {
    return {
      isEmergency: true,
      message: '🚨 MEDICAL EMERGENCY DETECTED',
      action: 'CALL 911 IMMEDIATELY - Do not wait'
    };
  }

  return {
    isEmergency: false,
    message: '',
    action: ''
  };
}
