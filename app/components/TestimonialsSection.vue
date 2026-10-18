<script setup lang="ts">
import { gsap } from 'gsap'
import { Quote } from 'lucide-vue-next'
import { testimonials } from '~/data/testimonials'
import { useGsap } from '~/composables/useGsap'
import { horizontalLoop, type HorizontalLoop } from '~/utils/horizontalLoop'

const root = ref<HTMLElement | null>(null)
let loop: HorizontalLoop | undefined

// Testimoni berjalan pelan tanpa ujung; berhenti saat disentuh/di-hover, bisa digeser.
useGsap(root, ({ gsap, ScrollTrigger }) => {
  const cards = gsap.utils.toArray<HTMLElement>('[data-quote]')
  if (cards.length < 2) return

  loop = horizontalLoop(cards, { repeat: -1, speed: 0.35, draggable: true, paddingRight: 16 })

  ScrollTrigger.create({
    trigger: root.value,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (self.isActive ? loop?.play() : loop?.pause())
  })

  return () => {
    loop?.destroy()
    loop = undefined
  }
})

function pause() {
  if (loop) gsap.to(loop, { timeScale: 0, duration: 0.6, ease: 'power2.out', overwrite: true })
}

function resume() {
  if (loop) gsap.to(loop, { timeScale: 1, duration: 0.8, ease: 'power2.in', overwrite: true })
}
</script>

<template>
  <section v-if="testimonials.length" id="testimoni" ref="root" class="scroll-mt-20 overflow-hidden py-[clamp(80px,12vw,140px)]">
    <div class="container-ap">
      <SectionHeading eyebrow="Testimoni" title="Kata mereka yang sudah memakai ApeironKit." align="center" />
    </div>

    <div class="mt-14 flex gap-4 px-4" @pointerenter="pause" @pointerleave="resume">
      <figure
        v-for="item in testimonials"
        :key="item.name + item.quote"
        data-quote
        class="flex w-[min(80vw,380px)] shrink-0 flex-col justify-between rounded-[24px] border border-line bg-surface p-7"
      >
        <Quote class="size-6 text-sand" aria-hidden="true" />
        <blockquote class="mt-5 text-[17px] font-light leading-relaxed text-ink">“{{ item.quote }}”</blockquote>
        <figcaption class="mt-8 border-t border-line pt-5">
          <p class="text-[15px] font-medium">{{ item.name }}</p>
          <p class="mt-0.5 text-sm text-muted">{{ item.role }}</p>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
