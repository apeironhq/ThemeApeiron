<script setup lang="ts">
/**
 * Homepage — landing page ApeironKit.
 * Setiap section ada di components/Landing*.vue, teksnya di data/content.ts.
 *
 * Performa: semua section adalah markup statis yang dianimasikan JS biasa, jadi tidak
 * di-hydrate ulang oleh Vue (hydrate-never). Animasi bagian atas jalan segera; modul
 * untuk section bawah dimuat & dijalankan saat browser luang agar awal halaman ringan.
 */
const whenIdle = (fn: () => void) => {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 1200 })
  else setTimeout(fn, 250)
}

onMounted(async () => {
  // GSAP + plugin dimuat di browser saja, lalu landing.js (sama dengan versi WordPress) dijalankan.
  const [{ gsap }, { ScrollTrigger }, { ScrollSmoother }, { SplitText }, { DrawSVGPlugin }, { initLanding }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/ScrollSmoother'),
    import('gsap/SplitText'),
    import('gsap/DrawSVGPlugin'),
    import('~/assets/js/landing.js'),
  ])
  Object.assign(window, { gsap, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin })
  initLanding()

  whenIdle(async () => {
    const [{ initWidgetPanel }, { initFeatures }, { initScrollFx }, { initHowTo }] = await Promise.all([
      import('~/assets/js/widgets.js'),
      import('~/assets/js/features.js'),
      import('~/assets/js/scrollfx.js'),
      import('~/assets/js/howto.js'),
    ])
    initWidgetPanel()
    initFeatures()
    initHowTo()
    initScrollFx()
    ScrollTrigger.refresh()
  })
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
