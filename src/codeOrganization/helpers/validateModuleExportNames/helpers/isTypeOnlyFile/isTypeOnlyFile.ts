import fs from 'fs';

/**
 * Checks if a file only contains type/interface exports (no runtime code).
 */
export const isTypeOnlyFile = (filePath: string): boolean => {
  const content = fs.readFileSync(filePath, 'utf8');
  // Check if file only contains type/interface exports (no runtime code)
  // Remove comments to simplify analysis
  const noComments = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  // Check if file has only export interface/type declarations
  const hasRuntimeExport = /export\s+(const|let|var|function|class|enum)\s+/.test(noComments);
  const hasTypeExport = /export\s+(interface|type)\s+/.test(noComments);
  return hasTypeExport && !hasRuntimeExport;
};
