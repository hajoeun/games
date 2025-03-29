/**
 * 2048 게임 유틸리티 함수
 */

import { BOARD_SIZE, INITIAL_TILE_COUNT, TILE_PROBABILITY, WIN_TILE } from './constants';
import { Board, Cell, Direction, MoveResult, Row, TileInfo, TilePosition } from './types';

// 전역 카운터 변수 추가 (타일 ID용)
let tileIdCounter = 0;

/**
 * 초기 빈 보드 생성
 * @returns 초기화된 빈 보드
 */
export const createEmptyBoard = (): Board => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
};

/**
 * 새 게임 보드 생성 (초기 타일 배치)
 * @returns 초기 타일이 배치된 게임 보드
 */
export const createNewGame = (): Board => {
  let board = createEmptyBoard();
  
  // 타일 생성이 제대로 되지 않는 경우를 대비하여 최대 시도 횟수 설정
  let maxAttempts = 10;
  
  for (let i = 0; i < INITIAL_TILE_COUNT; i++) {
    let attempts = 0;
    let initialTileAdded = false;
    
    while (!initialTileAdded && attempts < maxAttempts) {
      const newBoard = addRandomTile(board);
      
      // 타일이 추가되었는지 확인
      let tileAdded = false;
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          if (board[row][col] === 0 && newBoard[row][col] !== 0) {
            tileAdded = true;
            break;
          }
        }
        if (tileAdded) break;
      }
      
      if (tileAdded) {
        board = newBoard;
        initialTileAdded = true;
      } else {
        attempts++;
      }
    }
    
    if (!initialTileAdded) {
      // 비상 대책: 강제로 빈 셀에 타일 배치
      const emptyCells = getEmptyCells(board);
      if (emptyCells.length > 0) {
        const { row, col } = emptyCells[0];
        board[row][col] = 2; // 기본값 2 배치
      }
    }
  }
  
  // 최종 보드 상태 확인
  let activeTiles = 0;
  board.forEach(row => {
    activeTiles += row.filter(cell => cell !== 0).length;
  });
  
  // 혹시라도 타일이 하나도 생성되지 않았다면 강제로 타일 추가
  if (activeTiles === 0) {
    board[0][0] = 2;
    board[0][1] = 2;
  }
  
  return board;
};

/**
 * 보드에 랜덤 타일 추가
 * @param board 현재 게임 보드
 * @returns 타일이 추가된 새 게임 보드
 */
export const addRandomTile = (board: Board): Board => {
  // 깊은 복사로 새 보드 생성
  const newBoard = JSON.parse(JSON.stringify(board));
  const emptyCells = getEmptyCells(newBoard);
  
  if (emptyCells.length === 0) {
    return newBoard;
  }
  
  // 빈 위치 랜덤 선택
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { row, col } = emptyCells[randomIndex];
  
  // 확률에 따라 2 또는 4 생성
  const randomNumber = Math.random() * 100;
  const newValue = randomNumber < TILE_PROBABILITY[2] ? 2 : 4;
  newBoard[row][col] = newValue;
  
  return newBoard;
};

/**
 * 보드의 빈 셀 위치 반환
 * @param board 게임 보드
 * @returns 빈 셀 위치 배열 [{row, col}, ...]
 */
export const getEmptyCells = (board: Board): { row: number; col: number }[] => {
  const emptyCells: { row: number; col: number }[] = [];
  
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  
  return emptyCells;
};

/**
 * 보드 행 회전 (방향에 따라)
 * @param board 현재 게임 보드
 * @param direction 회전 방향
 * @returns 회전된 보드
 */
