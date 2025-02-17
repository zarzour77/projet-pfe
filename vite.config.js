// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis'
  },
  // Optionnel : ajouter un alias pour process si nécessaire
  resolve: {
    alias: {
      process: "process/browser"
    }
  }
})
