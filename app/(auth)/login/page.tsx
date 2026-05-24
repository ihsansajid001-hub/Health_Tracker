'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const IMGS = [
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
];

const inp = "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-900 text-sm font-medium transition-all";

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        await new Promise(r => setTimeout(r, 500));
        const { data: profile, error: pe } = await supabase.from('user_profiles').select('id').eq('user_id', data.user.id).single();
        window.location.replace(!profile || pe ? '/onboarding' : '/dashboard');
      }
    } catch (err: any) { setError(err.message || 'Failed to login'); setLoading(false); }
  };

  const handleGoogle = async () => {
    try {
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } });
      if (error) throw error;
    } catch (err: any) { setError(err.message || 'Failed to login with Google'); }
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* ── Left: image collage ── */}
      <div className="hidden lg:block lg:w-[52%] relative overflow-hidden bg-gray-100">
        <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4">
          {IMGS.map((src, i) => (
            <div key={i} className={`rounded-2xl overflow-hidden ${i % 2 === 1 ? 'mt-10' : ''}`}>
              <Image src={src} alt="" width={500} height={600} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
        {/* Bottom copy */}
        <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
          <p className="section-tag text-white/50 mb-3">// LifeScore</p>
          <h2 className="text-4xl font-black leading-tight mb-3 tracking-tight">
            Your Complete
            <br />Wellness Journey
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Track mental health, fitness, nutrition, sleep & hydration — all in one place.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {IMGS.slice(0, 3).map((src, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                  <Image src={src} alt="" width={32} height={32} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
            <span className="text-sm text-white/70 font-semibold">Loved by 1,000+ users</span>
          </div>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-12 w-fit group">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">LifeScore</span>
          </Link>

          <p className="section-tag mb-3">// Sign In</p>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm mb-8">Enter your credentials to continue.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className={inp} />
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-orange-500" />
                <span className="text-sm text-gray-500">Keep me signed in</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-gray-900 hover:bg-gray-700 text-white font-black rounded-full transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-3 mt-2">
              {loading ? (
                <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in…</>
              ) : <>Sign In →</>}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center"><span className="px-4 bg-white text-xs font-bold text-gray-300 uppercase tracking-widest">or</span></div>
          </div>

          <button type="button" onClick={handleGoogle}
            className="w-full py-3.5 border border-gray-200 rounded-full font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-3 text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-400">
            No account?{' '}
            <Link href="/signup" className="font-black text-gray-900 hover:text-orange-500 transition-colors">Sign up free</Link>
          </p>
          <div className="mt-3 text-center">
            <Link href="/" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
