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
 * 보드 역회전 (원래 형태로 복구)
 * @param board 회전된 게임 보드
 * @param direction 원래 회전 방향
 * @returns 원래 방향으로 복구된 보드
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
          unrotatedBoard[row][col] = board[row][size - 1 - col];
        }
      }
      return unrotatedBoard;
    
    case Direction.UP:
      // 90도 시계 회전 (반시계의 반대)
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          unrotatedBoard[col][row] = board[size - 1 - row][col];
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
 * 한 행의 타일을 병합
 * 1. 먼저 0을 제거하여 타일을 왼쪽으로
 * 2. 같은 값의 인접한 타일들을 병합
 * 3. 남은 공간에 0을 채움
 */
export const mergeRow = (row: Row): { row: Row; score: number } => {
  const originalRow = [...row];
  let score = 0;
  
  // 1단계: 0 제거하여 타일을 왼쪽으로 이동
  let filteredRow = row.filter(cell => cell !== 0);
  
  // 2단계: 같은 값의 인접한 타일들을 병합
  const mergedRow: Row = [];
  
  // 수정된 병합 알고리즘
  for (let i = 0; i < filteredRow.length; i++) {
    // 현재 타일이 마지막이 아니고 다음 타일과 같은 값인 경우 병합
    if (i < filteredRow.length - 1 && filteredRow[i] === filteredRow[i + 1]) {
      const mergedValue = filteredRow[i] * 2;
      mergedRow.push(mergedValue);
      score += mergedValue; // 점수 추가
      i++; // 다음 값은 이미 병합했으므로 건너뜀
    } else {
      // 병합할 수 없는 경우 그대로 추가
      mergedRow.push(filteredRow[i]);
    }
  }
  
  // 3단계: 남은 공간에 0을 채움
  while (mergedRow.length < row.length) {
    mergedRow.push(0);
  }
  
  
  return { row: mergedRow, score };
};

/**
 * 전체 보드의 모든 행을 병합
 */
export const mergeBoard = (board: Board): MoveResult => {
  
  
  let newBoard = board.map(row => [...row]);
  let score = 0;
  let moved = false;
  
  // 각 행 병합 처리
  for (let i = 0; i < board.length; i++) {
    const { row: newRow, score: rowScore } = mergeRow(board[i]);
    
    // 행이 변경되었는지 확인
    const rowChanged = !rowsEqual(board[i], newRow);
    if (rowChanged) {
      moved = true;
      newBoard[i] = newRow;
    }
    
    score += rowScore;
  }
  
  return { board: newBoard, score, moved };
};

/**
 * 두 행이 동일한지 비교
 * @param row1 행 1
 * @param row2 행 2
 * @returns 두 행의 일치 여부
 */
export const rowsEqual = (row1: Row, row2: Row): boolean => {
  if (row1.length !== row2.length) return false;
  
  for (let i = 0; i < row1.length; i++) {
    if (row1[i] !== row2[i]) return false;
  }
  
  return true;
};

/**
 * 지정된 방향으로 보드를 이동하고 병합
 * 각 방향별로 직접 처리하는 방식으로 변경
 */
