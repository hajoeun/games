import '@testing-library/jest-dom';

// localStorage 모의 구현
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0
};

global.localStorage = localStorageMock as Storage;

// requestAnimationFrame 모의 구현
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id); 