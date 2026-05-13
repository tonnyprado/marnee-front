/**
 * ConnectState Component
 * Premium empty state cuando el usuario no ha conectado su cuenta
 * Muestra un estado elegante con call-to-action
 */
import { DashboardButton } from './';

export default function ConnectState({
  icon,
  title,
  description,
  features = [],
  buttonText = "Connect Account",
  buttonIcon,
  onConnect,
  note
}) {
  return (
    <div className="
      bg-[#f6f6f6] border border-dashed border-[#dccaf4]
      rounded-[10px] p-12 flex flex-col items-center
      text-center gap-3.5
    ">
      {/* Icon */}
      {icon && (
        <div className="
          w-[52px] h-[52px] bg-[#ede0f8] rounded-xl
          flex items-center justify-center
        ">
          <div className="w-6 h-6 text-[#40086d]">
            {icon}
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="
        font-['Noto_Serif'] text-base font-bold
        text-[#1e1e1e]
      ">
        {title}
      </h3>

      {/* Description */}
      <p className="
        text-[12.5px] text-[rgba(30,30,30,0.55)]
        max-w-md leading-relaxed
      ">
        {description}
      </p>

      {/* Feature pills */}
      {features.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center mt-1">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
                flex items-center gap-1.5 px-3 py-1.5
                rounded-full bg-[#ede0f8] border border-[#dccaf4]
                text-[11.5px] font-medium text-[#40086d]
              "
            >
              {feature}
            </div>
          ))}
        </div>
      )}

      {/* Connect Button */}
      <DashboardButton
        variant="primary"
        icon={buttonIcon}
        onClick={onConnect}
        className="mt-1 px-6 py-2.5 text-[13px]"
      >
        {buttonText}
      </DashboardButton>

      {/* Note */}
      {note && (
        <p className="text-[11.5px] text-[rgba(30,30,30,0.38)] mt-1">
          {note}
        </p>
      )}
    </div>
  );
}
