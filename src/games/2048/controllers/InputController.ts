/**
 * 2048 게임 입력 컨트롤러
 */

import { KEY_MAPPING, MIN_SWIPE_DISTANCE } from '../constants';
import { Direction, GameCallbacks, TouchData } from '../types';

export class InputController {
  private callbacks: GameCallbacks;
  private touchData: TouchData = { startX: 0, startY: 0, endX: 0, endY: 0 };
  private isTouching = false;
  
  constructor(callbacks: GameCallbacks) {
    this.callbacks = callbacks;
  }
  
  /**
   * 이벤트 리스너 등록
   */
  public attach = (): void => {
    // 키보드 이벤트 등록
    window.addEventListener('keydown', this.handleKeyDown);
    
    // 터치/모바일 이벤트 등록
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);
  };
  
  /**
   * 이벤트 리스너 제거
   */
  public detach = (): void => {
    // 키보드 이벤트 제거
    window.removeEventListener('keydown', this.handleKeyDown);
    
    // 터치/모바일 이벤트 제거
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  };
  
  /**
   * 키보드 입력 처리
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    // 지원하는 방향키인지 확인
    if (event.key in KEY_MAPPING) {
      // 기본 동작 방지 (페이지 스크롤 등)
      event.preventDefault();
      
      // 방향키에 따른 이동 실행
      const direction = KEY_MAPPING[event.key as keyof typeof KEY_MAPPING] as Direction;
      this.callbacks.onMove(direction);
    }
  };
  
  /**
   * 터치 시작 처리
   */
  private handleTouchStart = (event: TouchEvent): void => {
    if (event.touches.length > 0) {
      this.isTouching = true;
      this.touchData.startX = event.touches[0].clientX;
      this.touchData.startY = event.touches[0].clientY;
    }
  };
  
  /**
   * 터치 이동 처리
   */
  private handleTouchMove = (event: TouchEvent): void => {
    if (this.isTouching && event.touches.length > 0) {
      // 현재 터치 위치 저장
      this.touchData.endX = event.touches[0].clientX;
      this.touchData.endY = event.touches[0].clientY;
      
      // 페이지 스크롤 방지
      event.preventDefault();
    }
  };
  
  /**
   * 터치 종료 처리 및 스와이프 방향 감지
   */
  private handleTouchEnd = (event: TouchEvent): void => {
    if (!this.isTouching) return;
    
    this.isTouching = false;
    
    // X, Y축 이동 거리 계산
    const deltaX = this.touchData.endX - this.touchData.startX;
    const deltaY = this.touchData.endY - this.touchData.startY;
    
    // 최소 스와이프 거리 미만이면 무시
    if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE && Math.abs(deltaY) < MIN_SWIPE_DISTANCE) {
      return;
    }
    
    // 가장 큰 이동 방향 결정 (수평 vs 수직)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 수평 이동이 더 큰 경우
      if (deltaX > 0) {
        this.callbacks.onMove(Direction.RIGHT);
      } else {
        this.callbacks.onMove(Direction.LEFT);
      }
    } else {
      // 수직 이동이 더 큰 경우
      if (deltaY > 0) {
        this.callbacks.onMove(Direction.DOWN);
      } else {
        this.callbacks.onMove(Direction.UP);
      }
    }
  };
} 