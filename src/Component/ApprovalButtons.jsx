import React, { useState } from "react";

export default function ApprovalButtons({
  onApprove,
  onAdjust,
  onSkip,
  disabled = false,
  decision = {}
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAdjustInput, setShowAdjustInput] = useState(false);
  const [adjustText, setAdjustText] = useState("");

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await onApprove(decision);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjust = async () => {
    if (!showAdjustInput) {
      setShowAdjustInput(true);
      return;
    }
    if (!adjustText.trim()) return;

    setIsLoading(true);
    try {
      await onAdjust(adjustText);
      setShowAdjustInput(false);
      setAdjustText("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await onSkip();
    } finally {
      setIsLoading(false);
    }
  };

  if (showAdjustInput) {
    return (
      <div className="mt-3 space-y-2">
        <textarea
          value={adjustText}
          onChange={(e) => setAdjustText(e.target.value)}
          placeholder="Tell Marnee what you'd like to adjust..."
          rows={2}
          className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleAdjust}
            disabled={isLoading || !adjustText.trim()}
            className="px-4 py-1.5 rounded-lg bg-yellow-500 text-black text-sm font-medium hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Adjustment"}
          </button>
          <button
            onClick={() => {
              setShowAdjustInput(false);
              setAdjustText("");
            }}
            className="px-4 py-1.5 rounded-lg border border-white/20 text-gray-400 text-sm hover:bg-white/5 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={handleApprove}
        disabled={disabled || isLoading}
        className="px-4 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "..." : "Approve"}
      </button>
      <button
        onClick={handleAdjust}
        disabled={disabled || isLoading}
        className="px-4 py-1.5 rounded-lg bg-yellow-500 text-black text-sm font-medium hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Adjust
      </button>
      <button
        onClick={handleSkip}
        disabled={disabled || isLoading}
        className="px-4 py-1.5 rounded-lg border border-white/20 text-gray-400 text-sm hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Skip
      </button>
    </div>
  );
}
