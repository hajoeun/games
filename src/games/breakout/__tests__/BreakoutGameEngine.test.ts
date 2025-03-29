import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { BreakoutGameEngine } from '../controllers/BreakoutGameEngine';
import { GameState } from '../types';

// Canvas 및 Context 모의 객체 생성
class MockCanvasRenderingContext2D {
  fillStyle: string = '';
  clearRect = vi.fn();
  beginPath = vi.fn();
  rect = vi.fn();
  fill = vi.fn();
  closePath = vi.fn();
  arc = vi.fn();
}

describe('BreakoutGameEngine', () => {
  let engine: BreakoutGameEngine;
  let canvas: HTMLCanvasElement;
  let mockCtx: MockCanvasRenderingContext2D;
  let mockCallbacks: any;
  
  beforeEach(() => {
    // 모의 캔버스 생성
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    // 모의 컨텍스트 설정
    mockCtx = new MockCanvasRenderingContext2D();
    vi.spyOn(canvas, 'getContext').mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);
    
    // 콜백 모의 함수 생성
    mockCallbacks = {
      onScoreChange: vi.fn(),
      onLivesChange: vi.fn(),
      onGameStateChange: vi.fn(),
      onLevelChange: vi.fn()
    };
    
    // 게임 엔진 생성
    engine = new BreakoutGameEngine(canvas, mockCallbacks);
    
    // requestAnimationFrame 모의 함수
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  // 테스트 케이스 1: 패들 이동 테스트
  test('패들 이동 - 왼쪽', () => {
    // private 속성에 접근하기 위한 방법
    const engineAny = engine as any;
    
    // 초기 패들 위치 저장
    const initialPaddleX = engineAny.paddle.x;
    
    // 왼쪽 키 이벤트 시뮬레이션
    engineAny.leftPressed = true;
    engineAny.updatePaddlePosition();
    
    // 왼쪽으로 이동했는지 확인
    expect(engineAny.paddle.x).toBeLessThan(initialPaddleX);
  });
  
  test('패들 이동 - 오른쪽', () => {
    const engineAny = engine as any;
    const initialPaddleX = engineAny.paddle.x;
    
    // 오른쪽 키 이벤트 시뮬레이션
    engineAny.rightPressed = true;
    engineAny.updatePaddlePosition();
    
    // 오른쪽으로 이동했는지 확인
    expect(engineAny.paddle.x).toBeGreaterThan(initialPaddleX);
  });
  
  test('패들 이동 - 왼쪽 경계 확인', () => {
    const engineAny = engine as any;
    
    // 패들을 왼쪽 끝으로 이동
    engineAny.paddle.x = 0;
    engineAny.leftPressed = true;
    engineAny.updatePaddlePosition();
    
    // 화면 밖으로 나가지 않는지 확인
    expect(engineAny.paddle.x).toBeGreaterThanOrEqual(0);
  });
  
  test('패들 이동 - 오른쪽 경계 확인', () => {
    const engineAny = engine as any;
    
    // 패들을 오른쪽 끝으로 이동
    engineAny.paddle.x = canvas.width - engineAny.paddle.width;
    engineAny.rightPressed = true;
    engineAny.updatePaddlePosition();
    
    // 화면 밖으로 나가지 않는지 확인
    expect(engineAny.paddle.x).toBeLessThanOrEqual(canvas.width - engineAny.paddle.width);
  });
  
  // 테스트 케이스 2: 공의 충돌 테스트
  test('공이 상단 벽에 충돌', () => {
    const engineAny = engine as any;
    
    // 공을 상단 경계에 배치
    engineAny.ball.y = engineAny.ball.radius;
    engineAny.ball.dy = -3; // 위쪽으로 이동 중
    engineAny.ball.isLaunched = true;
    
    // 공 위치 업데이트
    engineAny.updateBallPosition();
    
    // 방향이 반전되었는지 확인
    expect(engineAny.ball.dy).toBeGreaterThan(0);
  });
  
  test('공이 좌우 벽에 충돌', () => {
    const engineAny = engine as any;
    
    // 공을 오른쪽 경계에 배치
    engineAny.ball.x = canvas.width - engineAny.ball.radius;
    engineAny.ball.dx = 3; // 오른쪽으로 이동 중
    engineAny.ball.isLaunched = true;
    
    // 공 위치 업데이트
    engineAny.updateBallPosition();
    
    // 방향이 반전되었는지 확인
    expect(engineAny.ball.dx).toBeLessThan(0);
    
    // 공을 왼쪽 경계에 배치
    engineAny.ball.x = engineAny.ball.radius;
    engineAny.ball.dx = -3; // 왼쪽으로 이동 중
    
    // 공 위치 업데이트
    engineAny.updateBallPosition();
    
    // 방향이 반전되었는지 확인
    expect(engineAny.ball.dx).toBeGreaterThan(0);
  });
  
  test('공이 바닥에 떨어지면 생명 감소', () => {
    const engineAny = engine as any;
    
    // 초기 생명 수 확인
    const initialLives = engineAny.lives;
    
    // 공을 바닥 아래로 배치
    engineAny.ball.y = canvas.height + engineAny.ball.radius;
    engineAny.ball.isLaunched = true;
    
    // 공 위치 업데이트
    engineAny.updateBallPosition();
    
    // 생명이 감소했는지 확인
    expect(engineAny.lives).toBe(initialLives - 1);
    expect(mockCallbacks.onLivesChange).toHaveBeenCalledWith(initialLives - 1);
  });
  
  test('공이 패들에 충돌', () => {
    const engineAny = engine as any;
    
    // 공을 패들 위에 배치
    engineAny.ball.x = engineAny.paddle.x + engineAny.paddle.width / 2;
    engineAny.ball.y = engineAny.paddle.y - engineAny.ball.radius;
    engineAny.ball.dy = 3; // 아래쪽으로 이동 중
    
    // 패들 충돌 체크
    engineAny.checkPaddleCollision();
    
    // 방향이 반전되었는지 확인
    expect(engineAny.ball.dy).toBeLessThan(0);
  });
  
  // 테스트 케이스 3: 게임 상태 테스트
  test('모든 벽돌 제거 시 레벨 클리어', () => {
    const engineAny = engine as any;
    
    // 게임 상태를 PLAYING으로 설정
    engineAny.gameState = GameState.PLAYING;
    
    // 단순화된 벽돌 배열 생성
    engineAny.bricks = [[{ isVisible: true, hits: 0, maxHits: 1, value: 10, x: 0, y: 0, width: 10, height: 10 }]];
    
    // 공 위치를 벽돌 위치에 배치하고 충돌을 시뮬레이션
    engineAny.ball.x = 5;
    engineAny.ball.y = 5;
    engineAny.ball.radius = 5;
    engineAny.ball.isLaunched = true;
    
    // 벽돌 충돌 체크 호출
    engineAny.checkBrickCollision();
    
    // 모든 벽돌이 제거되고 checkLevelComplete가 true를 반환하는지 확인
    expect(engineAny.bricks[0][0].isVisible).toBe(false);
    expect(engineAny.gameState).toBe(GameState.LEVEL_CLEAR);
    expect(mockCallbacks.onGameStateChange).toHaveBeenCalledWith(GameState.LEVEL_CLEAR);
  });
  
  test('생명이 0이 되면 게임 오버', () => {
    const engineAny = engine as any;
    
    // 게임 상태를 PLAYING으로 설정
    engineAny.gameState = GameState.PLAYING;
    
    // 생명을 1로 설정
    engineAny.lives = 1;
    
    // 공을 바닥 아래로 배치
    engineAny.ball.y = canvas.height + engineAny.ball.radius;
    engineAny.ball.isLaunched = true;
    
    // 공 위치 업데이트
    engineAny.updateBallPosition();
    
    // 게임 상태가 GAME_OVER인지 확인
    expect(engineAny.gameState).toBe(GameState.GAME_OVER);
    expect(mockCallbacks.onGameStateChange).toHaveBeenCalledWith(GameState.GAME_OVER);
  });
}); 