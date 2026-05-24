'use client';

import Link from 'next/link';
import { Moon, Dumbbell, Apple, Brain, Droplet } from 'lucide-react';

const actions = [
  { name: 'Log Sleep',   href: '/dashboard/sleep',     icon: Moon,    bg: 'bg-orange-50',  text: 'text-orange-500' },
  { name: 'Log Workout', href: '/dashboard/fitness',   icon: Dumbbell, bg: 'bg-gray-900',  text: 'text-white' },
  { name: 'Log Meal',    href: '/dashboard/nutrition', icon: Apple,   bg: 'bg-orange-100', text: 'text-orange-600' },
  { name: 'Log Mood',    href: '/dashboard/mind',      icon: Brain,   bg: 'bg-orange-500', text: 'text-white' },
  { name: 'Log Water',   href: '/dashboard/hydration', icon: Droplet, bg: 'bg-orange-50',  text: 'text-orange-400' },
];

export default function QuickActions() {
  return (
    <div className="card p-6">
      <p className="section-tag mb-1">// Actions</p>
      <h3 className="text-xl font-black text-gray-900 mb-5">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(a => (
          <Link key={a.name} href={a.href}
            className={`group flex items-center gap-3 p-4 ${a.bg} rounded-2xl hover:opacity-90 transition-all`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${a.bg === 'bg-gray-900' ? 'bg-white/10' : 'bg-white/60'}`}>
              <a.icon size={16} className={a.text} />
            </div>
            <span className={`text-xs font-black ${a.bg === 'bg-gray-900' || a.bg === 'bg-orange-500' ? 'text-white' : 'text-gray-700'}`}>
              {a.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
