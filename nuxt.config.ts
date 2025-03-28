// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/color-mode', '@nuxt/image', '@nuxtjs/i18n', 'nuxt-gtag'],
  ssr: true,
  css: [
    '~/assets/style/main.scss',
  ],
  gtag: {
    id: 'G-Z5Q741NCDD',
    config: {
      cookie_flags: 'SameSite=None; Secure'
    }
  },

  i18n: {
    lazy: true,
    langDir: 'locales',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'pt-br', language: 'pt-BR', name: 'Português (Brasil)', file: 'pt-br.json' }
    ],
    defaultLocale: 'pt-br',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'pt-br',
    }
  },

  app: {
    baseURL: '/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ],
      meta: [
        { name: 'apple-mobile-web-app-title', content: 'André Duarte - Front-end developer' },
      ]
    },
    buildAssetsDir: 'assets',
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        }
      }
    }
  },

  image: {
    screens: {
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1280,
    }
  },

  build: {
    transpile: ['@nuxtjs/color-mode'],
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },
})
