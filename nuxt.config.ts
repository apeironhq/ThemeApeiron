// Landing page ApeironKit, port dari tema WordPress ApeironTheme (markup, CSS, dan animasi GSAP yang sama).
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  css: ['~/assets/css/landing.css'],

  // Pertahankan spasi antar-elemen seperti output PHP, agar tata letak teks identik.
  vue: { compilerOptions: { whitespace: 'preserve' } },

  // Halaman statis: dirender sekali saat build, lalu disajikan dari CDN Vercel.
  routeRules: {
    '/': { prerender: true }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      bodyAttrs: { class: 'ap-landing' },
      title: 'ApeironKit · Plugin Elementor untuk Undangan Digital',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#083C57' },
        {
          name: 'description',
          content: 'ApeironKit memberi jasa undangan dan agency WordPress 13 widget Elementor siap pakai: sampul pembuka, RSVP, musik, buku tamu, dan daftar hadiah.'
        },
        { property: 'og:title', content: 'ApeironKit · Plugin Elementor untuk Undangan Digital' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,500&display=swap'
        }
      ],
      script: [
        {
          // Sembunyikan elemen yang akan dianimasikan; tampilkan lagi jika GSAP gagal berjalan.
          innerHTML: "document.documentElement.classList.add('ap-js');setTimeout(function(){if(!window.__apReady)document.documentElement.classList.remove('ap-js')},4000);"
        }
      ]
    }
  }
})
