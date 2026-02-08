import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
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

// Hero video
import heroVideo from "../assets/videos/0207.mp4";

export default function PresentationPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [navTheme, setNavTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      // Calculate progress from 0 to 1 as user scrolls through hero section
      const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
      setScrollProgress(progress);
      setShowNav(scrollY >= heroHeight * 0.2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => setIsPageLoaded(true), 80);
    document.body.classList.add("no-scrollbar");

    AOS.init({
      duration: 900,
      easing: "ease-out",
      once: false,
      offset: 120,
    });
    AOS.refresh();

    const themedSections = Array.from(document.querySelectorAll("[data-nav]"));
    let activeTheme = "light";
    const navObserver = new IntersectionObserver(
      (entries) => {
        let bestEntry = null;
        entries.forEach((entry) => {
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        });
        if (bestEntry && bestEntry.isIntersecting) {
          const nextTheme = bestEntry.target.getAttribute("data-nav") || "light";
          if (nextTheme !== activeTheme) {
            activeTheme = nextTheme;
            setNavTheme(nextTheme);
          }
        }
      },
      { threshold: [0.2, 0.4, 0.6] }
    );
    themedSections.forEach((section) => navObserver.observe(section));

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const isResponsive = window.matchMedia("(max-width: 768px)").matches;
    const allowSnapScroll = finePointer && !prefersReduced && !isResponsive;
    const allowMobileSnap = !finePointer && !prefersReduced && isResponsive;
    const sectionNodes = Array.from(document.querySelectorAll("[data-snap]"));
    let isSnapping = false;
    let lastSnapAt = 0;
    let snapTimeout;
    let targetY = null;

    const getCurrentIndex = () => {
      const current = window.scrollY + window.innerHeight * 0.5;
      let idx = sectionNodes.findIndex((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        return current >= top && current < bottom;
      });
      if (idx === -1) idx = 0;
      return idx;
    };

    const unlockSnap = () => {
      isSnapping = false;
      targetY = null;
      if (snapTimeout) window.clearTimeout(snapTimeout);
    };

    const snapToIndex = (index) => {
      if (!sectionNodes[index]) return;
      isSnapping = true;
      targetY = sectionNodes[index].offsetTop;
      window.scrollTo({ top: targetY, behavior: "smooth" });
      snapTimeout = window.setTimeout(unlockSnap, 1100);
    };

    const onWheel = (event) => {
      if (prefersReduced || !finePointer) return;
      event.preventDefault();
      if (isSnapping) return;
      const now = Date.now();
      const delta = Math.abs(event.deltaY);
      if (delta < 24 || now - lastSnapAt < 900) return;
      lastSnapAt = now;
      const direction = event.deltaY > 0 ? 1 : -1;
      const currentIndex = getCurrentIndex();
      const nextIndex = Math.min(
        sectionNodes.length - 1,
        Math.max(0, currentIndex + direction)
      );
      if (nextIndex !== currentIndex) {
        snapToIndex(nextIndex);
      }
    };

    const onScroll = () => {
      if (!isSnapping || targetY === null) return;
      if (Math.abs(window.scrollY - targetY) < 2) {
        unlockSnap();
      }
    };

    if (allowSnapScroll) {
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("scroll", onScroll);
    }
    let mobileSnapTimeout;
    const onMobileScroll = () => {
      if (!allowMobileSnap) return;
      if (mobileSnapTimeout) window.clearTimeout(mobileSnapTimeout);
      mobileSnapTimeout = window.setTimeout(() => {
        const currentIndex = getCurrentIndex();
        const targetSection = sectionNodes[currentIndex];
        if (targetSection) {
          window.scrollTo({ top: targetSection.offsetTop, behavior: "smooth" });
        }
      }, 120);
    };
    if (allowMobileSnap) {
      window.addEventListener("scroll", onMobileScroll, { passive: true });
    }

    return () => {
      window.clearTimeout(loadTimer);
      AOS.refreshHard();
      navObserver.disconnect();
      document.body.classList.remove("no-scrollbar");
      if (allowSnapScroll) {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("scroll", onScroll);
      }
      if (allowMobileSnap) {
        window.removeEventListener("scroll", onMobileScroll);
      }
      if (mobileSnapTimeout) window.clearTimeout(mobileSnapTimeout);
      if (snapTimeout) window.clearTimeout(snapTimeout);
    };
  }, []);

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
          <div className={`flex items-center gap-2 px-6 py-4 rounded-full ${isLight ? 'bg-[#c7ccfe]/10 text-[#65589C]' : 'bg-white/20 text-white'}`}>
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
        <div className={`flex flex-col sm:flex-row gap-3 p-3 sm:p-2 rounded-2xl sm:rounded-full ${isLight ? 'bg-white shadow-xl shadow-[#3a2e81]/10 border border-gray-100 glass-card' : 'bg-white/10 backdrop-blur-sm border border-white/20 glass-card-dark'}`}>
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
                ? 'bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] hover:from-[#6f63f1] hover:to-[#6046e5] text-white shadow-lg shadow-[#c7ccfe]/30'
                : 'bg-white text-[#65589C] hover:bg-gray-100'
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
          <p className={`mt-3 text-sm ${isLight ? 'text-[#65589C]' : 'text-[rgba(203,188,198,0.98)]'}`}>{errorMessage}</p>
        )}
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans glass-page">
      {/* Custom animation styles */}
      <style>{`
        html { scroll-behavior: smooth; }
        html, body { height: 100%; }
        body { overscroll-behavior-y: contain; }
        body.no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        body.no-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        .glass-page {
          background:
            radial-gradient(circle at 20% 10%, rgba(199, 204, 254, 0.18), transparent 55%),
            radial-gradient(circle at 80% 20%, rgba(111, 99, 241, 0.16), transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(58, 46, 129, 0.22), transparent 55%);
        }
        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.05));
          border: 1px solid rgba(255, 255, 255, 0.28);
          box-shadow:
            0 20px 60px rgba(58, 46, 129, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(18px) saturate(160%);
        }
        .glass-card-dark {
          background: linear-gradient(135deg, rgba(58, 46, 129, 0.45), rgba(96, 70, 229, 0.25));
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow:
            0 22px 70px rgba(58, 46, 129, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px) saturate(140%);
        }
        .page-fade {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 1200ms ease, transform 1200ms ease;
        }
        .page-fade--in {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .page-fade,
          [data-aos] {
            transition: none;
            transform: none;
            opacity: 1;
          }
        }
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

      {/* Navbar - Fixed, appears on scroll */}
      <nav
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-4 bg-transparent z-50 transition-all duration-300"
        style={{
          opacity: showNav ? 1 : 0,
          transform: `translateY(${showNav ? "0%" : "-100%"})`,
          pointerEvents: showNav ? 'auto' : 'none'
        }}
      >
        <Logo dark={navTheme === "light"} />
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full transition ${navTheme === "dark" ? "text-white/90 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("how-it-works")}
            className={`transition text-sm font-medium ${navTheme === "dark" ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className={`transition text-sm font-medium ${navTheme === "dark" ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("marnee")}
            className={`transition text-sm font-medium ${navTheme === "dark" ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            Meet Marnee
          </button>
        </div>
        
        {isMenuOpen && (
          <div className={`absolute top-full right-6 mt-3 w-52 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl ${
            navTheme === "dark" ? "bg-[#3a2e81]/80 text-white" : "bg-white/90 text-gray-900"
          }`}>
            <div className="flex flex-col py-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToSection("how-it-works");
                }}
                className={`px-4 py-2 text-left text-sm font-medium transition ${
                  navTheme === "dark" ? "hover:text-white" : "hover:text-gray-900"
                }`}
              >
                How it works
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToSection("features");
                }}
                className={`px-4 py-2 text-left text-sm font-medium transition ${
                  navTheme === "dark" ? "hover:text-white" : "hover:text-gray-900"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToSection("marnee");
                }}
                className={`px-4 py-2 text-left text-sm font-medium transition ${
                  navTheme === "dark" ? "hover:text-white" : "hover:text-gray-900"
                }`}
              >
                Meet Marnee
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className={`page-fade ${isPageLoaded ? "page-fade--in" : ""}`}>
      {/* Hero Section - Full Screen */}
      <section data-snap data-nav="dark" className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-24 pt-6 sm:pt-8 pb-10 sm:pb-20 relative overflow-hidden bg-gradient-to-br from-[#3a2e81] via-[#4632a9] to-[#c7ccfe]">
        <div className="absolute inset-0 bg-white/5" />
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#c7ccfe]/20 via-[#6f63f1]/10 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#3a2e81]/20 via-[#6046e5]/10 to-transparent rounded-full blur-3xl -z-10" />

        {/* Hero Logo - Large and prominent */}
        <div
          data-aos="fade-down"
          className="mb-8 md:mb-12 transition-all duration-300"
          style={{
            opacity: 1 - scrollProgress * 0.8,
            transform: `scale(${1 - scrollProgress * 0.3})`
          }}
        >
          <Logo dark={false} size="large" />
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto w-full">
          {/* Left side - Text content */}
          <div className="text-left relative z-10">
            <h1 data-aos="fade-right" className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight text-white">
              Stop guessing.
              <br />
              <span className="bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent">
                Start scaling.
              </span>
            </h1>

            <div data-aos="fade-right" data-aos-delay="100" className="mb-5 sm:mb-8 max-w-lg">
              <img
                src={marnee11}
                alt="Marnee mascot"
                className="lg:hidden float-right ml-3 mb-2 w-28 sm:w-36 drop-shadow-2xl pointer-events-none"
              />
              <p className="text-sm sm:text-lg md:text-xl leading-relaxed text-[rgba(203,188,198,0.98)]">
                DNHub turns social signals into marketing decisions. What to post, when, and why, tailored to your brand.
              </p>
            </div>

            <button
              onClick={() => scrollToSection("how-it-works")}
              className="bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] hover:from-[#6f63f1] hover:to-[#6046e5] text-white px-7 sm:px-10 py-3.5 sm:py-5 rounded-full font-semibold text-sm sm:text-lg transition shadow-xl shadow-[#c7ccfe]/30 hover:scale-105"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              See how it works
            </button>

            {/* Hero Video - Mobile */}
            <div className="lg:hidden mt-6" data-aos="zoom-in" data-aos-delay="150">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white glass-card">
                <video
                  src={heroVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto aspect-video object-cover pointer-events-none"
                  style={{ userSelect: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Right side - GIF showcase */}
          <div className="relative hidden lg:block" data-aos="zoom-in">
            {/* GIF container with decorative elements */}
            <div className="relative">
              {/* Decorative background shapes */}
              <div className="absolute -top-8 -right-8 w-full h-full bg-gradient-to-br from-[#c7ccfe]/30 to-[#6f63f1]/20 rounded-3xl transform rotate-3" />
              <div className="absolute -bottom-8 -left-8 w-full h-full bg-gradient-to-tr from-[#6f63f1]/20 to-[#c7ccfe]/10 rounded-3xl transform -rotate-2" />

              {/* Main Video - autoplay, loop, no controls */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white glass-card">
                <video
                  src={heroVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto pointer-events-none"
                  style={{ userSelect: 'none' }}
                />
              </div>
            </div>

            {/* Mascot - Desktop positioned nicely */}
            <img
              src={marnee11}
              alt="Marnee mascot"
              className="absolute -bottom-16 -left-20 w-36 xl:w-44 animate-wobble opacity-95 pointer-events-none drop-shadow-2xl z-20"
            />
            <img
              src={marnee14}
              alt="Marnee with notebook"
              className="absolute -top-12 -right-16 w-32 xl:w-40 animate-wobble-delay opacity-95 pointer-events-none drop-shadow-2xl z-20"
            />
          </div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <button
          onClick={() => scrollToSection("problem")}
          className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center text-[rgba(203,188,198,0.98)] hover:text-white transition cursor-pointer"
        >
          <span className="text-xs mb-2 uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-current rounded-full animate-bounce" />
          </div>
        </button>
      </section>

      {/* Problem Section - Full Screen */}
      <section id="problem" data-snap data-nav="light" className="min-h-screen flex items-center bg-gray-50 px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Mascot - Problem */}
        <img
          src={marnee12}
          alt="Marnee working"
          className="absolute -right-6 bottom-4 w-40 sm:w-48 md:w-52 lg:right-8 xl:right-16 lg:bottom-24 lg:w-48 xl:w-60 animate-wobble-slow opacity-80 lg:opacity-90 pointer-events-none drop-shadow-lg z-50"
        />
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <span className="text-[#65589C] font-medium text-sm uppercase tracking-widest mb-4 block">The Problem</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Marketing shouldn't feel like
                <span className="text-gray-400"> throwing darts in the dark</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#c7ccfe]/15 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-[#65589C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">No clarity on what to post</h3>
                    <p className="text-gray-600">You're constantly guessing what content will resonate with your audience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#c7ccfe]/15 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-[#65589C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Trends move too fast</h3>
                    <p className="text-gray-600">By the time you spot a trend, it's already old news in your niche.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#c7ccfe]/15 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-[#65589C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="grid grid-cols-2 gap-6" data-aos="fade-left">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center glass-card" data-aos="fade-up" data-aos-delay="0">
                <div className="text-4xl font-bold bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent mb-2">73%</div>
                <p className="text-gray-600 text-sm">of founders struggle with content strategy</p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center glass-card" data-aos="fade-up" data-aos-delay="100">
                <div className="text-4xl font-bold bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent mb-2">15h</div>
                <p className="text-gray-600 text-sm">average weekly time spent on content planning</p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center glass-card" data-aos="fade-up" data-aos-delay="200">
                <div className="text-4xl font-bold bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent mb-2">60%</div>
                <p className="text-gray-600 text-sm">of social posts underperform expectations</p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center glass-card" data-aos="fade-up" data-aos-delay="300">
                <div className="text-4xl font-bold bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent mb-2">$0</div>
                <p className="text-gray-600 text-sm">budget for expensive marketing agencies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Full Screen */}
      <section data-snap data-nav="dark" className="min-h-screen flex items-center bg-gradient-to-br from-[#3a2e81] via-[#6046e5] to-[#6f63f1] px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-40 right-20 w-60 h-60 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-white rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-[rgba(203,188,198,0.98)] font-medium text-sm uppercase tracking-widest mb-4 block">The Solution</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              DNHub gives you clarity, not complexity
            </h2>
            <p className="text-[rgba(203,188,198,0.98)] text-xl max-w-2xl mx-auto">
              We analyze what's working in your niche and turn it into a personalized strategy you can actually execute.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition glass-card-dark" data-aos="fade-up" data-aos-delay="0">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[rgba(203,188,198,0.98)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">AI-Powered Research</h3>
              <p className="text-[rgba(203,188,198,0.98)]">
                We scan thousands of posts in your niche to find what's actually working right now.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition glass-card-dark" data-aos="fade-up" data-aos-delay="100">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[rgba(203,188,198,0.98)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">Brand-First Strategy</h3>
              <p className="text-[rgba(203,188,198,0.98)]">
                Every suggestion is tailored to your unique tone, audience, and positioning.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition glass-card-dark" data-aos="fade-up" data-aos-delay="200">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[rgba(203,188,198,0.98)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">Ready-to-Execute Plans</h3>
              <p className="text-[rgba(203,188,198,0.98)]">
                Get complete content briefs with hooks, angles, and visual direction.
              </p>
            </div>
          </div>

          
        </div>
      </section>

      {/* How it works Section - Full Screen */}
      <section id="how-it-works" data-snap data-nav="light" className="min-h-screen flex items-center px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Mascot - How it works (desktop only) */}
        <img
          src={marnee13}
          alt="Marnee with ideas"
          className="hidden md:block absolute -right-6 top-20 w-36 sm:w-40 md:w-44 lg:right-12 xl:right-20 lg:top-28 lg:w-44 xl:w-56 animate-wobble-delay opacity-80 lg:opacity-90 pointer-events-none drop-shadow-lg z-0"
        />
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="text-[#65589C] font-medium text-sm uppercase tracking-widest mb-4 block">How it works</span>
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
            
            <div className="grid md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow h-full glass-card" data-aos="fade-up" data-aos-delay="0">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#c7ccfe]/30">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                  <h3 className="font-bold text-2xl mb-4">Define your brand</h3>
                  <p className="text-gray-600 mb-6">
                    Complete our branding tests. We match your answers with real-time social media research from your niche.
                  </p>
                  <div className="bg-[#c7ccfe]/8 rounded-xl p-4">
                    <p className="text-[#65589C] text-sm font-medium">
                      Your goals, tone, audience & positioning meet what's actually working.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow h-full glass-card" data-aos="fade-up" data-aos-delay="100">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#6f63f1] to-[#6046e5] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#6f63f1]/30">
                    <span className="text-white font-bold text-2xl">2</span>
                  </div>
                  <h3 className="font-bold text-2xl mb-4">
                    <span className="font-serif italic text-[#65589C]">Marnee</span> builds your strategy
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our AI consultant guides you through the entire process. She suggests angles, formats, hooks and explains why.
                  </p>
                  <div className="bg-[#6f63f1]/8 rounded-xl p-4">
                    <p className="text-[#65589C] text-sm font-medium">
                      You approve, tweak or discard. You stay in control.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow h-full glass-card" data-aos="fade-up" data-aos-delay="200">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#c7ccfe]/30">
                    <span className="text-white font-bold text-2xl">3</span>
                  </div>
                  <h3 className="font-bold text-2xl mb-4">Execute from your dashboard</h3>
                  <p className="text-gray-600 mb-6">
                    All approved decisions live in your DNHub dashboard. View as calendar or kanban board.
                  </p>
                  <div className="bg-gradient-to-r from-[#c7ccfe]/8 to-[#6f63f1]/8 rounded-xl p-4">
                    <p className="bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent text-sm font-medium">
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
      <section id="demo-test" data-snap data-nav="light" className="min-h-screen flex items-center px-6 md:px-12 py-20 bg-gradient-to-br from-[#c7ccfe]/6 via-white to-[#6f63f1]/6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Video */}
            <div className="order-2 lg:order-1" data-aos="fade-left">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 glass-card">
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
            <div className="order-1 lg:order-2" data-aos="fade-right">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-2xl flex items-center justify-center shadow-lg shadow-[#c7ccfe]/30">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <span className="text-[#65589C] font-medium text-sm uppercase tracking-widest">Step One</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Brand Discovery <span className="bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent">Test</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
                Start by completing a quick questionnaire. Our AI learns about your brand, goals, audience, and tone to create a personalized strategy tailored just for you.
              </p>
              <div className="bg-[#c7ccfe]/10 rounded-2xl p-5 border border-[#c7ccfe]/20">
                <p className="text-[#65589C] font-medium">
                  This is where your journey begins — tell us who you are, and we'll show you how to grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo 2 - Chat with Marnee */}
      <section id="demo-chat" data-snap data-nav="light" className="min-h-screen flex items-center px-6 md:px-12 py-20 bg-white">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div data-aos="fade-right">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-[#6f63f1] to-[#6046e5] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6f63f1]/30">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <span className="text-[#65589C] font-medium text-sm uppercase tracking-widest">Step Two</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Chat with <span className="font-serif italic text-[#65589C]">Marnee</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
                After the questionnaire, Marnee becomes your AI marketing consultant. She'll ask questions, understand your needs deeper, and build your complete campaign strategy.
              </p>
              <div className="bg-[#6f63f1]/10 rounded-2xl p-5 border border-[#6f63f1]/20">
                <p className="text-[#65589C] font-medium">
                  Marnee doesn't just generate — she thinks, plans, and explains every recommendation.
                </p>
              </div>
            </div>
            {/* Video */}
            <div data-aos="fade-left">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 glass-card">
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
      <section id="demo-calendar" data-snap data-nav="light" className="min-h-screen flex items-center px-6 md:px-12 py-20 bg-gradient-to-br from-[#6f63f1]/6 via-white to-[#c7ccfe]/6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Video */}
            <div className="order-2 lg:order-1" data-aos="fade-left">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 glass-card">
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
            <div className="order-1 lg:order-2" data-aos="fade-right">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-2xl flex items-center justify-center shadow-lg shadow-[#c7ccfe]/30">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <span className="text-[#65589C] font-medium text-sm uppercase tracking-widest">Step Three</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Content <span className="bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent">Calendar</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
                Marnee generates a complete publication calendar with dates, content ideas, and detailed instructions for each post. Everything you need to execute your strategy.
              </p>
              <div className="bg-gradient-to-r from-[#c7ccfe]/10 to-[#6f63f1]/10 rounded-2xl p-5 border border-[#c7ccfe]/20">
                <p className="bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent font-medium">
                  See your entire month at a glance — what to post, when, and exactly how.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo 4 - Campaign Dashboard */}
      <section id="demo-dashboard" data-snap data-nav="light" className="min-h-screen flex items-center px-6 md:px-12 py-20 bg-white">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div data-aos="fade-right">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg shadow-[#3a2e81]/30">
                  <span className="text-white font-bold text-2xl">4</span>
                </div>
                <span className="text-gray-600 font-medium text-sm uppercase tracking-widest">Coming Soon</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Campaign <span className="bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent">Dashboard</span>
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
            <div className="relative" data-aos="fade-left">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 glass-card">
                <img
                  src={imgCampaign}
                  alt="Campaign Dashboard"
                  className="w-full aspect-video object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 bg-[#6f63f1] text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                In Development
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Full Screen */}
      <section id="features" data-snap data-nav="light" className="min-h-screen flex items-center bg-gray-50 px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-[#65589C] font-medium text-sm uppercase tracking-widest mb-4 block">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for <span className="font-serif italic bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent">speed, clarity</span> and consistency
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#c7ccfe]/20 transition-all group glass-card" data-aos="fade-up" data-aos-delay="0">
              <div className="w-14 h-14 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#c7ccfe]/20 transition-all group glass-card" data-aos="fade-up" data-aos-delay="100">
              <div className="w-14 h-14 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#c7ccfe]/20 transition-all group glass-card" data-aos="fade-up" data-aos-delay="200">
              <div className="w-14 h-14 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">AI Strategy Guidance</h3>
              <p className="text-gray-600">
                <span className="font-serif italic text-[#65589C]">Marnee</span> explains, suggests and helps you decide — not just generate.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#c7ccfe]/20 transition-all group glass-card" data-aos="fade-up" data-aos-delay="300">
              <div className="w-14 h-14 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#c7ccfe]/20 transition-all group glass-card" data-aos="fade-up" data-aos-delay="400">
              <div className="w-14 h-14 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#c7ccfe]/20 transition-all group glass-card" data-aos="fade-up" data-aos-delay="500">
              <div className="w-14 h-14 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section id="marnee" data-snap data-nav="light" className="min-h-screen flex items-center px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#c7ccfe]/6 via-white to-[#6f63f1]/6 -z-10" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#c7ccfe]/30 via-[#6f63f1]/30 to-[#6046e5]/30 rounded-full blur-3xl opacity-30 -z-10" />

        {/* Mascot - Meet Marnee */}
        <img
          src={marnee15}
          alt="Marnee presenting"
          className="absolute left-1/2 -translate-x-1/2 bottom-4 w-40 sm:w-48 md:w-52 lg:bottom-16 lg:w-56 xl:w-72 animate-wobble opacity-95 pointer-events-none drop-shadow-xl z-10"
        />

        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <span className="text-[#65589C] font-medium text-sm uppercase tracking-widest mb-4 block">Your AI Partner</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Meet <span className="font-serif italic text-[#65589C]">Marnee</span>
              </h2>
              <p className="text-2xl text-gray-700 font-medium mb-6">Your AI marketing consultant.</p>

              <div className="space-y-6 mb-10">
                <p className="text-gray-600 text-lg">
                  <span className="font-serif italic text-[#65589C]">Marnee</span> helps you think, not just post. She explains the reasoning behind every suggestion, so you understand what works and why.
                </p>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 glass-card">
                  <p className="text-gray-500 text-sm mb-4 font-medium">Ask her anything:</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#c7ccfe] rounded-full" />
                      <p className="text-gray-700 italic">"What content should we test next week?"</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#6f63f1] rounded-full" />
                      <p className="text-gray-700 italic">"Rewrite this in a confident but warm tone."</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#c7ccfe] rounded-full" />
                      <p className="text-gray-700 italic">"Why is this format performing better?"</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg font-medium bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent">
                Strategy with context. Decisions with confidence.
              </p>
            </div>

            {/* Marnee visual */}
            <div className="relative" data-aos="fade-left">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 glass-card">
                {/* Chat header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-full flex items-center justify-center shadow-lg shadow-[#c7ccfe]/30">
                    <span className="text-white font-serif italic font-bold text-xl">M</span>
                  </div>
                  <div>
                    <p className="font-serif italic font-bold text-xl text-[#65589C]">Marnee</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#c7ccfe] rounded-full animate-pulse" />
                      <span className="text-sm text-gray-500">AI Marketing Consultant</span>
                    </div>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 max-w-[85%] glass-card">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Based on your brand positioning and what's trending in your niche, I recommend testing short-form educational content this week. Here's why...
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 max-w-[85%] glass-card">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Your competitors are seeing <span className="font-semibold text-[#65589C]">40% higher engagement</span> with "myth-busting" hooks. Want me to generate 5 variations for your brand?
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-2xl rounded-tr-sm p-4 max-w-[85%] ml-auto">
                    <p className="text-white text-sm">Yes, let's try that approach!</p>
                  </div>
                </div>

                {/* Input */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-full px-5 py-3 glass-card">
                    <input
                      type="text"
                      placeholder="Ask Marnee anything..."
                      className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                      disabled
                    />
                    <button className="w-10 h-10 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-full flex items-center justify-center">
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
      <section data-snap data-nav="dark" className="min-h-screen flex items-center bg-gray-900 px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-white rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 border border-white rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-[#65589C] font-medium text-sm uppercase tracking-widest mb-4 block">Who it's for</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built for those who need clarity,<br />
              <span className="bg-gradient-to-br from-[#6046e5] via-[#6f63f1] to-[#eef0ff] bg-clip-text text-transparent">not complexity</span>
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
                data-aos="fade-up"
                data-aos-delay={index * 80}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-[#c7ccfe]/50 transition-all group glass-card-dark"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#c7ccfe] to-[#6f63f1] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          
        </div>
      </section>

      {/* Final CTA Section - Full Screen */}
      <section data-snap data-nav="dark" className="min-h-screen flex items-center justify-center px-6 md:px-12 py-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a2e81] via-[#6046e5] to-[#6f63f1]" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#6f63f1]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#3a2e81]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to build your
            <br />
            <span className="font-serif italic">marketing strategy</span> today?
          </h2>
          <p data-aos="fade-up" data-aos-delay="100" className="text-[rgba(203,188,198,0.98)] text-xl mb-12 max-w-2xl mx-auto">
            From zero clarity to a structured marketing plan, guided by AI. Be the first to experience DNHub.
          </p>

          {/* Waitlist form */}
          <div className="max-w-xl mx-auto" data-aos="zoom-in" data-aos-delay="200">
            <WaitlistForm variant="dark" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer data-snap data-nav="dark" className="px-6 md:px-12 py-16 bg-gray-900 text-white" data-aos="fade-up">
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
    </div>
  );
}
