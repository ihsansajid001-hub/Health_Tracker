'use client';

import Link from 'next/link';
import { Moon, Dumbbell, Apple, Brain, Droplet } from 'lucide-react';

const actions = [
  { name: 'Log Sleep',    href: '/dashboard/sleep',     icon: Moon,    color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-500' },
  { name: 'Log Workout',  href: '/dashboard/fitness',   icon: Dumbbell, color: 'bg-red-50 dark:bg-red-900/20 text-red-500' },
  { name: 'Log Meal',     href: '/dashboard/nutrition', icon: Apple,   color: 'bg-green-50 dark:bg-green-900/20 text-green-500' },
  { name: 'Log Mood',     href: '/dashboard/mind',      icon: Brain,   color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' },
  { name: 'Log Water',    href: '/dashboard/hydration', icon: Droplet, color: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-500' },
];

export default function QuickActions() {
  return (
    <div className="card p-6">
      <p className="section-tag mb-1">// Actions</p>
      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-5">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(a => (
          <Link key={a.name} href={a.href}
            className="group flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all">
            <div className={`w-9 h-9 ${a.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <a.icon size={16} />
            </div>
            <span className="text-sm font-black text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              {a.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
