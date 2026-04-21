import React from "react";
import marneeLogo from "../assets/marnee-logo.png";

// Logo Component — Marnee logo with wordmark
export default function Logo({ dark = true, size = "default", iconOnly = false }) {
  const sizes = {
    small:   { icon: 26, text: "text-lg" },
    default: { icon: 32, text: "text-[22px]" },
    large:   { icon: 44, text: "text-3xl" },
  };

  const { icon, text } = sizes[size] || sizes.default;

  return (
    <div className="flex items-center gap-2.5">
      {/* Marnee Logo Image */}
      <img
        src={marneeLogo}
        alt="Marnee"
        className="flex-shrink-0 rounded-lg object-cover"
        style={{ width: icon, height: icon }}
      />

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
