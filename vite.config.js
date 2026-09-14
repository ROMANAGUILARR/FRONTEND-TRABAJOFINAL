import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
   proxy: {
       '/api': {
         target: 'http://localhost:8081',
         changeOrigin: true,
         timeout: 120000,
       },
       '/incidencias': {
         target: 'http://localhost:8081',
         changeOrigin: true,
         timeout: 120000,
       },
       '/usuario': {
         target: 'http://localhost:8081',
         changeOrigin: true,
         timeout: 120000,
       },
       '/insignias': {
         target: 'http://localhost:8081',
         changeOrigin: true,
         timeout: 120000,
       },
       '/educacion': {
         target: 'http://localhost:8081',
         changeOrigin: true,
         timeout: 120000,
       },
     },
  },
})
