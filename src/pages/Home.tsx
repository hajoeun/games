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
]

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Header>
        <Title>브라우저 아케이드</Title>
        <SubTitle>다양한 브라우저 게임을 즐겨보세요!</SubTitle>
      </Header>

      <GamesGrid>
        {games.map((game) => (
          <GameCard key={game.id}>
            <Link to={game.path}>
              <GameImage imageUrl={game.imageUrl} fallbackColor="#2a6db8" />
              <GameTitle>{game.title}</GameTitle>
              <GameDescription>{game.description}</GameDescription>
            </Link>
          </GameCard>
        ))}
      </GamesGrid>
    </HomeContainer>
  )
}

const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
`

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: #aaaaaa;
`

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`

const GameCard = styled.div`
  border-radius: 10px;
  overflow: hidden;
  background-color: #2c2c2c;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
`

interface GameImageProps {
  imageUrl: string
  fallbackColor: string
}

const GameImage = styled.div<GameImageProps>`
  height: 160px;
  background-image: ${(props) => `url(${props.imageUrl})`};
  background-color: ${(props) => props.fallbackColor};
  background-size: cover;
  background-position: center;
`

const GameTitle = styled.h2`
  padding: 1rem 1rem 0.5rem;
  font-size: 1.5rem;
  color: #ffffff;
`

const GameDescription = styled.p`
  padding: 0 1rem 1rem;
  color: #cccccc;
  font-size: 0.9rem;
`

export default Home
