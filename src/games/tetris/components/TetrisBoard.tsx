import React from 'react'
import styled from 'styled-components'
import { Board, Tetromino } from '../types'
import { TETROMINO_COLORS } from '../constants'

interface TetrisBoardProps {
  board: Board
  currentPiece: Tetromino | null
  ghostPosition: number
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({
  board,
  currentPiece,
  ghostPosition,
}) => {
  // 현재 조각의 위치에 셀을 렌더링할지 확인
  const isActiveTetromino = (x: number, y: number) => {
    if (!currentPiece) return false

    const { shape, position } = currentPiece
    const tetrominoX = x - position.x
    const tetrominoY = y - position.y

    if (
      tetrominoX >= 0 &&
      tetrominoX < shape[0].length &&
      tetrominoY >= 0 &&
      tetrominoY < shape.length
    ) {
      return shape[tetrominoY][tetrominoX] !== 0
    }

    return false
  }

  // 고스트 조각(미리보기)을 렌더링할지 확인
  const isGhostTetromino = (x: number, y: number) => {
    if (!currentPiece || ghostPosition === 0) return false

    const { shape, position } = currentPiece
    const ghostY = position.y + ghostPosition
    const tetrominoX = x - position.x
    const tetrominoY = y - ghostY

    if (
      tetrominoX >= 0 &&
      tetrominoX < shape[0].length &&
      tetrominoY >= 0 &&
      tetrominoY < shape.length
    ) {
      return shape[tetrominoY][tetrominoX] !== 0
    }

    return false
  }

  return (
    <BoardContainer data-testid="tetris-board">
      {board.map((row, y) => (
        <Row key={y}>
          {row.map((cell, x) => {
            const isActive = isActiveTetromino(x, y)
            const isGhost = isGhostTetromino(x, y)

            return (
              <Cell
                key={x}
                filled={cell.filled || isActive}
                color={
                  isActive
                    ? TETROMINO_COLORS[currentPiece!.type]
                    : isGhost
                    ? TETROMINO_COLORS.ghost
                    : cell.color
                }
              />
            )
          })}
        </Row>
      ))}
    </BoardContainer>
  )
}

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid #333;
  background-color: #000;
  padding: 2px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
`

const Row = styled.div`
  display: flex;
`

interface CellProps {
  filled: boolean
  color: string
}

const Cell = styled.div<CellProps>`
  width: 30px;
  height: 30px;
  border: 1px solid #222;
  background-color: ${(props) => (props.filled ? props.color : 'transparent')};

  @media (max-width: 768px) {
    width: 25px;
    height: 25px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
  }
`

export default TetrisBoard
