'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Users } from 'lucide-react';

export default function CommunityPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-700 rounded-xl flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Community
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with others on their wellness journey
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Community Features Coming Soon!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Share your progress, get support, and inspire others. The community is launching soon!
          </p>
          <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Stay tuned for updates
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
