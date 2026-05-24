'use client';

import Link from 'next/link';

const services = [
  { num: '01', title: 'Sleep Tracking', desc: 'Monitor sleep quality, cycles, and patterns with smart analysis.', href: '/dashboard/sleep' },
  { num: '02', title: 'Fitness & Activity', desc: 'Log workouts, track steps, and measure physical performance.', href: '/dashboard/fitness' },
  { num: '03', title: 'Nutrition Logging', desc: 'Barcode scanning, meal planning, and macro tracking.', href: '/dashboard/nutrition' },
  { num: '04', title: 'Mental Wellness', desc: 'Mood tracking, CBT techniques, meditation, and journaling.', href: '/dashboard/mind' },
  { num: '05', title: 'Hydration Goals', desc: 'Smart reminders and weather-adjusted daily water targets.', href: '/dashboard/hydration' },
];

export default function DashboardPreview() {
  return (
    <section className="py-20 lg:py-28 px-8 sm:px-12 lg:px-16 bg-gray-50 dark:bg-gray-900 rounded-[40px] md:rounded-[56px] shadow-xl card-lift">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-16">
          <div>
            <p className="section-tag mb-5">// Creative Services</p>
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white leading-[1.05]">
              Everything You
              <br />
              Need to Thrive
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md lg:ml-auto">
            We built LifeScore around 5 core health pillars. From strategy to tracking, AI insights to community — we've got you covered.
          </p>
        </div>

        {/* Services list */}
        <div className="space-y-0 border-t border-gray-200 dark:border-gray-700">
          {services.map((s, i) => (
            <Link
              key={i}
              href={s.href}
              className="group flex items-center gap-6 py-7 border-b border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-blue-900/10 transition-colors px-4 -mx-4 rounded-2xl"
            >
              <span className="text-sm font-bold text-gray-400 dark:text-gray-500 w-8 flex-shrink-0">{s.num}</span>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 group-hover:bg-orange-500 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0">
                <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/25 hover:-translate-y-0.5">
            View Live Dashboard
            <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No credit card required · Free to start</p>
        </div>
      </div>
    </section>
  );
}
