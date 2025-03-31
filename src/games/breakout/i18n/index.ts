import { ko } from './ko'
import { en } from './en'
import { ja } from './ja'
import { zh } from './zh'
import { es } from './es'

export const translations = {
  ko,
  en,
  ja,
  zh,
  es,
}

export type Language = keyof typeof translations

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
    nextLevel: string
  }
  stats: {
    score: string
    level: string
    lives: string
    finalScore: string
  }
  controls: {
    title: string
    move: string
    launch: string
  }
  messages: {
    paused: string
    gameOver: string
    levelComplete: string
    startInstruction: string
    nextLevelInstruction: string
  }
  buttons: {
    home: string
  }
}

export const useTranslation = (language: Language): TranslationType => {
  return translations[language]
} 