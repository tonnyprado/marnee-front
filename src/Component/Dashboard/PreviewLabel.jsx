/**
 * PreviewLabel Component
 * Label que indica que los datos son de preview/demo
 */
export default function PreviewLabel({ text = "Preview — data appears here after connecting" }) {
  return (
    <div className="
      text-[10px] font-semibold text-[rgba(30,30,30,0.38)]
      uppercase tracking-[0.6px] flex items-center gap-1.5
      mb-3 mt-5
    ">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>{text}</span>
    </div>
  );
}
