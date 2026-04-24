/**
 * Campaign Form Constants
 *
 * All constant values used in the Campaign Form
 * Extracted from CampaignForm.jsx for better maintainability and reusability
 */

export const STATUS_OPTIONS = [
  { value: "todo", label: "To Do", color: "gray" },
  { value: "in_progress", label: "In Progress", color: "blue" },
  { value: "done", label: "Done", color: "green" },
  { value: "skipped", label: "Skipped", color: "gray" },
];

export const TASK_TYPES = [
  { value: "content", label: "Content Task" },
  { value: "marketing", label: "Marketing Task" },
];

export const PLATFORMS = [
  "TikTok",
  "Instagram",
  "LinkedIn",
  "YouTube",
  "Twitter/X",
  "Facebook",
  "Pinterest",
];

export const ASSET_TYPES = ["Video", "Text", "Carousel", "Image", "Other"];

export const CONTENT_TYPES = [
  { value: "Viral", label: "Viral (Top Funnel)", desc: "Awareness content" },
  { value: "Educational", label: "Educational (Mid Funnel)", desc: "Value & education" },
  { value: "Authority", label: "Authority (Bottom Funnel)", desc: "Credibility & conversion" },
];

export const EFFORT_LEVELS = ["Low", "Medium", "High"];

export const GOALS = ["Awareness", "Leads", "Sales"];

export const FEEDBACK_TYPES = [
  { value: "Repeat", label: "Repeat", desc: "This worked well" },
  { value: "Iterate", label: "Iterate", desc: "Needs adjustments" },
  { value: "Drop", label: "Drop", desc: "Not worth continuing" },
];

export const FORMAT_OPTIONS = [
  "talking head",
  "voiceover",
  "carousel",
  "reel",
  "story",
  "static post",
  "live",
  "tutorial",
  "behind-the-scenes",
];

// Initial form state structure
export const INITIAL_FORM_STATE = {
  // ID
  id: null,

  // Basic Information
  title: "",
  taskType: "content",
  platform: "",
  assetType: "",
  contentType: "",
  effortLevel: "",

  // Strategic Context
  goal: "",
  reason: "",
  basedOn: "",
  pillar: "",

  // Content Structure
  hook: "",
  body: "",
  angle: "",
  cta: "",

  // Execution Details
  format: "",
  assets: [],

  // Status & Tracking
  status: "todo",

  // Feedback
  feedbackType: "",
  notes: "",

  // Generated Image
  generatedImageSvg: null,
  hasGeneratedImage: false,
};
