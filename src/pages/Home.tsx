import React from 'react'
import { Link } from 'react-router-dom'

interface GameInfo {
  id: string
  title: string
  description: string
  path: string
  imageUrl: string
}

const games: GameInfo[] = [
  {
    id: 'tetris',
    title: '테트리스',
    description: '클래식 테트리스 게임입니다. 블록을 쌓아 줄을 완성하세요!',
    path: '/games/tetris',
    imageUrl: '/images/tetris-thumbnail.png',
  },
  {
    id: 'breakout',
    title: '벽돌깨기',
    description: '클래식 벽돌깨기 게임입니다. 공을 튕겨 모든 벽돌을 부수세요!',
    path: '/games/breakout',
    imageUrl: '/images/breakout-thumbnail.png',
  },
]

const Home: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#000033] to-[#000022] bg-cover min-h-screen w-full py-10 px-5 overflow-hidden relative before:content-[''] before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)] before:bg-[length:50px_50px] before:z-0">
      <div className="max-w-[1200px] mx-auto relative z-[1]">
        <header className="text-center mb-[50px] p-5 bg-[rgba(20,20,40,0.7)] rounded-[10px] border-2 border-[#444488] shadow-[0_0_20px_rgba(0,100,255,0.3)]">
          <h1
            className="text-[3rem] mb-[10px] text-white tracking-[2px] font-['Press_Start_2P','Courier_New',monospace]"
            style={{ textShadow: '0 0 15px #5555ff, 0 0 25px #5555ff' }}
          >
            클래식 게임 아케이드
          </h1>
          <p
            className="text-[1.2rem] text-[#aaaaff] font-['Press_Start_2P','Courier_New',monospace]"
            style={{ textShadow: '0 0 8px #3333cc' }}
          >
            리액트로 구현한 클래식 게임 모음
          </p>
        </header>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[30px]">
          <div className="rounded-[10px] overflow-hidden bg-[rgba(20,20,40,0.7)] border-2 border-[#444488] shadow-[0_10px_20px_rgba(0,0,0,0.3),0_0_15px_rgba(0,100,255,0.3)] transition-[transform_0.3s,box-shadow_0.3s] hover:translate-y-[-10px] hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(0,150,255,0.5)]">
            <Link to="/games/breakout" className="block">
              <div className="h-[200px] bg-[#000022] overflow-hidden relative after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-[30%] after:bg-gradient-to-b after:from-[rgba(0,0,40,0.6)] after:to-transparent after:z-[1]">
                <img
                  src="/images/breakout-thumbnail.png"
                  alt="벽돌깨기 게임 이미지"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.05]"
                />
              </div>
              <h2
                className="text-[1.5rem] my-[15px] mx-[15px] text-center text-white font-['Press_Start_2P','Courier_New',monospace]"
                style={{ textShadow: '0 0 8px #5555ff' }}
              >
                벽돌깨기
              </h2>
              <p className="text-[1rem] text-[#aaaaff] my-0 mx-[15px] mb-[15px] text-center leading-[1.5]">
                패들을 움직여 모든 벽돌을 부수는 클래식 게임
              </p>
            </Link>
          </div>

          <div className="rounded-[10px] overflow-hidden bg-[rgba(20,20,40,0.7)] border-2 border-[#444488] shadow-[0_10px_20px_rgba(0,0,0,0.3),0_0_15px_rgba(0,100,255,0.3)] transition-[transform_0.3s,box-shadow_0.3s] hover:translate-y-[-10px] hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(0,150,255,0.5)]">
            <Link to="/games/tetris" className="block">
              <div className="h-[200px] bg-[#000022] overflow-hidden relative after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-[30%] after:bg-gradient-to-b after:from-[rgba(0,0,40,0.6)] after:to-transparent after:z-[1]">
                <img
                  src="/images/tetris-thumbnail.png"
                  alt="테트리스 게임 이미지"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.05]"
                />
              </div>
              <h2
                className="text-[1.5rem] my-[15px] mx-[15px] text-center text-white font-['Press_Start_2P','Courier_New',monospace]"
                style={{ textShadow: '0 0 8px #5555ff' }}
              >
                테트리스
              </h2>
              <p className="text-[1rem] text-[#aaaaff] my-0 mx-[15px] mb-[15px] text-center leading-[1.5]">
                떨어지는 블록을 회전하고 쌓아 줄을 완성하는 게임
              </p>
            </Link>
          </div>

          {/* 추가 게임 카드 */}
        </div>
      </div>
    </div>
  )
}

export default Home
