/**
 * 2048 게임 보드 컴포넌트
 */

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Direction, GameState, TouchData } from '../types'
import { MIN_SWIPE_DISTANCE, ANIMATION_DURATION } from '../constants'
import { boardToTiles, updateTiles } from '../utils'
import '../styles/animation.css'
import Tile from './Tile'

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
        <h1 className="text-3xl font-bold text-gray-800">2048</h1>
        <button
          onClick={onReset}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition"
        >
          새 게임
        </button>
      </div>

      <div className="flex justify-between">
        <div className="bg-gray-200 rounded p-2 min-w-24 text-center">
          <div className="text-sm text-gray-600">점수</div>
          <div className="font-bold text-xl">{score}</div>
        </div>
        <div className="bg-gray-200 rounded p-2 min-w-24 text-center">
          <div className="text-sm text-gray-600">최고 점수</div>
          <div className="font-bold text-xl">{bestScore}</div>
        </div>
      </div>
    </div>
  )
}

// GameControls 컴포넌트
interface GameControlsProps {
  onMove: (direction: Direction) => void
  disabled: boolean
}

const GameControls: React.FC<GameControlsProps> = ({ onMove, disabled }) => {
  return (
    <div className="flex flex-col items-center mt-6">
      <div className="text-center mb-2 text-gray-600">
        키보드 화살표 또는 아래 버튼 사용
      </div>

      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {/* 위쪽 버튼 */}
        <div className="col-start-2">
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded disabled:opacity-50"
            onClick={() => onMove(Direction.UP)}
            disabled={disabled}
            aria-label="위로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
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
        <div>
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded disabled:opacity-50"
            onClick={() => onMove(Direction.LEFT)}
            disabled={disabled}
            aria-label="왼쪽으로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
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

        {/* 가운데 빈 공간 */}
        <div></div>

        {/* 오른쪽 버튼 */}
        <div>
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded disabled:opacity-50"
            onClick={() => onMove(Direction.RIGHT)}
            disabled={disabled}
            aria-label="오른쪽으로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
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
        <div className="col-start-2">
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded disabled:opacity-50"
            onClick={() => onMove(Direction.DOWN)}
            disabled={disabled}
            aria-label="아래로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
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
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  score,
  hasWon,
  onReset,
  onContinue,
  showContinue,
}) => {
  return (
    <div className="game-over">
      <h2 className="text-2xl font-bold mb-2">
        {hasWon ? '축하합니다!' : '게임 오버!'}
      </h2>
      <p className="text-lg mb-4">
        {hasWon ? '2048 타일에 도달했습니다!' : '더 이상 이동할 수 없습니다.'}
      </p>
      <div className="text-xl font-bold mb-6">점수: {score}</div>

      <div className="flex flex-col space-y-2">
        {showContinue && (
          <button
            onClick={onContinue}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition"
          >
            계속하기
          </button>
        )}
        <button
          onClick={onReset}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition"
        >
          새 게임
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
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onMove,
  onReset,
  onContinue,
}) => {
  const [tileSize, setTileSize] = useState<number>(100) // 기본값 100px
  const isAnimatingRef = useRef<boolean>(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const resizeTimeoutRef = useRef<number | null>(null)
  const touchDataRef = useRef<TouchData>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  })

  // ref를 사용하여 최신 props와 state 값을 저장
  const gameStateRef = useRef(gameState)
  const onMoveRef = useRef(onMove)

  // 값 업데이트 시 ref 함께 업데이트
  useEffect(() => {
    gameStateRef.current = gameState
    onMoveRef.current = onMove
  }, [gameState, onMove])

  // 타일 크기를 픽셀 단위로 계산하는 함수
  const calculateTileSize = useCallback(() => {
    if (!boardRef.current) return 100 // 기본값

    const boardWidth = boardRef.current.clientWidth
    const boardHeight = boardRef.current.clientHeight
    const minDimension = Math.min(boardWidth, boardHeight) - 30 // 패딩 고려
    const cellSize = Math.floor(minDimension / gameState.board.length)

    // 타일 크기 검증
    if (cellSize <= 0 || !isFinite(cellSize)) {
      console.warn('타일 크기 계산 오류, 기본값 100px 사용')
      return 100
    }

    return cellSize
  }, [gameState.board.length])

  // 타일 크기 업데이트 함수
  const updateTileSize = useCallback(() => {
    const newSize = calculateTileSize()
    if (newSize !== tileSize) {
      console.log('타일 크기 업데이트:', newSize, 'px')
      setTileSize(newSize)
    }
  }, [calculateTileSize, tileSize])

  // 초기 타일 크기 설정 및 리사이즈 이벤트 핸들러 등록
  useEffect(() => {
    // 초기 타일 크기 설정
    updateTileSize()

    // 애니메이션 상태 초기화
    isAnimatingRef.current = false

    const resizeHandler = () => {
      // 리사이즈 중에는 애니메이션 비활성화
      isAnimatingRef.current = true

      // 디바운스 처리
      if (resizeTimeoutRef.current !== null) {
        clearTimeout(resizeTimeoutRef.current)
      }

      resizeTimeoutRef.current = window.setTimeout(() => {
        updateTileSize()
        isAnimatingRef.current = false
        resizeTimeoutRef.current = null
      }, 250)
    }

    // 이벤트 리스너 등록
    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
      if (resizeTimeoutRef.current !== null) {
        clearTimeout(resizeTimeoutRef.current)
        resizeTimeoutRef.current = null
      }
    }
  }, [updateTileSize])

  // 추가: 게임판 크기가 변경될 때마다 타일 크기 업데이트
  useEffect(() => {
    // 마운트 후 또는 DOM이 업데이트된 후에 실행
    const updateAfterRender = () => {
      requestAnimationFrame(() => {
        updateTileSize()
      })
    }

    updateAfterRender()

    // ResizeObserver를 사용해 게임판 크기 변화를 감지
    if (typeof ResizeObserver !== 'undefined' && boardRef.current) {
      const observer = new ResizeObserver(() => {
        updateAfterRender()
      })

      observer.observe(boardRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [updateTileSize, gameState.board.length])

  // 키보드 이벤트 핸들러 함수 - 의존성 없음
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    console.log('키보드 이벤트 감지:', event.key)

    // ref에서 최신값 사용
    const currentGameState = gameStateRef.current
    const currentIsAnimating = isAnimatingRef.current

    if (currentIsAnimating || currentGameState.gameOver) {
      console.log('키보드 입력 무시 - 애니메이션 중 또는 게임 오버 상태')
      return
    }

    // 이벤트 기본 동작 방지 (스크롤 등)
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    ) {
      event.preventDefault()
      console.log('방향키 감지 - 기본 동작 방지')
    }

    console.log('키 입력 처리:', event.key)

    switch (event.key) {
      case 'ArrowUp':
        console.log('위쪽 방향키 - onMove 호출 시작')
        onMoveRef.current(Direction.UP)
        console.log('위쪽 방향키 - onMove 호출 완료')
        break
      case 'ArrowDown':
        console.log('아래쪽 방향키 - onMove 호출 시작')
        onMoveRef.current(Direction.DOWN)
        console.log('아래쪽 방향키 - onMove 호출 완료')
        break
      case 'ArrowLeft':
        console.log('왼쪽 방향키 - onMove 호출 시작')
        onMoveRef.current(Direction.LEFT)
        console.log('왼쪽 방향키 - onMove 호출 완료')
        break
      case 'ArrowRight':
        console.log('오른쪽 방향키 - onMove 호출 시작')
        onMoveRef.current(Direction.RIGHT)
        console.log('오른쪽 방향키 - onMove 호출 완료')
        break
      default:
        console.log('지원하지 않는 키 입력 - 무시됨')
        break
    }
  }, [])

  // 키보드 이벤트 리스너는 컴포넌트 마운트 시 한 번만 등록
  useEffect(() => {
    console.log('키보드 이벤트 리스너 등록')
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      console.log('키보드 이벤트 리스너 제거')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // 터치 이벤트 핸들러를 useCallback으로 최적화
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // ref에서 최신값 사용
    const currentGameState = gameStateRef.current
    const currentIsAnimating = isAnimatingRef.current

    if (currentIsAnimating || currentGameState.gameOver) return

    // React 17+에서는 passive 이벤트에서 preventDefault를 호출할 수 없습니다.
    // 대신 터치 좌표만 기록합니다.
    const touch = e.touches[0]
    touchDataRef.current.startX = touch.clientX
    touchDataRef.current.startY = touch.clientY
    console.log('터치 시작:', { x: touch.clientX, y: touch.clientY })
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // 기본 스크롤 방지용으로만 존재 (빈 함수로 둘 수 있음)
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // ref에서 최신값 사용
    const currentGameState = gameStateRef.current
    const currentIsAnimating = isAnimatingRef.current

    if (currentIsAnimating || currentGameState.gameOver) return

    const touch = e.changedTouches[0]
    touchDataRef.current.endX = touch.clientX
    touchDataRef.current.endY = touch.clientY

    const { startX, startY, endX, endY } = touchDataRef.current
    const deltaX = endX - startX
    const deltaY = endY - startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    console.log('터치 종료:', {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      delta: { x: deltaX, y: deltaY },
    })

    // 최소 스와이프 거리를 만족하는 경우에만 처리
    if (Math.max(absDeltaX, absDeltaY) >= MIN_SWIPE_DISTANCE) {
      if (absDeltaX > absDeltaY) {
        // 수평 방향 스와이프
        if (deltaX > 0) {
          console.log('오른쪽으로 스와이프')
          onMoveRef.current(Direction.RIGHT)
        } else {
          console.log('왼쪽으로 스와이프')
          onMoveRef.current(Direction.LEFT)
        }
      } else {
        // 수직 방향 스와이프
        if (deltaY > 0) {
          console.log('아래로 스와이프')
          onMoveRef.current(Direction.DOWN)
        } else {
          console.log('위로 스와이프')
          onMoveRef.current(Direction.UP)
        }
      }
    } else {
      console.log('충분한 거리를 스와이프하지 않음')
    }
  }, [])

  // 그리드 셀 렌더링
  const renderGridCells = useCallback(() => {
    const cells = []
    const boardSize = gameState.board.length
    const cellPadding = 5 // 패딩값

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        cells.push(
          <div
            key={`cell-${row}-${col}`}
            className="grid-cell"
            style={{
              top: `${row * tileSize + cellPadding}px`,
              left: `${col * tileSize + cellPadding}px`,
              width: `${tileSize - cellPadding * 2}px`,
              height: `${tileSize - cellPadding * 2}px`,
              backgroundColor: 'rgba(238, 228, 218, 0.35)',
              borderRadius: '6px',
              boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
              position: 'absolute',
            }}
            data-testid={`grid-cell-${row}-${col}`}
          />
        )
      }
    }
    return cells
  }, [gameState.board.length, tileSize])

  // 방향 버튼 클릭 핸들러를 위한 래퍼 함수 생성
  const handleControlMove = useCallback(
    (direction: Direction) => {
      // 애니메이션 중이거나 게임 종료 상태면 무시
      if (isAnimatingRef.current || gameState.gameOver) {
        console.log('컨트롤 이동 무시 - 애니메이션 중 또는 게임 오버 상태')
        return
      }

      // 실제 이동 처리
      onMove(direction)
    },
    [gameState.gameOver, onMove]
  )

  return (
    <div className="game-container max-w-md mx-auto px-4">
      <GameHeader
        score={gameState.score}
        bestScore={gameState.bestScore}
        onReset={onReset}
      />

      <div
        ref={boardRef}
        className="game-board relative bg-[#bbada0] rounded-md p-[15px] my-6 mx-auto aspect-square w-full max-w-[500px] overflow-hidden shadow-lg"
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
        {gameState.tiles && gameState.tiles.length > 0 ? (
          gameState.tiles.map((tile) => (
            <Tile key={tile.id} tile={tile} size={tileSize} />
          ))
        ) : (
          <div className="text-center absolute inset-0 flex items-center justify-center text-gray-500">
            타일 로딩 중...
          </div>
        )}

        {/* 게임 오버 오버레이 */}
        {gameState.gameOver && (
          <GameOverOverlay
            score={gameState.score}
            hasWon={gameState.hasWon}
            onReset={onReset}
            onContinue={onContinue}
            showContinue={gameState.hasWon && !gameState.continueAfterWin}
          />
        )}
      </div>

      <GameControls onMove={handleControlMove} disabled={gameState.gameOver} />
    </div>
  )
}

export default GameBoard
