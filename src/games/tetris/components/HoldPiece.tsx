import React from 'react'
import styled from 'styled-components'
import { Tetromino } from '../types'
import { TETROMINO_COLORS } from '../constants'

interface HoldPieceProps {
  holdPiece: Tetromino | null
}

const HoldPiece: React.FC<HoldPieceProps> = ({ holdPiece }) => {
  return (
    <Container>
      <Title>홀드</Title>
      <PiecePreview>
        {holdPiece ? (
          holdPiece.shape.map((row, y) => (
            <Row key={y}>
              {row.map((cell, x) => (
                <Cell
                  key={x}
                  filled={cell !== 0}
                  color={TETROMINO_COLORS[holdPiece.type]}
                />
              ))}
            </Row>
          ))
        ) : (
          <EmptyText data-testid="hold-empty">비어 있음</EmptyText>
        )}
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

const EmptyText = styled.div`
  color: #666;
  font-size: 1rem;
`

export default HoldPiece
