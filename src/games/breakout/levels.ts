import { BrickType, Level } from './types';

// 빈 공간은 0, 벽돌은 1 (또는 다른 값)으로 표시
export const levels: Level[] = [
  // 레벨 1: 기본 벽돌 배치
  {
    brickLayout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    brickTypes: [
      [BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL],
      [BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL],
      [BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL],
      [BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL],
    ]
  },
  
  // 레벨 2: 더 복잡한 패턴 및 강화 벽돌 추가
  {
    brickLayout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    brickTypes: [
      [BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL],
      [BrickType.ENHANCED, BrickType.NORMAL, BrickType.ENHANCED, BrickType.NORMAL, BrickType.ENHANCED, BrickType.ENHANCED, BrickType.NORMAL, BrickType.ENHANCED, BrickType.NORMAL, BrickType.ENHANCED],
      [BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL],
      [BrickType.ENHANCED, BrickType.NORMAL, BrickType.ENHANCED, BrickType.NORMAL, BrickType.ENHANCED, BrickType.ENHANCED, BrickType.NORMAL, BrickType.ENHANCED, BrickType.NORMAL, BrickType.ENHANCED],
      [BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL],
    ]
  },
  
  // 레벨 3: 강화 벽돌과 보너스 벽돌이 있는 복잡한 패턴
  {
    brickLayout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    ],
    brickTypes: [
      [BrickType.ENHANCED, BrickType.ENHANCED, BrickType.ENHANCED, BrickType.ENHANCED, BrickType.BONUS, BrickType.BONUS, BrickType.ENHANCED, BrickType.ENHANCED, BrickType.ENHANCED, BrickType.ENHANCED],
      [BrickType.ENHANCED, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.ENHANCED],
      [BrickType.ENHANCED, BrickType.NORMAL, BrickType.POWERUP, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.POWERUP, BrickType.NORMAL, BrickType.ENHANCED],
      [BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL],
      [BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.BONUS, BrickType.NORMAL, BrickType.NORMAL, BrickType.BONUS, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL],
      [BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.ENHANCED, BrickType.ENHANCED, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL, BrickType.NORMAL],
    ]
  }
]; 