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

const Tetris: React.FC = () => {
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
  ) // 초기 상태를 시작 화면으로 변경
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
        return '테트리스 | 시작 화면'
      case GameStatus.PAUSED:
        return '테트리스 | 일시정지'
      case GameStatus.GAME_OVER:
        return '테트리스 | 게임 오버'
      default:
        return '테트리스'
    }
  }, [gameStatus])

  // 시작 화면 렌더링
  const renderStartScreen = () => {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 flex flex-col items-center justify-center z-10 p-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          테트리스
        </h2>

        <div className="bg-[#222] p-6 rounded-lg mb-8 max-w-[500px] w-full">
          <h3 className="text-xl font-bold mb-4 text-center text-white">
            게임 조작 방법
          </h3>

          {isMobile ? (
            <div className="text-white mb-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">화면 터치 제스처</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>좌우로 스와이프: 블록 좌우 이동</li>
                  <li>위로 스와이프: 블록 회전</li>
                  <li>아래로 스와이프: 하드 드롭 (바닥까지 낙하)</li>
                  <li>한 번 탭: 블록 한 칸 아래로</li>
                  <li>두 번 탭: 홀드 (블록 저장)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">화면 하단 버튼</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>↺: 블록 회전</li>
                  <li>홀드: 현재 블록 저장</li>
                  <li>↓↓: 하드 드롭</li>
                  <li>←/→: 블록 좌우 이동</li>
                  <li>⏸: 일시정지</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-white">
              <h4 className="text-lg font-semibold mb-2">키보드 조작</h4>
              <div className="grid grid-cols-2 gap-4">
                <ul className="list-disc pl-6 space-y-1">
                  <li>← →: 블록 좌우 이동</li>
                  <li>↓: 블록 한 칸 아래로</li>
                  <li>↑: 블록 회전</li>
                </ul>
                <ul className="list-disc pl-6 space-y-1">
                  <li>스페이스: 하드 드롭</li>
                  <li>Shift: 홀드 (블록 저장)</li>
                  <li>P: 일시정지</li>
                  <li>R: 재시작</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <button
          className="px-8 py-4 bg-blue-500 text-white text-xl rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
          onClick={startGame}
        >
          게임 시작
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 overflow-hidden">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">테트리스</h1>
        <Link
          to="/"
          className="px-2 py-1 bg-[#333] text-white rounded hover:bg-[#444]"
        >
          홈으로
        </Link>
      </header>

      <div className="w-full flex flex-col items-center justify-center mx-auto max-w-4xl">
        {/* 시작 화면 */}
        {gameStatus === GameStatus.START_SCREEN && renderStartScreen()}

        {/* 게임 오버 오버레이 */}
        {gameStatus === GameStatus.GAME_OVER && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center z-10 p-4">
            <h2 className="text-3xl font-bold mb-4 text-center">게임 오버</h2>
            <p className="text-xl mb-2">점수: {gameStats.score}</p>
            <p className="text-xl mb-2">레벨: {gameStats.level}</p>
            <p className="text-xl mb-2">라인: {gameStats.lines}</p>
            <button
              className="mt-4 px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444] active:bg-[#555]"
              onClick={restartGame}
            >
              다시 시작
            </button>
          </div>
        )}

        {/* 일시정지 오버레이 */}
        {gameStatus === GameStatus.PAUSED && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center z-10 p-4">
            <h2 className="text-3xl font-bold mb-4 text-center">일시정지</h2>
            <button
              className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444] active:bg-[#555]"
              onClick={togglePause}
            >
              계속하기
            </button>
          </div>
        )}

        {/* 데스크톱 레이아웃 */}
        {!isMobile ? (
          <div className="relative flex flex-row justify-center gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <HoldPiece piece={holdPiece} />
                <NextPiece piece={nextPiece} />
              </div>
              <GameInfo gameStats={gameStats} />
              <GameControls
                onMove={movePiece}
                onRotate={rotatePiece}
                onDrop={hardDrop}
                onHold={holdCurrentPiece}
                onPause={togglePause}
                onRestart={restartGame}
                gameStatus={gameStatus}
              />
            </div>

            <div ref={boardRef} className="relative">
              <TetrisBoard
                board={board}
                currentPiece={currentPiece}
                ghostPosition={ghostPosition}
              />
            </div>
          </div>
        ) : (
          /* 모바일 레이아웃 */
          <div className="w-full flex flex-col items-center">
            {/* 홀드 및 다음 조각 영역 */}
            <div className="flex w-full justify-center space-x-4 mb-2">
              <HoldPiece piece={holdPiece} />
              <NextPiece piece={nextPiece} />
            </div>

            {/* 테트리스 보드 */}
            <div ref={boardRef} className="w-full flex justify-center mb-1">
              <TetrisBoard
                board={board}
                currentPiece={currentPiece}
                ghostPosition={ghostPosition}
              />
            </div>

            {/* 모바일 컨트롤러 - 보드 바로 아래 */}
            <div className="w-full flex justify-center mb-2">
              <MobileControls
                onMove={movePiece}
                onRotate={rotatePiece}
                onDrop={hardDrop}
                onHold={holdCurrentPiece}
                onPause={togglePause}
                onRestart={restartGame}
                gameStatus={gameStatus}
              />
            </div>

            {/* 게임 정보 - 컨트롤러 아래 */}
            <div className="w-full flex justify-center mt-2">
              <GameInfo gameStats={gameStats} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tetris
