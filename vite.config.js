import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // chemins relatifs : le site fonctionne aussi dans un sous-dossier (GitHub Pages : /New/)
  base: './',
})
