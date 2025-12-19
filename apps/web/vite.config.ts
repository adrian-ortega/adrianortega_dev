import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/assets": {
        target: "http://localhost:3000",
      },
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },

  plugins: [react()],
})
