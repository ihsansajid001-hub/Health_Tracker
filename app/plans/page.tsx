import Link from 'next/link';
import Footer from '@/components/landing/Footer';

const plans = [
  {
    name: 'Free', price: '$0', period: 'forever',
    desc: 'Perfect for getting started with wellness tracking.',
    features: ['Basic Life Score tracking', 'Sleep & hydration logs', 'Community access', '7-day history'],
    cta: 'Get Started', href: '/signup', highlight: false,
  },
  {
    name: 'Pro', price: '$9', period: 'per month',
    desc: 'For serious wellness enthusiasts who want full insights.',
    features: ['Everything in Free', 'AI-powered insights', 'Unlimited history', 'Advanced analytics', 'Nutrition barcode scanner', 'Meditation library', 'Priority support'],
    cta: 'Start Free Trial', href: '/signup', highlight: true,
  },
  {
    name: 'Team', price: '$29', period: 'per month',
    desc: 'For teams and organizations focused on collective wellness.',
    features: ['Everything in Pro', 'Up to 10 members', 'Team analytics dashboard', 'Custom challenges', 'Dedicated support'],
    cta: 'Contact Us', href: '/contact', highlight: false,
  },
];

export default function PlansPage() {
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
      <section className="px-8 md:px-14 py-20 md:py-28 max-w-7xl mx-auto text-center">
        <p className="section-tag mb-5 mx-auto w-fit">// Pricing Plans</p>
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-6">
          Simple,
          <br />Transparent
          <br /><span className="text-orange-500">Pricing</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-md mx-auto">Start free, upgrade when you're ready. No hidden fees.</p>
      </section>

      {/* Plans */}
      <section className="px-8 md:px-14 pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-3xl p-8 flex flex-col ${
              plan.highlight
                ? 'bg-gray-900 text-white shadow-2xl scale-105'
                : 'bg-gray-50 border border-gray-100'
            }`}>
              {plan.highlight && (
                <span className="inline-flex items-center px-3 py-1 bg-orange-500 text-white text-xs font-black uppercase tracking-widest rounded-full mb-4 w-fit">
                  Most Popular
                </span>
              )}
              <h3 className={`text-xl font-black mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className={`text-5xl font-black tabular-nums ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                <span className={`text-sm font-semibold mb-2 ${plan.highlight ? 'text-white/40' : 'text-gray-300'}`}>/{plan.period}</span>
              </div>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-white/50' : 'text-gray-400'}`}>{plan.desc}</p>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-orange-500' : 'bg-gray-900'}`}>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={plan.highlight ? 'text-white/70' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href}
                className={`w-full py-4 font-black rounded-full text-center transition-all hover:-translate-y-0.5 ${
                  plan.highlight
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/25'
                    : 'bg-gray-900 hover:bg-gray-700 text-white shadow-lg'
                }`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="px-3 md:px-4 lg:px-5 pb-5 bg-white">
        <div className="max-w-[1600px] mx-auto"><Footer /></div>
      </div>
    </main>
  );
}
