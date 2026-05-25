/**
 * Script Constants
 * Constants for the Scripts section
 */

export const SCRIPT_STATUS = [
  { value: "all", label: "All", color: "gray" },
  { value: "draft", label: "Draft", color: "gray" },
  { value: "ready", label: "Ready", color: "green" },
  { value: "used", label: "Used", color: "blue" },
];

export const SCRIPT_STATUS_COLORS = {
  draft: "#6B7280",
  ready: "#10B981",
  used: "#3B82F6",
};

export const SCRIPT_STATUS_BG_COLORS = {
  draft: "#F3F4F6",
  ready: "#D1FAE5",
  used: "#DBEAFE",
};

export const SCRIPT_PLATFORMS = [
  "TikTok",
  "Instagram",
  "YouTube",
  "LinkedIn",
  "Twitter",
  "Facebook",
  "Pinterest",
];

export const SCRIPT_FORMATS = [
  { value: "talking_head", label: "Talking Head" },
  { value: "voiceover", label: "Voice Over" },
  { value: "carousel", label: "Carousel" },
  { value: "tutorial", label: "Tutorial" },
  { value: "interview", label: "Interview" },
  { value: "behind_scenes", label: "Behind the Scenes" },
  { value: "story", label: "Story" },
];

export const SCRIPT_CONTENT_TYPES = [
  { value: "Viral", label: "Viral", color: "#EF4444" },
  { value: "Educational", label: "Educational", color: "#3B82F6" },
  { value: "Authority", label: "Authority", color: "#8B5CF6" },
];

export const INITIAL_SCRIPT_STATE = {
  title: "",
  hook: "",
  body: "",
  cta: "",
  visualGuidance: "",
  platform: "",
  contentType: "",
  format: "",
  durationEstimate: "",
  status: "draft",
  notes: "",
};
