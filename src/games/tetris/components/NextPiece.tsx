import React from 'react'
import { Tetromino } from '../types'
import { TETROMINO_COLORS } from '../constants'

interface NextPieceProps {
  piece: Tetromino | null
}

const NextPiece: React.FC<NextPieceProps> = ({ piece }) => {
  if (!piece) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[120px]">
        <div className="text-game-text text-center">로딩 중...</div>
      </div>
    )
  }

  const { shape, type } = piece
  const color = TETROMINO_COLORS[type]

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[120px]">
      {shape.map((row, y) => (
        <div className="flex" key={y}>
          {row.map((cell, x) => (
            <div
              key={x}
              className="w-[25px] h-[25px] sm:w-[20px] sm:h-[20px] border border-[#222]"
              style={{
                backgroundColor: cell !== 0 ? color : 'transparent',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default NextPiece
