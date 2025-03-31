/**
 * 2048 게임 보드 컴포넌트
 */

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Direction, GameState, TouchData } from '../types'
import { MIN_SWIPE_DISTANCE, ANIMATION_DURATION } from '../constants'
import { boardToTiles, updateTiles } from '../utils'
import '../styles/animation.css'
import Tile from './Tile'
import { translations } from '../i18n'

type Translation = typeof translations.en

// GameHeader 컴포넌트
interface GameHeaderProps {
  score: number
  bestScore: number
  onReset: () => void
}

const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  bestScore,
  onReset,
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-chicago text-game-text">2048</h1>
        <button onClick={onReset} className="game-button">
          새 게임
        </button>
      </div>

      <div className="flex justify-between">
        <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
          <div className="text-sm text-game-text">점수</div>
          <div className="font-bold text-xl text-game-text">{score}</div>
        </div>
        <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
          <div className="text-sm text-game-text">최고 점수</div>
          <div className="font-bold text-xl text-game-text">{bestScore}</div>
        </div>
      </div>
    </div>
  )
}

// GameControls 컴포넌트
interface GameControlsProps {
  onMove: (direction: Direction) => void
  disabled: boolean
  t: Translation
}

const GameControls: React.FC<GameControlsProps> = ({ onMove, disabled, t }) => {
  return (
    <div className="flex flex-col items-center mt-6">
      <div className="text-center mb-2 text-game-text">
        {t.instructions.controls}
      </div>

      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {/* 위쪽 버튼 */}
        <div className="col-span-3 flex justify-center mb-2">
          <button
            className="w-16 h-16 bg-classic-secondary border-2 border-game-text text-game-text font-bold rounded-md disabled:opacity-50 flex items-center justify-center"
            onClick={() => onMove(Direction.UP)}
            disabled={disabled}
            aria-label={t.directions.up}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>

        {/* 왼쪽 버튼 */}
        <div className="flex justify-end">
          <button
            className="w-16 h-16 bg-classic-secondary border-2 border-game-text text-game-text font-bold rounded-md disabled:opacity-50 flex items-center justify-center"
            onClick={() => onMove(Direction.LEFT)}
            disabled={disabled}
            aria-label={t.directions.left}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* 가운데 버튼 없음 */}
        <div className="flex justify-center"></div>

        {/* 오른쪽 버튼 */}
        <div className="flex justify-start">
          <button
            className="w-16 h-16 bg-classic-secondary border-2 border-game-text text-game-text font-bold rounded-md disabled:opacity-50 flex items-center justify-center"
            onClick={() => onMove(Direction.RIGHT)}
            disabled={disabled}
            aria-label={t.directions.right}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* 아래쪽 버튼 */}
        <div className="col-span-3 flex justify-center mt-2">
          <button
            className="w-16 h-16 bg-classic-secondary border-2 border-game-text text-game-text font-bold rounded-md disabled:opacity-50 flex items-center justify-center"
            onClick={() => onMove(Direction.DOWN)}
            disabled={disabled}
            aria-label={t.directions.down}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// GameOverOverlay 컴포넌트
interface GameOverOverlayProps {
  score: number
  hasWon: boolean
  onReset: () => void
  onContinue: () => void
  showContinue: boolean
  t: Translation
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  score,
  hasWon,
  onReset,
  onContinue,
  showContinue,
  t,
}) => {
  return (
    <div className="game-over dark:bg-opacity-80 bg-game-board bg-opacity-80">
      <h2 className="text-2xl font-chicago text-game-text">
        {hasWon ? t.status.win : t.status.gameOver}
      </h2>
      <p className="text-lg mb-4 text-game-text">
        {hasWon ? t.messages.win : t.messages.gameOver}
      </p>
      <div className="text-xl font-bold mb-6 text-game-text">
        {t.stats.score}: {score}
      </div>

      <div className="flex flex-col space-y-2">
        {showContinue && (
          <button onClick={onContinue} className="game-button">
            {t.game.continue}
          </button>
        )}
        <button onClick={onReset} className="game-button">
          {t.game.newGame}
        </button>
      </div>
    </div>
  )
}

