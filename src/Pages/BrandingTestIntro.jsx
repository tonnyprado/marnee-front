import React from "react";
import Logo from "../Component/Logo";
import { useLanguage } from "../context/LanguageContext";

export default function BrandTestIntro() {
  const { t } = useLanguage();

  const handleStart = () => {
    window.location.href = "/test-selection";
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#1e1e1e] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Logo */}
      <div className="absolute top-6 left-8">
        <Logo dark={true} />
      </div>

      {/* Step badge */}
      <div className="mb-6">
        <span className="bg-[#ede0f8] text-[#40086d] px-4 py-2 rounded text-sm font-medium">
          {t("brandingIntro.stepBadge")}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-light text-center mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
        {t("brandingIntro.titlePrefix")}{" "}
        <span className="text-[#40086d]">
          {t("brandingIntro.titleHighlight")}
        </span>
      </h1>
{/*testing*/}
      {/* Description */}
      <p className="text-gray-600 text-center max-w-xl mb-10 text-lg leading-relaxed">
        {t("brandingIntro.description")}
      </p>

      {/* CTA Button */}
      <button
        onClick={handleStart}
        className="bg-[#1e1e1e] hover:bg-[#dccaf4] hover:text-[#1a0530] text-white font-medium px-8 py-4 rounded transition"
      >
        {t("brandingIntro.cta")}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-8 w-2/3 max-w-md">
        <div className="h-1.5 bg-gray-100 rounded-full">
          <div className="h-1.5 bg-[#40086d] rounded-full w-[0%]"></div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right">0%</p>
      </div>
    </div>
  );
}
