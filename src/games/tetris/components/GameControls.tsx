import React from 'react'
import styled from 'styled-components'
import { GameStatus } from '../types'

interface GameControlsProps {
  onMove: (direction: number) => void
  onRotate: () => void
  onDrop: () => void
  onHold: () => void
  onPause: () => void
  onRestart: () => void
  gameStatus: GameStatus
}

const GameControls: React.FC<GameControlsProps> = ({
  onMove,
  onRotate,
  onDrop,
  onHold,
  onPause,
  onRestart,
  gameStatus,
}) => {
  return (
    <Container>
      <Title>게임 조작</Title>

      <ButtonGroup>
        <Button onClick={() => onMove(-1)}>←</Button>
        <Button onClick={() => onMove(1)}>→</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button onClick={onRotate}>회전</Button>
        <Button onClick={onDrop}>드롭</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button onClick={onHold}>홀드</Button>
        <Button onClick={onPause}>
          {gameStatus === GameStatus.PLAYING ? '일시정지' : '계속하기'}
        </Button>
      </ButtonGroup>

      <Button onClick={onRestart} fullWidth>
        다시 시작
      </Button>
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
  gap: 10px;
`

const Title = styled.h3`
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 1.2rem;
  text-align: center;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
`

interface ButtonProps {
  fullWidth?: boolean
}

const Button = styled.button<ButtonProps>`
  padding: 8px;
  background-color: #333;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
  flex: ${(props) => (props.fullWidth ? 1 : 'initial')};
  min-width: 60px;

  &:hover {
    background-color: #444;
  }

  &:active {
    background-color: #555;
  }
`

export default GameControls
