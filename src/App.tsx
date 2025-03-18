import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import Home from './pages/Home'
import Tetris from './games/tetris/Tetris'

const App: React.FC = () => {
  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games/tetris" element={<Tetris />} />
        </Routes>
      </Router>
    </AppContainer>
  )
}

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

export default App
