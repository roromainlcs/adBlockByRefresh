import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        'serviceWorker': resolve(__dirname, 'serviceWorker.ts'),
        'pageWatcher': resolve(__dirname, 'pageWatcher.ts'),
        // add other scripts as needed
      },
      output: {
        entryFileNames: '[name].js'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
