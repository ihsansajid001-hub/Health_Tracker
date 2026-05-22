'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';

/* ─── Image pool ─────────────────────────────────────────────── */
const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700&q=85', bg: '#dbeafe' },
  { src: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=700&q=85',    bg: '#ffedd5' },
  { src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=85', bg: '#fce7f3' },
  { src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700&q=85', bg: '#fef9c3' },
  { src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=700&q=85', bg: '#f3f4f6' },
  { src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&q=85', bg: '#ede9fe' },
  { src: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=700&q=85',    bg: '#d1fae5' },
  { src: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&q=85', bg: '#ffe4e6' },
  { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=85', bg: '#fef3c7' },
  { src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=700&q=85', bg: '#e2e8f0' },
  { src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=700&q=85',    bg: '#e0f2fe' },
  { src: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=700&q=85', bg: '#f3e8ff' },
  { src: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=700&q=85', bg: '#f1f5f9' },
];
const N = IMAGES.length;

/* ─────────────────────────────────────────────────────────────
  CAROUSEL LOGIC

  We keep exactly 5 card DOM nodes alive forever — they never
  unmount. Each node has a stable numeric `id` (0-4).

  `slots` maps slot-position → card-id.
  `cardImg` maps card-id → image-index.

  Every INTERVAL ms we:
  1. Shift every card one slot to the left.
  2. The card that was at slot 0 (far-left) moves to slot 4 (far-right).
  3. Before the shift we update that card's image to the next one
     in the pool — while it's still invisible at slot 0 (opacity 0),
     so the image swap is never seen.
  4. CSS `transition` on each card handles the smooth glide.

  Slot positions:
    0 = far-left   (opacity 0, off-screen)
    1 = near-left
    2 = CENTER      (largest, upright)
    3 = near-right
    4 = far-right   (opacity 0, off-screen)

  Visual config per slot:
─────────────────────────────────────────────────────────────── */

const SLOT_STYLE = [
  { x: -340, rot: -18, scale: 0.62, z: 1, opacity: 0   }, // 0 far-left  (hidden)
  { x: -175, rot: -11, scale: 0.78, z: 3, opacity: 1   }, // 1 near-left
  { x:    0, rot:   0, scale: 1.00, z: 5, opacity: 1   }, // 2 CENTER
  { x:  175, rot:  11, scale: 0.78, z: 3, opacity: 1   }, // 3 near-right
  { x:  340, rot:  18, scale: 0.62, z: 1, opacity: 0   }, // 4 far-right (hidden)
];

const BASE_W    = 200;
const BASE_H    = 280;
const INTERVAL  = 2600; // ms between steps
const TRANS_DUR = 900;  // ms CSS transition duration

/* ─── CardFan ────────────────────────────────────────────────── */
function CardFan() {
  // cardSlot[id] = which slot (0-4) card `id` is currently in
  const cardSlot = useRef<number[]>([0, 1, 2, 3, 4]);
  // cardImg[id]  = which image index card `id` is showing
  const cardImg  = useRef<number[]>([0, 1, 2, 3, 4]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // nextImg = the image index to assign to the recycled card
  const nextImg  = useRef<number>(5 % N);

  const applyCard = (id: number) => {
    const el = cardRefs.current[id];
    if (!el) return;
    const slot = cardSlot.current[id];
    const s    = SLOT_STYLE[slot];
    el.style.transform  = `translateX(${s.x}px) rotate(${s.rot}deg) scale(${s.scale})`;
    el.style.zIndex     = String(s.z);
    el.style.opacity    = String(s.opacity);
  };

  useEffect(() => {
    // Apply initial positions immediately (no transition yet)
    cardRefs.current.forEach((el, id) => {
      if (!el) return;
      el.style.transition = 'none';
      applyCard(id);
    });

    // Small delay then enable transitions
    const initTimer = setTimeout(() => {
      cardRefs.current.forEach(el => {
        if (el) el.style.transition =
          `transform ${TRANS_DUR}ms cubic-bezier(0.25,0.1,0.25,1), opacity ${TRANS_DUR}ms cubic-bezier(0.25,0.1,0.25,1)`;
      });
    }, 50);

    const tick = setInterval(() => {
      // Find which card is currently at slot 0 (far-left, hidden)
      const exitId = cardSlot.current.indexOf(0);

      // Step 1: While that card is invisible (slot 0, opacity 0),
      //         swap its image to the next one in the pool.
      const el = cardRefs.current[exitId];
      if (el) {
        const img = IMAGES[nextImg.current];
        el.style.backgroundColor = img.bg;
        // Update the <img> src directly — no React re-render
        const imgEl = el.querySelector('img') as HTMLImageElement | null;
        if (imgEl) {
          imgEl.src = img.src;
          imgEl.srcset = '';
        }
        cardImg.current[exitId] = nextImg.current;
        nextImg.current = (nextImg.current + 1) % N;
      }

      // Step 2: Move every card one slot to the left (wrapping 0 → 4)
      for (let id = 0; id < 5; id++) {
        cardSlot.current[id] = (cardSlot.current[id] - 1 + 5) % 5;
        applyCard(id);
      }
    }, INTERVAL);

    return () => {
      clearTimeout(initTimer);
      clearInterval(tick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative mx-auto"
      style={{ height: BASE_H + 80, width: '100%', maxWidth: 920 }}
    >
      {[0, 1, 2, 3, 4].map(id => {
        const slot = cardSlot.current[id];
        const s    = SLOT_STYLE[slot];
        const img  = IMAGES[cardImg.current[id]];

        return (
          <div
            key={id}
            ref={el => { cardRefs.current[id] = el; }}
            className="absolute top-1/2 left-1/2 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              width:           BASE_W,
              height:          BASE_H,
              marginLeft:      -BASE_W / 2,
              marginTop:       -BASE_H / 2,
              backgroundColor: img.bg,
              transform:       `translateX(${s.x}px) rotate(${s.rot}deg) scale(${s.scale})`,
              zIndex:          s.z,
              opacity:         s.opacity,
              willChange:      'transform, opacity',
            }}
          >
            <Image
              src={img.src}
              alt=""
              fill
              className="object-cover"
              sizes="200px"
              priority={id === 2}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────── */
function TopNav({ user, username }: { user: any; username: string }) {
  const links = [
    { label: 'Home',      href: '/' },
    { label: 'Articles',  href: '/articles' },
    { label: 'Plans',     href: '/plans' },
    { label: 'Community', href: '/community' },
    { label: 'About',     href: '/about' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 h-20">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
          <span className="text-white font-black text-sm">L</span>
        </div>
        <span className="text-xl font-black text-gray-900 tracking-tight">LifeScore</span>
      </Link>

      {/* Center nav links */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className="
              px-4 py-2 text-sm font-semibold text-gray-500
              hover:text-gray-900 rounded-full
              transition-all duration-300
              hover:bg-orange-100
              hover:shadow-[0_4px_16px_rgba(251,146,60,0.4)]
            "
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* CTA */}
      {user && username ? (
        <Link href="/dashboard"
          className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5">
          Dashboard
        </Link>
      ) : (
        <Link href="/signup"
          className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5">
          Get Started
        </Link>
      )}
    </header>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
export default function Hero() {
  const [user, setUser]         = useState<any>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('user_profiles').select('username').eq('user_id', user.id).single();
        if (profile?.username) setUsername(profile.username);
      }
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUser(session.user);
        supabase.from('user_profiles').select('username').eq('user_id', session.user.id).single()
          .then(({ data }) => { if (data?.username) setUsername(data.username); });
      } else { setUser(null); setUsername(''); }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      <TopNav user={user} username={username} />

      <div className="flex-1 flex flex-col items-center justify-start pt-24 pb-10 px-4">

        {/* Static headline */}
        <div className="text-center w-full max-w-6xl mx-auto">
          <h1
            className="leading-none text-gray-900 select-none"
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(3.2rem, 9.5vw, 8.5rem)',
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Your complete
            <br />
            <em style={{ fontStyle: 'italic', fontWeight: 700 }}>wellness journey</em>
          </h1>
        </div>

        {/* Card fan */}
        <div className="relative w-full mt-6 mb-2">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span
              className="font-black text-gray-100 tracking-widest whitespace-nowrap"
              style={{ fontSize: 'clamp(5rem, 16vw, 13rem)', letterSpacing: '0.12em' }}
            >
              LIFESCORE
            </span>
          </div>
          <CardFan />
        </div>

        {/* Static subtitle */}
        <p className="text-center text-gray-500 text-lg md:text-xl max-w-md mx-auto leading-relaxed mt-2">
          The AI-powered platform that unifies mental health,
          fitness, nutrition, sleep &amp; hydration in one score.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4 mt-8">
          {user ? (
            <Link href="/dashboard"
              className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-700 transition-colors shadow-lg text-sm">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/signup"
                className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-700 transition-colors shadow-lg text-sm">
                Get Started Free →
              </Link>
              <Link href="/about"
                className="px-6 py-3.5 text-gray-500 hover:text-gray-900 font-semibold transition-colors text-sm">
                Learn more
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Bottom social proof */}
      <div className="border-t border-gray-100 px-8 md:px-14 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {IMAGES.slice(0, 4).map((img, i) => (
              <div key={i} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden" style={{ backgroundColor: img.bg }}>
                <Image src={img.src} alt="" width={36} height={36} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
          <div>
            <span className="font-black text-gray-900 text-sm">Loved by 500+</span>
            <span className="text-gray-400 text-sm ml-1">wellness users</span>
          </div>
        </div>

        <div className="flex items-center gap-8 text-center">
          {[
            { value: '98%',  label: 'Satisfaction' },
            { value: '5',    label: 'Health Pillars' },
            { value: '24/7', label: 'AI Insights' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="hidden md:flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gray-300" />
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
