/**
 * 2048 게임 InputController 테스트
 */

import { InputController } from '../controllers/InputController';
import { Direction } from '../types';

describe('InputController 테스트', () => {
  let inputController: InputController;
  let mockCallbacks: { onMove: jest.Mock; onReset: jest.Mock; onContinue: jest.Mock };
  
  beforeEach(() => {
    mockCallbacks = {
      onMove: jest.fn(),
      onReset: jest.fn(),
      onContinue: jest.fn(),
    };
    
    inputController = new InputController(mockCallbacks);
    inputController.attach();
  });
  
  afterEach(() => {
    inputController.detach();
  });
  
  describe('키보드 이벤트 처리', () => {
    it('ArrowLeft 키가 LEFT 방향 이동 콜백을 호출해야 함', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      window.dispatchEvent(event);
      
      expect(mockCallbacks.onMove).toHaveBeenCalledWith(Direction.LEFT);
    });
    
    it('ArrowRight 키가 RIGHT 방향 이동 콜백을 호출해야 함', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);
      
      expect(mockCallbacks.onMove).toHaveBeenCalledWith(Direction.RIGHT);
    });
    
    it('ArrowUp 키가 UP 방향 이동 콜백을 호출해야 함', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      window.dispatchEvent(event);
      
      expect(mockCallbacks.onMove).toHaveBeenCalledWith(Direction.UP);
    });
    
    it('ArrowDown 키가 DOWN 방향 이동 콜백을 호출해야 함', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      window.dispatchEvent(event);
      
      expect(mockCallbacks.onMove).toHaveBeenCalledWith(Direction.DOWN);
    });
    
    it('지원하지 않는 키는 무시해야 함', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      window.dispatchEvent(event);
      
      expect(mockCallbacks.onMove).not.toHaveBeenCalled();
    });
  });
  
  describe('터치 이벤트 처리', () => {
    // 가상 터치 이벤트 생성 함수
    const createTouchEvent = (
      type: string,
      clientX: number,
      clientY: number
    ): TouchEvent => {
      const touchObj = { clientX, clientY, identifier: 1 } as Touch;
      return {
        type,
        touches: [touchObj],
        changedTouches: [touchObj],
        preventDefault: jest.fn(),
      } as unknown as TouchEvent;
    };
    
    it('오른쪽 스와이프가 RIGHT 방향 이동 콜백을 호출해야 함', () => {
      // touchstart - touchend 시퀀스 시뮬레이션
      const startEvent = createTouchEvent('touchstart', 100, 100);
      const moveEvent = createTouchEvent('touchmove', 150, 100);
      const endEvent = createTouchEvent('touchend', 200, 100);
      
      window.dispatchEvent(startEvent);
      window.dispatchEvent(moveEvent);
      window.dispatchEvent(endEvent);
      
      expect(mockCallbacks.onMove).toHaveBeenCalledWith(Direction.RIGHT);
    });
    
    it('왼쪽 스와이프가 LEFT 방향 이동 콜백을 호출해야 함', () => {
      const startEvent = createTouchEvent('touchstart', 200, 100);
      const moveEvent = createTouchEvent('touchmove', 150, 100);
      const endEvent = createTouchEvent('touchend', 100, 100);
      
      window.dispatchEvent(startEvent);
      window.dispatchEvent(moveEvent);
      window.dispatchEvent(endEvent);
      
      expect(mockCallbacks.onMove).toHaveBeenCalledWith(Direction.LEFT);
    });
    
    it('위쪽 스와이프가 UP 방향 이동 콜백을 호출해야 함', () => {
      const startEvent = createTouchEvent('touchstart', 100, 200);
      const moveEvent = createTouchEvent('touchmove', 100, 150);
      const endEvent = createTouchEvent('touchend', 100, 100);
      
      window.dispatchEvent(startEvent);
      window.dispatchEvent(moveEvent);
      window.dispatchEvent(endEvent);
      
      expect(mockCallbacks.onMove).toHaveBeenCalledWith(Direction.UP);
    });
    
    it('아래쪽 스와이프가 DOWN 방향 이동 콜백을 호출해야 함', () => {
      const startEvent = createTouchEvent('touchstart', 100, 100);
      const moveEvent = createTouchEvent('touchmove', 100, 150);
      const endEvent = createTouchEvent('touchend', 100, 200);
      
      window.dispatchEvent(startEvent);
      window.dispatchEvent(moveEvent);
      window.dispatchEvent(endEvent);
      
      expect(mockCallbacks.onMove).toHaveBeenCalledWith(Direction.DOWN);
    });
    
    it('짧은 스와이프는 무시해야 함', () => {
      // 최소 스와이프 거리보다 짧은 거리
      const startEvent = createTouchEvent('touchstart', 100, 100);
      const moveEvent = createTouchEvent('touchmove', 110, 110);
      const endEvent = createTouchEvent('touchend', 120, 120);
      
      window.dispatchEvent(startEvent);
      window.dispatchEvent(moveEvent);
      window.dispatchEvent(endEvent);
      
      expect(mockCallbacks.onMove).not.toHaveBeenCalled();
    });
  });
}); 