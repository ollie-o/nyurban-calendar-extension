import fs from 'fs';
import path from 'path';
import { VALID_EXTENSIONS } from '../constants/constants';

/**
 * Resolves a relative import specifier to an absolute file path.
 */
export const resolveImport = (importerDir: string, specifier: string): string | null => {
  if (!specifier.startsWith('.')) {
    return null;
  }

  const basePath = path.resolve(importerDir, specifier);

  for (const ext of VALID_EXTENSIONS) {
    const filePath = `${basePath}${ext}`;
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) {
    return basePath;
  }

  if (fs.existsSync(basePath) && fs.statSync(basePath).isDirectory()) {
    for (const ext of VALID_EXTENSIONS) {
      const indexPath = path.join(basePath, `index${ext}`);
      if (fs.existsSync(indexPath)) {
        return indexPath;
      }
    }
  }

  return null;
};
