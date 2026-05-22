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
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('user_profiles').select('username').eq('user_id', user.id).single();
        if (profile?.username) setUsername(profile.username);
      }
    };
    checkUser();

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
    { label: 'Home', href: '/', emoji: '🏠' },
    { label: 'Articles', href: '/articles', emoji: '📖' },
    { label: 'Plans', href: '/plans', emoji: '✨' },
    { label: 'Community', href: '/community', emoji: '🤝' },
    { label: 'About', href: '/about', emoji: '💡' },
  ];

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(6px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 12px rgba(139,92,246,0.4), 0 0 24px rgba(59,130,246,0.2); }
          50% { box-shadow: 0 0 20px rgba(139,92,246,0.7), 0 0 40px rgba(59,130,246,0.4); }
        }
        .nav-link-item {
          position: relative;
          overflow: hidden;
        }
        .nav-link-item::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%);
          background-size: 200% auto;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 9999px;
        }
        .nav-link-item:hover::before {
          opacity: 1;
          animation: shimmer 1.5s linear infinite;
        }
        .nav-link-item .nav-underline {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 60%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          border-radius: 9999px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .nav-link-item:hover .nav-underline {
          transform: translateX(-50%) scaleX(1);
        }
        .nav-link-item .nav-emoji {
          display: inline-block;
          opacity: 0;
          transform: translateY(-8px) scale(0.5);
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%) translateY(-8px) scale(0.5);
          font-size: 10px;
          pointer-events: none;
        }
        .nav-link-item:hover .nav-emoji {
          opacity: 1;
          transform: translateX(-50%) translateY(-14px) scale(1);
        }
        .nav-link-item .nav-label {
          transition: transform 0.2s ease;
          display: block;
        }
        .nav-link-item:hover .nav-label {
          transform: translateY(-1px);
        }
        .nav-active-dot {
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 9999px;
          box-shadow: 0 0 6px rgba(255,255,255,0.8);
        }
        .center-nav-pill {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .center-nav-pill:hover {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20'
          : 'bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:scale-110 group-hover:shadow-blue-500/60 transition-all duration-300">
                <span className="text-white font-black text-base">L</span>
              </div>
              <span className="text-xl font-black text-white tracking-tight group-hover:text-blue-200 transition-colors duration-300">
                LifeScore
              </span>
            </Link>

            {/* Center Nav Links */}
            <div className="center-nav-pill flex items-center gap-0.5 bg-white/8 backdrop-blur-xl border border-white/15 rounded-full px-2 py-1.5 shadow-lg shadow-black/20">
              {links.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onMouseEnter={() => setHoveredLink(l.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`nav-link-item relative px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 select-none ${
                      isActive
                        ? 'text-white bg-white/20 shadow-inner'
                        : hoveredLink === l.href
                        ? 'text-white bg-white/12'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span className="nav-emoji">{l.emoji}</span>
                    <span className="nav-label">{l.label}</span>
                    <span className="nav-underline" />
                    {isActive && <span className="nav-active-dot" />}
                  </Link>
                );
              })}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {user && username ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/12 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold rounded-full hover:bg-white/22 hover:border-white/35 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 group"
                >
                  <User size={14} className="group-hover:scale-110 transition-transform" />
                  @{username}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-sm font-semibold text-white/75 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="relative px-5 py-2.5 bg-white text-gray-900 text-sm font-bold rounded-full overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-white/25 hover:scale-105"
                  >
                    <span className="relative z-10 group-hover:text-blue-700 transition-colors duration-300">
                      Get Started
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}
