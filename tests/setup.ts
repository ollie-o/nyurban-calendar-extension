/**
 * Jest setup file
 * Adds necessary polyfills for the test environment
 */

import { TextEncoder, TextDecoder } from 'util';

// Add TextEncoder and TextDecoder to global scope for JSDOM.
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock URL.createObjectURL and revokeObjectURL for JSDOM.
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();
