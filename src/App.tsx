import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import Home from './pages/Home'
import Tetris from './games/tetris/Tetris'
import Breakout from './games/breakout/Breakout'
import Game2048 from './games/2048/Game2048'

// 클래식 맥 OS 스타일 레이아웃 컴포넌트
const ClassicMacLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {children}
    </div>
  )
}

// 레트로 게임 글로벌 레이아웃 컴포넌트
const RetroLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-retro-bg-primary min-h-screen w-full overflow-hidden relative">
      {children}
    </div>
  )
}

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Free Online Classic Games - Browser Arcade</title>
        <meta
          name="description"
          content="Play free online classic games including Tetris, Breakout, and 2048. Enjoy retro arcade games directly in your browser without download."
        />
        <meta
          name="keywords"
          content="free online games, classic games, tetris online, arcade games, browser games, retro games, 2048 game, breakout game, free arcade games"
        />
        <meta
          property="og:title"
          content="Free Online Classic Games - Browser Arcade"
        />
        <meta
          property="og:description"
          content="Play free online classic games including Tetris, Breakout, and 2048. Enjoy retro arcade games directly in your browser without download."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://game.hajoeun.com" />
        <meta
          property="og:site_name"
          content="Free Online Classic Games - Browser Arcade"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Free Online Classic Games - Browser Arcade"
        />
        <meta
          name="twitter:description"
          content="Play free online classic games including Tetris, Breakout, and 2048. Enjoy retro arcade games directly in your browser without download."
        />
        <meta name="twitter:site" content="@hajoeun" />
        <meta name="twitter:creator" content="@hajoeun" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="ko" />
        <link rel="canonical" href="https://game.hajoeun.com" />

        {/* 픽셀 폰트 추가 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ClassicMacLayout>
                <Home />
              </ClassicMacLayout>
            }
          />
          <Route
            path="/games/tetris"
            element={
              <RetroLayout>
                <Tetris />
              </RetroLayout>
            }
          />
          <Route
            path="/games/breakout"
            element={
              <RetroLayout>
                <Breakout />
              </RetroLayout>
            }
          />
          <Route
            path="/games/2048"
            element={
              <ClassicMacLayout>
                <Game2048 />
              </ClassicMacLayout>
            }
          />
        </Routes>
      </Router>
    </HelmetProvider>
  )
}

export default App
