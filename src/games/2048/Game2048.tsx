/**
 * 2048 게임 메인 컴포넌트
 */

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
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
import { Language, getDefaultLanguage, useTranslation } from './i18n'
import './styles/animation.css'
import './styles/theme.css'

const Game2048 = () => {
  // 언어 상태 관리
  const [language, setLanguage] = useState<Language>(getDefaultLanguage())
  const t = useTranslation(language)

  // 다크모드 상태 관리
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  // 언어 변경 핸들러
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  // 언어 설정 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

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
    <div className="min-h-screen w-full py-8 px-4">
      <Helmet>
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
      </Helmet>

      <div className="container mx-auto max-w-5xl">
        <div className="classic-window">
          <div className="classic-title-bar">
            <div className="title">{t.game.title}</div>
          </div>

          <div className="p-4">
            <div className="flex flex-col items-center">
              {/* 언어 선택 */}
              <div className="absolute top-4 right-4 z-10">
                <select
                  value={language}
                  onChange={(e) =>
                    handleLanguageChange(e.target.value as Language)
                  }
                  className="classic-select px-2 py-1 font-geneva-9"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                  <option value="es">Español</option>
                </select>
              </div>

              {/* 게임 정보 */}
              <div className="flex justify-between w-full max-w-[800px] mb-4">
                <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
                  <div className="text-sm text-game-text">{t.stats.score}</div>
                  <div className="font-bold text-xl text-game-text">
                    {gameState.score}
                  </div>
                </div>

                <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
                  <div className="text-sm text-game-text">
                    {t.stats.bestScore}
                  </div>
                  <div className="font-bold text-xl text-game-text">
                    {gameState.bestScore}
                  </div>
                </div>

                {/* 다크모드 토글 */}
                <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
                  <button
                    onClick={toggleDarkMode}
                    className="text-sm text-game-text hover:text-game-highlight"
                  >
                    {t.settings.darkMode}
                  </button>
                </div>
              </div>

              {/* 게임 보드 */}
              <div className="game-area p-0 rounded-md overflow-hidden">
                <GameBoard
                  gameState={gameState}
                  onMove={handleMove}
                  onReset={handleReset}
                  onContinue={handleContinue}
                  t={t}
                />
              </div>

              {/* 게임 컨트롤 */}
              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleReset}
                  className="classic-button-default"
                >
                  {t.game.newGame}
                </button>
              </div>

              {/* 게임 설명 */}
              <div className="mt-4 text-center max-w-[800px]">
                <div className="classic-dialog">
                  <p className="text-sm font-monaco mb-1">
                    {t.instructions.controls}
                  </p>
                </div>
              </div>

              {/* 승리/게임오버 모달 */}
              {(gameState.hasWon || gameState.gameOver) && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="classic-dialog p-6 text-center">
                    <h2 className="text-xl font-chicago mb-4">
                      {gameState.hasWon ? t.status.win : t.status.gameOver}
                    </h2>
                    <p className="mb-6">
                      {gameState.hasWon ? t.messages.win : t.messages.gameOver}
                    </p>
                    {gameState.hasWon && !gameState.continueAfterWin && (
                      <div className="flex flex-col gap-2">
                        <p className="mb-4">{t.messages.continue}</p>
                        <button
                          onClick={handleContinue}
                          className="classic-button-default mb-2"
                        >
                          {t.game.continue}
                        </button>
                        <button
                          onClick={handleReset}
                          className="classic-button-default"
                        >
                          {t.game.newGame}
                        </button>
                      </div>
                    )}
                    {(gameState.gameOver || gameState.continueAfterWin) && (
                      <button
                        onClick={handleReset}
                        className="classic-button-default"
                      >
                        {t.game.restart}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game2048
