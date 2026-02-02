import path from 'path';

import { collectFiles } from './helpers/collectFiles/collectFiles';
import { isTypeOnlyFile } from './helpers/isTypeOnlyFile/isTypeOnlyFile';

/**
 * Validates that every source file exports a single symbol named after the file.
 */
export const validateModuleExportNames = (ROOT: string): string[] => {
  const allFiles = collectFiles(ROOT);
  const HELPER_FILES = ['Helpers', 'helpers'];
  const failures: string[] = [];

  for (const filePath of allFiles) {
    if (isTypeOnlyFile(filePath)) {
      continue;
    }

    const base = path.basename(filePath);

    if (HELPER_FILES.some((helper) => base.includes(helper))) {
      continue;
    }

    const ext = path.extname(base);
    const name = path.basename(base, ext);

    // Use require so Jest's TypeScript transform runs the file correctly
    /* eslint-disable @typescript-eslint/no-require-imports, no-undef, no-restricted-syntax */
    let mod: Record<string, unknown>;
    try {
      mod = require(filePath) as Record<string, unknown>;
    } catch (err) {
      failures.push(`${filePath} - failed to import: ${String(err)}`);
      continue;
    }
    /* eslint-enable @typescript-eslint/no-require-imports, no-undef, no-restricted-syntax */

    const exportedKeys = Object.keys(mod).filter((k) => k !== '__esModule');

    // If module has no exports, allow any filename.
    if (exportedKeys.length === 0) {
      continue;
    }

    if (exportedKeys.length > 1) {
      failures.push(`${filePath} - multiple exports found: ${exportedKeys.join(', ')}`);
      continue;
    }

    const exportedName = exportedKeys[0];
    if (exportedName !== name) {
      failures.push(
        `${filePath} - exported name "${exportedName}" does not match filename "${name}"`
      );
    }
  }

  return failures;
};
