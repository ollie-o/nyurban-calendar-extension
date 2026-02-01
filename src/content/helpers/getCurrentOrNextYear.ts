/**
 * Determines the appropriate year for a given month and day.
 * Returns the year that makes the date closest to today.
 */
export const getCurrentOrNextYear = (month: number, day: number): number => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Option A: Date with current year.
  const dateCurrentYear = new Date(currentYear, month - 1, day);
  const diffCurrentYear = Math.abs(dateCurrentYear.getTime() - now.getTime());

  // Option B: Date with next year.
  const dateNextYear = new Date(currentYear + 1, month - 1, day);
  const diffNextYear = Math.abs(dateNextYear.getTime() - now.getTime());

  // Return whichever year makes the date closer to today.
  return diffCurrentYear <= diffNextYear ? currentYear : currentYear + 1;
};
