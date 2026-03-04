'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Deep dive into your wellness data
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Coming Soon!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced analytics and insights are on the way. Keep tracking your data!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
