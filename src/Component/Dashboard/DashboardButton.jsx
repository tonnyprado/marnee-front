/**
 * DashboardButton Component
 * Reusable buttons for dashboard actions
 */
export default function DashboardButton({
  children,
  variant = "primary",
  icon,
  onClick,
  className = "",
  ...props
}) {
  const baseStyles = `
    flex items-center gap-2 rounded-[7px]
    px-[18px] py-2.5 text-[12.5px] font-medium
    font-['DM_Sans'] transition-all duration-150
    whitespace-nowrap cursor-pointer border-none
  `;

  const variants = {
    primary: `
      bg-[#40086d] text-[#f6f6f6]
      hover:bg-[#330558]
    `,
    secondary: `
      bg-[#f6f6f6] text-[#1e1e1e]
      border border-[#dccaf4]
      hover:border-[#40086d] hover:text-[#40086d]
    `
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && (
        <span className="w-[13px] h-[13px]">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}
