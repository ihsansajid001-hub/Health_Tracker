'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, Clock } from 'lucide-react';
import Footer from '@/components/landing/Footer';

const inp = "w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-900 text-sm font-medium transition-all";

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // In production, connect to an email service (Resend, SendGrid, etc.)
      // For now, simulate a successful send
      await new Promise(r => setTimeout(r, 800));
      setSent(true);
    } catch {
      setError('Failed to send message. Please email us directly at support@lifescore.app');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">

      <header className="flex items-center justify-between px-8 md:px-14 h-20 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">LifeScore</span>
        </Link>
        <Link href="/" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">← Back to Home</Link>
      </header>

      {/* Hero */}
      <section className="px-8 md:px-14 py-20 md:py-28 max-w-7xl mx-auto">
        <p className="section-tag mb-5">// Contact</p>
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-6">
          Get in
          <br /><span className="text-orange-500">Touch</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-md">Have a question or feedback? We'd love to hear from you.</p>
      </section>

      {/* Contact grid */}
      <section className="px-8 md:px-14 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          {/* Form */}
          <div className="card p-8">
            <p className="section-tag mb-3">// Message Us</p>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-6">Send a Message</h2>

            {sent ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-6 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}
                {[
                  { label: 'Full Name',     type: 'text',  key: 'name',    placeholder: 'John Doe' },
                  { label: 'Email Address', type: 'email', key: 'email',   placeholder: 'john@example.com' },
                  { label: 'Subject',       type: 'text',  key: 'subject', placeholder: 'How can we help?' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{f.label}</label>
                    <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder} required className={inp} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5}
                    placeholder="Tell us more about your inquiry…" required className={`${inp} resize-none`} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-gray-900 hover:bg-gray-700 text-white font-black rounded-full transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending…</> : 'Send Message →'}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="card p-8">
              <p className="section-tag mb-3">// Info</p>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-6">Contact Information</h2>
              <div className="space-y-5">
                {[
                  { icon: Mail,         label: 'Email',      value: 'support@lifescore.app',          href: 'mailto:support@lifescore.app', accent: 'bg-orange-50 text-orange-500' },
                  { icon: MessageSquare, label: 'Support',   value: 'Use the form to send a message', href: null,                           accent: 'bg-gray-50 text-gray-500' },
                  { icon: Clock,        label: 'Response Time', value: 'Within 24 hours on business days', href: null,                      accent: 'bg-orange-50 text-orange-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-11 h-11 ${item.accent} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-sm mb-0.5">{item.label}</h3>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-orange-500 hover:text-orange-600 font-semibold transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-sm text-gray-400">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ CTA */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-3 tracking-tight">Looking for quick answers?</h3>
                <p className="text-white/50 text-sm mb-6">Check out our plans page for pricing and feature questions.</p>
                <Link href="/plans" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full text-sm transition-colors">
                  View Plans →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-3 md:px-4 lg:px-5 pb-5 bg-white">
        <div className="max-w-[1600px] mx-auto"><Footer /></div>
      </div>
    </main>
  );
}
