import fs from 'fs';
import path from 'path';

import ts from 'typescript';

import { collectSourceFiles } from '../shared/collectSourceFiles/collectSourceFiles';
import { getModuleSpecifiers } from '../shared/getModuleSpecifiers/getModuleSpecifiers';
import { resolveImport } from '../shared/resolveImport/resolveImport';

import { buildImportCounts } from './helpers/buildImportCounts/buildImportCounts';
import { getDepth } from './helpers/getDepth/getDepth';

/**
 * Finds the deepest common ancestor directory of multiple paths.
 */
const findDeepestCommonAncestor = (paths: string[]): string => {
  if (paths.length === 0) {
    return '';
  }
  if (paths.length === 1) {
    return path.dirname(paths[0]);
  }

  const parts = paths.map((p) => path.dirname(p).split(path.sep));
  let commonDepth = 0;

  for (let i = 0; i < Math.min(...parts.map((p) => p.length)); i += 1) {
    if (parts.every((p) => p[i] === parts[0][i])) {
      commonDepth = i + 1;
    } else {
      break;
    }
  }

  return parts[0].slice(0, commonDepth).join(path.sep);
};

/**
 * Checks if a file is in a "shared" directory at the DCA level.
 */
const isInSharedDir = (filePath: string, dca: string): boolean => {
  const importedDir = path.dirname(filePath);
  let checkDir = importedDir;

  while (checkDir.startsWith(dca)) {
    if (path.basename(checkDir) === 'shared') {
      return true;
    }
    const parent = path.dirname(checkDir);
    if (parent === checkDir) {
      break;
    }
    checkDir = parent;
  }

  return false;
};

/**
 * Validates multi-imported files are in "shared" directories.
 */
const validateMultiImportedFiles = (
  allSourceFiles: string[],
  importCounts: Map<string, number>
): string[] => {
  const failures: string[] = [];
  const multiImportedFiles = new Map<string, string[]>();

  for (const filePath of allSourceFiles) {
    const fileText = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, fileText, ts.ScriptTarget.Latest, true);
    const importerDir = path.dirname(filePath);
    const moduleSpecifiers = getModuleSpecifiers(sourceFile);

    for (const specifier of moduleSpecifiers) {
      if (!specifier.startsWith('.')) {
        continue;
      }

      const resolved = resolveImport(importerDir, specifier);
      if (resolved && (importCounts.get(resolved) ?? 0) > 1) {
        if (!multiImportedFiles.has(resolved)) {
          multiImportedFiles.set(resolved, []);
        }
        const importers = multiImportedFiles.get(resolved);
        if (importers) {
          importers.push(filePath);
        }
      }
    }
  }

  for (const [importedFile, importers] of multiImportedFiles) {
    const uniqueImporters = [...new Set(importers)];
    const dca = findDeepestCommonAncestor(uniqueImporters);

    if (!isInSharedDir(importedFile, dca)) {
      failures.push(
        `${importedFile} - imported by ${uniqueImporters.length} files but not in ` +
          `"shared" directory (DCA: ${dca})`
      );
    }
  }

  return failures;
};

/**
 * Validates single-imported files follow import hierarchy rules.
 */
const validateSingleImports = (
  allSourceFiles: string[],
  importCounts: Map<string, number>
): string[] => {
  const failures: string[] = [];
  const HELPER_DIRS = ['codeOrganization'];

  for (const filePath of allSourceFiles) {
    const fileText = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, fileText, ts.ScriptTarget.Latest, true);
    const importerDir = path.dirname(filePath);
    const moduleSpecifiers = getModuleSpecifiers(sourceFile);

    for (const specifier of moduleSpecifiers) {
      if (!specifier.startsWith('.')) {
        continue;
      }

      const resolved = resolveImport(importerDir, specifier);
      if (!resolved) {
        failures.push(`${filePath} - unable to resolve import: ${specifier}`);
        continue;
      }

      const importCount = importCounts.get(resolved) ?? 0;
      if (importCount > 1) {
        continue;
      }

      const targetDir = path.dirname(resolved);
      const depth = getDepth(importerDir, targetDir);

      const isHelperDir = HELPER_DIRS.some((dir) => importerDir.endsWith(path.sep + dir));
      const isHelperImport = depth === 0 && isHelperDir;

      if (!isHelperImport && (depth === null || depth < 1 || depth > 2)) {
        failures.push(
          `${filePath} - import "${specifier}" resolves to ${resolved} (depth ${depth ?? 'up'})`
        );
      }
    }
  }

  return failures;
};

/**
 * Validates that imports only come from child or grandchild directories
 * (unless imported by multiple files).
 *
 * Files imported by multiple files must be in a "shared" directory at the
 * deepest common ancestor level of their importers.
 */
export const validateImportHierarchy = (ROOT: string): string[] => {
  const allSourceFiles = collectSourceFiles(ROOT);
  const importCounts = buildImportCounts(allSourceFiles);

  const multiImportFailures = validateMultiImportedFiles(allSourceFiles, importCounts);
  const singleImportFailures = validateSingleImports(allSourceFiles, importCounts);

  return [...multiImportFailures, ...singleImportFailures];
};
