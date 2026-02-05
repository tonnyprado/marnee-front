import React from "react";
import Logo from "../Component/Logo";

export default function PresentationPage() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
          >
            Contact
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition shadow-lg shadow-purple-500/25">
            Book a demo
          </button>
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-20 md:py-32 max-w-6xl mx-auto">
        <div className="text-center">
          <div className="inline-block mb-6">
            <span className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
              AI-powered marketing strategy
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Stop guessing.
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Start scaling.
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            DNHub turns social signals into marketing decisions — what to post, when, and why, tailored to your brand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => (window.location.href = "/auth")}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-4 rounded-full font-medium transition shadow-lg shadow-purple-500/25"
            >
              Get started free
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-full font-medium transition"
            >
              See how it works
            </button>
          </div>
        </div>

        {/* Decorative gradient blob */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute top-40 left-0 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 -z-10" />
      </section>

      {/* Social Proof */}
      <section className="px-6 md:px-12 py-12 border-y border-gray-100 bg-gray-50/50">
        <p className="text-center text-gray-500 text-sm mb-6">Trusted by marketing teams worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
          <span className="text-xl font-semibold text-gray-400">Startup A</span>
          <span className="text-xl font-semibold text-gray-400">Brand Co</span>
          <span className="text-xl font-semibold text-gray-400">Agency X</span>
          <span className="text-xl font-semibold text-gray-400">Growth Inc</span>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="px-6 md:px-12 py-20 md:py-28 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Three simple steps to transform your marketing strategy
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-100 transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-purple-600 font-bold text-lg">1</span>
            </div>
            <h3 className="font-semibold text-xl mb-3">Define your brand</h3>
            <p className="text-gray-600 leading-relaxed">
              Complete our branding tests. We match your answers with real-time social media research from your niche.
            </p>
            <p className="text-purple-600 text-sm mt-4 font-medium">
              Your goals meet what's actually working.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-100 transition-all">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-pink-600 font-bold text-lg">2</span>
            </div>
            <h3 className="font-semibold text-xl mb-3">Marnee builds your strategy</h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI consultant guides you through the entire strategy process, suggesting angles, formats, and content directions.
            </p>
            <p className="text-pink-600 text-sm mt-4 font-medium">
              You approve, tweak or discard. Stay in control.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-100 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold text-lg">3</span>
            </div>
            <h3 className="font-semibold text-xl mb-3">Everything in your dashboard</h3>
            <p className="text-gray-600 leading-relaxed">
              All approved decisions live in your DNHub dashboard. View them as a calendar or kanban board with full details.
            </p>
            <p className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-sm mt-4 font-medium">
              One clear overview. No chaos.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => (window.location.href = "/auth")}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-4 rounded-full font-medium transition shadow-lg shadow-purple-500/25"
          >
            Start building your strategy
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 md:px-12 py-20 md:py-28 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful features</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Built for speed, clarity and consistency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Trend detection</h3>
              <p className="text-gray-600 text-sm">
                Identify what's working right now in your niche with real-time analysis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Brand intelligence</h3>
              <p className="text-gray-600 text-sm">
                Your strategy adapts to your tone, audience and positioning automatically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI strategy guidance</h3>
              <p className="text-gray-600 text-sm">
                Marnee explains, suggests and helps you decide, not just generate.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Strategy dashboard</h3>
              <p className="text-gray-600 text-sm">
                All decisions in one place. Calendar and Kanban views included.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Content-ready outputs</h3>
              <p className="text-gray-600 text-sm">
                Ideas, titles, copy and visual direction. Ready for production.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Save hours weekly</h3>
              <p className="text-gray-600 text-sm">
                Stop overthinking every post. Get strategic clarity in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Marnee Section */}
      <section className="px-6 md:px-12 py-20 md:py-28 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent text-sm font-semibold uppercase tracking-wider">
              Your AI Consultant
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Meet Marnee</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Marnee helps you think, not just post. She explains the reasoning behind every suggestion, so you understand what works and why.
            </p>
            <div className="space-y-3 text-gray-500 italic mb-8">
              <p className="flex items-start gap-2">
                <span className="text-purple-500">"</span>
                What content should we test next week?
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-500">"</span>
                Rewrite this in a confident but warm tone.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-500">"</span>
                Why is this format performing better in our niche?
              </p>
            </div>
            <p className="text-purple-600 font-medium">
              Strategy with context. Decisions with confidence.
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 md:p-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Marnee</p>
                    <p className="text-xs text-gray-500">AI Consultant</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Based on your brand positioning and current trends in your niche, I recommend testing short-form educational content this week. Here's why...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for Section */}
      <section className="px-6 md:px-12 py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who it's for</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Built for anyone who needs marketing clarity without the complexity
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              "Early-stage startups",
              "Founders who need clarity",
              "Social media managers",
              "Small teams without marketing",
              "Multi-brand businesses",
              "Agencies & consultants",
            ].map((audience, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                </div>
                <p className="font-medium text-gray-800">{audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to build your strategy today?
              </h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                From zero clarity to a structured marketing plan, guided by AI. Start free, upgrade when you're ready.
              </p>
              <button
                onClick={() => (window.location.href = "/auth")}
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full font-medium transition shadow-lg"
              >
                Get started free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="px-6 md:px-12 py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo />
            <div className="flex items-center gap-8">
              <button className="text-gray-500 hover:text-gray-900 transition text-sm">
                About
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition text-sm">
                Contact
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition text-sm">
                Privacy
              </button>
              <button className="text-gray-500 hover:text-gray-900 transition text-sm">
                Terms
              </button>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-100">
            <p className="text-gray-400 text-sm">&copy; 2026 DNHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
