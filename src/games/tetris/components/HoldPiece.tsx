import React from 'react'
import { Tetromino } from '../types'
import { TETROMINO_COLORS } from '../constants'

interface HoldPieceProps {
  holdPiece: Tetromino | null
}

const HoldPiece: React.FC<HoldPieceProps> = ({ holdPiece }) => {
  return (
    <div className="w-[150px] bg-[#1a1a1a] border-2 border-[#333] p-[10px] flex flex-col items-center">
      <h3 className="m-0 mb-[10px] text-white text-[1.2rem]">홀드</h3>
      <div className="flex flex-col items-center justify-center h-[100px]">
        {holdPiece ? (
          holdPiece.shape.map((row, y) => (
            <div className="flex" key={y}>
              {row.map((cell, x) => (
                <div
                  key={x}
                  className="w-[25px] h-[25px] border border-[#222]"
                  style={{
                    backgroundColor:
                      cell !== 0
                        ? TETROMINO_COLORS[holdPiece.type]
                        : 'transparent',
                  }}
                />
              ))}
            </div>
          ))
        ) : (
          <div className="text-[#666] text-[1rem]" data-testid="hold-empty">
            비어 있음
          </div>
        )}
      </div>
    </div>
  )
}

export default HoldPiece
