'use client';

import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

export default function RecentInsights() {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/insights/recent');
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles size={24} className="text-primary-600 dark:text-primary-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          AI Insights
        </h3>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
          <p>Start tracking to get personalized insights!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-3">
                <TrendingUp size={20} className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
