import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/landing/Footer';

const stats = [
  { value: '1K+',  label: 'Active Users' },
  { value: '98%',  label: 'Satisfaction' },
  { value: '5',    label: 'Health Pillars' },
  { value: '2025', label: 'Founded' },
];

const team = [
  { name: 'Alex Chen',   role: 'Founder & CEO',    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Sarah Kim',   role: 'Head of Design',   img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name: 'Marcus Lee',  role: 'Lead Engineer',    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Minimal top nav ── */}
      <header className="flex items-center justify-between px-8 md:px-14 h-20 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">LifeScore</span>
        </Link>
        <Link href="/" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">← Back to Home</Link>
      </header>

      {/* ── Hero ── */}
      <section className="px-8 md:px-14 py-20 md:py-28 max-w-7xl mx-auto">
        <p className="section-tag mb-5">// About Us</p>
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-8">
          We Build the
          <br />Future of
          <br /><span className="text-orange-500">Wellness</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
          LifeScore is a comprehensive wellness platform that helps you track, understand, and improve every aspect of your health.
        </p>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-gray-900 px-8 md:px-14 py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl lg:text-6xl font-black text-white mb-2 tabular-nums">{s.value}</div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="px-8 md:px-14 py-20 md:py-28 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-tag mb-5">// Our Mission</p>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-6">
              Empowering
              <br />Healthier Lives
              <br /><span className="text-orange-500">Through Data</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-md">
              We believe understanding your health data is the first step to improving it. LifeScore combines AI-powered insights with intuitive tracking to give you a complete picture of your wellness journey.
            </p>
            <Link href="/signup" className="btn-dark">
              Start Your Journey →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
              'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
              'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
              'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&q=80',
            ].map((src, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${i % 2 === 1 ? 'mt-8' : ''}`} style={{ height: 200 }}>
                <Image src={src} alt="" width={300} height={200} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-gray-50 px-8 md:px-14 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="section-tag mb-4">// Our Team</p>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter">The People Behind LifeScore</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((m, i) => (
              <div key={i} className="group">
                <div className="relative aspect-square rounded-3xl overflow-hidden mb-5 bg-gray-200">
                  <Image src={m.img} alt={m.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900">{m.name}</h3>
                <p className="text-sm text-gray-400 font-semibold">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="px-3 md:px-4 lg:px-5 pb-5 bg-white">
        <div className="max-w-[1600px] mx-auto"><Footer /></div>
      </div>
    </main>
  );
}
