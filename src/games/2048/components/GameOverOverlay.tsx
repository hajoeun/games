/**
 * 2048 게임 오버 오버레이 컴포넌트
 */

import React from 'react'

interface GameOverOverlayProps {
  score: number
  hasWon: boolean
  onReset: () => void
  onContinue: () => void
  showContinue: boolean
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  score,
  hasWon,
  onReset,
  onContinue,
  showContinue,
}) => {
  return (
    <div className="game-over">
      <h2 className="text-2xl font-bold mb-2">
        {hasWon ? '축하합니다!' : '게임 오버!'}
      </h2>
      <p className="text-lg mb-4">
        {hasWon ? '2048 타일에 도달했습니다!' : '더 이상 이동할 수 없습니다.'}
      </p>
      <div className="text-xl font-bold mb-6">점수: {score}</div>

      <div className="flex flex-col space-y-2">
        {showContinue && (
          <button
            onClick={onContinue}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition"
          >
            계속하기
          </button>
        )}
        <button
          onClick={onReset}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition"
        >
          새 게임
        </button>
      </div>
    </div>
  )
}

export default GameOverOverlay
