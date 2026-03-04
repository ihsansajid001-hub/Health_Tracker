'use client';

import { UserPlus, Target, BarChart3, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Tell us about yourself, your goals, and your current lifestyle habits.',
    step: '01',
  },
  {
    icon: Target,
    title: 'Track Daily Habits',
    description: 'Log your sleep, workouts, meals, mood, and hydration effortlessly.',
    step: '02',
  },
  {
    icon: BarChart3,
    title: 'View Your Score',
    description: 'See your Life Performance Score and detailed analytics in real-time.',
    step: '03',
  },
  {
    icon: Sparkles,
    title: 'Get AI Insights',
    description: 'Receive personalized recommendations to optimize your wellness journey.',
    step: '04',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-calm-blue to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Four simple steps to transform your lifestyle and achieve your wellness goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-500 dark:from-primary-700 dark:to-primary-500 -z-10" />
              )}

              <div className="text-center">
                {/* Step Number */}
                <div className="text-6xl font-bold text-primary-200 dark:text-primary-900 mb-4">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <step.icon size={32} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
