import fs from 'fs';
import path from 'path';
import { collectSourceFiles } from '../shared/collectSourceFiles/collectSourceFiles';
import { collectAllFiles } from '../shared/collectAllFiles/collectAllFiles';
import { TEST_SUFFIXES } from '../shared/constants/constants';

/**
 * Validates that test files are in the same directory as their source files.
 */
export const validateTestFileLocations = (ROOT: string): string[] => {
  const allSourceFiles = collectSourceFiles(ROOT);
  const allFiles = collectAllFiles(ROOT);
  const failures: string[] = [];
  const testFiles = allFiles.filter((f) => TEST_SUFFIXES.some((suffix) => f.endsWith(suffix)));

  for (const testFile of testFiles) {
    const testDir = path.dirname(testFile);
    const testBasename = path.basename(testFile);

    let sourceBasename: string | null = null;
    for (const suffix of TEST_SUFFIXES) {
      if (testBasename.endsWith(suffix)) {
        sourceBasename = testBasename.replace(suffix, '.ts');
        break;
      }
    }

    if (!sourceBasename) {
      continue;
    }

    const sourceExistsAnywhere = allSourceFiles.some(
      (f) =>
        path.basename(f) === sourceBasename ||
        path.basename(f) === sourceBasename?.replace('.ts', '.tsx')
    );

    if (!sourceExistsAnywhere) {
      continue;
    }

    const expectedSourcePath = path.join(testDir, sourceBasename);
    const expectedSourcePathTsx = path.join(testDir, sourceBasename.replace('.ts', '.tsx'));

    if (!fs.existsSync(expectedSourcePath) && !fs.existsSync(expectedSourcePathTsx)) {
      failures.push(
        `${testFile} - source file not found in same directory (expected ${sourceBasename})`
      );
    }
  }

  return failures;
};
