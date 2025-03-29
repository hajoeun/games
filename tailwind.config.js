/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 클래식 맥 OS 스타일 색상 (UI 영역용)
        classic: {
          'primary': '#FFFFFF',       // 기본 배경색
          'secondary': '#000000',     // 텍스트 및 테두리
          'disabled': '#B6B7B8',      // 비활성화 요소
          'tertiary': '#A5A5A5',      // 보조 색상
        },
        // 게임 영역 색상 (레트로 게임 스타일)
        game: {
          'board': '#1E1E2F',          // 게임 보드
          'highlight': '#FFFF33',      // 강조 요소
          'primary-btn': '#FF0066',    // 주요 게임 버튼
          'text': '#FFFFFF',           // 게임 텍스트
          'warning': '#FF3300',        // 경고/에러
        },
        // 다크 모드 색상
        'dark': {
          'bg': '#000000',             // 어두운 배경
          'text': '#FFFFFF',           // 텍스트
          'component': '#1A1A2E',      // 컴포넌트 배경
          'highlight': '#36F9F6',      // 강조 요소
          'disabled': '#777777',       // 비활성화된 텍스트
        },
        // 이전 레트로 색상 호환을 위해 유지
        retro: {
          'bg-primary': '#0D0D1C',
          'bg-secondary': '#1E1E2F',
          'text-highlight': '#FFFF33',
          'primary': '#FF0066',
          'text-primary': '#FFFFFF',
          'text-secondary': '#AAAAAA',
          'warning': '#FF3300',
        },
        'retro-dark': {
          'bg-primary': '#000000',
          'bg-secondary': '#121212',
          'game-board': '#1A1A2E',
          'text-highlight': '#36F9F6',
          'primary': '#FF00AA',
          'text-primary': '#E1E1E1',
          'text-secondary': '#777777',
          'warning': '#FF5252',
          'highlight': '#8B00FF',
          'shadow': '#080816',
        }
      },
      fontFamily: {
        'chicago': ['"Chicago"', 'sans-serif'],
        'monaco': ['"Monaco"', 'monospace'],
        'chicago-12': ['"Chicago_12"', 'sans-serif'],
        'geneva-9': ['"Geneva_9"', 'sans-serif'],
        'pixel': ['"Press Start 2P"', 'monospace'],
        'arcade': ['"ARCADE CLASSIC"', 'monospace'],
      },
      textShadow: {
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        sm: '0 1px 2px var(--tw-shadow-color)',
        md: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
        neon: '0 0 5px #36F9F6, 0 0 10px #36F9F6',
        'neon-pink': '0 0 5px #FF00AA, 0 0 10px #FF00AA',
        'neon-yellow': '0 0 5px #FFFF33, 0 0 10px #FFFF33',
        'retro': '2px 2px 0px #000000',
        'none': 'none',
      },
      screens: {
        'sm': {'max': '480px'},
        'md': {'max': '768px'},
        'xs': {'max': '400px'},
        '2xs': {'max': '360px'},
        '3xs': {'max': '320px'},
      },
      borderWidth: {
        '1.5': '1.5px',
        '3': '3px',
        '5.5': '5.5px',
        '6': '6px',
      },
      spacing: {
        'element': '8px',
        'grouped-element': '6px',
      },
      backgroundImage: {
        'checker-pattern': 'linear-gradient(45deg, #000000 25%, transparent 25%, transparent 75%, #000000 75%, #000000), linear-gradient(45deg, #000000 25%, transparent 25%, transparent 75%, #000000 75%, #000000)',
        'title-bar-pattern': 'linear-gradient(#000000 50%, transparent 50%)',
        'grid-pattern': 'linear-gradient(90deg, #FFFFFF 21px, transparent 1%) center, linear-gradient(#FFFFFF 21px, transparent 1%) center, #000000',
      },
      backgroundSize: {
        'checker': '4px 4px',
        'title-bar': '6.67% 13.33%',
        'grid': '22px 22px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s steps(1) infinite',
        'scanline': 'none',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(0%)' },
        }
      }
    },
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    },
  ],
} 