import { defineConfig } from 'vite'

// Dynamically import ESM-only plugins to avoid require/ESM load errors on some Node setups.
export default defineConfig(async () => {
  const reactPlugin = (await import('@vitejs/plugin-react')).default
  return {
    plugins: [reactPlugin()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})