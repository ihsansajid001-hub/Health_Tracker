import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="text-gray-600">
              Last updated: <span className="font-semibold">March 9, 2026</span>
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-gray-700 leading-relaxed text-lg">
              At LifeScore, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our wellness tracking platform. 
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
              policy, please do not access the application.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              1.1 Personal Information
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Name and email address</li>
              <li>Username and password</li>
              <li>Profile information (age, gender, height, weight)</li>
              <li>Health and wellness data (sleep, fitness, nutrition, mental health metrics)</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              1.2 Automatically Collected Information
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you access our platform, we automatically collect certain information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Generate personalized wellness insights and recommendations</li>
              <li>Track your progress and calculate your LifeScore</li>
              <li>Send you updates, newsletters, and promotional materials (with your consent)</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How We Share Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>With your consent:</strong> We may share your information when you give us permission</li>
              <li><strong>Service providers:</strong> We may share information with third-party vendors who perform services on our behalf</li>
              <li><strong>Legal requirements:</strong> We may disclose information if required by law or in response to legal requests</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Aggregated data:</strong> We may share anonymized, aggregated data for research and analytics</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data storage with industry-leading providers</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. 
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Your Privacy Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Opt-out of marketing communications</li>
              <li><strong>Withdraw consent:</strong> Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@lifescore.com" className="text-blue-600 hover:text-blue-700 font-medium">
                privacy@lifescore.com
              </a>
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our platform and store 
              certain information. You can instruct your browser to refuse all cookies or to indicate when 
              a cookie is being sent. However, if you do not accept cookies, you may not be able to use some 
              portions of our service.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under the age of 13. We do not knowingly collect 
              personal information from children under 13. If you are a parent or guardian and believe 
              your child has provided us with personal information, please contact us, and we will take 
              steps to delete such information.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and maintained on computers located outside of your 
              state, province, country, or other governmental jurisdiction where data protection laws may 
              differ. We ensure appropriate safeguards are in place to protect your information in accordance 
              with this Privacy Policy.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date. You are 
              advised to review this Privacy Policy periodically for any changes. Changes are effective 
              when posted on this page.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@lifescore.com" className="text-blue-600 hover:text-blue-700">
                  privacy@lifescore.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:support@lifescore.com" className="text-blue-600 hover:text-blue-700">
                  support@lifescore.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Website:</strong>{' '}
                <a href="/" className="text-blue-600 hover:text-blue-700">
                  www.lifescore.com
                </a>
              </p>
            </div>
          </section>

          {/* GDPR & CCPA Notice */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Additional Information for EU and California Residents
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              GDPR (EU Residents)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are a resident of the European Union, you have additional rights under the General 
              Data Protection Regulation (GDPR), including the right to lodge a complaint with a supervisory 
              authority.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              CCPA (California Residents)
            </h3>
            <p className="text-gray-700 leading-relaxed">
              If you are a California resident, you have specific rights under the California Consumer 
              Privacy Act (CCPA), including the right to know what personal information we collect and 
              the right to request deletion of your personal information.
            </p>
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
                href="/terms"
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors text-center"
              >
                View Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