export const moveBoard = (board: Board, direction: Direction): MoveResult => {
  
  // 깊은 복사를 통해 새 보드 생성
  const newBoard: Board = JSON.parse(JSON.stringify(board));
  let score = 0;
  let moved = false;
  
  const size = board.length;
  
  switch (direction) {
    case Direction.LEFT:
      // 왼쪽으로 이동: 각 행을 왼쪽으로 병합
      for (let row = 0; row < size; row++) {
        const { row: newRow, score: rowScore } = mergeRow(board[row]);
        const rowChanged = !rowsEqual(board[row], newRow);
        if (rowChanged) {
          moved = true;
          newBoard[row] = newRow;
          score += rowScore;
        }
      }
      break;
      
    case Direction.RIGHT:
      // 오른쪽으로 이동: 각 행을 뒤집고, 왼쪽으로 병합한 후, 다시 뒤집음
      for (let row = 0; row < size; row++) {
        // 행을 뒤집음
        const reversedRow = [...board[row]].reverse();
        // 뒤집은 행을 왼쪽으로 병합
        const { row: mergedReversedRow, score: rowScore } = mergeRow(reversedRow);
        // 결과를 다시 뒤집어서 원래 방향으로 복원
        const resultRow = [...mergedReversedRow].reverse();
        
        const rowChanged = !rowsEqual(board[row], resultRow);
        if (rowChanged) {
          moved = true;
          newBoard[row] = resultRow;
          score += rowScore;
        }
      }
      break;
      
    case Direction.UP:
      // 위로 이동: 각 열을 행으로 변환하여 왼쪽으로 병합한 후, 다시 열로 변환
      for (let col = 0; col < size; col++) {
        // 열을 행으로 변환
        const columnAsRow: Row = [];
        for (let row = 0; row < size; row++) {
          columnAsRow.push(board[row][col]);
        }
        
        // 변환된 행을 왼쪽으로 병합
        const { row: mergedRow, score: rowScore } = mergeRow(columnAsRow);
        
        // 변경 여부 확인
        let columnChanged = false;
        for (let row = 0; row < size; row++) {
          if (board[row][col] !== mergedRow[row]) {
            columnChanged = true;
            break;
          }
        }
        
        // 변경된 경우에만 보드와 점수 업데이트
        if (columnChanged) {
          moved = true;
          for (let row = 0; row < size; row++) {
            newBoard[row][col] = mergedRow[row];
          }
          score += rowScore;
        }
      }
      break;
      
    case Direction.DOWN:
      // 아래로 이동: 각 열을 행으로 변환하고 뒤집은 후, 왼쪽으로 병합하고 다시 뒤집어서 열로 변환
      for (let col = 0; col < size; col++) {
        // 열을 행으로 변환
        const columnAsRow: Row = [];
        for (let row = 0; row < size; row++) {
          columnAsRow.push(board[row][col]);
        }
        
        // 행을 뒤집음 (아래에서 위로 처리하기 위해)
        const reversedColumn = [...columnAsRow].reverse();
        
        // 뒤집은 행을 왼쪽으로 병합
        const { row: mergedReversedColumn, score: rowScore } = mergeRow(reversedColumn);
        
        // 결과를 다시 뒤집어서 원래 방향으로 복원
        const resultColumn = [...mergedReversedColumn].reverse();
        
        // 변경 여부 확인
        let columnChanged = false;
        for (let row = 0; row < size; row++) {
          if (board[row][col] !== resultColumn[row]) {
            columnChanged = true;
            break;
          }
        }
        
        // 변경된 경우에만 보드와 점수 업데이트
        if (columnChanged) {
          moved = true;
          for (let row = 0; row < size; row++) {
            newBoard[row][col] = resultColumn[row];
          }
          score += rowScore;
        }
      }
      break;
  }
  
  
  return { board: newBoard, score, moved };
};

/**
 * 게임이 승리 조건을 달성했는지 확인
 * @param board 게임 보드
 * @returns 승리 조건 달성 여부
 */
export const hasWon = (board: Board): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] >= WIN_TILE) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * 더 이상 이동 가능한지 확인
 * @param board 게임 보드
 * @returns 이동 가능 여부
 */
export const canMove = (board: Board): boolean => {
  // 1. 빈 셀이 있으면 이동 가능
  if (getEmptyCells(board).length > 0) {
    return true;
  }
  
  // 2. 인접한 같은 타일이 있으면 이동 가능
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const value = board[row][col];
      
      // 오른쪽 타일과 비교
      if (col < board[0].length - 1 && board[row][col + 1] === value) {
        return true;
      }
      
      // 아래 타일과 비교
      if (row < board.length - 1 && board[row + 1][col] === value) {
        return true;
      }
    }
  }
  
  // 모든 검사를 통과한 경우 더 이상 이동할 수 없음
  return false;
};

/**
 * 게임 보드를 주어진 방향으로 이동하고 병합
 * @param board 게임 보드
 * @param direction 이동 방향
 * @returns 이동 결과 (보드, 점수, 변동 여부)
 */
