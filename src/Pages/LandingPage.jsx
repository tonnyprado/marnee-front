import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="absolute top-6 left-8 text-4xl font-extrabold font-serif text-white">
        DnHub
      </div>

      {/* Step text */}
      <p className="text-xs tracking-widest text-blue-400 mb-2 uppercase">
        Step 1: Take your personal brand test
      </p>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
        Discover Your{" "}
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Brand Personality
        </span>
      </h1>

      {/* Description */}
      <p className="text-gray-300 text-center max-w-xl mb-8">
        This test will help you identify your core values, strengths, and what
        you truly want to communicate so that any strategy you build is aligned
        with your essence and purpose. It helps our AI understand your style,
        tone, and brand identity. It only takes 20 minutes.
      </p>

      {/* CTA Button */}
      <button className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition" onClick={() => (window.location.href = "/auth")}>
        Sign up to start your test
      </button>

      {/* Progress Bar (optional placeholder) */}
      <div className="absolute bottom-8 w-2/3">
        <div className="h-1 bg-gray-800 rounded">
          <div className="h-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded w-[0%]"></div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">0%</p>
      </div>
    </div>
  );
}
