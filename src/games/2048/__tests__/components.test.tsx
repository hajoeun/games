/**
 * 2048 게임 UI 컴포넌트 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GameBoard from '../components/GameBoard'
import ScoreBoard from '../components/ScoreBoard'
import Tile from '../components/Tile'
import GameMessage from '../components/GameMessage'
import { GameStatus } from '../types'

describe('GameBoard 컴포넌트 테스트', () => {
  it('보드가 올바르게 렌더링되어야 함', () => {
    const mockBoard = [
      [0, 2, 4, 8],
      [16, 32, 64, 128],
      [256, 512, 1024, 2048],
      [0, 0, 0, 0],
    ]

    render(<GameBoard board={mockBoard} />)

    const gameBoard = screen.getByTestId('game-board')
    expect(gameBoard).toBeInTheDocument()

    // 보드가 4x4 = 16개의 타일을 포함하는지 확인
    const allCells = gameBoard.childNodes
    expect(allCells.length).toBe(16)
  })
})

describe('ScoreBoard 컴포넌트 테스트', () => {
  it('점수가 올바르게 표시되어야 함', () => {
    render(<ScoreBoard score={100} bestScore={200} />)

    expect(screen.getByTestId('current-score')).toHaveTextContent('100')
    expect(screen.getByTestId('best-score')).toHaveTextContent('200')
  })
})

describe('Tile 컴포넌트 테스트', () => {
  it('빈 타일(0)은 숫자를 표시하지 않아야 함', () => {
    const { container } = render(<Tile value={0} />)

    // 타일 내부에 값이 표시되지 않아야 함
    const tileElement = container.firstChild
    expect(tileElement).toBeInTheDocument()
    expect(tileElement?.textContent).toBe('')
  })

  it('타일 값이 표시되어야 함', () => {
    const { container } = render(<Tile value={2} />)

    expect(container.textContent).toBe('2')
  })

  it('큰 값의 타일은 더 작은 폰트 크기를 가져야 함', () => {
    const { container: container2 } = render(<Tile value={2} />)
    const { container: container2048 } = render(<Tile value={2048} />)

    const tile2 = container2.querySelector('div > div') // 타일 내부 div
    const tile2048 = container2048.querySelector('div > div') // 타일 내부 div

    // 클래스 이름에 폰트 크기를 비교
    expect(tile2?.className.includes('text-5xl')).toBeTruthy()
    expect(tile2048?.className.includes('text-2xl')).toBeTruthy()
  })
})

describe('GameMessage 컴포넌트 테스트', () => {
  it('게임 중에는 메시지가 표시되지 않아야 함', () => {
    const { container } = render(
      <GameMessage
        status={GameStatus.PLAYING}
        onReset={() => {}}
        onContinue={() => {}}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('게임 승리 시 승리 메시지가 표시되어야 함', () => {
    render(
      <GameMessage
        status={GameStatus.WON}
        onReset={() => {}}
        onContinue={() => {}}
      />
    )

    expect(screen.getByTestId('game-message')).toBeInTheDocument()
    expect(screen.getByText(/축하합니다/)).toBeInTheDocument()
    expect(screen.getByTestId('continue-button')).toBeInTheDocument()
    expect(screen.getByTestId('reset-button')).toBeInTheDocument()
  })

  it('게임 오버 시 게임 오버 메시지가 표시되어야 함', () => {
    render(
      <GameMessage
        status={GameStatus.GAME_OVER}
        onReset={() => {}}
        onContinue={() => {}}
      />
    )

    expect(screen.getByTestId('game-message')).toBeInTheDocument()
    expect(screen.getByText(/게임 오버/)).toBeInTheDocument()
    expect(screen.getByTestId('reset-button')).toBeInTheDocument()
    expect(screen.queryByTestId('continue-button')).not.toBeInTheDocument()
  })

  it('버튼 클릭 시 콜백이 호출되어야 함', () => {
    const mockReset = jest.fn()
    const mockContinue = jest.fn()

    render(
      <GameMessage
        status={GameStatus.WON}
        onReset={mockReset}
        onContinue={mockContinue}
      />
    )

    fireEvent.click(screen.getByTestId('reset-button'))
    expect(mockReset).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByTestId('continue-button'))
    expect(mockContinue).toHaveBeenCalledTimes(1)
  })
})
