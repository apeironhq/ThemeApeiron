<script setup lang="ts">
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-vue-next'
import { motion, AnimatePresence } from 'motion-v'
import { widgetCategories, widgets } from '~/data/widgets'
import { useGsap } from '~/composables/useGsap'
import { horizontalLoop, type HorizontalLoop } from '~/utils/horizontalLoop'

const AUTOPLAY_SECONDS = 4.5

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const progressBar = ref<HTMLElement | null>(null)

const active = ref(0)
const direction = ref(1)
const loopReady = ref(false)
const playing = ref(true)
const activeWidget = computed(() => widgets[active.value]!)

let loop: HorizontalLoop | undefined
let timer: gsap.core.Tween | undefined
let hovered = false
let dragging = false
let inView = false

const pad = (n: number) => String(n).padStart(2, '0')

/** Autoplay hanya berjalan jika section terlihat, tidak di-hover, tidak di-drag, dan tidak dijeda. */
function syncTimer() {
  if (!timer) return
  if (playing.value && inView && !hovered && !dragging) timer.resume()
  else timer.pause()
}

function restartTimer() {
  timer?.restart()
  syncTimer()
}

function go(index: number) {
  if (!loop) {
    direction.value = index > active.value ? 1 : -1
    active.value = (index + widgets.length) % widgets.length
    return
  }
  loop.toIndex(index, { duration: 0.9, ease: 'power3.inOut' })
  restartTimer()
}

function step(delta: 1 | -1) {
  direction.value = delta
  go(active.value + delta)
}

function togglePlay() {
  playing.value = !playing.value
  syncTimer()
}

function onEnter() {
  hovered = true
  syncTimer()
}

function onLeave() {
  hovered = false
  syncTimer()
}

useGsap(root, ({ gsap, ScrollTrigger }) => {
  const cards = gsap.utils.toArray<HTMLElement>('[data-widget-card]')

  loop = horizontalLoop(cards, {
    paused: true,
    center: true,
    draggable: true,
    paddingRight: 16,
    onChange: (_, index) => {
      direction.value = index > active.value || (active.value === widgets.length - 1 && index === 0) ? 1 : -1
      active.value = index
    },
    onDragStart: () => {
      dragging = true
      syncTimer()
    },
    onDragEnd: () => {
      dragging = false
      restartTimer()
    }
  })
  // Mulai dengan kartu pertama tepat di tengah.
  loop.toIndex(0, { duration: 0 })
  active.value = 0
  loopReady.value = true

  timer = gsap.fromTo(
    progressBar.value,
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: AUTOPLAY_SECONDS,
      ease: 'none',
      paused: true,
      onComplete: () => {
        direction.value = 1
        loop?.next({ duration: 0.9, ease: 'power3.inOut' })
        restartTimer()
      }
    }
  )

  ScrollTrigger.create({
    trigger: root.value,
    start: 'top 70%',
    end: 'bottom 30%',
    onToggle: (self) => {
      inView = self.isActive
      syncTimer()
    }
  })

  // Kartu masuk bertahap saat section pertama kali terlihat.
  gsap.from('[data-widget-card] [data-card-inner]', {
    autoAlpha: 0,
    y: 60,
    rotation: 3,
    stagger: { each: 0.06, from: 'center' },
    duration: 1.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: track.value, start: 'top 85%', once: true }
  })

  const onVisibility = () => {
    inView = !document.hidden && inView
    syncTimer()
  }
  document.addEventListener('visibilitychange', onVisibility)

  return () => {
    document.removeEventListener('visibilitychange', onVisibility)
    loop?.destroy()
    loop = undefined
    timer = undefined
  }
})
</script>

