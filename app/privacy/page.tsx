import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: <strong className="text-gray-600">January 1, 2025</strong></p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <p className="text-gray-600 leading-relaxed text-lg">
            At LifeScore, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our wellness tracking platform.
          </p>

          {[
            {
              title: '1. Information We Collect',
              content: `We collect information you provide directly: name, email address, username, password, profile information (age, gender, height, weight), and health data (sleep, fitness, nutrition, mental health metrics). We also automatically collect device information, usage data, and cookies when you access our platform.`,
            },
            {
              title: '2. How We Use Your Information',
              content: `We use your information to provide and improve our services, generate personalized wellness insights, track your progress and calculate your LifeScore, send updates with your consent, respond to support requests, and comply with legal obligations.`,
            },
            {
              title: '3. How We Share Your Information',
              content: `We do not sell your personal information. We may share information with service providers who perform services on our behalf, when required by law, in connection with a business transfer, or as anonymized aggregated data for research.`,
            },
            {
              title: '4. Data Security',
              content: `We implement encryption in transit and at rest, regular security assessments, access controls, and secure data storage. However, no method of transmission over the Internet is 100% secure.`,
            },
            {
              title: '5. Your Privacy Rights',
              content: `You have the right to access, correct, delete, and export your personal data. You may also opt out of marketing communications and withdraw consent at any time. To exercise these rights, contact us at support@lifescore.app.`,
            },
            {
              title: '6. Cookies',
              content: `We use cookies and similar tracking technologies. You can instruct your browser to refuse all cookies, though some features may not function properly without them.`,
            },
            {
              title: "7. Children's Privacy",
              content: `Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe your child has provided us with information, please contact us immediately.`,
            },
            {
              title: '8. Changes to This Policy',
              content: `We may update this Privacy Policy from time to time. We will notify you of changes by posting the new policy on this page and updating the date above. Continued use of the service constitutes acceptance.`,
            },
          ].map((section, i) => (
            <div key={i} className="border-b border-gray-100 pb-8">
              <h2 className="text-xl font-black text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
            <h2 className="text-xl font-black text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600 mb-3">If you have questions about this Privacy Policy:</p>
            <a href="mailto:support@lifescore.app" className="font-bold text-orange-500 hover:text-orange-600 transition-colors">
              support@lifescore.app
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link href="/" className="px-8 py-3 bg-gray-900 hover:bg-gray-700 text-white font-bold rounded-full transition-colors text-center">
            Back to Home
          </Link>
          <Link href="/terms" className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-full transition-colors text-center">
            Terms of Service
          </Link>
        </div>
      </main>
    </div>
  );
}
