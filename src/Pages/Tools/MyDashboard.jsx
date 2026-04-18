import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandProfileSection from "./MyDashboardSections/BrandProfileSection";
import CampaignsSection from "./MyDashboardSections/CampaignsSection";
import CurrentTrendsSection from "./MyDashboardSections/CurrentTrendsSection";
import StrategySection from "./MyDashboardSections/StrategySection";
import PageTransition from "../../Component/PageTransition";
import { useMarnee } from "../../context/MarneeContext";

// Tab content animation variants
const tabContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export default function MyDashboard() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const { founderId, sessionId, calendarId } = useMarnee();

  return (
    <PageTransition className="flex min-h-screen bg-[#f6f6f6] text-gray-900">
      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top tabs */}
        <div className="border-b border-[rgba(30,30,30,0.1)] h-14 flex items-center px-6 gap-6 bg-white">
          {[
            "Brand Profile",
            "Current Trends",
            "Campaigns",
            "Pending Tasks",
            "Strategy",
          ].map((tab) => {
            const key = tab.toLowerCase().replace(/\s+/g, "-");
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-3 text-sm font-medium ${
                  activeTab === key
                    ? "text-purple-600 border-b-2 border-purple-500"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === "brand-profile" && (
              <motion.div
                key="brand-profile"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <BrandProfileSection
                  founderId={founderId}
                  sessionId={sessionId}
                />
              </motion.div>
            )}
            {activeTab === "current-trends" && (
              <motion.div
                key="current-trends"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <CurrentTrendsSection />
              </motion.div>
            )}
            {activeTab === "campaigns" && (
              <motion.div
                key="campaigns"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <CampaignsSection
                  calendarId={calendarId}
                  founderId={founderId}
                  sessionId={sessionId}
                />
              </motion.div>
            )}
            {activeTab === "strategy" && (
              <motion.div
                key="strategy"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <StrategySection />
              </motion.div>
            )}
            {activeTab === "pending-tasks" && (
              <motion.div
                key="pending-tasks"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900">Section coming soon</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    This area will be added in the next iteration.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