interface GameBoardProps {
  gameState: GameState
  onMove: (direction: Direction) => void
  onReset: () => void
  onContinue: () => void
  t: Translation
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onMove,
  onReset,
  onContinue,
  t,
}) => {
  const boardRef = useRef<HTMLDivElement>(null)
  const [tileSize, setTileSize] = useState(0)
  const resizeTimeoutRef = useRef<number | null>(null)
  const animatingRef = useRef(gameState.animating)
  const touchStartRef = useRef({ x: 0, y: 0 })

  // 타일 크기 계산 함수
  const calculateTileSize = useCallback(() => {
    if (boardRef.current) {
      // 정확한 계산을 위해 보드 내부 사용 가능 공간 계산
      const padding = 15 // 보드 패딩
      const boardWidth = boardRef.current.offsetWidth - padding * 2 // 패딩 제외한 내부 크기
      const boardSize = gameState.board.length

      // 타일 크기 계산 (정수로 반올림하여 정확한 정렬 보장)
      const calculatedSize = Math.floor(boardWidth / boardSize)

      if (calculatedSize && calculatedSize !== Infinity) {
        setTileSize(calculatedSize)
      }
    }
  }, [gameState.board.length])

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    calculateTileSize()

    const handleResize = () => {
      // 이전 타이머가 있으면 제거
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }

      // 리사이즈 중에는 애니메이션 비활성화
      animatingRef.current = false

      // 디바운스 적용
      resizeTimeoutRef.current = window.setTimeout(() => {
        calculateTileSize()
        animatingRef.current = gameState.animating
      }, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [calculateTileSize, gameState.animating])

  useEffect(() => {
    animatingRef.current = gameState.animating
  }, [gameState.animating])

  const handleControlMove = useCallback(
    (direction: Direction) => {
      onMove(direction)
    },
    [onMove]
  )

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameState.gameOver) {
        switch (event.key) {
          case 'ArrowUp':
            handleControlMove(Direction.UP)
            break
          case 'ArrowDown':
            handleControlMove(Direction.DOWN)
            break
          case 'ArrowLeft':
            handleControlMove(Direction.LEFT)
            break
          case 'ArrowRight':
            handleControlMove(Direction.RIGHT)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameState.gameOver, handleControlMove])

  // 터치 이벤트 처리
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (gameState.gameOver) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      // 스와이프 민감도 (최소 10px 이동해야 스와이프로 감지)
      if (Math.max(absDeltaX, absDeltaY) > 10) {
        if (absDeltaX > absDeltaY) {
          // 좌우 스와이프
          if (deltaX > 0) {
            handleControlMove(Direction.RIGHT)
          } else {
            handleControlMove(Direction.LEFT)
          }
        } else {
          // 상하 스와이프
          if (deltaY > 0) {
            handleControlMove(Direction.DOWN)
          } else {
            handleControlMove(Direction.UP)
          }
        }
      }
    },
    [gameState.gameOver, handleControlMove]
  )

  // 그리드 셀 렌더링
  const renderGridCells = () => {
    if (!gameState.board) return null

    const cells = []
    const boardSize = gameState.board.length
    const cellPadding = 5 // 그리드 셀 패딩

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        cells.push(
          <div
            key={`${i}-${j}`}
            className="grid-cell"
            style={{
              width: `${tileSize - cellPadding * 2}px`,
              height: `${tileSize - cellPadding * 2}px`,
              position: 'absolute',
              top: `${i * tileSize + cellPadding + 15}px`, // 15px는 보드 패딩
              left: `${j * tileSize + cellPadding + 15}px`, // 15px는 보드 패딩
            }}
          />
        )
      }
    }
    return cells
  }

  return (
    <div className="game-container w-full max-w-md mx-auto flex flex-col items-center">
      <div className="flex justify-between w-full mb-4">
        <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
          <div className="text-sm text-game-text">{t.stats.score}</div>
          <div className="font-bold text-xl text-game-text">
            {gameState.score}
          </div>
        </div>

        <button onClick={onReset} className="game-button">
          {t.game.newGame}
        </button>

        <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
          <div className="text-sm text-game-text">{t.stats.bestScore}</div>
          <div className="font-bold text-xl text-game-text">
            {gameState.bestScore}
          </div>
        </div>
      </div>

      <div
        ref={boardRef}
        className="game-board relative bg-[var(--board-bg,#bbada0)] rounded-md p-[15px] my-6 mx-auto aspect-square w-full max-w-[500px] shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        data-testid="game-board"
        style={{
          minHeight: `${tileSize * gameState.board.length + 30}px`, // 최소 높이 설정
        }}
      >
        {/* 그리드 셀 렌더링 */}
        {renderGridCells()}

        {/* 타일 렌더링 */}
        {gameState.tiles && gameState.tiles.length > 0
          ? gameState.tiles.map((tile) => (
              <Tile
                key={tile.id}
                tile={tile}
                size={tileSize}
                boardRef={boardRef}
              />
            ))
          : null}

        {/* 게임 오버 오버레이 */}
        {gameState.gameOver && (
          <GameOverOverlay
            score={gameState.score}
            hasWon={gameState.hasWon}
            onReset={onReset}
            onContinue={onContinue}
            showContinue={gameState.hasWon && !gameState.continueAfterWin}
            t={t}
          />
        )}
      </div>

      {/* 게임 컨트롤 */}
      <GameControls
        onMove={handleControlMove}
        disabled={gameState.gameOver}
        t={t}
      />

      {/* 설명 */}
      <p className="text-sm text-game-text mt-4 text-center">
        {t.instructions.controls}
      </p>
    </div>
  )
}

export default GameBoard
