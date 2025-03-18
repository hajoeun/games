// 게임 보드 크기
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const VISIBLE_HEIGHT = 20; // 실제로 보이는 높이

// 테트리미노 타입
export enum TetrominoType {
  I = 'I',
  J = 'J',
  L = 'L',
  O = 'O',
  S = 'S',
  T = 'T',
  Z = 'Z'
}

// 테트리미노 색상
export const TETROMINO_COLORS = {
  [TetrominoType.I]: '#00ffff', // 파랑
  [TetrominoType.J]: '#0000ff', // 파랑
  [TetrominoType.L]: '#ff7f00', // 주황
  [TetrominoType.O]: '#ffff00', // 노랑
  [TetrominoType.S]: '#00ff00', // 초록
  [TetrominoType.T]: '#800080', // 보라
  [TetrominoType.Z]: '#ff0000', // 빨강
  ghost: 'rgba(255, 255, 255, 0.2)' // 고스트 조각 색상
};

// 테트리미노 모양 (각 조각의 좌표 배열)
export const TETROMINOS = {
  [TetrominoType.I]: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    width: 4,
    height: 4
  },
  [TetrominoType.J]: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    width: 3,
    height: 3
  },
  [TetrominoType.L]: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    width: 3,
    height: 3
  },
  [TetrominoType.O]: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    width: 2,
    height: 2
  },
  [TetrominoType.S]: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    width: 3,
    height: 3
  },
  [TetrominoType.T]: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    width: 3,
    height: 3
  },
  [TetrominoType.Z]: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    width: 3,
    height: 3
  }
};

// 레벨별 속도 (밀리초)
export const LEVEL_SPEEDS = [
  800, // 레벨 1
  720,
  630,
  550,
  470,
  380,
  300,
  220,
  130,
  100, // 레벨 10
  80,  // 레벨 11
  80,  // 레벨 12
  70,  // 레벨 13
  70,  // 레벨 14
  60,  // 레벨 15+
];

// 점수 계산을 위한 상수
export const POINTS = {
  SINGLE: 100,    // 1줄 제거
  DOUBLE: 300,    // 2줄 제거
  TRIPLE: 500,    // 3줄 제거
  TETRIS: 800,    // 4줄 제거 (테트리스)
  SOFT_DROP: 1,   // 소프트 드롭 (한 칸당)
  HARD_DROP: 2,   // 하드 드롭 (한 칸당)
};

// 키 설정
export const KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  UP: 'ArrowUp',     // 회전
  SPACE: ' ',        // 하드 드롭
  P: 'p',            // 일시정지
  R: 'r',            // 재시작
  SHIFT: 'Shift',    // 홀드
};

// DAS (Delayed Auto Shift) 및 ARR (Auto Repeat Rate) 설정
export const DAS_DELAY = 150;  // 키를 처음 누르고 자동 반복이 시작될 때까지의 지연 시간 (ms)
export const ARR_DELAY = 50;   // 자동 반복 시 각 이동 사이의 지연 시간 (ms) 