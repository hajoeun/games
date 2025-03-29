import React, { ButtonHTMLAttributes, ReactNode } from 'react'

// 공통 속성 인터페이스
interface RetroProps {
  children: ReactNode
  className?: string
}

// 버튼 Props
interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  pixelated?: boolean
}

// 컨테이너 Props
interface RetroContainerProps extends RetroProps {
  variant?: 'primary' | 'secondary'
  bordered?: boolean
  withShadow?: boolean
}

// 제목 Props
interface RetroTitleProps extends RetroProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  glowing?: boolean
  color?: 'primary' | 'secondary' | 'highlight' | 'warning'
}

// 텍스트 Props
interface RetroTextProps extends RetroProps {
  color?: 'primary' | 'secondary' | 'highlight' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

// 카드 Props
interface RetroCardProps extends RetroProps {
  withGlow?: boolean
  interactive?: boolean
}

/**
 * 레트로 스타일 버튼 컴포넌트
 */
export const RetroButton: React.FC<RetroButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  pixelated = true,
  className = '',
  ...rest
}) => {
  // 버튼 기본 스타일
  const baseStyle =
    'inline-block font-pixel uppercase tracking-wider transition-all duration-100 transform border-3'

  // 버튼 크기 스타일
  const sizeStyle = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }[size]

  // 버튼 색상 스타일
  const variantStyle = {
    primary:
      'bg-retro-primary border-white text-white hover:bg-[#FF338A] active:bg-[#CC0052]',
    secondary:
      'bg-retro-bg-secondary border-[#36F9F6] text-[#36F9F6] hover:border-white hover:text-white active:bg-[#0A0A1A]',
    warning:
      'bg-retro-warning border-white text-white hover:bg-[#FF5533] active:bg-[#CC2200]',
  }[variant]

  // 전체 너비 스타일
  const widthStyle = fullWidth ? 'w-full' : ''

  // 픽셀화 효과
  const pixelStyle = pixelated ? 'retro-shadow' : 'shadow-md'

  // 최종 스타일
  const buttonStyle = `${baseStyle} ${sizeStyle} ${variantStyle} ${widthStyle} ${pixelStyle} ${className}`

  // 버튼 클릭 효과를 위한 스타일
  const activeStyle = 'active:translate-y-1 active:shadow-none'

  return (
    <button
      className={`${buttonStyle} ${activeStyle} hover:scale-[1.02]`}
      {...rest}
    >
      {children}
    </button>
  )
}

/**
 * 레트로 스타일 컨테이너 컴포넌트
 */
