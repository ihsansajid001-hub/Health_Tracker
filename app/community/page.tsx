'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/landing/Footer';
import { Users, MessageCircle, Heart, Share2, Trophy, TrendingUp, Target } from 'lucide-react';

interface CommunityPost {
  id: string;
  user: { username: string; avatar: string };
  content: string;
  type: 'achievement' | 'milestone' | 'motivation' | 'question';
  timestamp: string;
  likes: number;
  comments: number;
  achievement?: { title: string; icon: string; category: string };
}

interface LeaderboardEntry { username: string; score: number; streak: number; rank: number; }

const mockPosts: CommunityPost[] = [
  { id: '1', user: { username: 'wellness_warrior', avatar: '🏃‍♀️' }, content: 'Just completed my 30-day workout streak! Feeling stronger than ever. The key was starting small and being consistent. Who else is working on their fitness goals?', type: 'achievement', timestamp: '2 hours ago', likes: 24, comments: 8, achievement: { title: '30-Day Workout Streak', icon: '🏆', category: 'fitness' } },
  { id: '2', user: { username: 'mindful_mike', avatar: '🧘‍♂️' }, content: 'Started meditating 10 minutes daily this week. Already feeling more centered and focused. Any tips for maintaining consistency?', type: 'milestone', timestamp: '4 hours ago', likes: 18, comments: 12 },
  { id: '3', user: { username: 'healthy_habits', avatar: '🥗' }, content: 'Meal prep Sunday complete! Prepared 5 days of balanced meals. Planning ahead makes healthy eating so much easier.', type: 'motivation', timestamp: '6 hours ago', likes: 31, comments: 15 },
  { id: '4', user: { username: 'sleep_optimizer', avatar: '😴' }, content: 'Finally hit my sleep goal of 8 hours for 7 days straight! My energy levels have improved dramatically.', type: 'achievement', timestamp: '1 day ago', likes: 42, comments: 6, achievement: { title: 'Sleep Champion', icon: '🌙', category: 'sleep' } },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { username: 'wellness_warrior', score: 95, streak: 30, rank: 1 },
  { username: 'sleep_optimizer',  score: 92, streak: 28, rank: 2 },
  { username: 'mindful_mike',     score: 88, streak: 25, rank: 3 },
  { username: 'healthy_habits',   score: 85, streak: 22, rank: 4 },
  { username: 'fitness_fanatic',  score: 82, streak: 20, rank: 5 },
];

const tabs = [
  { id: 'feed',        label: 'Community Feed', icon: MessageCircle },
  { id: 'leaderboard', label: 'Leaderboard',    icon: Trophy },
  { id: 'challenges',  label: 'Challenges',     icon: Target },
];

const stats = [
  { label: 'Active Members',       value: '1,247' },
  { label: 'Posts Today',          value: '89' },
  { label: 'Achievements Unlocked', value: '342' },
];

const trending = ['#30DayChallenge', '#MindfulMoments', '#HealthyMeals', '#WorkoutMotivation', '#SleepBetter'];

