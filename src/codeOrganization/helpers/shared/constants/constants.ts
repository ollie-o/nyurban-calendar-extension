/**
 * TypeScript file extensions.
 */
export const VALID_EXTENSIONS = ['.ts', '.tsx'];

/**
 * Test file suffixes.
 */
export const TEST_SUFFIXES = ['.test.ts', '.spec.ts'];

/**
 * File suffixes to exclude from processing.
 */
export const EXCLUDED_SUFFIXES = [...TEST_SUFFIXES, '.d.ts'];

/**
 * Allowed child directory names in the codebase.
 */
export const ALLOWED_CHILD_DIRS = ['components', 'helpers', 'constants', 'types', 'shared'];
