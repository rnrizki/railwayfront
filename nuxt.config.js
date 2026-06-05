import { defineNuxtConfig } from 'nuxt/config'
import configJson from './jsConfig.json'

let apiBase = !process.env.API_BASE?.trim() ? '/' : process.env.API_BASE
apiBase += configJson.api.url

export default defineNuxtConfig({
  nitro: {
    // Using 'cloudflare' preset
    preset: 'cloudflare',

    compatibilityFlags: ['nodejs_compat_v2'],

    node: true,

    externals: {
      trace: false
    },

    rollupConfig: {
      external: (id) => id.startsWith('node:')
    },

    routeRules: {
      // === Static pages (best performance) ===
      '/': { prerender: true },
      '/brands': { prerender: true },
      '/categories': { prerender: true },
      '/flash-sale': { prerender: true },

      // === Dynamic pages - Short cache (recommended) ===
      '/product/**': { swr: 30 },        // Only 30 seconds
      '/category/**': { swr: 30 },
      '/shop/**': { swr: 30 },
      '/all': { swr: 30 },
      '/search': { swr: 30 },

      // === Fallback for other pages ===
      '/**': { swr: 30 },

      // === Always SSR (no cache) - Important pages ===
      '/login': { ssr: true },
      '/register': { ssr: true },
      '/forgot-password': { ssr: true },
      '/cart': { ssr: true },
      '/checkout': { ssr: true },
      '/shipping': { ssr: true },
      '/user/**': { ssr: true },
      '/seller/**': { ssr: true },
      '/payfast/**': { ssr: true },

      // === Special files ===
      '/robots.txt': { prerender: false },
      '/sitemap.xml': { prerender: false },
    },

    prerender: {
      routes: ['/', '/brands', '/categories', '/flash-sale'],
      failOnError: false,
    },

    handlers: [
      {
        route: '/robots.txt',
        handler: '~/server/routes/robots.txt.js',
      },
      {
        route: '/sitemap.xml',
        handler: '~/server/routes/sitemap.xml.js',
      }
    ]
  },

  // Helps reduce hydration and caching issues
  experimental: {
    payloadExtraction: false
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {}
        }
      }
    },
    server: {
      hmr: {
        overlay: false,
      },
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/.git/**'],
      },
      fs: {
        strict: true,
      },
    },
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  ssr: true,

  modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@vite-pwa/nuxt'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
      ]
    }
  },

  css: [
    '~/assets/styles/styles.styl',
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE,
      auth_token_key: 'ishop_frontend_auth',
    }
  },

  components: true,

  i18n: {
    compilation: {
      strictMessage: false,
    },
    locales: [
      { code: 'en' },
      { code: 'fr' },
      { code: 'ar' },
      { code: 'tr' },
      { code: 'hi' },
    ],
    lazy: true,
    vueI18n: '~/lang/config.js',
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    defaultLocale: null
  },

  pwa: {
    manifest: {
      name: process.env.APP_NAME,
      short_name: process.env.APP_NAME,
      theme_color: '#000000',
      description: "An ecommerce app",
      icons: [
        {
          src: 'pwa-icon.png',
          sizes: "150x150",
          type: "image/png"
        },
      ]
    },
    workbox: {
      navigateFallback: "/",
    },
    devOptions: {
      enabled: false,
      type: "module"
    }
  },

  build: {
    transpile: []
  },
})
