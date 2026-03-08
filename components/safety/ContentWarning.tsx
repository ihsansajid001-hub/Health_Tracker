'use client';

import { AlertTriangle } from 'lucide-react';

interface ContentWarningProps {
  type: 'trauma' | 'eating_disorder' | 'anxiety' | 'general';
  message?: string;
  onProceed: () => void;
  onGoBack: () => void;
}

export default function ContentWarning({ type, message, onProceed, onGoBack }: ContentWarningProps) {
  const getWarningContent = () => {
    switch (type) {
      case 'trauma':
        return {
          title: 'Trauma-Sensitive Content',
          description: 'This content may discuss topics related to trauma, difficult emotions, or challenging life experiences.',
          color: 'from-orange-500 to-red-500',
        };
      case 'eating_disorder':
        return {
          title: 'Eating Disorder Sensitivity',
          description: 'This content discusses food, weight, or body image. If you have a history of eating disorders, please proceed with caution.',
          color: 'from-purple-500 to-pink-500',
        };
      case 'anxiety':
        return {
          title: 'Anxiety-Related Content',
          description: 'This content may discuss anxiety, stress, or worry. Take breaks if needed.',
          color: 'from-blue-500 to-indigo-500',
        };
      default:
        return {
          title: 'Content Notice',
          description: 'This content may be sensitive for some users.',
          color: 'from-gray-500 to-gray-700',
        };
    }
  };

  const content = getWarningContent();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className={`bg-gradient-to-r ${content.color} p-6 rounded-t-2xl`}>
          <div className="flex items-center space-x-3">
            <AlertTriangle size={28} className="text-white" />
            <h2 className="text-xl font-bold text-white">
              {content.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {message || content.description}
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <strong>Your wellbeing matters.</strong> You can always skip this content and return when you're ready.
            </p>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-2">If you need support:</p>
            <ul className="space-y-1">
              <li>• Crisis Text Line: Text HOME to 741741</li>
              <li>• National Suicide Prevention: 988</li>
              <li>• NEDA Hotline: 1-800-931-2237</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-b-2xl space-y-3">
          <button
            onClick={onProceed}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            I Understand, Continue
          </button>
          <button
            onClick={onGoBack}
            className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
