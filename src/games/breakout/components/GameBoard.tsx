import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
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
    <CanvasContainer>
      <GameCanvas
        ref={canvasRef}
        width={800}
        height={600}
        tabIndex={0}
        onKeyDown={handleLocalKeyDown}
      />

      {gameState === GameState.START && (
        <GameOverlay>
          <GameTitle>BREAKOUT</GameTitle>
          <StartInstructions>
            시작하려면 스페이스 바를 누르거나
            <br />
            아래 버튼을 클릭하세요
          </StartInstructions>
          <RetroButton onClick={handleLocalStartGame}>게임 시작</RetroButton>
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
          <RetroButton onClick={handleLocalRestartGame}>다시 시작</RetroButton>
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
          <RetroButton onClick={handleLocalStartGame}>다음 레벨</RetroButton>
        </GameOverlay>
      )}
    </CanvasContainer>
  )
}

// 스타일 컴포넌트 정의
const CanvasContainer = styled.div`
  position: relative;
  width: 800px;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 100, 255, 0.5);
`

const GameCanvas = styled.canvas`
  display: block;
  background-color: #000033;
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
  background: rgba(0, 0, 40, 0.8);
  color: #ffffff;
  z-index: 10;
  padding: 20px;
  text-align: center;
`

const GameTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 40px;
  color: #00ffff;
  text-shadow: 0 0 15px #00aaff, 0 0 25px #0088ff;
  letter-spacing: 3px;
`

const GameOverText = styled.h2`
  font-size: 3rem;
  margin-bottom: 30px;
  color: #ff3333;
  text-shadow: 0 0 15px #ff0000, 0 0 25px #aa0000;
  letter-spacing: 3px;
`

const LevelClearText = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #33ff33;
  text-shadow: 0 0 15px #00ff00, 0 0 25px #00aa00;
  letter-spacing: 2px;
`

const StartInstructions = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.8;
`

const ClearInstructions = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.8;
`

const FinalScore = styled.p`
  font-size: 1.5rem;
  margin-bottom: 30px;
`

const RetroButton = styled.button`
  background: linear-gradient(to bottom, #4466ff, #0033cc);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-family: inherit;
  border-radius: 5px;
  cursor: pointer;
  margin: 20px 0;
  box-shadow: 0 0 15px rgba(0, 100, 255, 0.7);
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(to bottom, #5577ff, #1144dd);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`

const ControlInstructions = styled.div`
  margin-top: 20px;
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.6;
`

export default GameBoard
