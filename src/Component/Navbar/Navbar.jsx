/**
 * Navbar Component
 * Sidebar rectangle design with toggle button
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAuthSession } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import NavItem from "./NavItem";
import { getNavIcon } from "./NavIcons";
import marneeLogo from "../../assets/marnee-logo-512.png";

export default function Navbar({ active = "ai-content" }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const session = getAuthSession();
  const [collapsed, setCollapsed] = useState(false);

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

  return (
    <aside
      className={`
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        flex flex-col h-dvh shrink-0
        transition-all duration-300 ease-in-out
        font-['DM_Sans'] bg-[#1a0530]
        max-lg:!w-[72px]
      `}
    >
      {/* Logo + Toggle */}
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} max-lg:justify-center`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <img
            src={marneeLogo}
            alt="Marnee"
            className="w-[38px] h-[38px] object-contain flex-shrink-0"
          />
          {!collapsed && (
            <span className="font-['Noto_Serif'] text-[20px] font-bold text-white tracking-tight whitespace-nowrap max-lg:hidden">
              Marnee
            </span>
          )}
        </div>

        {/* Toggle button */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white max-lg:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mb-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white max-lg:hidden"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Divider */}
      <div className="h-px bg-white/10 mx-3" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
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
      <div className="h-px bg-white/10 mx-3" />

      {/* User */}
      <div className="p-3">
        <div
          onClick={() => navigate("/app/profile-settings")}
          className={`
            flex items-center gap-3 cursor-pointer
            hover:opacity-80 transition-opacity
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
