'use client';

import { AlertTriangle, X } from 'lucide-react';

interface AllergenAlertProps {
  allergens: string[];
  foodName: string;
  onAcknowledge: () => void;
  onCancel: () => void;
}

export default function AllergenAlert({ allergens, foodName, onAcknowledge, onCancel }: AllergenAlertProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
        {/* Header - RED ALERT */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-t-2xl relative">
          <div className="flex items-center space-x-3">
            <div className="animate-pulse">
              <AlertTriangle size={36} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                🚨 ALLERGEN ALERT
              </h2>
              <p className="text-red-100 text-sm">
                CRITICAL WARNING
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-500 p-4 rounded-lg">
            <p className="font-bold text-red-700 dark:text-red-400 text-lg mb-2">
              ⚠️ DO NOT CONSUME
            </p>
            <p className="text-red-600 dark:text-red-300">
              This food contains allergens that you have listed in your profile.
            </p>
          </div>

          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Food:</strong> {foodName}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Detected Allergens:</strong>
            </p>
            <div className="space-y-2">
              {allergens.map((allergen, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-red-100 dark:bg-red-900/20 p-3 rounded-lg border border-red-300 dark:border-red-700"
                >
                  <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-400">
                    {allergen}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              <strong>Severe Allergic Reaction Risk:</strong>
              <br />
              Consuming this food may cause anaphylaxis, a life-threatening allergic reaction.
            </p>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Symptoms of anaphylaxis:</strong></p>
            <ul className="list-disc ml-5">
              <li>Difficulty breathing or throat swelling</li>
              <li>Rapid pulse or drop in blood pressure</li>
              <li>Dizziness or loss of consciousness</li>
              <li>Severe skin reactions (hives, swelling)</li>
            </ul>
            <p className="font-bold text-red-600 dark:text-red-400 mt-2">
              If symptoms occur: Use EpiPen and call 911 immediately
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-b-2xl space-y-3">
          <button
            onClick={onCancel}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            ✓ I Will Not Eat This
          </button>
          <button
            onClick={onAcknowledge}
            className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
          >
            I Understand the Risk (Dismiss Warning)
          </button>
        </div>
      </div>
    </div>
  );
}
