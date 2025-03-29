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
import { GameController } from './controllers/GameController'

const Tetris: React.FC = () => {
  // 게임 상태 관리
  const [board, setBoard] = useState<Board>(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null)
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null)
  const [holdPiece, setHoldPiece] = useState<Tetromino | null>(null)
  const [hasHoldUsed, setHasHoldUsed] = useState<boolean>(false)
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING)
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
    setGameStatus(GameStatus.PLAYING)
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

    while (
      !isColliding(board, {
        ...currentPiece,
        position: { ...newPosition, y: newPosition.y + 1 },
      })
    ) {
      newPosition.y += 1
      dropDistance += 1
    }

    setGameStats((prev) => ({
      ...prev,
      score: prev.score + POINTS.HARD_DROP * dropDistance,
    }))

    const newPiece = {
      ...currentPiece,
      position: newPosition,
    }

    setCurrentPiece(newPiece)
    placePiece(newPiece)
  }, [board, currentPiece, gameStatus, placePiece])

  // 홀드 기능
  const holdCurrentPiece = useCallback(() => {
    if (!currentPiece || hasHoldUsed || gameStatus !== GameStatus.PLAYING)
      return

    if (holdPiece) {
      const tempPiece = {
        ...holdPiece,
        position: {
          x: Math.floor((BOARD_WIDTH - holdPiece.shape[0].length) / 2),
          y: 0,
        },
        rotation: 0,
      }

      setHoldPiece({
        ...currentPiece,
        position: { x: 0, y: 0 },
        rotation: 0,
      })
      setCurrentPiece(tempPiece)
      setHasHoldUsed(true)
      setGhostPosition(calculateGhostPosition(board, tempPiece))
    } else {
      setHoldPiece({
        ...currentPiece,
        position: { x: 0, y: 0 },
        rotation: 0,
      })
      setHasHoldUsed(true)
      generateNextPiece()
    }
  }, [
    currentPiece,
    holdPiece,
    hasHoldUsed,
    gameStatus,
    generateNextPiece,
    board,
  ])

  // 게임 컨트롤러 콜백
  const controllerCallbacks = useMemo(
    () => ({
      onMoveLeft: () => {
        if (gameStatus === GameStatus.PLAYING) {
          movePiece(-1)
        }
      },
      onMoveRight: () => {
        if (gameStatus === GameStatus.PLAYING) {
          movePiece(1)
        }
      },
      onMoveDown: () => {
        if (gameStatus === GameStatus.PLAYING) {
          moveDown()
        }
      },
      onRotate: () => {
        if (gameStatus === GameStatus.PLAYING) {
          rotatePiece()
        }
      },
      onHardDrop: () => {
        if (gameStatus === GameStatus.PLAYING) {
          hardDrop()
        }
      },
      onHold: () => {
        if (gameStatus === GameStatus.PLAYING) {
          holdCurrentPiece()
        }
      },
      onPause: () => {
        setGameStatus((prev) =>
          prev === GameStatus.PLAYING ? GameStatus.PAUSED : GameStatus.PLAYING
        )
      },
      onRestart: () => {
        initGame()
      },
    }),
    [
      gameStatus,
      movePiece,
      moveDown,
      rotatePiece,
      hardDrop,
      holdCurrentPiece,
      initGame,
    ]
  )

  // 게임 컨트롤러 초기화 및 정리
  useEffect(() => {
    controllerRef.current = new GameController(controllerCallbacks)
    controllerRef.current.attach()

    return () => {
      if (controllerRef.current) {
        controllerRef.current.detach()
        controllerRef.current = null
      }
    }
  }, [controllerCallbacks])

  // 게임 상태에 따른 컨트롤러 활성화/비활성화
  useEffect(() => {
    if (controllerRef.current) {
      if (gameStatus === GameStatus.PLAYING) {
        controllerRef.current.enable()
      } else {
        controllerRef.current.disable()
      }
    }
  }, [gameStatus])

  // 게임 루프
  const gameLoop = useCallback(() => {
    if (gameStatus !== GameStatus.PLAYING || !currentPiece) {
      console.log('게임 루프 중단:', {
        gameStatus,
        currentPiece: !!currentPiece,
      })
      return
    }

    const now = Date.now()
    const speed = getSpeedByLevel(gameStats.level)
    const timeDiff = now - lastMoveDownTime.current

    // 일정 시간마다 자동으로 아래로 이동
    if (timeDiff > speed) {
      console.log('게임 루프 실행:', {
        timeDiff,
        speed,
        currentPiece: currentPiece.type,
        position: currentPiece.position,
      })

      const newPosition = {
        ...currentPiece.position,
        y: currentPiece.position.y + 1,
      }

      if (!isColliding(board, { ...currentPiece, position: newPosition })) {
        setCurrentPiece({
          ...currentPiece,
          position: newPosition,
        })
        setGhostPosition(
          calculateGhostPosition(board, {
            ...currentPiece,
            position: newPosition,
          })
        )
      } else {
        console.log('블록 고정')
        placePiece(currentPiece)
      }

      lastMoveDownTime.current = now
    }
  }, [gameStatus, currentPiece, board, gameStats.level, placePiece])

  // 게임 초기화 및 이벤트 리스너 설정
  useEffect(() => {
    initGame()
  }, [initGame])

  // 게임 루프 관리
  useEffect(() => {
    let frameId: number
    const currentGameLoopRef = gameLoopRef.current

    if (gameStatus === GameStatus.PLAYING && currentPiece) {
      const runGameLoop = () => {
        gameLoop()
        frameId = requestAnimationFrame(runGameLoop)
      }

      frameId = requestAnimationFrame(runGameLoop)

      return () => {
        cancelAnimationFrame(frameId)
        if (currentGameLoopRef) {
          clearTimeout(currentGameLoopRef)
        }
      }
    }
  }, [gameStatus, currentPiece, gameLoop])

  // 고스트 위치 업데이트 - 필요한 경우에만 실행
  useEffect(() => {
    if (currentPiece && gameStatus === GameStatus.PLAYING) {
      const newGhostPosition = calculateGhostPosition(board, currentPiece)
      if (newGhostPosition !== ghostPosition) {
        setGhostPosition(newGhostPosition)
      }
    }
  }, [currentPiece, board, gameStatus, ghostPosition])

  // 플레이어 통계 로드
  const playerStats = loadGameStats()

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-800">
      <Helmet>
        <title>테트리스 - 브라우저 아케이드</title>
        <meta
          name="description"
          content="클래식 테트리스 게임을 무료로 즐겨보세요. 최고 점수를 기록하고 친구들과 경쟁해보세요."
        />
        <meta
          name="keywords"
          content="테트리스, 무료 테트리스, 온라인 테트리스, 브라우저 게임, 퍼즐 게임"
        />

        {/* Open Graph 메타 태그 */}
        <meta property="og:title" content="테트리스 - 브라우저 아케이드" />
        <meta
          property="og:description"
          content="클래식 테트리스 게임을 무료로 즐겨보세요. 최고 점수를 기록하고 친구들과 경쟁해보세요."
        />
        <meta property="og:type" content="game" />
        <meta property="og:image" content="/images/tetris-thumbnail.png" />

        {/* Twitter Card 메타 태그 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="테트리스 - 브라우저 아케이드" />
        <meta
          name="twitter:description"
          content="클래식 테트리스 게임을 무료로 즐겨보세요. 최고 점수를 기록하고 친구들과 경쟁해보세요."
        />
        <meta name="twitter:image" content="/images/tetris-thumbnail.png" />
      </Helmet>

      <header className="flex justify-between items-center w-full max-width-1000 mb-4">
        <div className="w-120">
          <Link
            to="/"
            className="text-sm text-gray-400 no-underline hover:text-white"
          >
            홈으로
          </Link>
        </div>
        <h1 className="text-2xl text-center text-white">테트리스</h1>
        <div />
      </header>

      <div className="flex justify-center items-start gap-4 w-full max-width-1000">
        <div className="flex flex-col gap-4">
          <HoldPiece holdPiece={holdPiece} />
          <GameInfo
            gameStats={gameStats}
            playerStats={playerStats}
            gameStatus={gameStatus}
          />
        </div>

        <div className="relative">
          <TetrisBoard
            board={board}
            currentPiece={currentPiece}
            ghostPosition={ghostPosition}
          />

          {gameStatus === GameStatus.GAME_OVER && (
            <div className="absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col justify-center items-center z-100">
              <h2 className="text-3xl mb-4 text-red-600">게임 오버</h2>
              <p className="text-xl mb-8">최종 점수: {gameStats.score}</p>
              <button
                className="bg-red-600 text-white border-none py-[10px] px-5 text-xl cursor-pointer mb-4 hover:bg-red-800"
                onClick={initGame}
              >
                다시 시작
              </button>
            </div>
          )}

          {gameStatus === GameStatus.PAUSED && (
            <div className="absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col justify-center items-center z-100">
              <h2 className="text-3xl mb-4 text-red-600">일시 정지</h2>
              <button
                className="bg-red-600 text-white border-none py-[10px] px-5 text-xl cursor-pointer mb-4 hover:bg-red-800"
                onClick={() => setGameStatus(GameStatus.PLAYING)}
              >
                계속하기
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <NextPiece nextPiece={nextPiece} />
          <GameControls
            onMove={movePiece}
            onRotate={rotatePiece}
            onDrop={hardDrop}
            onHold={holdCurrentPiece}
            onPause={() =>
              setGameStatus((prev) =>
                prev === GameStatus.PLAYING
                  ? GameStatus.PAUSED
                  : GameStatus.PLAYING
              )
            }
            onRestart={initGame}
            gameStatus={gameStatus}
          />
        </div>
      </div>
    </div>
  )
}

export default Tetris
