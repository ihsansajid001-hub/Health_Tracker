'use client';

import { Moon, Dumbbell, Apple, Brain, Droplet, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Moon,
    title: 'Sleep Tracking',
    description: 'Monitor your sleep patterns and get personalized recommendations for better rest.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: Dumbbell,
    title: 'Fitness Logging',
    description: 'Track workouts, monitor progress, and optimize your training routine.',
    color: 'from-red-500 to-red-700',
  },
  {
    icon: Apple,
    title: 'Nutrition Tracking',
    description: 'Log meals, track calories and macros, and hit your nutrition goals.',
    color: 'from-green-500 to-green-700',
  },
  {
    icon: Brain,
    title: 'Mind & Mood',
    description: 'Monitor your mental wellness, stress levels, and emotional balance.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: Droplet,
    title: 'Hydration',
    description: 'Stay hydrated with smart reminders and daily water intake tracking.',
    color: 'from-cyan-500 to-cyan-700',
  },
  {
    icon: TrendingUp,
    title: 'AI Insights',
    description: 'Get personalized recommendations powered by advanced AI analysis.',
    color: 'from-orange-500 to-orange-700',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for
            <span className="gradient-text"> Optimal Wellness</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive tools to track, analyze, and optimize every aspect of your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
