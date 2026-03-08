-- COMPLETE WELLNESS PLATFORM DATABASE SCHEMA
-- Optimized for all 6 app features combined

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USER PROFILES (Core user data)
-- =============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Basic Info
  username VARCHAR(30) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  age INTEGER NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  
  -- Physical Stats
  height DECIMAL(5,2) NOT NULL, -- cm
  weight DECIMAL(5,2) NOT NULL, -- kg
  target_weight DECIMAL(5,2),
  
  -- Activity & Goals
  activity_level VARCHAR(20) NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  primary_goal VARCHAR(30) NOT NULL CHECK (primary_goal IN ('weight_loss', 'muscle_gain', 'better_sleep', 'reduce_stress', 'better_nutrition', 'stay_hydrated', 'general_wellness')),
  
  -- Calculated Values
  bmi DECIMAL(4,1),
  bmr INTEGER, -- Basal Metabolic Rate
  tdee INTEGER, -- Total Daily Energy Expenditure
  daily_calorie_goal INTEGER,
  daily_water_goal INTEGER, -- ml
  daily_step_goal INTEGER DEFAULT 10000,
  
  -- Preferences
  units_system VARCHAR(10) DEFAULT 'metric' CHECK (units_system IN ('metric', 'imperial')),
  theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  language VARCHAR(10) DEFAULT 'en',
  
  -- Onboarding Status
  onboarding_completed BOOLEAN DEFAULT false,
  sleep_setup_completed BOOLEAN DEFAULT false,
  nutrition_setup_completed BOOLEAN DEFAULT false,
  fitness_setup_completed BOOLEAN DEFAULT false,
  mental_health_setup_completed BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. SLEEP TRACKING
-- =============================================
CREATE TABLE sleep_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  date DATE NOT NULL,
  bedtime TIMESTAMP WITH TIME ZONE,
  wake_time TIMESTAMP WITH TIME ZONE,
  
  -- Sleep Metrics
  total_hours DECIMAL(3,1) NOT NULL,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  sleep_score INTEGER CHECK (sleep_score BETWEEN 0 AND 100),
  
  -- Sleep Stages (minutes)
  light_sleep_minutes INTEGER,
  deep_sleep_minutes INTEGER,
  rem_sleep_minutes INTEGER,
  awake_minutes INTEGER,
  
  -- Sleep Issues
  snoring_detected BOOLEAN DEFAULT false,
  snoring_duration INTEGER, -- minutes
  sleep_talking_detected BOOLEAN DEFAULT false,
  
  -- Audio Recording (optional)
  audio_recording_url TEXT,
  
  -- Notes
  notes TEXT,
  mood_on_waking VARCHAR(20),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Sleep Settings
CREATE TABLE sleep_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  target_bedtime TIME,
  target_wake_time TIME,
  target_sleep_hours DECIMAL(3,1) DEFAULT 8.0,
  
  -- Sleep Issues
  has_insomnia BOOLEAN DEFAULT false,
  has_sleep_apnea BOOLEAN DEFAULT false,
  snores_regularly BOOLEAN DEFAULT false,
  
  -- Reminders
  bedtime_reminder_enabled BOOLEAN DEFAULT true,
  bedtime_reminder_time TIME,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. FITNESS & WORKOUTS
