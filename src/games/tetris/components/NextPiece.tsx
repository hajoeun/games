import React from 'react'
import styled from 'styled-components'
import { Tetromino } from '../types'
import { TETROMINO_COLORS } from '../constants'

interface NextPieceProps {
  nextPiece: Tetromino | null
}

const NextPiece: React.FC<NextPieceProps> = ({ nextPiece }) => {
  if (!nextPiece) {
    return <Container />
  }

  const { shape, type } = nextPiece
  const color = TETROMINO_COLORS[type]

  return (
    <Container>
      <Title>다음 블록</Title>
      <PiecePreview>
        {shape.map((row, y) => (
          <Row key={y}>
            {row.map((cell, x) => (
              <Cell key={x} filled={cell !== 0} color={color} />
            ))}
          </Row>
        ))}
      </PiecePreview>
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
  align-items: center;
`

const Title = styled.h3`
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 1.2rem;
`

const PiecePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
`

const Row = styled.div`
  display: flex;
`

interface CellProps {
  filled: boolean
  color: string
}

const Cell = styled.div<CellProps>`
  width: 25px;
  height: 25px;
  border: 1px solid #222;
  background-color: ${(props) => (props.filled ? props.color : 'transparent')};
`

export default NextPiece
