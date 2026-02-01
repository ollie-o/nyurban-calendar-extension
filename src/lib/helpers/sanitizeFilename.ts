/**
 * Converts a string to a filename-safe format.
 */
export const sanitizeFilename = (str: string): string =>
  str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
