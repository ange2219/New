import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const BagContext = createContext(null)

export function BagProvider({ children }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [pulse, setPulse] = useState(0)
  // Animations « le produit s'envole vers le panier »
  const [flights, setFlights] = useState([])
  const fly = useCallback((product, rect, { openAfter = false } = {}) => {
    const id = Math.random().toString(36).slice(2)
    setFlights((f) => [...f, { id, product, rect, openAfter }])
  }, [])
  const endFlight = useCallback((id) => {
    setFlights((f) => {
      const fl = f.find((x) => x.id === id)
      if (fl?.openAfter) setTimeout(() => setOpen(true), 120)
      return f.filter((x) => x.id !== id)
    })
  }, [])

  const add = useCallback((entries) => {
    const list = Array.isArray(entries) ? entries : [entries]
    setItems((prev) => [...prev, ...list.map((e) => ({ ...e, key: `${e.product.id}-${Math.random().toString(36).slice(2)}` }))])
    setPulse((p) => p + 1)
  }, [])

  const remove = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), [])

  const value = useMemo(
    () => ({
      items,
      add,
      remove,
      open,
      setOpen,
      pulse,
      flights,
      fly,
      endFlight,
      total: items.reduce((s, i) => s + i.product.price, 0),
    }),
    [items, add, remove, open, pulse, flights, fly, endFlight],
  )

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>
}

export const useBag = () => useContext(BagContext)
