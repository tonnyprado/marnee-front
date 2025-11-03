import React, { useState, useEffect } from "react";

export default function CampaignForm({
  date,
  onClose,
  onSave,
  initialData = null,
}) {
  const [form, setForm] = useState({
    id: null,
    title: "",
    date: date || "",
    media: "",
    script: "",
    caption: "",
    hashtags: "",
    status: "pending",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        title: initialData.title,
        date: initialData.date,
        media: "",
        script: initialData.script || "",
        caption: initialData.caption || "",
        hashtags: initialData.hashtags || "",
        status: initialData.status,
      });
    } else {
      setForm((prev) => ({ ...prev, date: date || prev.date }));
    }
  }, [initialData, date]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // enviamos solo lo importante
    onSave({
      id: form.id,
      title: form.title || "Untitled content",
      date: form.date,
      status: form.status,
      script: form.script,
      caption: form.caption,
      hashtags: form.hashtags,
    });
  };

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white text-black shadow-xl flex flex-col z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <p className="text-sm text-gray-500">
            {new Date(form.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h2 className="text-lg font-semibold">
            {initialData ? "Edit Content" : "New Content"}
          </h2>
        </div>
        <button onClick={onClose} className="text-sm text-gray-500">
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="text-xs text-gray-500">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Holiday marketing tips"
            className="w-full border rounded-md px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Media Files</label>
          <div className="w-full border-dashed border-2 border-gray-200 rounded-md p-4 text-center text-xs text-gray-400 mt-1">
            Click to upload images or videos
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500">Script/Content</label>
          <textarea
            value={form.script}
            onChange={(e) => handleChange("script", e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1 h-20 resize-none"
            placeholder="Write your script or content details..."
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Caption</label>
          <textarea
            value={form.caption}
            onChange={(e) => handleChange("caption", e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1 h-16 resize-none"
            placeholder="Write your social media caption..."
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Hashtags</label>
          <input
            value={form.hashtags}
            onChange={(e) => handleChange("hashtags", e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1"
            placeholder="#hashtag1 #hashtag2 #hashtag3"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Status</label>
          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1"
          >
            <option value="pending">Pending</option>
            <option value="uploaded">Uploaded</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-[#9ca9ff] text-black font-semibold py-2 rounded-md"
          >
            Save Content
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 rounded-md py-2 text-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
