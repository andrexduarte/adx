// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/color-mode', '@nuxt/image', '@nuxtjs/i18n', 'nuxt-gtag'],
  ssr: false,
  css: [
    '~/assets/style/main.scss',
  ],
  gtag: {
    id: 'G-Z5Q741NCDD',
  },
  
  i18n: {
    lazy: true,
    langDir: "locales", 
    strategy: "prefix_except_default",
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'pt-br', language: 'pt-BR', name: 'Português (Brasil)', file: 'pt-br.json' }
    ],
    defaultLocale: 'pt-br',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,  // Não redireciona automaticamente com base no idioma do navegador
      fallbackLocale: 'pt-br',  // Caso não haja cookie, usar pt-br
    }
  },

  app: {
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

    baseURL: '/adx/' // baseURL: '/<repository>/'
  },

  vite: {
      css: {
          preprocessorOptions: {
              scss: {
                  api: "modern-compiler"
              }
          }
      }
  },

  image: {
    dir: 'public/images'
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
