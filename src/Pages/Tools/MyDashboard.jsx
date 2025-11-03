import React, { useState } from "react";

export default function MyDashboard() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [filter, setFilter] = useState("active");
  const [selectedCampaign, setSelectedCampaign] = useState("summer-2024");

  const campaigns = [
    {
      id: "summer-2024",
      name: "Summer Fashion Trends 2024",
      platform: "Instagram",
      inspiration: "https://example.com/inspo",
      status: "In Progress",
      assignedTo: "Sarah M.",
      scripts: 3,
      clips: 7,
      ai: true,
    },
    {
      id: "ai-productivity",
      name: "AI Productivity Week",
      platform: "LinkedIn",
      inspiration: "",
      status: "Active",
      assignedTo: "Tony",
      scripts: 2,
      clips: 4,
      ai: true,
    },
    {
      id: "black-friday",
      name: "Black Friday Warmup",
      platform: "TikTok",
      inspiration: "",
      status: "Pending",
      assignedTo: "Diana",
      scripts: 1,
      clips: 3,
      ai: false,
    },
  ];

  const selected = campaigns.find((c) => c.id === selectedCampaign);

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top tabs */}
        <div className="border-b border-white/5 h-14 flex items-center px-6 gap-6">
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
                className={`pb-3 text-sm ${
                  activeTab === key
                    ? "text-white border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Campaign Management</h1>
            <p className="text-sm text-gray-400">
              Track and manage your social media campaigns with AI-powered
              insights
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            {[
              { id: "active", label: "Active" },
              { id: "completed", label: "Completed" },
              { id: "ai", label: "AI-Supported Only" },
              { id: "manual", label: "Manual Only" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-md text-sm ${
                  filter === f.id
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/90"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-[#0f1217] border border-white/5 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-8 gap-4 px-6 py-3 text-xs uppercase text-gray-400 tracking-wide">
              <div className="col-span-2">Campaign Name</div>
              <div>Platform</div>
              <div>Inspiration</div>
              <div>Status</div>
              <div>Assigned to</div>
              <div>Scripts</div>
              <div>Action</div>
            </div>
            <div className="divide-y divide-white/5">
              {campaigns
                .filter((c) => {
                  if (filter === "ai") return c.ai;
                  if (filter === "manual") return !c.ai;
                  return true;
                })
                .map((c) => (
                  <div
                    key={c.id}
                    className={`grid grid-cols-8 gap-4 px-6 py-4 items-center cursor-pointer ${
                      selectedCampaign === c.id ? "bg-white/5" : "hover:bg-white/5"
                    }`}
                    onClick={() => setSelectedCampaign(c.id)}
                  >
                    <div className="col-span-2">
                      <p className="font-medium">{c.name}</p>
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-xs">
                        {c.platform}
                      </span>
                    </div>
                    <div>
                      {c.inspiration ? (
                        <button className="text-xs text-blue-300 hover:underline">
                          View Inspiration
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-200 text-xs">
                        {c.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.ai && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-purple-500/30 text-purple-100">
                          AI
                        </span>
                      )}
                      <span className="text-sm">{c.assignedTo}</span>
                    </div>
                    <div className="text-sm">{c.scripts}</div>
                    <div>
                      <button className="px-4 py-1.5 rounded-md bg-gradient-to-r from-purple-400 to-blue-400 text-black text-xs font-medium">
                        Open Campaign
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Bottom panels */}
          <div className="grid grid-cols-2 gap-4">
            {/* Task Progress */}
            <div className="bg-[#0f1217] border border-white/5 rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-3">Task Progress</h2>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-purple-400" />
                  <span className="line-through text-gray-500">
                    Create campaign idea
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-purple-400" />
                  <span className="line-through text-gray-500">
                    Write script drafts
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-purple-400" />
                  <span>Upload video clips</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-purple-400" />
                  <span>Schedule posts</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-purple-400" />
                  <span>Publish campaign</span>
                </label>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-[#0f1217] border border-white/5 rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-3">AI Suggestions</h2>
              <div className="space-y-3 text-sm">
                <div className="bg-black/20 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">SUGGESTED HOOK</p>
                  <p>
                    “What if I told you this one trend could transform your
                    entire wardrobe?”
                  </p>
                </div>
                <div className="bg-black/20 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">TRENDING FORMAT</p>
                  <p>
                    Before/After transformation videos are performing 40% better
                    this week.
                  </p>
                </div>
                <div className="bg-black/20 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">OPTIMAL TIMING</p>
                  <p>Post between 2–4 PM EST for maximum engagement.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
