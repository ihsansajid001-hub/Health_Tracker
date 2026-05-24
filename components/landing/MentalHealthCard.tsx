'use client';

import Link from 'next/link';

export default function MentalHealthCard() {
  return (
    <section className="py-20 lg:py-28 px-8 sm:px-12 lg:px-16 bg-gray-50 dark:bg-gray-900 rounded-[40px] md:rounded-[56px] shadow-xl card-lift">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left – media ── */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl bg-gray-900">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
              >
                <source src="https://videos.pexels.com/video-files/7414975/7414975-uhd_2732_1440_24fps.mp4" type="video/mp4" />
                <source src="https://videos.pexels.com/video-files/7414975/7414975-hd_1920_1080_24fps.mp4" type="video/mp4" />
                <source src="https://videos.pexels.com/video-files/7414975/7414975-sd_640_360_24fps.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Floating tag */}
            <div className="absolute top-6 left-6 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Daily Tracking</p>
            </div>

            {/* Floating CTA pills */}
            <div className="absolute bottom-6 left-6 flex gap-3">
              <Link href="/signup"
                className="px-5 py-2.5 bg-white text-gray-900 rounded-full font-bold shadow-lg hover:bg-gray-50 transition-colors text-sm">
                Get Started
              </Link>
              <Link href="/signup"
                className="px-5 py-2.5 bg-orange-500 text-white rounded-full font-bold shadow-lg hover:bg-orange-600 transition-colors text-sm">
                Start Free
              </Link>
            </div>
          </div>

          {/* ── Right – copy ── */}
          <div className="space-y-8">
            <p className="section-tag">// About LifeScore</p>

            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white leading-[1.05]">
              Track Your
              <br />
              Complete
              <br />
              <span className="text-orange-500">Life Score</span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
              LifeScore is your comprehensive wellness companion. Monitor mental health, physical fitness, nutrition, sleep quality, and hydration — all in one place with AI-powered insights.
            </p>

            <Link href="/signup"
              className="inline-flex items-center gap-3 px-7 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:-translate-y-0.5">
              Explore Features
              <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            {/* Feature icons row */}
            <div className="grid grid-cols-3 gap-5 pt-4 border-t border-gray-200 dark:border-gray-700">
              {[
                { icon: '🤖', title: 'AI Insights', desc: 'Personalized recommendations from your data.' },
                { icon: '⚡', title: 'Real-time', desc: 'Monitor all wellness aspects live.' },
                { icon: '🔥', title: 'Streaks', desc: 'Build habits with streak tracking.' },
              ].map((f, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-orange-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
