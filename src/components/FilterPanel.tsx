import { Filter } from 'lucide-react'

import type { Attr, Tri } from '../types'
import TriStateToggle from './TriStateToggle'

function FilterPanel({
  activeCount,
  attrFilters,
  attributes,
  clearAll,
  cycleAttr,
}: {
  activeCount: number
  attrFilters: Record<number, Tri>
  attributes: Attr[]
  clearAll: () => void
  cycleAttr: (id: number) => void
}) {
  return (
    <>
      <div className='mb-3 flex items-center gap-2'>
        <Filter className='h-5 w-5' />
        <h2 className='font-medium'>Filter</h2>
      </div>

      <div className='max-h-[60vh] space-y-1 overflow-auto pr-1'>
        {attributes.map((a) => (
          <TriStateToggle key={a.id} label={a.name} onClick={() => cycleAttr(a.id)} state={attrFilters[a.id] ?? 0} />
        ))}
      </div>

      {activeCount > 0 && (
        <button className='text-sm underline opacity-80 hover:opacity-100' onClick={clearAll}>
          Clear ({activeCount})
        </button>
      )}
    </>
  )
}

export default FilterPanel
