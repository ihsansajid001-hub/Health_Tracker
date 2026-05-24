'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        supabase.from('user_profiles').select('username').eq('user_id', session.user.id).single()
          .then(({ data }) => { if (data?.username) setUsername(data.username); });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUser(session.user);
        supabase.from('user_profiles').select('username').eq('user_id', session.user.id).single()
          .then(({ data }) => { if (data?.username) setUsername(data.username); });
      } else { setUser(null); setUsername(''); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const links = [
    { label: 'Home',      href: '/' },
    { label: 'Articles',  href: '/articles' },
    { label: 'Plans',     href: '/plans' },
    { label: 'Community', href: '/community' },
    { label: 'About',     href: '/about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/40 group-hover:scale-110 transition-all duration-300">
              <span className="text-white font-black text-base">L</span>
            </div>
            <span className="text-xl font-black text-white tracking-tight group-hover:text-orange-300 transition-colors duration-300">
              LifeScore
            </span>
          </Link>

          {/* Center Nav */}
          <div className="flex items-center gap-0.5 bg-white/8 backdrop-blur-xl border border-white/15 rounded-full px-2 py-1.5 shadow-lg">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link key={l.href} href={l.href}
                  className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 select-none ${
                    isActive ? 'text-white bg-white/20' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}>
                  {l.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {user && username ? (
              <Link href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/12 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold rounded-full hover:bg-white/22 transition-all duration-300">
                <User size={14} />
                @{username}
              </Link>
            ) : (
              <>
                <Link href="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-white/75 hover:text-white transition-all duration-300">
                  Sign In
                </Link>
                <Link href="/signup"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
