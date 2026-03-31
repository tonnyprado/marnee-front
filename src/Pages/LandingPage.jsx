import React from "react";
import Logo from "../Component/Logo";
import { useLanguage } from "../context/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200 via-indigo-200 to-cyan-200 rounded-full blur-3xl opacity-40 -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full blur-3xl opacity-30 -z-10" />

      {/* Logo */}
      <div className="absolute top-6 left-8">
        <Logo dark={true} />
      </div>

      {/* Step badge */}
      <div className="mb-6">
        <span className="bg-violet-50 text-violet-700 px-4 py-2 rounded-full text-sm font-medium">
          {t("landing.stepBadge")}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 leading-tight">
        {t("landing.titlePrefix")}{" "}
        <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
          {t("landing.titleHighlight")}
        </span>
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-xl mb-10 text-lg leading-relaxed">
        {t("landing.description")}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => (window.location.href = "/auth")}
          className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-700 hover:via-indigo-700 hover:to-cyan-600 text-white font-medium px-8 py-4 rounded-full transition shadow-lg shadow-violet-500/25"
        >
          {t("landing.primaryCta")}
        </button>
        <button
          onClick={() => (window.location.href = "/presentation")}
          className="border-2 border-violet-500 text-violet-600 hover:bg-violet-50 font-medium px-8 py-4 rounded-full transition"
        >
          {t("landing.secondaryCta")}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-8 w-2/3 max-w-md">
        <div className="h-1.5 bg-gray-100 rounded-full">
          <div className="h-1.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 rounded-full w-[0%]"></div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right">0%</p>
      </div>
    </div>
  );
}
