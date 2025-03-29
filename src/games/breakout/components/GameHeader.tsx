import React from 'react'

interface GameHeaderProps {
  score: number
  lives: number
  level: number
}

const GameHeader: React.FC<GameHeaderProps> = ({ score, lives, level }) => {
  // 생명 아이콘 표시를 위한 도우미 함수
  const renderLivesIcons = () => {
    const icons = []
    for (let i = 0; i < lives; i++) {
      icons.push(
        <div
          key={i}
          className="w-[15px] h-[15px] bg-[radial-gradient(circle_at_30%_30%,#ffdd33,#ff6600)] rounded-full shadow-[0_0_6px_#ff8800]"
        />
      )
    }
    return icons
  }

  return (
    <div className="flex justify-between items-center w-full mb-[10px] p-[15px] bg-[rgba(20,20,40,0.7)] border-2 border-[#444488] rounded-[8px] shadow-[0_0_15px_rgba(0,100,255,0.3)]">
      <div className="flex items-center">
        <div className="text-[0.9rem] mr-[10px]">점수:</div>
        <div
          className="text-[1.2rem] text-[#33ccff]"
          style={{ textShadow: '0 0 8px #0088ff' }}
        >
          {score.toString().padStart(6, '0')}
        </div>
      </div>
      <div
        className="text-[0.9rem] text-[#ffcc33]"
        style={{ textShadow: '0 0 8px #ff8800' }}
      >
        MULTIPLIER 1
      </div>
      <div className="flex flex-col items-end">
        <div className="text-[0.9rem] mb-[5px]">레벨: {level}</div>
        <div className="flex gap-[5px]">{renderLivesIcons()}</div>
      </div>
    </div>
  )
}

export default GameHeader
