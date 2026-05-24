import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">L</span>
            </div>
            <span className="font-black text-gray-900">LifeScore</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">// Legal</p>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-3">Terms of Service</h1>
          <p className="text-gray-400 text-sm">Last updated: <strong className="text-gray-600">January 1, 2025</strong></p>
        </div>

        <div className="space-y-8">
          <p className="text-gray-600 leading-relaxed text-lg">
            Welcome to LifeScore. These Terms of Service govern your access to and use of LifeScore's website and services. By using the service, you agree to be bound by these Terms.
          </p>

          {/* Medical disclaimer — most important */}
          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-2xl p-6">
            <h2 className="text-xl font-black text-gray-900 mb-2">⚠️ Medical Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed font-medium">
              LifeScore is NOT a medical service and does not provide medical advice. The service is for wellness tracking and informational purposes only. Always consult a qualified healthcare professional before making health-related decisions.
            </p>
          </div>

          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By creating an account or using the service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.',
            },
            {
              title: '2. Eligibility',
              content: 'You must be at least 13 years old to use the service. If you are under 18, you must have permission from a parent or guardian.',
            },
            {
              title: '3. User Accounts',
              content: 'You agree to provide accurate information, maintain the security of your password, accept responsibility for all activities under your account, and notify us immediately of any unauthorized use.',
            },
            {
              title: '4. Acceptable Use',
              content: 'You agree not to use the service for illegal purposes, violate others\' rights, upload malicious code, attempt unauthorized access, impersonate others, harass users, or use automated scraping tools.',
            },
            {
              title: '5. Intellectual Property',
              content: 'The service and its content are owned by LifeScore and protected by intellectual property laws. You retain ownership of content you submit, but grant us a license to use it in connection with the service.',
            },
            {
              title: '6. Subscription and Payments',
              content: 'Paid subscriptions automatically renew unless cancelled. You can cancel at any time. We reserve the right to change pricing with advance notice.',
            },
            {
              title: '7. Termination',
              content: 'We may terminate or suspend your account for breach of these Terms. You may delete your account at any time through the settings page.',
            },
            {
              title: '8. Limitation of Liability',
              content: 'To the maximum extent permitted by law, LifeScore shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service.',
            },
            {
              title: '9. Changes to Terms',
              content: 'We may update these Terms at any time. We will notify you by posting the new Terms on this page. Continued use of the service constitutes acceptance of the updated Terms.',
            },
            {
              title: '10. Governing Law',
              content: 'These Terms shall be governed by applicable law without regard to conflict of law provisions.',
            },
          ].map((section, i) => (
            <div key={i} className="border-b border-gray-100 pb-8">
              <h2 className="text-xl font-black text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
            <h2 className="text-xl font-black text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600 mb-3">If you have questions about these Terms:</p>
            <a href="mailto:support@lifescore.app" className="font-bold text-orange-500 hover:text-orange-600 transition-colors">
              support@lifescore.app
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link href="/" className="px-8 py-3 bg-gray-900 hover:bg-gray-700 text-white font-bold rounded-full transition-colors text-center">
            Back to Home
          </Link>
          <Link href="/privacy" className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-full transition-colors text-center">
            Privacy Policy
          </Link>
        </div>
      </main>
    </div>
  );
}
