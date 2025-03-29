import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    // 메모리 라우터를 사용한 테스트는 이 예제에서 생략했습니다.
    // 실제 구현에서는 MemoryRouter로 감싸는 것이 필요합니다.
    expect(() => render(<App />)).not.toThrow()
  })
})
