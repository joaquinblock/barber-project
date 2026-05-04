import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly', // Permite usar clases CSS en camelCase
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/barber-project-jb/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      // Mapea el símbolo @ a la carpeta src de tu proyecto
      '@': path.resolve(__dirname, './src'),
    },
  }
})