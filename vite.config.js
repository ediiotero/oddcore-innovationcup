import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://7zz3xzmge3.execute-api.us-east-1.amazonaws.com', // Your real API
        changeOrigin: true,
        secure: false, // only if self-signed SSL
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
