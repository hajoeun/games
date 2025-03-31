import { ko } from './ko'
import { en } from './en'
import { ja } from './ja'
import { zh } from './zh'
import { es } from './es'

export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es'

export interface TranslationType {
  menu: {
    file: string
    edit: string
    view: string
    special: string
    help: string
  }
  main: {
    title: string
    subtitle: string
  }
  games: {
    [key: string]: {
      title: string
      description: string
    }
  }
  button: {
    play: string
  }
  footer: {
    copyright: string
  }
  language: {
    select: string
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