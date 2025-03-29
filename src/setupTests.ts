import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { render } from '@testing-library/react';

// global 네임스페이스에 types 추가
declare global {
  namespace NodeJS {
    interface Global {
      renderWithRouter: (ui: React.ReactElement, options?: { route?: string }) => ReturnType<typeof render>;
      mockUseEffect: () => jest.SpyInstance;
    }
  }
}

// Helmet 모킹
vi.mock('react-helmet-async', () => {
  return {
    HelmetProvider: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'helmet-provider' }, children),
    Helmet: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'helmet' }, children)
  };
});

// localStorage 모의 구현
const localStorageMock = {
  getItem: vi.fn().mockImplementation((key: string) => {
    return null;
  }),
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

// 테스트 헬퍼 함수를 전역적으로 사용할 수 있게 함
const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return {
    ...render(
      React.createElement(MemoryRouter, { initialEntries: [route] }, ui)
    ),
  };
};

// React.useEffect 모킹 helper
const mockUseEffect = () => {
  const originalUseEffect = React.useEffect;
  return vi.spyOn(React, 'useEffect').mockImplementation((callback, deps) => {
    if (deps) {
      return originalUseEffect(() => {
        try {
          return callback();
        } catch (error) {
          console.error('Error in mocked useEffect', error);
          return undefined;
        }
      }, deps);
    }
    return originalUseEffect(callback);
  });
};

// 전역 객체에 할당
Object.assign(global, { renderWithRouter, mockUseEffect }); 