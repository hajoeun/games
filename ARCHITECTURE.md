# 게임 플랫폼 아키텍처

## 목차
1. [전체 구조](#전체-구조)
2. [게임 구현 패턴](#게임-구현-패턴)
3. [게임 구성 요소](#게임-구성-요소)
4. [테스트 코드 작성](#테스트-코드-작성)
5. [새로운 게임 추가 방법](#새로운-게임-추가-방법)

## 전체 구조

이 프로젝트는 React와 TypeScript를 사용하여 개발된 웹 기반 게임 플랫폼입니다. 여러 클래식 게임을 단일 애플리케이션에서 제공합니다.

### 기술 스택
- **프론트엔드**: React, TypeScript, Tailwind CSS
- **라우팅**: React Router
- **메타데이터 관리**: React Helmet Async
- **테스트**: Jest/Vitest, React Testing Library

### 디렉토리 구조

```
/src
├── App.tsx              # 메인 애플리케이션 컴포넌트 및 라우팅 설정
├── index.tsx            # 애플리케이션 진입점
├── index.css            # 전역 스타일
├── pages/               # 페이지 컴포넌트
│   └── Home.tsx         # 게임 목록이 표시되는 홈페이지
└── games/               # 각 게임 구현 디렉토리
    ├── tetris/          # 테트리스 게임 구현
    └── breakout/        # 벽돌깨기 게임 구현
```

### 애플리케이션 흐름

1. 사용자가 웹사이트에 접속하면 홈 페이지(`Home.tsx`)가 로드됩니다.
2. 홈 페이지에서는 사용 가능한 게임 목록을 카드 형태로 보여줍니다.
3. 사용자가 게임을 선택하면 해당 게임의 라우트로 이동합니다 (예: `/games/tetris`).
4. 각 게임은 자체 디렉토리에서 독립적으로 구현되어 있습니다.

### 설정 파일

프로젝트는 다음과 같은 주요 설정 파일을 포함합니다:

- **package.json**: 프로젝트 의존성과 스크립트 정의
- **vite.config.js**: Vite 빌드 도구 설정 (ESM 형식)
- **postcss.config.js**: PostCSS 설정 (Tailwind CSS 및 autoprefixer 활성화)
- **tailwind.config.js**: Tailwind CSS 설정 및 테마 확장
  - 커스텀 스크린 크기 정의
  - 텍스트 그림자 유틸리티 확장
  - 기타 필요한 플러그인 설정

이 설정 파일들은 모두 ESM(ECMAScript Modules) 형식을 사용합니다.

## 게임 구현 패턴

모든 게임은 일관된 구조를 따라 구현됩니다. 이 패턴은 코드의 유지 관리성과 확장성을 보장하기 위한 것입니다.

### 권장 구조

```
/src/games/[게임명]/
├── [GameName].tsx       # 게임의 메인 컴포넌트
├── constants.ts         # 게임에 필요한 상수 정의
├── types.ts             # 게임 관련 타입 정의
├── utils.ts             # 게임 로직에 필요한 유틸리티 함수
├── components/          # 게임을 구성하는 UI 컴포넌트
├── controllers/         # 게임 제어 로직
├── i18n/                # 국제화 관련 파일 (추가)
│   ├── en.ts
│   ├── ko.ts
│   └── index.ts
└── __tests__/           # 테스트 코드
    ├── [GameName].test.tsx
    ├── utils.test.ts
    └── ...
```

## 게임 구성 요소

각 게임은 다음과 같은 핵심 구성 요소를 가집니다.

### 1. 타입 시스템 (`types.ts`)

게임의 데이터 모델을 정의합니다. 일반적으로 다음과 같은 항목이 포함됩니다:

- **게임 요소 타입**: 게임 보드, 게임 객체, 플레이어 등에 대한 타입 정의
- **게임 상태 타입**: 게임의 현재 상태를 나타내는 enum 또는 타입(실행 중, 일시정지, 게임 오버 등)
- **게임 통계 타입**: 점수, 레벨, 타이머 등의 게임 진행 정보

### 2. 상수 (`constants.ts`)

게임에 필요한 모든 상수 값을 정의합니다:

- **게임 환경 설정**: 크기, 속도, 난이도 등
- **색상 및 스타일 값**: 게임 요소의 시각적 속성
- **키 설정**: 키보드 매핑
- **점수 체계**: 게임 내 점수 계산 규칙
- **게임 특화 상수**: 각 게임의 특성에 맞는 상수

### 3. 유틸리티 함수 (`utils.ts`)

게임 로직을 처리하는 순수 함수들을 모아놓은 파일입니다:

- **게임 초기화 함수**: 게임 보드나 게임 요소의 초기 상태 생성
- **물리 및 충돌 처리**: 게임 객체 간의 충돌 감지 및 해결
- **게임 상태 계산**: 승리, 패배, 점수 계산 등
- **도우미 함수**: 일반적인 유틸리티 기능

### 4. 컨트롤러 (`controllers/`)

사용자 입력과 게임 제어를 처리하는 모듈입니다:

- **입력 처리**: 키보드, 마우스, 터치 이벤트 처리
- **이벤트 발행**: 게임 이벤트 처리를 위한 콜백 관리
- **게임 루프 관리**: 게임의 주요 루프와 타이밍 관리

각 게임은 자신만의 컨트롤러 클래스를 가지며, 이는 표준화된 인터페이스를 제공합니다.

### 5. UI 컴포넌트 (`components/`)

게임의 시각적 요소를 담당하는 React 컴포넌트들입니다:

- **게임 보드/화면**: 주요 게임 영역 렌더링
- **정보 표시 UI**: 점수, 시간, 생명력 등을 표시
- **게임 요소**: 게임 내 객체들을 표현하는 컴포넌트
- **메뉴 및 컨트롤**: 게임 설정 및 컨트롤 UI

컴포넌트 스타일링은 Tailwind CSS를 사용합니다:
- **유틸리티 클래스**: 인라인 스타일링을 위한 Tailwind 클래스 활용
- **반응형 디자인**: Tailwind의 반응형 접두사를 사용하여 다양한 화면 크기 지원
- **복잡한 스타일**: 복잡한 스타일(예: text-shadow)의 경우 인라인 style 속성 활용
- **테마 확장**: `tailwind.config.js`에서 정의된 확장 테마와 커스텀 플러그인 활용

### 6. 메인 게임 컴포넌트 (`[GameName].tsx`)

게임의 전체 상태와 로직을 관리하는 최상위 컴포넌트입니다:

- **상태 관리**: React 상태를 사용한 게임 상태 관리
- **게임 생명주기**: 초기화, 실행, 일시정지, 종료 등 관리
- **이벤트 핸들링**: 사용자 입력 및 게임 이벤트 처리
- **렌더링 조정**: 게임 UI 요소의 조합 및 렌더링

### 7. 국제화 (i18n) 구현

게임 내 텍스트를 여러 언어로 제공하기 위해 국제화(i18n)를 구현합니다.

#### 가. 폴더 구조

각 게임 폴더 내에 `i18n` 디렉토리를 생성합니다.

```
/src/games/[게임명]/
├── ...
└── i18n/
    ├── en.ts         # 영어 번역
    ├── ko.ts         # 한국어 번역
    ├── ...           # 기타 지원 언어
    └── index.ts      # 번역 통합 및 훅 제공
```

#### 나. 번역 파일 구조 (`[언어코드].ts`)

각 언어 파일은 특정 언어에 대한 번역 문자열을 포함하는 객체를 export 합니다. 일관성을 위해 키 구조를 통일합니다 (예: `meta`, `game`, `stats`, `messages`, `controls`, `buttons`, `directions`).

```typescript
// 예시: en.ts
export const en = {
  meta: {
    title: 'Game Title',
    description: 'Game description.',
  },
  game: {
    title: 'Breakout',
    start: 'Start Game',
    // ...
  },
  stats: {
    score: 'Score',
    // ...
  },
  messages: {
    gameOver: 'Game Over',
    levelComplete: 'Level {level} Complete!', // 동적 값 포함
    startInstruction: 'Press Spacebar or click...<br />to start', // HTML 포함
    // ...
  },
  // ... 기타 카테고리
}
```

#### 다. 번역 통합 (`index.ts`)

`i18n/index.ts` 파일은 다음 역할을 수행합니다:
- 각 언어 번역 파일을 import 합니다.
- 모든 번역을 포함하는 `translations` 객체를 export 합니다.
- 지원하는 언어 코드 타입을 정의합니다 (`Language`).
- 번역 객체의 구조를 정의하는 `TranslationType` 인터페이스 또는 타입을 export 합니다.
- 현재 언어에 맞는 번역 객체를 반환하는 `useTranslation` 훅을 제공합니다.

```typescript
// 예시: i18n/index.ts
import { en } from './en'
import { ko } from './ko'
// ... 다른 언어 import

export const translations = { en, ko, /* ... */ }

export type Language = keyof typeof translations

// TranslationType 인터페이스 또는 타입 정의 (en.ts 구조 기반 추천)
export type TranslationType = typeof en
// 또는: export interface TranslationType { ... 상세 정의 ... }

export const useTranslation = (language: Language): TranslationType => {
  return translations[language] || en // 기본 언어 fallback
}
```

#### 라. 컴포넌트에서 사용

1.  **메인 게임 컴포넌트 (`[GameName].tsx`)**:
    - 언어 상태를 관리합니다 (`useState`).
    - `useTranslation` 훅을 호출하여 현재 언어의 `t` 객체를 가져옵니다.
    - 언어 선택 UI (예: `<select>`)를 제공합니다.
    - 필요한 하위 컴포넌트에 `t` 객체를 prop으로 전달합니다.
    - `react-helmet-async`의 `Helmet`을 사용하여 `<title>` 및 `<meta name="description">`을 번역합니다.

    ```typescript
    import { useTranslation, Language } from './i18n/index' // 경로 확인!
    import { Helmet } from 'react-helmet-async'

    const MyGame: React.FC = () => {
      const [language, setLanguage] = useState<Language>('ko')
      const t = useTranslation(language)

      return (
        <div>
          <Helmet>
            <title>{t.meta.title}</title>
            <meta name="description" content={t.meta.description} />
          </Helmet>
          {/* 언어 선택 UI */}
          <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="absolute top-4 right-4 z-10">
            <option value="ko">한국어</option>
            <option value="en">English</option>
            {/* ... */}
          </select>

          {/* 하위 컴포넌트에 t 전달 */}
          <GameBoard t={t} /* ...other props */ />
          {/* ... */}
        </div>
      )
    }
    ```

2.  **하위 컴포넌트 (`components/*.tsx`)**:
    - Props 인터페이스에 `t: TranslationType`을 추가합니다.
    - Prop으로 받은 `t` 객체를 사용하여 텍스트를 렌더링합니다.
    - 동적 값: 문자열의 `replace` 메서드를 사용합니다 (예: `t.messages.levelComplete.replace('{level}', level.toString())`).
    - HTML 포함: `dangerouslySetInnerHTML` 속성을 사용합니다 (예: `<p dangerouslySetInnerHTML={{ __html: t.messages.startInstruction }} />`).

    ```typescript
    import { TranslationType } from '../i18n/index' // 올바른 경로 확인!

    interface GameBoardProps {
      // ... other props
      t: TranslationType
    }

    const GameBoard: React.FC<GameBoardProps> = ({ /* ..., */ t }) => {
      // ...
      return (
        <div>
          <h1>{t.game.title}</h1>
          <p>{t.stats.score}: {score}</p>
          {/* ... */}
        </div>
      )
    }
    ```

#### 마. 주의사항
- 모든 사용자 표시 텍스트는 번역 키를 통해 관리합니다. 하드코딩된 문자열을 사용하지 않습니다.
- 타입 에러 발생 시 `i18n/index.ts`의 `TranslationType` 정의와 실제 번역 파일 구조가 일치하는지, 그리고 import 경로가 올바른지 확인합니다. (`./i18n/index` 또는 `../i18n/index` 등)
- 개발 서버/TypeScript 서버 재시작이 타입 관련 문제를 해결하는 데 도움이 될 수 있습니다.

## 테스트 코드 작성

모든 게임은 테스트 코드를 포함해야 합니다. 테스트는 `__tests__` 폴더에 작성하며, 다음과 같은 패턴을 따릅니다.

### 테스트 구조

```
/src/games/[게임명]/__tests__/
├── [GameName].test.tsx      # 메인 컴포넌트 테스트
├── utils.test.ts            # 유틸리티 함수 테스트
├── components.test.tsx      # UI 컴포넌트 테스트
└── controllers.test.ts      # 컨트롤러 테스트
```

### 테스트 유형

#### 1. 유틸리티 함수 테스트 (`utils.test.ts`)

게임 로직을 담당하는 순수 함수들을 테스트합니다:

```typescript
import { 
  createGameBoard, 
  calculateScore, 
  detectCollision 
} from '../utils'
import { GameConstants } from '../constants'

describe('게임 유틸리티 함수 테스트', () => {
  describe('createGameBoard', () => {
    it('올바른 크기의 게임 보드를 생성해야 함', () => {
      const board = createGameBoard()
      expect(board.length).toBe(GameConstants.BOARD_HEIGHT)
      expect(board[0].length).toBe(GameConstants.BOARD_WIDTH)
    })
  })

  describe('detectCollision', () => {
    it('경계와의 충돌을 감지해야 함', () => {
      // 테스트 코드
    })
    
    it('게임 객체 간의 충돌을 감지해야 함', () => {
      // 테스트 코드
    })
  })
})
```

#### 2. 메인 컴포넌트 테스트 (`[GameName].test.tsx`)

게임의 메인 컴포넌트를 테스트합니다. 복잡한 게임 로직은 모킹(mocking)하여 UI 렌더링과 상호작용에 집중합니다:

```typescript
import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Game from '../Game'

// 필요한 의존성 모킹
jest.mock('../controllers/GameController', () => {
  return {
    GameController: class MockController {
      constructor() {}
      attach() {}
      detach() {}
    }
  }
})

describe('게임 컴포넌트 테스트', () => {
  it('게임 UI가 올바르게 렌더링되어야 함', () => {
    const { getByText, getByTestId } = render(
      <BrowserRouter>
        <Game />
      </BrowserRouter>
    )
    
    expect(getByText('점수: 0')).toBeInTheDocument()
    expect(getByTestId('game-board')).toBeInTheDocument()
  })
  
  it('게임 시작 버튼이 동작해야 함', () => {
    // 테스트 코드
  })
})
```

#### 3. 컨트롤러 테스트 (`controllers.test.ts`)

게임의 컨트롤러 로직을 테스트합니다:

```typescript
import { GameController } from '../controllers/GameController'

describe('게임 컨트롤러 테스트', () => {
  let controller
  let mockCallbacks
  
  beforeEach(() => {
    // 모의 콜백 함수 설정
    mockCallbacks = {
      onMoveLeft: jest.fn(),
      onMoveRight: jest.fn(),
      onPause: jest.fn()
    }
    
    controller = new GameController(mockCallbacks)
  })
  
  it('키보드 이벤트를 올바르게 처리해야 함', () => {
    // 키보드 이벤트 시뮬레이션
    const leftKeyEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    window.dispatchEvent(leftKeyEvent)
    
    expect(mockCallbacks.onMoveLeft).toHaveBeenCalled()
  })
})
```

### 테스트 모범 사례

1. **단위 테스트**: 모든 유틸리티 함수와 컨트롤러 메서드는 단위 테스트로 검증합니다.
2. **통합 테스트**: UI 컴포넌트의 상호작용과 통합을 테스트합니다.
3. **모킹**: 외부 의존성(타이머, 랜덤 함수, DOM API 등)은 모킹하여 테스트의 일관성을 유지합니다.
4. **스냅샷 테스트**: UI 컴포넌트의 변경을 감지하기 위해 스냅샷 테스트를 사용할 수 있습니다.
5. **테스트 커버리지**: 중요 게임 로직에 대해 높은 테스트 커버리지를 유지합니다.

이러한 테스트는 게임이 예상대로 동작하는지 확인하고, 코드 리팩토링이나 기능 추가 시 회귀를 방지하는 데 도움이 됩니다.

## 새로운 게임 추가 방법

새로운 게임을 추가하는 방법을 단계별로 설명합니다:

### 1. 게임 요구사항 분석

새 게임에 필요한 요소를 파악합니다:
- 게임 규칙 및 메커니즘
- 필요한 UI 구성 요소
- 입력 방식 및 상호작용
- 점수 시스템 및 게임 상태

### 2. 폴더 구조 설정

표준 패턴에 따라 게임 폴더 구조를 만듭니다:

```
/src/games/[새로운게임명]/
├── [NewGame].tsx
├── constants.ts
├── types.ts
├── utils.ts
├── components/
├── controllers/
├── i18n/              # 국제화 폴더 추가
│   ├── en.ts
│   ├── ko.ts
│   └── index.ts
└── __tests__/         # 테스트 코드
    ├── [NewGame].test.tsx
    ├── utils.test.ts
    └── ...
```

### 3. 타입 정의하기

`types.ts` 파일에 게임에 필요한 모든 타입과 인터페이스를 정의합니다:
- 게임 보드나 주요 객체의 데이터 구조
- 게임 상태 열거형(enum)
- 게임 통계 및 설정 인터페이스

### 4. 상수 정의하기

`constants.ts` 파일에 게임에 필요한 모든 상수를 정의합니다:
- 게임 영역 크기
- 색상 및 스타일 값
- 키 매핑
- 점수 체계
- 기타 게임 매개변수

### 5. 유틸리티 함수 구현하기

`utils.ts` 파일에 게임 로직을 처리하는 순수 함수들을 구현합니다:
- 게임 초기화 함수
- 물리 및 충돌 처리
- 게임 상태 계산
- 기타 유틸리티 함수

### 6. 컨트롤러 구현하기

`controllers/` 디렉토리에 게임 입력을 처리하는 클래스나 함수를 구현합니다:
- 키보드/마우스/터치 이벤트 처리
- 게임 루프 관리
- 이벤트 핸들러 및 콜백

### 7. UI 컴포넌트 구현하기

`components/` 디렉토리에 게임 UI를 구성하는 컴포넌트들을 구현합니다:
- 게임 보드/화면
- 점수판 및 상태 표시
- 컨트롤 UI 및 메뉴
- 게임 요소 컴포넌트

스타일링은 Tailwind CSS 클래스를 활용하여 구현합니다:
```typescript
const GameElement: React.FC = () => {
  return (
    <div className="bg-black w-[150px] h-[150px] flex items-center justify-center border-2 border-gray-700 rounded">
      <span className="text-white text-xl font-bold" style={{ textShadow: '0 0 8px #3333cc' }}>
        게임 요소
      </span>
    </div>
  )
}
```

반응형 디자인을 위해 Tailwind CSS의 반응형 접두사를 활용합니다:
```typescript
<div className="w-[30px] h-[30px] md:w-[25px] md:h-[25px] sm:w-[20px] sm:h-[20px]" />
```

### 8. 메인 게임 컴포넌트 구현하기

`[NewGame].tsx` 파일에 게임의 메인 컴포넌트를 구현합니다:
- React 상태를 사용한 게임 상태 관리
- 유틸리티 함수와 컨트롤러 통합
- 게임 생명주기 관리
- UI 컴포넌트 조합

### 9. 국제화(i18n) 설정하기

위에서 설명한 "국제화 (i18n) 구현" 가이드라인에 따라 번역 파일 및 관련 로직을 구현합니다.

### 10. 테스트 코드 작성하기

`__tests__/` 디렉토리에 게임의 각 부분을 테스트하는 코드를 작성합니다:
- 유틸리티 함수 테스트 (`utils.test.ts`)
- 메인 컴포넌트 테스트 (`[NewGame].test.tsx`)
- 컨트롤러 테스트 (필요한 경우)
- UI 컴포넌트 테스트 (필요한 경우)

### 11. App.tsx에 라우트 추가하기

`App.tsx` 파일에 새로운 게임의 라우트를 추가합니다:

```typescript
<Route path="/games/[새로운게임명]" element={<NewGame />} />
```

### 12. 홈 페이지에 게임 추가하기

`Home.tsx` 파일의 게임 목록에 새 게임을 추가합니다:

```typescript
const games: GameInfo[] = [
  // 기존 게임들...
  {
    id: '[새로운게임명]',
    title: '새 게임 제목',
    description: '새 게임 설명',
    path: '/games/[새로운게임명]',
    imageUrl: '/images/[새로운게임명]-thumbnail.png',
  },
];
```

### 13. 테스트 및 디버깅

새로 구현한 게임을 테스트하고 디버깅합니다:
- 게임 메커니즘 테스트
- 사용자 입력 테스트
- 브라우저 호환성 확인
- 성능 최적화
- 자동화된 테스트 실행 및 검증

### 14. SEO 최적화

게임 페이지에 대한 SEO 최적화를 위해 다음 요소를 고려합니다:

1. **메타 태그 최적화**: `react-helmet-async`를 사용하여 동적으로 번역된 `<title>` 및 `<meta name="description">` 설정 (국제화 가이드라인 참조).
2. **sitemap.xml**: 새로운 게임이 추가될 때마다 sitemap.xml 파일을 업데이트하여 해당 게임의 URL 정보를 추가합니다. 각 게임 URL에 대한 lastmod, changefreq, priority 값을 적절히 설정합니다.

이 가이드를 따라 구현하면 기존 아키텍처와 일관성 있는 새로운 게임을 추가할 수 있습니다. 