export const rotateBoard = (board: Board, direction: Direction): Board => {
  const size = board.length;
  const rotatedBoard: Board = createEmptyBoard();
  
  switch (direction) {
    case Direction.LEFT:
      // 그대로 반환 (LEFT 방향은 회전 불필요)
      return board.map(row => [...row]);
    
    case Direction.RIGHT:
      // 180도 회전 (오른쪽은 행을 뒤집어 계산 후 다시 회전)
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          rotatedBoard[row][size - 1 - col] = board[row][col];
        }
      }
      return rotatedBoard;
    
    case Direction.UP:
      // 90도 반시계 회전 (위는 행을 열로 변환)
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          rotatedBoard[col][size - 1 - row] = board[row][col];
        }
      }
      return rotatedBoard;
    
    case Direction.DOWN:
      // 90도 시계 회전 (아래쪽을 왼쪽으로 변환)
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          // 수정된 회전 공식: (row, col) -> (size-1-col, row)
          // DOWN 방향을 LEFT로 변환하기 위한 정확한 90도 시계 회전
          rotatedBoard[size - 1 - col][row] = board[row][col];
        }
      }
      return rotatedBoard;
    
    default:
      return board.map(row => [...row]);
  }
};

/**
 * 보드를 원래 방향으로 역회전
 * @param board 회전된 게임 보드
 * @param direction 원래 회전 방향
 * @returns 원래 방향으로 복원된 보드
 */
export const unrotateBoard = (board: Board, direction: Direction): Board => {
  const size = board.length;
  const unrotatedBoard: Board = createEmptyBoard();
  
  switch (direction) {
    case Direction.LEFT:
      // 그대로 반환
      return board.map(row => [...row]);
    
    case Direction.RIGHT:
      // 180도 회전 복구
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          unrotatedBoard[row][size - 1 - col] = board[row][col];
        }
      }
      return unrotatedBoard;
    
    case Direction.UP:
      // 90도 시계 회전 (반시계의 반대)
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          unrotatedBoard[size - 1 - col][row] = board[row][col];
        }
      }
      return unrotatedBoard;
    
    case Direction.DOWN:
      // 90도 반시계 역회전 (시계 회전의 반대)
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          // 수정된 역회전 공식: 90도 시계 회전의 역변환
          // [size-1-col][row] -> [row][col]로 복원
          unrotatedBoard[col][size - 1 - row] = board[row][col];
        }
      }
      return unrotatedBoard;
    
    default:
      return board.map(row => [...row]);
  }
};

/**
 * 보드 상태를 문자열로 변환 (디버깅용)
 * @param board 게임 보드
 * @returns 보드를 텍스트로 표현한 문자열
 */
export const boardToString = (board: Board): string => {
  return board.map(row => row.join(' | ')).join('\n');
};

/**
 * 타일 객체 생성
 * @param position 타일 위치
 * @param value 타일 값
 * @returns 타일 객체
 */
export const createTile = (position: TilePosition, value: number): TileInfo => {
  return {
    id: `tile-${++tileIdCounter}`,
    value,
    position,
    previousPosition: undefined,
    isNew: true,
    mergedFrom: undefined
  };
};

/**
 * 보드를 타일 배열로 변환
 * @param board 게임 보드
 * @returns 타일 객체 배열
 */
export const boardToTiles = (board: Board): TileInfo[] => {
  const tiles: TileInfo[] = [];
  
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const value = board[row][col];
      if (value !== 0) {
        const tile = createTile({ row, col }, value);
        tiles.push(tile);
      }
    }
  }
  
  return tiles;
};

/**
 * 보드에서 현재 최대 타일 값 찾기
 * @param board 게임 보드
 * @returns 최대 타일 값
 */
export const getMaxTileValue = (board: Board): number => {
  let maxValue = 0;
  
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      maxValue = Math.max(maxValue, board[row][col]);
    }
  }
  
  return maxValue;
};

/**
 * 게임 승리 여부 확인
 * @param board 게임 보드
 * @returns 승리 여부
 */
export const checkWin = (board: Board): boolean => {
  // 최대 타일 값이 WIN_TILE 이상이면 승리
  return getMaxTileValue(board) >= WIN_TILE;
};

