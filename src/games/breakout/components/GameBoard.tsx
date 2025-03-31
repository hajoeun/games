import React, { useRef, useEffect, useState } from 'react'
import { BreakoutGameEngine } from '../controllers/BreakoutGameEngine'
import { GameState } from '../types'
import { TranslationType } from '../i18n/index'

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
  t: TranslationType
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
  t,
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
            {t.game.title}
          </h1>
          <p
            className="text-xl mb-6 font-monaco"
            dangerouslySetInnerHTML={{ __html: t.messages.startInstruction }}
          ></p>
          <button onClick={handleLocalStartGame} className="game-button mb-4">
            {t.game.start}
          </button>
          <div className="text-base mt-4 font-monaco">
            <p>{t.controls.move}</p>
            <p>{t.controls.launch}</p>
          </div>
        </div>
      )}

      {gameState === GameState.GAME_OVER && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center bg-game-board bg-opacity-90 text-game-text z-10 p-5">
          <h2 className="text-3xl mb-6 text-game-warning font-chicago">
            {t.messages.gameOver}
          </h2>
          <p className="text-xl mb-6 font-monaco">
            {t.stats.finalScore}: {score.toString().padStart(6, '0')}
          </p>
          <button onClick={handleLocalRestartGame} className="game-button">
            {t.game.restart}
          </button>
        </div>
      )}

      {gameState === GameState.LEVEL_CLEAR && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center bg-game-board bg-opacity-90 text-game-text z-10 p-5">
          <h2 className="text-3xl mb-6 text-game-highlight font-chicago">
            {t.messages.levelComplete.replace('{level}', level.toString())}
          </h2>
          <p
            className="text-xl mb-6 font-monaco"
            dangerouslySetInnerHTML={{
              __html: t.messages.nextLevelInstruction,
            }}
          ></p>
          <button onClick={handleLocalStartGame} className="game-button">
            {t.game.nextLevel}
          </button>
        </div>
      )}
    </div>
  )
}

export default GameBoard
