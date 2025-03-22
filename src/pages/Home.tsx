import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

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
]

const Home: React.FC = () => {
  return (
    <SpaceBackground>
      <HomeContainer>
        <Header>
          <Title>클래식 게임 아케이드</Title>
          <SubTitle>리액트로 구현한 클래식 게임 모음</SubTitle>
        </Header>

        <GamesGrid>
          <GameCard>
            <Link to="/games/breakout">
              <GameThumbnail>
                <img
                  src="/images/breakout-thumbnail.png"
                  alt="벽돌깨기 게임 이미지"
                />
              </GameThumbnail>
              <GameTitle>벽돌깨기</GameTitle>
              <GameDescription>
                패들을 움직여 모든 벽돌을 부수는 클래식 게임
              </GameDescription>
            </Link>
          </GameCard>

          <GameCard>
            <Link to="/games/tetris">
              <GameThumbnail>
                <img
                  src="/images/tetris-thumbnail.png"
                  alt="테트리스 게임 이미지"
                />
              </GameThumbnail>
              <GameTitle>테트리스</GameTitle>
              <GameDescription>
                떨어지는 블록을 회전하고 쌓아 줄을 완성하는 게임
              </GameDescription>
            </Link>
          </GameCard>

          {/* 추가 게임 카드 */}
        </GamesGrid>
      </HomeContainer>
    </SpaceBackground>
  )
}

// 배경 스타일 (우주 배경)
const SpaceBackground = styled.div`
  background: linear-gradient(to bottom, #000033, #000022);
  background-size: cover;
  min-height: 100vh;
  width: 100%;
  padding: 40px 20px;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.2) 1px,
      transparent 1px
    );
    background-size: 50px 50px;
    z-index: 0;
  }
`

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 50px;
  padding: 20px;
  background: rgba(20, 20, 40, 0.7);
  border-radius: 10px;
  border: 2px solid #444488;
  box-shadow: 0 0 20px rgba(0, 100, 255, 0.3);
`

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
  color: #ffffff;
  text-shadow: 0 0 15px #5555ff, 0 0 25px #5555ff;
  letter-spacing: 2px;
  font-family: 'Press Start 2P', 'Courier New', monospace;
`

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: #aaaaff;
  text-shadow: 0 0 8px #3333cc;
  font-family: 'Press Start 2P', 'Courier New', monospace;
`

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`

const GameCard = styled.div`
  border-radius: 10px;
  overflow: hidden;
  background: rgba(20, 20, 40, 0.7);
  border: 2px solid #444488;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 100, 255, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 150, 255, 0.5);
  }

  a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
`

const GameThumbnail = styled.div`
  height: 200px;
  background-color: #000022;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(to bottom, rgba(0, 0, 40, 0.6), transparent);
    z-index: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;

    ${GameCard}:hover & {
      transform: scale(1.05);
    }
  }
`

const GameTitle = styled.h2`
  font-size: 1.5rem;
  margin: 15px;
  text-align: center;
  color: #ffffff;
  text-shadow: 0 0 8px #5555ff;
  font-family: 'Press Start 2P', 'Courier New', monospace;
`

const GameDescription = styled.p`
  font-size: 1rem;
  color: #aaaaff;
  margin: 0 15px 15px;
  text-align: center;
  line-height: 1.5;
`

export default Home
