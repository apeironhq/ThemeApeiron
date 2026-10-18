<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { Gift, Heart, Music, Users } from 'lucide-vue-next'
import { gsap } from 'gsap'
import sealSvg from '~/assets/svg/seal-medallion.svg?raw'
import tagSvg from '~/assets/svg/guest-tag.svg?raw'
import { sample } from '~/data/site'
import { nextOccurrence } from '~/composables/useGsap'

// Ornamen Cover Classic memakai warna brand (#083C57) seperti di tema ApeironKit.
const sealVars = {
  '--seal-color-light': '#145c82',
  '--seal-color': '#083c57',
  '--seal-color-dark': '#03202f',
  '--seal-ring-light': '#0f4d6e',
  '--seal-ring': '#062f46',
  '--seal-ring-dark': '#021a27'
}

const chips = [
  { icon: Users, text: 'RSVP masuk', value: '+12', cls: 'ap-chip--a' },
  { icon: Music, text: 'Musik diputar', value: '', cls: 'ap-chip--b' },
  { icon: Gift, text: 'Hadiah dipilih', value: '', cls: 'ap-chip--c' },
  { icon: Heart, text: '248 ucapan', value: '', cls: 'ap-chip--d' }
]

const root = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const now = useNow({ interval: 1000 })
const target = nextOccurrence(sample.eventDate)
const countdown = computed(() => {
  const diff = Math.max(0, target - now.value.getTime())
  return [
    { label: 'Hari', value: Math.floor(diff / 864e5) },
    { label: 'Jam', value: Math.floor((diff / 36e5) % 24) },
    { label: 'Menit', value: Math.floor((diff / 6e4) % 60) },
    { label: 'Detik', value: Math.floor((diff / 1e3) % 60) }
  ]
})
const pad = (n: number) => String(n).padStart(2, '0')

let ctx: gsap.Context | undefined
let openTl: gsap.core.Timeline | undefined
let swing: gsap.core.Tween | undefined

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ctx = gsap.context(() => {
    const insideItems = '[data-gate-item]'
    gsap.set(insideItems, { autoAlpha: 0, y: 14 })
    gsap.set('[data-gate-names]', { autoAlpha: 0, scale: 0.9 })

    // Label tamu berayun pelan seperti tergantung.
    if (!reduceMotion) {
      swing = gsap.to('[data-gate-tag]', {
        rotation: 4,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.6
      })
    }

    openTl = gsap
      .timeline({ paused: true, defaults: { ease: 'power3.inOut' } })
      .to('[data-chip]', { autoAlpha: 0, scale: 0.9, duration: 0.35, stagger: 0.04 }, 0)
      .to('[data-gate-seal]', { scale: 0.9, duration: 0.18, ease: 'power2.out' }, 0)
      .to('[data-gate-seal]', { y: 420, rotation: 18, duration: 0.9, ease: 'power2.in' })
      .to('[data-gate-tag]', { y: 420, rotation: -10, duration: 0.9, ease: 'power2.in' }, '<0.03')
      .to('[data-gate-seal], [data-gate-tag]', { autoAlpha: 0, duration: 0.25 }, '-=0.3')
      .to('[data-gate-door="l"]', { xPercent: -101, duration: 1.4 }, '-=0.45')
      .to('[data-gate-door="r"]', { xPercent: 101, duration: 1.4 }, '<')
      .to('[data-gate-names]', { autoAlpha: 1, scale: 1, duration: 1, ease: 'expo.out' }, '-=0.9')
      .to(insideItems, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.6, ease: 'power2.out' }, '-=0.8')

    if (reduceMotion) openTl.timeScale(4)

    openTl.eventCallback('onReverseComplete', () => {
      swing?.play()
    })
  }, root.value!)
})

onBeforeUnmount(() => ctx?.revert())

function open() {
  if (!openTl) return
  swing?.pause()
  // Selector dibatasi ke komponen ini (bukan seluruh halaman).
  const tag = root.value?.querySelector('[data-gate-tag]')
  if (tag) gsap.set(tag, { rotation: 0 })
  isOpen.value = true
  openTl.timeScale(1).play()
}

function close() {
  if (!openTl) return
  isOpen.value = false
  openTl.timeScale(1.6).reverse()
}

defineExpose({ isOpen })
</script>

<template>
  <div ref="root" class="ap-gate-wrap" data-tilt-target>
    <div class="ap-gate" data-gate>
      <div class="ap-gate__inside" :aria-hidden="!isOpen">
        <p class="ap-gate__kicker" data-gate-item>The Wedding of</p>
        <p class="ap-gate__names" data-gate-names>{{ sample.couple }}</p>
        <p class="ap-gate__date" data-gate-item>{{ sample.dateLabel }}</p>
        <ClientOnly>
          <div class="ap-countdown">
            <div v-for="unit in countdown" :key="unit.label" data-gate-item>
              <strong>{{ pad(unit.value) }}</strong>
              <span>{{ unit.label }}</span>
            </div>
          </div>
        </ClientOnly>
        <button class="ap-gate__close" type="button" data-gate-item :tabindex="isOpen ? 0 : -1" @click="close">
          Tutup sampul
        </button>
      </div>

      <div class="ap-gate__door ap-gate__door--l" data-gate-door="l">
        <div class="ap-gate__face">
          <span class="ap-gate__ribbon" />
          <span class="ap-gate__shine" data-glare />
        </div>
      </div>
      <div class="ap-gate__door ap-gate__door--r" data-gate-door="r">
        <div class="ap-gate__face">
          <span class="ap-gate__ribbon" />
          <span class="ap-gate__shine" data-glare />
        </div>
      </div>

      <button
        class="ap-gate__seal"
        type="button"
        data-gate-seal
        aria-label="Buka undangan contoh"
        :tabindex="isOpen ? -1 : 0"
        @click="open"
      >
        <span class="ap-gate__seal-pulse" aria-hidden="true" />
        <span class="ap-gate__seal-svg" :style="sealVars" v-html="sealSvg" />
        <span class="ap-gate__seal-initials">{{ sample.initials }}</span>
        <span class="ap-gate__seal-cta">Buka Undangan</span>
      </button>

      <div class="ap-gate__tag" data-gate-tag>
        <div class="ap-gate__tag-card">
          <span class="ap-gate__tag-svg" v-html="tagSvg" />
          <span class="ap-gate__tag-text">
            <b>Kepada Yth.</b>
            <small>{{ sample.guest }}</small>
          </span>
        </div>
      </div>
    </div>

    <div v-for="chip in chips" :key="chip.text" class="ap-chip" :class="chip.cls" data-chip aria-hidden="true">
      <component :is="chip.icon" />
      {{ chip.text }}
      <b v-if="chip.value">{{ chip.value }}</b>
    </div>
  </div>
</template>
