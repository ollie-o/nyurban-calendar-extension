import fs from 'fs';
import path from 'path';

/**
 * Recursively collects TypeScript/TSX source files, excluding test files, declarations,
 * and constants files.
 */
export const collectFiles = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'coverage') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(full));
    } else if (entry.isFile()) {
      if (!full.endsWith('.ts') && !full.endsWith('.tsx')) {
        continue;
      }
      if (full.endsWith('.d.ts')) {
        continue;
      }
      if (full.endsWith('.test.ts') || full.endsWith('.spec.ts')) {
        continue;
      }
      // Skip constants.ts files - they can export multiple ALL_CAPS constants
      if (entry.name === 'constants.ts') {
        continue;
      }
      files.push(full);
    }
  }
  return files;
};
