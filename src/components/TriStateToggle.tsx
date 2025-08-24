import type { Tri } from '../types'

function TriStateToggle({ label, onClick, state }: { state: Tri; onClick: () => void; label: string }) {
  const color =
    state === 1
      ? 'bg-green-600 border-green-600 text-white'
      : state === -1
        ? 'bg-red-600 border-red-600 text-white'
        : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-600'

  const ariaChecked = state === 1 ? true : state === -1 ? 'mixed' : false

  const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onClick()
    }
  }

  const symbol = state === 1 ? '✓' : state === -1 ? '✕' : ''

  return (
    <button
      aria-checked={ariaChecked}
      aria-label={label}
      aria-pressed={undefined}
      className='flex gap-2 text-sm w-full text-left'
      onClick={onClick}
      onKeyDown={onKeyDown}
      role='checkbox'
      title={label}
      type='button'
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border text-[0.65rem] font-bold leading-none focus:outline-none focus:ring ${color}`}
      >
        {symbol}
      </span>
      <span>{label}</span>
    </button>
  )
}

export default TriStateToggle
