// Landing page ApeironKit, port dari tema WordPress ApeironTheme (markup, CSS, dan animasi GSAP yang sama).
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  // Font Ubuntu di-host sendiri (public/fonts, subset Latin), dipakai landing page dan /docs.
  // CSS landing page diimpor di pages/index.vue, CSS dokumentasi di layouts/docs.vue,
  // agar tiap halaman hanya memuat gayanya sendiri.
  css: ['~/assets/css/fonts.css'],
  // CSS dimuat sebagai file (bisa di-cache browser), bukan disisipkan ke HTML:
  // CSS landing page cukup besar, dan HTML yang membengkak memperlambat LCP.
  features: { inlineStyles: false },

  hooks: {
    // Jangan prefetch chunk halaman lain (docs, 13 pratinjau widget) di landing page;
    // chunk itu tetap dimuat saat dibutuhkan, tetapi tidak berebut bandwidth di awal.
    'build:manifest': (manifest) => {
      for (const key in manifest) manifest[key]!.dynamicImports = []
    },
  },

  // Pertahankan spasi antar-elemen seperti output PHP, agar tata letak teks identik.
  vue: { compilerOptions: { whitespace: 'preserve' } },

  // Halaman statis: dirender sekali saat build, lalu disajikan dari CDN Vercel.
  routeRules: {
    '/': { prerender: true },
    '/docs/**': { prerender: true }
  },
  nitro: {
    // /docs dirender statis; halaman tiap widget ditemukan lewat tautan di beranda docs.
    prerender: { crawlLinks: true, routes: ['/docs'] }
  },

  app: {
    // Folder aset unik per build: ada chunk yang isinya berubah tanpa ganti nama,
    // sehingga cache browser bisa menyajikan CSS lama setelah deploy baru.
    buildAssetsDir: `/_nuxt/${Date.now().toString(36)}/`,
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'ApeironKit · Plugin Elementor untuk Undangan Digital',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#083C57' },
        {
          name: 'description',
          content: 'ApeironKit adalah plugin Elementor untuk kebutuhan undangan digital, dengan widget siap pakai seperti sampul pembuka, RSVP ke WhatsApp, musik, ucapan tamu, dan daftar hadiah. Untuk jasa undangan dan agency WordPress.'
        },
        { property: 'og:title', content: 'ApeironKit · Plugin Elementor untuk Undangan Digital' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        // Ikon tab browser: logo Apeiron putih di atas kotak navy.
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/ubuntu-latin-400-normal.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/ubuntu-latin-500-normal.woff2', crossorigin: '' }
      ]
    }
  }
})
