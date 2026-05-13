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
        {/* Icon */}
        <div className="
          w-[30px] h-[30px] bg-[#40086d] rounded-md
          flex items-center justify-center
        ">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f6f6f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <circle cx="12" cy="8" r="3"/>
            <path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
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
