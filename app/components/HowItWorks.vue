<script setup lang="ts">
import { Palette, Plug, Send, type LucideIcon } from 'lucide-vue-next'
import { steps } from '~/data/content'
import { useGsap } from '~/composables/useGsap'

const icons: Record<string, LucideIcon> = { Palette, Plug, Send }

const root = ref<HTMLElement | null>(null)

useGsap(root, ({ gsap, mm }) => {
  const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-steps]', start: 'top 78%', once: true } })
  tl.from('[data-step]', { autoAlpha: 0, y: 40, stagger: 0.18, duration: 0.9, ease: 'expo.out' }).from(
    '[data-step-icon]',
    { scale: 0, rotation: -45, stagger: 0.18, duration: 0.8, ease: 'back.out(2)' },
    0.15
  )

  // Garis penghubung antar langkah digambar mengikuti scroll.
  mm.add('(min-width: 768px)', () => {
    gsap.fromTo(
      '[data-steps-line]',
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 } }
    )
  })
  mm.add('(max-width: 767px)', () => {
    gsap.fromTo(
      '[data-steps-line-v]',
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } }
    )
  })
})
</script>

<template>
  <section id="cara-kerja" ref="root" class="scroll-mt-20 bg-soft py-[clamp(80px,12vw,140px)]">
    <div class="container-ap">
      <SectionHeading
        eyebrow="Cara kerja"
        title="Dari plugin ke undangan siap kirim, dalam tiga langkah."
        align="center"
      />

      <ol data-steps class="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
        <span class="absolute left-[8%] right-[8%] top-7 hidden h-px bg-line md:block" aria-hidden="true">
          <span data-steps-line class="block h-full origin-left bg-accent" />
        </span>
        <span class="absolute bottom-6 left-7 top-6 w-px bg-line md:hidden" aria-hidden="true">
          <span data-steps-line-v class="block h-full origin-top bg-accent" />
        </span>

        <li v-for="(step, index) in steps" :key="step.title" data-step class="relative flex gap-5 md:flex-col md:items-center md:text-center">
          <span
            data-step-icon
            class="relative grid size-14 shrink-0 place-items-center rounded-2xl border border-line bg-surface text-accent"
          >
            <component :is="icons[step.icon]" class="size-6" aria-hidden="true" />
            <span class="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-accent text-[11px] font-medium text-accent-ink">
              {{ index + 1 }}
            </span>
          </span>
          <div class="md:mt-7">
            <h3 class="text-xl font-medium">{{ step.title }}</h3>
            <p class="mt-3 max-w-[340px] text-[15px] leading-relaxed text-muted md:mx-auto">{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
