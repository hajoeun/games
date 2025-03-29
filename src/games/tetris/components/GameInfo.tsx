import React from 'react'
import { GameStats, GameStatus } from '../types'
import { loadGameStats } from '../utils'

interface PlayerStats {
  highScore: number
  highLevel: number
  totalLines: number
  gamesPlayed: number
  lastPlayed: string | null
}

interface GameInfoProps {
  gameStats: GameStats
  playerStats?: PlayerStats
  gameStatus?: GameStatus
}

const GameInfo = ({
  gameStats,
  playerStats = loadGameStats(),
  gameStatus = GameStatus.PLAYING,
}: GameInfoProps): React.ReactElement => {
  return (
    <div className="w-full max-w-[350px] sm:max-w-[320px] bg-[#1a1a1a] border-2 border-[#333] p-[10px] sm:p-[5px] flex flex-col">
      {/* 모바일용 심플 버전 (스코어, 레벨, 라인만 표시) */}
      <div className="sm:block hidden">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center">
            <span className="text-[#aaa] text-[0.8rem]">점수</span>
            <span
              className="text-white text-[1rem] font-bold"
              data-testid="score-mobile"
            >
              {gameStats.score}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#aaa] text-[0.8rem]">레벨</span>
            <span
              className="text-white text-[1rem] font-bold"
              data-testid="level-mobile"
            >
              {gameStats.level}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#aaa] text-[0.8rem]">라인</span>
            <span
              className="text-white text-[1rem] font-bold"
              data-testid="lines-mobile"
            >
              {gameStats.lines}
            </span>
          </div>
        </div>
      </div>

      {/* 데스크톱용 전체 정보 버전 */}
      <div className="sm:hidden">
        <h3 className="m-0 mb-[10px] text-white text-[1.2rem] text-center">
          게임 정보
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-[10px]">
          <div className="flex flex-col items-center">
            <span className="text-[#aaa] text-[0.9rem]">점수</span>
            <span
              className="text-white text-[1.1rem] font-bold"
              data-testid="score"
            >
              {gameStats.score}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#aaa] text-[0.9rem]">레벨</span>
            <span
              className="text-white text-[1.1rem] font-bold"
              data-testid="level"
            >
              {gameStats.level}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#aaa] text-[0.9rem]">라인</span>
            <span
              className="text-white text-[1.1rem] font-bold"
              data-testid="lines"
            >
              {gameStats.lines}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#aaa] text-[0.9rem]">테트리스</span>
            <span className="text-white text-[1.1rem] font-bold">
              {gameStats.tetris}
            </span>
          </div>
        </div>

        {/* 최고 점수 정보 - 데스크톱에서만 표시 */}
        <div className="hidden md:block">
          <hr className="border-none border-t border-t-[#333] my-[10px]" />

          <div className="grid grid-cols-2 gap-2 mb-[10px]">
            <div className="flex justify-between mb-[5px]">
              <span className="text-[#aaa] text-[0.9rem]">최고 점수:</span>
              <span className="text-white text-[0.9rem] font-bold">
                {playerStats.highScore}
              </span>
            </div>

            <div className="flex justify-between mb-[5px]">
              <span className="text-[#aaa] text-[0.9rem]">최고 레벨:</span>
              <span className="text-white text-[0.9rem] font-bold">
                {playerStats.highLevel}
              </span>
            </div>

            <div className="flex justify-between mb-[5px]">
              <span className="text-[#aaa] text-[0.9rem]">총 라인:</span>
              <span className="text-white text-[0.9rem] font-bold">
                {playerStats.totalLines}
              </span>
            </div>

            <div className="flex justify-between mb-[5px]">
              <span className="text-[#aaa] text-[0.9rem]">게임 수:</span>
              <span className="text-white text-[0.9rem] font-bold">
                {playerStats.gamesPlayed}
              </span>
            </div>
          </div>

          <hr className="border-none border-t border-t-[#333] my-[10px]" />

          <div className="hidden md:flex flex-col mt-[5px]">
            <div className="text-[#888] text-[0.8rem] mb-[3px]">↑: 회전</div>
            <div className="text-[#888] text-[0.8rem] mb-[3px]">←↓→: 이동</div>
            <div className="text-[#888] text-[0.8rem] mb-[3px]">
              스페이스: 하드 드롭
            </div>
            <div className="text-[#888] text-[0.8rem] mb-[3px]">
              Shift: 홀드
            </div>
            <div className="text-[#888] text-[0.8rem] mb-[3px]">
              P: 일시정지
            </div>
            <div className="text-[#888] text-[0.8rem] mb-[3px]">R: 재시작</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameInfo
