import { KEYS } from '../constants'

type GameControllerCallback = {
  onMoveLeft: () => void
  onMoveRight: () => void
  onMoveDown: () => void
  onRotate: () => void
  onHardDrop: () => void
  onHold: () => void
  onPause: () => void
  onRestart: () => void
}

// 터치 컨트롤러 클래스 추가
export class TouchController {
  private callbacks: GameControllerCallback
  private isEnabled: boolean = true
  private touchStartX: number = 0
  private touchStartY: number = 0
  private swipeThreshold: number = 30
  private tapTimeout: number | null = null
  private doubleTapDelay: number = 300

  constructor(callbacks: GameControllerCallback) {
    this.callbacks = callbacks
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
  }

  public enable(): void {
    this.isEnabled = true
  }

  public disable(): void {
    this.isEnabled = false
  }

  public attach(element: HTMLElement): void {
    element.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    element.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    element.addEventListener('touchend', this.handleTouchEnd, { passive: false })
  }

  public detach(element: HTMLElement): void {
    element.removeEventListener('touchstart', this.handleTouchStart)
    element.removeEventListener('touchmove', this.handleTouchMove)
    element.removeEventListener('touchend', this.handleTouchEnd)
  }

  private handleTouchStart(e: TouchEvent): void {
    if (!this.isEnabled) return
    
    e.preventDefault()
    const touch = e.touches[0]
    this.touchStartX = touch.clientX
    this.touchStartY = touch.clientY
  }

  private handleTouchMove(e: TouchEvent): void {
    if (!this.isEnabled) return
    
    e.preventDefault()
  }

  private handleTouchEnd(e: TouchEvent): void {
    if (!this.isEnabled) return
    
    e.preventDefault()
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - this.touchStartX
    const deltaY = touch.clientY - this.touchStartY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    // 스와이프 제스처 감지
    if (Math.max(absX, absY) > this.swipeThreshold) {
      // 좌우 스와이프가 상하 스와이프보다 크면
      if (absX > absY) {
        if (deltaX > 0) {
          this.callbacks.onMoveRight() // 오른쪽 스와이프
        } else {
          this.callbacks.onMoveLeft() // 왼쪽 스와이프
        }
      } else {
        if (deltaY > 0) {
          this.callbacks.onHardDrop() // 아래로 스와이프 (하드 드롭)
        } else {
          this.callbacks.onRotate() // 위로 스와이프 (회전)
        }
      }
    } else {
      // 탭 제스처 (더블 탭 감지를 위한 로직)
      if (this.tapTimeout === null) {
        this.tapTimeout = window.setTimeout(() => {
          // 싱글 탭 - 소프트 드롭
          this.callbacks.onMoveDown()
          this.tapTimeout = null
        }, this.doubleTapDelay)
      } else {
        // 더블 탭 - 홀드
        clearTimeout(this.tapTimeout)
        this.tapTimeout = null
        this.callbacks.onHold()
      }
    }
  }
}

export class GameController {
  private callbacks: GameControllerCallback
  private keyState: { [key: string]: boolean } = {}
  private isEnabled: boolean = true

  constructor(callbacks: GameControllerCallback) {
    this.callbacks = callbacks
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  public enable(): void {
    this.isEnabled = true
  }

  public disable(): void {
    this.isEnabled = false
  }

  public attach(): void {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  public detach(): void {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // 이미 눌린 키는 무시
    if (this.keyState[e.key]) return

    // 게임 컨트롤 키 기본 동작 방지
    if (
      [
        KEYS.LEFT,
        KEYS.RIGHT,
        KEYS.DOWN,
        KEYS.UP,
        KEYS.SPACE,
        KEYS.SHIFT,
        KEYS.P,
        KEYS.R,
      ].includes(e.key)
    ) {
      e.preventDefault()
    }

    // 키 상태 업데이트
    this.keyState[e.key] = true

    // 컨트롤러가 비활성화된 경우 일부 키만 처리
    if (!this.isEnabled) {
      if (e.key === KEYS.R) {
        this.callbacks.onRestart()
      } else if (e.key === KEYS.P) {
        this.callbacks.onPause()
      }
      return
    }

    // 키 입력에 따른 동작 실행
    switch (e.key) {
      case KEYS.LEFT:
        this.callbacks.onMoveLeft()
        break
      case KEYS.RIGHT:
        this.callbacks.onMoveRight()
        break
      case KEYS.DOWN:
        this.callbacks.onMoveDown()
        break
      case KEYS.UP:
        this.callbacks.onRotate()
        break
      case KEYS.SPACE:
        this.callbacks.onHardDrop()
        break
      case KEYS.SHIFT:
        this.callbacks.onHold()
        break
      case KEYS.P:
        this.callbacks.onPause()
        break
      case KEYS.R:
        this.callbacks.onRestart()
        break
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    // 키 상태 업데이트
    this.keyState[e.key] = false

    // 게임 컨트롤 키 기본 동작 방지
    if (
      [
        KEYS.LEFT,
        KEYS.RIGHT,
        KEYS.DOWN,
        KEYS.UP,
        KEYS.SPACE,
        KEYS.SHIFT,
        KEYS.P,
        KEYS.R,
      ].includes(e.key)
    ) {
      e.preventDefault()
    }
  }
} 