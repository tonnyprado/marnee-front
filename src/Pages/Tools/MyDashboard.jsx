import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandProfileSection from "./MyDashboardSections/BrandProfileSection";
import CampaignsSection from "./MyDashboardSections/CampaignsSection";
import CurrentTrendsSection from "./MyDashboardSections/CurrentTrendsSection";
import StrategySection from "./MyDashboardSections/StrategySection";
import PageTransition from "../../Component/PageTransition";
import { TopTabs } from "../../Component/Dashboard";
import { useAuth } from "../../context/AuthContext";
import { useMarnee } from "../../context/MarneeContext";

// Tab content animation variants - smoother, more refined
const tabContentVariants = {
  hidden: { opacity: 0, y: 3 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -3 }
};

export default function MyDashboard() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const { founderId, sessionId } = useAuth();
  const { calendarId } = useMarnee();

  const tabs = [
    "Brand Profile",
    "Current Trends",
    "Campaigns",
    "Strategy",
  ];

  return (
    <PageTransition className="flex min-h-screen bg-[#f6f6f6]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Premium Top Navigation Tabs */}
        <TopTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content Area with Premium Spacing */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {activeTab === "brand-profile" && (
              <motion.div
                key="brand-profile"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
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
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <CurrentTrendsSection
                  founderId={founderId}
                  sessionId={sessionId}
                />
              </motion.div>
            )}
            {activeTab === "campaigns" && (
              <motion.div
                key="campaigns"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
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
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <StrategySection
                  founderId={founderId}
                  sessionId={sessionId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
