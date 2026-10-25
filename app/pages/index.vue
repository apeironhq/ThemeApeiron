<script setup lang="ts">
/**
 * Homepage — landing page ApeironKit.
 * Setiap section ada di components/Landing*.vue, teksnya di data/content.ts.
 *
 * Performa: semua section adalah markup statis yang dianimasikan JS biasa, jadi tidak
 * di-hydrate ulang oleh Vue (hydrate-never). GSAP diimpor statis supaya ikut di-preload
 * bersama halaman (hero tidak menunggu unduhan setelah mount). Modul section bawah baru
 * dimuat setelah intro hero selesai atau saat pengunjung mulai menggulir, satu per frame.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { initLanding } from '~/assets/js/landing.js'
import '~/assets/css/landing.css'
import '~/assets/css/brand.css'
import '~/assets/css/features.css'
import '~/assets/css/demos.css'
import '~/assets/css/editor.css'
import '~/assets/css/ambient.css'
import '~/assets/css/howto.css'
import '~/assets/css/cards.css'
import '~/assets/css/perf.css'

useHead({
  bodyAttrs: { class: 'ap-landing' },
  script: [{
    // Sembunyikan elemen yang akan dianimasikan; tampilkan lagi jika GSAP gagal berjalan.
    innerHTML: "document.documentElement.classList.add('ap-js');setTimeout(function(){if(!window.__apReady)document.documentElement.classList.remove('ap-js')},4000);",
  }],
})

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; __apLandingReady?: Promise<void> }
const idle = () => new Promise<void>((r) => {
  const w = window as IdleWindow
  if (w.requestIdleCallback) w.requestIdleCallback(() => r(), { timeout: 600 })
  else setTimeout(r, 60)
})
// Tunggu intro hero (~2,8 detik) atau gulir pertama, mana yang lebih dulu.
const afterIntro = () => new Promise<void>((r) => {
  const done = () => { clearTimeout(t); removeEventListener('scroll', done); removeEventListener('wheel', done); removeEventListener('touchstart', done); r() }
  const t = setTimeout(done, 2800)
  addEventListener('scroll', done, { passive: true, once: true })
  addEventListener('wheel', done, { passive: true, once: true })
  addEventListener('touchstart', done, { passive: true, once: true })
})

onMounted(async () => {
  // landing.js (sama dengan versi WordPress) membaca GSAP dari window.
  Object.assign(window, { gsap, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin })
  initLanding()

  // Modul section bawah diunduh sejak awal, tapi dijalankan setelah intro hero dan section
  // atas siap; tiap modul di frame sendiri agar tidak ada tugas panjang yang memotong animasi.
  const modules = Promise.all([
    import('~/assets/js/widgets.js'),
    import('~/assets/js/features.js'),
    import('~/assets/js/howto.js'),
    import('~/assets/js/scrollfx.js'),
  ])
  await Promise.all([afterIntro(), (window as IdleWindow).__apLandingReady])
  const [{ initWidgetPanel }, { initFeatures }, { initHowTo }, { initScrollFx }] = await modules
  for (const init of [initWidgetPanel, initFeatures, initHowTo, initScrollFx]) {
    await idle()
    init()
  }
  await idle()
  ScrollTrigger.refresh()
})
</script>

<template>
  <div>
    <div class="ap-cursor" aria-hidden="true">
      <div class="ap-cursor__dot"></div>
      <div class="ap-cursor__ring"><span class="ap-cursor__circle"></span><span class="ap-cursor__label"></span></div>
    </div>

    <LazyLandingNav hydrate-never />

    <div id="smooth-wrapper">
      <div id="smooth-content">
        <main id="konten">
          <LazyLandingHero hydrate-never />
          <LazyLandingStory hydrate-never />
          <LazyLandingJourney hydrate-never />
          <LazyLandingWidgets hydrate-never />
          <LazyLandingDashboard hydrate-never />
          <LazyLandingBento hydrate-never />
          <LazyLandingAudience hydrate-never />
          <LazyLandingSteps hydrate-never />
          <LazyLandingUpdates hydrate-never />
          <LazyLandingTestimonials hydrate-never />
          <LazyLandingPricing hydrate-never />
          <LazyLandingFaq hydrate-never />
          <LazyLandingCta hydrate-never />
        </main>
        <LazyLandingFooter hydrate-never />
      </div>
    </div>
  </div>
</template>
