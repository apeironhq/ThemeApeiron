<script setup lang="ts">
/**
 * Panggung pratinjau: bingkai HP berisi demo widget.
 * Pada mode "cara pakai", bagian yang sedang dibahas disorot dan bagian lain diredupkan.
 * Animasi di dalamnya dijeda saat panggung keluar dari layar (hemat baterai).
 */
import { loadDocsGsap, prefersReducedMotion } from '~/composables/useDocsGsap'

const props = defineProps<{ slug: string; s: Record<string, any>; focus?: string | null; live?: boolean; caption?: string; step?: number; total?: number }>()

const screen = ref<HTMLElement | null>(null)
const root = ref<HTMLElement | null>(null)
const paused = ref(true)
// Pratinjau dengan loop JS (requestAnimationFrame) ikut berhenti saat panggung tidak terlihat.
provide('dxPaused', paused)
let io: IntersectionObserver | null = null
let mo: MutationObserver | null = null

async function applyFocus(animate: boolean) {
  const el = screen.value
  if (!el) return
  const f = props.focus
  const parts = Array.from(el.querySelectorAll<HTMLElement>('[data-f]'))
  const hits = f && f !== 'frame' ? parts.filter((p) => p.dataset.f!.split(' ').includes(f)) : []
  // Induk dari bagian yang disorot tidak ikut diredupkan (is-fp).
  parts.forEach((p) => {
    p.classList.toggle('is-f', hits.includes(p))
    p.classList.toggle('is-fp', !hits.includes(p) && hits.some((h) => p.contains(h)))
  })
  el.classList.toggle('has-focus', hits.length > 0)
  if (!animate || prefersReducedMotion()) return
  const { gsap } = await loadDocsGsap()
  if (hits.length) gsap.fromTo(hits, { scale: 0.96 }, { scale: 1, duration: 0.6, ease: 'back.out(2.2)', stagger: 0.05, clearProps: 'scale' })
  else if (f === 'frame') gsap.fromTo(el, { scale: 0.97 }, { scale: 1, duration: 0.7, ease: 'back.out(2)', clearProps: 'scale' })
}

watch(() => props.focus, () => applyFocus(true))

onMounted(() => {
  // Pratinjau dimuat async; sorot ulang begitu isinya muncul atau berubah.
  if (screen.value && !props.live) {
    mo = new MutationObserver(() => applyFocus(false))
    mo.observe(screen.value, { childList: true, subtree: true })
  }
  io = new IntersectionObserver(([e]) => (paused.value = !e!.isIntersecting), { rootMargin: '80px' })
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => { io?.disconnect(); mo?.disconnect() })
</script>

<template>
  <div ref="root" class="dx-stage" :class="{ 'is-live': live, 'is-paused': paused }">
    <div v-if="caption" class="dx-stage__chip">
      <span v-if="total" class="dx-stage__count">{{ (step ?? 0) + 1 }}/{{ total }}</span>
      <Transition name="dx-swap" mode="out-in"><span :key="caption" class="dx-stage__cap">{{ caption }}</span></Transition>
    </div>
    <div class="dx-phone">
      <span class="dx-phone__notch" aria-hidden="true"></span>
      <div ref="screen" class="dx-phone__screen">
        <DocsPreview :slug="slug" :s="s" :focus="focus" :live="live" />
      </div>
    </div>
  </div>
</template>
