import { Result, err, ok } from 'neverthrow';

import { getCurrentOrNextYear } from './helpers/getCurrentOrNextYear/getCurrentOrNextYear';
import { getEasternOffset } from './helpers/getEasternOffset/getEasternOffset';

/**
 * Parses date and time strings from the schedule into an ISO date string.
 */
export const parseDateAndTime = (dateText: string, timeText: string): Result<string, Error> => {
  const dateMatch = dateText.match(/(\d{1,2})\/(\d{1,2})/);
  if (!dateMatch) {
    return ok('');
  }

  const month = parseInt(dateMatch[1]);
  const day = parseInt(dateMatch[2]);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return err(new Error(`Invalid date values: month=${month}, day=${day}`));
  }

  const year = getCurrentOrNextYear(month, day);

  let time = timeText.trim();

  if (!time.match(/am|pm/i)) {
    const timeParts = time.split(':');
    if (timeParts.length !== 2) {
      return ok('');
    }

    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    if (isNaN(hours) || isNaN(minutes)) {
      return ok('');
    }

    if (hours < 12 && hours >= 6) {
      time = `${(hours + 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  } else {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2];
      const meridian = match[3].toLowerCase();

      if (meridian === 'pm' && hours !== 12) {
        hours += 12;
      }
      if (meridian === 'am' && hours === 12) {
        hours = 0;
      }

      time = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }

  const [hours, minutes] = time.split(':').map(Number);
  const tzOffset = getEasternOffset(year, month, day, hours, minutes);

  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  return ok(`${year}-${monthStr}-${dayStr}T${time}:00${tzOffset}`);
};
