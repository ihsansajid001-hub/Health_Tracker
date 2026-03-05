'use client';

import { useState } from 'react';

const testimonials = [
  {
    quote: "LifeScore transformed how I approach my wellness. The AI insights helped me identify patterns I never noticed, and my overall life score has improved by 40% in just 3 months!",
    name: "Sarah M.",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
  },
  {
    quote: "Finally, a platform that tracks everything in one place. The streak feature keeps me motivated, and the personalized recommendations actually work!",
    name: "James K.",
    role: "Fitness Enthusiast",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="py-20 lg:py-32 px-8 sm:px-12 lg:px-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-[32px] md:rounded-[48px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(147,197,253,0.3),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(196,181,253,0.3),transparent_50%)]"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold mb-8">
            <span># Testimonials</span>
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white rounded-3xl p-12 shadow-xl">
          <div className="text-center mb-8">
            <p className="text-2xl lg:text-3xl text-gray-900 leading-relaxed font-medium mb-8">
              "{testimonials[currentIndex].quote}"
            </p>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-center gap-4">
            <div 
              className="w-16 h-16 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${testimonials[currentIndex].avatar})` }}
            ></div>
            <div className="text-left">
              <div className="font-bold text-gray-900">{testimonials[currentIndex].name}</div>
              <div className="text-sm text-gray-600">{testimonials[currentIndex].role}</div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrentIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
