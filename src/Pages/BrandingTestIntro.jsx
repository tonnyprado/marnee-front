import React from "react";
import Logo from "../Component/Logo";
import { useLanguage } from "../context/LanguageContext";

export default function BrandTestIntro() {
  const { t } = useLanguage();

  const handleStart = () => {
    window.location.href = "/test-selection";
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Logo */}
      <div className="absolute top-6 left-8">
        <Logo dark={true} />
      </div>

      {/* Back Button */}
      <button
        onClick={() => (window.location.href = "/app")}
        className="absolute top-6 right-8 flex items-center gap-2 text-gray-600 hover:text-[#40086d] transition-colors group"
      >
        <lord-icon
          src="https://cdn.lordicon.com/zmkotitn.json"
          trigger="hover"
          colors="primary:#40086d,secondary:#ede0f8"
          style={{width:'32px',height:'32px'}}
        >
        </lord-icon>
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Step badge */}
      <div className="mb-6">
        <span className="bg-[#ede0f8] text-[#40086d] px-4 py-2 rounded text-sm font-medium border border-[rgba(64,8,109,0.15)]">
          {t("brandingIntro.stepBadge")}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-display font-bold text-center mb-6 leading-tight text-[#1e1e1e]">
        {t("brandingIntro.titlePrefix")}{" "}
        <span className="text-[#40086d]">
          {t("brandingIntro.titleHighlight")}
        </span>
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-xl mb-10 text-lg leading-relaxed font-sans">
        {t("brandingIntro.description")}
      </p>

      {/* CTA Button */}
      <button
        onClick={handleStart}
        className="bg-[#40086d] hover:bg-[#1a0530] text-white font-medium px-8 py-4 rounded transition"
      >
        {t("brandingIntro.cta")}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-8 w-2/3 max-w-md">
        <div className="h-1.5 bg-white border border-[rgba(30,30,30,0.1)] rounded">
          <div className="h-1.5 bg-[#40086d] rounded w-[0%]"></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-right">0%</p>
      </div>
    </div>
  );
}
