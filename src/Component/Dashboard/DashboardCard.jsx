/**
 * DashboardCard Component
 * Reusable card container with premium styling
 */
export default function DashboardCard({
  title,
  children,
  className = "",
  noPadding = false
}) {
  return (
    <div className={`
      bg-[#f6f6f6] border border-[#dccaf4]
      rounded-[10px] overflow-hidden
      ${className}
    `}>
      {title && (
        <div className="
          px-5 pt-[18px] pb-3
          text-[10px] font-semibold text-[rgba(30,30,30,0.38)]
          uppercase tracking-[0.7px] font-['DM_Sans']
        ">
          {title}
        </div>
      )}
      <div className={noPadding ? "" : "px-5 pb-[18px]"}>
        {children}
      </div>
    </div>
  );
}
