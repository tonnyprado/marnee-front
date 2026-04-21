import React from "react";

// Logo Component — Marnee silhouette with headset
export default function Logo({ dark = true, size = "default", iconOnly = false }) {
  const sizes = {
    small:   { icon: 26, text: "text-lg" },
    default: { icon: 32, text: "text-[22px]" },
    large:   { icon: 44, text: "text-3xl" },
  };

  const { icon, text } = sizes[size] || sizes.default;

  return (
    <div className="flex items-center gap-2.5">
      {/* Icon — Marnee silhouette with headset */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Marnee body silhouette with ears */}
        <path
          d="M20 36C28 36 34 30 34 22C34 14 28 10 20 10C12 10 6 14 6 22C6 30 12 36 20 36Z"
          fill="url(#marneeBodyGrad)"
        />
        {/* Left ear */}
        <path
          d="M10 12C8 8 9 4 12 4C15 4 15 8 14 12"
          fill="url(#marneeBodyGrad)"
        />
        {/* Right ear */}
        <path
          d="M30 12C32 8 31 4 28 4C25 4 25 8 26 12"
          fill="url(#marneeBodyGrad)"
        />
        {/* Headset band */}
        <path
          d="M8 18C8 12 13 8 20 8C27 8 32 12 32 18"
          stroke="url(#headsetGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left headphone */}
        <rect x="4"  y="16" width="5" height="8" rx="2" fill="url(#headsetGrad)" />
        {/* Right headphone */}
        <rect x="31" y="16" width="5" height="8" rx="2" fill="url(#headsetGrad)" />
        {/* Microphone arm */}
        <path
          d="M9 22C9 22 12 24 14 28"
          stroke="url(#headsetGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Microphone tip */}
        <circle cx="15" cy="29" r="2.5" fill="url(#micGrad)" />

        <defs>
          {/* Body: brand purple range */}
          <linearGradient id="marneeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#6b21a8" />
            <stop offset="100%" stopColor="#40086d" />
          </linearGradient>
          {/* Headset: deep purple */}
          <linearGradient id="headsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#40086d" />
            <stop offset="100%" stopColor="#1a0530" />
          </linearGradient>
          {/* Mic: lilac accent */}
          <linearGradient id="micGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#dccaf4" />
            <stop offset="100%" stopColor="#c4a8e8" />
          </linearGradient>
        </defs>
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
