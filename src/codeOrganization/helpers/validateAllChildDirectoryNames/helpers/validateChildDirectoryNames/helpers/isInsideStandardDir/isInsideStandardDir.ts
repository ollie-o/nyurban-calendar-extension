import path from 'path';

import { ALLOWED_CHILD_DIRS } from '../../../../../shared/constants/constants';

/**
 * Checks if a directory path is inside a standard directory.
 */
export const isInsideStandardDir = (dirPath: string): boolean => {
  const parts = dirPath.split(path.sep);
  return parts.some((part) => ALLOWED_CHILD_DIRS.includes(part));
};
