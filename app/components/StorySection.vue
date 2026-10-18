<script setup lang="ts">
import { story } from '~/data/content'
import { useGsap } from '~/composables/useGsap'

const root = ref<HTMLElement | null>(null)
const pin = ref<HTMLElement | null>(null)

// Kalimat dinyalakan kata demi kata mengikuti scroll, dengan section di-pin.
useGsap(root, ({ gsap, SplitText }) => {
  const lines = gsap.utils.toArray<HTMLElement>('[data-story-line]')
  const splits = lines.map((line) => SplitText.create(line, { type: 'words', wordsClass: 'story-word' }))
  const words = splits.flatMap((split) => split.words)

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root.value,
      pin: pin.value,
      start: 'top top',
      end: () => `+=${window.innerHeight * 1.8}`,
      scrub: 1,
      anticipatePin: 1
    }
  })

  tl.to(words, { opacity: 1, stagger: 0.12, ease: 'none', duration: 0.4 }, 0)
    .fromTo('[data-story-progress]', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: tl.duration() }, 0)
    .from('[data-story-answer]', { x: 30, ease: 'power2.out', duration: 0.6 }, '>-0.8')
    // Jeda di akhir: kalimat sudah menyala penuh sebelum pin dilepas.
    .to({}, { duration: 0.8 })

  return () => splits.forEach((split) => split.revert())
})
</script>

<template>
  <!-- z-10 + sudut membulat: section ini meluncur menutupi hero yang di-pin. -->
  <section ref="root" class="relative z-10 -mt-8 overflow-x-clip rounded-t-[32px] bg-paper">
    <div ref="pin" class="relative grid min-h-svh items-center">
      <div class="container-ap">
        <div class="grid max-w-[1100px] gap-[clamp(18px,3vw,30px)]">
          <p
            v-for="(line, index) in story"
            :key="line"
            data-story-line
            :data-story-answer="index === story.length - 1 || undefined"
            class="text-[clamp(32px,5.4vw,76px)] font-light leading-[1.06] tracking-[-0.025em]"
            :class="index === story.length - 1 ? 'italic text-accent' : 'text-ink'"
          >
            {{ line }}
          </p>
        </div>
      </div>

      <div class="absolute inset-x-0 bottom-12">
        <div class="container-ap">
          <div class="h-px bg-line">
            <span data-story-progress class="block h-full origin-left bg-accent" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
