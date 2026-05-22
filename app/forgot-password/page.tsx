'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const inp = "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-900 text-sm font-medium transition-all";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess(true);
    } catch (err: any) { setError(err.message || 'Failed to send reset email.'); setLoading(false); }
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
          <Link href="/login" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-300 hover:text-orange-500 transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Login
          </Link>

          {!success ? (
            <>
              <p className="section-tag mb-3">// Reset Password</p>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Forgot Password?</h1>
              <p className="text-gray-400 text-sm mb-8">Enter your email and we'll send you reset instructions.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className={inp} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-gray-900 hover:bg-gray-700 text-white font-black rounded-full transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending…</> : 'Send Reset Link →'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <p className="section-tag mb-3 mx-auto w-fit">// Success</p>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Reset Link Sent!</h2>
              <p className="text-gray-400 text-sm mb-2">
                If an account exists for <strong className="text-gray-700">{email}</strong>, you'll receive a link shortly.
              </p>
              <p className="text-xs text-gray-300 mb-8">
                No email? Try <Link href="/signup" className="font-black text-orange-500 hover:text-orange-600">signing up</Link> instead.
              </p>
              <Link href="/login" className="btn-dark">Back to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
