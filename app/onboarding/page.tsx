'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { OnboardingData } from '@/types';
import { calculateBMI, calculateBMR, calculateMaintenanceCalories } from '@/lib/utils/calculations';
import { supabase } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [data, setData] = useState<OnboardingData>({
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    activity_level: 'moderate',
    sleep_hours_avg: 7,
    stress_level: 5,
    primary_goal: 'general_wellness',
  });

  useEffect(() => {
    checkOnboardingStatus();
  }, [searchParams]);

  const checkOnboardingStatus = async () => {
    // Get username from URL params or user metadata
    const usernameParam = searchParams.get('username');
    if (usernameParam) {
      setUsername(usernameParam);
    }

    // Check if user already completed onboarding
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // If profile exists, redirect to dashboard (onboarding already completed)
      if (existingProfile) {
        console.log('Profile already exists, redirecting to dashboard');
        window.location.href = '/dashboard';
        return;
      }

      // Get username from user metadata if not in URL
      if (!usernameParam && user.user_metadata?.username) {
        setUsername(user.user_metadata.username);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated. Please log in again.');
        router.push('/login');
        return;
      }

      console.log('Saving profile for user:', user.id);

      // Check if profile already exists (prevent duplicate)
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        console.log('Profile already exists, redirecting to dashboard');
        window.location.href = '/dashboard';
        return;
      }

      // Calculate metrics
      const bmi = calculateBMI(data.weight, data.height);
      const bmr = calculateBMR(data);
      const maintenanceCalories = calculateMaintenanceCalories(bmr, data.activity_level);

      const profileData = {
        user_id: user.id,
        username: username || user.user_metadata?.username || user.email?.split('@')[0],
        ...data,
        bmi,
        bmr,
        maintenance_calories: maintenanceCalories,
      };

      console.log('Profile data to save:', profileData);

      // Save profile - THIS IS ONE-TIME ONLY
      const { data: savedProfile, error: dbError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        
        // If error is duplicate user_id, redirect to dashboard
        if (dbError.code === '23505') {
          console.log('Duplicate profile detected, redirecting to dashboard');
          window.location.href = '/dashboard';
          return;
        }
        
        setError(`Database error: ${dbError.message}`);
        setLoading(false);
        return;
      }

      console.log('Profile saved successfully - ONBOARDING COMPLETE!');

      // Onboarding complete - redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Onboarding error:', error);
      setError(error.message || 'Unknown error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Phone Mockup */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative">
            {/* Decorative circles */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full opacity-50 blur-2xl"></div>
            
            {/* Phone Frame */}
            <div className="relative z-10 w-[280px] h-[580px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                {/* Phone Screen Content */}
                <div className="h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center p-6">
                  <div className="text-center mb-8">
                    <div className="text-white text-4xl font-bold mb-2">LifeScore</div>
                    <div className="text-blue-100 text-sm">Complete Your Profile</div>
                  </div>
                  
                  {/* Progress Steps Visual */}
                  <div className="w-full bg-white rounded-2xl p-6 shadow-xl mb-6">
                    <div className="flex justify-center items-center space-x-2 mb-4">
                      {[0, 1, 2].map((step) => (
                        <div
                          key={step}
                          className={`h-2 rounded-full transition-all ${
                            step === currentStep
                              ? 'w-8 bg-gradient-to-r from-blue-600 to-indigo-600'
                              : step < currentStep
                              ? 'w-2 bg-green-500'
                              : 'w-2 bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        Step {currentStep + 1} of 3
                      </div>
                      <div className="text-sm text-gray-600">
                        {currentStep === 0 && 'Personal Information'}
                        {currentStep === 1 && 'Activity & Goals'}
                        {currentStep === 2 && 'Review & Complete'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full"></div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full"></div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Phone Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Onboarding Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentStep === 0 && "Let's get you started!"}
                {currentStep === 1 && 'Activity & Goals'}
                {currentStep === 2 && 'Almost there!'}
              </h2>
              <p className="text-gray-600">
                {currentStep === 0 && "Tell us about yourself to personalize your experience"}
                {currentStep === 1 && "Help us understand your lifestyle and aspirations"}
                {currentStep === 2 && "Review your information and start your journey"}
              </p>
            </div>

            {/* Progress Indicator - Minimal */}
            <div className="mb-8">
              <div className="flex justify-center items-center space-x-2">
                {[0, 1, 2].map((step) => (
                  <div
                    key={step}
                    className={`h-2 rounded-full transition-all ${
                      step === currentStep
                        ? 'w-12 bg-gradient-to-r from-blue-600 to-indigo-600'
                        : step < currentStep
                        ? 'w-2 bg-blue-600'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="mb-8">
              {/* Step 0: Personal Info */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={data.age}
                        onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition-all"
                        min="13"
                        max="120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={data.gender}
                        onChange={(e) => setData({ ...data, gender: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition-all"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={data.height}
                        onChange={(e) => setData({ ...data, height: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition-all"
                        min="100"
                        max="250"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={data.weight}
                        onChange={(e) => setData({ ...data, weight: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition-all"
                        min="30"
                        max="300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Activity & Goals */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Level
                    </label>
                    <select
                      value={data.activity_level}
                      onChange={(e) => setData({ ...data, activity_level: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition-all"
                    >
                      <option value="sedentary">Sedentary (little or no exercise)</option>
                      <option value="light">Light (exercise 1-3 days/week)</option>
                      <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                      <option value="active">Active (exercise 6-7 days/week)</option>
                      <option value="very_active">Very Active (intense exercise daily)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Sleep Hours
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={data.sleep_hours_avg}
                      onChange={(e) => setData({ ...data, sleep_hours_avg: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition-all"
                      min="3"
                      max="12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stress Level: <span className="text-blue-600 font-semibold">{data.stress_level}</span>
                    </label>
                    <input
                      type="range"
                      value={data.stress_level}
                      onChange={(e) => setData({ ...data, stress_level: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      min="1"
                      max="10"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Goal
                    </label>
                    <select
                      value={data.primary_goal}
                      onChange={(e) => setData({ ...data, primary_goal: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition-all"
                    >
                      <option value="fat_loss">Fat Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="improve_sleep">Improve Sleep</option>
                      <option value="productivity">Boost Productivity</option>
                      <option value="general_wellness">General Wellness</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Review */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Age</p>
                      <p className="text-lg font-semibold text-gray-900">{data.age} years</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Gender</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">{data.gender}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Height</p>
                      <p className="text-lg font-semibold text-gray-900">{data.height} cm</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Weight</p>
                      <p className="text-lg font-semibold text-gray-900">{data.weight} kg</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">BMI</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {calculateBMI(data.weight, data.height)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Daily Calories</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {calculateMaintenanceCalories(calculateBMR(data), data.activity_level)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Primary Goal:</span> {data.primary_goal.replace('_', ' ').charAt(0).toUpperCase() + data.primary_goal.replace('_', ' ').slice(1)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center space-x-2"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  currentStep === 2 ? 'Complete Setup' : 'Continue'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
