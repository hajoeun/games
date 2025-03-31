import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Language, getDefaultLanguage, useTranslation } from '../i18n'

interface GameInfo {
  id: string
  title: string
  description: string
  path: string
  imageUrl: string
}

const games: GameInfo[] = [
  {
    id: 'tetris',
    title: '테트리스',
    description: '클래식 테트리스 게임입니다. 블록을 쌓아 줄을 완성하세요!',
    path: '/games/tetris',
    imageUrl: '/images/tetris-thumbnail.png',
  },
  {
    id: 'breakout',
    title: '벽돌깨기',
    description: '클래식 벽돌깨기 게임입니다. 공을 튕겨 모든 벽돌을 부수세요!',
    path: '/games/breakout',
    imageUrl: '/images/breakout-thumbnail.png',
  },
  {
    id: '2048',
    title: '2048',
    description: '같은 숫자 타일을 밀어 합쳐 2048을 만드는 퍼즐 게임입니다!',
    path: '/games/2048',
    imageUrl: '/images/2048-thumbnail.png',
  },
]

const Home: React.FC = () => {
  const [language, setLanguage] = useState<Language>(getDefaultLanguage())
  const t = useTranslation(language)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  return (
    <div className="min-h-screen w-full py-8 px-5 overflow-hidden relative">
      <div className="max-w-[1200px] mx-auto relative">
        {/* 언어 선택 */}
        <div className="absolute top-0 right-0 z-10">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="classic-select px-2 py-1 font-geneva-9"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="zh">中文</option>
            <option value="es">Español</option>
          </select>
        </div>

        {/* 클래식 메뉴바 */}
        <div className="classic-menu-bar mb-4">
          <div className="menu-item">🍎</div>
          <div className="menu-item">{t.menu.file}</div>
          <div className="menu-item">{t.menu.edit}</div>
          <div className="menu-item">{t.menu.view}</div>
          <div className="menu-item">{t.menu.special}</div>
          <div className="menu-item">{t.menu.help}</div>
        </div>

        {/* 메인 창 */}
        <div className="classic-window mb-8">
          <div className="classic-title-bar">
            <div className="title">{t.main.title}</div>
          </div>
          <div className="p-4 text-center">
            <h1 className="text-2xl mb-2 font-chicago">{t.main.title}</h1>
            <p className="text-base font-geneva-9 mb-4">{t.main.subtitle}</p>
          </div>
        </div>

        {/* 게임 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link key={game.id} to={game.path} className="block">
              <div className="classic-window h-full">
                <div className="classic-title-bar">
                  <div className="title">{t.games[game.id].title}</div>
                </div>
                <div className="p-3">
                  <div className="bg-classic-secondary p-0.5 mb-3">
                    <img
                      src={game.imageUrl}
                      alt={`${t.games[game.id].title} ${
                        t.games[game.id].description
                      }`}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <p className="font-monaco text-sm mb-3 min-h-[3em]">
                    {t.games[game.id].description}
                  </p>
                  <div className="text-center">
                    <button className="classic-button-default">
                      {t.button.play}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-8 text-center text-classic-secondary text-xs font-monaco">
          <p>{t.footer.copyright}</p>
        </footer>
      </div>
    </div>
  )
}

export default Home
