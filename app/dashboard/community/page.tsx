'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Users, MessageCircle, Heart, Share2, Trophy, TrendingUp, Target } from 'lucide-react';

interface CommunityPost { id: string; user: { username: string; avatar?: string }; content: string; type: 'achievement' | 'milestone' | 'motivation' | 'question'; timestamp: string; likes: number; comments: number; achievement?: { title: string; icon: string; category: string }; }
interface LeaderboardEntry { username: string; score: number; streak: number; rank: number; }

const mockPosts: CommunityPost[] = [
  { id: '1', user: { username: 'wellness_warrior', avatar: '🏃‍♀️' }, content: 'Just completed my 30-day workout streak! Feeling stronger than ever. The key was starting small and being consistent. Who else is working on their fitness goals?', type: 'achievement', timestamp: '2 hours ago', likes: 24, comments: 8, achievement: { title: '30-Day Workout Streak', icon: '🏆', category: 'fitness' } },
  { id: '2', user: { username: 'mindful_mike', avatar: '🧘‍♂️' }, content: 'Started meditating 10 minutes daily this week. Already feeling more centered and focused. Any tips for maintaining consistency?', type: 'milestone', timestamp: '4 hours ago', likes: 18, comments: 12 },
  { id: '3', user: { username: 'healthy_habits', avatar: '🥗' }, content: 'Meal prep Sunday complete! Prepared 5 days of balanced meals. Planning ahead makes healthy eating so much easier.', type: 'motivation', timestamp: '6 hours ago', likes: 31, comments: 15 },
  { id: '4', user: { username: 'sleep_optimizer', avatar: '😴' }, content: 'Finally hit my sleep goal of 8 hours for 7 days straight! My energy levels have improved dramatically.', type: 'achievement', timestamp: '1 day ago', likes: 42, comments: 6, achievement: { title: 'Sleep Champion', icon: '🌙', category: 'sleep' } },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { username: 'wellness_warrior', score: 95, streak: 30, rank: 1 },
  { username: 'sleep_optimizer', score: 92, streak: 28, rank: 2 },
  { username: 'mindful_mike', score: 88, streak: 25, rank: 3 },
  { username: 'healthy_habits', score: 85, streak: 22, rank: 4 },
  { username: 'fitness_fanatic', score: 82, streak: 20, rank: 5 },
];

const tabs = [
  { id: 'feed', label: 'Community Feed', icon: MessageCircle },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'challenges', label: 'Challenges', icon: Target },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => setLikedPosts(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* Page header */}
        <div className="bg-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
              <Users size={28} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-pink-200 mb-1">// Dashboard</p>
              <h1 className="text-3xl font-black">Community</h1>
              <p className="text-pink-200 text-sm mt-1">Connect with others on their wellness journey</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/25'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
              }`}>
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            {activeTab === 'feed' && mockPosts.map(post => (
              <div key={post.id} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                    {post.user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-black text-gray-900 dark:text-white text-sm">{post.user.username}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{post.timestamp}</span>
                    </div>
                    {post.achievement && (
                      <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center gap-3">
                        <span className="text-2xl">{post.achievement.icon}</span>
                        <div>
                          <div className="font-black text-amber-800 dark:text-amber-200 text-sm">{post.achievement.title}</div>
                          <div className="text-xs text-amber-600 dark:text-amber-400 capitalize">{post.achievement.category} Achievement</div>
                        </div>
                      </div>
                    )}
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">{post.content}</p>
                    <div className="flex items-center gap-5 text-sm text-gray-400">
                      <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 transition-colors ${likedPosts.has(post.id) ? 'text-red-500' : 'hover:text-red-500'}`}>
                        <Heart size={15} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                        <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                        <MessageCircle size={15} /><span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors">
                        <Share2 size={15} /><span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'leaderboard' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">// Rankings</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-5">Weekly Leaderboard</h3>
                <div className="space-y-3">
                  {mockLeaderboard.map(entry => (
                    <div key={entry.username} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        entry.rank === 1 ? 'bg-amber-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>{entry.rank}</div>
                      <div className="flex-1">
                        <div className="font-black text-gray-900 dark:text-white text-sm">{entry.username}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{entry.streak} day streak</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-gray-900 dark:text-white">{entry.score}</div>
                        <div className="text-xs text-gray-400">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">// Active</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-5">Active Challenges</h3>
                <div className="space-y-4">
                  {[
                    { title: '30-Day Fitness Challenge', participants: 156, daysLeft: 12, color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
                    { title: 'Mindful March', participants: 89, daysLeft: 8, color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
                    { title: 'Hydration Hero', participants: 203, daysLeft: 20, color: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800' },
                  ].map((c, i) => (
                    <div key={i} className={`p-5 rounded-2xl border ${c.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-gray-900 dark:text-white">{c.title}</h4>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{c.daysLeft} days left</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{c.participants} participants</p>
                      <button className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-colors text-sm">
                        Join Challenge
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">// Stats</p>
              <div className="space-y-4">
                {[
                  { label: 'Active Members', value: '1,247' },
                  { label: 'Posts Today', value: '89' },
                  { label: 'Achievements Unlocked', value: '342' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{s.label}</span>
                    <span className="font-black text-gray-900 dark:text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">// Trending</p>
              <div className="space-y-3">
                {['#30DayChallenge', '#MindfulMoments', '#HealthyMeals', '#WorkoutMotivation', '#SleepBetter'].map((tag, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-pink-600 dark:text-pink-400">{tag}</span>
                    <span className="text-xs text-gray-400">{Math.floor(Math.random() * 50) + 10} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
