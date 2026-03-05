import Hero from '@/components/landing/Hero';
import MentalHealthCard from '@/components/landing/MentalHealthCard';
import Features from '@/components/landing/Features';
import DashboardPreview from '@/components/landing/DashboardPreview';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white p-3 md:p-4 lg:p-6">
      <div className="max-w-[1600px] mx-auto space-y-3 md:space-y-4 lg:space-y-6">
        <Hero />
        <MentalHealthCard />
        <Features />
        <DashboardPreview />
        <HowItWorks />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
