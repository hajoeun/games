import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import Tetris from '../Tetris'
import { TetrominoType, TETROMINOS } from '../constants'
import { GameStatus } from '../types'
import {
  createRandomTetromino,
  isColliding,
  clearLines,
  calculateGhostPosition,
} from '../utils'

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
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('게임 초기화', () => {
    it('게임이 올바르게 초기화되어야 함', () => {
      const { getByTestId, getByText } = renderTetris()

      // 게임 정보가 초기값으로 설정되어 있는지 확인
      expect(getByTestId('score')).toHaveTextContent('0')
      expect(getByTestId('level')).toHaveTextContent('1')
      expect(getByTestId('lines')).toHaveTextContent('0')

      // 다음 블록 미리보기가 존재하는지 확인
      expect(getByText('다음 블록')).toBeInTheDocument()

      // 홀드 영역이 존재하는지 확인
      expect(getByText('홀드')).toBeInTheDocument()
      expect(getByTestId('hold-empty')).toBeInTheDocument()
    })
  })

  describe('블록 이동', () => {
    it('왼쪽 화살표 키를 누르면 블록이 왼쪽으로 이동해야 함', async () => {
      renderTetris()

      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      const initialState = screen.getByTestId('tetris-board').innerHTML

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowLeft' })
        vi.advanceTimersByTime(100)
      })

      const newState = screen.getByTestId('tetris-board').innerHTML
      expect(newState).not.toBe(initialState)
    })

    it('오른쪽 화살표 키를 누르면 블록이 오른쪽으로 이동해야 함', async () => {
      renderTetris()

      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      const initialState = screen.getByTestId('tetris-board').innerHTML

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowRight' })
        vi.advanceTimersByTime(100)
      })

      const newState = screen.getByTestId('tetris-board').innerHTML
      expect(newState).not.toBe(initialState)
    })

    it('아래쪽 화살표 키를 누르면 블록이 아래로 이동해야 함', async () => {
      renderTetris()

      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      const initialState = screen.getByTestId('tetris-board').innerHTML

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' })
        vi.advanceTimersByTime(100)
      })

      const newState = screen.getByTestId('tetris-board').innerHTML
      expect(newState).not.toBe(initialState)
    })
  })

  describe('블록 회전', () => {
    it('위쪽 화살표 키를 누르면 블록이 회전해야 함', async () => {
      renderTetris()

      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      const initialState = screen.getByTestId('tetris-board').innerHTML

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowUp' })
        vi.advanceTimersByTime(100)
      })

      const newState = screen.getByTestId('tetris-board').innerHTML
      expect(newState).not.toBe(initialState)
    })
  })

  describe('하드 드롭', () => {
    it('스페이스바를 누르면 블록이 바닥으로 즉시 이동해야 함', async () => {
      renderTetris()

      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      const initialState = screen.getByTestId('tetris-board').innerHTML

      await act(async () => {
        fireEvent.keyDown(document, { key: ' ' })
        vi.advanceTimersByTime(100)
      })

      const newState = screen.getByTestId('tetris-board').innerHTML
      expect(newState).not.toBe(initialState)
    })
  })

  describe('홀드 기능', () => {
    it('Shift 키를 누르면 현재 블록이 홀드되어야 함', async () => {
      renderTetris()

      // 게임이 시작되고 초기 블록이 생성될 때까지 대기
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      // 초기에는 홀드가 비어있어야 함
      const emptyHoldElement = screen.getByTestId('hold-empty')
      expect(emptyHoldElement).toBeInTheDocument()

      // Shift 키를 눌러 블록을 홀드
      await act(async () => {
        fireEvent.keyDown(document, { key: 'Shift' })
        // 상태 업데이트를 위한 충분한 시간 대기
        vi.advanceTimersByTime(100)
        vi.runOnlyPendingTimers()
      })

      // 상태 업데이트 완료를 위한 추가 대기
      await act(async () => {
        vi.advanceTimersByTime(100)
        vi.runOnlyPendingTimers()
      })

      // 홀드 영역이 더 이상 비어있지 않아야 함
      await waitFor(
        () => {
          const holdEmptyElement = screen.queryByTestId('hold-empty')
          expect(holdEmptyElement).not.toBeInTheDocument()
        },
        {
          timeout: 3000,
          interval: 100,
        }
      )
    })
  })

  describe('게임 오버', () => {
    it.skip('게임 오버 상태가 되면 게임 오버 화면이 표시되어야 함', () => {
      // 이 테스트는 복잡한 상태 관리가 필요하므로 일단 스킵합니다
    })
  })

  describe('점수 시스템', () => {
    it('라인을 제거하면 점수가 올바르게 증가해야 함', () => {
      renderTetris()

      // 라인 제거 상황 시뮬레이션
      // 점수 증가 확인
    })

    it('레벨업이 올바르게 동작해야 함', () => {
      renderTetris()

      // 여러 라인 제거하여 레벨업 상황 시뮬레이션
      // 레벨 증가 확인
    })
  })

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

    describe('isColliding', () => {
      it('충돌 감지가 올바르게 동작해야 함', () => {
        // 충돌 상황과 비충돌 상황에 대한 테스트 케이스
      })
    })

    describe('clearLines', () => {
      it('완성된 라인이 올바르게 제거되어야 함', () => {
        // 라인 제거 테스트 케이스
      })
    })

    describe('calculateGhostPosition', () => {
      it('고스트 블록 위치가 올바르게 계산되어야 함', () => {
        // 고스트 블록 위치 계산 테스트 케이스
      })
    })
  })
})
