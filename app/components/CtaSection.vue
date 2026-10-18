<script setup lang="ts">
import { ArrowUpRight, MessageCircle, Send } from 'lucide-vue-next'
import { cta } from '~/data/content'
import { site } from '~/data/site'
import { useGsap } from '~/composables/useGsap'

const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)

// Persyaratan asli dari header plugin ApeironKit.
const requirements = ['ApeironKit 1.5.5', 'WordPress 6.0+', 'PHP 7.4+', 'Elementor (gratis sudah cukup)']

useGsap(root, ({ gsap, SplitText }) => {
  // Panel navy membesar dari tengah saat di-scroll, seperti tirai yang dibuka.
  gsap.fromTo(
    panel.value,
    { clipPath: 'inset(10% 6% 10% 6% round 40px)' },
    {
      clipPath: 'inset(0% 0% 0% 0% round 28px)',
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top 95%', end: 'top 35%', scrub: 0.8 }
    }
  )

  SplitText.create(title.value!, {
    type: 'lines,words',
    mask: 'lines',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.words, {
        yPercent: 110,
        stagger: 0.05,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: panel.value, start: 'top 60%', once: true }
      })
  })

  gsap.from('[data-cta-fade]', {
    autoAlpha: 0,
    y: 24,
    stagger: 0.1,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: panel.value, start: 'top 55%', once: true }
  })
})
</script>

<template>
  <section id="kontak" ref="root" class="scroll-mt-20 px-[clamp(8px,2vw,24px)] pb-[clamp(60px,8vw,100px)]">
    <div
      ref="panel"
      class="relative mx-auto max-w-[1360px] overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#0e5578_0%,#083c57_45%,#04263a_100%)] text-white"
    >
      <div class="container-ap py-[clamp(72px,11vw,140px)] text-center">
        <p data-cta-fade class="eyebrow justify-center !text-sand">Mulai sekarang</p>
        <h2
          ref="title"
          class="mx-auto mt-6 max-w-[880px] text-[clamp(38px,5.6vw,76px)] font-light leading-[1.04] tracking-[-0.03em]"
        >
          {{ cta.title }}
        </h2>
        <p data-cta-fade class="mx-auto mt-6 max-w-[520px] text-base leading-relaxed text-white/70 sm:text-lg">{{ cta.lead }}</p>

        <div data-cta-fade class="mt-10 flex flex-wrap justify-center gap-3">
          <a
            v-magnetic
            :href="site.portalUrl"
            target="_blank"
            rel="noopener"
            class="group inline-flex h-[52px] items-center gap-2 rounded-full bg-white px-7 text-[15px] font-medium text-navy-900"
          >
            Dapatkan lisensi
            <ArrowUpRight class="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <a
            v-magnetic
            :href="site.demoRequestUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/25 px-7 text-[15px] font-medium transition-colors hover:bg-white/10"
          >
            <MessageCircle class="size-4" aria-hidden="true" />
            Minta demo via WhatsApp
          </a>
          <a
            v-magnetic
            :href="site.telegramUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/25 px-7 text-[15px] font-medium transition-colors hover:bg-white/10"
          >
            <Send class="size-4" aria-hidden="true" />
            Telegram
          </a>
        </div>

        <ul data-cta-fade class="mt-12 flex flex-wrap justify-center gap-2 text-[13px] text-white/60">
          <li v-for="item in requirements" :key="item" class="rounded-full border border-white/10 px-3.5 py-1.5">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
