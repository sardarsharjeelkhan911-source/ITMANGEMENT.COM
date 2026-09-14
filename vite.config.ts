import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths keep the built storefront deployable from a domain root or subdirectory.
  base: './',
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:4000' } },
})
