<script setup lang="ts">
import { useDark, useMounted, useToggle, useWindowScroll, useWindowSize } from '@vueuse/core'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-vue-next'
import { motion, AnimatePresence } from 'motion-v'
import { site } from '~/data/site'
import { pricing } from '~/data/pricing'

const links = [
  { label: 'Fitur', href: '#fitur' },
  { label: 'Widget', href: '#widget' },
  { label: 'Keunggulan', href: '#keunggulan' },
  ...(pricing.length ? [{ label: 'Harga', href: '#harga' }] : []),
  { label: 'FAQ', href: '#faq' }
]

// Pill hover yang berpindah halus antar tautan navigasi (layout animation Motion).
const hoveredLink = ref<string | null>(null)

const isDark = useDark({ valueDark: 'dark', valueLight: 'light' })
const toggleDark = useToggle(isDark)
const mounted = useMounted()
// Ikon tema baru mengikuti preferensi setelah mount agar hasil SSR dan hidrasi sama.
const showSunIcon = computed(() => mounted.value && isDark.value)

const menuOpen = ref(false)
const { y } = useWindowScroll()
const { height: viewportHeight } = useWindowSize()

// Di atas hero navy, header transparan dengan teks putih.
const overHero = computed(() => !mounted.value || y.value < viewportHeight.value - 80)

// Sembunyikan saat menggulir ke bawah, tampilkan lagi saat menggulir ke atas.
const hidden = ref(false)
watch(y, (current, previous) => {
  if (menuOpen.value) return
  hidden.value = current > 240 && current > previous
})

const progress = computed(() => {
  if (!mounted.value) return 0
  const max = document.documentElement.scrollHeight - viewportHeight.value
  return max > 0 ? Math.min(1, y.value / max) : 0
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
    :class="[
      hidden ? '-translate-y-full' : 'translate-y-0',
      overHero && !menuOpen
        ? 'border-b border-white/10 bg-transparent text-white'
        : 'border-b border-line bg-paper/85 text-ink backdrop-blur-md'
    ]"
  >
    <div class="container-ap flex h-[72px] items-center justify-between">
      <a href="#top" class="flex items-center gap-2.5 text-[1.15rem] font-medium tracking-tight">
        <span class="grid size-8 place-items-center rounded-lg text-sm transition-colors" :class="overHero && !menuOpen ? 'bg-white/10' : 'bg-navy text-white'">A</span>
        Apeiron
      </a>

      <nav class="hidden items-center gap-1 text-sm md:flex" aria-label="Utama" @pointerleave="hoveredLink = null">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="relative rounded-full px-4 py-2 transition-opacity"
          :class="hoveredLink === link.href ? 'opacity-100' : 'opacity-75'"
          @pointerenter="hoveredLink = link.href"
        >
          <motion.span
            v-if="hoveredLink === link.href"
            layout-id="nav-hover-pill"
            class="absolute inset-0 rounded-full"
            :class="overHero && !menuOpen ? 'bg-white/10' : 'bg-soft'"
            :transition="{ type: 'spring', stiffness: 500, damping: 40 }"
          />
          <span class="relative">{{ link.label }}</span>
        </a>
      </nav>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="grid size-10 place-items-center rounded-full opacity-80 transition hover:opacity-100"
          :aria-label="showSunIcon ? 'Gunakan tema terang' : 'Gunakan tema gelap'"
          @click="toggleDark()"
        >
          <Sun v-if="showSunIcon" class="size-[18px]" aria-hidden="true" />
          <Moon v-else class="size-[18px]" aria-hidden="true" />
        </button>

        <a
          v-magnetic="0.25"
          :href="site.portalUrl"
          target="_blank"
          rel="noopener"
          class="hidden h-10 items-center gap-1.5 rounded-full px-5 text-sm font-medium transition-colors md:inline-flex"
          :class="overHero ? 'bg-white text-navy-900' : 'bg-accent text-accent-ink'"
        >
          Dapatkan lisensi
          <ArrowUpRight class="size-4" aria-hidden="true" />
        </a>

        <button
          type="button"
          class="grid size-10 place-items-center rounded-full md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Tutup menu' : 'Buka menu'"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" class="size-5" aria-hidden="true" />
          <Menu v-else class="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div class="absolute inset-x-0 bottom-0 h-px origin-left bg-sand" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />

    <AnimatePresence>
      <motion.nav
        v-if="menuOpen"
        id="mobile-menu"
        aria-label="Menu seluler"
        :initial="{ height: 0, opacity: 0 }"
        :animate="{ height: 'auto', opacity: 1 }"
        :exit="{ height: 0, opacity: 0 }"
        :transition="{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }"
        class="overflow-hidden border-t border-line bg-paper md:hidden"
      >
        <div class="container-ap flex flex-col gap-1 py-4">
          <motion.a
            v-for="(link, index) in links"
            :key="link.href"
            :href="link.href"
            :initial="{ opacity: 0, x: -12 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ delay: 0.05 * index + 0.1, duration: 0.3 }"
            class="rounded-xl px-3 py-3 text-lg text-ink hover:bg-soft"
            @click="menuOpen = false"
          >
            {{ link.label }}
          </motion.a>
          <a
            :href="site.portalUrl"
            target="_blank"
            rel="noopener"
            class="mt-3 inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-accent text-sm font-medium text-accent-ink"
          >
            Dapatkan lisensi
            <ArrowUpRight class="size-4" aria-hidden="true" />
          </a>
        </div>
      </motion.nav>
    </AnimatePresence>
  </header>
</template>
