import { useEffect, useState } from 'react'

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // empty
    }
  }, [key, state])
  return [state, setState] as const
}

export default useLocalStorage
