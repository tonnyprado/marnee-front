import React from "react";
import { FileText, Calendar } from "lucide-react";
import PageTransition from "../../Component/PageTransition";

export default function TermsOfServicePage() {
  return (
    <PageTransition className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#40086d] rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Last Updated: May 12, 2026</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            Please read these Terms of Service carefully before using Marnee.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                By accessing or using Marnee ("the Service"), you agree to be bound by these Terms of Service
                ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p>
                These Terms apply to all visitors, users, and others who access or use the Service. By using
                the Service, you represent that you are at least 18 years of age or have the consent of a
                legal guardian.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Marnee is an AI-powered marketing assistant platform that provides content creation,
                strategy planning, campaign management, and other marketing-related services. The Service
                uses artificial intelligence to help businesses and individuals create and manage their
                marketing efforts.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the Service at any
                time without notice. We will not be liable to you or any third party for any modification,
                suspension, or discontinuance of the Service.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                When you create an account with us, you must provide accurate, complete, and current
                information. Failure to do so constitutes a breach of these Terms, which may result in
                immediate termination of your account.
              </p>
              <p>
                You are responsible for safeguarding your account password and for any activities or
                actions under your account. You must notify us immediately upon becoming aware of any
                breach of security or unauthorized use of your account.
              </p>
              <p>
                You may not use another person's account without permission. We reserve the right to
                refuse service, terminate accounts, or remove content at our sole discretion.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription and Payments</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Some parts of the Service are billed on a subscription basis. You will be billed in
                advance on a recurring and periodic basis (such as monthly or annually). Billing cycles
                are set at the start of your subscription.
              </p>
              <p>
                A valid payment method is required to process the payment for your subscription. You must
                provide accurate and complete billing information including full name, address, and valid
                payment method information.
              </p>
              <p>
                Subscription fees are non-refundable except where required by law. You may cancel your
                subscription at any time through your account settings. Cancellation will take effect at
                the end of your current billing period.
              </p>
              <p>
                We reserve the right to change our subscription fees at any time. Any price changes will
                be communicated to you in advance and will take effect at the start of your next billing
                cycle.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
            <div className="space-y-3 text-gray-700">
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the intellectual property rights of others</li>
                <li>Transmit any harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable content</li>
                <li>Attempt to gain unauthorized access to any part of the Service or related systems</li>
                <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                <li>Impersonate any person or entity or falsely state or misrepresent your affiliation</li>
                <li>Use the Service to send spam, chain letters, or other unsolicited communications</li>
                <li>Collect or harvest any personally identifiable information from the Service</li>
                <li>Use any automated system to access the Service in a manner that exceeds reasonable request volume</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                The Service and its original content, features, and functionality are owned by Marnee and
                are protected by international copyright, trademark, patent, trade secret, and other
                intellectual property laws.
              </p>
              <p>
                You retain all rights to the content you create using the Service. By using the Service,
                you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and
                display your content solely for the purpose of providing and improving the Service.
              </p>
              <p>
                Content generated by our AI may not be unique to you and may be similar to content
                generated for other users. While you can use AI-generated content, we cannot guarantee
                its uniqueness or originality.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                The Service may contain links to third-party websites or services that are not owned or
                controlled by Marnee. We have no control over, and assume no responsibility for, the
                content, privacy policies, or practices of any third-party websites or services.
              </p>
              <p>
                You acknowledge and agree that we shall not be responsible or liable for any damage or
                loss caused by or in connection with the use of any such third-party content, goods, or
                services.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY
                KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p>
                We do not warrant that the Service will be uninterrupted, timely, secure, or error-free.
                We do not warrant that the results obtained from using the Service will be accurate or
                reliable. We do not warrant that any errors in the Service will be corrected.
              </p>
              <p>
                AI-generated content may contain errors, inaccuracies, or inappropriate material. You are
                solely responsible for reviewing and verifying all content before using it.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL MARNEE, ITS DIRECTORS, EMPLOYEES,
                PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, USE,
                GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
              <p>
                Our total liability for any claims under these Terms, including for any implied warranties,
                is limited to the amount you paid us to use the Service in the twelve (12) months prior to
                the claim.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                You agree to defend, indemnify, and hold harmless Marnee and its affiliates, officers,
                directors, employees, and agents from and against any claims, liabilities, damages, losses,
                and expenses, including reasonable legal and accounting fees, arising out of or in any way
                connected with your access to or use of the Service, your violation of these Terms, or your
                violation of any third-party rights.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability,
                for any reason, including without limitation if you breach these Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will immediately cease. All provisions of
                these Terms which by their nature should survive termination shall survive, including
                ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
              <p>
                You may terminate your account at any time through your account settings or by contacting
                us. Upon termination, we will delete your personal data in accordance with our Privacy Policy,
                but we may retain certain data as required by law or for legitimate business purposes.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                jurisdiction in which Marnee operates, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the Service shall be resolved through
                binding arbitration in accordance with the rules of the applicable arbitration association,
                except where prohibited by law.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                We reserve the right to modify or replace these Terms at any time at our sole discretion.
                If a revision is material, we will provide at least 30 days' notice prior to any new terms
                taking effect.
              </p>
              <p>
                By continuing to access or use the Service after revisions become effective, you agree to
                be bound by the revised terms. If you do not agree to the new terms, please stop using the
                Service.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="font-medium text-gray-900">Marnee Support</p>
                <p className="text-gray-600">Email: legal@marnee.com</p>
                <p className="text-gray-600">Website: www.marnee.com</p>
              </div>
            </div>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Miscellaneous</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you
                and Marnee regarding the Service and supersede all prior agreements.
              </p>
              <p>
                <strong>Severability:</strong> If any provision of these Terms is found to be invalid or
                unenforceable, the remaining provisions will remain in full force and effect.
              </p>
              <p>
                <strong>Waiver:</strong> Our failure to enforce any right or provision of these Terms will
                not be considered a waiver of those rights.
              </p>
              <p>
                <strong>Assignment:</strong> You may not assign or transfer these Terms without our prior
                written consent. We may assign our rights and obligations under these Terms without restriction.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By using Marnee, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
