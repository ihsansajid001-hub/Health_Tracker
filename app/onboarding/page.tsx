'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { OnboardingData } from '@/types';
import { calculateBMI, calculateBMR, calculateMaintenanceCalories } from '@/lib/utils/calculations';
import { supabase } from '@/lib/supabase/client';

const steps = ['Personal Info', 'Activity & Goals', 'Review'];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Calculate metrics
      const bmi = calculateBMI(data.weight, data.height);
      const bmr = calculateBMR(data);
      const maintenanceCalories = calculateMaintenanceCalories(bmr, data.activity_level);

      // Save profile
      const { error } = await supabase.from('user_profiles').insert({
        user_id: user.id,
        ...data,
        bmi,
        bmr,
        maintenance_calories: maintenanceCalories,
      });

      if (error) throw error;

      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-full mb-4">
            <Sparkles size={16} className="text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Let's Get Started
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to <span className="gradient-text">PeaceHub</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tell us about yourself to personalize your experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <span
                key={index}
                className={`text-sm font-medium ${
                  index <= currentStep
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Step 0: Personal Info */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="13"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={data.gender}
                    onChange={(e) => setData({ ...data, gender: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={data.height}
                    onChange={(e) => setData({ ...data, height: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={data.weight}
                    onChange={(e) => setData({ ...data, weight: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="30"
                    max="300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Activity & Goals */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Activity Level
                </label>
                <select
                  value={data.activity_level}
                  onChange={(e) => setData({ ...data, activity_level: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                  <option value="active">Active (exercise 6-7 days/week)</option>
                  <option value="very_active">Very Active (intense exercise daily)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Average Sleep Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={data.sleep_hours_avg}
                  onChange={(e) => setData({ ...data, sleep_hours_avg: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="3"
                  max="12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stress Level (1-10)
                </label>
                <input
                  type="range"
                  value={data.stress_level}
                  onChange={(e) => setData({ ...data, stress_level: parseInt(e.target.value) })}
                  className="w-full"
                  min="1"
                  max="10"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Low</span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">{data.stress_level}</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Goal
                </label>
                <select
                  value={data.primary_goal}
                  onChange={(e) => setData({ ...data, primary_goal: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Review Your Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Age</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.age} years</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gender</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{data.gender}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Height</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.height} cm</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Weight</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.weight} kg</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">BMI</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {calculateBMI(data.weight, data.height)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Daily Calories</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {calculateMaintenanceCalories(calculateBMR(data), data.activity_level)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  <strong>Primary Goal:</strong> {data.primary_goal.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>{currentStep === steps.length - 1 ? (loading ? 'Saving...' : 'Complete') : 'Next'}</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