export const RetroContainer: React.FC<RetroContainerProps> = ({
  children,
  variant = 'primary',
  bordered = true,
  withShadow = true,
  className = '',
}) => {
  // 컨테이너 기본 스타일
  const baseStyle = 'rounded-md p-4'

  // 색상 스타일
  const variantStyle = {
    primary: 'bg-retro-bg-primary',
    secondary: 'bg-retro-bg-secondary',
  }[variant]

  // 테두리 스타일
  const borderStyle = bordered ? 'border-3 border-[#36F9F6]' : ''

  // 그림자 스타일
  const shadowStyle = withShadow ? 'retro-shadow' : ''

  return (
    <div
      className={`${baseStyle} ${variantStyle} ${borderStyle} ${shadowStyle} ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * 레트로 스타일 제목 컴포넌트
 */
export const RetroTitle: React.FC<RetroTitleProps> = ({
  children,
  as = 'h2',
  glowing = false,
  color = 'highlight',
  className = '',
}) => {
  // 색상 스타일
  const colorStyle = {
    primary: 'text-retro-text-primary',
    secondary: 'text-retro-text-secondary',
    highlight: 'text-retro-text-highlight',
    warning: 'text-retro-warning',
  }[color]

  // 글로우 효과 스타일
  const glowStyle = glowing
    ? {
        highlight: 'text-shadow-neon-yellow',
        primary: 'text-shadow-neon',
        secondary: 'text-shadow-sm',
        warning: 'text-shadow-neon-pink',
      }[color]
    : ''

  // 기본 스타일
  const baseStyle = 'font-pixel uppercase tracking-widest'

  // 최종 스타일
  const titleStyle = `${baseStyle} ${colorStyle} ${glowStyle} ${className}`

  // 동적 요소 타입 적용
  const Component = as

  return <Component className={titleStyle}>{children}</Component>
}

/**
 * 레트로 스타일 텍스트 컴포넌트
 */
export const RetroText: React.FC<RetroTextProps> = ({
  children,
  color = 'primary',
  size = 'md',
  className = '',
}) => {
  // 색상 스타일
  const colorStyle = {
    primary: 'text-retro-text-primary',
    secondary: 'text-retro-text-secondary',
    highlight: 'text-retro-text-highlight',
    warning: 'text-retro-warning',
  }[color]

  // 크기 스타일
  const sizeStyle = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size]

  // 기본 스타일
  const baseStyle = 'font-pixel'

  return (
    <p className={`${baseStyle} ${colorStyle} ${sizeStyle} ${className}`}>
      {children}
    </p>
  )
}

/**
 * 레트로 스타일 카드 컴포넌트
 */
export const RetroCard: React.FC<RetroCardProps> = ({
  children,
  withGlow = false,
  interactive = false,
  className = '',
}) => {
  // 기본 스타일
  const baseStyle =
    'rounded-md overflow-hidden bg-retro-bg-secondary border-3 border-[#36F9F6] p-4'

  // 그로우 효과
  const glowStyle = withGlow
    ? 'shadow-[0_0_15px_rgba(54,249,246,0.3)]'
    : 'retro-shadow'

  // 인터랙티브 스타일
  const interactiveStyle = interactive
    ? 'transition-all duration-200 transform hover:scale-105 hover:border-retro-text-highlight cursor-pointer'
    : ''

  return (
    <div
      className={`${baseStyle} ${glowStyle} ${interactiveStyle} ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * 픽셀 아트 스타일 스캔라인 효과 컴포넌트
 */
export const RetroScanlines: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 ${className}`}
    ></div>
  )
}

/**
 * 픽셀 아트 스타일 노이즈 효과 컴포넌트
 */
export const RetroNoise: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 ${className}`}
    ></div>
  )
}

/**
 * 게임 일시정지/메뉴 오버레이 컴포넌트
 */
export const RetroOverlay: React.FC<RetroProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-retro-bg-primary bg-opacity-90 flex flex-col items-center justify-center p-4 ${className}`}
    >
      <RetroContainer className="max-w-md w-full">{children}</RetroContainer>
    </div>
  )
}

/**
 * 점수 표시 컴포넌트
 */
export const RetroScore: React.FC<{
  score: number
  label?: string
  className?: string
}> = ({ score, label = '점수', className = '' }) => {
  return (
    <div
      className={`bg-retro-bg-secondary border-2 border-[#36F9F6] px-3 py-2 rounded ${className}`}
    >
      <div className="text-xs text-retro-text-secondary font-pixel mb-1">
        {label}
      </div>
      <div className="text-lg text-retro-text-highlight font-pixel">
        {score}
      </div>
    </div>
  )
}

/**
 * 픽셀 아트 게임 그리드 컴포넌트
 */
export const RetroGrid: React.FC<{
  columns: number
  rows: number
  gap?: number
  cellSize?: number
  className?: string
  children: ReactNode
}> = ({ columns, rows, gap = 4, cellSize = 40, className = '', children }) => {
  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  )
}

export default {
  RetroButton,
  RetroContainer,
  RetroTitle,
  RetroText,
  RetroCard,
  RetroScanlines,
  RetroNoise,
  RetroOverlay,
  RetroScore,
  RetroGrid,
}
