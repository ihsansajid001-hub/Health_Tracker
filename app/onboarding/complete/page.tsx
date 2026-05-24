'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import UsernameStep from '@/components/onboarding/UsernameStep';
import BasicProfileStep from '@/components/onboarding/BasicProfileStep';
import PhysicalStatsStep from '@/components/onboarding/PhysicalStatsStep';
import ActivityLevelStep from '@/components/onboarding/ActivityLevelStep';
import PrimaryGoalStep from '@/components/onboarding/PrimaryGoalStep';
import SleepBasicsStep from '@/components/onboarding/SleepBasicsStep';
import FitnessBasicsStep from '@/components/onboarding/FitnessBasicsStep';
import NutritionBasicsStep from '@/components/onboarding/NutritionBasicsStep';
import HydrationBasicsStep from '@/components/onboarding/HydrationBasicsStep';
import MentalWellnessStep from '@/components/onboarding/MentalWellnessStep';
import MedicalConditionsStep from '@/components/onboarding/MedicalConditionsStep';
import CompleteStep from '@/components/onboarding/CompleteStep';

type OnboardingStep = 
  | 'welcome'
  | 'username'
  | 'basic-profile'
  | 'physical-stats'
  | 'activity-level'
  | 'primary-goal'
  | 'sleep-basics'
  | 'fitness-basics'
  | 'nutrition-basics'
  | 'hydration-basics'
  | 'mental-wellness'
  | 'medical-conditions'
  | 'complete';

interface OnboardingData {
  username: string;
  full_name: string;
  date_of_birth: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  target_weight?: number;
  units_system: 'metric' | 'imperial';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  primary_goal: string;
  target_bedtime: string;
  target_wake_time: string;
  target_sleep_hours: number;
  sleep_quality: number;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  preferred_workout_time: string;
  workout_days_per_week: number;
  injuries_limitations?: string;
  dietary_restriction: string;
  allergies: string[];
  meals_per_day: number;
  intermittent_fasting: boolean;
  fasting_schedule?: string;
  wake_time: string;
  bed_time: string;
  reminder_interval_minutes: number;
  preferred_container_size: number;
  daily_water_goal: number;
  mental_health_goals: string[];
  stress_level: number;
  meditation_experience: string;
  preferred_session_length: number;
  preferred_wellness_time: string;
  medical_conditions: string[];
  current_medications?: string;
  pregnancy_status?: string;
}

