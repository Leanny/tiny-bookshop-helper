import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/tiny-bookshop-helper/',
  plugins: [react()],
})
