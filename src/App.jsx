import { useState } from 'react'
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion'
import Header from './components/Header.jsx'
import BagDrawer from './components/BagDrawer.jsx'
import Looks from './scenes/Looks.jsx'
import Rack from './scenes/Rack.jsx'
import Sneakers from './scenes/Sneakers.jsx'
import { BagProvider } from './store.jsx'
import { EASE } from './hooks.js'

const SCENE_COMPONENTS = { looks: Looks, rack: Rack, sneakers: Sneakers }

export default function App() {
  const [scene, setScene] = useState(() => {
    const h = window.location.hash.replace('#', '')
    return SCENE_COMPONENTS[h] ? h : 'looks'
  })
  const Scene = SCENE_COMPONENTS[scene]

  const changeScene = (s) => {
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
            <AnimatePresence mode="wait">
              <motion.div
                key={scene}
                className="scene-wrap"
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -30, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <LayoutGroup id={scene}>
                  <Scene />
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
