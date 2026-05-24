'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Users, Heart, MessageCircle, Award } from 'lucide-react';

/* ─── Count-up hook (fires once when element enters viewport) ── */
function useCountUp(target: number, duration = 1600, suffix = '') {
  const [display, setDisplay] = useState('0' + suffix);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Observe when the stat card enters the viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Run the animation once `started` flips to true
  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.round(eased * target);

      // Format: add K if the original had K
      if (suffix === 'K+') {
        setDisplay(current + 'K+');
      } else if (suffix === '%') {
        setDisplay(current + '%');
      } else {
        setDisplay(String(current));
      }

      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration, suffix]);

  return { display, ref };
}

/* ─── Individual stat card ───────────────────────────────────── */
function StatCard({
  target, suffix, label, icon: Icon, delay,
}: {
  target: number; suffix: string; label: string;
  icon: React.ElementType; delay: number;
}) {
  const { display, ref } = useCountUp(target, 1600 + delay * 100, suffix);

  return (
    <div
      ref={ref}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center card-lift"
    >
      <div className="w-12 h-12 bg-orange-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Icon size={22} className="text-orange-500" />
      </div>
      <div className="text-3xl font-black text-gray-900 dark:text-white mb-1 tabular-nums">
        {display}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

/* ─── Stats config ───────────────────────────────────────────── */
const STATS = [
  { target: 1,   suffix: 'K+', label: 'Active Members',  icon: Users,         delay: 0 },
  { target: 5,   suffix: 'K+', label: 'Goals Achieved',  icon: Award,         delay: 1 },
  { target: 10,  suffix: 'K+', label: 'Messages Shared', icon: MessageCircle, delay: 2 },
  { target: 98,  suffix: '%',  label: 'Feel Supported',  icon: Heart,         delay: 3 },
];

const features = [
  { icon: Users,         title: 'Supportive Community', desc: 'Connect with like-minded individuals on their wellness journey.' },
  { icon: Heart,         title: 'Share Your Progress',  desc: 'Celebrate milestones and inspire others with your achievements.' },
  { icon: MessageCircle, title: 'Get Support',           desc: 'Ask questions, share tips, and learn from the community.' },
  { icon: Award,         title: 'Challenges & Events',   desc: 'Participate in community challenges and wellness events.' },
];

export default function Community() {
  return (
    <section id="community" className="py-20 lg:py-28 px-8 sm:px-12 lg:px-16 bg-gray-50 dark:bg-gray-900 rounded-[40px] md:rounded-[56px] shadow-xl card-lift">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-tag mb-5 mx-auto w-fit">// Community</p>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white leading-[1.05]">
            Join Our Thriving
            <br />
            <span className="text-orange-500">Wellness Community</span>
          </h2>
        </div>

        {/* Stats row — each card runs its own count-up */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        {/* Features list */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-5 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <f.icon size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 dark:text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/community"
            className="inline-flex items-center gap-3 px-8 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/25 hover:-translate-y-0.5">
            Join the Community
            <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
