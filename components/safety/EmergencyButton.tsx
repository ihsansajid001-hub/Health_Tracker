'use client';

import { useState } from 'react';
import { Phone, X, AlertTriangle } from 'lucide-react';

export default function EmergencyButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Floating Emergency Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Emergency Resources"
      >
        <Phone size={24} />
      </button>

      {/* Emergency Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 rounded-t-2xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1"
              >
                <X size={24} />
              </button>
              <div className="flex items-center space-x-3">
                <AlertTriangle size={32} className="text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Emergency Resources
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-700 dark:text-red-400">
                  🚨 If this is a medical emergency, call 911 immediately
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Crisis Hotlines:
                </h3>

                <a
                  href="tel:988"
                  className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Suicide & Crisis Lifeline
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        24/7 Support
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      988
                    </div>
                  </div>
                </a>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Crisis Text Line
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Text HOME to 741741
                      </p>
                    </div>
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      SMS
                    </div>
                  </div>
                </div>

                <a
                  href="tel:18009312237"
                  className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Eating Disorders Hotline
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        NEDA Support
                      </p>
                    </div>
                    <div className="text-sm font-bold text-green-600 dark:text-green-400">
                      1-800-931-2237
                    </div>
                  </div>
                </a>

                <a
                  href="tel:911"
                  className="block p-4 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors border-2 border-red-500"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-red-700 dark:text-red-400">
                        Medical Emergency
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-500">
                        Immediate danger or life-threatening
                      </p>
                    </div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                      911
                    </div>
                  </div>
                </a>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>
                  <strong>When to call 911:</strong>
                </p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Chest pain or difficulty breathing</li>
                  <li>Severe allergic reaction</li>
                  <li>Loss of consciousness</li>
                  <li>Severe bleeding or injury</li>
                  <li>Thoughts of harming yourself or others</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
