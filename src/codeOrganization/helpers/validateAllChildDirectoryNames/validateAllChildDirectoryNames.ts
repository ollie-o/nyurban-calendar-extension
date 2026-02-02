import { collectDirectories } from '../shared/collectDirectories/collectDirectories';

import { validateChildDirectoryNames } from './helpers/validateChildDirectoryNames/validateChildDirectoryNames';

/**
 * Validates that all first-level child directories use standard names.
 */
export const validateAllChildDirectoryNames = (ROOT: string): string[] => {
  const failures: string[] = [];
  const allDirs = collectDirectories(ROOT);

  for (const dir of allDirs) {
    failures.push(...validateChildDirectoryNames(dir));
  }

  return failures;
};
