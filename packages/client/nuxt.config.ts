export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  telemetry: false,
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'DriveMesh | Google Drive Network Gateway',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Pure Stateless Streaming Gateway bridging Google Drive to Windows Explorer, macOS Finder, and iPhone Files' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  devServer: {
    port: 3080,
    host: '0.0.0.0',
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://127.0.0.1:5080/api',
        changeOrigin: true,
      },
    },
  },
});
