import { Link } from 'react-router-dom';
import MobileCTA from '../components/MobileCTA';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white pt-32 pb-16 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
            <p className="text-gray-600 mb-6">
              We are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
              use our online notarization services.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">1. Information We Collect</h2>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Personal Information</h3>
            <p className="text-gray-600 mb-4">We may collect the following types of personal information:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Name, email address, and contact information</li>
              <li>Government-issued identification documents</li>
              <li>Payment and billing information</li>
              <li>Documents submitted for notarization</li>
              <li>Video recordings of notarization sessions (as required by law)</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Technical Information</h3>
            <p className="text-gray-600 mb-4">We automatically collect certain technical information:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Provide and deliver our notarization services</li>
              <li>Verify your identity as required by law</li>
              <li>Process payments and prevent fraud</li>
              <li>Maintain records as required by notarial regulations</li>
              <li>Communicate with you about your transactions</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations and regulatory requirements</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">3. Data Security</h2>
            <p className="text-gray-600 mb-6">
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Bank-level encryption (SSL/TLS) for all data transmission</li>
              <li>Secure storage with encrypted databases</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Restricted access to personal information on a need-to-know basis</li>
              <li>Multi-factor authentication for account access</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">4. Data Retention</h2>
            <p className="text-gray-600 mb-6">
              We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy,
              unless a longer retention period is required by law. Notarization records and related documents are retained
              according to legal requirements, typically for a minimum of 7-10 years.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">5. Information Sharing</h2>
            <p className="text-gray-600 mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Licensed notaries performing your notarization</li>
              <li>Payment processors for transaction processing</li>
              <li>Government authorities when required by law</li>
              <li>Service providers who assist in our operations (under strict confidentiality agreements)</li>
            </ul>
            <p className="text-gray-600 mb-6">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">6. Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal retention requirements)</li>
              <li>Object to processing of your information</li>
              <li>Request data portability</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">7. Cookies and Tracking</h2>
            <p className="text-gray-600 mb-6">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and improve
              our services. You can control cookie preferences through your browser settings, though this may affect
              certain functionality of our platform.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">8. International Data Transfers</h2>
            <p className="text-gray-600 mb-6">
              Your information may be transferred to and processed in countries other than your country of residence.
              We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">9. Children's Privacy</h2>
            <p className="text-gray-600 mb-6">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
              information from children. If you believe we have collected information from a child, please contact us
              immediately.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">10. Changes to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
              We will notify you of any material changes by posting the updated policy on this page and updating the
              "Last updated" date.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">11. Contact Us</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
              please contact us through our support channels. For specific data protection inquiries, you may request
              to speak with our Data Protection Officer.
            </p>
          </div>

          {/* Back to Home Button */}
          <div className="mt-12 text-center">
            <Link to="/" className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3">
              <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="btn-text inline-block">Back to Home</span>
            </Link>
          </div>
        </div>
      </section>

      <MobileCTA />
    </div>
  );
};

export default PrivacyPolicy;