export const moveBoardOld = (board: Board, direction: Direction): MoveResult => {
  
  // 1. 보드 회전 - 모든 방향을 LEFT로 통일해서 처리하기 위함
  const rotatedBoard = rotateBoard(board, direction);
  
  // 2. 모든 행을 왼쪽으로 이동 및 병합
  
  const { board: mergedBoard, score, moved } = mergeBoard(rotatedBoard);

  // 3. 회전된 보드를 원래 방향으로 되돌림
  
  const resultBoard = unrotateBoard(mergedBoard, direction);
  return { board: resultBoard, score, moved };
};

/**
 * 게임 보드를 문자열로 직렬화 (디버깅용)
 * @param board 게임 보드
 * @returns 문자열 표현
 */
export const boardToString = (board: Board): string => {
  return board.map(row => row.join(' ')).join('\n');
};

/**
 * 로컬 스토리지에서 최고 점수 가져오기
 * @returns 저장된 최고 점수
 */
export const getBestScore = (): number => {
  const bestScore = localStorage.getItem('2048_best_score');
  return bestScore ? parseInt(bestScore, 10) : 0;
};

/**
 * 로컬 스토리지에 최고 점수 저장
 * @param score 새 점수
 */
export const saveBestScore = (score: number): void => {
  const bestScore = getBestScore();
  if (score > bestScore) {
    localStorage.setItem('2048_best_score', score.toString());
  }
};

/**
 * 고유 ID 생성 유틸리티 함수
 * @returns 고유한 ID 문자열
 */
export const generateUniqueId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  tileIdCounter++;
  return `${timestamp}-${tileIdCounter}-${random}`;
};

/**
 * 위치와 값으로 타일 객체 생성
 * @param position 타일 위치
 * @param value 타일 값
 * @returns 타일 객체
 */
export const createTile = (position: TilePosition, value: number): TileInfo => {
  const uniqueId = `tile-${position.row}-${position.col}-${generateUniqueId()}`;
  
  return {
    id: uniqueId,
    position,
    value,
    isNew: true,
  };
};

/**
 * 보드로부터 타일 객체 배열 생성
 * @param board 게임 보드
 * @returns 타일 정보 배열
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
 * 타일을 업데이트된 보드에 맞게 조정
 * @param previousTiles 이전 타일 배열
 * @param newBoard 업데이트된 보드
 * @returns 업데이트된 타일 배열
 */
