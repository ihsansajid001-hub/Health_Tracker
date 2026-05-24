'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const inp = "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-900 text-sm font-medium transition-all";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [password, setPassword]         = useState('');
  const [confirm, setConfirm]           = useState('');
  const [loading, setLoading]           = useState(false);
  const [success, setSuccess]           = useState(false);
  const [error, setError]               = useState('');

  // Supabase sends the token in the URL hash — the client SDK handles it automatically
  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is now in password recovery mode — form is ready
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">

        <Link href="/" className="flex items-center gap-2 mb-12 w-fit group">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">LifeScore</span>
        </Link>

        <div className="card p-10">
          {!success ? (
            <>
              <p className="section-tag mb-3">// New Password</p>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Reset Password</h1>
              <p className="text-gray-400 text-sm mb-8">Enter your new password below.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">New Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Confirm Password</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} placeholder="••••••••" className={inp} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-gray-900 hover:bg-gray-700 text-white font-black rounded-full transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Updating…</> : 'Set New Password →'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} className="text-orange-500" />
              </div>
              <p className="section-tag mb-3 mx-auto w-fit">// Success</p>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Password Updated!</h2>
              <p className="text-gray-400 text-sm mb-8">Your password has been successfully reset. You can now sign in with your new password.</p>
              <Link href="/login" className="inline-flex items-center gap-3 px-7 py-3.5 bg-gray-900 hover:bg-gray-700 text-white font-black rounded-full transition-all shadow-lg hover:-translate-y-0.5">
                Sign In →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-orange-500 border-t-transparent animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
