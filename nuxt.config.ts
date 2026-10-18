import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Apeiron — Widget Undangan Digital untuk Elementor',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Apeiron menghadirkan plugin dan widget Elementor untuk membangun undangan digital yang elegan, interaktif, dan ringan di WordPress.'
        },
        { property: 'og:title', content: 'Apeiron — Widget Undangan Digital untuk Elementor' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500&display=swap'
        }
      ]
    }
  }
})
