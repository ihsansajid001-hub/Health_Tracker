'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './Navbar';
import { supabase } from '@/lib/supabase/client';

export default function Hero() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Fetch username from profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.username) {
          setUsername(profile.username);
        }
      }
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Fetch username
        supabase
          .from('user_profiles')
          .select('username')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.username) setUsername(data.username);
          });
      } else {
        setUser(null);
        setUsername('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center overflow-hidden rounded-[32px] md:rounded-[48px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1920&q=80"
          alt="Hero Background"
          fill
          className="object-cover rounded-[32px] md:rounded-[48px]"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/60 via-blue-300/40 to-transparent rounded-[32px] md:rounded-[48px]"></div>
      </div>

      {/* Navbar inside */}
      <Navbar />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 lg:px-16 py-16 flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-start w-full pt-24">
          {/* Left Side */}
          <div className="space-y-8 pt-12">
            {/* Community Badge */}
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-3 rounded-3xl border border-white/30 shadow-lg max-w-xs">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full bg-gray-300 border-2 border-white"></div>
                <div className="w-9 h-9 rounded-full bg-gray-300 border-2 border-white"></div>
                <div className="w-9 h-9 rounded-full bg-gray-300 border-2 border-white"></div>
                <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1K+</span>
                </div>
              </div>
              <div className="text-white">
                <div className="text-sm font-semibold leading-tight">Join our wellness community</div>
                <div className="text-xs opacity-90">Track your life score today</div>
              </div>
            </div>

            {/* Main Heading in White Card */}
            <div className="bg-white rounded-[32px] p-10 lg:p-12 shadow-2xl max-w-lg">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Complete Wellness Journey
              </h1>
            </div>

            {/* Action Button */}
            <div>
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-2xl transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Go to Dashboard</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-2xl transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Get Started</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Right Side - Info Card */}
          <div className="flex justify-end items-start pt-32 lg:pt-48">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-sm">
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                Track your mental health, fitness, nutrition, sleep, and hydration all in one place with AI-powered insights.
              </p>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Dashboard
                </Link>
                <Link
                  href="/onboarding"
                  className="w-full px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative circles on the image */}
      <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-white/30 rounded-full blur-sm z-5"></div>
      <div className="absolute top-2/3 left-1/2 w-12 h-12 bg-white/40 rounded-full blur-sm z-5"></div>
    </section>
  );
}
