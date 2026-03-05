'use client';

import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 lg:py-32 px-8 sm:px-12 lg:px-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-[32px] md:rounded-[48px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.2),transparent_50%)]"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          Ready to Transform
          <br />
          Your Wellness Journey?
        </h2>
        
        <p className="text-lg sm:text-xl text-blue-50 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of users who are already tracking their wellness with LifeScore. Start your journey today and discover insights that will help you live your best life.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
          >
            <span>Get Started Free</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
