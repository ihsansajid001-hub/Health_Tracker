# COMPLETE ONBOARDING FLOW - ALL 6 APPS COMBINED

## Overview
This onboarding collects ALL necessary data to run 6 wellness apps combined into one platform. We use **progressive onboarding** to avoid overwhelming users.

---

## ONBOARDING STRATEGY

### Phase 1: CORE ONBOARDING (Required - First Login)
Collect essential data needed for basic functionality across all features.

### Phase 2: FEATURE-SPECIFIC ONBOARDING (Progressive)
When user first accesses a specific feature (Sleep, Fitness, Nutrition, etc.), collect additional data specific to that feature.

---

## PHASE 1: CORE ONBOARDING (13 Screens)

### Screen 1: Welcome
- App logo and tagline
- "Your Complete Wellness Journey Starts Here"
- Brief value proposition
- **Action**: Continue button

---

### Screen 2: Account Creation
- Email & Password OR Social Login (Google, Apple)
- Terms & Privacy acceptance checkbox
- **Action**: Create Account

---

### Screen 3: Username
- Choose unique username
- Real-time availability check
- **Action**: Continue

---

### Screen 4: Basic Profile
**Title**: "Tell us about yourself"

**Fields**:
- Full Name (optional)
- Date of Birth OR Age (required)
- Gender (Male, Female, Other) (required)

**Why we need this**: "We use this to calculate accurate health metrics"

---

### Screen 5: Physical Stats
**Title**: "Your body metrics"

**Fields**:
- Height (cm or ft/in based on preference)
- Current Weight (kg or lbs)
- Target Weight (optional - only if goal is weight-related)

**Visual**: Show BMI calculation in real-time

---

### Screen 6: Activity Level
**Title**: "How active are you?"

**Options** (with icons):
- 🛋️ Sedentary - Little or no exercise
- 🚶 Lightly Active - Exercise 1-3 days/week
- 🏃 Moderately Active - Exercise 3-5 days/week
- 💪 Very Active - Exercise 6-7 days/week
- 🔥 Extremely Active - Intense exercise daily + physical job

**Why we need this**: "Helps calculate your daily calorie needs"

---

### Screen 7: Primary Goal
**Title**: "What's your main goal?"

**Options** (with icons):
- 🔥 Weight Loss
- 💪 Muscle Gain
- 😴 Better Sleep
- 🧘 Reduce Stress
- 🥗 Better Nutrition
- 💧 Stay Hydrated
- ✨ General Wellness

**Note**: "You can work on multiple goals, but pick your top priority"

---

### Screen 8: Sleep Basics
**Title**: "Your sleep routine"

**Fields**:
- Typical Bedtime (time picker)
- Typical Wake Time (time picker)
- Average Sleep Hours (slider 4-12 hours)
- Sleep Quality (1-10 scale)

**Auto-calculate**: Sleep consistency score

---

### Screen 9: Fitness Basics
**Title**: "Your fitness level"

**Fields**:
- Current Fitness Level (Beginner, Intermediate, Advanced)
- Any injuries or limitations? (text field, optional)
- Preferred workout days per week (1-7)
- Preferred workout time (Morning, Afternoon, Evening, Flexible)

---

### Screen 10: Nutrition Basics
**Title**: "Your eating habits"

**Fields**:
- Dietary Preference (None, Vegetarian, Vegan, Keto, Paleo, Mediterranean, Other)
- Food Allergies (multi-select: Dairy, Eggs, Nuts, Shellfish, Gluten, Soy, None)
- Meals per day (3, 4, 5, 6)
- Do you practice intermittent fasting? (Yes/No)
  - If Yes: Which schedule? (16:8, 18:6, 20:4, 5:2, Other)

---

### Screen 11: Hydration Basics
**Title**: "Stay hydrated"

**Fields**:
- When do you wake up? (time picker)
- When do you go to bed? (time picker)
- Reminder frequency (Every 1hr, 2hr, 3hr, Custom)
- Preferred container (Glass 250ml, Bottle 500ml, Large Bottle 750ml, Custom)

**Auto-calculate**: Daily water goal based on weight

---

### Screen 12: Mental Wellness Basics
**Title**: "Your mental health"

**Fields**:
- Mental health goals (multi-select):
  - Reduce anxiety
  - Better sleep
  - Manage stress
  - Increase self-love
  - Improve focus
  - Build confidence
- How often do you feel stressed? (Daily, Few times/week, Weekly, Rarely)
- Meditation experience (Never tried, Beginner, Intermediate, Experienced)
- Preferred session length (3min, 5min, 10min, 15min, 20min+)

---

### Screen 13: Health Conditions (Optional but Important)
**Title**: "Health information" (Optional - Can Skip)

**Fields**:
- Any chronic conditions? (Diabetes, Hypertension, Heart Disease, Asthma, None, Other)
- Current medications? (text field)
- For women: Are you pregnant or breastfeeding? (Yes/No/Prefer not to say)

**Privacy note**: "This information is encrypted and never shared. It helps us provide safer recommendations."

---

### Screen 14: Preferences
**Title**: "Customize your experience"

**Fields**:
- Units (Metric, Imperial)
- Theme (Light, Dark, Auto)
- Language (English, Spanish, French, etc.)
- Notifications (Enable/Disable)

---

### Screen 15: Setup Complete! 🎉
**Title**: "You're all set!"

