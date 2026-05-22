'use client';

import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 lg:py-28 px-8 sm:px-12 lg:px-16 bg-blue-600 rounded-[40px] md:rounded-[56px] shadow-xl card-lift relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-40 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <p className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 border border-white/25 text-white rounded-full text-xs font-bold uppercase tracking-widest mb-8">
          // Available For You
        </p>

        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
          Ready to Transform
          <br />
          Your Wellness?
        </h2>

        <p className="text-lg text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of users already tracking their wellness with LifeScore. Start your journey today and discover insights that will help you live your best life.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-black rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:-translate-y-0.5 text-lg">
            Get Started Free
            <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
          <Link href="/about"
            className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all text-lg">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
