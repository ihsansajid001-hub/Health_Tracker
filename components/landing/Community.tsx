'use client';

import { Users, Heart, MessageCircle, Award } from 'lucide-react';

const communityFeatures = [
  {
    icon: Users,
    title: 'Supportive Community',
    description: 'Connect with like-minded individuals on their wellness journey.',
  },
  {
    icon: Heart,
    title: 'Share Your Progress',
    description: 'Celebrate milestones and inspire others with your achievements.',
  },
  {
    icon: MessageCircle,
    title: 'Get Support',
    description: 'Ask questions, share tips, and learn from the community.',
  },
  {
    icon: Award,
    title: 'Challenges & Events',
    description: 'Participate in community challenges and wellness events.',
  },
];

export default function Community() {
  return (
    <section id="community" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-calm-blue to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Join Our Thriving
              <span className="gradient-text"> Wellness Community</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              You're not alone on this journey. Connect with thousands of people who understand
              your challenges and celebrate your victories.
            </p>

            <div className="space-y-6">
              {communityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Community Stats */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: '10,000+', label: 'Active Members', icon: Users },
              { value: '50,000+', label: 'Goals Achieved', icon: Award },
              { value: '100,000+', label: 'Messages Shared', icon: MessageCircle },
              { value: '98%', label: 'Feel Supported', icon: Heart },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <stat.icon size={32} className="text-primary-600 dark:text-primary-400 mb-4" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
