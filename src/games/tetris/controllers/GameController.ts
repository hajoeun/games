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