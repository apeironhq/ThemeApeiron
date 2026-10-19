<script setup lang="ts">
/**
 * Panggung pratinjau: bingkai HP berisi demo widget.
 * Saat langkah "cara pakai" berganti, bagian yang dibahas disorot, bagian lain diredupkan,
 * dan sebuah titik sentuh bergerak ke sana lalu "mengetuk" (gelombang riak).
 * Animasi di dalamnya dijeda saat panggung keluar dari layar (hemat baterai).
 */
import { loadDocsGsap, prefersReducedMotion } from '~/composables/useDocsGsap'

const props = defineProps<{ slug: string; s: Record<string, any>; focus?: string | null; caption?: string; step?: number; total?: number }>()

const screen = ref<HTMLElement | null>(null)
const root = ref<HTMLElement | null>(null)
const tap = ref<HTMLElement | null>(null)
const paused = ref(true)
// Pratinjau dengan loop JS (requestAnimationFrame) ikut berhenti saat panggung tidak terlihat.
provide('dxPaused', paused)
let io: IntersectionObserver | null = null
let mo: MutationObserver | null = null
let placed = false

function targetsFor(f: string | null | undefined) {
  const el = screen.value
  if (!el) return { parts: [] as HTMLElement[], hits: [] as HTMLElement[] }
  const parts = Array.from(el.querySelectorAll<HTMLElement>('[data-f]'))
  const hits = f && f !== 'frame' ? parts.filter((p) => p.dataset.f!.split(' ').includes(f)) : []
  return { parts, hits }
}

// Posisi tengah elemen dalam koordinat layar HP (bingkai bisa diskalakan di layar sempit).
function centerOf(target: HTMLElement | null) {
  const el = screen.value!
  const s = el.getBoundingClientRect()
  const k = s.width / el.offsetWidth || 1
  if (!target) return { x: el.offsetWidth / 2, y: el.offsetHeight * 0.62 }
  const r = target.getBoundingClientRect()
  return { x: (r.left + r.width / 2 - s.left) / k, y: (r.top + Math.min(r.height / 2, 60) - s.top) / k }
}

async function applyFocus(animate: boolean) {
  const el = screen.value
  if (!el) return
  const { parts, hits } = targetsFor(props.focus)
  // Induk dari bagian yang disorot tidak ikut diredupkan (is-fp).
  parts.forEach((p) => {
    p.classList.toggle('is-f', hits.includes(p))
    p.classList.toggle('is-fp', !hits.includes(p) && hits.some((h) => p.contains(h)))
  })
  el.classList.toggle('has-focus', hits.length > 0)

  if (!tap.value || props.focus === undefined) return
  const { gsap } = await loadDocsGsap()
  const pos = centerOf(hits[0] ?? null)
  const reduce = prefersReducedMotion()

  if (!animate || !placed || reduce) {
    gsap.set(tap.value, { x: pos.x, y: pos.y, opacity: 1 })
    placed = true
    if (!animate || reduce) return
  }

  const ring = tap.value.querySelector('.dx-tap__ring')
  gsap.timeline({ defaults: { overwrite: 'auto' } })
    .to(tap.value, { x: pos.x, y: pos.y, duration: 0.75, ease: 'power3.inOut' })
    .to(tap.value, { scale: 0.78, duration: 0.12, ease: 'power2.in' })
    .fromTo(ring, { scale: 0.5, opacity: 0.7 }, { scale: 2.6, opacity: 0, duration: 0.65, ease: 'power2.out' }, '<0.05')
    .to(tap.value, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, '<')
  if (hits.length) gsap.fromTo(hits, { scale: 0.96 }, { scale: 1, duration: 0.6, ease: 'back.out(2.2)', stagger: 0.05, delay: 0.8, clearProps: 'scale' })
  else gsap.fromTo(el, { scale: 0.97 }, { scale: 1, duration: 0.7, ease: 'back.out(2)', clearProps: 'scale' })
}

watch(() => props.focus, () => applyFocus(true))

onMounted(() => {
  // Pratinjau dimuat async; sorot ulang begitu isinya muncul.
  if (screen.value) {
    mo = new MutationObserver(() => applyFocus(false))
    mo.observe(screen.value, { childList: true })
    screen.value.querySelectorAll('.pv').length && applyFocus(false)
  }
  io = new IntersectionObserver(([e]) => (paused.value = !e!.isIntersecting), { rootMargin: '80px' })
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => { io?.disconnect(); mo?.disconnect() })
</script>

<template>
  <div ref="root" class="dx-stage" :class="{ 'is-paused': paused }">
    <div v-if="caption" class="dx-stage__chip">
      <span v-if="total" class="dx-stage__count">{{ (step ?? 0) + 1 }}/{{ total }}</span>
      <Transition name="dx-swap" mode="out-in"><span :key="caption" class="dx-stage__cap">{{ caption }}</span></Transition>
    </div>
    <div class="dx-phone">
      <span class="dx-phone__notch" aria-hidden="true"></span>
      <div ref="screen" class="dx-phone__screen">
        <DocsPreview :slug="slug" :s="s" :focus="focus" />
        <span v-if="focus !== undefined" ref="tap" class="dx-tap" aria-hidden="true"><i class="dx-tap__ring"></i><i class="dx-tap__dot"></i></span>
      </div>
    </div>
  </div>
</template>
