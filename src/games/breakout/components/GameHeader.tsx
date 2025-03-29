import React from 'react'
import styled from 'styled-components'

interface GameHeaderProps {
  score: number
  lives: number
  level: number
}

const GameHeader: React.FC<GameHeaderProps> = ({ score, lives, level }) => {
  // 생명 아이콘 표시를 위한 도우미 함수
  const renderLivesIcons = () => {
    const icons = []
    for (let i = 0; i < lives; i++) {
      icons.push(<LifeIcon key={i} />)
    }
    return icons
  }

  return (
    <GameHeaderContainer>
      <ScoreSection>
        <ScoreLabel>점수:</ScoreLabel>
        <ScoreDisplay>{score.toString().padStart(6, '0')}</ScoreDisplay>
      </ScoreSection>
      <MultiplierDisplay>MULTIPLIER 1</MultiplierDisplay>
      <InfoSection>
        <LevelDisplay>레벨: {level}</LevelDisplay>
        <LivesContainer>{renderLivesIcons()}</LivesContainer>
      </InfoSection>
    </GameHeaderContainer>
  )
}

const GameHeaderContainer = styled.div`
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
  font-size: 0.9rem;
  margin-right: 10px;
`

const ScoreDisplay = styled.div`
  font-size: 1.2rem;
  color: #33ccff;
  text-shadow: 0 0 8px #0088ff;
`

const MultiplierDisplay = styled.div`
  font-size: 0.9rem;
  color: #ffcc33;
  text-shadow: 0 0 8px #ff8800;
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const LevelDisplay = styled.div`
  font-size: 0.9rem;
  margin-bottom: 5px;
`

const LivesContainer = styled.div`
  display: flex;
  gap: 5px;
`

const LifeIcon = styled.div`
  width: 15px;
  height: 15px;
  background: radial-gradient(circle at 30% 30%, #ffdd33, #ff6600);
  border-radius: 50%;
  box-shadow: 0 0 6px #ff8800;
`

export default GameHeader
