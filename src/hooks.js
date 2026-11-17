import { useEffect, useState } from 'react'

export function useViewport() {
  const get = () => ({ w: window.innerWidth, h: window.innerHeight })
  const [vp, setVp] = useState(get)
  useEffect(() => {
    const on = () => setVp(get())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return vp
}

export function useKey(key, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const on = (e) => {
      if (e.key === key) handler(e)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [key, handler, enabled])
}

export const EASE = [0.22, 1, 0.36, 1]
