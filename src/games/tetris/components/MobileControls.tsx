import React from 'react'
import { GameStatus } from '../types'

interface MobileControlsProps {
  onMove: (direction: number) => void
  onRotate: () => void
  onDrop: () => void
  onHold: () => void
  onPause: () => void
  onRestart: () => void
  gameStatus?: GameStatus
}

const MobileControls: React.FC<MobileControlsProps> = ({
  onMove,
  onRotate,
  onDrop,
  onHold,
  onPause,
  onRestart,
  gameStatus = GameStatus.PLAYING,
}) => {
  const showHelp = () => {
    // 도움말 모달 표시 (간단한 구현)
    alert(
      '조작 방법\n\n' +
        '좌우로 스와이프: 블록 이동\n' +
        '위로 스와이프: 블록 회전\n' +
        '아래로 스와이프: 하드 드롭\n' +
        '탭: 블록 한 칸 아래로\n' +
        '더블 탭: 홀드'
    )
  }

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      {/* 모바일용 버튼 컨트롤 */}
      <div className="w-full grid grid-cols-3 gap-2">
        <div className="col-span-3 grid grid-cols-3 gap-2">
          <button
            className="col-span-1 p-4 bg-[#333] text-white border border-[#444] rounded-lg active:bg-[#555] text-3xl touch-manipulation flex items-center justify-center"
            onTouchStart={(e) => {
              e.preventDefault()
              onRotate()
            }}
          >
            ↺
          </button>
          <button
            className="col-span-1 p-4 bg-[#333] text-white border border-[#444] rounded-lg active:bg-[#555] text-xl touch-manipulation flex items-center justify-center"
            onTouchStart={(e) => {
              e.preventDefault()
              onHold()
            }}
          >
            홀드
          </button>
          <button
            className="col-span-1 p-4 bg-[#333] text-white border border-[#444] rounded-lg active:bg-[#555] text-3xl touch-manipulation flex items-center justify-center"
            onTouchStart={(e) => {
              e.preventDefault()
              onDrop()
            }}
          >
            ↓↓
          </button>
        </div>

        <div className="col-span-3 grid grid-cols-3 gap-2 mt-2">
          <button
            className="col-span-1 p-4 bg-[#333] text-white border border-[#444] rounded-lg active:bg-[#555] text-3xl touch-manipulation flex items-center justify-center"
            onTouchStart={(e) => {
              e.preventDefault()
              onMove(-1)
            }}
          >
            ←
          </button>
          {gameStatus === GameStatus.GAME_OVER ? (
            <button
              className="col-span-1 p-4 bg-[#e74c3c] text-white border border-[#c0392b] rounded-lg active:bg-[#c0392b] text-xl touch-manipulation flex items-center justify-center"
              onTouchStart={(e) => {
                e.preventDefault()
                onRestart()
              }}
            >
              다시 시작
            </button>
          ) : (
            <button
              className="col-span-1 p-4 bg-[#333] text-white border border-[#444] rounded-lg active:bg-[#555] text-2xl touch-manipulation flex items-center justify-center"
              onTouchStart={(e) => {
                e.preventDefault()
                onPause()
              }}
            >
              ⏸
            </button>
          )}
          <button
            className="col-span-1 p-4 bg-[#333] text-white border border-[#444] rounded-lg active:bg-[#555] text-3xl touch-manipulation flex items-center justify-center"
            onTouchStart={(e) => {
              e.preventDefault()
              onMove(1)
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* 조작 도움말 버튼 */}
      <div className="w-full mt-2 flex justify-center">
        <button className="text-xs text-[#aaa] underline" onClick={showHelp}>
          조작 방법 보기
        </button>
      </div>
    </div>
  )
}

export default MobileControls
