import fs from 'fs';
import path from 'path';

import ts from 'typescript';

import { getModuleSpecifiers } from '../../../shared/getModuleSpecifiers/getModuleSpecifiers';
import { resolveImport } from '../../../shared/resolveImport/resolveImport';

/**
 * Validates test file imports.
 * Returns array of failure messages for test files that import outside same directory.
 */
export const validateTestFileImports = (testDir: string, testFile: string): string[] => {
  const failures: string[] = [];
  const fileText = fs.readFileSync(testFile, 'utf8');
  const sourceFile = ts.createSourceFile(testFile, fileText, ts.ScriptTarget.Latest, true);
  const moduleSpecifiers = getModuleSpecifiers(sourceFile);

  for (const specifier of moduleSpecifiers) {
    if (!specifier.startsWith('.')) {
      continue;
    }

    const resolved = resolveImport(testDir, specifier);
    if (!resolved) {
      failures.push(`${testFile} - unable to resolve import: ${specifier}`);
      continue;
    }

    // Allow imports from 'types' directories anywhere.
    const resolvedParts = resolved.split(path.sep);
    if (resolvedParts.includes('types')) {
      continue;
    }

    // Allow imports from validation helper functions used by test files
    if (
      resolved.includes('validateImportHierarchy') ||
      resolved.includes('validateTestFileLocations') ||
      resolved.includes('validateAllTestFileImports') ||
      resolved.includes('validateAllDirectoryNaming') ||
      resolved.includes('validateAllChildDirectoryNames') ||
      resolved.includes('validateModuleExportNames')
    ) {
      continue;
    }

    const targetDir = path.dirname(resolved);
    if (targetDir !== testDir) {
      failures.push(
        `${testFile} - import "${specifier}" resolves outside test directory: ${resolved}`
      );
    }
  }

  return failures;
};
