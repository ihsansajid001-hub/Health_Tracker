'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface MedicalDisclaimerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function MedicalDisclaimer({ onAccept, onDecline }: MedicalDisclaimerProps) {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const accepted = localStorage.getItem('medical_disclaimer_accepted');
    if (!accepted) {
      setShowModal(true);
    } else {
      setHasAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('medical_disclaimer_accepted', 'true');
    localStorage.setItem('medical_disclaimer_date', new Date().toISOString());
    setHasAccepted(true);
    setShowModal(false);
    onAccept();
  };

  const handleDecline = () => {
    setShowModal(false);
    onDecline();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <AlertTriangle size={32} className="text-white" />
            <h2 className="text-2xl font-bold text-white">
              Important Medical Disclaimer
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-red-700 dark:text-red-400">
              ⚠️ THIS APP IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Please Read Carefully:
            </h3>

            <div className="space-y-2">
              <p>
                <strong>1. Not Medical Advice:</strong> This app provides general wellness information and tracking tools. It is NOT intended to diagnose, treat, cure, or prevent any disease or medical condition.
              </p>

              <p>
                <strong>2. Consult Healthcare Professionals:</strong> Always consult with qualified healthcare providers before:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Starting any new exercise program</li>
                <li>Making dietary changes</li>
                <li>Taking supplements or medications</li>
                <li>If you have any medical conditions</li>
                <li>If you are pregnant or breastfeeding</li>
              </ul>

              <p>
                <strong>3. Emergency Situations:</strong> If you experience:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Chest pain or difficulty breathing</li>
                <li>Severe allergic reactions</li>
                <li>Loss of consciousness or severe dizziness</li>
                <li>Any medical emergency</li>
              </ul>
              <p className="font-bold text-red-600 dark:text-red-400">
                CALL 911 IMMEDIATELY - Do not rely on this app
              </p>

              <p>
                <strong>4. Accuracy Limitations:</strong> While we strive for accuracy, calculations and recommendations are estimates. Individual results may vary. Always verify information with healthcare professionals.
              </p>

              <p>
                <strong>5. User Responsibility:</strong> You are responsible for:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Providing accurate health information</li>
                <li>Following safety warnings and contraindications</li>
                <li>Stopping activities if you experience pain or discomfort</li>
                <li>Seeking medical attention when needed</li>
              </ul>

              <p>
                <strong>6. Liability:</strong> By using this app, you acknowledge that the developers, creators, and operators are not liable for any injuries, health issues, or adverse effects resulting from use of this app.
              </p>

              <p>
                <strong>7. Medical Conditions:</strong> If you have any of the following, you MUST consult a doctor before using exercise or nutrition features:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Heart disease or high blood pressure</li>
                <li>Diabetes</li>
                <li>Pregnancy</li>
                <li>Joint, bone, or muscle injuries</li>
                <li>Eating disorders (current or history)</li>
                <li>Any chronic medical condition</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm">
              <strong>Crisis Resources:</strong> If you're experiencing a mental health crisis:
              <br />
              • National Suicide Prevention Lifeline: 988
              <br />
              • Crisis Text Line: Text HOME to 741741
              <br />
              • National Eating Disorders Association: 1-800-931-2237
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 p-6 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDecline}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              I Do Not Accept
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              I Understand and Accept
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            By accepting, you acknowledge that you have read and understood this disclaimer
          </p>
        </div>
      </div>
    </div>
  );
}
