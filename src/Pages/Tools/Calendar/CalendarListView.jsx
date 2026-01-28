import React from "react";

const PILLAR_COLORS = {
  Authority: "bg-purple-500/20 text-purple-300",
  "Behind the scenes": "bg-blue-500/20 text-blue-300",
  Tips: "bg-green-500/20 text-green-300",
  Story: "bg-orange-500/20 text-orange-300",
  Engagement: "bg-pink-500/20 text-pink-300",
  default: "bg-gray-500/20 text-gray-300",
};

const STATUS_BADGES = {
  draft: "bg-yellow-500/20 text-yellow-300",
  scheduled: "bg-blue-500/20 text-blue-300",
  published: "bg-green-500/20 text-green-300",
};

export default function CalendarListView({
  posts = [],
  statusFilter,
  setStatusFilter,
  onPostClick,
}) {
  // Group posts by week
  const groupedByWeek = posts.reduce((acc, post, index) => {
    const week = post.weekNumber || 1;
    if (!acc[week]) acc[week] = [];
    acc[week].push({ ...post, originalIndex: index });
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[#0c0719]">
      {/* Top controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">All Posts</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0c0719] border border-pink-400/60 rounded-md px-3 py-1 text-sm focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Posts grouped by week */}
      <div className="space-y-6">
        {Object.entries(groupedByWeek).map(([week, weekPosts]) => (
          <div key={week}>
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              Week {week}
            </h3>
            <div className="space-y-2">
              {weekPosts.map((post) => {
                const pillarColor = PILLAR_COLORS[post.pillar] || PILLAR_COLORS.default;
                const statusColor = STATUS_BADGES[post.status] || STATUS_BADGES.draft;

                return (
                  <div
                    key={`${post.date}-${post.hook}`}
                    onClick={() => onPostClick(post, post.originalIndex)}
                    className="bg-black/20 border border-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/5 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left side: Date and content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-gray-400">
                            {formatDate(post.date)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${pillarColor}`}>
                            {post.pillar}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
                            {post.status}
                          </span>
                        </div>

                        <h4 className="font-medium text-white mb-1 truncate">
                          {post.hook}
                        </h4>

                        <p className="text-sm text-gray-400 mb-2">
                          {post.angle && <span>Angle: {post.angle}</span>}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Format: {post.format}</span>
                          {post.assets && post.assets.length > 0 && (
                            <span>Assets: {post.assets.join(", ")}</span>
                          )}
                        </div>
                      </div>

                      {/* Right side: CTA */}
                      {post.cta && (
                        <div className="flex-shrink-0 text-right">
                          <span className="text-xs text-gray-500 block mb-1">CTA</span>
                          <span className="text-xs text-purple-300 bg-purple-500/10 px-2 py-1 rounded">
                            {post.cta}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No posts match the selected filter.
        </div>
      )}
    </div>
  );
}
