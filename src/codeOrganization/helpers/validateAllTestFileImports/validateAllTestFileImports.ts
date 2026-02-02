import path from 'path';
import { collectAllFiles } from '../shared/collectAllFiles/collectAllFiles';
import { validateTestFileImports } from './helpers/validateTestFileImports/validateTestFileImports';
import { TEST_SUFFIXES } from '../shared/constants/constants';

/**
 * Validates that all test files only import from their same directory.
 */
export const validateAllTestFileImports = (ROOT: string): string[] => {
  const allFiles = collectAllFiles(ROOT);
  const failures: string[] = [];
  const testFiles = allFiles.filter((f) => TEST_SUFFIXES.some((suffix) => f.endsWith(suffix)));

  for (const testFile of testFiles) {
    const testDir = path.dirname(testFile);
    failures.push(...validateTestFileImports(testDir, testFile));
  }

  return failures;
};
