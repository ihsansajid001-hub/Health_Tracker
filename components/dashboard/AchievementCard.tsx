'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Target, Zap, Award, Calendar } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlocked_at: string;
}

export default function AchievementCard() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false })
        .limit(3);

      if (data) {
        setAchievements(data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sleep': return <Calendar size={16} className="text-orange-500" />;
      case 'fitness': return <Zap size={16} className="text-red-500" />;
      case 'nutrition': return <Target size={16} className="text-orange-500" />;
      case 'mental': return <Star size={16} className="text-orange-500" />;
      case 'hydration': return <Award size={16} className="text-orange-500" />;
      default: return <Trophy size={16} className="text-yellow-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Trophy size={24} className="text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Recent Achievements
        </h3>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Trophy size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Complete activities to unlock achievements!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
            >
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {achievement.title}
                  </h4>
                  {getCategoryIcon(achievement.category)}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(achievement.unlocked_at)}
              </div>
            </div>
          ))}
          
          {achievements.length > 0 && (
            <div className="text-center pt-2">
              <button className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium">
                View all achievements
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}