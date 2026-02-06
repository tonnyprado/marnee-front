import React, { useState } from "react";
import BrandProfileSection from "./MyDashboardSections/BrandProfileSection";
import CampaignsSection from "./MyDashboardSections/CampaignsSection";
import CurrentTrendsSection from "./MyDashboardSections/CurrentTrendsSection";
import StrategySection from "./MyDashboardSections/StrategySection";

export default function MyDashboard() {
  const [activeTab, setActiveTab] = useState("campaigns");

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top tabs */}
        <div className="border-b border-gray-100 h-14 flex items-center px-6 gap-6 bg-white">
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
          {activeTab === "brand-profile" && <BrandProfileSection />}
          {activeTab === "current-trends" && <CurrentTrendsSection />}
          {activeTab === "campaigns" && <CampaignsSection />}
          {activeTab === "strategy" && <StrategySection />}
          {activeTab !== "brand-profile" && activeTab !== "campaigns" && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Section coming soon</h2>
              <p className="text-sm text-gray-500 mt-1">
                This area will be added in the next iteration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
