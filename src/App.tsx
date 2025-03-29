import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import Home from './pages/Home'
import Tetris from './games/tetris/Tetris'
import Breakout from './games/breakout/Breakout'

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <div className="w-full min-h-screen flex flex-col">
        <Helmet>
          <title>브라우저 아케이드 - 무료 온라인 게임</title>
          <meta
            name="description"
            content="다양한 무료 브라우저 게임을 즐겨보세요. 테트리스 등 클래식 게임부터 최신 게임까지 제공합니다."
          />
          <meta
            name="keywords"
            content="브라우저 게임, 온라인 게임, 무료 게임, 테트리스, 아케이드 게임"
          />

          {/* Open Graph 메타 태그 */}
          <meta
            property="og:title"
            content="브라우저 아케이드 - 무료 온라인 게임"
          />
          <meta
            property="og:description"
            content="다양한 무료 브라우저 게임을 즐겨보세요. 테트리스 등 클래식 게임부터 최신 게임까지 제공합니다."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://game.hajoeun.com" />
          <meta
            property="og:image"
            content="https://game.hajoeun.com/images/og-image.png"
          />
          <meta
            property="og:logo"
            content="https://game.hajoeun.com/images/logo.png"
          />

          {/* Twitter Card 메타 태그 */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="브라우저 아케이드 - 무료 온라인 게임"
          />
          <meta
            name="twitter:description"
            content="다양한 무료 브라우저 게임을 즐겨보세요. 테트리스 등 클래식 게임부터 최신 게임까지 제공합니다."
          />
          <meta
            name="twitter:image"
            content="https://game.hajoeun.com/images/og-image.png"
          />

          {/* 추가 메타 태그 */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="robots" content="index, follow" />
          <meta name="language" content="ko" />
          <link rel="canonical" href="https://game.hajoeun.com" />
        </Helmet>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games/tetris" element={<Tetris />} />
            <Route path="/games/breakout" element={<Breakout />} />
          </Routes>
        </Router>
      </div>
    </HelmetProvider>
  )
}

export default App
