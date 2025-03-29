/**
 * 2048 게임 상수 정의
 */

// 게임 보드 사이즈
export const BOARD_SIZE = 4;

// 게임 초기 타일 수
export const INITIAL_TILE_COUNT = 2;

// 새 타일 생성 확률 (백분율)
export const TILE_PROBABILITY = {
  2: 90, // 2가 생성될 확률 90%
  4: 10, // 4가 생성될 확률 10%
};

// 승리 조건 타일 값
export const WIN_TILE = 2048;

// 키보드 맵핑
export const KEY_MAPPING = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
};

// 모바일 스와이프 감지 최소 거리 (픽셀)
export const MIN_SWIPE_DISTANCE = 30;

// 애니메이션 지속 시간 (밀리초)
export const ANIMATION_DURATION = 300;

// 방향별 이동 픽셀 값 (CSS 변환용)
export const DIRECTION_TRANSFORMS = {
  UP: { x: 0, y: -100 },
  DOWN: { x: 0, y: 100 },
  LEFT: { x: -100, y: 0 },
  RIGHT: { x: 100, y: 0 },
};

// 타일 색상
export const TILE_COLORS = {
  2: {
    background: 'var(--tile-2-bg, #eee4da)',
    text: 'var(--tile-2-text, #776e65)'
  },
  4: {
    background: 'var(--tile-4-bg, #ede0c8)',
    text: 'var(--tile-4-text, #776e65)'
  },
  8: {
    background: 'var(--tile-8-bg, #f2b179)',
    text: 'var(--tile-8-text, #f9f6f2)'
  },
  16: {
    background: 'var(--tile-16-bg, #f59563)',
    text: 'var(--tile-16-text, #f9f6f2)'
  },
  32: {
    background: 'var(--tile-32-bg, #f67c5f)',
    text: 'var(--tile-32-text, #f9f6f2)'
  },
  64: {
    background: 'var(--tile-64-bg, #f65e3b)',
    text: 'var(--tile-64-text, #f9f6f2)'
  },
  128: {
    background: 'var(--tile-128-bg, #edcf72)',
    text: 'var(--tile-128-text, #f9f6f2)'
  },
  256: {
    background: 'var(--tile-256-bg, #edcc61)',
    text: 'var(--tile-256-text, #f9f6f2)'
  },
  512: {
    background: 'var(--tile-512-bg, #edc850)',
    text: 'var(--tile-512-text, #f9f6f2)'
  },
  1024: {
    background: 'var(--tile-1024-bg, #edc53f)',
    text: 'var(--tile-1024-text, #f9f6f2)'
  },
  2048: {
    background: 'var(--tile-2048-bg, #edc22e)',
    text: 'var(--tile-2048-text, #f9f6f2)'
  },
  'super': {
    background: 'var(--tile-super-bg, #3c3a32)',
    text: 'var(--tile-super-text, #f9f6f2)'
  }
};

// 애니메이션 클래스 이름
export const TILE_NEW = 'tile-new';
export const TILE_MERGE = 'tile-merge';

// 게임 메시지
export const GAME_MESSAGES = {
  WIN: '🎉 축하합니다! 2048을 달성했습니다!',
  CONTINUE: '계속 게임을 진행하시겠습니까?',
  GAME_OVER: '😢 게임 오버! 더 이상 이동할 수 없습니다.',
};

// CSS 클래스 이름
export const CSS_CLASSES = {
  BOARD: 'bg-[#bbada0] p-4 rounded-md grid gap-4',
  CELL: 'bg-[#cdc1b4] rounded-md flex items-center justify-center w-full h-full aspect-square relative',
  TILE: 'rounded-md w-full h-full flex items-center justify-center font-bold absolute transition-all',
  TILE_NEW: 'animate-scale-in',
  TILE_MERGE: 'animate-pop',
  SCORE_BOARD: 'bg-[#bbada0] text-white rounded-md p-4 flex flex-col items-center',
  SCORE_LABEL: 'text-sm font-semibold uppercase',
  SCORE_VALUE: 'text-3xl font-bold',
  BUTTON: 'bg-[#8f7a66] text-white py-3 px-6 rounded-md font-bold hover:bg-[#9f8b77] text-lg',
  GAME_CONTAINER: 'flex flex-col items-center gap-5 max-w-4xl mx-auto p-6',
  HEADING: 'text-5xl font-bold text-[#776e65] mb-4',
  CONTROLS: 'flex gap-4 mt-6',
};

// 지원하는 타일 폰트 크기 매핑
export const TILE_FONT_SIZES = {
  2: 'text-6xl',
  4: 'text-6xl',
  8: 'text-6xl',
  16: 'text-5xl',
  32: 'text-5xl',
  64: 'text-5xl',
  128: 'text-4xl',
  256: 'text-4xl',
  512: 'text-4xl',
  1024: 'text-3xl',
  2048: 'text-3xl',
  4096: 'text-3xl',
  8192: 'text-3xl',
}; 