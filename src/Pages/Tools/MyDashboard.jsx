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
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Campaign Management</h1>
            <p className="text-sm text-gray-500">
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f.id
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-8 gap-4 px-6 py-3 text-xs uppercase text-gray-500 tracking-wide bg-gray-50 border-b border-gray-100">
              <div className="col-span-2">Campaign Name</div>
              <div>Platform</div>
              <div>Inspiration</div>
              <div>Status</div>
              <div>Assigned to</div>
              <div>Scripts</div>
              <div>Action</div>
            </div>
            <div className="divide-y divide-gray-100">
              {campaigns
                .filter((c) => {
                  if (filter === "ai") return c.ai;
                  if (filter === "manual") return !c.ai;
                  return true;
                })
                .map((c) => (
                  <div
                    key={c.id}
                    className={`grid grid-cols-8 gap-4 px-6 py-4 items-center cursor-pointer transition ${
                      selectedCampaign === c.id ? "bg-purple-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedCampaign(c.id)}
                  >
                    <div className="col-span-2">
                      <p className="font-medium text-gray-900">{c.name}</p>
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                        {c.platform}
                      </span>
                    </div>
                    <div>
                      {c.inspiration ? (
                        <button className="text-xs text-purple-600 hover:underline">
                          View Inspiration
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs">
                        {c.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.ai && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          AI
                        </span>
                      )}
                      <span className="text-sm text-gray-700">{c.assignedTo}</span>
                    </div>
                    <div className="text-sm text-gray-700">{c.scripts}</div>
                    <div>
                      <button className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-medium hover:from-purple-700 hover:to-pink-600 transition">
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
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3 text-gray-900">Task Progress</h2>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-purple-500 rounded" />
                  <span className="line-through text-gray-400">
                    Create campaign idea
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-purple-500 rounded" />
                  <span className="line-through text-gray-400">
                    Write script drafts
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-purple-500 rounded" />
                  <span className="text-gray-700">Upload video clips</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-purple-500 rounded" />
                  <span className="text-gray-700">Schedule posts</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-purple-500 rounded" />
                  <span className="text-gray-700">Publish campaign</span>
                </label>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-3 text-gray-900">AI Suggestions</h2>
              <div className="space-y-3 text-sm">
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-purple-500 mb-1 font-medium">SUGGESTED HOOK</p>
                  <p className="text-gray-700">
                    "What if I told you this one trend could transform your
                    entire wardrobe?"
                  </p>
                </div>
                <div className="bg-pink-50 rounded-xl p-3">
                  <p className="text-xs text-pink-500 mb-1 font-medium">TRENDING FORMAT</p>
                  <p className="text-gray-700">
                    Before/After transformation videos are performing 40% better
                    this week.
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-500 mb-1 font-medium">OPTIMAL TIMING</p>
                  <p className="text-gray-700">Post between 2-4 PM EST for maximum engagement.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
