import React from "react";
import { motion } from "motion/react";
import Logo from "../Component/Logo";
import { useLanguage } from "../context/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200 via-indigo-200 to-cyan-200 rounded-full blur-3xl opacity-40 -z-10"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.55, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full blur-3xl opacity-30 -z-10"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Logo */}
      <div className="absolute top-6 left-8">
        <Logo dark={true} />
      </div>

      {/* Step badge */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span className="bg-violet-50 text-violet-700 px-4 py-2 rounded-full text-sm font-medium">
          {t("landing.stepBadge")}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-center mb-6 leading-tight tracking-tight"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      >
        <span className="text-gray-900">{t("landing.titlePrefix")}</span>{" "}
        <motion.span
          className="relative inline-block bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        >
          {t("landing.titleHighlight")}
          {/* Underline accent */}
          <motion.span
            className="absolute left-0 bottom-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          />
        </motion.span>
      </motion.h1>

      {/* Description */}
      <motion.p
        className="text-gray-600 text-center max-w-xl mb-10 text-lg leading-relaxed"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        {t("landing.description")}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
      >
        <motion.button
          onClick={() => (window.location.href = "/auth")}
          className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-700 hover:via-indigo-700 hover:to-cyan-600 text-white font-medium px-8 py-4 rounded-full transition shadow-lg shadow-violet-500/25"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {t("landing.primaryCta")}
        </motion.button>
        <motion.button
          onClick={() => (window.location.href = "/presentation")}
          className="border-2 border-violet-500 text-violet-600 hover:bg-violet-50 font-medium px-8 py-4 rounded-full transition"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {t("landing.secondaryCta")}
        </motion.button>
      </motion.div>

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
