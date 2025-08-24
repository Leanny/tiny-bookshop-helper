import { Filter, Search } from 'lucide-react'
import { lazy, Suspense, useDeferredValue, useEffect, useMemo, useState } from 'react'

import BookCard from './components/BookCard'
import { useBooks } from './hooks/useBooks'
import useLocalStorage from './hooks/useLocalStorage'
import { useTriStateFilters } from './hooks/useTriStateFilters'
import { listLanguages, setActiveVersion, t } from './i18n'
import type { Book, Lang } from './types'

const FilterPanel = lazy(() => import('./components/FilterPanel'))
const MobileDrawer = lazy(() => import('./components/MobileDrawer'))

export default function App() {
  // persistence
  const [version, setVersion] = useLocalStorage<string>('version', '')
  const [lang, setLang] = useLocalStorage<Lang>('lang', 'EN')
  // data
  const { attributes, books, error, loading, versions } = useBooks(version)

  //ui
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { activeCount, attrFilters, clearAll, cycleAttr } = useTriStateFilters()

  useEffect(() => {
    if (versions.length === 0) return
    const valid = versions.some((v) => v.prefix === version)
    if (!version || !valid) {
      setVersion(versions[0].prefix)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versions])

  useEffect(() => {
    const allPrefixes = versions?.map((v) => v.prefix) ?? []
    setActiveVersion(version, allPrefixes)
  }, [version, versions])

  useEffect(() => {
    if (filtersOpen) document.body.classList.add('overflow-hidden')
    else document.body.classList.remove('overflow-hidden')
    return () => document.body.classList.remove('overflow-hidden')
  }, [filtersOpen])

  const booksWithTranslations = useMemo(
    () =>
      books
        .map((b) => {
          const title = t(lang, b.title)
          const author = t(lang, b.author)
          if (!title || !author || b.mainGenres.length === 0) return null // only show books that are localised
          const translatedAttrs = b.attributes.map((key) => t(lang, key)).filter((s): s is string => !!s)
          return { ...b, __t_attrs: translatedAttrs, __t_author: author, __t_title: title }
        })
        .filter((x): x is Book & { __t_title: string; __t_author: string; __t_attrs: string[] } => !!x)
        .sort((a, b) => a.__t_title.localeCompare(b.__t_title)),
    [books, lang],
  )

  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const textFiltered = useMemo(() => {
    return !deferredQuery
      ? booksWithTranslations
      : booksWithTranslations.filter(
          (b) =>
            b.__t_title.toLowerCase().includes(deferredQuery) || b.__t_author.toLowerCase().includes(deferredQuery),
        )
  }, [booksWithTranslations, deferredQuery])

  const filtered = useMemo(() => {
    const req = new Set<number>()
    const exc = new Set<number>()
    for (const [idStr, state] of Object.entries(attrFilters)) {
      const id = Number(idStr)
      if (state === 1) req.add(id)
      else if (state === -1) exc.add(id)
    }
    return textFiltered.filter((b) => {
      for (const id of exc) if (b.attributeIds.includes(id)) return false
      for (const id of req) if (!b.attributeIds.includes(id)) return false
      return true
    })
  }, [textFiltered, attrFilters])

  const translatedAttributes = useMemo(
    () =>
      attributes
        .map((a) => ({ id: a.id, name: t(lang, a.name) || a.name })) // fall back to key if missing
        .sort((x, y) => (x.name || '').localeCompare(y.name || '')),
    [attributes, lang],
  )

  if (loading) return <div className='p-6 text-lg text-gray-900 dark:text-gray-100'>Loading...</div>

  if (error) {
    return (
      <div className='p-6 text-red-600 dark:text-red-400' role='alert'>
        {error}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100'>
      <header className='sticky top-0 z-20 border-b bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90'>
        <div className='mx-auto max-w-5xl px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3'>
          <h1 className='text-2xl font-semibold'>Tiny Bookshop Database</h1>
          <div className='relative w-full sm:w-64'>
            <label className='sr-only' htmlFor='search'>
              Search by title or author
            </label>
            <input
              aria-label='Search books'
              className='w-full rounded-xl border px-10 py-2 outline-none shadow-sm focus:ring border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 placeholder:opacity-70'
              id='search'
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search by title or author'
              value={query}
            />
            <Search className='pointer-events-none absolute left-3 top-2.5 h-5 w-5 opacity-60' />
          </div>

          <select
            aria-label='Language'
            className='rounded-xl border px-3 py-2 text-sm shadow-sm border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800'
            onChange={(e) => setLang(e.target.value as Lang)}
            title='Language'
            value={lang}
          >
            {listLanguages().map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <select
            aria-label='Game version'
            className='rounded-xl border px-3 py-2 text-sm shadow-sm border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800'
            onChange={(e) => setVersion(e.target.value)}
            title='Game version'
            value={version}
          >
            {versions.map((v) => (
              <option key={v.prefix} value={v.prefix}>
                {v.label}
              </option>
            ))}
          </select>
          <button
            aria-label='Open filters'
            className='inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-sm border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 sm:hidden'
            onClick={() => setFiltersOpen(true)}
          >
            <Filter className='h-4 w-4' /> Filters
          </button>
        </div>
      </header>

      <main className='mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr]'>
        <aside className='sticky top-[84px] hidden h-fit rounded-2xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:block'>
          <FilterPanel
            activeCount={activeCount}
            attrFilters={attrFilters}
            attributes={translatedAttributes}
            clearAll={clearAll}
            cycleAttr={cycleAttr}
          />
        </aside>
        <div className='space-y-4'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            <span className='font-bold'>Bold tags</span> indicate main genre(s) - Please contact{' '}
            <span className='font-semibold'>leanyoshi</span> on Discord if you can provide files from the steam version
            (as I only have access to the switch version).
          </p>
          <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filtered.map((b) => (
              <BookCard b={b} key={b.id} />
            ))}
            {filtered.length === 0 && (
              <div className='col-span-full p-8 text-center opacity-70'>No books match your search/filters.</div>
            )}
          </section>
        </div>
      </main>

      <Suspense fallback={<div className='p-4'>Loading filters...</div>}>
        {filtersOpen && (
          <MobileDrawer onClose={() => setFiltersOpen(false)} title='Filters'>
            <FilterPanel
              activeCount={activeCount}
              attrFilters={attrFilters}
              attributes={translatedAttributes}
              clearAll={clearAll}
              cycleAttr={cycleAttr}
            />
          </MobileDrawer>
        )}
      </Suspense>
    </div>
  )
}
