// 게임 상태를 나타내는 열거형
export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  LEVEL_CLEAR = 'LEVEL_CLEAR',
}

// 벽돌 타입을 나타내는 열거형
export enum BrickType {
  NORMAL = 1,     // 일반 벽돌
  ENHANCED = 2,   // 강화 벽돌
  BONUS = 3,      // 보너스 벽돌
  POWERUP = 4,    // 파워업 벽돌
}

// 벽돌 객체 인터페이스
export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  type: BrickType;
  hits: number;
  maxHits: number;
  value: number;
  isVisible: boolean;
}

// 패들 객체 인터페이스
export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

// 공 객체 인터페이스
export interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  speed: number;
  isLaunched: boolean;
}

// 경계 객체 인터페이스
export interface Boundaries {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

// 게임 엔진 콜백 인터페이스
export interface GameCallbacks {
  onScoreChange: (score: number) => void;
  onLivesChange: (lives: number) => void;
  onGameStateChange: (state: GameState) => void;
  onLevelChange: (level: number) => void;
}

// 레벨 인터페이스
export interface Level {
  brickLayout: number[][];
  brickTypes?: BrickType[][];
} 