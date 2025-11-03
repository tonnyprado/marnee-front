import React from "react";

export default function BrandTestIntro() {
  const handleStart = () => {
    // simulamos ir al test (aún no implementado)
    window.location.href = "/brand-test/questions";
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative">
      {/* Logo */}
      <div className="absolute top-6 left-8 text-4xl font-extrabold font-serif text-white">
        DnHub
      </div>

      {/* Background glow */}
      <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 bg-[radial-gradient(circle_at_center,_#f472b6,_#3b82f6,_transparent_70%)] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-0 h-72 w-72 bg-[radial-gradient(circle_at_center,_#3b82f6,_#f472b6,_transparent_70%)] opacity-60 blur-3xl" />

      {/* Step text */}
      <p className="text-xs tracking-widest text-blue-400 mb-3 uppercase">
        Step 2: Begin your personalized brand test
      </p>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
        Let’s Discover Your{" "}
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Unique Brand Voice
        </span>
      </h1>

      {/* Description */}
      <p className="text-gray-300 text-center max-w-xl mb-10">
        Our AI-powered test analyzes your tone, values, and personality traits
        to design a brand identity that feels authentic and powerful.  
        This step will guide us to understand your communication style and core message.  
        Ready to start your journey?
      </p>

      {/* CTA Button */}
      <button
        onClick={handleStart}
        className="bg-gradient-to-r from-purple-500 to-blue-400 text-black font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition"
      >
        Start Test
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
