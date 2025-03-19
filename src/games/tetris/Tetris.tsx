import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
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
    <TetrisContainer>
      <Header>
        <div>
          <Link to="/">홈으로</Link>
        </div>
        <Title>테트리스</Title>
        <div />
      </Header>

      <GameContainer>
        <SidePanel>
          <HoldPiece holdPiece={holdPiece} />
          <GameInfo
            gameStats={gameStats}
            playerStats={playerStats}
            gameStatus={gameStatus}
          />
        </SidePanel>

        <BoardWrapper>
          <TetrisBoard
            board={board}
            currentPiece={currentPiece}
            ghostPosition={ghostPosition}
          />

          {gameStatus === GameStatus.GAME_OVER && (
            <GameOverlay>
              <GameOverText>게임 오버</GameOverText>
              <GameOverScore>점수: {gameStats.score}</GameOverScore>
              <RestartButton onClick={initGame}>다시 시작</RestartButton>
            </GameOverlay>
          )}

          {gameStatus === GameStatus.PAUSED && (
            <GameOverlay>
              <GameOverText>일시 정지</GameOverText>
              <RestartButton onClick={() => setGameStatus(GameStatus.PLAYING)}>
                계속하기
              </RestartButton>
            </GameOverlay>
          )}
        </BoardWrapper>

        <SidePanel>
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
        </SidePanel>
      </GameContainer>
    </TetrisContainer>
  )
}

// 스타일 컴포넌트
const TetrisContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #121212;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 2rem;

  div {
    width: 120px;
  }

  a {
    font-size: 1rem;
    color: #aaa;
    text-decoration: none;

    &:hover {
      color: #fff;
    }
  }
`

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  color: #fff;
  margin: 0;
`

const GameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
`

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const BoardWrapper = styled.div`
  position: relative;
`

const GameOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 10;
`

const GameOverText = styled.h2`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 1rem;
`

const GameOverScore = styled.p`
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 2rem;
`

const RestartButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0066b2;
  }
`

export default Tetris
