'use client';

import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'Mental Health',
    tag: 'Mind',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    href: '/dashboard/mind',
  },
  {
    title: 'Physical Fitness',
    tag: 'Fitness',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    href: '/dashboard/fitness',
  },
  {
    title: 'Nutrition & Sleep',
    tag: 'Nutrition',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    href: '/dashboard/nutrition',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 px-8 sm:px-12 lg:px-16 bg-white dark:bg-gray-950 rounded-[40px] md:rounded-[56px] shadow-xl card-lift">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="section-tag mb-5">// Featured Work</p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.05]">
              Every Type of
              <br />
              Health Tracking
            </h2>
          </div>
          <Link href="/signup"
            className="inline-flex items-center gap-3 px-7 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-0.5 self-start md:self-auto whitespace-nowrap">
            + Become a Member
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image */}
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Tag top-left */}
              <div className="absolute top-5 left-5 bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {feature.tag}
              </div>

              {/* Arrow badge top-right */}
              <div className="absolute top-5 right-5 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-500">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Title bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <h3 className="text-3xl font-black text-white leading-tight">{feature.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
