<script setup lang="ts">
/**
 * Panggung pratinjau: bingkai HP berisi demo widget.
 * Saat langkah "cara pakai" berganti, bagian yang dibahas diberi bingkai tipis yang
 * berjarak (tidak menempel ke elemen maupun ke tepi layar HP), bagian lain diredupkan,
 * dan titik sentuh bergerak ke sana lalu "mengetuk". Animasi dijeda saat keluar layar.
 */
import { loadDocsGsap, prefersReducedMotion } from '~/composables/useDocsGsap'

const props = defineProps<{ slug: string; s: Record<string, any>; focus?: string | null; caption?: string; step?: number; total?: number }>()

const screen = ref<HTMLElement | null>(null)
const root = ref<HTMLElement | null>(null)
const tap = ref<HTMLElement | null>(null)
const hl = ref<HTMLElement | null>(null)
const paused = ref(true)
// Pratinjau dengan loop JS (requestAnimationFrame) ikut berhenti saat panggung tidak terlihat.
provide('dxPaused', paused)
let io: IntersectionObserver | null = null
let mo: MutationObserver | null = null
let placed = false
let remeasure: ReturnType<typeof setTimeout> | undefined
let moRaf = 0
function onSettle(e: Event) {
  if ((e.target as HTMLElement)?.closest?.('.dx-hl, .dx-tap')) return
  cancelAnimationFrame(moRaf)
  moRaf = requestAnimationFrame(() => applyFocus(false))
}

const PAD = 7    // jarak bingkai ke elemen yang disorot
const EDGE = 10  // jarak minimum bingkai ke tepi layar HP

function targetsFor(f: string | null | undefined) {
  const el = screen.value
  if (!el || !f) return { parts: [] as HTMLElement[], hits: [] as HTMLElement[] }
  const parts = Array.from(el.querySelectorAll<HTMLElement>('[data-f]'))
  const hits = parts.filter((p) => p.dataset.f!.split(' ').includes(f) && p.offsetParent !== null)
  return { parts, hits }
}

// Koordinat dalam layar HP (bingkai bisa diskalakan di layar sempit).
function frameOf(hits: HTMLElement[]) {
  const el = screen.value!
  const s = el.getBoundingClientRect()
  const k = s.width / el.offsetWidth || 1
  const W = el.offsetWidth, H = el.offsetHeight
  if (!hits.length) return null
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  hits.forEach((h) => {
    const r = h.getBoundingClientRect()
    x0 = Math.min(x0, (r.left - s.left) / k); y0 = Math.min(y0, (r.top - s.top) / k)
    x1 = Math.max(x1, (r.right - s.left) / k); y1 = Math.max(y1, (r.bottom - s.top) / k)
  })
  x0 = Math.max(EDGE, x0 - PAD); y0 = Math.max(EDGE, y0 - PAD)
  x1 = Math.min(W - EDGE, x1 + PAD); y1 = Math.min(H - EDGE, y1 + PAD)
  return { x: x0, y: y0, width: Math.max(0, x1 - x0), height: Math.max(0, y1 - y0) }
}

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
  const f = props.focus
  const { parts, hits } = targetsFor(f)
  const dim = f !== 'frame' && hits.length > 0
  // Induk dari bagian yang disorot tidak ikut diredupkan (is-fp).
  parts.forEach((p) => {
    p.classList.toggle('is-f', dim && hits.includes(p))
    p.classList.toggle('is-fp', dim && !hits.includes(p) && hits.some((h) => p.contains(h)))
  })
  el.classList.toggle('has-focus', dim)

  if (!tap.value || !hl.value || f === undefined) return
  const { gsap } = await loadDocsGsap()
  const reduce = prefersReducedMotion()
  const box = frameOf(hits)
  if (box) gsap.to(hl.value, { ...box, opacity: 1, duration: animate && !reduce ? 0.5 : 0.25, ease: 'power3.out', overwrite: 'auto', autoRound: false })
  else gsap.to(hl.value, { opacity: 0, duration: 0.25, overwrite: 'auto' })

  const pos = centerOf(hits.find((h) => !h.dataset.f!.includes('frame')) ?? (f === 'frame' ? null : hits[0] ?? null))
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
}

watch(() => props.focus, () => {
  applyFocus(true)
  // Bagian yang baru muncul (popup, pintu terbuka) selesai bergerak sekitar 0,5–1 dtk; ukur ulang.
  clearTimeout(remeasure)
  remeasure = setTimeout(() => applyFocus(false), 650)
  setTimeout(() => applyFocus(false), 1300)
})

onMounted(() => {
  // Pratinjau dimuat async dan isinya bisa berubah (popup, daftar); sorot ulang bila berubah.
  if (screen.value) {
    mo = new MutationObserver(() => {
      cancelAnimationFrame(moRaf)
      moRaf = requestAnimationFrame(() => applyFocus(false))
    })
    mo.observe(screen.value, { childList: true, subtree: true })
    // Ukur ulang setelah transisi di dalam pratinjau selesai (popup meluncur, pintu terbuka).
    screen.value.addEventListener('transitionend', onSettle)
    screen.value.querySelectorAll('.pv').length && applyFocus(false)
  }
  io = new IntersectionObserver(([e]) => (paused.value = !e!.isIntersecting), { rootMargin: '80px' })
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => { screen.value?.removeEventListener('transitionend', onSettle); io?.disconnect(); mo?.disconnect(); clearTimeout(remeasure); cancelAnimationFrame(moRaf) })
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
        <span v-if="focus !== undefined" ref="hl" class="dx-hl" aria-hidden="true"></span>
        <span v-if="focus !== undefined" ref="tap" class="dx-tap" aria-hidden="true"><i class="dx-tap__ring"></i><i class="dx-tap__dot"></i></span>
      </div>
    </div>
  </div>
</template>
