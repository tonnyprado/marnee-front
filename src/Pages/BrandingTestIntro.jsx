import React from "react";
import Logo from "../Component/Logo";

export default function BrandTestIntro() {
  const handleStart = () => {
    window.location.href = "/brand-test/questions";
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-40" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30" />

      {/* Logo */}
      <div className="absolute top-6 left-8">
        <Logo dark={true} />
      </div>

      {/* Step badge */}
      <div className="mb-6">
        <span className="bg-pink-50 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
          Step 2: Begin your personalized brand test
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 leading-tight">
        Let's Discover Your{" "}
        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Unique Brand Voice
        </span>
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-xl mb-10 text-lg leading-relaxed">
        Our AI-powered test analyzes your tone, values, and personality traits
        to design a brand identity that feels authentic and powerful.
        This step will guide us to understand your communication style and core message.
        Ready to start your journey?
      </p>

      {/* CTA Button */}
      <button
        onClick={handleStart}
        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium px-8 py-4 rounded-full transition shadow-lg shadow-purple-500/25"
      >
        Start Test
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-8 w-2/3 max-w-md">
        <div className="h-1.5 bg-gray-100 rounded-full">
          <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-[0%]"></div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right">0%</p>
      </div>
    </div>
  );
}
