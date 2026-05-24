'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 py-16 px-8 sm:px-12 lg:px-16 rounded-[40px] md:rounded-[56px] shadow-xl">
      <div className="max-w-7xl mx-auto">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg">L</span>
              </div>
              <span className="text-2xl font-black text-white">LifeScore</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md mb-7 text-sm">
              Your comprehensive wellness companion. Track mental health, fitness, nutrition, sleep, and hydration all in one place with AI-powered insights.
            </p>
            {/* Email subscribe */}
            <div className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:outline-none focus:border-orange-500 text-sm"
              />
              <button className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm">
                Subscribe
              </button>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Pages</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Home', href: '/' },
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Articles', href: '/articles' },
                { label: 'Plans', href: '/plans' },
                { label: 'About', href: '/about' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Follow Us</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Twitter / X', href: '#' },
                { label: 'Instagram', href: '#' },
                { label: 'Facebook', href: '#' },
                { label: 'YouTube', href: '#' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-sm text-gray-500">
              <p>contact@lifescore.app</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-gray-500">© LifeScore 2025. All rights reserved.</p>
          <div className="flex gap-6 text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors text-xs font-bold">
            ↑ Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
