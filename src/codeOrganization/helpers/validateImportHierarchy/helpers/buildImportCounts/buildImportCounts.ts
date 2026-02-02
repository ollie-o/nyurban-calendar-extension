import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { getModuleSpecifiers } from '../../../shared/getModuleSpecifiers/getModuleSpecifiers';
import { resolveImport } from '../../../shared/resolveImport/resolveImport';

/**
 * Builds a map of import counts for each file.
 */
export const buildImportCounts = (allFiles: string[]): Map<string, number> => {
  const counts = new Map<string, number>();

  for (const filePath of allFiles) {
    const fileText = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, fileText, ts.ScriptTarget.Latest, true);
    const importerDir = path.dirname(filePath);
    const moduleSpecifiers = getModuleSpecifiers(sourceFile);

    for (const specifier of moduleSpecifiers) {
      if (!specifier.startsWith('.')) {
        continue;
      }

      const resolved = resolveImport(importerDir, specifier);
      if (resolved) {
        counts.set(resolved, (counts.get(resolved) || 0) + 1);
      }
    }
  }

  return counts;
};
