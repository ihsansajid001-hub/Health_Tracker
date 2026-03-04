'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold text-white">PeaceHub</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your AI-powered wellness companion for optimizing sleep, fitness, nutrition, and mental health.
              Transform your lifestyle, one day at a time.
            </p>
            <p className="text-sm text-gray-500">
              This platform provides lifestyle guidance, not medical advice.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#features" className="hover:text-primary-400 transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary-400 transition-colors">How It Works</Link></li>
              <li><Link href="#testimonials" className="hover:text-primary-400 transition-colors">Testimonials</Link></li>
              <li><Link href="#community" className="hover:text-primary-400 transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary-400 transition-colors">Medical Disclaimer</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2024 PeaceHub. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 fill-red-500" />
            <span>for your wellness journey</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
