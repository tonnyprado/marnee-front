import React from "react";
import { Shield, Calendar } from "lucide-react";
import PageTransition from "../../Component/PageTransition";

export default function PrivacyPolicyPage() {
  return (
    <PageTransition className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#40086d] rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Last Updated: May 12, 2026</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Welcome to Marnee ("we," "our," or "us"). We are committed to protecting your personal
                information and your right to privacy. This Privacy Policy describes how we collect, use,
                disclose, and safeguard your information when you use our Service.
              </p>
              <p>
                By accessing or using Marnee, you agree to the collection and use of information in
                accordance with this Privacy Policy. If you do not agree with the terms of this Privacy
                Policy, please do not access the Service.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1 Personal Information</h3>
                <p>We collect personal information that you voluntarily provide to us when you:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Register for an account</li>
                  <li>Use our services</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us for support</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p className="mt-3">This information may include:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Company or business information</li>
                  <li>Payment and billing information</li>
                  <li>Profile information and preferences</li>
                  <li>Communications you send to us</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.2 Usage Data</h3>
                <p>We automatically collect information about how you use our Service, including:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Log data (access times, pages viewed, actions taken)</li>
                  <li>Usage patterns and preferences</li>
                  <li>Feature interactions and content generation history</li>
                  <li>Performance and diagnostic data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.3 Content and Files</h3>
                <p>
                  We collect and store the content you create, upload, or share through our Service,
                  including marketing materials, campaigns, conversations with our AI, and any files you
                  upload for processing.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.4 Cookies and Tracking Technologies</h3>
                <p>
                  We use cookies, web beacons, and similar tracking technologies to collect information
                  about your browsing activities and to remember your preferences. You can control cookies
                  through your browser settings, but disabling cookies may affect your ability to use
                  certain features of our Service.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <div className="space-y-3 text-gray-700">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, operate, and maintain our Service</li>
                <li>Process your transactions and manage your subscriptions</li>
                <li>Create and manage your account</li>
                <li>Communicate with you about updates, security alerts, and support</li>
                <li>Provide customer service and respond to your requests</li>
                <li>Personalize your experience and deliver relevant content</li>
                <li>Improve our AI models and Service functionality</li>
                <li>Analyze usage patterns and optimize performance</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Send you marketing communications (with your consent where required)</li>
                <li>Conduct research and development</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Share Your Information</h2>
            <div className="space-y-3 text-gray-700">
              <p>We may share your information in the following circumstances:</p>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold">With Service Providers:</p>
                  <p>
                    We share information with third-party vendors who perform services on our behalf,
                    such as payment processing, data analysis, email delivery, hosting services, and
                    customer service. These providers are contractually obligated to protect your
                    information and use it only for the purposes we specify.
                  </p>
                </div>

                <div>
                  <p className="font-semibold">For Legal Reasons:</p>
                  <p>
                    We may disclose your information if required by law or in response to valid legal
                    requests, such as subpoenas, court orders, or government investigations.
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Business Transfers:</p>
                  <p>
                    In connection with any merger, sale of company assets, financing, or acquisition of
                    all or a portion of our business, your information may be transferred to the acquiring
                    entity.
                  </p>
                </div>

                <div>
                  <p className="font-semibold">With Your Consent:</p>
                  <p>
                    We may share your information for any other purpose with your explicit consent.
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Aggregated or De-identified Data:</p>
                  <p>
                    We may share aggregated or de-identified information that cannot reasonably be used
                    to identify you.
                  </p>
                </div>
              </div>

              <p className="mt-4">
                <strong>We do not sell your personal information to third parties.</strong>
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                We implement appropriate technical and organizational security measures to protect your
                information against unauthorized access, alteration, disclosure, or destruction. These
                measures include:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication procedures</li>
                <li>Employee training on data protection</li>
                <li>Secure data centers and infrastructure</li>
              </ul>
              <p className="mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure.
                While we strive to protect your information, we cannot guarantee its absolute security.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                We retain your information for as long as necessary to provide you with our Service and
                fulfill the purposes described in this Privacy Policy. When you delete your account, we
                will delete your personal information within a reasonable timeframe, except where we are
                required or permitted by law to retain it.
              </p>
              <p>
                Some information may be retained in backup systems for a limited period or as required
                for legal, tax, or accounting purposes.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
            <div className="space-y-3 text-gray-700">
              <p>Depending on your location, you may have the following rights:</p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of the personal information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal information
                </li>
                <li>
                  <strong>Objection:</strong> Object to our processing of your information
                </li>
                <li>
                  <strong>Restriction:</strong> Request restriction of how we process your information
                </li>
                <li>
                  <strong>Portability:</strong> Request transfer of your information to another service
                </li>
                <li>
                  <strong>Withdrawal of Consent:</strong> Withdraw consent for processing where we rely on consent
                </li>
                <li>
                  <strong>Opt-out:</strong> Opt out of marketing communications at any time
                </li>
              </ul>

              <p className="mt-4">
                To exercise these rights, please contact us using the information provided in Section 13.
                We will respond to your request within the timeframe required by applicable law.
              </p>

              <p className="mt-3">
                <strong>California Residents:</strong> If you are a California resident, you have specific
                rights under the California Consumer Privacy Act (CCPA), including the right to know what
                personal information we collect, the right to delete personal information, and the right
                to opt-out of the sale of personal information (though we do not sell personal information).
              </p>

              <p className="mt-3">
                <strong>European Residents:</strong> If you are in the European Economic Area (EEA), you
                have rights under the General Data Protection Regulation (GDPR), including those listed
                above. We process your information based on legitimate interests, contract performance,
                consent, or legal obligations.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Your information may be transferred to and processed in countries other than your country
                of residence. These countries may have data protection laws different from those in your
                jurisdiction.
              </p>
              <p>
                When we transfer information internationally, we implement appropriate safeguards to
                protect your information, such as standard contractual clauses approved by relevant
                authorities.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Our Service is not intended for children under the age of 18. We do not knowingly collect
                personal information from children under 18. If you are a parent or guardian and believe
                your child has provided us with personal information, please contact us immediately.
              </p>
              <p>
                If we become aware that we have collected information from a child under 18 without
                parental consent, we will take steps to delete that information.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links and Services</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Our Service may contain links to third-party websites, applications, or services. We are
                not responsible for the privacy practices of these third parties. We encourage you to read
                the privacy policies of any third-party services you interact with.
              </p>
              <p>
                When you use third-party integrations with our Service, those third parties may collect
                information about you. Their use of your information is governed by their own privacy
                policies.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. AI and Machine Learning</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Our Service uses artificial intelligence and machine learning to provide personalized
                experiences and generate content. We may use your interactions with our AI to improve
                our models and Service.
              </p>
              <p>
                Content you create using our AI may be used in anonymized and aggregated form to train
                and improve our models. We implement measures to ensure your personal information is
                not identifiable in this training data.
              </p>
              <p>
                You can request that specific content not be used for training purposes by contacting us.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices,
                technology, legal requirements, or other factors. We will notify you of any material
                changes by posting the new Privacy Policy on this page and updating the "Last Updated"
                date.
              </p>
              <p>
                For significant changes, we may provide additional notice, such as sending an email or
                displaying a prominent notice in our Service. We encourage you to review this Privacy
                Policy periodically.
              </p>
              <p>
                Your continued use of the Service after changes become effective constitutes your
                acceptance of the revised Privacy Policy.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our
                data practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="font-medium text-gray-900">Marnee Privacy Team</p>
                <p className="text-gray-600">Email: privacy@marnee.com</p>
                <p className="text-gray-600">Website: www.marnee.com</p>
                <p className="text-gray-600 mt-2">
                  For GDPR-related inquiries, please contact our Data Protection Officer at: dpo@marnee.com
                </p>
              </div>
            </div>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Consent</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                By using our Service, you consent to the collection, use, and sharing of your information
                as described in this Privacy Policy. If you do not agree with this Privacy Policy, please
                discontinue use of our Service.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By using Marnee, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
