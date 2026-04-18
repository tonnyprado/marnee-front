import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { getAuthSession, setAuthSession } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

// Simple icon components
const icons = {
  sparkles: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  brain: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  folder: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
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
    // { id: "dashboard", label: t("navbar.dashboard"), icon: "folder", path: "/app/dashboard" }, // Disabled for MVP Beta
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
          <button className="block hover:text-[#40086d] transition">{t("navbar.profileSettings")}</button>
          <button onClick={() => navigate("/app/billing")} className="block hover:text-[#40086d] transition">{t("navbar.billingPlans")}</button>
          <button className="block hover:text-[#40086d] transition">{t("navbar.notifications")}</button>
          <button className="block hover:text-[#40086d] transition">{t("navbar.helpSupport")}</button>
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
