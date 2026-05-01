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
  resolve: {
    alias: {
      // Mapea el símbolo @ a la carpeta src de tu proyecto
      '@': path.resolve(__dirname, './src'),
    },
  }
})