import React from 'react'
import { GameStatus } from '../types'

interface MobileControlsProps {
  onMoveLeft: () => void
  onMoveRight: () => void
  onRotate: () => void
  onSoftDrop: () => boolean
  onHardDrop: () => void
  onHold: () => void
  disabled: boolean
}

const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onHold,
  disabled = false,
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
    <div className="w-full flex flex-col items-center">
      {/* 모바일용 버튼 컨트롤 */}
      <div className="w-full grid grid-cols-3 gap-2">
        <div className="col-span-3 grid grid-cols-3 gap-2">
          <button
            className="game-button"
            onTouchStart={(e) => {
              e.preventDefault()
              if (!disabled) onRotate()
            }}
            disabled={disabled}
          >
            ↺
          </button>
          <button
            className="game-button"
            onTouchStart={(e) => {
              e.preventDefault()
              if (!disabled) onHold()
            }}
            disabled={disabled}
          >
            홀드
          </button>
          <button
            className="game-button"
            onTouchStart={(e) => {
              e.preventDefault()
              if (!disabled) onHardDrop()
            }}
            disabled={disabled}
          >
            ↓↓
          </button>
        </div>

        <div className="col-span-3 grid grid-cols-3 gap-2 mt-2">
          <button
            className="game-button"
            onTouchStart={(e) => {
              e.preventDefault()
              if (!disabled) onMoveLeft()
            }}
            disabled={disabled}
          >
            ←
          </button>
          <button
            className="game-button"
            onTouchStart={(e) => {
              e.preventDefault()
              if (!disabled) onSoftDrop()
            }}
            disabled={disabled}
          >
            ↓
          </button>
          <button
            className="game-button"
            onTouchStart={(e) => {
              e.preventDefault()
              if (!disabled) onMoveRight()
            }}
            disabled={disabled}
          >
            →
          </button>
        </div>
      </div>

      {/* 조작 도움말 버튼 */}
      <div className="w-full mt-2 flex justify-center">
        <button
          className="text-xs font-monaco text-game-text underline"
          onClick={showHelp}
        >
          조작 방법 보기
        </button>
      </div>
    </div>
  )
}

export default MobileControls
