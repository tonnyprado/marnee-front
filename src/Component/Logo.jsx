import React from "react";

// Logo Component - Modern minimal style with compass icon
export default function Logo({ dark = true, size = "default" }) {
  const sizes = {
    small: { icon: 24, text: "text-lg" },
    default: { icon: 30, text: "text-[22px]" },
    large: { icon: 40, text: "text-3xl" },
  };

  const { icon, text } = sizes[size] || sizes.default;

  return (
    <div className="flex items-center gap-2.5">
      {/* Icon - Minimal compass/direction symbol */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Outer ring */}
        <circle cx="15" cy="15" r="13" stroke="url(#compassGradLogo)" strokeWidth="2" fill="none" />
        {/* Compass needle - pointing up-right (direction/growth) */}
        <path
          d="M15 15L22 8"
          stroke="url(#compassGradLogo)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Small accent needle */}
        <path
          d="M15 15L10 20"
          stroke="url(#compassGrad2Logo)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Center dot */}
        <circle cx="15" cy="15" r="2.5" fill="url(#compassGradLogo)" />
        {/* Cardinal point accents */}
        <circle cx="15" cy="4" r="1.5" fill="url(#compassGradLogo)" />
        <defs>
          <linearGradient id="compassGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="compassGrad2Logo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>
      </svg>
      {/* Wordmark */}
      <span className={`${text} tracking-tight ${dark ? 'text-gray-900' : 'text-white'}`}>
        <span className="font-semibold">dn</span>
        <span className="font-light">hub</span>
      </span>
    </div>
  );
}
