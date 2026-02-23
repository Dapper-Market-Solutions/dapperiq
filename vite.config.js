import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/order': {
          target: env.WEBHOOKURL || 'http://localhost:5678',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/order/, '/webhook/lead-fulfillment'),
        },
      },
    },
  }
})
