/**
 * LockedMetricCard Component
 * Muestra una métrica bloqueada con efecto blur premium
 */
export default function LockedMetricCard({
  label,
  value,
  locked = true,
  icon: LockIcon
}) {
  return (
    <div className="
      bg-[#f6f6f6] border border-[#dccaf4]
      rounded-[10px] px-[18px] py-4
    ">
      {/* Label */}
      <div className="
        text-[10px] font-semibold text-[rgba(30,30,30,0.38)]
        uppercase tracking-[0.5px] mb-1
      ">
        {label}
      </div>

      {/* Value - with blur if locked */}
      <div
        className={`
          font-['Noto_Serif'] text-[26px] font-bold
          text-[#40086d] mb-0.5
          ${locked ? 'blur-[6px] select-none' : ''}
        `}
      >
        {value}
      </div>

      {/* Lock message */}
      {locked && (
        <div className="
          text-[11px] text-[rgba(30,30,30,0.38)]
          flex items-center gap-1
        ">
          {LockIcon ? (
            <LockIcon className="w-3 h-3" />
          ) : (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          )}
          <span>Connect to unlock</span>
        </div>
      )}
    </div>
  );
}
