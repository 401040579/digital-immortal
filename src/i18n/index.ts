import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import en from './en'
import zh from './zh'

const translations = { en, zh } as const
export type Locale = keyof typeof translations

interface I18nState {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
      t: (key: string) => {
        const keys = key.split('.')
        let value: any = translations[get().locale]
        for (const k of keys) {
          value = value?.[k]
          if (value === undefined) return key
        }
        return typeof value === 'string' ? value : key
      },
    }),
    { name: 'di-locale', partialize: (s) => ({ locale: s.locale }) }
  )
)
