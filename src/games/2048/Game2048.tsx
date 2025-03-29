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
    // ref에서 최신 상태 가져오기
    const currentState = gameStateRef.current

    // 게임 종료 상태이거나 애니메이션 중이면 무시
    if (currentState.gameOver || currentState.animating) {
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
    }, ANIMATION_DURATION) // 애니메이션 지속 시간 상수 사용
  }, [])

  // 게임 리셋
  const handleReset = useCallback(() => {
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
    setGameState((prev) => ({
      ...prev,
      gameOver: false,
      continueAfterWin: true,
      status: GameStatus.CONTINUE,
    }))
  }, [])

  return (
    <div
      className="min-h-screen w-full py-8 px-4"
      style={{
        backgroundColor: isDarkMode ? 'var(--dark-bg)' : 'var(--light-bg)',
      }}
    >
      <div className="container mx-auto max-w-lg">
        <div className="classic-window">
          <div className="classic-title-bar">
            <div className="title">2048 게임</div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-chicago">2048</h1>
              <button
                onClick={toggleDarkMode}
                className="classic-button"
                aria-label={
                  isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'
                }
              >
                {isDarkMode ? '라이트 모드' : '다크 모드'}
              </button>
            </div>

            <div className="game-area">
              <GameBoard
                gameState={gameState}
                onMove={handleMove}
                onReset={handleReset}
                onContinue={handleContinue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game2048
