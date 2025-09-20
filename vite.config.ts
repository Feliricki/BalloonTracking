import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/windborn': {
        target: 'https://a.windbornesystems.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/windborn/, '')
      }
    }
  }
})
