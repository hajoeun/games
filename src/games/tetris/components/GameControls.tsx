import React from 'react'
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
    <div className="w-[150px] bg-[#1a1a1a] border-2 border-[#333] p-[10px] flex flex-col gap-[10px]">
      <h3 className="m-0 mb-[10px] text-white text-[1.2rem] text-center">
        게임 조작
      </h3>

      <div className="flex gap-[5px] justify-center">
        <button
          className="p-[8px] bg-[#333] text-white border border-[#444] rounded hover:bg-[#444] active:bg-[#555] min-w-[60px]"
          onClick={() => onMove(-1)}
        >
          ←
        </button>
        <button
          className="p-[8px] bg-[#333] text-white border border-[#444] rounded hover:bg-[#444] active:bg-[#555] min-w-[60px]"
          onClick={() => onMove(1)}
        >
          →
        </button>
      </div>

      <div className="flex gap-[5px] justify-center">
        <button
          className="p-[8px] bg-[#333] text-white border border-[#444] rounded hover:bg-[#444] active:bg-[#555] min-w-[60px]"
          onClick={onRotate}
        >
          회전
        </button>
        <button
          className="p-[8px] bg-[#333] text-white border border-[#444] rounded hover:bg-[#444] active:bg-[#555] min-w-[60px]"
          onClick={onDrop}
        >
          드롭
        </button>
      </div>

      <div className="flex gap-[5px] justify-center">
        <button
          className="p-[8px] bg-[#333] text-white border border-[#444] rounded hover:bg-[#444] active:bg-[#555] min-w-[60px]"
          onClick={onHold}
        >
          홀드
        </button>
        <button
          className="p-[8px] bg-[#333] text-white border border-[#444] rounded hover:bg-[#444] active:bg-[#555] min-w-[60px]"
          onClick={onPause}
        >
          {gameStatus === GameStatus.PLAYING ? '일시정지' : '계속하기'}
        </button>
      </div>

      <button
        className="p-[8px] bg-[#333] text-white border border-[#444] rounded hover:bg-[#444] active:bg-[#555] flex-1"
        onClick={onRestart}
      >
        다시 시작
      </button>
    </div>
  )
}

export default GameControls