export default function CompleteOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<OnboardingData>>({
    units_system: 'metric',
    gender: 'male',
    activity_level: 'moderate',
    fitness_level: 'beginner',
    meals_per_day: 3,
    workout_days_per_week: 3,
    target_sleep_hours: 8,
    sleep_quality: 7,
    stress_level: 5,
    reminder_interval_minutes: 120,
    preferred_container_size: 500,
    preferred_session_length: 10,
    intermittent_fasting: false,
    allergies: [],
    mental_health_goals: [],
    medical_conditions: [],
  });

  const steps: OnboardingStep[] = [
    'welcome',
    'username',
    'basic-profile',
    'physical-stats',
    'activity-level',
    'primary-goal',
    'sleep-basics',
    'fitness-basics',
    'nutrition-basics',
    'hydration-basics',
    'mental-wellness',
    'medical-conditions',
    'complete',
  ];

  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const heightM = (data.height || 170) / 100;
      const bmi = (data.weight || 70) / (heightM * heightM);
      
      let bmr = 0;
      if (data.gender === 'male') {
        bmr = (10 * (data.weight || 70)) + (6.25 * (data.height || 170)) - (5 * (data.age || 30)) + 5;
      } else {
        bmr = (10 * (data.weight || 70)) + (6.25 * (data.height || 170)) - (5 * (data.age || 30)) - 161;
      }
      
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
      };
      const tdee = bmr * activityMultipliers[data.activity_level || 'moderate'];
      
      let daily_calorie_goal = tdee;
      if (data.primary_goal === 'weight_loss') {
        daily_calorie_goal = tdee - 500;
      } else if (data.primary_goal === 'muscle_gain') {
        daily_calorie_goal = tdee + 300;
      }
      
      const daily_water_goal = (data.weight || 70) * 35;

      const { error: profileError } = await supabase.from('user_profiles').insert({
        user_id: user.id,
        username: data.username,
        full_name: data.full_name,
        date_of_birth: data.date_of_birth,
        age: data.age,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        target_weight: data.target_weight,
        activity_level: data.activity_level,
        primary_goal: data.primary_goal,
        bmi,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        daily_calorie_goal: Math.round(daily_calorie_goal),
        daily_water_goal: Math.round(daily_water_goal),
        units_system: data.units_system,
        medical_conditions: data.medical_conditions || [],
        current_medications: data.current_medications || null,
        pregnancy_status: data.pregnancy_status || null,
        onboarding_completed: true,
      });

      if (profileError) throw profileError;

      await supabase.from('sleep_settings').insert({
        user_id: user.id,
        target_bedtime: data.target_bedtime || '23:00',
        target_wake_time: data.target_wake_time || '07:00',
        target_sleep_hours: data.target_sleep_hours || 8,
      });

      await supabase.from('fitness_settings').insert({
        user_id: user.id,
        fitness_level: data.fitness_level || 'beginner',
        preferred_workout_time: data.preferred_workout_time || 'flexible',
        workout_days_per_week: data.workout_days_per_week || 3,
        injuries_limitations: data.injuries_limitations || null,
      });

      await supabase.from('nutrition_settings').insert({
        user_id: user.id,
        dietary_restriction: data.dietary_restriction || 'none',
        allergies: data.allergies || [],
        meals_per_day: data.meals_per_day || 3,
        intermittent_fasting: data.intermittent_fasting || false,
        fasting_schedule: data.fasting_schedule || null,
      });

      await supabase.from('hydration_settings').insert({
        user_id: user.id,
        daily_goal_ml: data.daily_water_goal || daily_water_goal,
        reminder_enabled: (data.reminder_interval_minutes ?? 0) > 0,
        reminder_interval_minutes: data.reminder_interval_minutes || 120,
        reminder_start_time: data.wake_time || '07:00',
        reminder_end_time: data.bed_time || '22:00',
        preferred_container_size: data.preferred_container_size || 500,
      });

      await supabase.from('mental_health_settings').insert({
        user_id: user.id,
        mental_health_goals: data.mental_health_goals || [],
        meditation_experience: data.meditation_experience || 'beginner',
        preferred_session_length: data.preferred_session_length || 10,
        preferred_wellness_time: data.preferred_wellness_time || 'flexible',
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {currentStep !== 'welcome' && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {currentStep === 'welcome' && <WelcomeStep onNext={nextStep} />}
          {currentStep === 'username' && <UsernameStep data={data} setData={setData} onNext={nextStep} onBack={prevStep} />}
          {currentStep === 'basic-profile' && <BasicProfileStep data={data} setData={setData} onNext={nextStep} onBack={prevStep} />}
          {currentStep === 'physical-stats' && <PhysicalStatsStep data={data} setData={setData} onNext={nextStep} onBack={prevStep} />}
          {currentStep === 'activity-level' && <ActivityLevelStep data={data} setData={setData} onNext={nextStep} onBack={prevStep} />}
          {currentStep === 'primary-goal' && <PrimaryGoalStep data={data} setData={setData} onNext={nextStep} onBack={prevStep} />}
          {currentStep === 'complete' && <CompleteStep data={data} onComplete={handleComplete} loading={loading} />}
          
          {currentStep === 'sleep-basics' && <SleepBasicsStep data={data} setData={setData} onNext={nextStep} onBack={prevStep} />}
          {currentStep === 'fitness-basics' && <FitnessBasicsStep data={data} setData={setData} onNext={nextStep} onBack={prevStep} />}
          {currentStep === 'nutrition-basics' && <NutritionBasicsStep data={data} setData={setData} onNext={nextStep} onBack={prevStep} />}
          {currentStep === 'hydration-basics' && <HydrationBasicsStep data={data} setData={setData} onNext={nextStep} onBack={prevStep} />}
          {currentStep === 'mental-wellness' && <MentalWellnessStep data={data} setData={setData} onNext={nextStep} onBack={prevStep} />}
          {currentStep === 'medical-conditions' && <MedicalConditionsStep data={data} setData={setData} onNext={nextStep} onBack={prevStep} />}
        </div>
      </div>
    </div>
  );
}
