import React from 'react'
import { Tetromino } from '../types'
import { TETROMINO_COLORS } from '../constants'

interface HoldPieceProps {
  piece: Tetromino | null
}

const HoldPiece: React.FC<HoldPieceProps> = ({ piece }) => {
  return (
    <div className="w-[150px] md:w-[130px] sm:w-[110px] bg-[#1a1a1a] border-2 border-[#333] p-[10px] sm:p-[5px] flex flex-col items-center">
      <h3 className="m-0 mb-[10px] sm:mb-[5px] text-white text-[1.2rem] sm:text-[1rem]">
        홀드
      </h3>
      <div className="flex flex-col items-center justify-center h-[100px] sm:h-[80px]">
        {piece ? (
          piece.shape.map((row, y) => (
            <div className="flex" key={y}>
              {row.map((cell, x) => (
                <div
                  key={x}
                  className="w-[25px] h-[25px] sm:w-[20px] sm:h-[20px] border border-[#222]"
                  style={{
                    backgroundColor:
                      cell !== 0 ? TETROMINO_COLORS[piece.type] : 'transparent',
                  }}
                />
              ))}
            </div>
          ))
        ) : (
          <div
            className="text-[#666] text-[1rem] sm:text-[0.8rem]"
            data-testid="hold-empty"
          >
            비어 있음
          </div>
        )}
      </div>
    </div>
  )
}

export default HoldPiece
