import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

function MobileDrawer({ children, onClose, title }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    closeBtnRef.current?.focus()
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const focusables = el.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusables.length === 0) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    el.addEventListener('keydown', onKeydown)
    return () => el.removeEventListener('keydown', onKeydown)
  }, [])

  return (
    <div aria-labelledby='drawer-title' aria-modal='true' className='fixed inset-0 z-40 md:hidden' role='dialog'>
      <button aria-label='Close filters' className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={onClose} />
      <div
        className='absolute inset-y-0 right-0 w-[85%] max-w-sm rounded-l-2xl border-l bg-white p-4 shadow-xl transition-transform dark:border-gray-800 dark:bg-gray-900'
        ref={panelRef}
      >
        <div className='mb-2 flex items-center justify-between'>
          <h2 className='text-lg font-semibold' id='drawer-title'>
            {title}
          </h2>
          <button
            aria-label='Close'
            className='rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800'
            onClick={onClose}
            ref={closeBtnRef}
          >
            <X className='h-5 w-5' />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default MobileDrawer
