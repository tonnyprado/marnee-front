/**
 * Navbar Component - Premium Dark Sidebar
 * Main navigation sidebar with elegant dark theme
 * Features: collapsible, responsive, smooth transitions
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthSession, setAuthSession } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import LogoutConfirmationModal from "../LogoutConfirmationModal";
import InstagramConnectionButton from "../../components/InstagramConnectionButton";
import SidebarLogo from "./SidebarLogo";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";
import { getNavIcon } from "./NavIcons";

export default function Navbar({ active = "ai-content" }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const session = getAuthSession();
  const [collapsed, setCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const displayName = session?.name || session?.email || t("common.userFallback");
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const handleLogout = () => {
    setAuthSession(null);
    window.dispatchEvent(new CustomEvent("app-logout"));
    navigate("/auth");
  };

  const navItems = [
    {
      id: "branding-test",
      label: t("navbar.brandingTest"),
      icon: "sparkles",
      path: "/brand-test/intro"
    },
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
      id: "dashboard",
      label: t("navbar.dashboard"),
      icon: "dashboard",
      path: "/app/dashboard"
    },
  ];

  return (
    <>
      {/* Premium Dark Sidebar */}
      <aside
        className={`
          ${collapsed ? 'w-20' : 'w-64'}
          bg-[#1a0530] flex flex-col h-dvh shrink-0
          transition-all duration-300 ease-in-out
          font-['DM_Sans']
          max-lg:!w-20
        `}
      >
        {/* Logo Section */}
        <SidebarLogo
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        {/* Expand button when collapsed - desktop only */}
        {collapsed && (
          <div className="px-3 py-2 border-b border-[rgba(220,202,244,0.15)] max-lg:hidden">
            <button
              onClick={() => setCollapsed(false)}
              className="w-full flex items-center justify-center text-[rgba(246,246,246,0.3)] hover:text-[rgba(246,246,246,0.7)] transition-colors duration-150"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-2.5 py-4 overflow-y-auto space-y-0.5">
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
        </nav>

        {/* Instagram Connection - Premium Integration */}
        <div className={`px-3 pb-4 ${collapsed ? 'flex justify-center' : ''} max-lg:flex max-lg:justify-center`}>
          <InstagramConnectionButton collapsed={collapsed} />
        </div>

        {/* User Menu Section */}
        <div className="
          mt-auto border-t border-[rgba(220,202,244,0.12)]
          px-4 py-3.5
        ">
          <UserMenu
            displayName={displayName}
            email={session?.email || t("common.freePlan")}
            initials={initials}
            collapsed={collapsed}
            onNavigate={navigate}
            onLogout={() => setIsLogoutModalOpen(true)}
            t={t}
          />
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
