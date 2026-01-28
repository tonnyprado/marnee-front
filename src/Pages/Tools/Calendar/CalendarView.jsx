import React, { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PILLAR_COLORS = {
  Authority: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Behind the scenes": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Tips: "bg-green-500/20 text-green-300 border-green-500/30",
  Story: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Engagement: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  default: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const STATUS_COLORS = {
  draft: "border-l-yellow-400",
  scheduled: "border-l-blue-400",
  published: "border-l-green-400",
};

export default function CalendarView({
  posts = [],
  calendar,
  statusFilter,
  setStatusFilter,
  onPostClick,
}) {
  // Parse calendar dates
  const startDate = calendar?.startDate ? new Date(calendar.startDate) : new Date();

  // Calculate the month to display (use start date's month)
  const [currentMonth, setCurrentMonth] = useState(() => {
    return new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build calendar cells
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().slice(0, 10);
    cells.push(dateStr);
  }

  // Navigation
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Get original index of post in full posts array
  const getPostIndex = (post) => {
    return calendar?.posts?.findIndex(
      (p) => p.date === post.date && p.hook === post.hook
    ) ?? -1;
  };

  return (
    <div className="bg-[#0c0719]">
      {/* Top controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevMonth}
            className="px-4 py-1 rounded-lg bg-gray-600/60 text-white text-sm hover:bg-gray-600/80 transition"
          >
            Previous
          </button>
          <h2 className="text-lg font-semibold min-w-[180px] text-center">{monthName}</h2>
          <button
            onClick={goToNextMonth}
            className="px-4 py-1 rounded-lg bg-gray-600/60 text-white text-sm hover:bg-gray-600/80 transition"
          >
            Next
          </button>
        </div>

        <div>
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
      </div>

      {/* Calendar grid */}
      <div className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
        {/* Headers */}
        <div className="grid grid-cols-7 border-b border-white/5">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center py-3 text-sm text-gray-300 font-medium"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {cells.map((dateStr, idx) => {
            const dayNum = dateStr ? Number(dateStr.split("-")[2]) : null;
            const isToday = dateStr === new Date().toISOString().slice(0, 10);

            // Posts for this day
            const dayPosts = dateStr
              ? posts.filter((p) => p.date === dateStr)
              : [];

            return (
              <div
                key={idx}
                className={`min-h-[120px] border-r border-b border-white/5 last:border-r-0 relative ${
                  isToday ? "bg-purple-500/5" : ""
                }`}
              >
                <div className="p-2">
                  {dayNum && (
                    <div
                      className={`text-sm font-semibold mb-1 ${
                        isToday
                          ? "w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center"
                          : "text-white"
                      }`}
                    >
                      {dayNum}
                    </div>
                  )}

                  {/* Post badges */}
                  <div className="space-y-1">
                    {dayPosts.map((post) => {
                      const pillarColor = PILLAR_COLORS[post.pillar] || PILLAR_COLORS.default;
                      const statusColor = STATUS_COLORS[post.status] || "";
                      const postIndex = getPostIndex(post);

                      return (
                        <div
                          key={`${post.date}-${post.hook}`}
                          onClick={() => onPostClick(post, postIndex)}
                          className={`text-[10px] px-2 py-1.5 rounded border-l-2 cursor-pointer hover:opacity-80 transition ${pillarColor} ${statusColor}`}
                        >
                          <div className="font-medium truncate">
                            {post.hook?.length > 25
                              ? post.hook.slice(0, 25) + "..."
                              : post.hook}
                          </div>
                          <div className="text-[9px] opacity-70 mt-0.5">
                            {post.pillar} | {post.format}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-xs text-gray-400">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-yellow-400/30" /> Draft
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-400/30" /> Scheduled
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-green-400/30" /> Published
        </span>
      </div>
    </div>
  );
}
