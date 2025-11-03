import React, { useState } from "react";
import CalendarView from "./Calendar/CalendarView";
import CalendarListView from "./Calendar/CalendarListView";
import CampaignForm from "./Calendar/CampaignForm";

export default function CalendarPage() {
  // vista actual: "calendar" | "list"
  const [view, setView] = useState("calendar");

  // status filter: "all" | "pending" | "uploaded"
  const [statusFilter, setStatusFilter] = useState("all");

  // campañas hardcodeadas
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Holiday marketing tips",
      date: "2024-12-15",
      status: "pending",
    },
    {
      id: 2,
      title: "Year-end review post",
      date: "2024-12-18",
      status: "uploaded",
    },
    {
      id: 3,
      title: "Christmas content ideas",
      date: "2024-12-22",
      status: "pending",
    },
  ]);

  // fecha seleccionada para el panel
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setEditingCampaign(null);
    setIsFormOpen(true);
  };

  const handleEditCampaign = (campaign) => {
    setSelectedDate(campaign.date);
    setEditingCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleSaveCampaign = (data) => {
    if (data.id) {
      // update
      setCampaigns((prev) =>
        prev.map((c) => (c.id === data.id ? data : c))
      );
    } else {
      // create
      const newCamp = {
        ...data,
        id: Date.now(),
      };
      setCampaigns((prev) => [...prev, newCamp]);
    }
    setIsFormOpen(false);
  };

  const filteredCampaigns =
    statusFilter === "all"
      ? campaigns
      : campaigns.filter((c) => c.status === statusFilter);

  return (
    <div className="min-h-screen bg-[#0c0719] text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Calendar</h1>
          <p className="text-sm text-gray-400">
            Plan and manage your social media content
          </p>
        </div>

        {/* view toggle */}
        <div className="flex bg-white/5 rounded-full overflow-hidden">
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-2 text-sm ${
              view === "calendar" ? "bg-[#9ca9ff] text-black" : "text-white/70"
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 text-sm ${
              view === "list" ? "bg-white/10 text-white" : "text-white/70"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* main content area */}
      <div className="relative flex gap-4">
        <div className={`flex-1 ${isFormOpen ? "mr-80" : ""}`}>
          {view === "calendar" ? (
            <CalendarView
              campaigns={filteredCampaigns}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onDayClick={handleDayClick}
            />
          ) : (
            <CalendarListView
              campaigns={filteredCampaigns}
              setStatusFilter={setStatusFilter}
              statusFilter={statusFilter}
              onEdit={handleEditCampaign}
            />
          )}
        </div>

        {/* side panel */}
        {isFormOpen && (
          <CampaignForm
            date={selectedDate}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSaveCampaign}
            initialData={editingCampaign}
          />
        )}
      </div>
    </div>
  );
}
