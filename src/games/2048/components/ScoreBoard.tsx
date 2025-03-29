/**
 * 2048 게임 점수판 컴포넌트
 */

import React from 'react'
import { CSS_CLASSES } from '../constants'

interface ScoreBoardProps {
  score: number
  bestScore: number
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, bestScore }) => {
  return (
    <div className="flex justify-center gap-4">
      <div className={CSS_CLASSES.SCORE_BOARD}>
        <div className={CSS_CLASSES.SCORE_LABEL}>현재 점수</div>
        <div className={CSS_CLASSES.SCORE_VALUE} data-testid="current-score">
          {score}
        </div>
      </div>

      <div className={CSS_CLASSES.SCORE_BOARD}>
        <div className={CSS_CLASSES.SCORE_LABEL}>최고 점수</div>
        <div className={CSS_CLASSES.SCORE_VALUE} data-testid="best-score">
          {bestScore}
        </div>
      </div>
    </div>
  )
}

export default ScoreBoard
