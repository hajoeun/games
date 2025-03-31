import { ko } from './ko'
import { en } from './en'
import { ja } from './ja'
import { zh } from './zh'
import { es } from './es'

export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es'

export interface TranslationType {
  meta: {
    title: string
    description: string
  }
  game: {
    title: string
    start: string
    restart: string
    continue: string
    newGame: string
  }
  status: {
    win: string
    gameOver: string
  }
  stats: {
    score: string
    bestScore: string
  }
  messages: {
    win: string
    gameOver: string
    continue: string
  }
  settings: {
    title: string
    darkMode: string
  }
  instructions: {
    controls: string
  }
  directions: {
    up: string
    down: string
    left: string
    right: string
  }
}

export const translations: Record<Language, TranslationType> = {
  ko,
  en,
  ja,
  zh,
  es,
}

export const getDefaultLanguage = (): Language => {
  const userLanguage = navigator.language.split('-')[0]
  const supportedLanguages: Language[] = ['ko', 'en', 'ja', 'zh', 'es']
  
  return supportedLanguages.includes(userLanguage as Language) 
    ? userLanguage as Language 
    : 'en'
}

export const useTranslation = (language: Language): TranslationType => {
  return translations[language]
} 