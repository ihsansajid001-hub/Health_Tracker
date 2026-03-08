# MEDICAL GUIDELINES & SAFETY PROTOCOLS
## Evidence-Based Health & Wellness Recommendations

**CRITICAL**: This document contains medically-validated guidelines for how to USE the data we collect. Every recommendation must be backed by medical research and professional guidelines.

---

## TABLE OF CONTENTS
1. [BMR & TDEE Calculations](#bmr-tdee-calculations)
2. [Calorie Goals & Weight Management](#calorie-goals)
3. [Hydration Requirements](#hydration)
4. [Sleep Quality Assessment](#sleep-quality)
5. [Macro Nutrient Distribution](#macros)
6. [Medical Conditions & Exercise Safety](#medical-conditions)
7. [Pregnancy & Breastfeeding](#pregnancy-breastfeeding)
8. [Food Allergies & Safety](#food-allergies)
9. [Intermittent Fasting](#intermittent-fasting)
10. [BMI Limitations](#bmi-limitations)

---

## 1. BMR & TDEE CALCULATIONS {#bmr-tdee-calculations}

### Mifflin-St Jeor Equation (MOST ACCURATE)
**Source**: Academy of Nutrition and Dietetics, validated by NIH research

**Formula**:
- **Men**: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
- **Women**: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161

**Accuracy**: ±10% compared to indirect calorimetry (gold standard)
- Works best for 70-80% of population
- More accurate than Harris-Benedict equation (±15%)
- Developed with contemporary, diverse population data

**Limitations**:
- Less accurate for obese individuals (BMI > 30)
- Less accurate for very muscular individuals
- Does not account for body composition

### TDEE Activity Multipliers
**Source**: Multiple validated studies, standard in nutrition science

| Activity Level | Multiplier | Description |
|---|---|---|
| Sedentary | 1.2 | Little or no exercise, desk job |
| Lightly Active | 1.375 | Light exercise 1-3 days/week (~4km walking) |
| Moderately Active | 1.55 | Moderate exercise 3-5 days/week (~6km walking) |
| Very Active | 1.725 | Hard exercise 6-7 days/week (~10km walking) |
| Extremely Active | 1.9 | Very hard exercise daily + physical job |

**Implementation**:
```
TDEE = BMR × Activity Multiplier
```

**Important Note**: Moving from sedentary to moderately active can increase TDEE by 400-800 calories daily. Users must adjust nutrition accordingly.

---

## 2. CALORIE GOALS & WEIGHT MANAGEMENT {#calorie-goals}

### Safe Weight Loss Guidelines
**Sources**: CDC, NHS, NICE (National Institute for Health and Care Excellence)

**Recommended Rate**: 0.5-1 kg (1-2 lbs) per week
- This is the ONLY safe and sustainable rate
- Faster weight loss leads to muscle loss and metabolic adaptation
- 73% better long-term success rate than rapid weight loss

### Calorie Deficit Recommendations

**For Weight Loss**:
- **Recommended Deficit**: 500-600 kcal/day below TDEE
- **Result**: ~0.5-1 kg per week loss
- **Minimum Intake**: NEVER go below 1,200 kcal/day (women) or 1,500 kcal/day (men)

**For Muscle Gain**:
- **Recommended Surplus**: 300-500 kcal/day above TDEE
- **Result**: ~0.25-0.5 kg per week gain (mostly muscle if training properly)

**For Maintenance**:
- **Target**: TDEE ± 100 kcal

### Critical Safety Rules

1. **Never recommend deficits > 1000 kcal/day** - Dangerous and unsustainable
2. **Protein must increase during deficit** - 1.6-2.4 g/kg body weight to preserve muscle
3. **Monitor for metabolic adaptation** - Weight loss slows over time even with consistent deficit
4. **Adjust every 2-4 weeks** - Recalculate TDEE as weight changes

---

## 3. HYDRATION REQUIREMENTS {#hydration}

### Water Intake Calculation
**Sources**: European Food Safety Authority (EFSA), National Academies of Sciences

**Base Formula**:
```
Daily Water Goal (ml) = Body Weight (kg) × 35ml
```

**General Guidelines**:
- Men: ~3,700 ml/day (3.7 L)
- Women: ~2,700 ml/day (2.7 L)

### Adjustments Required

**Add 500-700ml for**:
- Very active lifestyle (1.725-1.9 multiplier)
- Hot/humid climate
- High altitude

**Add 12ml per minute of exercise**:
- 30 min workout = +360ml
- 60 min workout = +720ml

**Alternative Formula** (US-based):
```
Daily Water (oz) = Body Weight (lbs) × 0.5 to 0.67
```
- Under 130 lbs: use 0.5
- 130-200 lbs: use 0.6
- Over 200 lbs: use 0.67

### Implementation Notes
- Pale yellow urine = adequate hydration
- Sip steadily throughout day (not chugging)
- 60% of body weight is water
- Involved in nearly every bodily process

---

## 4. SLEEP QUALITY ASSESSMENT {#sleep-quality}

### Sleep Score Calculation
**Sources**: Sleep medicine research, Oura Ring methodology, sleep science

**Formula**:
```
Sleep Score = (Duration × 0.30) + (Quality × 0.40) + (Efficiency × 0.10) + (Stress × 0.20)
```

**Components**:

1. **Duration (30% weight)**:
   - 7-9 hours = 100 points
   - 6-7 hours = 70-90 points
   - < 6 hours = 0-60 points

2. **Quality (40% weight)** - Based on sleep stages:
   - Light Sleep: 50% of total (normal)
   - Deep Sleep: 13-23% of total (adults typically 20%)
   - REM Sleep: 20-25% of total
   - Awake: < 5% of total

3. **Efficiency (10% weight)**:
   - Time asleep / Time in bed
   - > 85% = Excellent
   - 75-85% = Good
   - < 75% = Poor

4. **Stress During Sleep (20% weight)**:
   - Based on heart rate variability (if available)
   - Or user-reported sleep quality rating

### Sleep Stage Percentages (Normal Adults)
- **Light Sleep**: 50% (helps with memory, learning)
- **Deep Sleep**: 20% (physical recovery, immune function, muscle/bone strengthening)
- **REM Sleep**: 25% (brain development, memory processing, emotional regulation)
- **Awake**: 5% (brief awakenings are normal)

### Sleep Onset Latency
- **Normal**: 10-20 minutes to fall asleep
- **Concerning**: > 30 minutes regularly (possible insomnia)

### Score Interpretation
- **90-100**: Excellent sleep - well-rested and recharged
- **70-89**: Good sleep - decent rest with room for improvement
- **50-69**: Fair sleep - somewhat rested but could do better
- **0-49**: Poor sleep - likely feeling tired and unrested

---

## 5. MACRO NUTRIENT DISTRIBUTION {#macros}

### Acceptable Macronutrient Distribution Ranges (AMDR)
**Source**: Institute of Medicine, Dietary Guidelines for Americans

**General Population**:
- Protein: 10-35% of calories
- Carbohydrates: 45-65% of calories
- Fats: 20-35% of calories

### Goal-Specific Macro Splits

**For Fat Loss** (Calorie Deficit):
- **Recommended**: 40% Protein, 30% Carbs, 30% Fat
- **Alternative**: 35% Protein, 40% Carbs, 25% Fat
- **Protein**: 1.6-2.4 g/kg body weight (preserve muscle)
- **Why high protein**: Increases satiety, preserves lean mass, higher thermic effect

**For Muscle Gain** (Calorie Surplus):
- **Recommended**: 30% Protein, 50% Carbs, 20% Fat
- **Alternative**: 30% Protein, 40% Carbs, 30% Fat
- **Protein**: 1.6-2.2 g/kg body weight
- **Why high carbs**: Fuel for training, muscle glycogen, insulin response

**For Maintenance** (Balanced):
- **Recommended**: 30% Protein, 40% Carbs, 30% Fat
- **Alternative**: 25% Protein, 45% Carbs, 30% Fat

### Minimum Requirements
- **Protein**: Never below 0.8 g/kg body weight (RDA minimum)
- **Fats**: Never below 20% of calories (hormone production, vitamin absorption)
- **Carbs**: Can be lower for keto (5-10%), but not recommended for most

---

## 6. MEDICAL CONDITIONS & EXERCISE SAFETY {#medical-conditions}

### HYPERTENSION (High Blood Pressure)

**Exercise Guidelines**:
- **Safe**: Low to moderate intensity aerobic (walking, cycling, swimming)
- **Recommended**: 150 minutes moderate-intensity per week
- **Target BP**: < 130/80 mmHg (most adults)
- **Avoid**: Heavy weightlifting, holding breath during exercise

**Nutrition Modifications**:
- **Sodium Limit**: < 1,500 mg/day (strict)
- **General Population**: < 2,300 mg/day
- **Track sodium in all logged foods**
- **Increase potassium intake**

**App Behavior**:
- ⚠️ **WARNING** if user logs > 1,500mg sodium/day
- Suggest low-sodium alternatives
- Filter workout recommendations (no high-intensity)

---

### DIABETES (Type 1 & Type 2)

**Exercise Guidelines**:
- **Recommended**: 150 minutes moderate aerobic + 2 days resistance training
- **Blood Glucose Monitoring**: Check before, during (if > 30 min), and after exercise
- **Safe Range to Start**: > 110 mg/dL (6.1 mmol/L)
- **Hypoglycemia Risk**: Exercise can lower blood sugar for up to 24 hours

**Safety Protocols**:
- **Always carry 15g fast-acting carbs** during exercise
- **Reduce rapid-acting insulin by 20-50%** before exercise
- **Eat slow-digesting snack** if workout > 30 minutes
- **Stop exercise if** blood glucose < 70 mg/dL or > 250 mg/dL with ketones

**Nutrition Modifications**:
- **Carb counting is CRITICAL**
- **Track all carbs, fiber, sugar**
- **Meal timing matters** - coordinate with insulin/medication
- **A1C goal**: < 7% for most adults

**App Behavior**:
- ⚠️ **CRITICAL WARNING**: "Check blood glucose before exercise"
- Suggest carrying glucose tablets
- Recommend medical supervision for new exercise programs
- Track carbs prominently

---

### HEART DISEASE (Coronary Artery Disease, Heart Failure, Arrhythmias)

**Exercise Guidelines**:
- **Requires medical clearance** before starting program
- **Cardiac Rehabilitation**: Supervised exercise recommended
- **Safe Activities**: Walking, cycling, swimming (low-moderate intensity)
- **Target Heart Rate**: 60-85% of max (under supervision)
- **Duration**: 20-30 minutes, 3-4x/week on non-consecutive days
- **Always include**: 5-min warm-up and 5-min cool-down

**Warning Signs to STOP Exercise**:
- Chest pain or pressure
- Shortness of breath
- Dizziness or lightheadedness
- Irregular heartbeat
- Excessive fatigue

**App Behavior**:
- ⚠️ **CRITICAL**: "Consult cardiologist before starting exercise"
- Filter out high-intensity workouts
- Show only low-moderate intensity options
- Display warning signs prominently
- Recommend heart rate monitoring

---

### ASTHMA (Exercise-Induced Bronchospasm)

**Exercise Guidelines**:
- **Pre-medication**: Use rescue inhaler 10-15 minutes before exercise
- **Warm-up**: 10 minutes minimum (prevents most episodes)
- **Protection Duration**: Quick-relief inhalers work 2-4 hours
- **Safe Activities**: Swimming (warm, humid air), walking, yoga
- **Avoid**: Cold, dry air exercise; high pollen days

**Breathing Techniques**:
- Breathe through nose when possible (warms/humidifies air)
- Avoid mouth breathing in cold weather
- Practice diaphragmatic breathing

**Warning Signs to STOP**:
- Wheezing
- Chest tightness
- Shortness of breath beyond normal exertion
- Coughing

**App Behavior**:
- ⚠️ **REMINDER**: "Use rescue inhaler 10-15 min before workout"
- Suggest indoor workouts on cold days
- Recommend longer warm-ups (10+ min)
- Show breathing technique videos

---

## 7. PREGNANCY & BREASTFEEDING {#pregnancy-breastfeeding}

### PREGNANCY

**Exercise Guidelines** (ACOG - American College of Obstetricians and Gynecologists):
- **Recommended**: 150 minutes moderate-intensity aerobic activity per week
- **Frequency**: 20-30 minutes most days of the week
- **Safe Activities**: Walking, swimming, stationary cycling, prenatal yoga
- **Can Continue**: Vigorous exercise if habitually active before pregnancy (with doctor approval)

**Exercises to AVOID**:
- Contact sports (risk of abdominal trauma)
- Activities with fall risk (skiing, horseback riding, gymnastics)
- Scuba diving
- Hot yoga/Pilates (overheating risk)
- Lying flat on back after first trimester (supine position)

**Warning Signs to STOP Exercise**:
- Vaginal bleeding
- Dizziness or faintness
- Shortness of breath before exertion
- Chest pain
- Headache
- Muscle weakness
- Calf pain or swelling
- Regular painful contractions
- Fluid leaking from vagina

**Nutrition Modifications**:
- **Calorie Increase**: +340 kcal/day (2nd trimester), +450 kcal/day (3rd trimester)
- **Protein**: Increase to 71g/day minimum
- **Folic Acid**: 600 mcg/day
- **Iron**: 27 mg/day
- **Calcium**: 1,000 mg/day
- **Avoid**: Alcohol, high-mercury fish, raw/undercooked foods, unpasteurized dairy

**App Behavior**:
- ⚠️ **MODIFY ALL RECOMMENDATIONS**
- Add +340-450 kcal to TDEE (based on trimester)
- Filter out unsafe exercises (contact sports, supine exercises)
- Show pregnancy-safe workout modifications
- Display warning signs prominently
- **NEVER recommend weight loss**
- Track prenatal vitamins

---

### BREASTFEEDING

**Calorie Requirements**:
- **Additional Calories**: +450-500 kcal/day above pre-pregnancy TDEE
- **Total Range**: 2,300-2,500 kcal/day for exclusive breastfeeding (first 6 months)
- **Second 6 Months**: +400 kcal/day (if partially breastfeeding)
- **Minimum**: NEVER below 1,800 kcal/day (protects milk supply)

**Nutrition Requirements**:
- **Protein**: 71g/day minimum
- **Calcium**: 1,000 mg/day
- **Iron**: 9-10 mg/day
- **Vitamin D**: 600 IU/day
- **Hydration**: CRITICAL - Add 700-1,000ml to normal water goal

**Calorie Burn from Breastfeeding**:
- **Milk Production**: Burns 500-700 calories/day naturally
- Equivalent to 45-60 minutes of running

**Exercise Guidelines**:
- Safe to resume exercise postpartum (with doctor clearance)
- Start gradually
- Wear supportive bra
- Nurse or pump before exercise for comfort

**Foods to Limit/Avoid**:
- Alcohol (passes to breast milk)
- High-mercury fish (limit to 2 servings/week)
- Excessive caffeine (< 300mg/day)

**App Behavior**:
- ⚠️ **MODIFY CALORIE GOALS**
- Add +450-500 kcal to TDEE
- Increase water goal by 700-1,000ml
- **NEVER recommend aggressive weight loss**
- Safe weight loss: 0.5 kg/week maximum
- Track hydration prominently
- Remind about nutrient-dense foods

---

## 8. FOOD ALLERGIES & SAFETY {#food-allergies}

### The Big 9 Allergens (90% of reactions)
1. Milk
2. Eggs
3. Wheat (Gluten)
4. Soy
5. Tree Nuts
6. Peanuts
7. Sesame
8. Shellfish
9. Fish

### Severity Levels

**Mild Reactions**:
- Itchiness
- Hives
- Stomach upset
- Mild swelling

**Severe Reactions (Anaphylaxis)**:
- Difficulty breathing
- Throat swelling
- Rapid pulse
- Dizziness/loss of consciousness
- **LIFE-THREATENING** - requires immediate epinephrine

### Cross-Contamination Risks

**Critical Facts**:
- **Microscopic amounts** can trigger severe reactions
- **Trace amounts** in food processing equipment
- **Shared facilities** warnings: "May contain...", "Processed in facility that also processes..."
- **Cross-contact** during food preparation

### App Safety Protocols

**When User Has Food Allergies**:

1. **Food Logging**:
   - ⚠️ **CRITICAL WARNING** if logged food contains allergen
   - Check ingredients list for hidden allergens
   - Flag "may contain" warnings
   - Suggest safe alternatives

2. **Barcode Scanning**:
   - **Auto-check** all ingredients against user's allergy list
   - **RED ALERT** if allergen detected
   - Show cross-contamination warnings

3. **Recipe Suggestions**:
   - **NEVER suggest** recipes with user's allergens
   - Filter all meal plans
   - Provide allergen-free alternatives

4. **Restaurant Foods**:
   - **WARNING**: "Restaurant foods may have cross-contamination"
   - Suggest asking about preparation methods
   - Recommend allergen-free restaurants

**UI/UX Requirements**:
- 🚨 **RED BANNER** for allergen warnings
- **Cannot dismiss** without confirmation
- **Require double-check** before logging allergenic foods
- **Emergency contact** reminder (EpiPen, 911)

---

## 9. INTERMITTENT FASTING {#intermittent-fasting}

### Common Schedules
- **16:8**: Fast 16 hours, eat within 8-hour window (most popular)
- **18:6**: Fast 18 hours, eat within 6-hour window
- **20:4**: Fast 20 hours, eat within 4-hour window
- **5:2**: Eat normally 5 days, restrict to 500-600 kcal 2 days

### Current Research (2025 Update)

**Effectiveness**:
- **Cochrane Review (2025)**: "Little to no clinically meaningful difference" vs. standard calorie restriction
- **Weight Loss**: 2-5% reduction over 6-12 months (modest)
- **NOT superior** to traditional calorie counting
- **May help** with insulin sensitivity and blood sugar

**Who Should NOT Do IF**:
- ❌ Pregnant or breastfeeding women
- ❌ People with diabetes (without medical supervision)
- ❌ History of eating disorders
- ❌ Low blood pressure
- ❌ Children and teenagers
- ❌ People taking medications that require food

### App Implementation

**If User Selects IF**:
- ⚠️ **DISCLAIMER**: "IF is not superior to regular calorie restriction. Consult doctor if you have medical conditions."
- **Track fasting windows** accurately
- **Ensure adequate nutrition** during eating windows
- **Monitor for side effects**: dizziness, fatigue, irritability
- **Suggest stopping if**: negative symptoms persist

**Safety Checks**:
- If user has diabetes: ⚠️ "Consult doctor before IF"
- If user is pregnant/breastfeeding: ❌ "IF not recommended"
- If user has eating disorder history: ❌ "IF may not be safe for you"

---

## 10. BMI LIMITATIONS {#bmi-limitations}

### What BMI Is
```
BMI = weight (kg) / height (m)²
```

### Accuracy & Limitations

**Works Reasonably Well For**:
- 70-80% of general population
- Sedentary to moderately active adults
- Average body composition

**INACCURATE For**:
- **Athletes & Muscular Individuals**: May show "overweight" despite low body fat
- **Elderly**: May show "normal" despite muscle loss
- **Children & Teenagers**: Growth patterns vary
- **Pregnant Women**: Weight gain is healthy and necessary
- **Different Ethnicities**: Different body composition norms

### BMI Specificity vs. Sensitivity
- **Specificity**: 95% (men), 99% (women) - Good at identifying true obesity
- **Sensitivity**: 36% (men), 49% (women) - Poor at catching all cases
- **Result**: Misses many people with excess fat, incorrectly flags muscular people

### App Implementation

**Display BMI BUT**:
- ⚠️ **DISCLAIMER**: "BMI is a screening tool, not a diagnostic measure"
- **Show limitations** based on user profile:
  - If very active: "BMI may not be accurate for athletic individuals"
  - If pregnant: "BMI not applicable during pregnancy"
  - If elderly: "BMI may not reflect muscle loss"

**Better Alternatives to Track**:
- Waist circumference
- Body fat percentage (if available)
- Progress photos
- How clothes fit
- Energy levels
- Fitness improvements

**Never**:
- ❌ Make BMI the primary health metric
- ❌ Shame users based on BMI
- ❌ Use BMI alone to determine health status

---

## IMPLEMENTATION CHECKLIST

### For Every Health Condition User Reports:

- [ ] Modify calorie calculations
- [ ] Filter exercise recommendations
- [ ] Adjust nutrition targets
- [ ] Display relevant warnings
- [ ] Suggest medical consultation when appropriate
- [ ] Track condition-specific metrics
- [ ] Provide educational content

### For Every Food Logged:

- [ ] Check against user allergies
- [ ] Calculate accurate macros
- [ ] Track micronutrients (if condition requires)
- [ ] Warn about sodium (if hypertension)
- [ ] Warn about sugar/carbs (if diabetes)
- [ ] Check for cross-contamination warnings

### For Every Workout Recommended:

- [ ] Check user's medical conditions
- [ ] Filter unsafe exercises
- [ ] Adjust intensity appropriately
- [ ] Include proper warm-up/cool-down
- [ ] Display warning signs to stop
- [ ] Suggest modifications

---

## LEGAL DISCLAIMER (MUST DISPLAY)

**Required Text**:
> "This app provides general health and wellness information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician or qualified healthcare provider before starting any new diet, exercise program, or making changes to existing health routines, especially if you have medical conditions or take medications. If you experience chest pain, difficulty breathing, severe dizziness, or other concerning symptoms, seek immediate medical attention."

---

## SOURCES & REFERENCES

1. **Mifflin-St Jeor**: Academy of Nutrition and Dietetics, NIH validation studies
2. **Weight Loss**: CDC, NHS, NICE Guidelines
3. **Hydration**: European Food Safety Authority (EFSA), National Academies
4. **Sleep**: Sleep medicine research, Oura methodology
5. **Macros**: Institute of Medicine, Dietary Guidelines for Americans
6. **Hypertension**: American Heart Association, ACC/AHA Guidelines
7. **Diabetes**: American Diabetes Association, ACSM Guidelines
8. **Pregnancy**: ACOG (American College of Obstetricians and Gynecologists)
9. **Breastfeeding**: WHO, La Leche League, Academy of Nutrition
10. **Food Allergies**: FDA, FARE (Food Allergy Research & Education)
11. **Intermittent Fasting**: Cochrane Review 2025, NIH
12. **BMI**: WHO, NIH, medical research on limitations

---

**This document must be updated as new medical research emerges. Review annually.**

**Last Updated**: March 2026
