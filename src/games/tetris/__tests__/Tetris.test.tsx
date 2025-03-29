import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import Tetris from '../Tetris'
import { TetrominoType } from '../constants'
import { createRandomTetromino } from '../utils'

// GameController 모킹 - 모든 테스트에 적용됩니다
vi.mock('../controllers/GameController', () => {
  return {
    GameController: class MockGameController {
      constructor() {}
      init() {}
      destroy() {}
      attach() {}
      detach() {}
      enable() {}
      disable() {}
    },
  }
})

// Helmet 관련 모킹
vi.mock('react-helmet-async', () => {
  return {
    HelmetProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Helmet: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  }
})

// 테스트 헬퍼 함수
const renderTetris = () => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <Tetris />
      </BrowserRouter>
    </HelmetProvider>
  )
}

describe('테트리스 게임 테스트', () => {
  beforeEach(() => {
    // 각 테스트 전에 localStorage 초기화
    vi.resetAllMocks()
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  // 기본 UI 테스트만 수행
  describe('기본 게임 UI', () => {
    it('게임 화면이 올바르게 렌더링되어야 함', () => {
      const { getByText, getAllByText } = renderTetris()

      // 기본 UI 요소들이 존재하는지 확인
      expect(getByText('테트리스')).toBeInTheDocument()
      expect(getByText('다음 블록')).toBeInTheDocument()

      // '홀드' 텍스트가 있는 요소가 적어도 하나 이상 존재해야 함
      const holdElements = getAllByText('홀드')
      expect(holdElements.length).toBeGreaterThan(0)
    })
  })

  // 유틸리티 함수 테스트
  describe('유틸리티 함수 테스트', () => {
    describe('createRandomTetromino', () => {
      it('유효한 테트로미노를 생성해야 함', () => {
        const tetromino = createRandomTetromino()
        expect(Object.values(TetrominoType)).toContain(tetromino.type)
        expect(tetromino.shape).toBeDefined()
        expect(tetromino.position).toBeDefined()
        expect(tetromino.rotation).toBe(0)
      })
    })
  })
})
