import React from "react";

// Logo Component — Marnee logo with wordmark (SVG)
export default function Logo({ dark = true, size = "default", iconOnly = false }) {
  const sizes = {
    small:   { icon: 26, text: "text-lg" },
    default: { icon: 32, text: "text-[22px]" },
    large:   { icon: 44, text: "text-3xl" },
  };

  const { icon, text } = sizes[size] || sizes.default;

  return (
    <div className="flex items-center gap-2.5">
      {/* Marnee Logo SVG */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Main head/body circle */}
        <circle cx="100" cy="110" r="65" fill="#5b21b6" />

        {/* Left ear */}
        <ellipse cx="70" cy="65" rx="12" ry="18" fill="#5b21b6" />

        {/* Right ear */}
        <ellipse cx="130" cy="65" rx="12" ry="18" fill="#5b21b6" />

        {/* Headset band */}
        <path
          d="M 65 85 Q 100 60 135 85"
          stroke="#2d1450"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left headphone */}
        <rect x="30" y="95" width="18" height="30" rx="9" fill="#2d1450" />

        {/* Right headphone */}
        <rect x="152" y="95" width="18" height="30" rx="9" fill="#2d1450" />

        {/* Microphone arm */}
        <path
          d="M 48 120 Q 55 145 65 160"
          stroke="#2d1450"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Microphone tip */}
        <circle cx="68" cy="165" r="8" fill="#a78bfa" />
      </svg>

      {/* Wordmark */}
      {!iconOnly && (
        <span
          className={`${text} tracking-tight ${dark ? "text-[#1e1e1e]" : "text-white"}`}
          style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
        >
          Marnee
        </span>
      )}
    </div>
  );
}
