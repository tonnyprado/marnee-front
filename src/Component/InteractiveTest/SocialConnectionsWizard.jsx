import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Loader2,
  Camera,
  Video,
  BarChart3,
  Music,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import {
  getInstagramStatus,
  connectInstagram,
} from "../../services/instagramApi";
import {
  getGoogleStatus,
  connectGoogle,
  addGoogleService,
} from "../../services/googleApi";
import { getTikTokStatus, connectTikTok } from "../../services/tiktokApi";
import { trackSocialConnect } from "../../services/facebookPixel";

// Phases of the wizard
const PHASES = {
  WELCOME: "welcome",
  CONNECTIONS: "connections",
};

// Main social platforms to show (simplified list for onboarding)
const SOCIAL_PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect your Instagram Business account",
    icon: Camera,
    color: "from-purple-600 to-pink-600",
    bgLight: "bg-gradient-to-br from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Connect your YouTube channel",
    icon: Video,
    color: "from-red-600 to-red-700",
    bgLight: "bg-gradient-to-br from-red-50 to-orange-50",
    borderColor: "border-red-200",
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Connect your TikTok account",
    icon: Music,
    color: "from-gray-900 to-gray-800",
    bgLight: "bg-gradient-to-br from-gray-50 to-slate-50",
    borderColor: "border-gray-200",
  },
  {
    id: "analytics",
    name: "Google Analytics",
    description: "Connect your website analytics",
    icon: BarChart3,
    color: "from-orange-600 to-amber-600",
    bgLight: "bg-gradient-to-br from-orange-50 to-amber-50",
    borderColor: "border-orange-200",
  },
];

export default function SocialConnectionsWizard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [phase, setPhase] = useState(PHASES.WELCOME);
  const [connectionStatus, setConnectionStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState(null);

  // Fetch initial connection statuses
  useEffect(() => {
    fetchStatuses();
  }, []);

  // Transition from welcome to connections after delay
  useEffect(() => {
    if (phase === PHASES.WELCOME) {
      const timer = setTimeout(() => {
        setPhase(PHASES.CONNECTIONS);
      }, 2500); // Show welcome for 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Check for OAuth callback success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.get("meta_connected") === "true" ||
      urlParams.get("google_connected") === "true" ||
      urlParams.get("tiktok_connected") === "true"
    ) {
      window.history.replaceState({}, "", window.location.pathname);
      fetchStatuses();
      setConnectingPlatform(null);
    }
  }, []);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const [metaData, googleData, tiktokData] = await Promise.allSettled([
        getInstagramStatus(),
        getGoogleStatus(),
        getTikTokStatus(),
      ]);

      const meta = metaData.status === "fulfilled" ? metaData.value : null;
      const google = googleData.status === "fulfilled" ? googleData.value : null;
      const tiktok = tiktokData.status === "fulfilled" ? tiktokData.value : null;

      setConnectionStatus({
        instagram: meta?.connected || false,
        youtube:
          google?.connected &&
          google?.connectedServices?.includes("youtube"),
        analytics:
          google?.connected &&
          google?.connectedServices?.includes("analytics"),
        tiktok: tiktok?.connected || false,
        _googleConnected: google?.connected || false,
      });
    } catch (error) {
      console.error("Error fetching statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platformId) => {
    setConnectingPlatform(platformId);
    try {
      trackSocialConnect(platformId);

      switch (platformId) {
        case "instagram":
          await connectInstagram();
          break;
        case "youtube":
          if (connectionStatus._googleConnected) {
            await addGoogleService("youtube");
          } else {
            await connectGoogle(["youtube"]);
          }
          break;
        case "analytics":
          if (connectionStatus._googleConnected) {
            await addGoogleService("analytics");
          } else {
            await connectGoogle(["analytics"]);
          }
          break;
        case "tiktok":
          connectTikTok();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error connecting ${platformId}:`, error);
      setConnectingPlatform(null);
    }
  };

  const handleSkip = () => {
    navigate("/app");
  };

  const handleContinue = () => {
    navigate("/app");
  };

  const connectedCount = Object.entries(connectionStatus).filter(
    ([key, value]) => key !== "_googleConnected" && value
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-violet-50 flex items-center justify-center px-6 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* PHASE 1: Welcome Message */}
          {phase === PHASES.WELCOME && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="text-center"
            >
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1, bounce: 0.5 }}
                className="mb-8 inline-flex"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-200">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              >
                {t("socialWizard.welcome.title", "One more step...")}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-xl text-gray-600"
              >
                {t(
                  "socialWizard.welcome.subtitle",
                  "Let's supercharge your marketing strategy"
                )}
              </motion.p>
            </motion.div>
          )}

          {/* PHASE 2: Social Connections */}
          {phase === PHASES.CONNECTIONS && (
            <motion.div
              key="connections"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="text-center"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {t("socialWizard.connections.title", "Connect your accounts")}
                </h1>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  {t(
                    "socialWizard.connections.subtitle",
                    "Connect your social media accounts so Marnee can analyze your data and create personalized strategies"
                  )}
                </p>
              </motion.div>

              {/* Platform Cards */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="grid grid-cols-2 gap-4 mb-8"
                >
                  {SOCIAL_PLATFORMS.map((platform, index) => {
                    const Icon = platform.icon;
                    const isConnected = connectionStatus[platform.id];
                    const isConnecting = connectingPlatform === platform.id;

                    return (
                      <motion.button
                        key={platform.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          !isConnected && !isConnecting && handleConnect(platform.id)
                        }
                        disabled={isConnected || isConnecting}
                        className={`
                          relative p-5 rounded-2xl border-2 text-left transition-all duration-300
                          ${
                            isConnected
                              ? "bg-green-50 border-green-300 cursor-default"
                              : `${platform.bgLight} ${platform.borderColor} hover:shadow-lg hover:border-opacity-60 cursor-pointer`
                          }
                          ${isConnecting ? "opacity-70 cursor-wait" : ""}
                        `}
                      >
                        {/* Connected badge */}
                        {isConnected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md"
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
                        )}

                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white flex-shrink-0 shadow-md`}
                          >
                            {isConnecting ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <Icon className="w-6 h-6" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {platform.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {isConnected
                                ? t("socialWizard.connected", "Connected")
                                : isConnecting
                                ? t("socialWizard.connecting", "Connecting...")
                                : platform.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-col items-center gap-4"
              >
                {/* Continue button */}
                <button
                  onClick={handleContinue}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 transition-all duration-300 hover:scale-105"
                >
                  {connectedCount > 0
                    ? t("socialWizard.continue", "Continue")
                    : t("socialWizard.continueAnyway", "Continue anyway")}
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Skip link */}
                {connectedCount === 0 && (
                  <button
                    onClick={handleSkip}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                  >
                    {t("socialWizard.skip", "I'll do this later")}
                  </button>
                )}

                {/* Connected count indicator */}
                {connectedCount > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    {connectedCount}{" "}
                    {connectedCount === 1
                      ? t("socialWizard.accountConnected", "account connected")
                      : t("socialWizard.accountsConnected", "accounts connected")}
                  </p>
                )}
              </motion.div>

              {/* Footer note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mt-8 text-xs text-gray-400 max-w-sm mx-auto"
              >
                {t(
                  "socialWizard.footer",
                  "You can always connect more accounts later from your dashboard settings."
                )}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
