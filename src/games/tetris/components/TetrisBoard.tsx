import React from 'react'
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
    <div
      className="flex flex-col border-2 border-classic-secondary bg-game-board p-0.5 touch-none mx-auto"
      data-testid="tetris-board"
    >
      {board.map((row, y) => (
        <div className="flex" key={y}>
          {row.map((cell, x) => {
            const isActive = isActiveTetromino(x, y)
            const isGhost = isGhostTetromino(x, y)
            const cellColor = isActive
              ? TETROMINO_COLORS[currentPiece!.type]
              : isGhost
              ? TETROMINO_COLORS.ghost
              : cell.color
            const isFilled = cell.filled || isActive

            return (
              <div
                key={x}
                className={`
                  w-[30px] h-[30px] 
                  border border-[#222] 
                  md:w-[25px] md:h-[25px] 
                  sm:w-[28px] sm:h-[28px]
                  xs:w-[30px] xs:h-[30px]
                  2xs:w-[26px] 2xs:h-[26px]
                  3xs:w-[22px] 3xs:h-[22px]
                `}
                style={{
                  backgroundColor: isFilled ? cellColor : 'transparent',
                  boxShadow: isFilled
                    ? 'inset 2px 2px 2px rgba(255,255,255,0.2), inset -2px -2px 2px rgba(0,0,0,0.2)'
                    : 'none',
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default TetrisBoard
