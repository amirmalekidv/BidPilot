import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const PROVIDERS = {
  openai: {
    target: 'https://api.openai.com',
    keyEnv: 'VITE_OPENAI_API_KEY',
  },
  deepseek: {
    target: 'https://api.deepseek.com',
    keyEnv: 'VITE_DEEPSEEK_API_KEY',
  },
}

function createChatProxy(provider, apiKey) {
  return {
    target: provider.target,
    changeOrigin: true,
    rewrite: () => '/v1/chat/completions',
    configure(proxy) {
      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.setHeader('Authorization', `Bearer ${apiKey}`)
        proxyReq.setHeader('Content-Type', 'application/json')
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const providerName = env.VITE_API_PROVIDER || 'deepseek'
  const provider = PROVIDERS[providerName] || PROVIDERS.deepseek
  const apiKey = env[provider.keyEnv] || ''

  const chatProxy = createChatProxy(provider, apiKey)

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/chat': chatProxy,
      },
    },
    preview: {
      proxy: {
        '/api/chat': chatProxy,
      },
    },
  }
})
