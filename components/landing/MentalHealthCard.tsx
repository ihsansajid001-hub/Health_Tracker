'use client';

import Link from 'next/link';

export default function MentalHealthCard() {
  return (
    <section className="py-20 lg:py-32 px-8 sm:px-12 lg:px-16 bg-gray-50 rounded-[32px] md:rounded-[48px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80)' }}
              ></div>
            </div>
            
            {/* Floating Badges */}
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <p className="text-sm font-semibold text-gray-700">Daily Tracking</p>
            </div>
            
            <div className="absolute bottom-6 left-6 flex gap-3">
              <Link href="/dashboard" className="px-5 py-2.5 bg-white text-gray-900 rounded-full font-semibold shadow-lg hover:bg-gray-50 transition-colors text-sm">
                View Dashboard
              </Link>
              <Link href="/onboarding" className="px-5 py-2.5 bg-gray-900 text-white rounded-full font-semibold shadow-lg hover:bg-gray-800 transition-colors text-sm">
                Start Now
              </Link>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Track Your Complete
                <br />
                Life Score
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                LifeScore is your comprehensive wellness companion. Monitor your mental health, physical fitness, nutrition, sleep quality, and hydration levels. Get AI-powered insights and personalized recommendations to improve your overall well-being.
              </p>
              
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                <span>Explore Features</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">AI Insights</h3>
                <p className="text-xs text-gray-600">Get personalized recommendations based on your data.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Real-time Tracking</h3>
                <p className="text-xs text-gray-600">Monitor all aspects of your wellness in real-time.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Daily Streaks</h3>
                <p className="text-xs text-gray-600">Build healthy habits with streak tracking and rewards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
