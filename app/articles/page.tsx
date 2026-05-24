import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/landing/Footer';

const articles = [
  { title: 'How to Build a Consistent Sleep Routine That Actually Works',       date: 'January 8, 2026',    category: 'Sleep',         img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80' },
  { title: 'The Science Behind Your LifeScore: How We Calculate Wellness',      date: 'October 25, 2025',   category: 'Wellness',      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' },
  { title: '5 Common Nutrition Mistakes That Are Hurting Your Health Goals',    date: 'January 11, 2026',   category: 'Nutrition',     img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80' },
  { title: 'Why 8 Hours of Sleep Is Not Enough — Quality Matters More',        date: 'December 3, 2025',   category: 'Sleep',         img: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80' },
  { title: 'Hydration and Mental Clarity: The Connection You Need to Know',     date: 'November 15, 2025',  category: 'Hydration',     img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80' },
  { title: 'Managing Stress Through Movement: A Beginner\'s Fitness Guide',    date: 'September 20, 2025', category: 'Fitness',       img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80' },
];

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-white">

      <header className="flex items-center justify-between px-8 md:px-14 h-20 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">LifeScore</span>
        </Link>
        <Link href="/" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">← Back to Home</Link>
      </header>

      {/* Hero */}
      <section className="px-8 md:px-14 py-20 md:py-28 max-w-7xl mx-auto">
        <p className="section-tag mb-5">// Blog & Articles</p>
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-6">
          Wellness Tips,
          <br />Health Science
          <br />&amp; <span className="text-orange-500">Insights</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-md">Evidence-based wellness content from the LifeScore team.</p>
      </section>

      {/* Articles grid */}
      <section className="px-8 md:px-14 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a, i) => (
              <div key={i} className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image src={a.img} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 right-4 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {a.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-300 mb-2">{a.date}</p>
                  <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-orange-500 transition-colors">{a.title}</h3>
                  <p className="mt-3 text-xs font-bold text-orange-500">Read article →</p>
                </div>
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
