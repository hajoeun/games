import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from './Home'

// Home 컴포넌트는 Link를 사용하므로 BrowserRouter로 감싸줘야 합니다.
const HomeWithRouter = () => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
)

describe('Home 컴포넌트', () => {
  it('렌더링이 올바르게 됩니다', () => {
    const { getByText } = render(<HomeWithRouter />)

    // 타이틀이 올바르게 렌더링되는지 확인
    expect(getByText('클래식 게임 아케이드')).toBeDefined()

    // 서브타이틀이 올바르게 렌더링되는지 확인
    expect(getByText('리액트로 구현한 클래식 게임 모음')).toBeDefined()

    // 게임 카드가 올바르게 렌더링되는지 확인
    expect(getByText('테트리스')).toBeDefined()
    expect(getByText('벽돌깨기')).toBeDefined()
  })
})
