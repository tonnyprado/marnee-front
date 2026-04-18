import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { getAuthSession, setAuthSession } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

// Lordicon animated icons
const icons = {
  sparkles: (
    <lord-icon
      src="https://cdn.lordicon.com/gpgeihgx.json"
      trigger="hover"
      colors="primary:#1b1091,secondary:#e5d1fa,tertiary:#7166ee,quaternary:#ee66aa"
      style={{ width: '28px', height: '28px' }}
    />
  ),
  brain: (
    <lord-icon
      src="https://cdn.lordicon.com/gqlpvzkp.json"
      trigger="hover"
      colors="primary:#a39cf4,secondary:#ebe6ef"
      style={{ width: '28px', height: '28px' }}
    />
  ),
  calendar: (
    <lord-icon
      src="https://cdn.lordicon.com/xhgjylsr.json"
      trigger="hover"
      state="hover-flutter"
      colors="primary:#3a3347,secondary:#e5d1fa,tertiary:#a39cf4,quaternary:#f9c9c0"
      style={{ width: '28px', height: '28px' }}
    />
  ),
  folder: (
    <lord-icon
      src="https://cdn.lordicon.com/wdztjihe.json"
      trigger="loop"
      state="loop-all"
      colors="primary:#121331,secondary:#a39cf4,tertiary:#7166ee,quaternary:#fad1e6"
      style={{ width: '28px', height: '28px' }}
    />
  ),
};

export default function Navbar({ active = "ai-content" }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const session = getAuthSession();
  const displayName = session?.name || session?.email || t("common.userFallback");
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
  const navItems = [
    { id: "branding-test", label: t("navbar.brandingTest"), icon: "sparkles", path: "/brand-test/intro" },
    { id: "ai-content", label: t("navbar.aiContent"), icon: "brain", path: "/app" },
    { id: "calendar", label: t("navbar.calendar"), icon: "calendar", path: "/app/calendar" },
    { id: "dashboard", label: t("navbar.dashboard"), icon: "folder", path: "/app/dashboard" },
  ];

  return (
    <aside className="w-72 bg-white text-gray-900 flex flex-col h-screen border-r border-[rgba(30,30,30,0.1)] shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(30,30,30,0.1)]">
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer hover:opacity-80 transition"
        >
          <Logo dark={true} />
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded text-left transition ${
                isActive
                  ? "bg-[#ede0f8] text-[#40086d] border border-[#dccaf4]"
                  : "text-gray-600 hover:bg-[#f6f6f6]"
              }`}
            >
              <span className={`shrink-0 ${isActive ? "text-[#40086d]" : "text-gray-400"}`}>
                {icons[item.icon]}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User box */}
      <div className="mt-auto border-t border-[rgba(30,30,30,0.1)] px-5 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded bg-[#40086d] text-[#dccaf4] flex items-center justify-center text-sm font-medium">
            {initials || t("common.userFallback").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">{session?.email || t("common.freePlan")}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <button onClick={() => navigate("/app/profile-settings")} className="block hover:text-[#40086d] transition">{t("navbar.profileSettings")}</button>
          <button onClick={() => navigate("/app/billing")} className="block hover:text-[#40086d] transition">{t("navbar.billingPlans")}</button>
          <button className="block hover:text-[#40086d] transition">{t("navbar.notifications")}</button>
          <button onClick={() => navigate("/app/help-support")} className="block hover:text-[#40086d] transition">{t("navbar.helpSupport")}</button>
        </div>

        <button
          onClick={() => {
            setAuthSession(null);
            window.dispatchEvent(new CustomEvent("app-logout"));
            navigate("/auth");
          }}
          className="mt-4 text-sm text-red-500 hover:text-red-600 transition"
        >
          {t("navbar.logout")}
        </button>
      </div>
    </aside>
  );
}
