'use client';

import { useEffect, useRef } from 'react';
import Hero from './Hero';
import MentalHealthCard from './MentalHealthCard';
import Features from './Features';
import DashboardPreview from './DashboardPreview';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import Community from './Community';
import CTA from './CTA';
import Footer from './Footer';

// Only these sections get the sticky scroll-stack effect
const STACK_SECTIONS = [
  { id: 'about',        Component: MentalHealthCard },
  { id: 'features',     Component: Features },
  { id: 'services',     Component: DashboardPreview },
  { id: 'process',      Component: HowItWorks },
  { id: 'testimonials', Component: Testimonials },
  { id: 'community',    Component: Community },
  { id: 'cta',          Component: CTA },
];

export default function StickyLanding() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onScroll = () => {
      cardRefs.current.forEach((card) => {
        if (!card) return;

        const sticky = card.parentElement as HTMLElement;
        if (!sticky) return;

        const stickyTop    = sticky.getBoundingClientRect().top;
        const stickyHeight = sticky.offsetHeight;
        const scrolledPast = -stickyTop;

        if (scrolledPast <= 0) {
          card.style.transform    = '';
          card.style.borderRadius = '';
          return;
        }

        const progress    = Math.min(scrolledPast / stickyHeight, 1);
        const scale       = 1 - progress * 0.15;
        const translateY  = -progress * 60;
        const borderRadius = progress * 24;

        card.style.transform      = `scale(${scale}) translateY(${translateY}px)`;
        card.style.transformOrigin = 'top center';
        card.style.borderRadius   = `${borderRadius}px`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="bg-white dark:bg-gray-950">

      {/* ── Hero: normal scroll, no stack effect ── */}
      <div className="px-3 md:px-4 lg:px-5 pt-3 md:pt-4 lg:pt-5">
        <div className="max-w-[1600px] mx-auto">
          <Hero />
        </div>
      </div>

      {/* ── Stacked sections ── */}
      <div ref={wrapperRef}>
        {STACK_SECTIONS.map(({ id, Component }, index) => (
          <div
            key={id}
            className="relative"
            style={{
              minHeight: index < STACK_SECTIONS.length - 1 ? '130vh' : '100vh',
              zIndex: 10 + index,
            }}
          >
            <div
              className="sticky top-0 overflow-hidden"
              style={{ zIndex: 10 + index }}
            >
              <div
                ref={el => { cardRefs.current[index] = el; }}
                className="will-change-transform"
                style={{ transition: 'transform 0.05s linear' }}
              >
                <div className="px-3 md:px-4 lg:px-5 pt-3 md:pt-4 lg:pt-5">
                  <div className="max-w-[1600px] mx-auto">
                    <Component />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer: normal, outside the stack ── */}
      <div className="relative" style={{ zIndex: 10 + STACK_SECTIONS.length }}>
        <div className="px-3 md:px-4 lg:px-5 pb-5">
          <div className="max-w-[1600px] mx-auto">
            <Footer />
          </div>
        </div>
      </div>

    </main>
  );
}
