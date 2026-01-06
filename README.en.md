# Tastro

SSR-first i18n for Astro.

English | [中文](README.md)

## Demo

[sipc.ink](https://sipc.ink) After entering, input in the console
```
setLang("en")
setLang("zh")
```

## Installation

```bash
pnpm i "@sipc.ink/tastro"
```

## Usage

### 1. Configuration

```astro
---
import { initTastro } from '@sipc.ink/tastro'

initTastro({
  defaultLang: 'zh',
  languages: {
    zh: () => import('./locales/zh.json'),
    en: () => import('./locales/en.json'),
  },
})
---

```

### 2. Create translation files

**`./locales/zh.json`**
```json
{
  "welcome": "欢迎",
  "login-time": "上次登录时间：{time}",
}
```

**`./locales/en.json`**
```json
{
  "welcome": "Welcome",
  "login-time": "Last login time: {time}",
}
```

### 3. Use in Astro

```astro
---
import { useTastro } from '@sipc.ink/tastro'

const { t, lang } = useTastro(Astro.request)
// Passing request is for automatically detecting Accept-Language in the request
---

// Normal
<h1>{t('welcome')}</h1>

// Interpolation
<h1>{t('login-time',{ time: "114514" })}</h1>

// Browser language
<p>Current language: {lang}</p>
```

### 4. Manually switch language

```html
<script>
    function setLang(lang) {
        document.cookie = `lang=${lang}; path=/; max-age=31536000`
        location.reload()
    }
</script>
```

## API

- `initTastro(config)` - Initialize configuration
- `useTastro(request)` - Create runtime
  - `t(key, vars)` - Translate text
  - `lang` - Current language

## Features

- 🚀 SSR-first
- ⚡ Zero dependencies, lightweight
- 📦 Automatic caching
- 🍪 Smart language detection (Cookie → Accept-Language → Default)
```