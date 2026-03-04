'use client';

import Link from 'next/link';
import { Moon, Dumbbell, Apple, Brain, Droplet, Plus } from 'lucide-react';

const actions = [
  { name: 'Log Sleep', href: '/dashboard/sleep', icon: Moon, color: 'from-purple-500 to-purple-700' },
  { name: 'Log Workout', href: '/dashboard/fitness', icon: Dumbbell, color: 'from-red-500 to-red-700' },
  { name: 'Log Meal', href: '/dashboard/nutrition', icon: Apple, color: 'from-green-500 to-green-700' },
  { name: 'Log Mood', href: '/dashboard/mind', icon: Brain, color: 'from-blue-500 to-blue-700' },
  { name: 'Log Water', href: '/dashboard/hydration', icon: Droplet, color: 'from-cyan-500 to-cyan-700' },
];

export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon size={24} className="text-white" />
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {action.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