**Show calculated metrics**:
- ✅ BMI: [calculated]
- ✅ Daily Calorie Goal: [calculated] kcal
- ✅ Daily Water Goal: [calculated] ml
- ✅ Daily Step Goal: 10,000 steps
- ✅ Sleep Goal: [calculated] hours

**Show personalized schedule**:
- 🌅 Wake up: [time]
- 💧 First water reminder: [time]
- 🏋️ Workout time: [time]
- 🥗 Meal times: [times]
- 🧘 Meditation reminder: [time]
- 😴 Bedtime reminder: [time]

**Action**: "Go to Dashboard"

---

## PHASE 2: PROGRESSIVE ONBOARDING

### When user first opens SLEEP feature:
**Additional questions**:
- Do you have trouble falling asleep? (Yes/No)
- Do you snore regularly? (Yes/No/Don't know)
- Do you have sleep apnea? (Yes/No/Don't know)
- Would you like sleep sounds? (Yes/No)
- Smart alarm preference? (Yes - wake in light sleep, No - exact time)

### When user first opens FITNESS feature:
**Additional questions**:
- Target muscle groups (multi-select: Abs, Chest, Arms, Legs, Back, Shoulders, Full Body)
- Workout environment (Home, Gym, Outdoor, Mixed)
- Equipment available (None, Dumbbells, Resistance Bands, Pull-up Bar, Full Gym)
- Workout duration preference (15min, 30min, 45min, 60min+)

### When user first opens NUTRITION feature:
**Additional questions**:
- Typical breakfast time
- Typical lunch time
- Typical dinner time
- Snack preferences (Morning, Afternoon, Evening, None)
- Cooking frequency (Daily, Few times/week, Rarely, Never)
- Macro split preference (Balanced 30/40/30, High Protein 40/30/30, Low Carb 40/20/40, Custom)

### When user first opens MENTAL HEALTH feature:
**Additional questions**:
- Preferred meditation time (Morning, Afternoon, Evening, Before bed, Flexible)
- Meditation goals (Stress relief, Better sleep, Focus, Anxiety, Self-love, Gratitude)
- Breathing exercise interest (Yes/No)
- Sleep stories interest (Yes/No)

---

## DATA VALIDATION RULES

### Required Fields (Cannot proceed without):
- Age (13-120)
- Gender
- Height (100-250 cm or 3-8 ft)
- Weight (30-300 kg or 66-660 lbs)
- Activity Level
- Primary Goal

### Optional but Recommended:
- Target Weight
- Health Conditions
- Medications
- Dietary Restrictions
- Allergies

### Auto-Calculated Fields:
- BMI = weight(kg) / (height(m))²
- BMR (Mifflin-St Jeor):
  - Men: (10 × weight) + (6.25 × height) - (5 × age) + 5
  - Women: (10 × weight) + (6.25 × height) - (5 × age) - 161
- TDEE = BMR × Activity Multiplier
  - Sedentary: 1.2
  - Light: 1.375
  - Moderate: 1.55
  - Active: 1.725
  - Very Active: 1.9
- Daily Calorie Goal:
  - Weight Loss: TDEE - 500
  - Muscle Gain: TDEE + 300
  - Maintenance: TDEE
- Daily Water Goal = weight(kg) × 35ml
  - Add 500ml if very active
  - Add 250ml if hot weather
- Macro Goals (based on calorie goal):
  - Balanced: Protein 30%, Carbs 40%, Fats 30%
  - High Protein: Protein 40%, Carbs 30%, Fats 30%
  - Low Carb: Protein 40%, Carbs 20%, Fats 40%

---

## ONBOARDING COMPLETION TRACKING

Store in `user_profiles` table:
```sql
onboarding_completed: true/false
sleep_setup_completed: true/false
fitness_setup_completed: true/false
nutrition_setup_completed: true/false
mental_health_setup_completed: true/false
hydration_setup_completed: true/false
```

---

## USER EXPERIENCE NOTES

1. **Progress Indicator**: Show "Step X of 15" at top
2. **Back Button**: Allow going back to edit previous answers
3. **Skip Option**: Allow skipping optional screens (but encourage completion)
4. **Save Progress**: Auto-save after each screen
5. **Time Estimate**: "Takes about 5 minutes"
6. **Visual Feedback**: Show real-time calculations (BMI, calories, etc.)
7. **Encouragement**: Positive messages throughout
8. **Privacy Assurance**: Remind users data is secure and private

---

## TECHNICAL IMPLEMENTATION

### Database Tables Needed:
- `user_profiles` - Core profile data
- `sleep_settings` - Sleep preferences
- `fitness_settings` - Workout preferences
- `nutrition_settings` - Diet preferences
- `hydration_settings` - Water tracking preferences
- `mental_health_settings` - Mindfulness preferences
- `user_reminders` - All notification preferences

### API Endpoints Needed:
- `POST /api/onboarding/profile` - Save core profile
- `POST /api/onboarding/sleep` - Save sleep settings
- `POST /api/onboarding/fitness` - Save fitness settings
- `POST /api/onboarding/nutrition` - Save nutrition settings
- `POST /api/onboarding/hydration` - Save hydration settings
- `POST /api/onboarding/mental-health` - Save mental health settings
- `GET /api/onboarding/status` - Check completion status

---

## NEXT STEPS AFTER ONBOARDING

1. Show dashboard with personalized widgets
2. Prompt first action: "Log your first meal" or "Start a workout"
3. Show tutorial tooltips for key features
4. Send welcome email with tips
5. Schedule first reminder notifications

---

**This is the COMPLETE onboarding flow that properly collects all data needed to run 6 wellness apps combined!**
