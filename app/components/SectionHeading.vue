<script setup lang="ts">
import { useGsap } from '~/composables/useGsap'

const props = withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    lead?: string
    align?: 'left' | 'center'
    tone?: 'default' | 'inverse'
  }>(),
  { align: 'left', tone: 'default', lead: '' }
)

const root = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)

// Judul muncul baris demi baris dari balik mask saat masuk viewport.
useGsap(root, ({ gsap, SplitText }) => {
  gsap.from('[data-heading-eyebrow], [data-heading-lead]', {
    autoAlpha: 0,
    y: 16,
    stagger: 0.35,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: root.value, start: 'top 82%', once: true }
  })

  // Baris dipecah ulang saat lebar berubah; animasi dikembalikan dari onSplit sesuai panduan SplitText.
  SplitText.create(heading.value!, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 105,
        duration: 1.1,
        stagger: 0.09,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.value, start: 'top 82%', once: true }
      })
  })
})
</script>

<template>
  <div
    ref="root"
    :class="[props.align === 'center' ? 'mx-auto text-center' : '', 'max-w-[720px]']"
  >
    <p data-heading-eyebrow class="eyebrow" :class="props.tone === 'inverse' ? '!text-sand' : ''">{{ props.eyebrow }}</p>
    <h2 ref="heading" class="section-title mt-5" :class="props.tone === 'inverse' ? 'text-white' : 'text-ink'">
      {{ props.title }}
    </h2>
    <p
      v-if="props.lead"
      data-heading-lead
      class="mt-5 text-base leading-relaxed sm:text-lg"
      :class="[props.tone === 'inverse' ? 'text-white/70' : 'text-muted', props.align === 'center' ? 'mx-auto max-w-[600px]' : 'max-w-[560px]']"
    >
      {{ props.lead }}
    </p>
  </div>
</template>
