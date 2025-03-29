import React from 'react'
import { Tetromino } from '../types'
import { TETROMINO_COLORS } from '../constants'

interface HoldPieceProps {
  piece: Tetromino | null
  hasUsed?: boolean
}

const HoldPiece: React.FC<HoldPieceProps> = ({ piece, hasUsed = false }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[120px]">
      {piece ? (
        <div className={`${hasUsed ? 'opacity-50' : ''}`}>
          {piece.shape.map((row, y) => (
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
          ))}
        </div>
      ) : (
        <div className="text-game-text text-center" data-testid="hold-empty">
          비어 있음
        </div>
      )}
    </div>
  )
}

export default HoldPiece
