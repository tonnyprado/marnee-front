/**
 * Script Constants
 * Constants for the Scripts section
 */

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
  notes: "",
};
