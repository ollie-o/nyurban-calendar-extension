import path from 'path';

/**
 * Gets the depth from one directory to another.
 * Returns null if toDir is not a descendant of fromDir.
 */
export const getDepth = (fromDir: string, toDir: string): number | null => {
  const relative = path.relative(fromDir, toDir);
  if (!relative || relative === '.') {
    return 0;
  }
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }
  return relative.split(path.sep).filter(Boolean).length;
};
