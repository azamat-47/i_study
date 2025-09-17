import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    open: true,
  },
  esbuild: {
    drop: ['console', 'debugger'], // ✅ barcha console.* va debugger’larni olib tashlaydi
  },
})
