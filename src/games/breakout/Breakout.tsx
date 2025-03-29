import React, { useEffect, useState } from 'react'
import { GameState } from './types'
import GameBoard from './components/GameBoard'
import GameHeader from './components/GameHeader'

const Breakout: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        // 키보드 이벤트는 GameBoard 컴포넌트에서 처리됩니다.
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 키보드 이벤트는 GameBoard 컴포넌트에서 처리됩니다.
  }

  const handleStartGame = () => {
    // 게임 시작은 GameBoard 컴포넌트에서 처리됩니다.
  }

  const handleRestartGame = () => {
    // 게임 재시작은 GameBoard 컴포넌트에서 처리됩니다.
  }

  return (
    <div className="bg-gradient-to-b from-[#000033] to-[#000022] bg-cover min-h-screen w-full flex justify-center items-center overflow-hidden relative before:content-[''] before:absolute before:w-full before:h-full before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)] before:bg-[length:50px_50px] before:z-0">
      <div
        className="flex flex-col items-center w-full max-w-[800px] mx-auto p-5 outline-none text-white font-['Press_Start_2P','Courier_New',monospace] relative z-[1]"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <GameHeader score={score} lives={lives} level={level} />

        <GameBoard
          onScoreChange={setScore}
          onLivesChange={setLives}
          onGameStateChange={setGameState}
          onLevelChange={setLevel}
          handleKeyDown={handleKeyDown}
          gameState={gameState}
          level={level}
          score={score}
          onStartGame={handleStartGame}
          onRestartGame={handleRestartGame}
        />
      </div>
    </div>
  )
}

export default Breakout
