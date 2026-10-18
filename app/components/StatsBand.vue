<script setup lang="ts">
import { stats } from '~/data/content'
import { useGsap } from '~/composables/useGsap'

const root = ref<HTMLElement | null>(null)

// Angka dihitung naik saat masuk viewport.
useGsap(root, ({ gsap }) => {
  gsap.utils.toArray<HTMLElement>('[data-stat]').forEach((el) => {
    const end = Number(el.dataset.stat)
    const counter = { value: 0 }
    gsap.to(counter, {
      value: end,
      duration: end > 0 ? 1.8 : 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: root.value, start: 'top 80%', once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(counter.value))
      }
    })
  })

  gsap.from('[data-stat-item]', {
    autoAlpha: 0,
    y: 30,
    stagger: 0.12,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: root.value, start: 'top 80%', once: true }
  })
})
</script>

<template>
  <section ref="root" class="border-y border-line">
    <div class="container-ap grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div v-for="stat in stats" :key="stat.label" data-stat-item class="px-2 py-10 text-center sm:py-14">
        <p class="text-[clamp(52px,7vw,88px)] font-light leading-none tracking-[-0.04em] text-accent">
          <span :data-stat="stat.value">{{ stat.value }}</span>{{ stat.suffix }}
        </p>
        <p class="mt-3 text-sm text-muted">{{ stat.label }}</p>
      </div>
    </div>
  </section>
</template>
