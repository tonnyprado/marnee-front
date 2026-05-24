/**
 * SidebarLogo Component
 * Logo section for the sidebar with collapse toggle
 */
export default function SidebarLogo({ collapsed, onToggleCollapse }) {
  return (
    <div className="
      flex items-center justify-between px-5 py-[22px]
      border-b border-[rgba(220,202,244,0.15)]
      max-lg:justify-center
    ">
      {/* Logo */}
      <div className="flex items-center gap-2.5 max-lg:gap-0">
        {/* Marnee Logo */}
        <div className="w-[30px] h-[30px] flex items-center justify-center">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Marnee body silhouette */}
            <path d="M16 30C24 30 29 24 29 17C29 10 24 6 16 6C8 6 3 10 3 17C3 24 8 30 16 30Z" fill="url(#sidebarBody)" />
            {/* Left ear */}
            <path d="M7 8C5 4 6 1 9 1C12 1 12 4 11 8" fill="url(#sidebarBody)" />
            {/* Right ear */}
            <path d="M25 8C27 4 26 1 23 1C20 1 20 4 21 8" fill="url(#sidebarBody)" />
            {/* Headset band */}
            <path d="M5 13C5 8 9 4 16 4C23 4 27 8 27 13" stroke="url(#sidebarHeadset)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Left headphone */}
            <rect x="1" y="11" width="5" height="7" rx="2" fill="url(#sidebarHeadset)" />
            {/* Right headphone */}
            <rect x="26" y="11" width="5" height="7" rx="2" fill="url(#sidebarHeadset)" />
            {/* Microphone arm */}
            <path d="M6 16C6 16 8 18 10 22" stroke="url(#sidebarHeadset)" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Microphone tip */}
            <circle cx="11" cy="23" r="2.5" fill="url(#sidebarMic)" />
            <defs>
              <linearGradient id="sidebarBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="sidebarHeadset" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#6D28D9" />
              </linearGradient>
              <linearGradient id="sidebarMic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#DB2777" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Name - hidden when collapsed or on mobile */}
        {!collapsed && (
          <span className="
            font-['Noto_Serif'] text-[19px] font-bold
            text-[#f6f6f6] tracking-tight
            max-lg:hidden
          ">
            Marnee
          </span>
        )}
      </div>

      {/* Collapse toggle - only shown when expanded and on desktop */}
      {!collapsed && (
        <button
          onClick={onToggleCollapse}
          className="text-[rgba(246,246,246,0.3)] hover:text-[rgba(246,246,246,0.7)] transition-colors duration-150 max-lg:hidden"
          title="Collapse sidebar"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
