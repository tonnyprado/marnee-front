/**
 * TopTabs Component
 * Premium horizontal tabs for dashboard navigation
 * Features: smooth transitions, active state, hover effects
 */
export default function TopTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="
      border-b border-[#dccaf4] h-12
      flex items-center px-8 gap-0
      bg-[#f6f6f6]
    ">
      {tabs.map((tab) => {
        const key = tab.toLowerCase().replace(/\s+/g, "-");
        const isActive = activeTab === key;

        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`
              h-12 px-3.5 text-[12.5px] font-normal
              font-['DM_Sans'] whitespace-nowrap
              transition-all duration-150
              border-b-2
              ${isActive
                ? "text-[#40086d] border-[#40086d] font-medium"
                : "text-[rgba(30,30,30,0.38)] border-transparent hover:text-[#1e1e1e]"
              }
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