export default function CommunityPage() {
  const [activeTab, setActiveTab]   = useState('feed');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) =>
    setLikedPosts(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <main className="min-h-screen bg-white">

      {/* ── Minimal header ── */}
      <header className="flex items-center justify-between px-8 md:px-14 h-20 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">LifeScore</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">← Back to Home</Link>
          <Link href="/signup" className="btn-orange">Join Free</Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-8 md:px-14 py-16 md:py-24 max-w-7xl mx-auto">
        <p className="section-tag mb-5">// Community</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none">
            Wellness
            <br /><span className="text-orange-500">Community</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-sm md:mb-2">
            Connect with thousands of people on their wellness journey. Share progress, join challenges, and get inspired.
          </p>
        </div>

        {/* Community stats row */}
        <div className="flex flex-wrap gap-8 mt-10 pt-10 border-t border-gray-100">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-black text-gray-900 tabular-nums">{s.value}</div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-300 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="px-8 md:px-14 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-8">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  activeTab === t.id
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-50 border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900'
                }`}>
                <t.icon size={15} />
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Main column ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Feed */}
              {activeTab === 'feed' && mockPosts.map(post => (
                <div key={post.id} className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-gray-100 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                      {post.user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-black text-gray-900 text-sm">{post.user.username}</span>
                        <span className="text-xs text-gray-300">{post.timestamp}</span>
                      </div>
                      {post.achievement && (
                        <div className="mb-3 p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
                          <span className="text-2xl">{post.achievement.icon}</span>
                          <div>
                            <div className="font-black text-amber-800 text-sm">{post.achievement.title}</div>
                            <div className="text-xs text-amber-500 capitalize">{post.achievement.category} Achievement</div>
                          </div>
                        </div>
                      )}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.content}</p>
                      <div className="flex items-center gap-5 text-sm text-gray-300">
                        <button onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 transition-colors ${likedPosts.has(post.id) ? 'text-red-500' : 'hover:text-red-500'}`}>
                          <Heart size={14} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                          <span className="font-bold">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                          <MessageCircle size={14} /><span className="font-bold">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                          <Share2 size={14} /><span className="font-bold">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Leaderboard */}
              {activeTab === 'leaderboard' && (
                <div className="card p-6">
                  <p className="section-tag mb-1">// Rankings</p>
                  <h3 className="text-2xl font-black text-gray-900 mb-5">Weekly Leaderboard</h3>
                  <div className="space-y-3">
                    {mockLeaderboard.map(entry => (
                      <div key={entry.username} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                          entry.rank === 1 ? 'bg-amber-500 text-white' :
                          entry.rank === 2 ? 'bg-gray-400 text-white' :
                          entry.rank === 3 ? 'bg-orange-500 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>{entry.rank}</div>
                        <div className="flex-1">
                          <div className="font-black text-gray-900 text-sm">{entry.username}</div>
                          <div className="text-xs text-gray-400">{entry.streak} day streak</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-gray-900 tabular-nums">{entry.score}</div>
                          <div className="text-xs text-gray-300 font-bold uppercase tracking-widest">pts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges */}
              {activeTab === 'challenges' && (
                <div className="card p-6">
                  <p className="section-tag mb-1">// Active</p>
                  <h3 className="text-2xl font-black text-gray-900 mb-5">Active Challenges</h3>
                  <div className="space-y-4">
                    {[
                      { title: '30-Day Fitness Challenge', participants: 156, daysLeft: 12, accent: 'bg-red-50 border-red-100' },
                      { title: 'Mindful March',            participants: 89,  daysLeft: 8,  accent: 'bg-orange-50 border-orange-100' },
                      { title: 'Hydration Hero',           participants: 203, daysLeft: 20, accent: 'bg-cyan-50 border-cyan-100' },
                    ].map((c, i) => (
                      <div key={i} className={`p-5 rounded-2xl border ${c.accent}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-black text-gray-900">{c.title}</h4>
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{c.daysLeft}d left</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">{c.participants} participants</p>
                        <Link href="/signup"
                          className="block w-full py-2.5 bg-gray-900 hover:bg-gray-700 text-white font-black rounded-full text-center text-sm transition-colors">
                          Join Challenge →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-4">

              {/* Stats */}
              <div className="card p-6">
                <p className="section-tag mb-4">// Stats</p>
                <div className="space-y-4">
                  {stats.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{s.label}</span>
                      <span className="font-black text-gray-900 tabular-nums">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div className="card p-6">
                <p className="section-tag mb-4">// Trending</p>
                <div className="space-y-3">
                  {trending.map((tag, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-black text-orange-500">{tag}</span>
                      <span className="text-xs font-bold text-gray-300">{Math.floor(Math.random() * 50) + 10} posts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-2 tracking-tight">Join the Community</h3>
                  <p className="text-white/50 text-sm mb-5">Create a free account to post, like, and join challenges.</p>
                  <Link href="/signup" className="block w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full text-center text-sm transition-colors">
                    Get Started Free →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-3 md:px-4 lg:px-5 pb-5">
        <div className="max-w-[1600px] mx-auto"><Footer /></div>
      </div>
    </main>
  );
}
