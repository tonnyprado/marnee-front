import React from "react";

export default function CalendarListView({
  campaigns,
  statusFilter,
  setStatusFilter,
  onEdit,
}) {
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-[#0c0719]">
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-black">Content Schedule</h2>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="uploaded">Uploaded</option>
            </select>
          </div>
        </div>
        <div>
          {campaigns.length === 0 && (
            <div className="p-6 text-gray-500 text-sm">
              No content scheduled under this status.
            </div>
          )}
          {campaigns.map((c) => (
            <button
              key={c.id}
              onClick={() => onEdit(c)}
              className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium text-black">{c.title}</p>
                <p className="text-sm text-gray-500">{formatDate(c.date)}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  c.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {c.status === "pending" ? "Pending" : "Uploaded"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