-- =============================================
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  date DATE NOT NULL,
  workout_type VARCHAR(30) NOT NULL, -- abs, chest, legs, full_body, etc.
  workout_name VARCHAR(100),
  
  -- Workout Details
  duration_minutes INTEGER NOT NULL,
  calories_burned INTEGER,
  exercises_completed INTEGER,
  total_reps INTEGER,
  
  -- Difficulty
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  intensity VARCHAR(10) CHECK (intensity IN ('low', 'moderate', 'high')),
  
  -- Completion
  completed BOOLEAN DEFAULT true,
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout Settings
CREATE TABLE fitness_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  fitness_level VARCHAR(20) DEFAULT 'beginner' CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  preferred_workout_time VARCHAR(20), -- morning, afternoon, evening
  workout_days_per_week INTEGER DEFAULT 3,
  
  -- Reminders
  workout_reminder_enabled BOOLEAN DEFAULT true,
  workout_reminder_times TIME[],
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. NUTRITION & MEALS
-- =============================================
CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  date DATE NOT NULL,
  meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  meal_time TIMESTAMP WITH TIME ZONE,
  
  -- Food Details
  food_name VARCHAR(200) NOT NULL,
  food_brand VARCHAR(100),
  barcode VARCHAR(50),
  
  -- Nutrition Info
  serving_size VARCHAR(50),
  servings DECIMAL(4,2) DEFAULT 1.0,
  calories INTEGER NOT NULL,
  protein DECIMAL(5,1), -- grams
  carbs DECIMAL(5,1),
  fats DECIMAL(5,1),
  fiber DECIMAL(5,1),
  sugar DECIMAL(5,1),
  sodium INTEGER, -- mg
  
  -- Logging Method
  logged_via VARCHAR(20) CHECK (logged_via IN ('barcode', 'photo', 'search', 'manual')),
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Nutrition Summary
CREATE TABLE daily_nutrition_summary (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  
  total_calories INTEGER DEFAULT 0,
  total_protein DECIMAL(6,1) DEFAULT 0,
  total_carbs DECIMAL(6,1) DEFAULT 0,
  total_fats DECIMAL(6,1) DEFAULT 0,
  total_fiber DECIMAL(6,1) DEFAULT 0,
  
  meals_logged INTEGER DEFAULT 0,
  
  PRIMARY KEY (user_id, date)
);

-- Nutrition Settings
CREATE TABLE nutrition_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dietary Preferences
  dietary_restriction VARCHAR(30), -- vegan, vegetarian, keto, paleo, none
  allergies TEXT[],
  meals_per_day INTEGER DEFAULT 3,
  
  -- Macro Goals (grams)
  protein_goal INTEGER,
  carbs_goal INTEGER,
  fats_goal INTEGER,
  
  -- Reminders
  meal_reminder_enabled BOOLEAN DEFAULT true,
  meal_reminder_times TIME[],
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. HYDRATION TRACKING
-- =============================================
CREATE TABLE hydration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  date DATE NOT NULL,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  amount_ml INTEGER NOT NULL,
  container_type VARCHAR(30), -- glass, bottle, cup
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Hydration Summary
CREATE TABLE daily_hydration_summary (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  
  total_ml INTEGER DEFAULT 0,
  goal_ml INTEGER NOT NULL,
  glasses_count INTEGER DEFAULT 0,
  goal_reached BOOLEAN DEFAULT false,
  
  PRIMARY KEY (user_id, date)
);

