import { 
  TetrominoType, 
  TETROMINOS, 
  BOARD_WIDTH, 
  BOARD_HEIGHT,
  LEVEL_SPEEDS,
  TETROMINO_COLORS
} from './constants';
import { Board, Cell, Tetromino } from './types';

// 빈 게임 보드 생성
export const createEmptyBoard = (): Board => {
  const board: Board = [];
  
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < BOARD_WIDTH; x++) {
      row.push({ filled: false, color: '', type: null });
    }
    board.push(row);
  }
  
  return board;
};

// 랜덤 테트로미노 생성
export const createRandomTetromino = (): Tetromino => {
  const types = Object.values(TetrominoType);
  const randomType = types[Math.floor(Math.random() * types.length)];
  const shape = TETROMINOS[randomType].shape;
  
  return {
    type: randomType,
    shape: shape,
    position: {
      x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
      y: 0
    },
    rotation: 0
  };
};

// 테트로미노 시드를 사용하여 고정된 순서로 생성
export const createTetrominoWithSeed = (seed: number): Tetromino => {
  const types = Object.values(TetrominoType);
  const type = types[seed % types.length];
  
  return {
    type,
    shape: TETROMINOS[type].shape,
    position: {
      x: Math.floor((BOARD_WIDTH - TETROMINOS[type].width) / 2),
      y: 0
    },
    rotation: 0
  };
};

// 테트로미노 회전
export const rotateTetromino = (tetromino: Tetromino): Tetromino => {
  // O 조각은 회전하지 않음
  if (tetromino.type === TetrominoType.O) {
    return tetromino;
  }
  
  const { shape } = tetromino;
  const newShape: number[][] = [];
  const size = shape.length;
  
  // 2D 배열 회전 (시계 방향 90도)
  for (let y = 0; y < size; y++) {
    const newRow: number[] = [];
    for (let x = size - 1; x >= 0; x--) {
      newRow.push(shape[x][y]);
    }
    newShape.push(newRow);
  }

  // I 블록의 경우 회전 중심을 조정
  if (tetromino.type === TetrominoType.I) {
    // I 블록의 회전 상태에 따라 위치 조정
    const rotationState = (tetromino.rotation + 1) % 4;
    switch (rotationState) {
      case 1: // 세로로 회전
        for (let i = 0; i < size; i++) {
          newShape[i][1] = newShape[i][2];
          newShape[i][2] = 0;
        }
        break;
      case 2: // 거꾸로 회전
        break;
      case 3: // 세로로 회전 (반대 방향)
        for (let i = 0; i < size; i++) {
          newShape[i][2] = newShape[i][1];
          newShape[i][1] = 0;
        }
        break;
      case 0: // 원래 위치로
        break;
    }
  }
  
  return {
    ...tetromino,
    shape: newShape,
    rotation: (tetromino.rotation + 1) % 4
  };
};

// 충돌 감지
export const isColliding = (
  board: Board, 
  tetromino: Tetromino, 
  offsetX = 0, 
  offsetY = 0
): boolean => {
  const { shape, position } = tetromino;
  
  console.log('충돌 검사:', {
    tetrominoType: tetromino.type,
    position,
    offsetX,
    offsetY
  });
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      // 테트로미노의 현재 조각이 채워져 있는지 확인
      if (shape[y][x] !== 0) {
        const boardX = position.x + x + offsetX;
        const boardY = position.y + y + offsetY;
        
        // 보드 경계 체크
        if (
          boardX < 0 || 
          boardX >= BOARD_WIDTH || 
          boardY >= BOARD_HEIGHT
        ) {
          console.log('경계 충돌:', { boardX, boardY });
          return true;
        }
        
        // 이미 채워진 셀과 충돌 체크
        if (boardY >= 0 && board[boardY][boardX].filled) {
          console.log('블록 충돌:', { boardX, boardY });
          return true;
        }
      }
    }
  }
  
  return false;
};

