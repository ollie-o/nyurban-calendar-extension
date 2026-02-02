import fs from 'fs';
import path from 'path';
import { VALID_EXTENSIONS, EXCLUDED_SUFFIXES } from '../../../shared/constants/constants';

/**
 * Validates that directories with source files have a file matching the directory name.
 */
export const validateDirectoryNaming = (dir: string): string[] => {
  const failures: string[] = [];
  const dirName = path.basename(dir);

  // Skip utility helper directories
  if (['codeOrganization'].includes(dirName)) {
    return failures;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const sourceFiles = entries.filter((e) => {
    if (!e.isFile()) {
      return false;
    }
    if (!VALID_EXTENSIONS.includes(path.extname(e.name))) {
      return false;
    }
    if (EXCLUDED_SUFFIXES.some((suffix) => e.name.endsWith(suffix))) {
      return false;
    }
    return true;
  });

  if (sourceFiles.length === 0) {
    return failures;
  }

  const expectedNames = VALID_EXTENSIONS.map((ext) => `${dirName}${ext}`);
  const hasMatchingFile = sourceFiles.some((f) => expectedNames.includes(f.name));

  if (!hasMatchingFile) {
    const actualFiles = sourceFiles.map((f) => f.name).join(', ');
    failures.push(`${dir} - no file named ${dirName}.ts or ${dirName}.tsx (found: ${actualFiles})`);
  }

  return failures;
};
