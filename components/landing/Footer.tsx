'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-8 sm:px-12 lg:px-16 rounded-[32px] md:rounded-[48px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-white">LifeScore</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md mb-6">
              Your comprehensive wellness companion. Track mental health, fitness, nutrition, sleep, and hydration all in one place with AI-powered insights.
            </p>
            
            {/* Email Signup */}
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/onboarding" className="hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Features</h3>
            <ul className="space-y-4">
              <li><Link href="/dashboard/mind" className="hover:text-white transition-colors">Mental Health</Link></li>
              <li><Link href="/dashboard/fitness" className="hover:text-white transition-colors">Fitness Tracking</Link></li>
              <li><Link href="/dashboard/nutrition" className="hover:text-white transition-colors">Nutrition</Link></li>
              <li><Link href="/dashboard/sleep" className="hover:text-white transition-colors">Sleep & Hydration</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            Copyright © LifeScore 2024. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
          >
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
