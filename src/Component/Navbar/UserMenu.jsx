/**
 * UserMenu Component
 * User profile and quick actions in the sidebar
 * Adapts to collapsed/expanded states
 */
export default function UserMenu({
  displayName,
  email,
  initials,
  collapsed,
  onNavigate,
  onLogout,
  t
}) {
  // On mobile, always show collapsed version
  // On desktop, respect collapsed prop
  const isCollapsedView = collapsed;

  if (isCollapsedView) {
    return (
      <div className="flex flex-col items-center gap-3 lg:flex max-lg:flex">
        {/* Avatar */}
        <div className="
          w-8 h-8 rounded-md bg-[#40086d]
          text-[#f6f6f6] flex items-center justify-center
          text-[11px] font-semibold font-['Noto_Serif']
        ">
          {initials}
        </div>

        {/* Logout icon */}
        <button
          onClick={onLogout}
          className="text-[rgba(220,80,80,0.55)] hover:text-[rgba(220,80,80,0.9)] transition-colors duration-150"
          title={t("navbar.logout")}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="max-lg:hidden">
      {/* User info */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="
          w-8 h-8 rounded-md bg-[#40086d]
          text-[#f6f6f6] flex items-center justify-center
          text-[11px] font-semibold font-['Noto_Serif']
        ">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-medium text-[#f6f6f6] truncate">
            {displayName}
          </p>
          <p className="text-[10.5px] text-[rgba(246,246,246,0.35)] truncate">
            {email}
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="flex flex-col gap-0.5 mb-2">
        <button
          onClick={() => onNavigate("/app/profile-settings")}
          className="text-[11.5px] text-[rgba(246,246,246,0.3)] hover:text-[rgba(246,246,246,0.7)] transition-colors duration-150 text-left py-0.5"
        >
          {t("navbar.profileSettings")}
        </button>
        <button
          onClick={() => onNavigate("/app/billing")}
          className="text-[11.5px] text-[rgba(246,246,246,0.3)] hover:text-[rgba(246,246,246,0.7)] transition-colors duration-150 text-left py-0.5"
        >
          {t("navbar.billingPlans")}
        </button>
        <button
          className="text-[11.5px] text-[rgba(246,246,246,0.3)] hover:text-[rgba(246,246,246,0.7)] transition-colors duration-150 text-left py-0.5"
        >
          {t("navbar.notifications")}
        </button>
        <button
          onClick={() => onNavigate("/app/help-support")}
          className="text-[11.5px] text-[rgba(246,246,246,0.3)] hover:text-[rgba(246,246,246,0.7)] transition-colors duration-150 text-left py-0.5"
        >
          {t("navbar.helpSupport")}
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="text-[11.5px] text-[rgba(220,80,80,0.55)] hover:text-[rgba(220,80,80,0.9)] transition-colors duration-150 text-left"
      >
        {t("navbar.logout")}
      </button>
    </div>
  );
}
