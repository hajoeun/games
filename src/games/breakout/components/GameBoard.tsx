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
    <div className="relative w-[800px] h-[600px] rounded-[8px] overflow-hidden shadow-[0_0_30px_rgba(0,100,255,0.5)]">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        tabIndex={0}
        onKeyDown={handleLocalKeyDown}
        className="block bg-[#000033]"
      />

      {gameState === GameState.START && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[rgba(0,0,40,0.8)] text-white z-10 p-5 text-center">
          <h1
            className="text-[3rem] mb-[40px] text-[#00ffff] tracking-[3px]"
            style={{ textShadow: '0 0 15px #00aaff, 0 0 25px #0088ff' }}
          >
            BREAKOUT
          </h1>
          <p className="text-[1.2rem] mb-[30px] leading-[1.8]">
            시작하려면 스페이스 바를 누르거나
            <br />
            아래 버튼을 클릭하세요
          </p>
          <button
            onClick={handleLocalStartGame}
            className="py-[10px] px-[20px] text-[1.2rem] bg-[#3355ff] text-white border-none rounded-[5px] cursor-pointer mb-[20px] transition-all hover:bg-[#4466ff] hover:shadow-[0_0_15px_rgba(0,100,255,0.8)]"
          >
            게임 시작
          </button>
          <div className="text-[1rem] mt-[20px]">
            <p>← → 키: 패들 좌우 이동</p>
            <p>스페이스 바: 게임 시작/공 발사</p>
          </div>
        </div>
      )}

      {gameState === GameState.GAME_OVER && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[rgba(0,0,40,0.8)] text-white z-10 p-5 text-center">
          <h2
            className="text-[3rem] mb-[30px] text-[#ff3333] tracking-[3px]"
            style={{ textShadow: '0 0 15px #ff0000, 0 0 25px #aa0000' }}
          >
            GAME OVER
          </h2>
          <p className="text-[1.5rem] mb-[30px]">
            최종 점수: {score.toString().padStart(6, '0')}
          </p>
          <button
            onClick={handleLocalRestartGame}
            className="py-[10px] px-[20px] text-[1.2rem] bg-[#3355ff] text-white border-none rounded-[5px] cursor-pointer mb-[20px] transition-all hover:bg-[#4466ff] hover:shadow-[0_0_15px_rgba(0,100,255,0.8)]"
          >
            다시 시작
          </button>
        </div>
      )}

      {gameState === GameState.LEVEL_CLEAR && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[rgba(0,0,40,0.8)] text-white z-10 p-5 text-center">
          <h2
            className="text-[2.5rem] mb-[30px] text-[#33ff33] tracking-[2px]"
            style={{ textShadow: '0 0 15px #00ff00, 0 0 25px #00aa00' }}
          >
            LEVEL {level} CLEAR!
          </h2>
          <p className="text-[1.2rem] mb-[30px] leading-[1.8]">
            다음 레벨을 시작하려면
            <br />
            스페이스 바를 누르거나
            <br />
            아래 버튼을 클릭하세요
          </p>
          <button
            onClick={handleLocalStartGame}
            className="py-[10px] px-[20px] text-[1.2rem] bg-[#3355ff] text-white border-none rounded-[5px] cursor-pointer mb-[20px] transition-all hover:bg-[#4466ff] hover:shadow-[0_0_15px_rgba(0,100,255,0.8)]"
          >
            다음 레벨
          </button>
        </div>
      )}
    </div>
  )
}

export default GameBoard
