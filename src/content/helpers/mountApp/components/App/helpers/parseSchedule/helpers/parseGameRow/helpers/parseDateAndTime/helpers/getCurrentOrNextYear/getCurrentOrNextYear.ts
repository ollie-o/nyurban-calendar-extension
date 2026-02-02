/**
 * Determines the appropriate year for a given month and day.
 * Returns the year that makes the date closest to today.
 */
export const getCurrentOrNextYear = (month: number, day: number): number => {
  const now = new Date();
  const currentYear = now.getFullYear();

  const dateCurrentYear = new Date(currentYear, month - 1, day);
  const diffCurrentYear = Math.abs(dateCurrentYear.getTime() - now.getTime());

  const dateNextYear = new Date(currentYear + 1, month - 1, day);
  const diffNextYear = Math.abs(dateNextYear.getTime() - now.getTime());

  return diffCurrentYear <= diffNextYear ? currentYear : currentYear + 1;
};
