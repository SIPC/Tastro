export type LanguageLoader = () => Promise<Record<string, any>>

export interface TastroConfig {
  defaultLang: string
  languages: Record<string, LanguageLoader>
}
