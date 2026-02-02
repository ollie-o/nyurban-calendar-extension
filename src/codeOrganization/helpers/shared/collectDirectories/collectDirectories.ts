import fs from 'fs';
import path from 'path';

/**
 * Collects all directories recursively.
 */
export const collectDirectories = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const dirs: string[] = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'coverage') {
      continue;
    }
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      dirs.push(fullPath);
      dirs.push(...collectDirectories(fullPath));
    }
  }

  return dirs;
};
