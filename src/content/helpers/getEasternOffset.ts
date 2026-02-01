/**
 * Determines the Eastern timezone offset for a given date and time.
 * Returns EST (-05:00) or EDT (-04:00) based on daylight saving time.
 */
export const getEasternOffset = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): string => {
  const date = new Date(year, month - 1, day, hour, minute);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    timeZoneName: 'short',
  });

  const parts = formatter.formatToParts(date);
  const tzName = parts.find((part) => part.type === 'timeZoneName')?.value;

  return tzName === 'EDT' ? '-04:00' : '-05:00';
};