-- Hydration Settings
CREATE TABLE hydration_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  daily_goal_ml INTEGER DEFAULT 2500,
  
  -- Reminders
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_interval_minutes INTEGER DEFAULT 120, -- every 2 hours
  reminder_start_time TIME DEFAULT '08:00',
  reminder_end_time TIME DEFAULT '22:00',
  
  -- Custom Containers
  custom_containers JSONB, -- [{name: "My Bottle", ml: 750}]
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. MENTAL HEALTH & MINDFULNESS
-- =============================================
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  date DATE NOT NULL,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Mood Metrics
  mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 10),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  
  -- Context
  mood_tags TEXT[], -- happy, sad, anxious, calm, etc.
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE meditation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  date DATE NOT NULL,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Session Details
  meditation_type VARCHAR(30), -- guided, breathing, sleep, mindfulness
  session_name VARCHAR(100),
  duration_minutes INTEGER NOT NULL,
  
  completed BOOLEAN DEFAULT true,
  
  -- Post-Session
  feeling_after VARCHAR(20), -- calm, relaxed, focused, etc.
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mental Health Settings
CREATE TABLE mental_health_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Goals
  mental_health_goals TEXT[], -- reduce_anxiety, better_sleep, manage_stress, etc.
  
  -- Daily Plan
  morning_task_enabled BOOLEAN DEFAULT true,
  afternoon_task_enabled BOOLEAN DEFAULT true,
  evening_task_enabled BOOLEAN DEFAULT true,
  
  -- Reminders
  reminder_enabled BOOLEAN DEFAULT true,
  morning_reminder_time TIME DEFAULT '08:00',
  afternoon_reminder_time TIME DEFAULT '14:00',
  evening_reminder_time TIME DEFAULT '20:00',
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. HEALTH METRICS
-- =============================================
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  date DATE NOT NULL,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Vitals
  heart_rate INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  blood_oxygen INTEGER, -- SpO2 percentage
  blood_glucose INTEGER, -- mg/dL
  
  -- Body Metrics
  weight DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,1),
  muscle_mass DECIMAL(5,2),
  
  -- Activity
  steps INTEGER,
  active_minutes INTEGER,
  calories_burned INTEGER,
  distance_km DECIMAL(6,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. ACHIEVEMENTS & GAMIFICATION
-- =============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  achievement_type VARCHAR(30) NOT NULL, -- sleep_streak, workout_streak, water_goal, etc.
  achievement_name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE streaks (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  streak_type VARCHAR(30) NOT NULL, -- sleep, workout, water, meditation, nutrition
  
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  
  PRIMARY KEY (user_id, streak_type)
);

-- =============================================
-- 9. REMINDERS & NOTIFICATIONS
-- =============================================
CREATE TABLE user_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  reminder_type VARCHAR(30) NOT NULL, -- water, meal, workout, sleep, meditation
  reminder_time TIME NOT NULL,
  enabled BOOLEAN DEFAULT true,
  
  days_of_week INTEGER[], -- 0=Sunday, 1=Monday, etc.
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_sleep_logs_user_date ON sleep_logs(user_id, date DESC);
CREATE INDEX idx_workout_logs_user_date ON workout_logs(user_id, date DESC);
CREATE INDEX idx_nutrition_logs_user_date ON nutrition_logs(user_id, date DESC, meal_type);
CREATE INDEX idx_hydration_logs_user_date ON hydration_logs(user_id, date DESC);
CREATE INDEX idx_mood_logs_user_date ON mood_logs(user_id, date DESC);
CREATE INDEX idx_meditation_logs_user_date ON meditation_logs(user_id, date DESC);
CREATE INDEX idx_health_metrics_user_date ON health_metrics(user_id, date DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_nutrition_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_hydration_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Users can only access their own data)
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own sleep logs" ON sleep_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sleep settings" ON sleep_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workout logs" ON workout_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own fitness settings" ON fitness_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own nutrition logs" ON nutrition_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own nutrition summary" ON daily_nutrition_summary FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own nutrition settings" ON nutrition_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own hydration logs" ON hydration_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own hydration summary" ON daily_hydration_summary FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own hydration settings" ON hydration_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own mood logs" ON mood_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own meditation logs" ON meditation_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own mental health settings" ON mental_health_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own health metrics" ON health_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own achievements" ON achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own streaks" ON streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own reminders" ON user_reminders FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate BMI, BMR, TDEE automatically
CREATE OR REPLACE FUNCTION calculate_health_metrics()
RETURNS TRIGGER AS $$
DECLARE
  activity_multiplier DECIMAL;
BEGIN
  -- Calculate BMI
  NEW.bmi = NEW.weight / ((NEW.height / 100) * (NEW.height / 100));
  
  -- Calculate BMR (Mifflin-St Jeor Equation)
  IF NEW.gender = 'male' THEN
    NEW.bmr = (10 * NEW.weight) + (6.25 * NEW.height) - (5 * NEW.age) + 5;
  ELSE
    NEW.bmr = (10 * NEW.weight) + (6.25 * NEW.height) - (5 * NEW.age) - 161;
  END IF;
  
  -- Calculate TDEE
  CASE NEW.activity_level
    WHEN 'sedentary' THEN activity_multiplier = 1.2;
    WHEN 'light' THEN activity_multiplier = 1.375;
    WHEN 'moderate' THEN activity_multiplier = 1.55;
    WHEN 'active' THEN activity_multiplier = 1.725;
    WHEN 'very_active' THEN activity_multiplier = 1.9;
  END CASE;
  
  NEW.tdee = NEW.bmr * activity_multiplier;
  
  -- Calculate daily calorie goal based on primary goal
  CASE NEW.primary_goal
    WHEN 'weight_loss' THEN NEW.daily_calorie_goal = NEW.tdee - 500;
    WHEN 'muscle_gain' THEN NEW.daily_calorie_goal = NEW.tdee + 300;
    ELSE NEW.daily_calorie_goal = NEW.tdee;
  END CASE;
  
  -- Calculate daily water goal (35ml per kg)
  NEW.daily_water_goal = NEW.weight * 35;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_metrics_on_profile BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION calculate_health_metrics();
