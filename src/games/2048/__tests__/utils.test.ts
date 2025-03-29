/**
 * 2048 게임 유틸리티 함수 테스트
 */

import { BOARD_SIZE } from '../constants';
import { Direction } from '../types';
import {
  addRandomTile,
  canMove,
  createEmptyBoard,
  createNewGame,
  getEmptyCells,
  hasWon,
  mergeBoard,
  mergeRow,
  moveBoard,
  rotateBoard,
  rowsEqual,
  unrotateBoard,
} from '../utils';

describe('2048 게임 유틸리티 함수 테스트', () => {
  describe('createEmptyBoard', () => {
    it('4x4 빈 보드를 생성해야 함', () => {
      const board = createEmptyBoard();
      expect(board.length).toBe(BOARD_SIZE);
      
      for (let i = 0; i < BOARD_SIZE; i++) {
        expect(board[i].length).toBe(BOARD_SIZE);
        for (let j = 0; j < BOARD_SIZE; j++) {
          expect(board[i][j]).toBe(0);
        }
      }
    });
  });
  
  describe('createNewGame', () => {
    it('초기 타일이 2개 있는 보드를 생성해야 함', () => {
      const board = createNewGame();
      const emptyCells = getEmptyCells(board);
      
      // 4x4 보드에서 2개 타일 생성 후 빈 칸은 14개여야 함
      expect(emptyCells.length).toBe(BOARD_SIZE * BOARD_SIZE - 2);
    });
  });
  
  describe('addRandomTile', () => {
    it('빈 칸에 2 또는 4 타일을 하나 추가해야 함', () => {
      const board = createEmptyBoard();
      const newBoard = addRandomTile(board);
      
      // 빈 칸이 하나 줄어야 함
      const emptyCellsBefore = getEmptyCells(board);
      const emptyCellsAfter = getEmptyCells(newBoard);
      expect(emptyCellsAfter.length).toBe(emptyCellsBefore.length - 1);
      
      // 추가된 타일은 2 또는 4여야 함
      let hasNonZeroTile = false;
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (newBoard[i][j] !== 0) {
            expect(newBoard[i][j] === 2 || newBoard[i][j] === 4).toBeTruthy();
            hasNonZeroTile = true;
          }
        }
      }
      expect(hasNonZeroTile).toBeTruthy();
    });
    
    it('빈 칸이 없으면 보드를 변경하지 않아야 함', () => {
      // 빈 칸이 없는 보드 생성
      const fullBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(2));
      const newBoard = addRandomTile(fullBoard);
      
      // 보드가 변경되지 않아야 함
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          expect(newBoard[i][j]).toBe(fullBoard[i][j]);
        }
      }
    });
  });
  
  describe('getEmptyCells', () => {
    it('빈 셀의 위치를 올바르게 반환해야 함', () => {
      const board = [
        [2, 0, 4, 0],
        [0, 2, 0, 4],
        [0, 0, 2, 0],
        [0, 0, 0, 2],
      ];
      
      const emptyCells = getEmptyCells(board);
      expect(emptyCells.length).toBe(10); // 0인 셀이 10개
      
      // 각 빈 셀의 위치 확인
      emptyCells.forEach(({ row, col }) => {
        expect(board[row][col]).toBe(0);
      });
    });
  });
  
  describe('mergeRow', () => {
    it('같은 값을 가진 인접한 타일을 병합해야 함', () => {
      const testCases = [
        { input: [2, 2, 0, 0], expected: [4, 0, 0, 0], score: 4 },
        { input: [2, 2, 2, 2], expected: [4, 4, 0, 0], score: 8 },
        { input: [4, 4, 2, 2], expected: [8, 4, 0, 0], score: 12 },
        { input: [2, 0, 2, 0], expected: [4, 0, 0, 0], score: 4 },
        { input: [2, 0, 0, 2], expected: [4, 0, 0, 0], score: 4 },
        { input: [2, 4, 0, 0], expected: [2, 4, 0, 0], score: 0 },
      ];
      
      testCases.forEach(({ input, expected, score }) => {
        const result = mergeRow(input);
        expect(result.row).toEqual(expected);
        expect(result.score).toBe(score);
      });
    });
    
    it('같은 턴에서 이미 병합된 타일은 다시 병합되지 않아야 함', () => {
      const row = [2, 2, 4];
      const result = mergeRow(row);
      expect(result.row).toEqual([4, 4, 0, 0]);
      expect(result.score).toBe(4);
    });
  });
  
  describe('mergeBoard', () => {
    it('모든 행을 왼쪽으로 병합해야 함', () => {
      const board = [
        [2, 2, 0, 0],
        [2, 0, 2, 0],
        [4, 4, 0, 0],
        [2, 2, 2, 2],
      ];
      
      const expected = [
        [4, 0, 0, 0],
        [4, 0, 0, 0],
        [8, 0, 0, 0],
        [4, 4, 0, 0],
      ];
      
      const result = mergeBoard(board);
      expect(result.board).toEqual(expected);
      expect(result.score).toBe(20); // 4 + 4 + 8 + 4 + 0 (마지막 4는 병합된 값이 아님)
      expect(result.moved).toBe(true);
    });
    
    it('변화가 없을 경우 moved가 false여야 함', () => {
      const board = [
        [2, 0, 0, 0],
        [4, 0, 0, 0],
        [8, 0, 0, 0],
        [16, 0, 0, 0],
      ];
      
      const result = mergeBoard(board);
      expect(result.board).toEqual(board);
      expect(result.score).toBe(0);
      expect(result.moved).toBe(false);
    });
  });
  
  describe('rowsEqual', () => {
    it('두 행이 같으면 true를 반환해야 함', () => {
      expect(rowsEqual([2, 4, 8, 16], [2, 4, 8, 16])).toBe(true);
      expect(rowsEqual([0, 0, 0, 0], [0, 0, 0, 0])).toBe(true);
    });
    
    it('두 행이 다르면 false를 반환해야 함', () => {
      expect(rowsEqual([2, 4, 8, 16], [2, 4, 8, 8])).toBe(false);
      expect(rowsEqual([2, 4, 8], [2, 4, 8, 0])).toBe(false);
    });
  });
  
  describe('rotateBoard & unrotateBoard', () => {
    const testBoard = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ];
    
    it('LEFT 방향으로 회전 및 원복', () => {
      const rotated = rotateBoard(testBoard, Direction.LEFT);
      expect(rotated).toEqual(testBoard); // LEFT는 변경 없음
      
      const unrotated = unrotateBoard(rotated, Direction.LEFT);
      expect(unrotated).toEqual(testBoard);
    });
    
    it('RIGHT 방향으로 회전 및 원복', () => {
      const rotated = rotateBoard(testBoard, Direction.RIGHT);
      
      // RIGHT는 행을 뒤집음
      const expected = [
        [4, 3, 2, 1],
        [8, 7, 6, 5],
        [12, 11, 10, 9],
        [16, 15, 14, 13],
      ];
      expect(rotated).toEqual(expected);
      
      const unrotated = unrotateBoard(rotated, Direction.RIGHT);
      expect(unrotated).toEqual(testBoard);
    });
    
    it('UP 방향으로 회전 및 원복', () => {
      const rotated = rotateBoard(testBoard, Direction.UP);
      
      // UP은 90도 반시계 회전
      const expected = [
        [4, 8, 12, 16],
        [3, 7, 11, 15],
        [2, 6, 10, 14],
        [1, 5, 9, 13],
      ];
      expect(rotated).toEqual(expected);
      
      const unrotated = unrotateBoard(rotated, Direction.UP);
      expect(unrotated).toEqual(testBoard);
    });
    
    it('DOWN 방향으로 회전 및 원복', () => {
      const rotated = rotateBoard(testBoard, Direction.DOWN);
      
      // DOWN은 90도 시계 회전
      const expected = [
        [13, 9, 5, 1],
        [14, 10, 6, 2],
        [15, 11, 7, 3],
        [16, 12, 8, 4],
      ];
      expect(rotated).toEqual(expected);
      
      const unrotated = unrotateBoard(rotated, Direction.DOWN);
      expect(unrotated).toEqual(testBoard);
    });
  });
  
  describe('moveBoard', () => {
    it('왼쪽으로 이동해야 함', () => {
      const board = [
        [0, 2, 2, 0],
        [0, 2, 0, 2],
        [0, 0, 0, 4],
        [2, 2, 2, 2],
      ];
      
      const expected = [
        [4, 0, 0, 0],
        [4, 0, 0, 0],
        [4, 0, 0, 0],
        [4, 4, 0, 0],
      ];
      
      const result = moveBoard(board, Direction.LEFT);
      expect(result.board).toEqual(expected);
      expect(result.score).toBe(16);
      expect(result.moved).toBe(true);
    });
    
    it('오른쪽으로 이동해야 함', () => {
      const board = [
        [0, 2, 2, 0],
        [0, 2, 0, 2],
        [0, 0, 0, 4],
        [2, 2, 2, 2],
      ];
      
      const expected = [
        [0, 0, 0, 4],
        [0, 0, 0, 4],
        [0, 0, 0, 4],
        [0, 0, 4, 4],
      ];
      
      const result = moveBoard(board, Direction.RIGHT);
      expect(result.board).toEqual(expected);
      expect(result.score).toBe(16);
      expect(result.moved).toBe(true);
    });
    
    it('위로 이동해야 함', () => {
      const board = [
        [0, 0, 0, 2],
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 2],
      ];
      
      const expected = [
        [0, 0, 0, 4],
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      
      const result = moveBoard(board, Direction.UP);
      expect(result.board).toEqual(expected);
      expect(result.score).toBe(4);
      expect(result.moved).toBe(true);
    });
    
    it('아래로 이동해야 함', () => {
      const board = [
        [0, 0, 0, 2],
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 2],
      ];
      
      const expected = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 2],
        [0, 0, 0, 4],
      ];
      
      const result = moveBoard(board, Direction.DOWN);
      expect(result.board).toEqual(expected);
      expect(result.score).toBe(4);
      expect(result.moved).toBe(true);
    });
  });
  
  describe('hasWon', () => {
    it('2048 타일이 있으면 true를 반환해야 함', () => {
      const board = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 4],
        [2, 4, 8, 16],
      ];
      
      expect(hasWon(board)).toBe(true);
    });
    
    it('2048 타일이 없으면 false를 반환해야 함', () => {
      const board = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 4, 4],
        [2, 4, 8, 16],
      ];
      
      expect(hasWon(board)).toBe(false);
    });
  });
  
  describe('canMove', () => {
    it('빈 셀이 있으면 true를 반환해야 함', () => {
      const board = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 0, 4],
        [2, 4, 8, 16],
      ];
      
      expect(canMove(board)).toBe(true);
    });
    
    it('인접한 같은 타일이 있으면 true를 반환해야 함', () => {
      const board = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 4, 4],
        [2, 4, 8, 16],
      ];
      
      expect(canMove(board)).toBe(true);
    });
    
    it('이동할 수 없는 경우 false를 반환해야 함', () => {
      const board = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 4, 2],
        [2, 4, 8, 16],
      ];
      
      expect(canMove(board)).toBe(false);
    });
  });
}); 