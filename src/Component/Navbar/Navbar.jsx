/**
 * Navbar Component - Pills Design
 * Sidebar with pill-shaped sections that expands on hover
 * Background adapts to current page color
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthSession } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import InstagramConnectionButton from "../../components/InstagramConnectionButton";
import NavItem from "./NavItem";
import { getNavIcon } from "./NavIcons";

// Page background colors mapping
const PAGE_BACKGROUNDS = {
  "ai-content": "#f8f7fc",      // Chat page - light purple/gray
  "calendar": "#f9fafb",         // Calendar - light gray
  "brainstorming": "#faf5ff",    // Brainstorming - light violet
  "scripts": "#f8fafc",          // Scripts - slate
  "dashboard": "#fafafa",        // Dashboard - neutral
};

export default function Navbar({ active = "ai-content" }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const session = getAuthSession();
  const [collapsed, setCollapsed] = useState(true);

  const displayName = session?.name || session?.email || t("common.userFallback");
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const navItems = [
    {
      id: "ai-content",
      label: t("navbar.aiContent"),
      icon: "brain",
      path: "/app"
    },
    {
      id: "calendar",
      label: t("navbar.calendar"),
      icon: "calendar",
      path: "/app/calendar"
    },
    {
      id: "brainstorming",
      label: t("navbar.brainstorming"),
      icon: "brainstorm",
      path: "/app/brainstorming"
    },
    {
      id: "scripts",
      label: t("navbar.scripts"),
      icon: "script",
      path: "/app/scripts"
    },
    {
      id: "dashboard",
      label: t("navbar.dashboard"),
      icon: "dashboard",
      path: "/app/dashboard"
    },
  ];

  // Get current page background color
  const bgColor = PAGE_BACKGROUNDS[active] || "#f8f7fc";

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      style={{ backgroundColor: bgColor }}
      className={`
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        flex flex-col h-dvh shrink-0 p-2.5 gap-2.5
        transition-all duration-300 ease-in-out
        font-['DM_Sans']
        max-lg:!w-[72px]
      `}
    >
      {/* Single Pill containing everything */}
      <div className="bg-[#1a0530] rounded-2xl p-2.5 flex-1 flex flex-col overflow-hidden">
        {/* Logo */}
        <div className={`py-2 flex items-center gap-3 mb-2 ${collapsed ? 'justify-center' : 'px-1'} max-lg:justify-center`}>
          <div className="w-[38px] h-[38px] flex items-center justify-center flex-shrink-0">
            <svg width="38" height="38" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 30C24 30 29 24 29 17C29 10 24 6 16 6C8 6 3 10 3 17C3 24 8 30 16 30Z" fill="url(#navBody)" />
              <path d="M7 8C5 4 6 1 9 1C12 1 12 4 11 8" fill="url(#navBody)" />
              <path d="M25 8C27 4 26 1 23 1C20 1 20 4 21 8" fill="url(#navBody)" />
              <path d="M5 13C5 8 9 4 16 4C23 4 27 8 27 13" stroke="url(#navHeadset)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <rect x="1" y="11" width="5" height="7" rx="2" fill="url(#navHeadset)" />
              <rect x="26" y="11" width="5" height="7" rx="2" fill="url(#navHeadset)" />
              <path d="M6 16C6 16 8 18 10 22" stroke="url(#navHeadset)" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="11" cy="23" r="2.5" fill="url(#navMic)" />
              <defs>
                <linearGradient id="navBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="navHeadset" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>
                <linearGradient id="navMic" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#DB2777" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {!collapsed && (
            <span className="font-['Noto_Serif'] text-[20px] font-bold text-white tracking-tight whitespace-nowrap max-lg:hidden">
              Marnee
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-1 mb-2" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                id={item.id}
                label={item.label}
                icon={getNavIcon(item.icon)}
                isActive={item.id === active}
                collapsed={collapsed}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        </nav>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-1 my-2" />

        {/* Connect Networks */}
        <div className="mb-2">
          <InstagramConnectionButton collapsed={collapsed} />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-1 mb-2" />

        {/* User */}
        <div
          onClick={() => navigate("/app/profile-settings")}
          className={`
            flex items-center gap-3 cursor-pointer
            hover:opacity-80 transition-opacity px-1
            ${collapsed ? 'justify-center' : ''}
            max-lg:justify-center
          `}
        >
          {/* Avatar */}
          <div className="
            w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600
            text-white flex items-center justify-center
            text-[12px] font-semibold font-['DM_Sans']
            flex-shrink-0 shadow-sm
          ">
            {initials}
          </div>

          {/* User Info - hidden when collapsed */}
          {!collapsed && (
            <div className="flex-1 min-w-0 max-lg:hidden">
              <p className="text-[13px] font-medium text-white truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-[rgba(255,255,255,0.5)] truncate">
                {session?.email || t("common.freePlan")}
              </p>
            </div>
          )}

          {/* Settings icon - only when expanded */}
          {!collapsed && (
            <svg
              className="w-4 h-4 text-[rgba(255,255,255,0.4)] flex-shrink-0 max-lg:hidden"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>
    </aside>
  );
}
