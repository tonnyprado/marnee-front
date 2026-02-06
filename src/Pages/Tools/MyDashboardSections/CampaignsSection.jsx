import React, { useState } from "react";

export default function CampaignsSection() {
  const [filter, setFilter] = useState("active");
  const [selectedCampaign, setSelectedCampaign] = useState("summer-2024");

  const campaigns = [
    {
      id: "summer-2024",
      name: "Summer Fashion Trends 2024",
      platform: "Instagram",
      inspirationLabel: "View Inspiration",
      inspirationUrl: "https://example.com/inspo",
      status: "In Progress",
      assignedTo: "Sarah M.",
      scripts: 3,
      clips: 7,
      ai: true,
    },
    {
      id: "tech-product-launch",
      name: "Tech Product Launch",
      platform: "TikTok",
      inspirationLabel: "Add Link",
      inspirationUrl: "",
      status: "Idea",
      assignedTo: "Alex K.",
      scripts: 1,
      clips: 0,
      ai: true,
    },
    {
      id: "holiday-gift-guide",
      name: "Holiday Gift Guide",
      platform: "YouTube",
      inspirationLabel: "Pinterest Board",
      inspirationUrl: "",
      status: "Scheduled",
      assignedTo: "Maria L.",
      scripts: 5,
      clips: 12,
      ai: false,
    },
    {
      id: "fitness-challenge-series",
      name: "Fitness Challenge Series",
      platform: "Instagram",
      inspirationLabel: "Competitor Analysis",
      inspirationUrl: "",
      status: "Published",
      assignedTo: "Diana N.",
      scripts: 8,
      clips: 15,
      ai: true,
    },
  ];

  const statusStyles = {
    "In Progress": "bg-violet-50 text-violet-600",
    Idea: "bg-violet-50 text-violet-600",
    Scheduled: "bg-cyan-50 text-cyan-600",
    Published: "bg-green-50 text-green-600",
  };

  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Campaign Management</h1>
        <p className="text-sm text-gray-500">
          Track and manage your social media campaigns with AI-powered insights
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
                ? "bg-violet-100 text-violet-700 border border-violet-200"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-9 gap-4 px-6 py-3 text-xs uppercase text-gray-500 tracking-wide bg-gray-50 border-b border-gray-100">
          <div className="col-span-2">Campaign Name</div>
          <div>Platform</div>
          <div>Inspiration</div>
          <div>Status</div>
          <div>Assigned to</div>
          <div>Scripts</div>
          <div>Clips</div>
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
              <div key={c.id}>
                <div
                  className={`grid grid-cols-9 gap-4 px-6 py-4 items-center cursor-pointer transition ${
                    selectedCampaign === c.id ? "bg-violet-50" : "hover:bg-gray-50"
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
                    {c.inspirationLabel ? (
                      <button className="text-xs text-violet-600 hover:underline">
                        {c.inspirationLabel}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        statusStyles[c.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.ai && (
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 text-white">
                        AI
                      </span>
                    )}
                    <span className="text-sm text-gray-700">{c.assignedTo}</span>
                  </div>
                  <div className="text-sm text-gray-700">{c.scripts}</div>
                  <div className="text-sm text-gray-700">{c.clips}</div>
                  <div>
                    <button className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-medium hover:from-violet-700 hover:via-indigo-700 hover:to-cyan-600 transition">
                      Open Campaign
                    </button>
                  </div>
                </div>

                {selectedCampaign === c.id && (
                  <div className="px-6 pb-6 pt-2 bg-violet-50/30">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Task Progress */}
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <h2 className="text-lg font-semibold mb-3 text-gray-900">
                          Task Progress
                        </h2>
                        <div className="space-y-3 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="accent-violet-500 rounded"
                            />
                            <span className="line-through text-gray-400">
                              Create campaign idea
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="accent-violet-500 rounded"
                            />
                            <span className="line-through text-gray-400">
                              Write script drafts
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-violet-500 rounded" />
                            <span className="text-gray-700">Upload video clips</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-violet-500 rounded" />
                            <span className="text-gray-700">Schedule posts</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-violet-500 rounded" />
                            <span className="text-gray-700">Publish campaign</span>
                          </label>
                        </div>
                      </div>

                      {/* AI Suggestions */}
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <h2 className="text-lg font-semibold mb-3 text-gray-900">
                          AI Suggestions
                        </h2>
                        <div className="space-y-3 text-sm">
                          <div className="bg-violet-50 rounded-xl p-3">
                            <p className="text-xs text-violet-500 mb-1 font-medium">
                              SUGGESTED HOOK
                            </p>
                            <p className="text-gray-700">
                              "What if I told you this one trend could transform your
                              entire wardrobe?"
                            </p>
                          </div>
                          <div className="bg-cyan-50 rounded-xl p-3">
                            <p className="text-xs text-cyan-500 mb-1 font-medium">
                              TRENDING FORMAT
                            </p>
                            <p className="text-gray-700">
                              Before/After transformation videos are performing 40% better
                              this week.
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-3">
                            <p className="text-xs text-blue-500 mb-1 font-medium">
                              OPTIMAL TIMING
                            </p>
                            <p className="text-gray-700">
                              Post between 2-4 PM EST for maximum engagement.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upload area */}
                    <div className="mt-4">
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl bg-white py-8 text-center">
                        <div className="mx-auto mb-2 h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-semibold">
                          UP
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          Drag and drop your clips here
                        </p>
                        <p className="text-xs text-gray-400">
                          or click to browse (up to 10 files)
                        </p>
                      </div>
                    </div>

                    {/* Campaign Notes */}
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Campaign Notes
                      </h3>
                      <textarea
                        className="w-full min-h-[90px] rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-200"
                        defaultValue="Focus on authentic storytelling and user-generated content. Consider partnering with micro-influencers for better engagement rates."
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
