/**
 * PageHeader Component
 * Page title and actions for dashboard sections
 */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h1 className="
          font-['Noto_Serif'] text-[22px] font-bold
          text-[#1e1e1e] tracking-tight leading-tight
        ">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[12.5px] text-[rgba(30,30,30,0.38)] mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex gap-2.5">
          {actions}
        </div>
      )}
    </div>
  );
}
