# Tastro

SSR-first i18n for Astro.

## 安装

```bash
pnpm i "@sipc.ink/tastro"
```

## 使用

### 1. 配置

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

### 2. 创建翻译文件

**`./locales/zh.json`**
```json
{
  "welcome": "欢迎",
}
```

**`./locales/en.json`**
```json
{
  "welcome": "Welcome",
}
```

### 3. 在 Astro 中使用

```astro
---
import { useTastro } from '@sipc.ink/tastro'

const { t, lang } = useTastro(Astro.request)
// 引入 request 是为了自动判断请求中的 Accept-Language
---

<h1>{t('welcome')}</h1>
<p>当前语言: {lang}</p>
```

### 4. 手动切换语言

```html

function (lang) {
    document.cookie = `lang=${lang}; path=/; max-age=31536000`
    location.reload()
  }

```

## API

- `initTastro(config)` - 初始化配置
- `useTastro(request)` - 创建运行时
  - `t(key, vars)` - 翻译文本
  - `lang` - 当前语言

## 特性

- 🚀 SSR 优先
- ⚡ 零依赖，轻量
- 📦 自动缓存
- 🍪 智能语言检测（Cookie → Accept-Language → 默认）