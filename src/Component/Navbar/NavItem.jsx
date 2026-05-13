/**
 * NavItem Component
 * Reusable navigation item for the sidebar
 * Handles active states, hover effects, and tooltips
 */
export default function NavItem({
  id,
  label,
  icon,
  isActive,
  onClick,
  collapsed
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`
          w-full flex items-center gap-2.5 px-3 py-2 rounded-lg
          transition-all duration-150 font-['DM_Sans']
          ${isActive
            ? "bg-[rgba(64,8,109,0.55)] text-[#f6f6f6]"
            : "text-[rgba(246,246,246,0.45)] hover:text-[#f6f6f6] hover:bg-[rgba(220,202,244,0.08)]"
          }
          ${collapsed ? 'justify-center' : ''}
          max-lg:justify-center
        `}
        title={collapsed ? label : ''}
      >
        {/* Icon */}
        <span
          className={`
            shrink-0 w-4 h-4 transition-opacity duration-150
            ${isActive ? 'opacity-100' : 'opacity-70'}
          `}
        >
          {icon}
        </span>

        {/* Label - hidden when collapsed or on mobile */}
        {!collapsed && (
          <span className="text-[13px] font-normal max-lg:hidden">
            {label}
          </span>
        )}
      </button>

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="
          absolute left-full ml-2 top-1/2 -translate-y-1/2
          px-2 py-1 bg-[#f6f6f6] text-[#1e1e1e] text-xs rounded-md
          opacity-0 group-hover:opacity-100 pointer-events-none
          transition-opacity duration-150 whitespace-nowrap z-50
          shadow-lg border border-[#dccaf4]
        ">
          {label}
        </div>
      )}
    </div>
  );
}
