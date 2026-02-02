import { TextEncoder, TextDecoder } from 'util';

/**
 * Sets up the test environment with necessary globals and mocks.
 */
const setupTests = (): void => {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;

  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = jest.fn();
};

setupTests();
