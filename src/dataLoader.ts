import versionsJson from './data/versions.json'
import type { Book, VersionItem } from './types'

type CompiledPayload = {
  attributes: { id: number; name: string }[]
  books: Book[]
}

const compiled = import.meta.glob('./data/*books_compiled.json', { eager: false }) as Record<
  string,
  () => Promise<{ default: CompiledPayload }>
>

function buildCompiledIndex() {
  const map = new Map<string, () => Promise<CompiledPayload>>()
  for (const [path, loader] of Object.entries(compiled)) {
    const key = path.split('/').pop()!.replace('books_compiled.json', '')
    map.set(key, async () => (await loader()).default)
  }
  return map
}

const compiledIndex = buildCompiledIndex()

export async function loadVersions(): Promise<VersionItem[]> {
  return versionsJson as VersionItem[]
}

export async function loadBooksForVersion(prefix: string) {
  const loader = compiledIndex.get(prefix)
  if (!loader) throw new Error(`No data for ${prefix}`)
  return loader()
}

export async function loadBooksForPrefixes(prefixes: string[]): Promise<CompiledPayload> {
  const payloads = await Promise.all(prefixes.map(loadBooksForVersion))
  const bookMap = new Map<string, Book>()
  const attrMap = new Map<number, string>()

  for (const payload of payloads) {
    for (const b of payload.books) bookMap.set(b.id, b)
    for (const a of payload.attributes) if (!attrMap.has(a.id)) attrMap.set(a.id, a.name)
  }
  const attributes = Array.from(attrMap, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  const books = Array.from(bookMap.values())
  return { attributes, books }
}
