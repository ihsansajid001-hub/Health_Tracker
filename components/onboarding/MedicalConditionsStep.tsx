'use client';

import { useState } from 'react';

interface MedicalConditionsStepProps {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function MedicalConditionsStep({ data, setData, onNext, onBack }: MedicalConditionsStepProps) {
  const [showMedications, setShowMedications] = useState(false);

  const commonConditions = [
    { value: 'diabetes', label: 'Diabetes', icon: '🩸' },
    { value: 'hypertension', label: 'High Blood Pressure', icon: '💓' },
    { value: 'heart_disease', label: 'Heart Disease', icon: '❤️' },
    { value: 'asthma', label: 'Asthma', icon: '🫁' },
    { value: 'arthritis', label: 'Arthritis', icon: '🦴' },
    { value: 'depression', label: 'Depression', icon: '🧠' },
    { value: 'anxiety', label: 'Anxiety', icon: '😰' },
    { value: 'thyroid', label: 'Thyroid Issues', icon: '🦋' },
    { value: 'kidney_disease', label: 'Kidney Disease', icon: '🫘' },
    { value: 'liver_disease', label: 'Liver Disease', icon: '🫀' },
    { value: 'osteoporosis', label: 'Osteoporosis', icon: '🦴' },
    { value: 'herniated_disc', label: 'Herniated Disc', icon: '🔄' }
  ];

  const handleConditionToggle = (condition: string) => {
    const currentConditions = data.medical_conditions || [];
    const newConditions = currentConditions.includes(condition)
      ? currentConditions.filter((c: string) => c !== condition)
      : [...currentConditions, condition];
    setData({ ...data, medical_conditions: newConditions });
  };

  const handleNext = () => {
    // This step is optional, so no validation required
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🏥</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Health Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Optional but helps us provide safer, personalized recommendations
        </p>
        <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            🔒 This information is encrypted and never shared. You can skip this step.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Do you have any chronic health conditions? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {commonConditions.map((condition) => (
              <button
                key={condition.value}
                onClick={() => handleConditionToggle(condition.value)}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  (data.medical_conditions || []).includes(condition.value)
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="text-xl mb-1">{condition.icon}</div>
                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {condition.label}
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setData({ ...data, medical_conditions: [] })}
            className={`mt-3 w-full p-3 border-2 rounded-lg transition-colors ${
              (!data.medical_conditions || data.medical_conditions.length === 0)
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">✅</span>
              <span className="font-medium text-gray-900 dark:text-white">
                No chronic conditions
              </span>
            </div>
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Medications (Optional)
            </label>
            <button
              onClick={() => setShowMedications(!showMedications)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showMedications ? 'Hide' : 'Add medications'}
            </button>
          </div>
          
          {showMedications && (
            <textarea
              value={data.current_medications || ''}
              onChange={(e) => setData({ ...data, current_medications: e.target.value })}
              placeholder="List your current medications, dosages, and frequency..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={4}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            For Women: Are you currently pregnant or breastfeeding?
          </label>
          <div className="space-y-2">
            {[
              { value: 'no', label: 'No' },
              { value: 'pregnant', label: 'Pregnant' },
              { value: 'breastfeeding', label: 'Breastfeeding' },
              { value: 'prefer_not_to_say', label: 'Prefer not to say' },
              { value: 'not_applicable', label: 'Not applicable' }
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={option.value}
                  name="pregnancy_status"
                  checked={data.pregnancy_status === option.value}
                  onChange={() => setData({ ...data, pregnancy_status: option.value })}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor={option.value} className="text-gray-900 dark:text-white">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How This Helps</h4>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p>• Exercise safety: Blocks contraindicated exercises</p>
            <p>• Nutrition warnings: Alerts for dietary restrictions</p>
            <p>• Medication tracking: Reminders and interactions</p>
            <p>• Personalized limits: Safe ranges for all activities</p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Important Disclaimer</h4>
          <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
            <p>• This app is for wellness tracking only</p>
            <p>• Not a substitute for professional medical care</p>
            <p>• Always consult your doctor for medical decisions</p>
            <p>• Emergency resources are always available in the app</p>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">🚨 Emergency Resources</h4>
          <div className="text-sm text-red-800 dark:text-red-200 space-y-1">
            <p>• Emergency: 911</p>
            <p>• Suicide Prevention: 988</p>
            <p>• Crisis Text: Text HOME to 741741</p>
            <p>• Poison Control: 1-800-222-1222</p>
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
          Complete Setup →
        </button>
      </div>
    </div>
  );
}