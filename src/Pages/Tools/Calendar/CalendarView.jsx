import React from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView({
  campaigns,
  statusFilter,
  setStatusFilter,
  onDayClick,
}) {
  // septiembre 2025
  const year = 2025;
  const month = 8; // 0-based: 8 = septiembre

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().slice(0, 10);
    cells.push(dateStr);
  }

  return (
    <div className="bg-[#0c0719]">
      {/* top controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button className="px-4 py-1 rounded-lg bg-gray-600/60 text-white text-sm">
            Previous
          </button>
          <h2 className="text-lg font-semibold">September 2025</h2>
          <button className="px-4 py-1 rounded-lg bg-gray-600/60 text-white text-sm">
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
            <option value="pending">Pending</option>
            <option value="uploaded">Uploaded</option>
          </select>
        </div>
      </div>

      {/* calendar grid */}
      <div className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
        {/* headers */}
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

        {/* days */}
        <div className="grid grid-cols-7">
          {cells.map((dateStr, idx) => {
            const dayNum = dateStr ? Number(dateStr.split("-")[2]) : null;

            // campañas de este día
            const dayCampaigns = dateStr
              ? campaigns.filter((c) => c.date === dateStr)
              : [];

            return (
              <div
                key={idx}
                className="h-28 border-r border-b border-white/5 last:border-r-0 cursor-pointer hover:bg-white/5 transition relative"
                onClick={() => dateStr && onDayClick(dateStr)}
              >
                <div className="p-2">
                  {dayNum && (
                    <div className="text-sm font-semibold text-white mb-1">
                      {dayNum}
                    </div>
                  )}

                  {/* badges campañas */}
                  <div className="space-y-1">
                    {dayCampaigns.map((c) => (
                      <div
                        key={c.id}
                        className={`text-[10px] px-2 py-1 rounded-full inline-block ${
                          c.status === "pending"
                            ? "bg-yellow-400/20 text-yellow-200"
                            : "bg-emerald-400/20 text-emerald-200"
                        }`}
                      >
                        {c.title.length > 16
                          ? c.title.slice(0, 16) + "…"
                          : c.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
