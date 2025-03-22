import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { BreakoutGameEngine } from './BreakoutGameEngine'
import { GameState } from './types'

const Breakout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameEngine, setGameEngine] = useState<BreakoutGameEngine | null>(null)
  const [gameState, setGameState] = useState<GameState>(GameState.START)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameEngine) {
        if (gameState !== GameState.PLAYING) {
          gameEngine.startGame()
        } else if (gameState === GameState.PLAYING) {
          gameEngine.launchBall()
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [gameEngine, gameState])

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new BreakoutGameEngine(canvasRef.current, {
        onScoreChange: setScore,
        onLivesChange: setLives,
        onGameStateChange: setGameState,
        onLevelChange: setLevel,
      })
      setGameEngine(engine)

      return () => {
        engine.stopGame()
      }
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameEngine) {
      if (e.key === ' ' && gameState !== GameState.PLAYING) {
        gameEngine.startGame()
      } else if (e.key === ' ' && gameState === GameState.PLAYING) {
        gameEngine.launchBall()
      } else {
        gameEngine.handleKeyDown(e.key)
      }
    }
  }

  const handleStartGame = () => {
    if (gameEngine && gameState !== GameState.PLAYING) {
      gameEngine.startGame()
    }
  }

  const handleRestartGame = () => {
    if (gameEngine) {
      gameEngine.resetGame()
    }
  }

  // 생명 아이콘 표시를 위한 도우미 함수
  const renderLivesIcons = () => {
    const icons = []
    for (let i = 0; i < lives; i++) {
      icons.push(<LifeIcon key={i} />)
    }
    return icons
  }

  return (
    <SpaceBackground>
      <BreakoutContainer tabIndex={0} onKeyDown={handleKeyDown}>
        <GameHeader>
          <ScoreSection>
            <ScoreLabel>점수:</ScoreLabel>
            <ScoreDisplay>{score.toString().padStart(6, '0')}</ScoreDisplay>
          </ScoreSection>
          <MultiplierDisplay>MULTIPLIER 1</MultiplierDisplay>
          <InfoSection>
            <LevelDisplay>레벨: {level}</LevelDisplay>
            <LivesContainer>{renderLivesIcons()}</LivesContainer>
          </InfoSection>
        </GameHeader>

        <CanvasContainer>
          <GameCanvas ref={canvasRef} width={800} height={600} />

          {gameState === GameState.START && (
            <GameOverlay>
              <GameTitle>BREAKOUT</GameTitle>
              <StartInstructions>
                시작하려면 스페이스 바를 누르거나
                <br />
                아래 버튼을 클릭하세요
              </StartInstructions>
              <RetroButton onClick={handleStartGame}>게임 시작</RetroButton>
              <ControlInstructions>
                <p>← → 키: 패들 좌우 이동</p>
                <p>스페이스 바: 게임 시작/공 발사</p>
              </ControlInstructions>
            </GameOverlay>
          )}

          {gameState === GameState.GAME_OVER && (
            <GameOverlay>
              <GameOverText>GAME OVER</GameOverText>
              <FinalScore>
                최종 점수: {score.toString().padStart(6, '0')}
              </FinalScore>
              <RetroButton onClick={handleRestartGame}>다시 시작</RetroButton>
            </GameOverlay>
          )}

          {gameState === GameState.LEVEL_CLEAR && (
            <GameOverlay>
              <LevelClearText>LEVEL {level} CLEAR!</LevelClearText>
              <ClearInstructions>
                다음 레벨을 시작하려면
                <br />
                스페이스 바를 누르거나
                <br />
                아래 버튼을 클릭하세요
              </ClearInstructions>
              <RetroButton onClick={handleStartGame}>다음 레벨</RetroButton>
            </GameOverlay>
          )}
        </CanvasContainer>
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

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  padding: 15px;
  background: rgba(20, 20, 40, 0.7);
  border: 2px solid #444488;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 100, 255, 0.3);
`

const ScoreSection = styled.div`
  display: flex;
  align-items: center;
`

const ScoreLabel = styled.div`
  font-size: 1rem;
  margin-right: 10px;
  color: #aaaaff;
  text-shadow: 0 0 5px #5555ff;
`

const ScoreDisplay = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 3px;
  text-shadow: 0 0 10px #aaaaff;
  font-family: 'Digital', 'Courier New', monospace;
`

const MultiplierDisplay = styled.div`
  font-size: 1rem;
  color: #ffcc00;
  text-shadow: 0 0 8px #ffaa00;
  letter-spacing: 1px;
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const LevelDisplay = styled.div`
  font-size: 1rem;
  color: #33ff33;
  margin-bottom: 5px;
  text-shadow: 0 0 8px #00aa00;
`

const LivesContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const LifeIcon = styled.div`
  width: 15px;
  height: 15px;
  background: radial-gradient(circle at 30% 30%, #ff5555, #cc0000);
  border-radius: 50%;
  margin-left: 5px;
  box-shadow: 0 0 8px #ff0000;
`

const CanvasContainer = styled.div`
  position: relative;
  width: 800px;
  height: 600px;
  border: 4px solid #444488;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 100, 255, 0.5);
`

const GameCanvas = styled.canvas`
  display: block;
  background-color: transparent;
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
  background: rgba(0, 0, 20, 0.85);
  backdrop-filter: blur(4px);
  color: white;
  text-align: center;
  z-index: 10;
`

const GameTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 2rem;
  color: #ff0000;
  text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000;
  letter-spacing: 5px;
  animation: pulsate 1.5s infinite alternate;

  @keyframes pulsate {
    0% {
      text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000;
    }
    100% {
      text-shadow: 0 0 15px #ff5555, 0 0 25px #ff5555, 0 0 35px #ff5555;
    }
  }
`

const StartInstructions = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.5;
  color: #ccccff;
  text-shadow: 0 0 5px #5555ff;
`

const ControlInstructions = styled.div`
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #aaaaff;

  p {
    margin: 5px 0;
    text-shadow: 0 0 5px #3333cc;
  }
`

const GameOverText = styled.h2`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #ff0000;
  text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
  letter-spacing: 3px;
  animation: shake 0.5s ease-in-out;

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-5px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(5px);
    }
  }
`

const LevelClearText = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #33ff33;
  text-shadow: 0 0 10px #33ff33, 0 0 20px #33ff33;
  letter-spacing: 2px;
  animation: glow 2s infinite alternate;

  @keyframes glow {
    0% {
      text-shadow: 0 0 10px #33ff33, 0 0 20px #33ff33;
    }
    100% {
      text-shadow: 0 0 15px #88ff88, 0 0 25px #88ff88, 0 0 35px #88ff88;
    }
  }
`

const FinalScore = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #ffcc00;
  text-shadow: 0 0 10px #ffaa00;
  letter-spacing: 2px;
`

const ClearInstructions = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.5;
  color: #ccffcc;
  text-shadow: 0 0 5px #00aa00;
`

const RetroButton = styled.button`
  background: linear-gradient(to bottom, #ff5555, #cc0000);
  color: white;
  font-family: 'Press Start 2P', 'Courier New', monospace;
  font-size: 1rem;
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 10px #ff0000, 0 5px 0 #aa0000;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: linear-gradient(to bottom, #ff7777, #dd2222);
    box-shadow: 0 0 15px #ff3333, 0 5px 0 #aa0000;
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 0 15px #ff3333, 0 2px 0 #aa0000;
    transform: translateY(3px);
  }
`

export default Breakout
