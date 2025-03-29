import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
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
    <SpaceBackground>
      <BreakoutContainer tabIndex={0} onKeyDown={handleKeyDown}>
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
      </BreakoutContainer>
    </SpaceBackground>
  )
}

// 배경 스타일 (우주 배경)
const SpaceBackground = styled.div`
  background: linear-gradient(to bottom, #000033, #000022);
  background-size: cover;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.2) 1px,
      transparent 1px
    );
    background-size: 50px 50px;
    z-index: 0;
  }
`

const BreakoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  outline: none;
  color: #ffffff;
  font-family: 'Press Start 2P', 'Courier New', monospace;
  position: relative;
  z-index: 1;
`

export default Breakout
