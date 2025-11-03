import React from "react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { id: "branding-test", label: "Branding Test", icon: "✨", path: "/brand-test/intro" },
  { id: "ai-content", label: "AI Content & Brand Strategist", icon: "🧠", path: "/app" },
  { id: "calendar", label: "Content Calendar", icon: "📅", path: "/app/calendar" },
  { id: "dashboard", label: "My Dashboard", icon: "📁", path: "/app/dashboard" },
];

export default function Navbar({ active = "ai-content" }) {
  const navigate = useNavigate();

  return (
    <aside className="w-72 bg-white text-black flex flex-col h-screen border-r border-black/5">
      {/* Logo + collapse */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
        <div
          onClick={() => navigate("/")}
          className="text-3xl font-extrabold font-serif cursor-pointer hover:opacity-80 transition"
        >
          DnHub
        </div>
        <button className="text-sm text-gray-500 hover:text-black">«</button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                isActive
                  ? "bg-[#eff1ff] text-black"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User box */}
      <div className="mt-auto border-t border-black/5 px-5 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
            DN
          </div>
          <div>
            <p className="text-sm font-semibold">Diana Nonea</p>
            <p className="text-xs text-gray-500">Pro Plan</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <button className="block hover:text-black">Profile Settings</button>
          <button className="block hover:text-black">Billing & Plans</button>
          <button className="block hover:text-black">Notifications</button>
          <button className="block hover:text-black">Help & Support</button>
        </div>

        <button
          onClick={() => navigate("/auth")}
          className="mt-4 text-sm text-red-500 hover:text-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
