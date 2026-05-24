'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Moon as SleepIcon, Dumbbell, Apple, Brain,
  Droplet, BarChart3, Settings, LogOut, Menu, X, Home, Search, Bell,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const NAV = [
  { name: 'Dashboard',  href: '/dashboard',            icon: LayoutDashboard },
  { name: 'Sleep',      href: '/dashboard/sleep',       icon: SleepIcon },
  { name: 'Fitness',    href: '/dashboard/fitness',     icon: Dumbbell },
  { name: 'Nutrition',  href: '/dashboard/nutrition',   icon: Apple },
  { name: 'Mind',       href: '/dashboard/mind',        icon: Brain },
  { name: 'Hydration',  href: '/dashboard/hydration',   icon: Droplet },
  { name: 'Analytics',  href: '/dashboard/analytics',   icon: BarChart3 },
  { name: 'Settings',   href: '/dashboard/settings',    icon: Settings },
  { name: 'Home',       href: '/',                      icon: Home },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const [open, setOpen]       = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from('user_profiles').select('username').eq('user_id', user.id).single()
        .then(({ data }) => setProfile({
          username: data?.username || user.email?.split('@')[0] || 'User',
          email: user.email,
        }));
    });
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F5F5F0]">
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-56 bg-[#1A1A1A] flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-black font-black text-sm">L</span>
            </div>
            <span className="text-lg font-black text-white tracking-tight">LifeScore</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Nav — all items in one continuous list, no separators */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-6">
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                  active
                    ? 'bg-white text-black font-black'
                    : 'text-gray-400 hover:bg-white/8 hover:text-white'
                }`}>
                <item.icon size={16} className={active ? 'text-black' : ''} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User card at bottom */}
        {profile && (
          <Link href="/profile"
            className="mx-3 mb-4 flex items-center gap-3 p-3 bg-white/8 rounded-2xl hover:bg-white/12 transition-colors">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-black font-black text-sm">{profile.username?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-white truncate">{profile.username}</p>
              <p className="text-xs text-gray-500 truncate">{profile.email}</p>
            </div>
          </Link>
        )}
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#F5F5F0]/90 backdrop-blur-md px-6 py-4">
          <div className="flex items-center justify-between gap-4">

            <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-xl bg-white text-gray-600 shadow-sm">
              <Menu size={18} />
            </button>

            {/* User info */}
            <Link href="/profile" className="hidden md:flex items-center gap-3 bg-white rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-black font-black text-sm">{profile?.username?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900 leading-tight">{profile?.username || 'User'}</p>
                <p className="text-xs text-gray-400 truncate max-w-[140px]">{profile?.email}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xs hidden md:block">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white rounded-2xl text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] font-medium"
                />
              </div>
            </div>

            {/* Notification */}
            <button className="relative w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-gray-600">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full text-[9px] font-black text-black flex items-center justify-center">2</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-6 pb-8">{children}</main>
      </div>
    </div>
  );
}
