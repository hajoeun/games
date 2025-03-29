import '@testing-library/jest-dom';
import { vi } from 'vitest';

// localStorage 모의 구현
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(),
  length: 0
};

global.localStorage = localStorageMock as Storage;

// requestAnimationFrame 모의 구현
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id); 