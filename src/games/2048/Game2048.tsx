/**
 * 2048 게임 메인 컴포넌트
 */

import React, { useCallback, useEffect, useState, useRef } from 'react'
import GameBoard from './components/GameBoard'
import { Direction, GameState, GameStatus } from './types'
import {
  addRandomTile,
  canMove,
  createNewGame,
  getBestScore,
  hasWon,
  moveBoard,
  saveBestScore,
  boardToTiles,
  updateTiles,
} from './utils'
import { ANIMATION_DURATION } from './constants'
import './styles/animation.css'

export const Game2048: React.FC = () => {
  // 게임 상태 관리
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    score: 0,
    bestScore: 0,
    status: GameStatus.IDLE,
    gameOver: false,
    hasWon: false,
    continueAfterWin: false,
    tiles: [],
    animating: false,
  })

  // handleMove 함수에서 항상 최신 gameState를 사용할 수 있도록 ref 사용
  const gameStateRef = useRef(gameState)

  // gameState가 업데이트될 때마다 ref도 업데이트
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  // 초기화 함수
  const initGame = useCallback(() => {
    console.log('게임 초기화 시작')
    const bestScore = getBestScore()
    const initialBoard = createNewGame()
    const initialTiles = boardToTiles(initialBoard)

    console.log('초기 보드:', initialBoard)
    console.log('초기 타일:', initialTiles)
    console.log('초기 타일 수:', initialTiles.length)

    // 타일이 없으면 다시 생성 시도
    if (initialTiles.length === 0) {
      console.error('초기 타일이 생성되지 않음 - 다시 시도')
      const retryBoard = createNewGame()
      const retryTiles = boardToTiles(retryBoard)
      console.log('재시도 보드:', retryBoard)
      console.log('재시도 타일 수:', retryTiles.length)

      setGameState({
        board: retryBoard,
        score: 0,
        bestScore,
        status: GameStatus.PLAYING,
        gameOver: false,
        hasWon: false,
        continueAfterWin: false,
        tiles: retryTiles,
        animating: false,
      })
    } else {
      setGameState({
        board: initialBoard,
        score: 0,
        bestScore,
        status: GameStatus.PLAYING,
        gameOver: false,
        hasWon: false,
        continueAfterWin: false,
        tiles: initialTiles,
        animating: false,
      })
    }

    console.log('게임 초기화 완료')
  }, [])

  // 게임 시작 시 초기화
  useEffect(() => {
    console.log('게임 컴포넌트 마운트 - 초기화 실행')
    initGame()
  }, [initGame])

  // 게임 이동 처리 함수 - useRef를 사용하여 항상 최신 상태 참조
  const handleMove = useCallback((direction: Direction) => {
    console.log('==== 이동 처리 시작 - 방향:', direction, ' ====')
    // ref에서 최신 상태 가져오기
    const currentState = gameStateRef.current

    // 애니메이션 진행 중이거나 게임이 종료된 경우 처리하지 않음
    if (
      currentState.animating ||
      (currentState.status !== GameStatus.PLAYING &&
        currentState.status !== GameStatus.CONTINUE)
    ) {
      console.log('게임 상태가 플레이 중이 아님:', currentState.status)
      return
    }

    // 1. 타일 이동 및 병합 처리
    console.log('1. 타일 이동 및 병합 처리 시작')
    const {
      board: newBoard,
      score: moveScore,
      moved,
    } = moveBoard(currentState.board, direction)

    console.log('1. 타일 이동 및 병합 처리 완료:', {
      moved,
      moveScore,
      boardBefore: currentState.board,
      boardAfter: newBoard,
    })

    // 이동이 발생하지 않았으면 상태 업데이트하지 않음
    if (!moved) {
      console.log('이동 없음 - 처리 중단')
      return
    }

    // 이동 애니메이션 진행 중으로 설정
    setGameState((prev) => ({
      ...prev,
      animating: true,
      lastDirection: direction,
    }))

    // 애니메이션 후 상태 업데이트 (타이머 사용)
    setTimeout(() => {
      // ref에서 다시 최신 상태 가져오기 (setTimeout 내부이므로)
      const latestState = gameStateRef.current

      // 2. 새 타일 추가
      console.log('2. 새 타일 추가 시작')
      const boardWithNewTile = addRandomTile(newBoard)
      console.log('2. 새 타일 추가 완료')

      // 3. 타일 정보 업데이트
      console.log('3. 타일 정보 업데이트 시작')
      const updatedTiles = updateTiles(
        latestState.tiles || [],
        boardWithNewTile
      )
      console.log('3. 타일 정보 업데이트 완료, 타일 수:', updatedTiles.length)

      // 4. 게임 상태 업데이트
      console.log('4. 게임 상태 업데이트')
      // 새로운 점수 계산
      const newScore = latestState.score + moveScore

      // 최고 점수 업데이트
      const newBestScore = Math.max(latestState.bestScore, newScore)
      if (newBestScore > latestState.bestScore) {
        saveBestScore(newBestScore)
      }

      // 게임 승리 조건 체크
      const wonGame =
        !latestState.hasWon &&
        !latestState.continueAfterWin &&
        hasWon(boardWithNewTile)

      // 게임 오버 조건 체크
      const isGameOver = !canMove(boardWithNewTile)

      // 게임 상태 업데이트
      setGameState((prev) => ({
        ...prev,
        board: boardWithNewTile,
        tiles: updatedTiles,
        score: newScore,
        bestScore: newBestScore,
        status: wonGame
          ? GameStatus.WON
          : isGameOver
          ? GameStatus.GAME_OVER
          : prev.status,
        gameOver: isGameOver || (wonGame && !prev.continueAfterWin),
        hasWon: wonGame || prev.hasWon,
        animating: false,
      }))

      console.log('==== 이동 처리 완료 ====')
    }, ANIMATION_DURATION)
  }, []) // 빈 의존성 배열 - 함수가 한 번만 생성되도록 함

  // 게임 재시작 처리
  const handleReset = useCallback(() => {
    initGame()
  }, [initGame])

  // 승리 후 계속하기 처리
  const handleContinue = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: GameStatus.CONTINUE,
      continueAfterWin: true,
      gameOver: false,
    }))
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-md px-4">
        <GameBoard
          gameState={gameState}
          onMove={handleMove}
          onReset={handleReset}
          onContinue={handleContinue}
        />
      </div>
    </div>
  )
}

export default Game2048
