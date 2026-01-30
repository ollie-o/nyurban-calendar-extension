/**
 * Formatting utilities for dates, times, and other display values.
 */

/**
 * Formats a date string for display.
 * @param dateStr - ISO8601 date string
 * @returns Formatted date (e.g., "Mon, Jan 15")
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a time string for display.
 * @param timeStr - Time in 24-hour format (HH:MM)
 * @returns Formatted time (e.g., "6:30 PM")
 */
export const formatTime = (timeStr: string): string => {
  const [hour, minute] = timeStr.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Sanitizes a string for use in filenames.
 * @param str - Input string
 * @returns Filename-safe string
 */
export const sanitizeFilename = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};
