import { collectDirectories } from '../shared/collectDirectories/collectDirectories';
import { validateDirectoryNaming } from './helpers/validateDirectoryNaming/validateDirectoryNaming';

/**
 * Validates that all directories with source files have a file matching the directory name.
 */
export const validateAllDirectoryNaming = (ROOT: string): string[] => {
  const failures: string[] = [];
  const allDirs = collectDirectories(ROOT);

  for (const dir of allDirs) {
    failures.push(...validateDirectoryNaming(dir));
  }

  return failures;
};
