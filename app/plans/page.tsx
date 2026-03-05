import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

export default function PlansPage() {
  return (
    <main className="min-h-screen bg-white p-3 md:p-4 lg:p-6">
      <div className="max-w-[1600px] mx-auto space-y-3 md:space-y-4 lg:space-y-6">
        {/* Hero Section with Navbar */}
        <section className="relative min-h-[400px] flex items-center overflow-hidden rounded-[32px] md:rounded-[48px] shadow-xl bg-gradient-to-br from-purple-500 to-pink-600">
          <Navbar />
          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 lg:px-16 py-32 text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Plans
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Coming soon - Wellness plans and subscriptions
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
