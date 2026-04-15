import React, { useState } from "react";
import LanguageSwitcher from "../../Component/LanguageSwitcher";
import BrandProfileSection from "./MyDashboardSections/BrandProfileSection";
import CampaignsSection from "./MyDashboardSections/CampaignsSection";
import CurrentTrendsSection from "./MyDashboardSections/CurrentTrendsSection";
import StrategySection from "./MyDashboardSections/StrategySection";

export default function MyDashboard() {
  const [activeTab, setActiveTab] = useState("campaigns");

  return (
    <div className="h-full flex flex-col bg-[#f6f6f6] text-[#1e1e1e]">
      {/* Top tabs — sticky */}
      <div className="flex-none border-b border-[rgba(30,30,30,0.1)] flex items-center justify-between px-6 bg-white h-14">
        <div className="flex items-center gap-6 h-full">
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
                className={`h-full pb-0 text-sm font-medium border-b-2 transition ${
                  activeTab === key
                    ? "text-[#40086d] border-[#40086d]"
                    : "text-gray-500 border-transparent hover:text-[#1e1e1e]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <LanguageSwitcher />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "brand-profile" && <BrandProfileSection />}
        {activeTab === "current-trends" && <CurrentTrendsSection />}
        {activeTab === "campaigns" && <CampaignsSection />}
        {activeTab === "strategy" && <StrategySection />}
        {activeTab !== "brand-profile" && activeTab !== "campaigns" && (
          <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Section coming soon</h2>
            <p className="text-sm text-gray-500 mt-1">
              This area will be added in the next iteration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
