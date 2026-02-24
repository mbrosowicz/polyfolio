import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window matching media
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
/* eslint-enable @typescript-eslint/no-unsafe-assignment */

// Mock WebGL
const mockWebGLContext = {
  getParameter: vi.fn(),
  getProgramParameter: vi.fn(),
  getShaderParameter: vi.fn(),
  getShaderInfoLog: vi.fn(),
  getShaderSource: vi.fn(),
  compileShader: vi.fn(),
  createShader: vi.fn(),
  createProgram: vi.fn(),
  linkProgram: vi.fn(),
  useProgram: vi.fn(),
  getAttribLocation: vi.fn(),
  getUniformLocation: vi.fn(),
  deleteShader: vi.fn(),
  deleteProgram: vi.fn(),
};

/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
HTMLCanvasElement.prototype.getContext = vi.fn(() => mockWebGLContext) as any;
