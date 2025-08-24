import type { Lang, LocaleFile, TransDict } from './types'

type LocaleLoader = () => Promise<{ default: LocaleFile }>

const localeModules = import.meta.glob('./localisations/*.json', {
  eager: false,
}) as Record<string, LocaleLoader>

function buildLocaleIndex() {
  const re = /^\.\/localisations\/(.+)_([A-Za-z]+)\.json$/
  const map = new Map<string, Map<Lang, LocaleLoader>>()

  for (const [path, loader] of Object.entries(localeModules)) {
    const m = path.match(re)
    if (!m) continue
    const prefixNoUnderscore = m[1]
    const lang = m[2] as Lang
    const prefix = `${prefixNoUnderscore}_`

    if (!map.has(prefix)) map.set(prefix, new Map())
    map.get(prefix)!.set(lang, loader)
  }
  return map
}

const index = buildLocaleIndex()

let activeByLang: Map<Lang, TransDict> = new Map()

export function listLanguages(): Lang[] {
  return ['CN', 'DE', 'EN', 'ES', 'FR', 'HANT', 'JP', 'RU', 'TR']
}

// Turn ["abc", "^def"] -> "abc, def"
function joinStrings(arr?: string[]): string | null {
  if (!arr || arr.length === 0) return null
  const cleaned = arr.map((s) => (s?.startsWith('^') ? s.slice(1) : s)).filter(Boolean)
  if (cleaned.length === 0) return null
  return cleaned.join(', ')
}

/** Translate a localisation key to display text. Returns null if not found. */
export function t(lang: Lang, key: string): string | null {
  const dict = activeByLang.get(lang)
  if (dict && key in dict) return joinStrings(dict[key]?.strings)
  return null
}

async function loadLangDict(loader: LocaleLoader): Promise<TransDict> {
  return (await loader()).default as TransDict
}

async function loadLocalesForPrefix(prefix: string): Promise<Map<Lang, TransDict>> {
  const loaders = index.get(prefix)
  if (!loaders) throw new Error(`No localisation data for prefix "${prefix}"`)
  const out = new Map<Lang, TransDict>()
  await Promise.all(
    Array.from(loaders.entries()).map(async ([lang, loader]) => {
      out.set(lang, await loadLangDict(loader))
    }),
  )
  return out
}

async function loadLocalesForPrefixes(prefixes: string[]): Promise<Map<Lang, TransDict>> {
  const merged = new Map<Lang, TransDict>()

  for (const prefix of prefixes) {
    const perLang = await loadLocalesForPrefix(prefix)
    for (const [lang, dict] of perLang.entries()) {
      const acc = merged.get(lang) ?? {}
      for (const [k, v] of Object.entries(dict)) {
        if (!(k in acc)) acc[k] = v
      }
      merged.set(lang, acc)
    }
  }
  return merged
}

export async function setActiveVersion(prefix?: string, allPrefixes?: string[]) {
  if (prefix) {
    activeByLang = await loadLocalesForPrefix(prefix)
    return
  }
  const srcPrefixes = (allPrefixes?.length ? allPrefixes : Array.from(index.keys())).sort()
  activeByLang = await loadLocalesForPrefixes(srcPrefixes)
}
