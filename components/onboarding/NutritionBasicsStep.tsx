'use client';

import { useState } from 'react';

interface NutritionBasicsStepProps {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function NutritionBasicsStep({ data, setData, onNext, onBack }: NutritionBasicsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dietaryPreferences = [
    { value: 'none', label: 'No Restrictions', icon: '🍽️' },
    { value: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
    { value: 'vegan', label: 'Vegan', icon: '🌱' },
    { value: 'keto', label: 'Ketogenic', icon: '🥑' },
    { value: 'paleo', label: 'Paleo', icon: '🥩' },
    { value: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
    { value: 'gluten_free', label: 'Gluten-Free', icon: '🌾' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const commonAllergies = [
    { value: 'dairy', label: 'Dairy', icon: '🥛' },
    { value: 'eggs', label: 'Eggs', icon: '🥚' },
    { value: 'nuts', label: 'Tree Nuts', icon: '🥜' },
    { value: 'peanuts', label: 'Peanuts', icon: '🥜' },
    { value: 'shellfish', label: 'Shellfish', icon: '🦐' },
    { value: 'fish', label: 'Fish', icon: '🐟' },
    { value: 'soy', label: 'Soy', icon: '🫘' },
    { value: 'gluten', label: 'Gluten', icon: '🌾' }
  ];

  const fastingSchedules = [
    { value: '16:8', label: '16:8 (16h fast, 8h eating)', description: 'Most popular' },
    { value: '18:6', label: '18:6 (18h fast, 6h eating)', description: 'Intermediate' },
    { value: '20:4', label: '20:4 (20h fast, 4h eating)', description: 'Advanced' },
    { value: '5:2', label: '5:2 (5 normal days, 2 low-cal)', description: 'Weekly cycle' },
    { value: 'other', label: 'Other schedule', description: 'Custom' }
  ];

  const handleAllergyToggle = (allergy: string) => {
    const currentAllergies = data.allergies || [];
    const newAllergies = currentAllergies.includes(allergy)
      ? currentAllergies.filter((a: string) => a !== allergy)
      : [...currentAllergies, allergy];
    setData({ ...data, allergies: newAllergies });
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.dietary_restriction) {
      newErrors.dietary_restriction = 'Please select your dietary preference';
    }
    if (!data.meals_per_day || data.meals_per_day < 1 || data.meals_per_day > 8) {
      newErrors.meals_per_day = 'Please select 1-8 meals per day';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🥗</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Eating Habits
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help us provide personalized nutrition recommendations
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Dietary Preference
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {dietaryPreferences.map((diet) => (
              <button
                key={diet.value}
                onClick={() => setData({ ...data, dietary_restriction: diet.value })}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  data.dietary_restriction === diet.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">{diet.icon}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {diet.label}
                </div>
              </button>
            ))}
          </div>
          {errors.dietary_restriction && (
            <p className="text-red-500 text-sm mt-1">{errors.dietary_restriction}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Food Allergies (Select all that apply)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {commonAllergies.map((allergy) => (
              <button
                key={allergy.value}
                onClick={() => handleAllergyToggle(allergy.value)}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  (data.allergies || []).includes(allergy.value)
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="text-xl mb-1">{allergy.icon}</div>
                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {allergy.label}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            🚨 Critical for safety - we'll show RED ALERTS for allergens
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meals Per Day: {data.meals_per_day || 3} meals
          </label>
          <input
            type="range"
            min="1"
            max="8"
            value={data.meals_per_day || 3}
            onChange={(e) => setData({ ...data, meals_per_day: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>3</span>
            <span>6</span>
            <span>8</span>
          </div>
          {errors.meals_per_day && (
            <p className="text-red-500 text-sm mt-1">{errors.meals_per_day}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Do you practice Intermittent Fasting?
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="no-fasting"
                name="fasting"
                checked={!data.intermittent_fasting}
                onChange={() => setData({ ...data, intermittent_fasting: false, fasting_schedule: null })}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="no-fasting" className="text-gray-900 dark:text-white">
                No, I eat throughout the day
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="yes-fasting"
                name="fasting"
                checked={data.intermittent_fasting}
                onChange={() => setData({ ...data, intermittent_fasting: true })}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="yes-fasting" className="text-gray-900 dark:text-white">
                Yes, I practice intermittent fasting
              </label>
            </div>
          </div>

          {data.intermittent_fasting && (
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fasting Schedule
              </label>
              {fastingSchedules.map((schedule) => (
                <div key={schedule.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={schedule.value}
                    name="fasting-schedule"
                    checked={data.fasting_schedule === schedule.value}
                    onChange={() => setData({ ...data, fasting_schedule: schedule.value })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor={schedule.value} className="flex-1">
                    <div className="text-gray-900 dark:text-white font-medium">
                      {schedule.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {schedule.description}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Nutrition Features</h4>
          <div className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
            <p>• 20M+ food database with barcode scanning</p>
            <p>• Macro tracking (protein, carbs, fats)</p>
            <p>• Meal planning and recipe importer</p>
            <p>• Allergen warnings and safety alerts</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-6">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}