import fs from 'fs';
import path from 'path';
import { VALID_EXTENSIONS } from '../constants/constants';

/**
 * Collects all TypeScript files including test files.
 */
export const collectAllFiles = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'coverage') {
      continue;
    }
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectAllFiles(fullPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }
    if (!VALID_EXTENSIONS.includes(path.extname(entry.name))) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
};
