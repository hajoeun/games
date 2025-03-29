import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
    <div
      className="min-h-screen w-full py-8 px-4"
      style={{ backgroundColor: '#f0f0f0' }}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="classic-window">
          <div className="classic-title-bar">
            <div className="title">벽돌깨기</div>
          </div>

          <div className="p-4">
            <div className="flex flex-col items-center">
              {/* 게임 정보 헤더 */}
              <div className="flex justify-between w-full max-w-[800px] mb-4">
                <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
                  <div className="text-sm text-game-text">점수</div>
                  <div className="font-bold text-xl text-game-text">
                    {score}
                  </div>
                </div>

                <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
                  <div className="text-sm text-game-text">레벨</div>
                  <div className="font-bold text-xl text-game-text">
                    {level}
                  </div>
                </div>

                <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
                  <div className="text-sm text-game-text">생명</div>
                  <div className="font-bold text-xl text-game-text">
                    {lives}
                  </div>
                </div>
              </div>

              {/* 게임 영역 */}
              <div className="game-area p-0 rounded-md overflow-hidden">
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

              {/* 게임 설명 */}
              <div className="mt-4 text-center max-w-[800px]">
                <div className="classic-dialog">
                  <h3 className="text-base font-chicago mb-2">조작 방법</h3>
                  <p className="text-sm font-monaco mb-1">
                    ← → 키: 패들 좌우 이동
                  </p>
                  <p className="text-sm font-monaco mb-1">
                    스페이스 바: 게임 시작/공 발사
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 홈으로 이동 버튼 */}
        <div className="mt-4 text-center">
          <Link to="/" className="classic-button inline-block">
            홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Breakout
