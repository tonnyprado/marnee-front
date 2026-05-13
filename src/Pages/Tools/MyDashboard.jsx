/**
 * MyDashboard Component
 * Dashboard principal con todas las integraciones de redes sociales
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../../Component/PageTransition";
import { TopTabs } from "../../Component/Dashboard";
import ConnectionsHub from "./MyDashboardSections/ConnectionsHub";
import ContentMarketingSection from "./MyDashboardSections/ContentMarketingSection";

// Tab content animation variants
const tabContentVariants = {
  hidden: { opacity: 0, y: 3 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -3 }
};

export default function MyDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    "Overview",
    "Instagram",
    "YouTube",
    "Analytics"
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
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <ConnectionsHub />
              </motion.div>
            )}
            {activeTab === "instagram" && (
              <motion.div
                key="instagram"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <ContentMarketingSection />
              </motion.div>
            )}
            {activeTab === "youtube" && (
              <motion.div
                key="youtube"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className="text-center py-20">
                  <h2 className="text-[24px] font-['Noto_Serif'] font-bold text-[#40086d] mb-3">
                    YouTube Analytics
                  </h2>
                  <p className="text-[13.5px] text-[rgba(30,30,30,0.55)]">
                    Connect your YouTube channel from the Overview tab to see analytics here
                  </p>
                </div>
              </motion.div>
            )}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className="text-center py-20">
                  <h2 className="text-[24px] font-['Noto_Serif'] font-bold text-[#40086d] mb-3">
                    Google Analytics
                  </h2>
                  <p className="text-[13.5px] text-[rgba(30,30,30,0.55)]">
                    Connect Google Analytics from the Overview tab to see website analytics here
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
