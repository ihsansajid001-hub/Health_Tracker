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
  dietary_restriction: string;
  allergies: string[];
  meals_per_day: number;
  wake_time: string;
  bed_time: string;
  reminder_interval_minutes: number;
  mental_health_goals: string[];
  stress_level: number;
  medical_conditions: string[];
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
      });

      await supabase.from('nutrition_settings').insert({
        user_id: user.id,
        dietary_restriction: data.dietary_restriction || 'none',
        allergies: data.allergies || [],
        meals_per_day: data.meals_per_day || 3,
      });

      await supabase.from('hydration_settings').insert({
        user_id: user.id,
        daily_goal_ml: daily_water_goal,
        reminder_enabled: true,
        reminder_interval_minutes: data.reminder_interval_minutes || 120,
        reminder_start_time: data.wake_time || '07:00',
        reminder_end_time: data.bed_time || '22:00',
      });

      await supabase.from('mental_health_settings').insert({
        user_id: user.id,
        mental_health_goals: data.mental_health_goals || [],
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
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
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
          
          {/* Simplified steps for now - will be fully implemented */}
          {currentStep === 'sleep-basics' && (
            <SimpleStep
              icon="😴"
              title="Sleep Basics"
              fields={[
                { label: 'Bedtime', type: 'time', key: 'target_bedtime', value: data.target_bedtime || '23:00' },
                { label: 'Wake Time', type: 'time', key: 'target_wake_time', value: data.target_wake_time || '07:00' },
              ]}
              data={data}
              setData={setData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 'fitness-basics' && (
            <SimpleStep
              icon="💪"
              title="Fitness Basics"
              fields={[
                { label: 'Fitness Level', type: 'select', key: 'fitness_level', options: ['beginner', 'intermediate', 'advanced'] },
                { label: 'Workout Days/Week', type: 'number', key: 'workout_days_per_week', value: data.workout_days_per_week || 3 },
              ]}
              data={data}
              setData={setData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 'nutrition-basics' && (
            <SimpleStep
              icon="🥗"
              title="Nutrition Basics"
              fields={[
                { label: 'Dietary Preference', type: 'text', key: 'dietary_restriction', value: data.dietary_restriction || 'none' },
                { label: 'Meals per Day', type: 'number', key: 'meals_per_day', value: data.meals_per_day || 3 },
              ]}
              data={data}
              setData={setData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 'hydration-basics' && (
            <SimpleStep
              icon="💧"
              title="Hydration Basics"
              fields={[
                { label: 'Wake Time', type: 'time', key: 'wake_time', value: data.wake_time || '07:00' },
                { label: 'Bed Time', type: 'time', key: 'bed_time', value: data.bed_time || '22:00' },
              ]}
              data={data}
              setData={setData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 'mental-wellness' && (
            <SimpleStep
              icon="🧘"
              title="Mental Wellness"
              fields={[
                { label: 'Stress Level (1-10)', type: 'number', key: 'stress_level', value: data.stress_level || 5 },
              ]}
              data={data}
              setData={setData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 'medical-conditions' && (
            <SimpleStep
              icon="🏥"
              title="Medical Conditions (Optional)"
              fields={[]}
              data={data}
              setData={setData}
              onNext={nextStep}
              onBack={prevStep}
              skipable
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SimpleStep({ icon, title, fields, data, setData, onNext, onBack, skipable }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">{icon}</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {fields.map((field: any) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
          {field.type === 'select' ? (
            <select
              value={data[field.key] || field.options[0]}
              onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {field.options.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={data[field.key] || field.value || ''}
              onChange={(e) => setData({ ...data, [field.key]: field.type === 'number' ? parseInt(e.target.value) : e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          )}
        </div>
      ))}
      <div className="flex space-x-3 pt-4">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold">← Back</button>
        <button onClick={onNext} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold">
          {skipable ? 'Skip →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