export const updateTiles = (previousTiles: TileInfo[], newBoard: Board): TileInfo[] => {  
  // 사용된 타일 ID 추적
  const usedIds = new Set<string>();
  
  // 새 타일 배열 준비
  const newTiles: TileInfo[] = [];
  
  // 이전 타일을 새로운 보드 상태와 비교하여 유지, 이동, 병합 여부 결정
  const usedPositions = new Map<string, TileInfo>(); // 이미 처리된 위치 추적
  
  // 기존 타일을 이용해 최대한 매칭
  for (const oldTile of previousTiles) {
    const { row: oldRow, col: oldCol } = oldTile.position;
    const oldValue = oldTile.value;
    const oldPosKey = `${oldRow},${oldCol}`;
    
    // 이 타일이 이미 사용되었는지 확인
    if (usedIds.has(oldTile.id)) {
      continue;
    }
    
    // 같은 위치에 같은 값이 있는지 확인
    if (newBoard[oldRow][oldCol] === oldValue) {
      const posKey = `${oldRow},${oldCol}`;
      
      if (!usedPositions.has(posKey)) {
        // 타일이 그 자리에 유지됨
        const updatedTile = {
          ...oldTile,
          isNew: false,
          mergedFrom: undefined,
          previousPosition: undefined
        };
        
        newTiles.push(updatedTile);
        usedPositions.set(posKey, updatedTile);
        usedIds.add(oldTile.id);
        
        continue;
      }
    }
    
    // 타일이 이동했는지 확인 (가장 가까운 위치의 같은 값을 찾음)
    let bestDistance = Infinity;
    let bestPos: TilePosition | null = null;
    
    for (let row = 0; row < newBoard.length; row++) {
      for (let col = 0; col < newBoard[0].length; col++) {
        const value = newBoard[row][col];
        const posKey = `${row},${col}`;
        
        // 같은 값이고 아직 처리되지 않은 위치인지 확인
        if (value === oldValue && !usedPositions.has(posKey)) {
          // Manhattan 거리 계산
          const distance = Math.abs(row - oldRow) + Math.abs(col - oldCol);
          
          if (distance < bestDistance) {
            bestDistance = distance;
            bestPos = { row, col };
          }
        }
      }
    }
    
    if (bestPos) {
      // 타일이 이동된 것으로 간주
      const posKey = `${bestPos.row},${bestPos.col}`;
      const updatedTile = {
        ...oldTile,
        position: { ...bestPos },
        previousPosition: { ...oldTile.position },
        isNew: false,
        mergedFrom: undefined
      };
      
      newTiles.push(updatedTile);
      usedPositions.set(posKey, updatedTile);
      usedIds.add(oldTile.id);
      
    }
  }
  
  // 병합 타일 생성
  for (let row = 0; row < newBoard.length; row++) {
    for (let col = 0; col < newBoard[0].length; col++) {
      const value = newBoard[row][col];
      const posKey = `${row},${col}`;
      
      // 값이 있고 아직 처리되지 않은 위치라면
      if (value !== 0 && !usedPositions.has(posKey)) {
        // 값이 4 이상이고 2의 배수인 경우 병합으로 간주
        if (value >= 4 && (value & (value - 1)) === 0) { // 2의 거듭제곱인지 확인
          const halfValue = value / 2;
          
          // 이 셀 주변에서 병합 후보 찾기
          const mergeCandidates = previousTiles.filter(t => 
            t.value === halfValue && 
            !usedIds.has(t.id) && 
            Math.abs(t.position.row - row) + Math.abs(t.position.col - col) <= 3 // 가까운 타일만 고려
          );
          
          if (mergeCandidates.length >= 2) {
            // 거리순으로 정렬
            mergeCandidates.sort((a, b) => {
              const distA = Math.abs(a.position.row - row) + Math.abs(a.position.col - col);
              const distB = Math.abs(b.position.row - row) + Math.abs(b.position.col - col);
              return distA - distB;
            });
            
            // 가장 가까운 두 개 선택
            const [source1, source2] = mergeCandidates.slice(0, 2);
            
            // 병합 타일 생성
            const newId = `tile-${row}-${col}-merged-${generateUniqueId()}`;
            
            // 병합 애니메이션을 위한 정보 포함
            const mergedTile: TileInfo = {
              id: newId,
              value,
              position: { row, col },
              previousPosition: { ...source1.position }, // 첫 번째 소스 위치에서 시작
              isNew: false,
              mergedFrom: [
                { ...source1 },
                { ...source2 }
              ]
            };
            
            newTiles.push(mergedTile);
            usedPositions.set(posKey, mergedTile);
            usedIds.add(source1.id);
            usedIds.add(source2.id);
            
          } else {
            // 적절한 병합 소스가 없으면 새 타일로 처리
            const newTile = createTile({ row, col }, value);
            newTiles.push(newTile);
            usedPositions.set(posKey, newTile);
            
            
          }
        } else {
          // 새 타일 추가
          const newTile = createTile({ row, col }, value);
          newTiles.push(newTile);
          usedPositions.set(posKey, newTile);

        }
      }
    }
  }
  
  
  
  // 중복 위치 확인
  const positionCounts = new Map<string, number>();
  newTiles.forEach(tile => {
    const posKey = `${tile.position.row},${tile.position.col}`;
    positionCounts.set(posKey, (positionCounts.get(posKey) || 0) + 1);
  });

  
  return newTiles;
};

/**
 * 타일 ID로 이동 거리 계산 (애니메이션용)
 * @param previousPosition 이동 전 위치
 * @param currentPosition 현재 위치
 * @returns 이동 거리 (셀 단위)
 */
export const calculateOffset = (previousPosition: TilePosition, currentPosition: TilePosition): { x: number, y: number } => {
  return {
    x: currentPosition.col - previousPosition.col,
    y: currentPosition.row - previousPosition.row
  };
}; 