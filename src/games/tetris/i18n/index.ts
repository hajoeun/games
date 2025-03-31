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
    pause: string
    resume: string
    restart: string
    continue: string
  }
  status: {
    startScreen: string
    paused: string
    gameOver: string
    playing: string
  }
  instructions: {
    controls: string
  }
  stats: {
    level: string
    score: string
    lines: string
    highScore: string
  }
  pieces: {
    next: string
    hold: string
  }
  messages: {
    paused: string
    gameOver: string
  }
  info: {
    title: string
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