import type { TastroConfig } from "./types"
import { createRuntime } from "./runtime"

let globalConfig: TastroConfig | null = null

export function initTastro(config: TastroConfig) {
  if (globalConfig) {
    return
  }
  globalConfig = config
}

export function useTastro(request: Request) {
  if (!globalConfig) {
    throw new Error("[tastro] initTastro must be called first")
  }

  return createRuntime(request, globalConfig)
}
