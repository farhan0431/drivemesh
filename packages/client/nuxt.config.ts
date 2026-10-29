export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  srcDir: '.',
  buildDir: process.env.DRIVEMESH_BUILD_DIR || '.nuxt',
  nitro: { output: { dir: process.env.DRIVEMESH_BUILD_OUTPUT || '.output' } },
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
        { rel: 'icon', type: 'image/png', href: '/brand/drivemesh-logo.png' },
        { rel: 'stylesheet', href: 'https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap' },
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
  runtimeConfig: { apiProxyTarget: process.env.API_PROXY_TARGET || 'http://127.0.0.1:5080' },
});
