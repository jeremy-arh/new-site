import { Link } from 'react-router-dom';
import MobileCTA from '../components/MobileCTA';

const TermsConditions = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white pt-32 pb-16 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Terms &amp; Conditions
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Agreement to Terms</h2>
            <p className="text-gray-600 mb-6">
              By accessing and using our online notarization services, you agree to be bound by these Terms and Conditions.
              If you do not agree with any part of these terms, please do not use our services.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">2. Services Description</h2>
            <p className="text-gray-600 mb-6">
              We provide online notarization and apostille services that are legally valid and recognized internationally.
              Our services are conducted through secure digital platforms and comply with all applicable laws and regulations.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">3. User Responsibilities</h2>
            <p className="text-gray-600 mb-4">As a user of our services, you agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Provide accurate and truthful information</li>
              <li>Verify your identity as required by law</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the services only for lawful purposes</li>
              <li>Not attempt to circumvent any security measures</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">4. Payment Terms</h2>
            <p className="text-gray-600 mb-6">
              All fees are clearly displayed before you complete any transaction. Payments are processed securely through
              our payment providers. Fees are non-refundable once the notarization process has been completed.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">5. Privacy and Data Protection</h2>
            <p className="text-gray-600 mb-6">
              We take your privacy seriously. Please review our <Link to="/privacy-policy" className="text-black font-semibold hover:underline">Privacy Policy</Link> to
              understand how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">6. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              While we strive to provide accurate and reliable services, we cannot guarantee uninterrupted access to our platform.
              We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">7. Intellectual Property</h2>
            <p className="text-gray-600 mb-6">
              All content, trademarks, and intellectual property on our platform are owned by us or our licensors.
              You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">8. Termination</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to terminate or suspend your access to our services at any time, without prior notice,
              for conduct that we believe violates these Terms and Conditions or is harmful to other users.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">9. Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We may update these Terms and Conditions from time to time. We will notify you of any material changes by
              posting the new terms on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">10. Contact Us</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about these Terms and Conditions, please contact us through our support channels.
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

export default TermsConditions;
