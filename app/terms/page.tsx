import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600">
              Last updated: <span className="font-semibold">March 9, 2026</span>
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-gray-700 leading-relaxed text-lg">
              Welcome to LifeScore. These Terms of Service ("Terms") govern your access to and use of 
              LifeScore's website, mobile application, and services (collectively, the "Service"). 
              By accessing or using the Service, you agree to be bound by these Terms.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By creating an account or using the Service, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these 
              Terms, you may not access or use the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Eligibility
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 13 years old to use the Service. If you are under 18, you must have 
              permission from a parent or guardian. By using the Service, you represent and warrant that 
              you meet these eligibility requirements.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. User Accounts
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Medical Disclaimer
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
              <p className="text-gray-800 leading-relaxed font-medium mb-3">
                IMPORTANT: LifeScore is NOT a medical service and does not provide medical advice.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Service is designed for wellness tracking and informational purposes only. It is not 
                intended to diagnose, treat, cure, or prevent any disease or medical condition. Always 
                consult with a qualified healthcare professional before making any health-related decisions 
                or changes to your lifestyle, diet, or exercise routine.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Acceptable Use
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Violate the rights of others, including privacy and intellectual property rights</li>
              <li>Upload or transmit viruses, malware, or other malicious code</li>
              <li>Attempt to gain unauthorized access to the Service or related systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Impersonate any person or entity</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Scrape, crawl, or use automated means to access the Service</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are owned by LifeScore 
              and are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You retain ownership of any content you submit to the Service. By submitting content, you 
              grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and 
              display such content in connection with the Service.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Subscription and Payments
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some features of the Service may require a paid subscription. By purchasing a subscription:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>You agree to pay all fees associated with your subscription</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You can cancel your subscription at any time</li>
              <li>Refunds are provided in accordance with our refund policy</li>
              <li>We reserve the right to change pricing with notice</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, without 
              prior notice or liability, for any reason, including if you breach these Terms. Upon 
              termination, your right to use the Service will immediately cease. You may also delete 
              your account at any time through the settings page.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, LIFESCORE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
              WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER 
              INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Disclaimer of Warranties
            </h2>
            <p className="text-gray-700 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
              FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of any changes 
              by posting the new Terms on this page and updating the "Last updated" date. Your continued 
              use of the Service after such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which LifeScore operates, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@lifescore.com" className="text-blue-600 hover:text-blue-700">
                  legal@lifescore.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Support:</strong>{' '}
                <a href="mailto:support@lifescore.com" className="text-blue-600 hover:text-blue-700">
                  support@lifescore.com
                </a>
              </p>
            </div>
          </section>

          {/* Footer CTA */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-center"
              >
                Back to Home
              </Link>
              <Link
                href="/privacy"
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors text-center"
              >
                View Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
