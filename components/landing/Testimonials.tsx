'use client';

import { useState } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    quote: "LifeScore transformed how I approach my wellness. The AI insights helped me identify patterns I never noticed, and my overall life score has improved by 40% in just 3 months!",
    name: 'Sarah M.',
    role: 'Software Engineer',
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    rating: 5,
  },
  {
    quote: "Finally, a platform that tracks everything in one place. The streak feature keeps me motivated, and the personalized recommendations actually work for my lifestyle.",
    name: 'James K.',
    role: 'Fitness Enthusiast',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    rating: 5,
  },
  {
    quote: "As a founder, finding the right wellness tool was a challenge until I discovered LifeScore. They quickly helped me build better habits and delivered real results.",
    name: 'Priya R.',
    role: 'Startup Founder',
    location: 'Dubai, UAE',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-20 lg:py-28 px-8 sm:px-12 lg:px-16 bg-gray-50 dark:bg-gray-900 rounded-[40px] md:rounded-[56px] shadow-xl card-lift">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="section-tag mb-5">// Testimonials</p>
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white leading-[1.05]">
              Trusted by
              <br />
              Wellness Seekers
            </h2>
          </div>
          {/* Avatar stack */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {testimonials.map((t, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden">
                  <Image src={t.avatar} alt={t.name} width={40} height={40} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">1,000+ Users</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Loved worldwide</div>
            </div>
          </div>
        </div>

        {/* Testimonial card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 lg:p-14 shadow-xl">
          {/* Stars */}
          <div className="flex gap-1 mb-8">
            {[...Array(testimonials[current].rating)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <p className="text-2xl lg:text-3xl font-medium text-gray-900 dark:text-white leading-relaxed mb-10">
            "{testimonials[current].quote}"
          </p>

          <div className="flex items-center justify-between flex-wrap gap-6">
            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-100 dark:border-blue-900">
                <Image src={testimonials[current].avatar} alt={testimonials[current].name} width={56} height={56} className="object-cover w-full h-full" />
              </div>
              <div>
                <div className="font-black text-gray-900 dark:text-white">{testimonials[current].name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{testimonials[current].role} · {testimonials[current].location}</div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrent(p => p === 0 ? testimonials.length - 1 : p - 1)}
                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 flex items-center justify-center transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                {current + 1} / {testimonials.length}
              </span>
              <button
                onClick={() => setCurrent(p => p === testimonials.length - 1 ? 0 : p + 1)}
                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 flex items-center justify-center transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
