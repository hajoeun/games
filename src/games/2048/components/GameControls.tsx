/**
 * 2048 게임 컨트롤 컴포넌트
 */

import React from 'react'
import { Direction } from '../types'

interface GameControlsProps {
  onMove: (direction: Direction) => void
  disabled: boolean
}

const GameControls: React.FC<GameControlsProps> = ({ onMove, disabled }) => {
  // 방향 버튼 클릭 핸들러
  const handleButtonClick = (direction: Direction) => {
    console.log(`방향 버튼 클릭: ${direction}`)
    onMove(direction)
  }

  return (
    <div className="flex flex-col items-center mt-6">
      <div className="text-center mb-2 text-gray-600">
        키보드 화살표 또는 아래 버튼 사용
      </div>

      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {/* 위쪽 버튼 */}
        <div className="col-start-2">
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded disabled:opacity-50"
            onClick={() => handleButtonClick(Direction.UP)}
            disabled={disabled}
            aria-label="위로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>

        {/* 왼쪽 버튼 */}
        <div>
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded disabled:opacity-50"
            onClick={() => handleButtonClick(Direction.LEFT)}
            disabled={disabled}
            aria-label="왼쪽으로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* 가운데 빈 공간 */}
        <div></div>

        {/* 오른쪽 버튼 */}
        <div>
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded disabled:opacity-50"
            onClick={() => handleButtonClick(Direction.RIGHT)}
            disabled={disabled}
            aria-label="오른쪽으로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* 아래쪽 버튼 */}
        <div className="col-start-2">
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded disabled:opacity-50"
            onClick={() => handleButtonClick(Direction.DOWN)}
            disabled={disabled}
            aria-label="아래로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameControls
