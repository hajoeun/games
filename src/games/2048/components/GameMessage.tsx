/**
 * 2048 게임 메시지 컴포넌트
 */

import React from 'react'
import { CSS_CLASSES, GAME_MESSAGES } from '../constants'
import { GameStatus } from '../types'

interface GameMessageProps {
  status: GameStatus
  onReset: () => void
  onContinue: () => void
}

export const GameMessage: React.FC<GameMessageProps> = ({
  status,
  onReset,
  onContinue,
}) => {
  // 승리/패배 상태가 아니면 표시하지 않음
  if (status !== GameStatus.WON && status !== GameStatus.GAME_OVER) {
    return null
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-10"
      data-testid="game-message"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {status === GameStatus.WON
            ? GAME_MESSAGES.WIN
            : GAME_MESSAGES.GAME_OVER}
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {status === GameStatus.WON && (
            <button
              className={CSS_CLASSES.BUTTON}
              onClick={onContinue}
              data-testid="continue-button"
            >
              계속하기
            </button>
          )}

          <button
            className={CSS_CLASSES.BUTTON}
            onClick={onReset}
            data-testid="reset-button"
          >
            새 게임
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameMessage
