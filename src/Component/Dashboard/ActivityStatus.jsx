/**
 * ActivityStatus Component
 * Indicador de actividad con estado live y última actualización
 * Reutilizable para cualquier sección que necesite mostrar estado de tracking
 */
import { PulsingDot } from './index';

export default function ActivityStatus({
  isLive = true,
  label = "Live tracking active",
  lastUpdated = new Date(),
  color = "#22c55e",
  showTimestamp = true
}) {
  const formatTime = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleTimeString();
  };

  return (
    <div className="flex items-center gap-4 px-5 py-3 bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px]">
      {isLive && <PulsingDot color={color} label={label} />}
      {!isLive && (
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#94a3b8' }}
          />
          <span className="text-[11px] text-[rgba(30,30,30,0.55)]">
            {label}
          </span>
        </div>
      )}
      {showTimestamp && (
        <span className="text-[11px] text-[rgba(30,30,30,0.55)]">
          Last updated: {formatTime(lastUpdated)}
        </span>
      )}
    </div>
  );
}
