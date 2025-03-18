import { TetrominoType } from './constants';

// 게임 보드의 셀 타입
export type Cell = {
  filled: boolean;  // 셀이 채워져 있는지 여부
  color: string;    // 셀의 색상
  type: TetrominoType | null; // 테트로미노 타입
};

// 게임 보드 타입
export type Board = Cell[][];

// 테트로미노 타입
export type Tetromino = {
  type: TetrominoType;  // 테트로미노 타입 (I, J, L, O, S, T, Z)
  shape: number[][];    // 테트로미노 모양
  position: {           // 보드에서의 위치
    x: number;
    y: number;
  };
  rotation: number;     // 회전 상태 (0, 1, 2, 3) - 각각 0, 90, 180, 270도
};

// 게임 상태 타입
export enum GameStatus {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

// 게임 통계 타입
export type GameStats = {
  score: number;        // 현재 점수
  level: number;        // 현재 레벨
  lines: number;        // 제거한 줄 수
  tetris: number;       // 테트리스 수 (4줄 제거)
  totalPieces: number;  // 배치한 총 조각 수
};

// 게임 컨트롤 액션 타입
export enum GameAction {
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  MOVE_DOWN = 'MOVE_DOWN',
  ROTATE = 'ROTATE',
  HARD_DROP = 'HARD_DROP',
  HOLD = 'HOLD'
}

// 키 입력 상태 타입
export type KeyState = {
  [key: string]: {
    pressed: boolean;
    time: number;         // 마지막으로 눌린 시간
    lastRepeat: number;   // 마지막 자동 반복 시간
  };
}; 