/**
 * Formats an ISO date string to a human-readable time.
 */
export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};
