import { useEffect, useState } from 'react'

import { loadBooksForPrefixes, loadBooksForVersion, loadVersions } from '../dataLoader'
import { setActiveVersion } from '../i18n'
import type { Book, VersionItem } from '../types'

export function useBooks(activePrefix: string) {
  const [versions, setVersions] = useState<VersionItem[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [attributes, setAttributes] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadVersions().then(setVersions)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const vs = await loadVersions()
        if (cancelled) return
        setVersions(vs)
        const prefixes = vs.map((v) => v.prefix)
        await setActiveVersion(activePrefix || undefined, prefixes)
        const { attributes, books } = activePrefix
          ? await loadBooksForVersion(activePrefix)
          : await loadBooksForPrefixes(prefixes)
        if (cancelled) return
        setBooks(books)
        setAttributes(attributes)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activePrefix])

  return { attributes, books, error, loading, versions }
}
