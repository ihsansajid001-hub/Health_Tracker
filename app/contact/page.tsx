import Link from 'next/link';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';
import Footer from '@/components/landing/Footer';

const inp = "w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-900 text-sm font-medium transition-all";

export default function ContactPage() {
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
        <p className="section-tag mb-5">// Contact</p>
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-6">
          Get in
          <br /><span className="text-orange-500">Touch</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-md">Have questions? We'd love to hear from you.</p>
      </section>

      {/* Contact grid */}
      <section className="px-8 md:px-14 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          {/* Form */}
          <div className="card p-8">
            <p className="section-tag mb-3">// Message Us</p>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-6">Send a Message</h2>
            <form className="space-y-5">
              {[
                { label: 'Full Name',      type: 'text',  placeholder: 'John Doe',           id: 'name' },
                { label: 'Email Address',  type: 'email', placeholder: 'john@example.com',   id: 'email' },
                { label: 'Subject',        type: 'text',  placeholder: 'How can we help?',   id: 'subject' },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{f.label}</label>
                  <input type={f.type} id={f.id} placeholder={f.placeholder} className={inp} />
                </div>
              ))}
              <div>
                <label htmlFor="message" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Message</label>
                <textarea id="message" rows={5} placeholder="Tell us more about your inquiry…"
                  className={`${inp} resize-none`} />
              </div>
              <button type="submit"
                className="w-full py-4 bg-gray-900 hover:bg-gray-700 text-white font-black rounded-full transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Send Message →
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="card p-8">
              <p className="section-tag mb-3">// Info</p>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-6">Contact Information</h2>
              <div className="space-y-5">
                {[
                  { icon: Mail,         label: 'Email',     value: 'support@lifescore.app',              accent: 'bg-orange-50 text-orange-500' },
                  { icon: MessageSquare, label: 'Live Chat', value: 'Available Mon-Fri, 9am-5pm EST',    accent: 'bg-green-50 text-green-500' },
                  { icon: Phone,        label: 'Phone',     value: '+1 (555) 123-4567',                  accent: 'bg-orange-50 text-orange-500' },
                  { icon: MapPin,       label: 'Office',    value: '123 Wellness Street, San Francisco', accent: 'bg-purple-50 text-purple-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-11 h-11 ${item.accent} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-sm mb-0.5">{item.label}</h3>
                      <p className="text-sm text-gray-400">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-3 tracking-tight">Need Quick Answers?</h3>
                <p className="text-white/50 text-sm mb-6">Check out our FAQ for instant answers to common questions.</p>
                <Link href="/#faq" className="btn-orange">View FAQ</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-3 md:px-4 lg:px-5 pb-5 bg-white">
        <div className="max-w-[1600px] mx-auto"><Footer /></div>
      </div>
    </main>
  );
}
