import { useState } from "react";
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
      colors="primary:#40086d,secondary:#40086d,tertiary:#40086d,quaternary:#40086d"
      style={{ width: '28px', height: '28px' }}
    />
  ),
  brain: (
    <lord-icon
      src="https://cdn.lordicon.com/gqlpvzkp.json"
      trigger="hover"
      colors="primary:#40086d,secondary:#40086d"
      style={{ width: '28px', height: '28px' }}
    />
  ),
  calendar: (
    <lord-icon
      src="https://cdn.lordicon.com/xhgjylsr.json"
      trigger="hover"
      state="hover-flutter"
      colors="primary:#40086d,secondary:#40086d,tertiary:#40086d,quaternary:#40086d"
      style={{ width: '28px', height: '28px' }}
    />
  ),
  folder: (
    <lord-icon
      src="https://cdn.lordicon.com/wdztjihe.json"
      trigger="loop"
      state="loop-all"
      colors="primary:#40086d,secondary:#40086d,tertiary:#40086d,quaternary:#40086d"
      style={{ width: '28px', height: '28px' }}
    />
  ),
};

export default function Navbar({ active = "ai-content" }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const session = getAuthSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${collapsed ? 'w-20' : 'w-72'}
          bg-white text-gray-900 flex flex-col h-screen border-r border-[rgba(30,30,30,0.1)] shrink-0 transition-all duration-300
          max-lg:fixed max-lg:z-40 max-lg:!w-72
          ${mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center ${collapsed ? 'justify-center lg:justify-center' : 'justify-between'} px-4 py-5 border-b border-[rgba(30,30,30,0.1)] max-lg:justify-between`}>
          <div
            className={`transition ${collapsed ? 'scale-75 lg:scale-75' : ''} max-lg:scale-100`}
          >
            <Logo dark={true} iconOnly={collapsed} />
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className={`text-gray-400 hover:text-gray-600 transition ${collapsed ? 'hidden' : 'hidden lg:block'}`}
            title="Collapse sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Expand button when collapsed - only on desktop */}
        {collapsed && (
          <div className="px-4 py-2 border-b border-[rgba(30,30,30,0.1)] hidden lg:block">
            <button
              onClick={() => setCollapsed(false)}
              className="w-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.id === active;
            const isCollapsedDesktop = collapsed;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center ${isCollapsedDesktop ? 'lg:justify-center lg:px-3' : 'gap-3 px-3'} gap-3 px-3 py-3 rounded text-left transition ${
                    isActive
                      ? "bg-[#ede0f8] text-[#40086d] border border-[#dccaf4]"
                      : "text-gray-600 hover:bg-[#f6f6f6]"
                  }`}
                  title={isCollapsedDesktop ? item.label : ''}
                >
                  <span className={`shrink-0 ${isActive ? "text-[#40086d]" : "text-gray-400"}`}>
                    {icons[item.icon]}
                  </span>
                  <span className={`text-sm font-medium ${isCollapsedDesktop ? 'lg:hidden' : ''}`}>{item.label}</span>
                </button>

                {/* Tooltip when collapsed - only on desktop */}
                {isCollapsedDesktop && (
                  <div className="hidden lg:block absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User box */}
        <div className="mt-auto border-t border-[rgba(30,30,30,0.1)] px-3 py-4">
          {/* Mobile - always expanded */}
          <div className="lg:hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-[#40086d] text-[#dccaf4] flex items-center justify-center text-sm font-medium">
                {initials || t("common.userFallback").slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{session?.email || t("common.freePlan")}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              <button onClick={() => { navigate("/app/profile-settings"); setMobileOpen(false); }} className="block w-full text-left hover:text-[#40086d] transition">{t("navbar.profileSettings")}</button>
              <button onClick={() => { navigate("/app/billing"); setMobileOpen(false); }} className="block w-full text-left hover:text-[#40086d] transition">{t("navbar.billingPlans")}</button>
              <button className="block w-full text-left hover:text-[#40086d] transition">{t("navbar.notifications")}</button>
              <button onClick={() => { navigate("/app/help-support"); setMobileOpen(false); }} className="block w-full text-left hover:text-[#40086d] transition">{t("navbar.helpSupport")}</button>
            </div>

            <button
              onClick={() => {
                setAuthSession(null);
                window.dispatchEvent(new CustomEvent("app-logout"));
                navigate("/auth");
                setMobileOpen(false);
              }}
              className="mt-4 text-sm text-red-500 hover:text-red-600 transition w-full text-left"
            >
              {t("navbar.logout")}
            </button>
          </div>

          {/* Desktop - can be collapsed or expanded */}
          <div className="hidden lg:block">
            {!collapsed ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded bg-[#40086d] text-[#dccaf4] flex items-center justify-center text-sm font-medium">
                    {initials || t("common.userFallback").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{session?.email || t("common.freePlan")}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-500">
                  <button onClick={() => navigate("/app/profile-settings")} className="block w-full text-left hover:text-[#40086d] transition">{t("navbar.profileSettings")}</button>
                  <button onClick={() => navigate("/app/billing")} className="block w-full text-left hover:text-[#40086d] transition">{t("navbar.billingPlans")}</button>
                  <button className="block w-full text-left hover:text-[#40086d] transition">{t("navbar.notifications")}</button>
                  <button onClick={() => navigate("/app/help-support")} className="block w-full text-left hover:text-[#40086d] transition">{t("navbar.helpSupport")}</button>
                </div>

                <button
                  onClick={() => {
                    setAuthSession(null);
                    window.dispatchEvent(new CustomEvent("app-logout"));
                    navigate("/auth");
                  }}
                  className="mt-4 text-sm text-red-500 hover:text-red-600 transition w-full text-left"
                >
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded bg-[#40086d] text-[#dccaf4] flex items-center justify-center text-sm font-medium">
                  {initials || t("common.userFallback").slice(0, 1).toUpperCase()}
                </div>
                <button
                  onClick={() => {
                    setAuthSession(null);
                    window.dispatchEvent(new CustomEvent("app-logout"));
                    navigate("/auth");
                  }}
                  className="text-red-500 hover:text-red-600 transition"
                  title={t("navbar.logout")}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
