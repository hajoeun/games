/**
 * 두 색상 사이의 중간 색상을 계산하는 함수
 * @param hex1 첫 번째 색상 (16진수)
 * @param hex2 두 번째 색상 (16진수)
 * @param ratio 혼합 비율 (0~1)
 * @returns 혼합된 색상 (16진수)
 */
export const mixColors = (hex1: string, hex2: string, ratio: number): string => {
  // 16진수 색상을 RGB로 변환
  const r1 = parseInt(hex1.substring(1, 3), 16);
  const g1 = parseInt(hex1.substring(3, 5), 16);
  const b1 = parseInt(hex1.substring(5, 7), 16);

  const r2 = parseInt(hex2.substring(1, 3), 16);
  const g2 = parseInt(hex2.substring(3, 5), 16);
  const b2 = parseInt(hex2.substring(5, 7), 16);

  // 비율에 따라 색상 혼합
  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

  // RGB를 16진수로 변환
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * 색상을 어둡게 만드는 함수
 * @param hex 원래 색상 (16진수)
 * @param percent 어둡게 할 비율 (0~100)
 * @returns 어두워진 색상 (16진수)
 */
export const darkenColor = (hex: string, percent: number): string => {
  const factor = 1 - percent / 100;
  
  // 16진수 색상을 RGB로 변환
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  // 각 색상 채널을 어둡게 함
  const darkR = Math.max(0, Math.floor(r * factor));
  const darkG = Math.max(0, Math.floor(g * factor));
  const darkB = Math.max(0, Math.floor(b * factor));

  // RGB를 16진수로 변환
  return `#${((1 << 24) + (darkR << 16) + (darkG << 8) + darkB).toString(16).slice(1)}`;
};

/**
 * 색상을 밝게 만드는 함수
 * @param hex 원래 색상 (16진수)
 * @param percent 밝게 할 비율 (0~100)
 * @returns 밝아진 색상 (16진수)
 */
export const lightenColor = (hex: string, percent: number): string => {
  const factor = percent / 100;
  
  // 16진수 색상을 RGB로 변환
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  // 각 색상 채널을 밝게 함
  const lightR = Math.min(255, Math.floor(r + (255 - r) * factor));
  const lightG = Math.min(255, Math.floor(g + (255 - g) * factor));
  const lightB = Math.min(255, Math.floor(b + (255 - b) * factor));

  // RGB를 16진수로 변환
  return `#${((1 << 24) + (lightR << 16) + (lightG << 8) + lightB).toString(16).slice(1)}`;
};

/**
 * 충돌 감지 함수 - 사각형과 원 사이의 충돌 확인
 * @param circleX 원의 중심 X 좌표
 * @param circleY 원의 중심 Y 좌표
 * @param radius 원의 반지름
 * @param rectX 사각형의 X 좌표
 * @param rectY 사각형의 Y 좌표
 * @param rectWidth 사각형의 너비
 * @param rectHeight 사각형의 높이
 * @returns 충돌 여부
 */
export const detectCollision = (
  circleX: number,
  circleY: number,
  radius: number,
  rectX: number,
  rectY: number,
  rectWidth: number,
  rectHeight: number
): boolean => {
  // 원의 중심에서 사각형의 가장 가까운 점 계산
  const closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
  const closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));

  // 원의 중심과 사각형의 가장 가까운 점 사이의 거리 계산
  const distanceX = circleX - closestX;
  const distanceY = circleY - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // 거리가 원의 반지름보다 작거나 같으면 충돌
  return distanceSquared <= radius * radius;
};

/**
 * 현재 시간을 밀리초 단위로 반환
 * @returns 현재 시간 (밀리초)
 */
export const getCurrentTime = (): number => {
  return new Date().getTime();
}; 