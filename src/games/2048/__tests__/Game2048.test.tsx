/**
 * 2048 게임 컴포넌트 테스트
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import Game2048 from '../Game2048'
import { InputController } from '../controllers/InputController'

// InputController 모킹
jest.mock('../controllers/InputController', () => {
  return {
    InputController: jest.fn().mockImplementation(() => {
      return {
        attach: jest.fn(),
        detach: jest.fn(),
      }
    }),
  }
})

// localStorage 모킹
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('2048 게임 컴포넌트 테스트', () => {
  beforeEach(() => {
    ;(InputController as jest.Mock).mockClear()
    localStorageMock.clear()
  })

  it('게임이 렌더링되어야 함', () => {
    render(<Game2048 />)

    expect(screen.getByText('2048')).toBeInTheDocument()
    expect(screen.getByTestId('game-board')).toBeInTheDocument()
    expect(screen.getByTestId('current-score')).toBeInTheDocument()
    expect(screen.getByTestId('best-score')).toBeInTheDocument()
    expect(screen.getByTestId('new-game-button')).toBeInTheDocument()
  })

  it('마운트 시 입력 컨트롤러가 생성되어야 함', () => {
    render(<Game2048 />)

    expect(InputController).toHaveBeenCalled()
    const mockInstance = (InputController as jest.Mock).mock.instances[0]
    expect(mockInstance.attach).toHaveBeenCalled()
  })

  it('언마운트 시 입력 컨트롤러가 제거되어야 함', () => {
    const { unmount } = render(<Game2048 />)
    unmount()

    const mockInstance = (InputController as jest.Mock).mock.instances[0]
    expect(mockInstance.detach).toHaveBeenCalled()
  })

  it('로컬 스토리지에서 최고 점수를 로드해야 함', () => {
    localStorageMock.setItem('2048_best_score', '1000')
    render(<Game2048 />)

    expect(localStorageMock.getItem).toHaveBeenCalledWith('2048_best_score')
    expect(screen.getByTestId('best-score').textContent).toBe('1000')
  })
})