<template>
  <section
    id="widget"
    ref="root"
    class="scroll-mt-20 overflow-hidden bg-navy-900 py-[clamp(80px,12vw,140px)] text-white"
  >
    <div class="container-ap">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="13 widget"
          title="Satu plugin, setiap bagian undangan sudah siap."
          lead="Geser, klik, atau biarkan berjalan sendiri. Setiap widget bisa dikombinasikan dan diatur penuh dari Elementor."
          tone="inverse"
        />

        <div class="flex items-center gap-3">
          <p class="mr-2 text-sm tabular-nums text-white/60" aria-live="polite">
            <span class="text-white">{{ pad(active + 1) }}</span> / {{ pad(widgets.length) }}
          </p>
          <motion.button
            type="button"
            class="grid size-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            aria-label="Widget sebelumnya"
            :while-tap="{ scale: 0.9 }"
            @click="step(-1)"
          >
            <ArrowLeft class="size-5" aria-hidden="true" />
          </motion.button>
          <motion.button
            type="button"
            class="grid size-12 place-items-center rounded-full bg-white text-navy-900"
            aria-label="Widget berikutnya"
            :while-tap="{ scale: 0.9 }"
            @click="step(1)"
          >
            <ArrowRight class="size-5" aria-hidden="true" />
          </motion.button>
        </div>
      </div>

      <!-- Spotlight widget aktif -->
      <div class="mt-14 grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div class="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
          <AnimatePresence :initial="false">
            <motion.div
              :key="activeWidget.id"
              class="absolute inset-0"
              :initial="{ opacity: 0, x: direction * 60, scale: 0.98 }"
              :animate="{ opacity: 1, x: 0, scale: 1 }"
              :exit="{ opacity: 0, x: direction * -60, scale: 0.98 }"
              :transition="{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }"
            >
              <WidgetPreview :id="activeWidget.id" size="lg" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div class="relative min-h-[220px]">
          <AnimatePresence mode="wait" :initial="false">
            <motion.div
              :key="activeWidget.id"
              :initial="{ opacity: 0, y: 18 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, y: -12 }"
              :transition="{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }"
            >
              <p class="text-[13px] font-medium uppercase tracking-[0.14em] text-sand">
                {{ widgetCategories[activeWidget.category] }}
              </p>
              <h3 class="mt-4 text-[clamp(30px,3.6vw,46px)] font-light leading-[1.08] tracking-[-0.02em]">
                {{ activeWidget.name }}
              </h3>
              <p class="mt-5 max-w-[420px] text-base leading-relaxed text-white/70 sm:text-lg">
                {{ activeWidget.description }}
              </p>
            </motion.div>
          </AnimatePresence>

          <div class="mt-10 flex items-center gap-4">
            <button
              type="button"
              class="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 text-white/80 hover:text-white"
              :aria-label="playing ? 'Jeda putar otomatis' : 'Putar otomatis'"
              @click="togglePlay"
            >
              <Pause v-if="playing" class="size-4" aria-hidden="true" />
              <Play v-else class="size-4" aria-hidden="true" />
            </button>
            <span class="h-px flex-1 overflow-hidden bg-white/15">
              <span ref="progressBar" class="block h-full origin-left scale-x-0 bg-sand" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel tak berujung: bisa digeser, diklik, dan berjalan otomatis -->
    <div class="mt-14">
      <div
        ref="track"
        class="flex gap-4 px-[clamp(16px,4vw,40px)]"
        :class="loopReady ? 'cursor-grab select-none active:cursor-grabbing' : 'snap-x overflow-x-auto pb-4'"
        role="list"
        aria-label="Daftar widget"
        @pointerenter="onEnter"
        @pointerleave="onLeave"
      >
        <div
          v-for="(widget, index) in widgets"
          :key="widget.id"
          data-widget-card
          role="listitem"
          class="w-[min(72vw,280px)] shrink-0 snap-center"
        >
          <button
            type="button"
            data-card-inner
            class="group block w-full text-left"
            :aria-pressed="index === active"
            :aria-label="`Lihat ${widget.name}`"
            @click="go(index)"
          >
            <span
              class="block overflow-hidden rounded-[20px] border transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:-translate-y-1"
              :class="index === active ? 'border-sand' : 'border-white/10'"
            >
              <span class="block aspect-[4/3]">
                <WidgetPreview :id="widget.id" size="sm" />
              </span>
            </span>
            <span class="mt-4 flex items-baseline justify-between gap-3">
              <span class="text-[15px] font-medium transition-colors" :class="index === active ? 'text-white' : 'text-white/70'">
                {{ widget.name }}
              </span>
              <span class="text-xs tabular-nums text-white/40">{{ pad(index + 1) }}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
