import { useState } from 'react'
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion'
import Header from './components/Header.jsx'
import BagDrawer from './components/BagDrawer.jsx'
import Home from './scenes/Home.jsx'
import Looks from './scenes/Looks.jsx'
import Rack from './scenes/Rack.jsx'
import Sneakers from './scenes/Sneakers.jsx'
import { BagProvider } from './store.jsx'
import { EASE } from './hooks.js'

const SCENE_COMPONENTS = { home: Home, looks: Looks, rack: Rack, sneakers: Sneakers }

export default function App() {
  const [scene, setScene] = useState(() => {
    const h = window.location.hash.replace('#', '')
    return SCENE_COMPONENTS[h] ? h : 'home'
  })
  const Scene = SCENE_COMPONENTS[scene]

  const changeScene = (s) => {
    if (s === scene) return
    setScene(s)
    try {
      window.history.replaceState(null, '', `#${s}`)
    } catch {
      /* ignoré dans les environnements restreints */
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <BagProvider>
        <div className="app">
          <Header scene={scene} onScene={changeScene} />
          <main className="main">
            {/* Transition entre pages : l'ancienne recule et floute, la nouvelle monte par-dessus */}
            <AnimatePresence initial={false}>
              <motion.div
                key={scene}
                className="scene-wrap"
                initial={{ clipPath: 'inset(100% 0% 0% 0% round 32px 32px 0px 0px)', y: 80, zIndex: 2 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', y: 0, zIndex: 2, transition: { duration: 0.9, ease: EASE } }}
                exit={{ scale: 0.9, opacity: 0.2, filter: 'blur(10px)', y: -40, zIndex: 1, transition: { duration: 0.9, ease: EASE } }}
              >
                <LayoutGroup id={scene}>
                  <Scene onNavigate={changeScene} />
                </LayoutGroup>
              </motion.div>
            </AnimatePresence>
          </main>
          <BagDrawer />
        </div>
      </BagProvider>
    </MotionConfig>
  )
}
