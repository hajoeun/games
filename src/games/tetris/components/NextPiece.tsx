import React from 'react'
import { Tetromino } from '../types'
import { TETROMINO_COLORS } from '../constants'

interface NextPieceProps {
  nextPiece: Tetromino | null
}

const NextPiece: React.FC<NextPieceProps> = ({ nextPiece }) => {
  if (!nextPiece) {
    return (
      <div className="w-[150px] bg-[#1a1a1a] border-2 border-[#333] p-[10px] flex flex-col items-center" />
    )
  }

  const { shape, type } = nextPiece
  const color = TETROMINO_COLORS[type]

  return (
    <div className="w-[150px] bg-[#1a1a1a] border-2 border-[#333] p-[10px] flex flex-col items-center">
      <h3 className="m-0 mb-[10px] text-white text-[1.2rem]">다음 블록</h3>
      <div className="flex flex-col items-center justify-center h-[100px]">
        {shape.map((row, y) => (
          <div className="flex" key={y}>
            {row.map((cell, x) => (
              <div
                key={x}
                className="w-[25px] h-[25px] border border-[#222]"
                style={{
                  backgroundColor: cell !== 0 ? color : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default NextPiece
