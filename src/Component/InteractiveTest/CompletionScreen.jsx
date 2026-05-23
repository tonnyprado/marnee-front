import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function CompletionScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Auto-navigate after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/app");
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleContinue = () => {
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1, bounce: 0.5 }}
          className="mb-8 inline-flex relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-200">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          {/* Sparkles around */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Confetti-like particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: -20,
                x: Math.random() * window.innerWidth,
              }}
              animate={{
                opacity: [0, 1, 0],
                y: window.innerHeight + 20,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3,
              }}
              className={`absolute w-3 h-3 rounded-full ${
                ["bg-violet-400", "bg-indigo-400", "bg-pink-400", "bg-yellow-400"][
                  Math.floor(Math.random() * 4)
                ]
              }`}
              style={{
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          {t("interactiveTest.completion.title", "Excellent!")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-gray-600 mb-2"
        >
          {t("interactiveTest.completion.subtitle", "You've completed the test.")}
        </motion.p>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-violet-600 font-medium mb-10"
        >
          {t("interactiveTest.completion.message", "Let's start with your marketing strategy!")}
        </motion.p>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 transition-all duration-300"
        >
          {t("interactiveTest.completion.continueButton", "Continue")}
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Auto-redirect notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-sm text-gray-400"
        >
          Redirecting automatically in a few seconds...
        </motion.p>
      </div>
    </div>
  );
}
