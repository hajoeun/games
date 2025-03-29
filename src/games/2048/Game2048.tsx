/**
 * 2048 게임 메인 컴포넌트
 */

import React, { useCallback, useEffect, useState, useRef } from 'react'
import GameBoard from './components/GameBoard'
import { Direction, GameState, GameStatus } from './types'
import {
  addRandomTile,
  canMove,
  createNewGame,
  getBestScore,
  hasWon,
  moveBoard,
  saveBestScore,
  boardToTiles,
  updateTiles,
} from './utils'
import { ANIMATION_DURATION } from './constants'
import './styles/animation.css'
import './styles/theme.css'

const Game2048 = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev
      if (newMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return newMode
    })
  }

  // 게임 상태 관리
  const [gameState, setGameState] = useState<GameState>({
    board: createNewGame(),
    score: 0,
    bestScore: getBestScore(),
    status: GameStatus.PLAYING,
    gameOver: false,
    hasWon: false,
    continueAfterWin: false,
    tiles: [],
    animating: false,
  })

  // handleMove 함수에서 항상 최신 gameState를 사용할 수 있도록 ref 사용
  const gameStateRef = useRef<GameState>(gameState)

  // 게임 상태 업데이트 시 ref도 함께 업데이트
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    // 초기 타일 세팅
    if (gameState.board && (!gameState.tiles || gameState.tiles.length === 0)) {
      const initialTiles = boardToTiles(gameState.board)
      setGameState((prev) => ({
        ...prev,
        tiles: initialTiles,
      }))
    }

    // 다크모드 상태 적용
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [isDarkMode, gameState.board, gameState.tiles])

  // 게임 이동 처리 함수 - useRef를 사용하여 항상 최신 상태 참조
  const handleMove = useCallback((direction: Direction) => {
    console.log(`handleMove 호출: 방향=${direction}`)

    // ref에서 최신 상태 가져오기
    const currentState = gameStateRef.current

    // 게임 종료 상태이거나 애니메이션 중이면 무시
    if (currentState.gameOver || currentState.animating) {
      console.log('이동 무시: 게임 종료 또는 애니메이션 중')
      return
    }

    // 애니메이션 중 상태로 설정
    setGameState((prev) => ({
      ...prev,
      animating: true,
      lastDirection: direction,
    }))

    // 보드 이동 처리
    const {
      board: newBoard,
      score: moveScore,
      moved,
    } = moveBoard(currentState.board, direction)

    // 이동이 없으면 애니메이션 상태만 해제하고 리턴
    if (!moved) {
      console.log('이동 없음: 애니메이션 상태 해제')
      setGameState((prev) => ({ ...prev, animating: false }))
      return
    }

    // 점수 계산
    const newScore = currentState.score + moveScore

    // 새 타일 추가 및 점수 업데이트
    const boardWithNewTile = addRandomTile(newBoard)
    const updatedTiles = updateTiles(currentState.tiles || [], boardWithNewTile)

    // 최고 점수 저장
    if (newScore > currentState.bestScore) {
      saveBestScore(newScore)
    }

    // 게임 종료 여부 확인
    const gameWon = hasWon(boardWithNewTile)
    const noMoreMoves = !canMove(boardWithNewTile)

    // 승리 상태 확인
    let winStatus = currentState.hasWon
    if (gameWon && !currentState.hasWon) {
      console.log('게임 승리!')
      winStatus = true
    }

    // 애니메이션 타이머 설정
    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        board: boardWithNewTile,
        score: newScore,
        bestScore: Math.max(newScore, prev.bestScore),
        tiles: updatedTiles,
        animating: false,
        hasWon: winStatus,
        gameOver: (winStatus && !currentState.continueAfterWin) || noMoreMoves,
        status: noMoreMoves
          ? GameStatus.GAME_OVER
          : winStatus && !currentState.continueAfterWin
          ? GameStatus.WON
          : prev.status,
      }))
    }, 100) // 타일 이동 애니메이션 시간
  }, [])

  // 게임 리셋
  const handleReset = useCallback(() => {
    console.log('게임 리셋')
    const newBoard = createNewGame()
    const newTiles = boardToTiles(newBoard)

    setGameState({
      board: newBoard,
      score: 0,
      bestScore: getBestScore(),
      status: GameStatus.PLAYING,
      gameOver: false,
      hasWon: false,
      continueAfterWin: false,
      tiles: newTiles,
      animating: false,
    })
  }, [])

  // 승리 후 계속하기
  const handleContinue = useCallback(() => {
    console.log('게임 계속하기')
    setGameState((prev) => ({
      ...prev,
      gameOver: false,
      continueAfterWin: true,
      status: GameStatus.CONTINUE,
    }))
  }, [])

  return (
    <div
      className={`game-2048-container min-h-screen bg-gray-100 dark:bg-gray-800 py-8 px-4`}
    >
      <div className="container mx-auto max-w-lg">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-300"
            aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {isDarkMode ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        <GameBoard
          gameState={gameState}
          onMove={handleMove}
          onReset={handleReset}
          onContinue={handleContinue}
        />
      </div>
    </div>
  )
}

export default Game2048
