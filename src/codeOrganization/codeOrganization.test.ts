import path from 'path';
import { validateImportHierarchy } from './helpers/validateImportHierarchy/validateImportHierarchy';
import { validateTestFileLocations } from './helpers/validateTestFileLocations/validateTestFileLocations';
import { validateAllTestFileImports } from './helpers/validateAllTestFileImports/validateAllTestFileImports';
import { validateAllDirectoryNaming } from './helpers/validateAllDirectoryNaming/validateAllDirectoryNaming';
import { validateAllChildDirectoryNames } from './helpers/validateAllChildDirectoryNames/validateAllChildDirectoryNames';
import { validateModuleExportNames } from './helpers/validateModuleExportNames/validateModuleExportNames';

const ROOT = path.resolve(__dirname, '..');

describe('Import hierarchy', () => {
  it('imports only from child or grandchild directories (unless imported by multiple files)', () => {
    const failures = validateImportHierarchy(ROOT);
    expect(failures).toEqual([]);
  });
});

describe('Test file locations', () => {
  it('test files are in the same directory as their source files', () => {
    const failures = validateTestFileLocations(ROOT);
    expect(failures).toEqual([]);
  });
});

describe('Test file imports', () => {
  it('test files only import from the same directory', () => {
    const failures = validateAllTestFileImports(ROOT);
    expect(failures).toEqual([]);
  });
});

describe('Directory naming', () => {
  it('directories with source files have a file matching the directory name', () => {
    const failures = validateAllDirectoryNaming(ROOT);
    expect(failures).toEqual([]);
  });

  it('first-level child directories use standard names (components, helpers, constants, types)', () => {
    const failures = validateAllChildDirectoryNames(ROOT);
    expect(failures).toEqual([]);
  });
});

describe('Module export names match filenames', () => {
  it('every source file exports a single symbol named after the file', async () => {
    const failures = validateModuleExportNames(ROOT);
    expect(failures).toEqual([]);
  }, 120000);
});
