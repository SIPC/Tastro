import type { TastroConfig } from "./types"

const cache = new Map<string, any>()

export interface TastroRuntime {
  readonly lang: string
  t: (key: string, vars?: Record<string, any>) => Promise<string>
  setLang: (lang: string) => void
}


export function createRuntime(
  request: Request,
  config: TastroConfig
): TastroRuntime {
  let currentLang = detectLanguage(request, config)

  return {
    get lang() {
      return currentLang
    },

    setLang(lang: string) {
      if (config.languages[lang]) {
        currentLang = lang
      }
    },

    t: async (key: string, vars?: Record<string, any>) => {
      const dict = await loadLanguage(currentLang, config)
      const value = resolveKey(dict, key)

      if (typeof value !== "string") return key

      return interpolate(value, vars)
    }
  }
}

/* ---------- Language detection ---------- */

function detectLanguage(
  request: Request,
  config: TastroConfig
): string {
  const cookie = request.headers.get("cookie")
  const cookieLang = parseCookie(cookie)?.lang
  if (cookieLang && config.languages[cookieLang]) {
    return cookieLang
  }

  const header = request.headers.get("accept-language")
  if (!header) return config.defaultLang

  const accepted = parseAcceptLanguage(header)

  for (const lang of accepted) {
    if (config.languages[lang]) return lang
    const base = lang.split("-")[0]
    if (config.languages[base]) return base
  }

  return config.defaultLang
}

function parseCookie(cookie?: string | null): Record<string, string> {
  if (!cookie) return {}
  return Object.fromEntries(
    cookie.split(";").map(c => {
      const [k, ...v] = c.trim().split("=")
      return [k, decodeURIComponent(v.join("="))]
    })
  )
}

function parseAcceptLanguage(header: string): string[] {
  return header
    .split(",")
    .map(part => part.split(";")[0].trim())
}

/* ---------- Translator ---------- */

async function loadLanguage(
  lang: string,
  config: TastroConfig
) {
  if (cache.has(lang)) return cache.get(lang)

  const loader =
    config.languages[lang] ??
    config.languages[config.defaultLang]

  const mod = await loader()
  const data = mod.default ?? mod

  cache.set(lang, data)
  return data
}

/* ---------- Key resolver ---------- */

function resolveKey(obj: any, path: string): any {
  return path
    .split(".")
    .reduce((acc, key) => acc?.[key], obj)
}

/* ---------- Interpolation ---------- */

function interpolate(
  template: string,
  vars?: Record<string, any>
): string {
  if (!vars) return template

  return template.replace(
    /\{(\w+)\}/g,
    (_, key) => vars[key] ?? `{${key}}`
  )
}
