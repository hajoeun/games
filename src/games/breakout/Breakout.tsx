import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GameState } from './types'
import GameBoard from './components/GameBoard'
import GameHeader from './components/GameHeader'
import { useTranslation, Language } from './i18n/index'
import { Helmet } from 'react-helmet-async'

const Breakout: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ko')
  const t = useTranslation(language)

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
      <Helmet>
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
      </Helmet>

      <div className="container mx-auto max-w-5xl">
        <div className="classic-window">
          <div className="classic-title-bar">
            <div className="title">{t.game.title}</div>
          </div>

          <div className="p-4">
            <div className="flex flex-col items-center">
              {/* 언어 선택 */}
              <div className="absolute top-4 right-4 z-10">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="classic-select px-2 py-1 font-geneva-9"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                  <option value="es">Español</option>
                </select>
              </div>

              {/* 게임 정보 헤더 */}
              <div className="flex justify-between w-full max-w-[800px] mb-4">
                <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
                  <div className="text-sm text-game-text">{t.stats.score}</div>
                  <div className="font-bold text-xl text-game-text">
                    {score}
                  </div>
                </div>

                <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
                  <div className="text-sm text-game-text">{t.stats.level}</div>
                  <div className="font-bold text-xl text-game-text">
                    {level}
                  </div>
                </div>

                <div className="bg-classic-secondary border-classic-secondary border-2 p-2 min-w-24 text-center">
                  <div className="text-sm text-game-text">{t.stats.lives}</div>
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
                  t={t}
                />
              </div>

              {/* 게임 설명 */}
              <div className="mt-4 text-center max-w-[800px]">
                <div className="classic-dialog">
                  <h3 className="text-base font-chicago mb-2">
                    {t.controls.title}
                  </h3>
                  <p className="text-sm font-monaco mb-1">{t.controls.move}</p>
                  <p className="text-sm font-monaco mb-1">
                    {t.controls.launch}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 홈으로 이동 버튼 */}
        <div className="mt-4 text-center">
          <Link to="/" className="classic-button inline-block">
            {t.buttons.home}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Breakout