// 테트로미노를 보드에 고정
export const lockTetromino = (board: Board, tetromino: Tetromino): Board => {
  const newBoard = [...board.map(row => [...row])];
  const { shape, position, type } = tetromino;
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const boardY = position.y + y;
        const boardX = position.x + x;
        
        // 보드 범위 내에 있는지 확인
        if (
          boardY >= 0 && 
          boardY < BOARD_HEIGHT && 
          boardX >= 0 && 
          boardX < BOARD_WIDTH
        ) {
          newBoard[boardY][boardX] = {
            filled: true,
            color: TETROMINO_COLORS[type],
            type
          };
        }
      }
    }
  }
  
  return newBoard;
};

// 완성된 줄 체크 및 제거
export const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  let linesCleared = 0;
  const newBoard = [...board];
  
  // 아래에서부터 각 줄을 검사하여 완성된 줄 제거
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    const isLineComplete = newBoard[y].every(cell => cell.filled);
    
    if (isLineComplete) {
      linesCleared++;
      
      // 완성된 줄을 제거하고 위에 있는 모든 줄을 한 칸씩 아래로 이동
      for (let yy = y; yy > 0; yy--) {
        newBoard[yy] = [...newBoard[yy - 1]];
      }
      
      // 맨 위 새 줄을 빈 줄로 채움
      newBoard[0] = Array(BOARD_WIDTH).fill(null).map(() => ({ 
        filled: false, 
        color: '', 
        type: null 
      }));
      
      // 라인을 제거했으므로 같은 y 위치를 다시 확인 (라인이 내려왔을 수 있음)
      y++;
    }
  }
  
  return { newBoard, linesCleared };
};

// 고스트 조각(미리보기)의 위치 계산
export const calculateGhostPosition = (board: Board, tetromino: Tetromino): number => {
  let ghostY = 0;
  
  // 테트로미노가 충돌할 때까지 아래로 이동
  while (!isColliding(board, tetromino, 0, ghostY + 1)) {
    ghostY++;
  }
  
  return ghostY;
};

// 레벨에 따른 게임 속도 계산
export const getSpeedByLevel = (level: number): number => {
  // 레벨이 최대 레벨보다 높은 경우 최대 속도 반환
  if (level >= LEVEL_SPEEDS.length) {
    return LEVEL_SPEEDS[LEVEL_SPEEDS.length - 1];
  }
  
  return LEVEL_SPEEDS[level - 1];
};

// 로컬 스토리지에 게임 기록 저장
export const saveGameStats = (score: number, level: number, lines: number): void => {
  const highScore = parseInt(localStorage.getItem('tetris_highScore') || '0', 10);
  const highLevel = parseInt(localStorage.getItem('tetris_highLevel') || '0', 10);
  const totalLines = parseInt(localStorage.getItem('tetris_totalLines') || '0', 10);
  const gamesPlayed = parseInt(localStorage.getItem('tetris_gamesPlayed') || '0', 10);
  
  // 최고 점수 업데이트
  if (score > highScore) {
    localStorage.setItem('tetris_highScore', score.toString());
  }
  
  // 최고 레벨 업데이트
  if (level > highLevel) {
    localStorage.setItem('tetris_highLevel', level.toString());
  }
  
  // 총 제거한 줄 수 업데이트
  localStorage.setItem('tetris_totalLines', (totalLines + lines).toString());
  
  // 플레이한 게임 수 업데이트
  localStorage.setItem('tetris_gamesPlayed', (gamesPlayed + 1).toString());
  
  // 마지막 플레이 날짜 저장
  localStorage.setItem('tetris_lastPlayed', new Date().toISOString());
};

// 로컬 스토리지에서 게임 기록 로드
export const loadGameStats = () => {
  return {
    highScore: parseInt(localStorage.getItem('tetris_highScore') || '0', 10),
    highLevel: parseInt(localStorage.getItem('tetris_highLevel') || '0', 10),
    totalLines: parseInt(localStorage.getItem('tetris_totalLines') || '0', 10),
    gamesPlayed: parseInt(localStorage.getItem('tetris_gamesPlayed') || '0', 10),
    lastPlayed: localStorage.getItem('tetris_lastPlayed') || null
  };
}; 