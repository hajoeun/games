/**
 * 2048 게임 헤더 컴포넌트
 */

import React from 'react'

interface GameHeaderProps {
  score: number
  bestScore: number
  onReset: () => void
}

const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  bestScore,
  onReset,
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">2048</h1>
        <button
          onClick={onReset}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition"
        >
          새 게임
        </button>
      </div>

      <div className="flex justify-between">
        <div className="bg-gray-200 rounded p-2 min-w-24 text-center">
          <div className="text-sm text-gray-600">점수</div>
          <div className="font-bold text-xl">{score}</div>
        </div>
        <div className="bg-gray-200 rounded p-2 min-w-24 text-center">
          <div className="text-sm text-gray-600">최고 점수</div>
          <div className="font-bold text-xl">{bestScore}</div>
        </div>
      </div>
    </div>
  )
}

export default GameHeader
