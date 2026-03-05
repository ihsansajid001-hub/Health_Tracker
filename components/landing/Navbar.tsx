'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
        <div className="flex justify-between items-center h-24">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">LifeScore</span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-12">
            <Link href="/" className="text-white hover:text-white/80 font-medium transition-all duration-300 hover:scale-110">
              Home
            </Link>
            <Link href="/articles" className="text-white hover:text-white/80 font-medium transition-all duration-300 hover:scale-110">
              Articles
            </Link>
            <Link href="/plans" className="text-white hover:text-white/80 font-medium transition-all duration-300 hover:scale-110">
              Plans
            </Link>
            <Link href="/community" className="text-white hover:text-white/80 font-medium transition-all duration-300 hover:scale-110">
              Community
            </Link>
            <Link href="/about" className="text-white hover:text-white/80 font-medium transition-all duration-300 hover:scale-110">
              About Us
            </Link>
          </div>

          {/* Contact Button - Right */}
          <Link
            href="/signup"
            className="hidden md:inline-flex px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            <span>Get Started</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md rounded-2xl mx-8 mt-2">
          <div className="px-6 py-6 space-y-4">
            <Link href="/" className="block py-2 text-gray-700 font-medium">
              Home
            </Link>
            <Link href="/articles" className="block py-2 text-gray-700 font-medium">
              Articles
            </Link>
            <Link href="/plans" className="block py-2 text-gray-700 font-medium">
              Plans
            </Link>
            <Link href="/community" className="block py-2 text-gray-700 font-medium">
              Community
            </Link>
            <Link href="/about" className="block py-2 text-gray-700 font-medium">
              About Us
            </Link>
            <Link
              href="/signup"
              className="block text-center px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
