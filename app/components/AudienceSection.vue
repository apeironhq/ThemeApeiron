<script setup lang="ts">
import { Code, Copy, Inbox, LayoutTemplate, RefreshCw, Tag, type LucideIcon } from 'lucide-vue-next'
import { audience } from '~/data/content'
import { useGsap } from '~/composables/useGsap'

const icons: Record<string, LucideIcon> = { Code, Copy, Inbox, LayoutTemplate, RefreshCw, Tag }

const root = ref<HTMLElement | null>(null)

useGsap(root, ({ gsap }) => {
  gsap.utils.toArray<HTMLElement>('[data-audience-card]').forEach((card, i) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 85%', once: true } })
    tl.from(card, { autoAlpha: 0, y: 60, rotation: i % 2 ? 2 : -2, duration: 1.1, ease: 'expo.out' })
      .from(card.querySelectorAll('[data-point]'), { autoAlpha: 0, x: -16, stagger: 0.08, duration: 0.6 }, 0.35)
  })
})
</script>

<template>
  <section ref="root" class="pb-[clamp(80px,12vw,140px)]">
    <div class="container-ap">
      <SectionHeading
        eyebrow="Untuk siapa"
        title="Dibuat untuk orang yang setiap hari mengerjakan undangan."
        align="center"
      />

      <div class="mt-14 grid gap-5 md:grid-cols-2">
        <article
          v-for="(group, index) in audience"
          :key="group.tag"
          data-audience-card
          class="rounded-[28px] border p-8 sm:p-10"
          :class="index === 0 ? 'border-transparent bg-navy text-white' : 'border-line bg-surface'"
        >
          <span
            class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
            :class="index === 0 ? 'bg-white/10 text-sand' : 'bg-soft text-accent'"
          >
            {{ group.tag }}
          </span>
          <h3 class="mt-6 text-[clamp(24px,2.6vw,32px)] font-normal leading-tight tracking-[-0.015em]">
            {{ group.title }}
          </h3>
          <ul class="mt-8 space-y-4">
            <li v-for="point in group.points" :key="point.text" data-point class="flex items-start gap-3.5">
              <span
                class="grid size-9 shrink-0 place-items-center rounded-xl"
                :class="index === 0 ? 'bg-white/10 text-sand' : 'bg-soft text-accent'"
              >
                <component :is="icons[point.icon]" class="size-[18px]" aria-hidden="true" />
              </span>
              <span class="pt-1.5 text-[15px] leading-relaxed" :class="index === 0 ? 'text-white/80' : 'text-muted'">
                {{ point.text }}
              </span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
