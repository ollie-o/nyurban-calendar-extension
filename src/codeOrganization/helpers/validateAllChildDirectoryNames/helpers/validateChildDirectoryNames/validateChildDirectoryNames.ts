import fs from 'fs';
import path from 'path';
import { ALLOWED_CHILD_DIRS } from '../../../shared/constants/constants';
import { hasMainSourceFile } from './helpers/hasMainSourceFile/hasMainSourceFile';

/**
 * Validates that first-level child directories use standard names.
 * Only enforces for directories that have a main source file and are not themselves a standard dir.
 */
export const validateChildDirectoryNames = (dir: string): string[] => {
  const failures: string[] = [];

  if (!hasMainSourceFile(dir)) {
    return failures;
  }

  const dirName = path.basename(dir);
  if (ALLOWED_CHILD_DIRS.includes(dirName)) {
    return failures;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const subDirs = entries.filter((e) => e.isDirectory());

  for (const subDir of subDirs) {
    const subDirName = subDir.name;
    if (ALLOWED_CHILD_DIRS.includes(subDirName)) {
      continue;
    }
    if (['node_modules', 'dist', 'coverage', 'fixtures'].includes(subDirName)) {
      continue;
    }

    failures.push(
      `${dir}/${subDirName} - child directory must be one of: ${ALLOWED_CHILD_DIRS.join(', ')}`
    );
  }

  return failures;
};
