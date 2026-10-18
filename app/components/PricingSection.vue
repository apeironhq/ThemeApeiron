<script setup lang="ts">
import { ArrowUpRight, Globe, Headphones, Infinity as InfinityIcon, LayoutTemplate, MessageCircle, RefreshCw, type LucideIcon } from 'lucide-vue-next'
import { pricing } from '~/data/pricing'
import { useGsap } from '~/composables/useGsap'

const icons: Record<string, LucideIcon> = {
  Globe,
  Headphones,
  Infinity: InfinityIcon,
  LayoutTemplate,
  MessageCircle,
  RefreshCw
}

const root = ref<HTMLElement | null>(null)

useGsap(root, ({ gsap }) => {
  gsap.from('[data-plan]', {
    autoAlpha: 0,
    y: 60,
    stagger: 0.12,
    duration: 1.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '[data-plans]', start: 'top 82%', once: true }
  })
})
</script>

<template>
  <section v-if="pricing.length" id="harga" ref="root" class="scroll-mt-20 bg-soft py-[clamp(80px,12vw,140px)]">
    <div class="container-ap">
      <SectionHeading
        eyebrow="Harga"
        title="Pilih paket sesuai skala bisnis Anda."
        lead="Semua paket mendapatkan seluruh widget ApeironKit."
        align="center"
      />

      <div data-plans class="mt-14 grid gap-4 lg:grid-cols-3">
        <article
          v-for="plan in pricing"
          :key="plan.name"
          data-plan
          class="flex flex-col rounded-[28px] border p-8 transition-colors duration-500"
          :class="plan.featured ? 'border-transparent bg-navy text-white' : 'border-line bg-surface hover:border-accent/40'"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">{{ plan.name }}</h3>
            <span v-if="plan.featured" class="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-sand">Paling dipilih</span>
          </div>
          <p class="mt-2 text-sm" :class="plan.featured ? 'text-white/70' : 'text-muted'">{{ plan.description }}</p>
          <p class="mt-8 flex items-baseline gap-2">
            <span class="text-[44px] font-light leading-none tracking-[-0.03em]">{{ plan.price }}</span>
            <span class="text-sm" :class="plan.featured ? 'text-white/60' : 'text-muted'">{{ plan.period }}</span>
          </p>
          <ul class="mt-8 space-y-3.5">
            <li v-for="feature in plan.features" :key="feature.text" class="flex items-center gap-3 text-[15px]">
              <span class="grid size-8 place-items-center rounded-lg" :class="plan.featured ? 'bg-white/10 text-sand' : 'bg-soft text-accent'">
                <component :is="icons[feature.icon]" class="size-4" aria-hidden="true" />
              </span>
              {{ feature.text }}
            </li>
          </ul>
          <a
            v-magnetic="0.15"
            :href="plan.ctaUrl"
            target="_blank"
            rel="noopener"
            class="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full text-[15px] font-medium"
            :class="plan.featured ? 'bg-white text-navy-900' : 'bg-accent text-accent-ink'"
          >
            Pilih {{ plan.name }}
            <ArrowUpRight class="size-4" aria-hidden="true" />
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
