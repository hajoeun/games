import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { BOARD_WIDTH, POINTS } from './constants'
import { Board, Tetromino, GameStatus, GameStats } from './types'
import {
  createEmptyBoard,
  createRandomTetromino,
  rotateTetromino,
  isColliding,
  lockTetromino,
  clearLines,
  calculateGhostPosition,
  getSpeedByLevel,
  saveGameStats,
  loadGameStats,
} from './utils'
import TetrisBoard from './components/TetrisBoard'
import NextPiece from './components/NextPiece'
import HoldPiece from './components/HoldPiece'
import GameControls from './components/GameControls'
import GameInfo from './components/GameInfo'
import MobileControls from './components/MobileControls'
import { GameController, TouchController } from './controllers/GameController'
import { Language, getDefaultLanguage, useTranslation } from './i18n'

const Tetris: React.FC = () => {
  // 언어 상태 관리
  const [language, setLanguage] = useState<Language>(getDefaultLanguage())
  const t = useTranslation(language)

  // 모바일 여부 감지
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // 게임 상태 관리
  const [board, setBoard] = useState<Board>(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null)
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null)
  const [holdPiece, setHoldPiece] = useState<Tetromino | null>(null)
  const [hasHoldUsed, setHasHoldUsed] = useState<boolean>(false)
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.START_SCREEN
  )
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    level: 1,
    lines: 0,
    tetris: 0,
    totalPieces: 0,
  })
  const [ghostPosition, setGhostPosition] = useState<number>(0)

  // 게임 루프 관리
  const gameLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastMoveDownTime = useRef<number>(Date.now())

  // 게임 컨트롤러 참조
  const controllerRef = useRef<GameController | null>(null)
  const touchControllerRef = useRef<TouchController | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

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

  // 모바일 환경 감지
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
          userAgent
        )
      setIsMobile(isMobileDevice || window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // 게임 시작 함수
  const startGame = useCallback(() => {
    initGame()
    setGameStatus(GameStatus.PLAYING)

    // 컨트롤러 활성화
    if (controllerRef.current) {
      controllerRef.current.enable()
    }
    if (touchControllerRef.current) {
      touchControllerRef.current.enable()
    }
  }, [])

  // 게임 초기화 함수
  const initGame = useCallback(() => {
    const initialPiece = createRandomTetromino()
    const nextPiece = createRandomTetromino()
    const initialBoard = createEmptyBoard()
    const initialGhostPosition = calculateGhostPosition(
      initialBoard,
      initialPiece
    )

    setBoard(initialBoard)
    setCurrentPiece(initialPiece)
    setNextPiece(nextPiece)
    setHoldPiece(null)
    setHasHoldUsed(false)
    setGhostPosition(initialGhostPosition)
    setGameStats({
      score: 0,
      lines: 0,
      level: 1,
      tetris: 0,
      totalPieces: 0,
    })
  }, [])

  // 다음 조각 생성 함수
  const generateNextPiece = useCallback(() => {
    if (!nextPiece) return

    const newCurrentPiece = {
      ...nextPiece,
      position: {
        x: Math.floor((BOARD_WIDTH - nextPiece.shape[0].length) / 2),
        y: 0,
      },
    }

    const newNextPiece = createRandomTetromino()

    setCurrentPiece(newCurrentPiece)
    setNextPiece(newNextPiece)
    setHasHoldUsed(false)
    setGhostPosition(calculateGhostPosition(board, newCurrentPiece))
    setGameStats((prev) => ({
      ...prev,
      totalPieces: prev.totalPieces + 1,
    }))
  }, [board, nextPiece])

  // 좌우 이동 기능
  const movePiece = useCallback(
    (direction: number) => {
      if (!currentPiece || gameStatus !== GameStatus.PLAYING) return

      const newPosition = {
        ...currentPiece.position,
        x: currentPiece.position.x + direction,
      }

      if (!isColliding(board, { ...currentPiece, position: newPosition })) {
        setCurrentPiece({
          ...currentPiece,
          position: newPosition,
        })
      }
    },
    [board, currentPiece, gameStatus]
  )

  // 아래 이동 기능
  const moveDown = useCallback(() => {
    if (!currentPiece || gameStatus !== GameStatus.PLAYING) return false

    const newPosition = {
      ...currentPiece.position,
      y: currentPiece.position.y + 1,
    }

    if (!isColliding(board, { ...currentPiece, position: newPosition })) {
      setCurrentPiece({
        ...currentPiece,
        position: newPosition,
      })

      setGameStats((prev) => ({
        ...prev,
        score: prev.score + POINTS.SOFT_DROP,
      }))

      return true
    }

    return false
  }, [board, currentPiece, gameStatus])

  // 회전 기능
  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameStatus !== GameStatus.PLAYING) return

    const rotatedPiece = rotateTetromino(currentPiece)

    if (!isColliding(board, rotatedPiece)) {
      setCurrentPiece(rotatedPiece)
    } else {
      const kicks = [1, -1, 2, -2]
      for (const kick of kicks) {
        const kickedPiece = {
          ...rotatedPiece,
          position: {
            ...rotatedPiece.position,
            x: rotatedPiece.position.x + kick,
          },
        }

        if (!isColliding(board, kickedPiece)) {
          setCurrentPiece(kickedPiece)
          break
        }
      }
    }
  }, [board, currentPiece, gameStatus])

  // 조각 배치 및 라인 제거 처리
  const placePiece = useCallback(
    (piece: Tetromino) => {
      if (!piece) return

      // 보드에 조각 고정
      const newBoard = lockTetromino(board, piece)
      // 완성된 라인 제거
      const { newBoard: boardAfterClear, linesCleared } = clearLines(newBoard)

      // 게임 오버 체크
      const isGameOver =
        nextPiece &&
        isColliding(boardAfterClear, {
          ...nextPiece,
          position: {
            x: Math.floor((BOARD_WIDTH - nextPiece.shape[0].length) / 2),
            y: 0,
          },
        })

      if (isGameOver) {
        setGameStatus(GameStatus.GAME_OVER)
        setBoard(boardAfterClear)
        saveGameStats(gameStats.score, gameStats.level, gameStats.lines)
        return
      }

      setBoard(boardAfterClear)

      // 점수 및 레벨 업데이트 - 라인이 실제로 제거된 경우에만 점수 추가
      if (linesCleared > 0) {
        setGameStats((prev) => {
          let scoreIncrease = 0
          let tetrisCount = prev.tetris

          switch (linesCleared) {
            case 1:
              scoreIncrease = POINTS.SINGLE * prev.level
              break
            case 2:
              scoreIncrease = POINTS.DOUBLE * prev.level
              break
            case 3:
              scoreIncrease = POINTS.TRIPLE * prev.level
              break
            case 4:
              scoreIncrease = POINTS.TETRIS * prev.level
              tetrisCount += 1
              break
            default:
              break
          }

          const newLines = prev.lines + linesCleared
          const newLevel = Math.floor(newLines / 10) + 1

          return {
            score: prev.score + scoreIncrease,
            level: newLevel,
            lines: newLines,
            tetris: tetrisCount,
            totalPieces: prev.totalPieces,
          }
        })
      }

      generateNextPiece()
    },
    [board, nextPiece, generateNextPiece, gameStats]
  )

  // 하드 드롭 기능
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameStatus !== GameStatus.PLAYING) return

    let dropDistance = 0
    let newPosition = { ...currentPiece.position }

    // 바닥까지 얼마나 떨어질 수 있는지 계산
    while (
      !isColliding(board, {
        ...currentPiece,
        position: { ...newPosition, y: newPosition.y + 1 },
      })
    ) {
      newPosition.y += 1
      dropDistance += 1
    }

    // 점수 추가
    setGameStats((prev) => ({
      ...prev,
      score: prev.score + POINTS.HARD_DROP * dropDistance,
    }))

    // 새 위치로 조각 업데이트
    setCurrentPiece({
      ...currentPiece,
      position: newPosition,
    })

    // 보드에 즉시 배치
    placePiece({
      ...currentPiece,
      position: newPosition,
    })
  }, [board, currentPiece, gameStatus, placePiece])

  // 홀드 기능
  const holdCurrentPiece = useCallback(() => {
    if (!currentPiece || hasHoldUsed || gameStatus !== GameStatus.PLAYING)
      return

    if (holdPiece) {
      // 홀드에 이미 조각이 있으면 교체
      const resetHoldPiece = {
        ...holdPiece,
        position: {
          x: Math.floor((BOARD_WIDTH - holdPiece.shape[0].length) / 2),
          y: 0,
        },
      }

      setHoldPiece({
        ...currentPiece,
        position: { x: 0, y: 0 }, // 홀드 위치 리셋
      })
      setCurrentPiece(resetHoldPiece)
      setGhostPosition(calculateGhostPosition(board, resetHoldPiece))
    } else {
      // 홀드가 비어있으면 현재 조각 저장하고 다음 조각 가져오기
      setHoldPiece({
        ...currentPiece,
        position: { x: 0, y: 0 }, // 홀드 위치 리셋
      })
      generateNextPiece()
    }

    setHasHoldUsed(true)
  }, [
    currentPiece,
    holdPiece,
    hasHoldUsed,
    gameStatus,
    board,
    generateNextPiece,
  ])

  // 일시정지 / 재개 토글
  const togglePause = useCallback(() => {
    if (gameStatus === GameStatus.GAME_OVER) return

    if (gameStatus === GameStatus.PLAYING) {
      setGameStatus(GameStatus.PAUSED)
      if (controllerRef.current) {
        controllerRef.current.disable()
      }
      if (touchControllerRef.current) {
        touchControllerRef.current.disable()
      }
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current)
        gameLoopRef.current = null
      }
    } else {
      setGameStatus(GameStatus.PLAYING)
      if (controllerRef.current) {
        controllerRef.current.enable()
      }
      if (touchControllerRef.current) {
        touchControllerRef.current.enable()
      }
      lastMoveDownTime.current = Date.now() // 타이머 리셋
    }
  }, [gameStatus])

  // 게임 다시 시작
  const restartGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearTimeout(gameLoopRef.current)
      gameLoopRef.current = null
    }
    initGame()
    setGameStatus(GameStatus.PLAYING)
    if (controllerRef.current) {
      controllerRef.current.enable()
    }
    if (touchControllerRef.current) {
      touchControllerRef.current.enable()
    }
  }, [initGame])

  // 게임 컨트롤러 설정
  useEffect(() => {
    const callbacks = {
      onMoveLeft: () => movePiece(-1),
      onMoveRight: () => movePiece(1),
      onMoveDown: moveDown,
      onRotate: rotatePiece,
      onHardDrop: hardDrop,
      onHold: holdCurrentPiece,
      onPause: togglePause,
      onRestart: restartGame,
    }

    // 키보드 컨트롤러 설정
    controllerRef.current = new GameController(callbacks)
    controllerRef.current.attach()

    // 시작 화면에서는 컨트롤러 비활성화
    if (gameStatus === GameStatus.START_SCREEN) {
      controllerRef.current.disable()
    }

    // 터치 컨트롤러 설정
    touchControllerRef.current = new TouchController(callbacks)
    if (boardRef.current) {
      touchControllerRef.current.attach(boardRef.current)

      // 시작 화면에서는 터치 컨트롤러 비활성화
      if (gameStatus === GameStatus.START_SCREEN) {
        touchControllerRef.current.disable()
      }
    }

    return () => {
      if (controllerRef.current) {
        controllerRef.current.detach()
      }
      if (touchControllerRef.current && boardRef.current) {
        touchControllerRef.current.detach(boardRef.current)
      }
    }
  }, [
    movePiece,
    moveDown,
    rotatePiece,
    hardDrop,
    holdCurrentPiece,
    togglePause,
    restartGame,
    gameStatus, // 게임 상태가 변경될 때마다 컨트롤러 상태 업데이트
  ])

  // 게임 루프
  useEffect(() => {
    if (
      gameStatus !== GameStatus.PLAYING ||
      !currentPiece ||
      gameLoopRef.current
    )
      return

    const runGameLoop = () => {
      const now = Date.now()
      const speed = getSpeedByLevel(gameStats.level)

      // 일정 시간이 지나면 조각을 아래로 이동
      if (now - lastMoveDownTime.current > speed) {
        const moved = moveDown()

        // 이동할 수 없으면 조각을 고정하고 다음 조각 생성
        if (!moved && currentPiece) {
          placePiece(currentPiece)
        }

        lastMoveDownTime.current = now
      }

      // 다음 프레임 예약
      gameLoopRef.current = setTimeout(runGameLoop, 16.67) // 약 60fps
    }

    runGameLoop()

    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }
  }, [gameStatus, currentPiece, moveDown, placePiece, gameStats.level])

  // 보드 로딩 시 고스트 위치 계산
  useEffect(() => {
    if (currentPiece && gameStatus === GameStatus.PLAYING) {
      setGhostPosition(calculateGhostPosition(board, currentPiece))
    }
  }, [currentPiece, board, gameStatus])

  // 게임 상태에 따른 초기화
  useEffect(() => {
    // 시작 화면일 때는 빈 보드만 준비
    if (gameStatus === GameStatus.START_SCREEN) {
      setBoard(createEmptyBoard())
    }
    // 게임 종료 시 이벤트 정리
    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current)
      }
    }
  }, [gameStatus])

  // 게임 상태 페이지 타이틀 설정
  const pageTitle = useMemo(() => {
    switch (gameStatus) {
      case GameStatus.START_SCREEN:
        return t.status.startScreen
      case GameStatus.PAUSED:
        return t.status.paused
      case GameStatus.GAME_OVER:
        return t.status.gameOver
      default:
        return t.status.playing
    }
  }, [gameStatus, t])

  // getHighScore 함수 추가
  const getHighScore = () => {
    try {
      const stats = loadGameStats()
      return stats ? stats.highScore : 0
    } catch (error) {
      console.error('Failed to get high score:', error)
      return 0
    }
  }

  // handleHold 함수 수정 (holdCurrentPiece 이름 변경)
  const handleHold = useCallback(() => {
    holdCurrentPiece()
  }, [holdCurrentPiece])

  // 게임 렌더링
  return (
    <div className="min-h-screen w-full py-8 px-4">
      <Helmet>
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
      </Helmet>

      <div className="container mx-auto max-w-5xl">
        {/* 언어 선택 */}
        <div className="absolute top-4 right-4 z-10">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="classic-select px-2 py-1 font-geneva-9"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="zh">中文</option>
            <option value="es">Español</option>
          </select>
        </div>

        <div className="classic-window">
          <div className="classic-title-bar">
            <div className="title">{t.game.title}</div>
          </div>

          <div className="p-4">
            <div className="flex flex-wrap justify-center gap-4">
              {/* 게임 시작 화면 */}
              {gameStatus === GameStatus.START_SCREEN && (
                <div className="game-area w-full max-w-md p-6 text-center">
                  <h1 className="text-2xl font-chicago mb-4 text-game-highlight">
                    {t.game.title}
                  </h1>
                  <p className="text-game-text mb-6">
                    {t.instructions.controls}
                  </p>
                  <div className="mt-6">
                    <button onClick={startGame} className="game-button">
                      {t.game.start}
                    </button>
                  </div>
                  <div className="mt-4 text-sm text-game-text">
                    <p>
                      {t.stats.level}: {gameStats.level} | {t.stats.highScore}:{' '}
                      {getHighScore()}
                    </p>
                  </div>
                </div>
              )}

              {/* 게임 진행/일시정지/게임오버 상태 */}
              {gameStatus !== GameStatus.START_SCREEN && (
                <>
                  {/* 게임 보드 영역 */}
                  <div className="game-area p-4 min-w-[300px]">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-chicago text-game-highlight">
                        {t.game.title}
                      </h2>
                      <button
                        onClick={togglePause}
                        className="classic-button"
                        aria-label={
                          gameStatus === GameStatus.PAUSED
                            ? t.game.resume
                            : t.game.pause
                        }
                      >
                        {gameStatus === GameStatus.PAUSED
                          ? t.game.resume
                          : t.game.pause}
                      </button>
                    </div>

                    <div className="flex justify-center" ref={boardRef}>
                      <TetrisBoard
                        board={board}
                        currentPiece={currentPiece}
                        ghostPosition={ghostPosition}
                      />
                    </div>

                    {/* 모바일 컨트롤 */}
                    {isMobile && (
                      <div className="mt-4">
                        <MobileControls
                          onMoveLeft={() => movePiece(-1)}
                          onMoveRight={() => movePiece(1)}
                          onRotate={rotatePiece}
                          onSoftDrop={moveDown}
                          onHardDrop={hardDrop}
                          onHold={handleHold}
                          disabled={gameStatus !== GameStatus.PLAYING}
                        />
                      </div>
                    )}

                    {/* 게임 오버/일시정지 오버레이 */}
                    {(gameStatus === GameStatus.GAME_OVER ||
                      gameStatus === GameStatus.PAUSED) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)] z-10">
                        <div className="classic-dialog p-6 text-center w-[80%] max-w-[400px]">
                          <h2 className="text-xl font-chicago mb-4">
                            {gameStatus === GameStatus.PAUSED
                              ? t.game.pause
                              : t.messages.gameOver}
                          </h2>
                          <p className="mb-6">
                            {gameStatus === GameStatus.PAUSED
                              ? t.messages.paused
                              : `${t.stats.score}: ${gameStats.score} | ${t.stats.level}: ${gameStats.level}`}
                          </p>

                          {gameStatus === GameStatus.PAUSED ? (
                            <button
                              onClick={togglePause}
                              className="classic-button-default"
                            >
                              {t.game.resume}
                            </button>
                          ) : (
                            <button
                              onClick={restartGame}
                              className="classic-button-default"
                            >
                              {t.game.restart}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 게임 정보 패널 */}
                  <div className="classic-window min-w-[200px]">
                    <div className="classic-title-bar">
                      <div className="title">{t.info.title}</div>
                    </div>
                    <div className="p-3">
                      <div className="mb-4">
                        <h3 className="text-base font-chicago mb-1">
                          {t.stats.score}
                        </h3>
                        <p className="font-monaco text-2xl">
                          {gameStats.score}
                        </p>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-base font-chicago mb-1">
                          {t.stats.level}
                        </h3>
                        <p className="font-monaco text-2xl">
                          {gameStats.level}
                        </p>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-base font-chicago mb-1">
                          {t.stats.lines}
                        </h3>
                        <p className="font-monaco text-2xl">
                          {gameStats.lines}
                        </p>
                      </div>

                      {/* 다음 조각 */}
                      <div className="mt-6 mb-4">
                        <h3 className="text-base font-chicago mb-2">
                          {t.pieces.next}
                        </h3>
                        <div className="bg-classic-secondary p-2 border-2 border-classic-secondary">
                          <NextPiece piece={nextPiece} />
                        </div>
                      </div>

                      {/* 홀드 조각 */}
                      <div className="mb-4">
                        <h3 className="text-base font-chicago mb-2">
                          {t.pieces.hold}
                        </h3>
                        <div className="bg-classic-secondary p-2 border-2 border-classic-secondary">
                          <HoldPiece piece={holdPiece} />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 홈으로 이동 버튼 */}
        <div className="mt-4 text-center">
          <Link to="/" className="classic-button inline-block">
            홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Tetris
