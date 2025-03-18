import React from 'react'
import styled from 'styled-components'
import { GameStats, GameStatus } from '../types'

interface PlayerStats {
  highScore: number
  highLevel: number
  totalLines: number
  gamesPlayed: number
  lastPlayed: string | null
}

interface GameInfoProps {
  gameStats: GameStats
  playerStats: PlayerStats
  gameStatus: GameStatus
}

const GameInfo = ({
  gameStats,
  playerStats,
  gameStatus,
}: GameInfoProps): React.ReactElement => {
  return (
    <Container>
      <Title>게임 정보</Title>

      <InfoItem>
        <Label>점수:</Label>
        <Value data-testid="score">{gameStats.score}</Value>
      </InfoItem>

      <InfoItem>
        <Label>레벨:</Label>
        <Value data-testid="level">{gameStats.level}</Value>
      </InfoItem>

      <InfoItem>
        <Label>라인:</Label>
        <Value data-testid="lines">{gameStats.lines}</Value>
      </InfoItem>

      <InfoItem>
        <Label>테트리스:</Label>
        <Value>{gameStats.tetris}</Value>
      </InfoItem>

      <Divider />

      <InfoItem>
        <Label>최고 점수:</Label>
        <Value>{playerStats.highScore}</Value>
      </InfoItem>

      <InfoItem>
        <Label>최고 레벨:</Label>
        <Value>{playerStats.highLevel}</Value>
      </InfoItem>

      <InfoItem>
        <Label>총 라인:</Label>
        <Value>{playerStats.totalLines}</Value>
      </InfoItem>

      <InfoItem>
        <Label>게임 수:</Label>
        <Value>{playerStats.gamesPlayed}</Value>
      </InfoItem>

      <Divider />

      <Controls>
        <ControlItem>↑: 회전</ControlItem>
        <ControlItem>←↓→: 이동</ControlItem>
        <ControlItem>스페이스: 하드 드롭</ControlItem>
        <ControlItem>Shift: 홀드</ControlItem>
        <ControlItem>P: 일시정지</ControlItem>
        <ControlItem>R: 재시작</ControlItem>
      </Controls>
    </Container>
  )
}

const Container = styled.div`
  width: 150px;
  background-color: #1a1a1a;
  border: 2px solid #333;
  padding: 10px;
  display: flex;
  flex-direction: column;
`

const Title = styled.h3`
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 1.2rem;
  text-align: center;
`

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`

const Label = styled.span`
  color: #aaa;
  font-size: 0.9rem;
`

const Value = styled.span`
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #333;
  margin: 10px 0;
`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
`

const ControlItem = styled.div`
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 3px;
`

export default GameInfo
