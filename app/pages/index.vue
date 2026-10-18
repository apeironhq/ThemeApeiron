<script setup lang="ts">
/**
 * Homepage — landing page ApeironKit.
 * Setiap section ada di components/Landing*.vue, teksnya di data/content.ts.
 */
onMounted(async () => {
  // GSAP + plugin dimuat di browser saja, lalu landing.js (sama persis dengan versi WordPress) dijalankan.
  const [{ gsap }, { ScrollTrigger }, { ScrollSmoother }, { SplitText }, { DrawSVGPlugin }, { initLanding }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/ScrollSmoother'),
    import('gsap/SplitText'),
    import('gsap/DrawSVGPlugin'),
    import('~/assets/js/landing.js'),
  ])
  const { initWidgetPanel } = await import('~/assets/js/widgets.js')
  Object.assign(window, { gsap, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin })
  initLanding()
  initWidgetPanel()
})
</script>

<template>
  <div>
    <div class="ap-cursor" aria-hidden="true">
      <div class="ap-cursor__dot"></div>
      <div class="ap-cursor__ring"><span class="ap-cursor__circle"></span><span class="ap-cursor__label"></span></div>
    </div>

    <LandingNav />

    <div id="smooth-wrapper">
      <div id="smooth-content">
        <main id="konten">
          <LandingHero />
          <LandingStory />
          <LandingJourney />
          <LandingWidgets />
          <LandingDashboard />
          <LandingBento />
          <LandingAudience />
          <LandingSteps />
          <LandingUpdates />
          <LandingTestimonials />
          <LandingPricing />
          <LandingFaq />
          <LandingCta />
        </main>
        <LandingFooter />
      </div>
    </div>
  </div>
</template>
