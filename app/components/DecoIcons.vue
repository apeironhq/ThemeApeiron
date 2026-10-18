<script setup lang="ts">
/**
 * Ikon widget dekoratif di tepi section: tile putih kecil berisi ikon garis,
 * bergerak pelan (parallax + rotasi) mengikuti gulir. Hanya tampil di layar lebar.
 * Animasinya di assets/js/scrollfx.js.
 */
import { widgets } from '~/data/widgets'

const props = defineProps<{ set: keyof typeof sets }>()

// [kunci ikon, kiri %, atas %, ukuran px, kecepatan parallax, rotasi derajat]
type Item = [string, number, number, number, number, number]
const sets = {
  widgets: [['countdown', 3, 10, 78, 1, 12], ['comment', 93, 16, 66, 1.4, -10], ['registry', 2, 66, 62, 0.8, -8], ['cover', 94, 72, 74, 1.2, 14]],
  features: [['audio', 4, 14, 70, 1.2, -12], ['form', 93, 30, 64, 0.9, 10], ['story', 3, 58, 60, 1.4, 8], ['scroll', 94, 80, 68, 1, -14]],
  dashboard: [['order', 4, 12, 72, 1, 10], ['registry', 93, 22, 66, 1.3, -12], ['activity', 6, 80, 58, 0.9, -8]],
  steps: [['manager', 4, 18, 66, 1.2, -10], ['copy', 93, 58, 60, 1, 12]],
  testimonials: [['comment', 5, 14, 64, 1, 10], ['cover', 92, 20, 70, 1.3, -12]],
  pricing: [['registry', 4, 20, 66, 1.1, -10], ['countdown', 93, 64, 62, 1, 12]],
  faq: [['loader', 4, 22, 62, 1.2, 10], ['comment', 93, 46, 58, 0.9, -10]],
} satisfies Record<string, Item[]>

const icons = Object.fromEntries(widgets.map((w) => [w.key, w.icon]))
const items = computed(() => (sets[props.set] as Item[]).map(([key, left, top, size, speed, rot]) => ({
  key, icon: icons[key] ?? '', speed, rot,
  style: { left: `${left}%`, top: `${top}%`, '--size': `${size}px` },
})))
</script>

<template>
  <div class="ap-deco" aria-hidden="true">
    <span v-for="(it, i) in items" :key="i" class="ap-deco__ico" :style="it.style" data-deco :data-deco-speed="it.speed" :data-deco-rot="it.rot">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" v-html="it.icon" />
    </span>
  </div>
</template>