/**
 * 게임 오버 여부 확인
 * @param board 게임 보드
 * @returns 게임 오버 여부
 */
export const checkGameOver = (board: Board): boolean => {
  // 빈 셀이 있으면 게임이 끝나지 않음
  if (getEmptyCells(board).length > 0) {
    return false;
  }
  
  // 모든 방향으로 이동 가능한지 확인
  for (const direction of [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT]) {
    const result = moveBoard(board, direction);
    if (result.moved) {
      return false;
    }
  }
  
  // 더 이상 이동할 수 없으면 게임 오버
  return true;
};

/**
 * 행 이동 처리 (왼쪽으로)
 * @param row 처리할 행
 * @returns 이동 결과 객체 {row, moved, score}
 */
export const moveRow = (row: Row): { row: Row; moved: boolean; score: number } => {
  let moved = false;
  let score = 0;
  
  // 기존 행 복사
  const originalRow = [...row];
  
  // 0이 아닌 값만 추출
  const nonZeroTiles = row.filter(tile => tile !== 0);
  
  // 병합 로직: 왼쪽부터 같은 값이 연속되면 병합
  const mergedRow: number[] = [];
  
  for (let i = 0; i < nonZeroTiles.length; i++) {
    const current = nonZeroTiles[i];
    
    // 다음 타일이 있고 값이 같으면 병합
    if (i + 1 < nonZeroTiles.length && current === nonZeroTiles[i + 1]) {
      const mergedValue = current * 2;
      mergedRow.push(mergedValue);
      score += mergedValue; // 병합된 값만큼 점수 추가
      i++; // 다음 타일은 이미 병합했으므로 건너뜀
    } else {
      mergedRow.push(current);
    }
  }
  
  // 결과 행 생성 (왼쪽 정렬 후 남은 공간은 0으로 채움)
  const resultRow = [
    ...mergedRow,
    ...Array(row.length - mergedRow.length).fill(0)
  ];
  
  // 이동 여부 확인 (원래 행과 비교)
  moved = !originalRow.every((value, index) => value === resultRow[index]);
  
  return { row: resultRow, moved, score };
};

/**
 * 보드 이동 처리
 * @param board 게임 보드
 * @param direction 이동 방향
 * @returns 이동 결과 객체 {board, moved, score}
 */
export const moveBoard = (board: Board, direction: Direction): MoveResult => {
  let moved = false;
  let score = 0;
  
  // 회전된 보드 생성 (모든 방향을 LEFT로 통일하여 처리)
  const rotatedBoard = rotateBoard(board, direction);
  
  // 각 행을 처리하고 결과 저장
  const newBoard: Board = [];
  
  for (let i = 0; i < rotatedBoard.length; i++) {
    const { row: newRow, moved: rowMoved, score: rowScore } = moveRow(rotatedBoard[i]);
    newBoard.push(newRow);
    
    if (rowMoved) {
      moved = true;
    }
    
    score += rowScore;
  }
  
  // 처리된 보드를 원래 방향으로 되돌림
  const resultBoard = unrotateBoard(newBoard, direction);
  
  return { board: resultBoard, moved, score };
};

/**
 * 게임 상태 저장하기
 * @param boardState 보드 상태
 * @param score 현재 점수
 */
export const saveGameState = (boardState: Board, score: number): void => {
  const gameState = {
    board: boardState,
    score,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem('game2048_state', JSON.stringify(gameState));
  } catch (e) {
    // 로컬 스토리지 오류 처리
  }
};

/**
 * 게임 상태 불러오기
 * @returns 저장된 게임 상태 또는 null
 */
export const loadGameState = (): { board: Board; score: number } | null => {
  try {
    const savedState = localStorage.getItem('game2048_state');
    if (!savedState) return null;
    
    const gameState = JSON.parse(savedState);
    return {
      board: gameState.board,
      score: gameState.score
    };
  } catch (e) {
    return null;
  }
}; 