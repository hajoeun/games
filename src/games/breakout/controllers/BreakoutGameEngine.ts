import { Ball, Boundaries, Brick, BrickType, GameCallbacks, GameState, Paddle } from '../types';
import { levels } from '../levels';
import { 
  PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED, 
  BALL_RADIUS, BALL_SPEED,
  BRICK_ROW_COUNT, BRICK_COLUMN_COUNT, 
  BRICK_WIDTH, BRICK_HEIGHT, BRICK_PADDING,
  BRICK_OFFSET_TOP, BRICK_OFFSET_LEFT,
  STAR_COUNT, GAME_COLORS 
} from '../constants';
import { darkenColor, lightenColor, getCurrentTime } from '../utils';

export class BreakoutGameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: GameCallbacks;
  
  // 게임 상태
  private gameState: GameState = GameState.START;
  private score: number = 0;
  private lives: number = 3;
  private level: number = 1;
  private animationFrameId: number | null = null;
  
  // 게임 오브젝트
  private paddle: Paddle;
  private ball: Ball;
  private bricks: Brick[][] = [];
  private boundaries: Boundaries;

  // 별 배경을 위한 속성
  private stars: {x: number, y: number, size: number, color: string}[] = [];

  // 키보드 상태
  private rightPressed: boolean = false;
  private leftPressed: boolean = false;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.callbacks = callbacks;
    
    // 캔버스 배경색 설정
    this.canvas.style.backgroundColor = GAME_COLORS.background;
    
    // 경계 설정
    this.boundaries = {
      left: 0,
      right: canvas.width,
      top: 0,
      bottom: canvas.height
    };
    
    // 패들 초기화
    this.paddle = {
      x: (canvas.width - PADDLE_WIDTH) / 2,
      y: canvas.height - PADDLE_HEIGHT - 10,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      speed: PADDLE_SPEED
    };
    
    // 공 초기화
    this.ball = {
      x: canvas.width / 2,
      y: this.paddle.y - BALL_RADIUS,
      radius: BALL_RADIUS,
      dx: 0,
      dy: 0,
      speed: BALL_SPEED,
      isLaunched: false
    };
    
    // 별 초기화
    this.initStars();
    
    // 벽돌 초기화
    this.initBricks();
    
    // 이벤트 리스너 설정
    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
    document.addEventListener('keyup', this.keyUpHandler.bind(this), false);
    
    // 초기 상태 설정
    this.updateGameState(GameState.START);
  }

  // 키보드 이벤트 핸들러
  private keyDownHandler(e: KeyboardEvent): void {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    } else if (e.key === ' ' && !this.ball.isLaunched && this.gameState === GameState.PLAYING) {
      this.launchBall();
    }
  }

  private keyUpHandler(e: KeyboardEvent): void {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  // 외부에서 호출할 수 있는 키 이벤트 핸들러
  public handleKeyDown(key: string): void {
    if (key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (key === 'ArrowLeft') {
      this.leftPressed = true;
    } else if (key === ' ' && !this.ball.isLaunched && this.gameState === GameState.PLAYING) {
      this.launchBall();
    }
  }

  // 별 초기화
  private initStars(): void {
    this.stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const star = {
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        color: GAME_COLORS.stars[Math.floor(Math.random() * GAME_COLORS.stars.length)]
      };
      this.stars.push(star);
    }
  }

  // 벽돌 초기화
  private initBricks(): void {
    const currentLevel = Math.min(levels.length - 1, this.level - 1);
    const levelData = levels[currentLevel];
    
    this.bricks = [];
    
    for (let r = 0; r < levelData.brickLayout.length; r++) {
      this.bricks[r] = [];
      for (let c = 0; c < levelData.brickLayout[r].length; c++) {
        if (levelData.brickLayout[r][c] === 1) {
          // 벽돌 타입 결정
          let brickType = BrickType.NORMAL;
          if (levelData.brickTypes && levelData.brickTypes[r] && levelData.brickTypes[r][c]) {
            brickType = levelData.brickTypes[r][c];
          }
          
          // 벽돌 생성
          const brick: Brick = {
            x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
            y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
            width: BRICK_WIDTH,
            height: BRICK_HEIGHT,
            type: brickType,
            hits: 0,
            maxHits: brickType === BrickType.ENHANCED ? 2 : 1,
            value: this.getBrickValue(brickType),
            isVisible: true
          };
          
          this.bricks[r][c] = brick;
        } else {
          this.bricks[r][c] = null as any;
        }
      }
    }
  }

  // 벽돌 값 계산
  private getBrickValue(type: BrickType): number {
    switch(type) {
      case BrickType.NORMAL:
        return 10;
      case BrickType.ENHANCED:
        return 20;
      case BrickType.BONUS:
        return 50;
      case BrickType.POWERUP:
        return 30;
      default:
        return 10;
    }
  }

  // 게임 상태 업데이트
  private updateGameState(newState: GameState): void {
    this.gameState = newState;
    this.callbacks.onGameStateChange(newState);
  }

  // 게임 시작
  public startGame(): void {
    if (this.gameState === GameState.START) {
      this.resetGame();
      this.updateGameState(GameState.PLAYING);
      // 게임 시작 시 자동으로 공을 발사하지 않음
      // 사용자가 스페이스바를 누르면 공이 발사됨
    } else if (this.gameState === GameState.LEVEL_CLEAR) {
      this.level++;
      this.callbacks.onLevelChange(this.level);
      this.initBricks();
      this.resetBallAndPaddle();
      this.updateGameState(GameState.PLAYING);
    } else if (this.gameState === GameState.GAME_OVER) {
      this.resetGame();
      this.updateGameState(GameState.PLAYING);
    }
    
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  // 게임 재설정
  public resetGame(): void {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.callbacks.onScoreChange(this.score);
    this.callbacks.onLivesChange(this.lives);
    this.callbacks.onLevelChange(this.level);
    this.initBricks();
    this.resetBallAndPaddle();
  }

  // 공과 패들 재설정
  private resetBallAndPaddle(): void {
    this.paddle.x = (this.canvas.width - PADDLE_WIDTH) / 2;
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.paddle.y - BALL_RADIUS;
    this.ball.dx = 0;
    this.ball.dy = 0;
    this.ball.isLaunched = false;
  }

  // 공 발사 - private 에서 public으로 변경
  public launchBall(): void {
    if (!this.ball.isLaunched && this.gameState === GameState.PLAYING) {
      this.ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
      this.ball.dy = -BALL_SPEED;
      this.ball.isLaunched = true;
    }
  }

  // 충돌 감지: 패들과 공
  private checkPaddleCollision(): void {
    if (
      this.ball.y + this.ball.radius >= this.paddle.y &&
      this.ball.y - this.ball.radius <= this.paddle.y + this.paddle.height &&
      this.ball.x + this.ball.radius >= this.paddle.x &&
      this.ball.x - this.ball.radius <= this.paddle.x + this.paddle.width
    ) {
      // 패들과 충돌 위치에 따라 반사 각도 조정
      const hitPoint = (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
      const angle = hitPoint * (Math.PI / 3); // -60도 ~ 60도 범위
      
      this.ball.dx = this.ball.speed * Math.sin(angle);
      this.ball.dy = -this.ball.speed * Math.cos(angle);
      
      // 공이 패들 안으로 들어가지 않도록 위치 조정
      this.ball.y = this.paddle.y - this.ball.radius;
    }
  }

  // 충돌 감지: 벽돌과 공
  private checkBrickCollision(): void {
    for (let r = 0; r < this.bricks.length; r++) {
      for (let c = 0; c < this.bricks[r].length; c++) {
        const brick = this.bricks[r][c];
        if (brick && brick.isVisible) {
          if (
            this.ball.x + this.ball.radius >= brick.x &&
            this.ball.x - this.ball.radius <= brick.x + brick.width &&
            this.ball.y + this.ball.radius >= brick.y &&
            this.ball.y - this.ball.radius <= brick.y + brick.height
          ) {
            // 충돌 방향 계산
            const ballCenterX = this.ball.x;
            const ballCenterY = this.ball.y;
            const brickCenterX = brick.x + brick.width / 2;
            const brickCenterY = brick.y + brick.height / 2;
            
            // 충돌 방향에 따라 공 방향 변경
            const dx = ballCenterX - brickCenterX;
            const dy = ballCenterY - brickCenterY;
            
            if (Math.abs(dx) > Math.abs(dy)) {
              // 좌우 충돌
              this.ball.dx = -this.ball.dx;
            } else {
              // 상하 충돌
              this.ball.dy = -this.ball.dy;
            }
            
            // 충돌 효과음 (나중에 추가 가능)
            
            // 벽돌 상태 업데이트
            brick.hits++;
            if (brick.hits >= brick.maxHits) {
              brick.isVisible = false;
              this.score += brick.value;
              this.callbacks.onScoreChange(this.score);
            }
            
            // 모든 벽돌이 제거되었는지 확인
            if (this.checkLevelComplete()) {
              this.updateGameState(GameState.LEVEL_CLEAR);
              return;
            }
            
            // 하나의 벽돌만 처리 후 리턴
            return;
          }
        }
      }
    }
  }

  // 레벨 완료 확인
  private checkLevelComplete(): boolean {
    for (let r = 0; r < this.bricks.length; r++) {
      for (let c = 0; c < this.bricks[r].length; c++) {
        const brick = this.bricks[r][c];
        if (brick && brick.isVisible) {
          return false;
        }
      }
    }
    return true;
  }

  // 공 이동 업데이트
  private updateBallPosition(): void {
    if (!this.ball.isLaunched) {
      // 패들 위에 공 위치
      this.ball.x = this.paddle.x + this.paddle.width / 2;
      return;
    }
    
    // 공 이동
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
    
    // 벽 충돌 체크
    if (this.ball.x + this.ball.radius > this.boundaries.right) {
      this.ball.x = this.boundaries.right - this.ball.radius;
      this.ball.dx = -this.ball.dx;
    } else if (this.ball.x - this.ball.radius < this.boundaries.left) {
      this.ball.x = this.boundaries.left + this.ball.radius;
      this.ball.dx = -this.ball.dx;
    }
    
    if (this.ball.y - this.ball.radius < this.boundaries.top) {
      this.ball.y = this.boundaries.top + this.ball.radius;
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.radius > this.boundaries.bottom) {
      // 바닥에 닿으면 생명 감소
      this.lives--;
      this.callbacks.onLivesChange(this.lives);
      
      if (this.lives <= 0) {
        this.updateGameState(GameState.GAME_OVER);
      } else {
        this.resetBallAndPaddle();
      }
    }
  }

  // 패들 이동 업데이트
  private updatePaddlePosition(): void {
    if (this.rightPressed && this.paddle.x + this.paddle.width < this.boundaries.right) {
      this.paddle.x += this.paddle.speed;
    } else if (this.leftPressed && this.paddle.x > this.boundaries.left) {
      this.paddle.x -= this.paddle.speed;
    }
  }

  // 게임 루프
  private gameLoop(): void {
    if (this.gameState !== GameState.PLAYING) {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      return;
    }
    
    // 화면 지우기
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 배경 그리기
    this.drawBackground();
    
    // 테두리 그리기
    this.drawBorder();
    
    // 게임 오브젝트 그리기
    this.drawPaddle();
    this.drawBall();
    this.drawBricks();
    
    // 게임 로직 업데이트
    this.updatePaddlePosition();
    this.checkPaddleCollision();
    this.checkBrickCollision();
    this.updateBallPosition();
    
    // 다음 프레임 요청
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  // 배경 그리기 (별이 있는 우주 배경)
  private drawBackground(): void {
    // 배경 그라데이션
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#000033');
    gradient.addColorStop(1, '#000022');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 별 그리기
    for (const star of this.stars) {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = star.color;
      this.ctx.fill();
      
      // 별 깜빡임 효과
      if (Math.random() < 0.01) {
        star.size = Math.random() * 2 + 0.5;
      }
    }
  }

  // 테두리 그리기
  private drawBorder(): void {
    this.ctx.beginPath();
    this.ctx.strokeStyle = GAME_COLORS.border;
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.closePath();
  }

  // 패들 그리기
  private drawPaddle(): void {
    // 패들 그림자
    this.ctx.beginPath();
    this.ctx.rect(this.paddle.x + 2, this.paddle.y + 2, this.paddle.width, this.paddle.height);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fill();
    this.ctx.closePath();
    
    // 패들 본체 - 그라데이션 적용
    const paddleGradient = this.ctx.createLinearGradient(
      this.paddle.x, this.paddle.y, 
      this.paddle.x, this.paddle.y + this.paddle.height
    );
    paddleGradient.addColorStop(0, GAME_COLORS.paddle.top);
    paddleGradient.addColorStop(1, GAME_COLORS.paddle.bottom);
    
    this.ctx.beginPath();
    this.ctx.rect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    this.ctx.fillStyle = paddleGradient;
    this.ctx.fill();
    
    // 패들 가장자리
    this.ctx.strokeStyle = "#FFFFFF";
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.closePath();
    
    // 패들 글로우 효과
    this.ctx.beginPath();
    this.ctx.rect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    this.ctx.strokeStyle = GAME_COLORS.paddle.glow;
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = GAME_COLORS.paddle.glow;
    this.ctx.shadowBlur = 10;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.closePath();
  }

  // 공 그리기
  private drawBall(): void {
    // 공 그림자
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x + 2, this.ball.y + 2, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fill();
    this.ctx.closePath();
    
    // 공 본체 - 그라데이션 적용
    const ballGradient = this.ctx.createRadialGradient(
      this.ball.x - this.ball.radius/3, this.ball.y - this.ball.radius/3, 0,
      this.ball.x, this.ball.y, this.ball.radius
    );
    ballGradient.addColorStop(0, '#FFFFFF');
    ballGradient.addColorStop(1, '#CCCCFF');
    
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = ballGradient;
    this.ctx.fill();
    this.ctx.closePath();
    
    // 공 글로우 효과
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = GAME_COLORS.ball.glow;
    this.ctx.lineWidth = 1;
    this.ctx.shadowColor = GAME_COLORS.ball.glow;
    this.ctx.shadowBlur = 15;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.closePath();
  }

  // 벽돌 그리기
  private drawBricks(): void {
    for (let r = 0; r < this.bricks.length; r++) {
      for (let c = 0; c < this.bricks[r].length; c++) {
        const brick = this.bricks[r][c];
        if (brick && brick.isVisible) {
          // 레벨별 벽돌 색상 계산
          let rowColor;
          switch(r) {
            case 0: rowColor = GAME_COLORS.brick.row1; break;
            case 1: rowColor = GAME_COLORS.brick.row2; break;
            case 2: rowColor = GAME_COLORS.brick.row3; break;
            case 3: rowColor = GAME_COLORS.brick.row4; break;
            case 4: rowColor = GAME_COLORS.brick.row5; break;
            case 5: rowColor = GAME_COLORS.brick.row6; break;
            default: rowColor = GAME_COLORS.brick.row1;
          }
          
          // 벽돌 그라데이션 설정
          const brickGradient = this.ctx.createLinearGradient(
            brick.x, brick.y,
            brick.x, brick.y + brick.height
          );
          
          // 벽돌 타입에 따른 스타일 적용
          if (brick.type === BrickType.NORMAL) {
            // 일반 벽돌은 표준 그라데이션
            brickGradient.addColorStop(0, lightenColor(rowColor.top, 10));
            brickGradient.addColorStop(1, rowColor.bottom);
          } else if (brick.type === BrickType.ENHANCED) {
            // 강화 벽돌은 반짝이는 효과
            const glitterEffect = getCurrentTime() % 1000 < 500;
            brickGradient.addColorStop(0, glitterEffect ? lightenColor(rowColor.top, 50) : rowColor.top);
            brickGradient.addColorStop(1, rowColor.bottom);
          } else if (brick.type === BrickType.BONUS) {
            // 보너스 벽돌은 밝은 파란색 계열
            brickGradient.addColorStop(0, lightenColor(rowColor.top, 30));
            brickGradient.addColorStop(1, darkenColor(rowColor.bottom, 10));
          }
          
          // 벽돌 그림자
          this.ctx.beginPath();
          this.ctx.rect(brick.x + 2, brick.y + 2, brick.width, brick.height);
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          this.ctx.fill();
          this.ctx.closePath();
          
          // 벽돌 본체 - 그라데이션 적용
          this.ctx.beginPath();
          this.ctx.rect(brick.x, brick.y, brick.width, brick.height);
          this.ctx.fillStyle = brickGradient;
          this.ctx.fill();
          
          // 벽돌 하이라이트 (상단에 밝은 선)
          this.ctx.beginPath();
          this.ctx.moveTo(brick.x, brick.y);
          this.ctx.lineTo(brick.x + brick.width, brick.y);
          this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
          this.ctx.closePath();
          
          // 벽돌 하단 그림자 (하단에 어두운 선)
          this.ctx.beginPath();
          this.ctx.moveTo(brick.x, brick.y + brick.height);
          this.ctx.lineTo(brick.x + brick.width, brick.y + brick.height);
          this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
          this.ctx.closePath();
          
          // 벽돌 경계선
          this.ctx.beginPath();
          this.ctx.rect(brick.x, brick.y, brick.width, brick.height);
          this.ctx.strokeStyle = "#FFFFFF";
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    }
  }

  // 게임 정지
  public stopGame(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // 이벤트 리스너 제거
    document.removeEventListener('keydown', this.keyDownHandler.bind(this));
    document.removeEventListener('keyup', this.keyUpHandler.bind(this));
  }
} 