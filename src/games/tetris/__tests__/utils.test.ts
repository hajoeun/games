import {
  createEmptyBoard,
  createRandomTetromino,
  rotateTetromino,
  isColliding,
  lockTetromino,
  clearLines,
  calculateGhostPosition,
  getSpeedByLevel
} from '../utils'
import { TetrominoType, BOARD_WIDTH, BOARD_HEIGHT } from '../constants'
import { Board, Tetromino } from '../types'

describe('테트리스 유틸리티 함수 테스트', () => {
  describe('createEmptyBoard', () => {
    it('빈 게임 보드를 생성해야 함', () => {
      const board = createEmptyBoard()
      
      expect(board.length).toBe(BOARD_HEIGHT)
      expect(board[0].length).toBe(BOARD_WIDTH)
      
      // 모든 셀이 비어있는지 확인
      board.forEach(row => {
        row.forEach(cell => {
          expect(cell).toEqual({
            filled: false,
            color: '',
            type: null
          })
        })
      })
    })
  })

  describe('createRandomTetromino', () => {
    it('유효한 테트로미노를 생성해야 함', () => {
      const tetromino = createRandomTetromino()
      
      expect(Object.values(TetrominoType)).toContain(tetromino.type)
      expect(tetromino.shape).toBeDefined()
      expect(tetromino.position).toEqual({
        x: expect.any(Number),
        y: 0
      })
      expect(tetromino.rotation).toBe(0)
    })
  })

  describe('rotateTetromino', () => {
    it('O 블록은 회전해도 모양이 변하지 않아야 함', () => {
      const oTetromino: Tetromino = {
        type: TetrominoType.O,
        shape: [
          [1, 1],
          [1, 1]
        ],
        position: { x: 0, y: 0 },
        rotation: 0
      }
      
      const rotated = rotateTetromino(oTetromino)
      expect(rotated.shape).toEqual(oTetromino.shape)
    })

    it('I 블록은 90도 회전해야 함', () => {
      const iTetromino: Tetromino = {
        type: TetrominoType.I,
        shape: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        position: { x: 0, y: 0 },
        rotation: 0
      }
      
      const expected = [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
      ]
      
      const rotated = rotateTetromino(iTetromino)
      expect(rotated.shape).toEqual(expected)
      expect(rotated.rotation).toBe(1)
    })
  })

  describe('isColliding', () => {
    let emptyBoard: Board

    beforeEach(() => {
      emptyBoard = createEmptyBoard()
    })

    it('보드 경계와 충돌을 감지해야 함', () => {
      const tetromino: Tetromino = {
        type: TetrominoType.O,
        shape: [
          [1, 1],
          [1, 1]
        ],
        position: { x: -1, y: 0 },
        rotation: 0
      }
      
      expect(isColliding(emptyBoard, tetromino)).toBe(true)
    })

    it('다른 블록과의 충돌을 감지해야 함', () => {
      const board = createEmptyBoard()
      board[BOARD_HEIGHT - 1][0] = { filled: true, color: 'red', type: TetrominoType.O }
      
      const tetromino: Tetromino = {
        type: TetrominoType.O,
        shape: [
          [1, 1],
          [1, 1]
        ],
        position: { x: 0, y: BOARD_HEIGHT - 2 },
        rotation: 0
      }
      
      expect(isColliding(board, tetromino)).toBe(true)
    })
  })

  describe('clearLines', () => {
    it('완성된 라인을 제거하고 점수를 반환해야 함', () => {
      const board = createEmptyBoard()
      // 한 줄을 채움
      board[BOARD_HEIGHT - 1] = Array(BOARD_WIDTH).fill({
        filled: true,
        color: 'red',
        type: TetrominoType.O
      })
      
      const { newBoard, linesCleared } = clearLines(board)
      
      expect(linesCleared).toBe(1)
      expect(newBoard[BOARD_HEIGHT - 1].every(cell => !cell.filled)).toBe(true)
    })
  })

  describe('calculateGhostPosition', () => {
    it('고스트 블록의 위치를 올바르게 계산해야 함', () => {
      const board = createEmptyBoard()
      const tetromino: Tetromino = {
        type: TetrominoType.O,
        shape: [
          [1, 1],
          [1, 1]
        ],
        position: { x: 0, y: 0 },
        rotation: 0
      }
      
      const ghostY = calculateGhostPosition(board, tetromino)
      expect(ghostY).toBe(BOARD_HEIGHT - 2) // O 블록의 높이가 2이므로
    })
  })

  describe('getSpeedByLevel', () => {
    it('레벨에 따른 속도를 올바르게 반환해야 함', () => {
      expect(getSpeedByLevel(1)).toBe(800) // 레벨 1의 속도
      expect(getSpeedByLevel(10)).toBe(100) // 레벨 10의 속도
      expect(getSpeedByLevel(15)).toBe(60) // 최대 레벨의 속도
    })
  })
}) 