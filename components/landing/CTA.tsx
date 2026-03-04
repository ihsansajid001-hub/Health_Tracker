'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500 to-primary-700">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full mb-6">
          <Sparkles size={16} className="text-white" />
          <span className="text-sm font-medium text-white">
            100% Free • No Credit Card Required
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Life?
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Join thousands of people who are already optimizing their wellness with PeaceHub.
          Start your journey today—completely free!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group px-8 py-4 bg-white text-primary-700 rounded-full font-semibold hover:shadow-2xl transform hover:scale-105 transition-all flex items-center space-x-2"
          >
            <span>Get Started Free</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-transparent text-white rounded-full font-semibold border-2 border-white hover:bg-white hover:text-primary-700 transition-all"
          >
            Sign In
          </Link>
        </div>

        <p className="text-white/80 text-sm mt-6">
          No credit card required • Free forever • Cancel anytime
        </p>
      </div>
    </section>
  );
}
