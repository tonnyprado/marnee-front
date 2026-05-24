/**
 * Calendar View Constants
 * Colors, modes and configuration for the redesigned calendar
 */

// View modes for the main calendar
export const VIEW_MODES = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
};

// Theme colors (matching mobile app)
export const THEME_COLORS = {
  deepPurple: '#40086d',
  lilac: '#dccaf4',
  lilacSoft: '#ede0f8',
  nightPurple: '#1a0530',
  iceWhite: '#f6f6f6',
  white: '#ffffff',
  black: '#1e1e1e',
  textMuted: 'rgba(30,30,30,0.5)',
};

// Post content type colors (for backgrounds)
export const CONTENT_TYPE_COLORS = {
  Viral: '#FFD6D6',
  Educational: '#D6E8FF',
  Authority: '#FFF3D6',
  Personal: '#D6FFE8',
  Promo: '#dccaf4',
  Collab: '#F0D6FF',
  default: '#f0f0f0',
};

// Post status colors (for left border indicator)
export const STATUS_COLORS = {
  todo: '#9CA3AF',
  in_progress: '#F59E0B',
  done: '#10B981',
  skipped: '#EF4444',
  draft: '#6B7280',
  scheduled: '#3B82F6',
  published: '#8B5CF6',
};

// Status dot colors for mini calendar
export const STATUS_DOT_COLORS = {
  todo: '#9CA3AF',
  in_progress: '#F59E0B',
  done: '#10B981',
  skipped: '#EF4444',
};

// Platform icons/colors
export const PLATFORM_COLORS = {
  TikTok: '#000000',
  Instagram: '#E4405F',
  LinkedIn: '#0A66C2',
  YouTube: '#FF0000',
  'Twitter/X': '#1DA1F2',
  Facebook: '#1877F2',
  Pinterest: '#BD081C',
};

// Effort level badges
export const EFFORT_LEVELS = {
  L: { label: 'Low', color: '#10B981', bgColor: '#D1FAE5' },
  M: { label: 'Medium', color: '#F59E0B', bgColor: '#FEF3C7' },
  H: { label: 'High', color: '#EF4444', bgColor: '#FEE2E2' },
};

// Days of the week
export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAYS_OF_WEEK_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAYS_OF_WEEK_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Months
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Time slots for week/day views (8 AM to 10 PM)
export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

// Helper to get content type color
export const getContentTypeColor = (contentType) => {
  return CONTENT_TYPE_COLORS[contentType] || CONTENT_TYPE_COLORS.default;
};

// Helper to get status color
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || STATUS_COLORS.todo;
};

// Helper to format date
export const formatDate = (date, format = 'full') => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  const dayOfWeek = d.getDay();

  switch (format) {
    case 'full':
      return `${DAYS_OF_WEEK_FULL[dayOfWeek]}, ${MONTHS[month]} ${day}, ${year}`;
    case 'short':
      return `${MONTHS_SHORT[month]} ${day}, ${year}`;
    case 'dayMonth':
      return `${day} ${MONTHS_SHORT[month]}`;
    case 'weekday':
      return DAYS_OF_WEEK[dayOfWeek];
    default:
      return `${MONTHS[month]} ${day}, ${year}`;
  }
};

// Helper to check if two dates are the same day
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Helper to check if date is today
export const isToday = (date) => {
  return isSameDay(date, new Date());
};

// Helper to get days in month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper to get first day of month (0 = Sunday)
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};
