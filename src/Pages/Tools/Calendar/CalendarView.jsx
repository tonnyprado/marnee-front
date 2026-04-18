import React, { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PILLAR_COLORS = {
  Authority: "bg-[#ede0f8] text-[#40086d] border-violet-300",
  "Behind the scenes": "bg-blue-100 text-blue-700 border-blue-300",
  Tips: "bg-green-100 text-green-700 border-green-300",
  Story: "bg-orange-100 text-orange-700 border-orange-300",
  Engagement: "bg-cyan-100 text-cyan-700 border-cyan-300",
  default: "bg-gray-100 text-gray-700 border-gray-300",
};

const CONTENT_TYPE_COLORS = {
  Viral: "bg-pink-100 text-pink-700 border-pink-300",
  Educational: "bg-blue-100 text-blue-700 border-blue-300",
  Authority: "bg-purple-100 text-purple-700 border-purple-300",
};

const STATUS_COLORS = {
  todo: "border-l-gray-400",
  in_progress: "border-l-blue-500",
  done: "border-l-green-500",
  skipped: "border-l-gray-300",
  draft: "border-l-yellow-500",
  scheduled: "border-l-indigo-500",
  published: "border-l-emerald-500",
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
    <div className="bg-white rounded shadow-sm border border-[rgba(30,30,30,0.1)]">
      {/* Top controls */}
      <div className="flex items-center justify-between mb-4 p-4 border-b border-[rgba(30,30,30,0.1)]">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevMonth}
            className="px-4 py-2 rounded-lg border border-[rgba(30,30,30,0.1)] text-gray-700 text-sm hover:bg-[#f6f6f6] transition"
          >
            Previous
          </button>
          <h2 className="text-lg font-semibold min-w-[180px] text-center text-gray-900">{monthName}</h2>
          <button
            onClick={goToNextMonth}
            className="px-4 py-2 rounded-lg border border-[rgba(30,30,30,0.1)] text-gray-700 text-sm hover:bg-[#f6f6f6] transition"
          >
            Next
          </button>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d] text-gray-700"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="skipped">Skipped</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white border-t border-[rgba(30,30,30,0.1)] overflow-hidden">
        {/* Headers */}
        <div className="grid grid-cols-7 border-b border-[rgba(30,30,30,0.1)] bg-[#f6f6f6]">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center py-3 text-sm text-gray-600 font-medium"
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
                className={`min-h-[120px] border-r border-b border-[rgba(30,30,30,0.1)] last:border-r-0 relative ${
                  isToday ? "bg-[#ede0f8]" : ""
                }`}
              >
                <div className="p-2">
                  {dayNum && (
                    <div
                      className={`text-sm font-semibold mb-1 ${
                        isToday
                          ? "w-7 h-7 rounded-full bg-[#ede0f8]0 text-white flex items-center justify-center"
                          : "text-gray-700"
                      }`}
                    >
                      {dayNum}
                    </div>
                  )}

                  {/* Post badges */}
                  <div className="space-y-1">
                    {dayPosts.map((post) => {
                      const contentColor = post.contentType
                        ? CONTENT_TYPE_COLORS[post.contentType] || PILLAR_COLORS.default
                        : PILLAR_COLORS[post.pillar] || PILLAR_COLORS.default;
                      const statusColor = STATUS_COLORS[post.status] || "";
                      const postIndex = getPostIndex(post);

                      return (
                        <div
                          key={`${post.date}-${post.hook}`}
                          onClick={() => onPostClick(post, postIndex)}
                          className={`text-[10px] px-2 py-1.5 rounded border border-l-2 cursor-pointer hover:shadow-sm transition ${contentColor} ${statusColor}`}
                        >
                          <div className="font-medium truncate">
                            {post.title || (post.hook?.length > 25
                              ? post.hook.slice(0, 25) + "..."
                              : post.hook)}
                          </div>
                          <div className="text-[9px] opacity-70 mt-0.5 flex items-center justify-between">
                            <span>{post.contentType || post.pillar}</span>
                            {post.effortLevel && (
                              <span className="px-1 bg-white/50 rounded">
                                {post.effortLevel === 'Low' ? 'L' : post.effortLevel === 'Medium' ? 'M' : 'H'}
                              </span>
                            )}
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
      <div className="mt-4 px-4 pb-4 flex flex-wrap items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span className="font-medium">Status:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-gray-100 border-l-2 border-gray-400" /> To Do
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-100 border-l-2 border-blue-500" /> In Progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-green-100 border-l-2 border-green-500" /> Done
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Content:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-pink-100" /> Viral
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-100" /> Educational
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-100" /> Authority
          </span>
        </div>
      </div>
    </div>
  );
}
