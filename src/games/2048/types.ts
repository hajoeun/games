/**
 * 2048 게임 타입 정의
 */

// 게임 보드 타입 정의
export type Cell = number;
export type Row = Cell[];
export type Board = Row[];

// 게임 방향 열거형
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

// 게임 상태 열거형
export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  WON = 'WON',
  CONTINUE = 'CONTINUE',
  GAME_OVER = 'GAME_OVER',
}

// 게임 이동 결과 타입
export interface MoveResult {
  board: Board;
  score: number;
  moved: boolean;
}

// 타일 위치 타입
export interface TilePosition {
  row: number;
  col: number;
}

// 타일 정보 타입
export interface TileInfo {
  id: string;         // 타일 고유 ID
  value: number;      // 타일 값 (2, 4, 8 등)
  position: TilePosition; // 현재 위치
  previousPosition?: TilePosition; // 이동 전 위치
  isNew?: boolean;    // 새로 생성된 타일인지 여부
  mergedFrom?: TileInfo[]; // 병합된 타일들
}

// 게임 상태 타입
export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  status: GameStatus;
  gameOver: boolean;
  hasWon: boolean;
  continueAfterWin: boolean;
  tiles?: TileInfo[];       // 현재 타일 정보
  animating?: boolean;      // 애니메이션 진행 중 여부
  lastDirection?: Direction; // 마지막 이동 방향
}

// 게임 연결된 이벤트 콜백 타입
export interface GameCallbacks {
  onMove: (direction: Direction) => void;
  onReset: () => void;
  onContinue: () => void;
}

// 터치 이벤트 데이터 타입
export interface TouchData {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
} 