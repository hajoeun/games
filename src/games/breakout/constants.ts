// 게임 설정 상수
export const PADDLE_WIDTH = 75;
export const PADDLE_HEIGHT = 10;
export const PADDLE_SPEED = 7;
export const BALL_RADIUS = 6;
export const BALL_SPEED = 5;
export const BRICK_ROW_COUNT = 6;
export const BRICK_COLUMN_COUNT = 10;
export const BRICK_WIDTH = 75;
export const BRICK_HEIGHT = 20;
export const BRICK_PADDING = 4;
export const BRICK_OFFSET_TOP = 60;
export const BRICK_OFFSET_LEFT = 25;
export const STAR_COUNT = 100;

// 색상 설정 - 3D 입체 스타일
export const GAME_COLORS = {
  background: '#000033',  // 어두운 심우주 배경색
  stars: ['#FFFFFF', '#CCCCFF', '#AAAAFF', '#FFFFAA'], // 별 색상
  ball: {
    main: '#FFFFFF',      // 흰색 공
    glow: '#99CCFF'       // 공 주변 글로우 효과
  },
  paddle: {
    top: '#FFDD33',       // 패들 상단 (밝은 노란색)
    bottom: '#FF9900',    // 패들 하단 (어두운 노란색)
    glow: '#FFCC00'       // 패들 주변 글로우 효과
  },
  brick: {
    row1: { top: '#FF3333', bottom: '#CC0000' }, // 빨간색 계열
    row2: { top: '#FF9933', bottom: '#CC6600' }, // 주황색 계열
    row3: { top: '#FFFF33', bottom: '#CCCC00' }, // 노란색 계열
    row4: { top: '#33FF33', bottom: '#00CC00' }, // 초록색 계열
    row5: { top: '#33CCFF', bottom: '#0099CC' }, // 파란색 계열
    row6: { top: '#9933FF', bottom: '#6600CC' }, // 보라색 계열
  },
  border: '#333366',      // 테두리 색상
}; 