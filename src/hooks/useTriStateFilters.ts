import { useCallback, useMemo, useState } from 'react'

import type { Tri } from '../types'

export function useTriStateFilters() {
  const [attrFilters, setAttrFilters] = useState<Record<number, Tri>>({})

  const cycleAttr = useCallback((id: number) => {
    setAttrFilters((prev) => {
      const cur = prev[id] ?? 0
      const next = (cur === 0 ? 1 : cur === 1 ? -1 : 0) as Tri
      const copy = { ...prev, [id]: next }
      if (next === 0) delete copy[id]
      return copy
    })
  }, [])

  const clearAll = useCallback(() => setAttrFilters({}), [])

  const activeCount = useMemo(() => Object.keys(attrFilters).length, [attrFilters])

  return { activeCount, attrFilters, clearAll, cycleAttr }
}
