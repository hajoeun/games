import React, { useRef, useEffect, useState } from 'react'
import { BreakoutGameEngine } from '../controllers/BreakoutGameEngine'
import { GameState } from '../types'

interface GameBoardProps {
  onScoreChange: (score: number) => void
  onLivesChange: (lives: number) => void
  onGameStateChange: (state: GameState) => void
  onLevelChange: (level: number) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  gameState: GameState
  level: number
  score: number
  onStartGame: () => void
  onRestartGame: () => void
}

const GameBoard: React.FC<GameBoardProps> = ({
  onScoreChange,
  onLivesChange,
  onGameStateChange,
  onLevelChange,
  handleKeyDown,
  gameState,
  level,
  score,
  onStartGame,
  onRestartGame,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameEngine, setGameEngine] = useState<BreakoutGameEngine | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new BreakoutGameEngine(canvasRef.current, {
        onScoreChange,
        onLivesChange,
        onGameStateChange,
        onLevelChange,
      })
      setGameEngine(engine)

      return () => {
        engine.stopGame()
      }
    }
  }, [onScoreChange, onLivesChange, onGameStateChange, onLevelChange])

  // 게임 시작 처리
  const handleLocalStartGame = () => {
    if (gameEngine && gameState !== GameState.PLAYING) {
      gameEngine.startGame()
      onStartGame()
    }
  }

  // 게임 재시작 처리
  const handleLocalRestartGame = () => {
    if (gameEngine) {
      gameEngine.resetGame()
      onRestartGame()
    }
  }

  // 키 이벤트 처리
  const handleLocalKeyDown = (e: React.KeyboardEvent) => {
    if (gameEngine) {
      if (e.key === ' ' && gameState !== GameState.PLAYING) {
        gameEngine.startGame()
      } else if (e.key === ' ' && gameState === GameState.PLAYING) {
        gameEngine.launchBall()
      } else {
        gameEngine.handleKeyDown(e.key)
      }
    }
    handleKeyDown(e)
  }

  return (
    <div className="relative w-[800px] h-[600px] overflow-hidden bg-game-board">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        tabIndex={0}
        onKeyDown={handleLocalKeyDown}
        className="block"
      />

      {gameState === GameState.START && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center bg-game-board bg-opacity-90 text-game-text z-10 p-5">
          <h1 className="text-3xl mb-8 text-game-highlight font-chicago">
            벽돌깨기
          </h1>
          <p className="text-xl mb-6 font-monaco">
            시작하려면 스페이스 바를 누르거나
            <br />
            아래 버튼을 클릭하세요
          </p>
          <button onClick={handleLocalStartGame} className="game-button mb-4">
            게임 시작
          </button>
          <div className="text-base mt-4 font-monaco">
            <p>← → 키: 패들 좌우 이동</p>
            <p>스페이스 바: 게임 시작/공 발사</p>
          </div>
        </div>
      )}

      {gameState === GameState.GAME_OVER && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center bg-game-board bg-opacity-90 text-game-text z-10 p-5">
          <h2 className="text-3xl mb-6 text-game-warning font-chicago">
            GAME OVER
          </h2>
          <p className="text-xl mb-6 font-monaco">
            최종 점수: {score.toString().padStart(6, '0')}
          </p>
          <button onClick={handleLocalRestartGame} className="game-button">
            다시 시작
          </button>
        </div>
      )}

      {gameState === GameState.LEVEL_CLEAR && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center bg-game-board bg-opacity-90 text-game-text z-10 p-5">
          <h2 className="text-3xl mb-6 text-game-highlight font-chicago">
            LEVEL {level} CLEAR!
          </h2>
          <p className="text-xl mb-6 font-monaco">
            다음 레벨을 시작하려면
            <br />
            스페이스 바를 누르거나
            <br />
            아래 버튼을 클릭하세요
          </p>
          <button onClick={handleLocalStartGame} className="game-button">
            다음 레벨
          </button>
        </div>
      )}
    </div>
  )
}

export default GameBoard
