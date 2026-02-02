import fs from 'fs';
import path from 'path';

import { VALID_EXTENSIONS } from '../../../../../shared/constants/constants';

/**
 * Checks if a directory has a main source file matching the directory name.
 */
export const hasMainSourceFile = (dir: string): boolean => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const dirName = path.basename(dir);
  return entries.some((e) => {
    if (!e.isFile()) {
      return false;
    }
    const nameWithoutExt = path.basename(e.name, path.extname(e.name));
    return nameWithoutExt === dirName && VALID_EXTENSIONS.includes(path.extname(e.name));
  });
};
