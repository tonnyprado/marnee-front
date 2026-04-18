import React, { useState } from "react";
import PageTransition from "../../Component/PageTransition";
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  PlayCircle,
  Users,
  ChevronDown,
  ChevronUp,
  Send,
  ExternalLink
} from "lucide-react";

export default function HelpSupportPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const faqs = [
    {
      question: "How do I get started with Marnee?",
      answer: "Start by completing the branding test to help Marnee understand your business. Then, you can use the AI content chat to generate ideas, create a content calendar, and manage your social media strategy."
    },
    {
      question: "What is included in the Explorer Plan?",
      answer: "The Explorer Plan includes access to AI content generation, content calendar management, up to 5 team members, unlimited conversations, and weekly content ideas. You also get priority email support."
    },
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time from the Billing & Plans page. Changes will be reflected in your next billing cycle."
    },
    {
      question: "How does the AI content generation work?",
      answer: "Marnee uses advanced AI to understand your brand voice, target audience, and content goals. Simply chat with the AI, describe what you need, and it will generate tailored content ideas, scripts, and posts for your social media channels."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption to protect your data. Your content, brand information, and business details are stored securely and never shared with third parties."
    },
    {
      question: "Can I export my content calendar?",
      answer: "Yes, you can export your content calendar in various formats including CSV, PDF, and integrate with popular calendar applications."
    }
  ];

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of Marnee and how to create your first content campaign",
      icon: <BookOpen className="w-5 h-5" />,
      link: "#"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides on using Marnee's features",
      icon: <PlayCircle className="w-5 h-5" />,
      link: "#"
    },
    {
      title: "Community Forum",
      description: "Connect with other users, share tips, and get inspiration",
      icon: <Users className="w-5 h-5" />,
      link: "#"
    },
    {
      title: "API Documentation",
      description: "Integrate Marnee with your existing tools and workflows",
      icon: <BookOpen className="w-5 h-5" />,
      link: "#"
    }
  ];

  const handleFaqToggle = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to send contact message
    console.log("Sending message:", contactForm);
  };

  const handleContactChange = (field, value) => {
    setContactForm({ ...contactForm, [field]: value });
  };

  return (
    <PageTransition className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-500">We're here to help you succeed with Marnee</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <a
            href="#faqs"
            className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-[#40086d] group"
          >
            <div className="w-12 h-12 bg-[#ede0f8] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#40086d] transition-colors">
              <HelpCircle className="w-6 h-6 text-[#40086d] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Browse FAQs</h3>
            <p className="text-sm text-gray-500">Find answers to common questions</p>
          </a>

          <a
            href="#resources"
            className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-[#40086d] group"
          >
            <div className="w-12 h-12 bg-[#ede0f8] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#40086d] transition-colors">
              <BookOpen className="w-6 h-6 text-[#40086d] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Documentation</h3>
            <p className="text-sm text-gray-500">Read guides and tutorials</p>
          </a>

          <a
            href="#contact"
            className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-[#40086d] group"
          >
            <div className="w-12 h-12 bg-[#ede0f8] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#40086d] transition-colors">
              <MessageCircle className="w-6 h-6 text-[#40086d] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact Support</h3>
            <p className="text-sm text-gray-500">Get help from our team</p>
          </a>
        </div>

        {/* FAQs Section */}
        <div id="faqs" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  onClick={() => handleFaqToggle(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[#40086d] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div id="resources" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources & Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group hover:border-[#40086d]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#ede0f8] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#40086d] transition-colors">
                    <span className="text-[#40086d] group-hover:text-white transition-colors">
                      {resource.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#40086d] transition-colors" />
                    </div>
                    <p className="text-sm text-gray-500">{resource.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div id="contact" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => handleContactChange("name", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => handleContactChange("email", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => handleContactChange("subject", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => handleContactChange("message", e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-[#40086d] text-white rounded-lg hover:bg-[#5a0a9d] transition-colors font-medium"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#ede0f8] rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#40086d]" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Email Us</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">General inquiries</p>
                <a href="mailto:support@marnee.com" className="text-sm text-[#40086d] hover:text-[#5a0a9d] font-medium">
                  support@marnee.com
                </a>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#ede0f8] rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#40086d]" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Live Chat</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Available Mon-Fri, 9am-5pm EST</p>
                <button className="text-sm text-[#40086d] hover:text-[#5a0a9d] font-medium">
                  Start Chat →
                </button>
              </div>

              <div className="bg-[#ede0f8] rounded-2xl p-6 border border-[#dccaf4]">
                <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                <p className="text-sm text-gray-600">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Still Need Help Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our support team is always ready to assist you. Schedule a call with one of our specialists
            or browse our comprehensive knowledge base.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-[#40086d] text-white rounded-lg hover:bg-[#5a0a9d] transition-colors font-medium">
              Schedule a Call
            </button>
            <button className="px-6 py-3 bg-white text-[#40086d] border-2 border-[#40086d] rounded-lg hover:bg-[#ede0f8] transition-colors font-medium">
              Browse Knowledge Base
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
