/**
 * 2048 게임 타일 컴포넌트
 */

import React, { useEffect, useRef } from 'react'
import { ANIMATION_DURATION, TILE_COLORS, TILE_FONT_SIZES } from '../constants'
import '../styles/animation.css'
import '../styles/tile.css'
import { TileInfo } from '../types'

interface TileProps {
  tile: TileInfo
  size: number
  boardRef: React.RefObject<HTMLDivElement>
}

const Tile: React.FC<TileProps> = ({ tile, size, boardRef }) => {
  const { value, position, previousPosition, isNew, mergedFrom } = tile
  const tileRef = useRef<HTMLDivElement>(null)

  // 타일 클래스 생성
  const getClasses = () => {
    const classes = ['tile']

    // 타일 값에 따른 클래스
    classes.push(`tile-${value}`)

    // 새로 생성된 타일 또는 병합된 타일에 애니메이션 적용
    if (isNew) classes.push('tile-new')
    if (mergedFrom) classes.push('tile-merged')

    return classes.join(' ')
  }

  // 타일 색상 가져오기
  const getTileColor = () => {
    // 타일 값에 맞는 색상 반환, 기본값은 2의 색상
    const colorKey = value in TILE_COLORS ? value : 2
    return TILE_COLORS[colorKey as keyof typeof TILE_COLORS]
  }

  // 타일 폰트 크기 가져오기
  const getFontSize = () => {
    if (value in TILE_FONT_SIZES) {
      return TILE_FONT_SIZES[value as keyof typeof TILE_FONT_SIZES].replace(
        'text-',
        ''
      )
    }
    // 기본 크기 설정
    return value <= 8
      ? '6xl'
      : value <= 64
      ? '5xl'
      : value <= 512
      ? '4xl'
      : '3xl'
  }

  // 타일 위치 및 이동 스타일
  const getTileStyle = () => {
    const tileColor = getTileColor()
    const cellPadding = 5 // 패딩 값 (그리드 셀과 일치)

    // 보드 크기와 타일 정확한 위치 계산
    const style: React.CSSProperties = {
      width: `${size - cellPadding * 2}px`,
      height: `${size - cellPadding * 2}px`,
      lineHeight: `${size - cellPadding * 2}px`,
      top: `${position.row * size + cellPadding + 15}px`, // 15px는 보드 패딩
      left: `${position.col * size + cellPadding + 15}px`, // 15px는 보드 패딩
      backgroundColor: tileColor.background,
      color: tileColor.text,
      zIndex: mergedFrom ? 30 : isNew ? 20 : 10,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '8px',
      fontWeight: 'bold',
      position: 'absolute',
      transform: 'translate3d(0, 0, 0)', // 하드웨어 가속 활성화
      backfaceVisibility: 'hidden', // 렌더링 개선
      willChange: 'transform, top, left', // 성능 최적화
    }

    // 타일 값에 따라 폰트 크기 조정
    const fontSize = getFontSize()
    switch (fontSize) {
      case '6xl':
        style.fontSize = `${Math.min(size / 2.5, 48)}px`
        break // text-6xl
      case '5xl':
        style.fontSize = `${Math.min(size / 3, 36)}px`
        break // text-5xl
      case '4xl':
        style.fontSize = `${Math.min(size / 3.5, 28)}px`
        break // text-4xl
      case '3xl':
        style.fontSize = `${Math.min(size / 4, 24)}px`
        break // text-3xl
      case '2xl':
        style.fontSize = `${Math.min(size / 5, 20)}px`
        break // text-2xl
      default:
        style.fontSize = `${Math.min(size / 2.5, 45)}px`
    }

    return style
  }

  // 이동 애니메이션을 위한 위치 설정
  useEffect(() => {
    if (!tileRef.current) return

    // 병합 애니메이션 디버깅 및 강화
    if (mergedFrom) {
      console.log(
        `병합 타일 애니메이션: 값=${value}, 위치=[${position.row}, ${position.col}]`
      )
      // 타일 병합 시 애니메이션이 확실히 적용되도록 클래스를 다시 추가
      const tile = tileRef.current
      tile.classList.remove('tile-merged')
      // forceReflow trick - 강제로 브라우저가 리플로우하도록 하여 애니메이션 재시작
      void tile.offsetWidth
      tile.classList.add('tile-merged')
      return
    }

    // 새 타일 애니메이션 디버깅 및 강화
    if (isNew) {
      console.log(
        `새 타일 애니메이션: 값=${value}, 위치=[${position.row}, ${position.col}]`
      )
      // 애니메이션 확실히 적용 (필요시)
      const tile = tileRef.current
      tile.classList.remove('tile-new')
      void tile.offsetWidth
      tile.classList.add('tile-new')
      return
    }

    // 이동 타일인 경우
    if (
      previousPosition &&
      (previousPosition.row !== position.row ||
        previousPosition.col !== position.col)
    ) {
      // 이전 위치와 현재 위치가 다른 경우
      requestAnimationFrame(() => {
        // 이동 디버깅
        console.log(
          `타일 이동: 값=${value}, [${previousPosition.row}, ${previousPosition.col}] -> [${position.row}, ${position.col}]`
        )
      })
    }
  }, [position, previousPosition, value, isNew, mergedFrom, size])

  return (
    <div
      ref={tileRef}
      className={getClasses()}
      style={getTileStyle()}
      data-value={value}
      data-row={position.row}
      data-col={position.col}
      data-testid={`tile-${position.row}-${position.col}-${value}`}
    >
      {value}
    </div>
  )
}

export default React.memo(Tile)
