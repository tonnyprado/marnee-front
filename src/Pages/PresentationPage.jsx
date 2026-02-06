import { useState } from "react";
import Logo from "../Component/Logo";
import { api } from "../services/api";

// Mascot images
import marnee11 from "../assets/mascot/marnee11.png";
import marnee12 from "../assets/mascot/marnee12.png";
import marnee13 from "../assets/mascot/marnee13.png";
import marnee14 from "../assets/mascot/marnee14.png";
import marnee15 from "../assets/mascot/marnee15.png";

// Demo videos and images
import videoTest from "../assets/videos/TestPresentation.mov";
import videoChat from "../assets/videos/ChatMarnee.mov";
import videoCalendar from "../assets/videos/GenerateCalendar.mov";
import imgCampaign from "../assets/extras/Campaign.png";

export default function PresentationPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState("");

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      await api.subscribeWaitlist(email);
      setSubmitStatus("success");
      setEmail("");
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Waitlist form component to reuse
  const WaitlistForm = ({ variant = "light", className = "" }) => {
    const isLight = variant === "light";

    if (submitStatus === "success") {
      return (
        <div className={`flex items-center gap-3 ${className}`}>
          <div className={`flex items-center gap-2 px-6 py-4 rounded-full ${isLight ? 'bg-green-50 text-green-700' : 'bg-white/20 text-white'}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">You're on the list! We'll be in touch soon.</span>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleWaitlistSubmit} className={`${className}`}>
        <div className={`flex flex-col sm:flex-row gap-3 p-3 sm:p-2 rounded-2xl sm:rounded-full ${isLight ? 'bg-white shadow-xl shadow-purple-500/10 border border-gray-100' : 'bg-white/10 backdrop-blur-sm border border-white/20'}`}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className={`flex-1 px-5 py-3 rounded-xl sm:rounded-full outline-none text-base ${isLight ? 'bg-transparent text-gray-900 placeholder-gray-400' : 'bg-transparent text-white placeholder-white/60'}`}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-xl sm:rounded-full font-medium text-base transition whitespace-nowrap disabled:opacity-50 ${
              isLight
                ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-700 hover:via-indigo-700 hover:to-cyan-600 text-white shadow-lg shadow-violet-500/30'
                : 'bg-white text-violet-600 hover:bg-gray-100'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Joining...
              </span>
            ) : (
              'Join the waitlist'
            )}
          </button>
        </div>
        {submitStatus === "error" && (
          <p className={`mt-3 text-sm ${isLight ? 'text-red-500' : 'text-red-300'}`}>{errorMessage}</p>
        )}
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Custom animation styles */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.08; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.12; }
        }
        .animate-breathe {
          animation: breathe 8s ease-in-out infinite;
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(-3deg) translateY(0); }
          25% { transform: rotate(3deg) translateY(-5px); }
          50% { transform: rotate(-2deg) translateY(0); }
          75% { transform: rotate(2deg) translateY(-3px); }
        }
        .animate-wobble {
          animation: wobble 3s ease-in-out infinite;
        }
        .animate-wobble-slow {
          animation: wobble 4s ease-in-out infinite;
        }
        .animate-wobble-delay {
          animation: wobble 3.5s ease-in-out infinite 0.5s;
        }
      `}</style>

      {/* Navbar - Fixed */}
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-4 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <Logo dark={true} />
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
            onClick={() => scrollToSection("marnee")}
            className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
          >
            Meet Marnee
          </button>
        </div>
        <button
          onClick={() => scrollToSection("hero-form")}
          className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-700 hover:via-indigo-700 hover:to-cyan-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition shadow-lg shadow-violet-500/25"
        >
          Join waitlist
        </button>
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 md:px-12 pt-20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-violet-200 via-indigo-200 to-cyan-200 rounded-full blur-3xl opacity-40 -z-10" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full blur-3xl opacity-30 -z-10" />

        {/* Mascot - Hero Left (desktop only) */}
        <img
          src={marnee11}
          alt="Marnee mascot"
          className="hidden md:block absolute bottom-4 left-2 w-36 sm:w-44 md:w-48 lg:bottom-28 lg:left-24 xl:left-32 lg:w-44 xl:w-56 animate-wobble opacity-90 lg:opacity-95 pointer-events-none drop-shadow-lg z-0"
        />
        {/* Mascot - Hero Right (desktop only) */}
        <img
          src={marnee14}
          alt="Marnee with notebook"
          className="hidden md:block absolute bottom-4 right-2 w-36 sm:w-44 md:w-48 lg:bottom-28 lg:right-24 xl:right-32 lg:w-44 xl:w-56 animate-wobble-delay opacity-90 lg:opacity-95 pointer-events-none drop-shadow-lg z-0"
        />

        {/* Animated compass logo background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 animate-breathe">
          <svg width="800" height="800" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="blur-sm">
            <circle cx="15" cy="15" r="13" stroke="url(#heroCompassGrad)" strokeWidth="0.5" fill="none" />
            <circle cx="15" cy="15" r="10" stroke="url(#heroCompassGrad)" strokeWidth="0.3" fill="none" opacity="0.5" />
            <circle cx="15" cy="15" r="7" stroke="url(#heroCompassGrad)" strokeWidth="0.2" fill="none" opacity="0.3" />
            <path d="M15 15L22 8" stroke="url(#heroCompassGrad)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M15 15L10 20" stroke="url(#heroCompassGrad2)" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
            <circle cx="15" cy="15" r="1.5" fill="url(#heroCompassGrad)" />
            <circle cx="15" cy="4" r="0.8" fill="url(#heroCompassGrad)" />
            <circle cx="15" cy="26" r="0.5" fill="url(#heroCompassGrad)" opacity="0.5" />
            <circle cx="4" cy="15" r="0.5" fill="url(#heroCompassGrad)" opacity="0.5" />
            <circle cx="26" cy="15" r="0.5" fill="url(#heroCompassGrad)" opacity="0.5" />
            <defs>
              <linearGradient id="heroCompassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
              <linearGradient id="heroCompassGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="text-center md:text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            Stop guessing.
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Start scaling.
            </span>
          </h1>

          <div className="max-w-2xl md:mx-auto mb-10 text-left md:text-center text-xl leading-relaxed text-gray-600 clearfix">
            <img
              src={marnee11}
              alt="Marnee mascot"
              className="md:hidden float-right ml-4 mb-2 w-32 sm:w-36 drop-shadow-lg pointer-events-none"
            />
            <p>
              DNHub turns social signals into marketing decisions. What to post, when, and why, tailored to your brand.
            </p>
          </div>

          {/* Waitlist form */}
          <div id="hero-form" className="max-w-xl mx-auto mb-8">
            <WaitlistForm variant="light" />
          </div>

          <p className="text-gray-400 text-sm mb-6 md:mb-12">
            Apply for early access and be the first to try it.
          </p>

          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-gray-500 hover:text-violet-600 transition text-sm font-medium mb-8 md:mb-0"
          >
            or see how it works ↓
          </button>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <button
          onClick={() => scrollToSection("problem")}
          className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center text-gray-400 hover:text-violet-600 transition cursor-pointer"
        >
          <span className="text-xs mb-2 uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-current rounded-full animate-bounce" />
          </div>
        </button>
      </section>

      {/* Problem Section - Full Screen */}
      <section id="problem" className="min-h-screen flex items-center bg-gray-50 px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Mascot - Problem */}
        <img
          src={marnee12}
          alt="Marnee working"
          className="absolute -right-6 bottom-4 w-40 sm:w-48 md:w-52 lg:right-8 xl:right-16 lg:bottom-24 lg:w-48 xl:w-60 animate-wobble-slow opacity-80 lg:opacity-90 pointer-events-none drop-shadow-lg z-0"
        />
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-violet-600 font-medium text-sm uppercase tracking-widest mb-4 block">The Problem</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Marketing shouldn't feel like
                <span className="text-gray-400"> throwing darts in the dark</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">No clarity on what to post</h3>
                    <p className="text-gray-600">You're constantly guessing what content will resonate with your audience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Trends move too fast</h3>
                    <p className="text-gray-600">By the time you spot a trend, it's already old news in your niche.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Strategy feels overwhelming</h3>
                    <p className="text-gray-600">Building a content strategy from scratch takes time you don't have.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">73%</div>
                <p className="text-gray-600 text-sm">of founders struggle with content strategy</p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">15h</div>
                <p className="text-gray-600 text-sm">average weekly time spent on content planning</p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">60%</div>
                <p className="text-gray-600 text-sm">of social posts underperform expectations</p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">$0</div>
                <p className="text-gray-600 text-sm">budget for expensive marketing agencies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Full Screen */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-violet-600 via-indigo-700 to-cyan-600 px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-40 right-20 w-60 h-60 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-white rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center mb-16">
            <span className="text-purple-200 font-medium text-sm uppercase tracking-widest mb-4 block">The Solution</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              DNHub gives you clarity, not complexity
            </h2>
            <p className="text-purple-100 text-xl max-w-2xl mx-auto">
              We analyze what's working in your niche and turn it into a personalized strategy you can actually execute.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">AI-Powered Research</h3>
              <p className="text-purple-100">
                We scan thousands of posts in your niche to find what's actually working right now.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">Brand-First Strategy</h3>
              <p className="text-purple-100">
                Every suggestion is tailored to your unique tone, audience, and positioning.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">Ready-to-Execute Plans</h3>
              <p className="text-purple-100">
                Get complete content briefs with hooks, angles, and visual direction.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="bg-white text-violet-600 hover:bg-gray-100 px-8 py-4 rounded-full font-medium text-lg transition shadow-xl hover:scale-105"
            >
              See how it works
            </button>
          </div>
        </div>
      </section>

      {/* How it works Section - Full Screen */}
      <section id="how-it-works" className="min-h-screen flex items-center px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Mascot - How it works (desktop only) */}
        <img
          src={marnee13}
          alt="Marnee with ideas"
          className="hidden md:block absolute -right-6 top-20 w-36 sm:w-40 md:w-44 lg:right-12 xl:right-20 lg:top-28 lg:w-44 xl:w-56 animate-wobble-delay opacity-80 lg:opacity-90 pointer-events-none drop-shadow-lg z-0"
        />
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-20">
            <span className="text-violet-600 font-medium text-sm uppercase tracking-widest mb-4 block">How it works</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Three steps to <span className="font-serif italic">marketing clarity</span>
            </h2>
            <div className="text-gray-600 text-xl max-w-2xl md:mx-auto text-left md:text-center clearfix">
              <img
                src={marnee13}
                alt="Marnee with ideas"
                className="md:hidden float-right ml-4 mb-2 w-30 sm:w-50 drop-shadow-lg pointer-events-none"
              />
              <p style={{ textAlign: 'center' }}>
                From brand definition to a complete content strategy in minutes, not months.
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-violet-200 via-indigo-200 to-cyan-200" />

            <div className="grid md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                  <h3 className="font-bold text-2xl mb-4">Define your brand</h3>
                  <p className="text-gray-600 mb-6">
                    Complete our branding tests. We match your answers with real-time social media research from your niche.
                  </p>
                  <div className="bg-violet-50 rounded-xl p-4">
                    <p className="text-violet-700 text-sm font-medium">
                      Your goals, tone, audience & positioning meet what's actually working.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                    <span className="text-white font-bold text-2xl">2</span>
                  </div>
                  <h3 className="font-bold text-2xl mb-4">
                    <span className="font-serif italic text-violet-600">Marnee</span> builds your strategy
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our AI consultant guides you through the entire process. She suggests angles, formats, hooks and explains why.
                  </p>
                  <div className="bg-cyan-50 rounded-xl p-4">
                    <p className="text-cyan-700 text-sm font-medium">
                      You approve, tweak or discard. You stay in control.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30">
                    <span className="text-white font-bold text-2xl">3</span>
                  </div>
                  <h3 className="font-bold text-2xl mb-4">Execute from your dashboard</h3>
                  <p className="text-gray-600 mb-6">
                    All approved decisions live in your DNHub dashboard. View as calendar or kanban board.
                  </p>
                  <div className="bg-gradient-to-r from-violet-50 to-cyan-50 rounded-xl p-4">
                    <p className="bg-gradient-to-r from-violet-700 via-indigo-700 to-cyan-700 bg-clip-text text-transparent text-sm font-medium">
                      One clear overview. No chaos. No guesswork.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo 1 - Brand Discovery Test */}
      <section id="demo-test" className="min-h-screen flex items-center px-6 md:px-12 py-20 bg-gradient-to-br from-violet-50 via-white to-cyan-50">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Video */}
            <div className="order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <video
                  src={videoTest}
                  className="w-full aspect-video object-cover"
                  controls
                  muted
                  playsInline
                  preload="auto"
                />
              </div>
            </div>
            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <span className="text-violet-600 font-medium text-sm uppercase tracking-widest">Step One</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Brand Discovery <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Test</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
                Start by completing a quick questionnaire. Our AI learns about your brand, goals, audience, and tone to create a personalized strategy tailored just for you.
              </p>
              <div className="bg-violet-100/50 rounded-2xl p-5 border border-violet-200/50">
                <p className="text-violet-700 font-medium">
                  This is where your journey begins — tell us who you are, and we'll show you how to grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo 2 - Chat with Marnee */}
      <section id="demo-chat" className="min-h-screen flex items-center px-6 md:px-12 py-20 bg-white">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <span className="text-cyan-600 font-medium text-sm uppercase tracking-widest">Step Two</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Chat with <span className="font-serif italic text-violet-600">Marnee</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
                After the questionnaire, Marnee becomes your AI marketing consultant. She'll ask questions, understand your needs deeper, and build your complete campaign strategy.
              </p>
              <div className="bg-cyan-100/50 rounded-2xl p-5 border border-cyan-200/50">
                <p className="text-cyan-700 font-medium">
                  Marnee doesn't just generate — she thinks, plans, and explains every recommendation.
                </p>
              </div>
            </div>
            {/* Video */}
            <div>
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <video
                  src={videoChat}
                  className="w-full aspect-video object-cover"
                  controls
                  muted
                  playsInline
                  preload="auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo 3 - Content Calendar */}
      <section id="demo-calendar" className="min-h-screen flex items-center px-6 md:px-12 py-20 bg-gradient-to-br from-cyan-50 via-white to-violet-50">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Video */}
            <div className="order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <video
                  src={videoCalendar}
                  className="w-full aspect-video object-cover"
                  controls
                  muted
                  playsInline
                  preload="auto"
                />
              </div>
            </div>
            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <span className="text-violet-600 font-medium text-sm uppercase tracking-widest">Step Three</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Content <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Calendar</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
                Marnee generates a complete publication calendar with dates, content ideas, and detailed instructions for each post. Everything you need to execute your strategy.
              </p>
              <div className="bg-gradient-to-r from-violet-100/50 to-cyan-100/50 rounded-2xl p-5 border border-violet-200/50">
                <p className="bg-gradient-to-r from-violet-700 via-indigo-700 to-cyan-700 bg-clip-text text-transparent font-medium">
                  See your entire month at a glance — what to post, when, and exactly how.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo 4 - Campaign Dashboard */}
      <section id="demo-dashboard" className="min-h-screen flex items-center px-6 md:px-12 py-20 bg-white">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-500/30">
                  <span className="text-white font-bold text-2xl">4</span>
                </div>
                <span className="text-gray-600 font-medium text-sm uppercase tracking-widest">Coming Soon</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Campaign <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Dashboard</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
                View all your active campaigns, track your task list, and monitor progress from a single dashboard. This feature is currently in development.
              </p>
              <div className="bg-gray-100 rounded-2xl p-5 border border-gray-200">
                <p className="text-gray-700 font-medium">
                  Your command center for marketing execution — coming very soon.
                </p>
              </div>
            </div>
            {/* Image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <img
                  src={imgCampaign}
                  alt="Campaign Dashboard"
                  className="w-full aspect-video object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                In Development
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Full Screen */}
      <section id="features" className="min-h-screen flex items-center bg-gray-50 px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-violet-600 font-medium text-sm uppercase tracking-widest mb-4 block">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for <span className="font-serif italic bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">speed, clarity</span> and consistency
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-100 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Trend Detection</h3>
              <p className="text-gray-600">
                Identify what's working right now in your niche with real-time social analysis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-100 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Brand Intelligence</h3>
              <p className="text-gray-600">
                Your strategy adapts to your unique tone, audience and market positioning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-100 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">AI Strategy Guidance</h3>
              <p className="text-gray-600">
                <span className="font-serif italic text-violet-600">Marnee</span> explains, suggests and helps you decide — not just generate.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-100 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Strategy Dashboard</h3>
              <p className="text-gray-600">
                All decisions in one place. Calendar and Kanban views to keep you organized.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-100 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Content-Ready Outputs</h3>
              <p className="text-gray-600">
                Ideas, titles, copy and visual direction. Ready for UGC, AI or talking head production.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-100 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Save Hours Weekly</h3>
              <p className="text-gray-600">
                Reduce content planning from 15+ hours to under 2 hours per week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Marnee Section - Full Screen */}
      <section id="marnee" className="min-h-screen flex items-center px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-cyan-50 -z-10" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-200 via-indigo-200 to-cyan-200 rounded-full blur-3xl opacity-30 -z-10" />

        {/* Mascot - Meet Marnee */}
        <img
          src={marnee15}
          alt="Marnee presenting"
          className="absolute left-1/2 -translate-x-1/2 bottom-4 w-40 sm:w-48 md:w-52 lg:bottom-16 lg:w-56 xl:w-72 animate-wobble opacity-95 pointer-events-none drop-shadow-xl z-10"
        />

        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-violet-600 font-medium text-sm uppercase tracking-widest mb-4 block">Your AI Partner</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Meet <span className="font-serif italic text-violet-600">Marnee</span>
              </h2>
              <p className="text-2xl text-gray-700 font-medium mb-6">Your AI marketing consultant.</p>

              <div className="space-y-6 mb-10">
                <p className="text-gray-600 text-lg">
                  <span className="font-serif italic text-violet-600">Marnee</span> helps you think, not just post. She explains the reasoning behind every suggestion, so you understand what works and why.
                </p>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm mb-4 font-medium">Ask her anything:</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-violet-500 rounded-full" />
                      <p className="text-gray-700 italic">"What content should we test next week?"</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                      <p className="text-gray-700 italic">"Rewrite this in a confident but warm tone."</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-violet-500 rounded-full" />
                      <p className="text-gray-700 italic">"Why is this format performing better?"</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg font-medium bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Strategy with context. Decisions with confidence.
              </p>
            </div>

            {/* Marnee visual */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                {/* Chat header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <span className="text-white font-serif italic font-bold text-xl">M</span>
                  </div>
                  <div>
                    <p className="font-serif italic font-bold text-xl text-violet-600">Marnee</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-gray-500">AI Marketing Consultant</span>
                    </div>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Based on your brand positioning and what's trending in your niche, I recommend testing short-form educational content this week. Here's why...
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Your competitors are seeing <span className="font-semibold text-violet-600">40% higher engagement</span> with "myth-busting" hooks. Want me to generate 5 variations for your brand?
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-2xl rounded-tr-sm p-4 max-w-[85%] ml-auto">
                    <p className="text-white text-sm">Yes, let's try that approach!</p>
                  </div>
                </div>

                {/* Input */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-full px-5 py-3">
                    <input
                      type="text"
                      placeholder="Ask Marnee anything..."
                      className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                      disabled
                    />
                    <button className="w-10 h-10 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for Section - Full Screen */}
      <section className="min-h-screen flex items-center bg-gray-900 px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-white rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 border border-white rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center mb-16">
            <span className="text-violet-400 font-medium text-sm uppercase tracking-widest mb-4 block">Who it's for</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built for those who need clarity,<br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">not complexity</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: "Early-stage startups", desc: "Get your marketing foundation right from day one" },
              { title: "Founders who need clarity", desc: "Stop second-guessing every content decision" },
              { title: "Social media managers", desc: "Streamline your workflow with AI-powered insights" },
              { title: "Small teams", desc: "No marketing department? No problem." },
              { title: "Multi-brand businesses", desc: "Manage multiple brand strategies in one place" },
              { title: "Agencies & consultants", desc: "Deliver structured strategies at scale" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-violet-500/50 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => scrollToSection("hero-form")}
              className="bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 hover:from-violet-600 hover:via-indigo-600 hover:to-cyan-600 text-white px-10 py-5 rounded-full font-medium text-lg transition shadow-xl shadow-violet-500/30 hover:scale-105"
            >
              Join the waitlist today
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Full Screen */}
      <section className="min-h-screen flex items-center justify-center px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-700 to-cyan-600" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to build your
            <br />
            <span className="font-serif italic">marketing strategy</span> today?
          </h2>
          <p className="text-purple-100 text-xl mb-12 max-w-2xl mx-auto">
            From zero clarity to a structured marketing plan, guided by AI. Be the first to experience DNHub.
          </p>

          {/* Waitlist form */}
          <div className="max-w-xl mx-auto">
            <WaitlistForm variant="dark" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <Logo dark={false} size="large" />
              <p className="text-gray-400 mt-4 max-w-md">
                DNHub turns social signals into marketing decisions — what to post, when, and why, tailored to your brand.
              </p>
              <div className="flex gap-4 mt-6">
                <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection("features")} className="text-gray-400 hover:text-white transition">Features</button></li>
                <li><button onClick={() => scrollToSection("how-it-works")} className="text-gray-400 hover:text-white transition">How it works</button></li>
                <li><button className="text-gray-400 hover:text-white transition">Roadmap</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><button className="text-gray-400 hover:text-white transition">About</button></li>
                <li><button className="text-gray-400 hover:text-white transition">Blog</button></li>
                <li><button className="text-gray-400 hover:text-white transition">Contact</button></li>
                <li><button className="text-gray-400 hover:text-white transition">Privacy</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">&copy; 2026 DNHub. All rights reserved.</p>
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <button className="hover:text-white transition">Terms</button>
              <button className="hover:text-white transition">Privacy</button>
              <button className="hover:text-white transition">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
