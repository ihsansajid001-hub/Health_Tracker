import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import Community from '@/components/landing/Community';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-calm-blue to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Community />
      <CTA />
      <Footer />
    </main>
  );
}
