<script setup lang="ts">
/**
 * "Mulai cepat": langkah-langkah dihubungkan jalur putus-putus, lalu pesawat kertas
 * terbang dari langkah ke langkah dengan lintasan melengkung. Jejak navy tergambar di
 * belakangnya dan setiap langkah menyala saat pesawat tiba. Berulang selama terlihat.
 *
 * Posisi dihitung dari titik tengah lingkaran langkah, jadi jalur otomatis horizontal
 * di desktop dan vertikal di HP.
 */
import { loadDocsGsap, prefersReducedMotion } from '~/composables/useDocsGsap'

defineProps<{ steps: { icon: string; title: string; text: string }[] }>()

const box = ref<HTMLElement | null>(null)
const svg = ref<SVGSVGElement | null>(null)
const base = ref<SVGPathElement | null>(null)
const trail = ref<SVGPathElement | null>(null)
const plane = ref<HTMLElement | null>(null)
const lit = ref<number[]>([])

let tl: ReturnType<Awaited<ReturnType<typeof loadDocsGsap>>['gsap']['timeline']> | null = null
let st: { kill: () => void; isActive: boolean } | null = null
let resizeTimer: ReturnType<typeof setTimeout> | undefined

async function build() {
  const el = box.value
  if (!el || !svg.value || !base.value || !trail.value || !plane.value) return
  const { gsap, ScrollTrigger } = await loadDocsGsap()
  tl?.kill()

  const b = el.getBoundingClientRect()
  const dots = Array.from(el.querySelectorAll<HTMLElement>('.dx-flight__dot'))
  const pts = dots.map((d) => {
    const r = d.getBoundingClientRect()
    return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 }
  })
  svg.value.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`)
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  base.value.setAttribute('d', d)
  trail.value.setAttribute('d', d)
  const total = trail.value.getTotalLength()

  if (prefersReducedMotion()) {
    lit.value = dots.map((_, i) => i)
    gsap.set(trail.value, { strokeDasharray: total, strokeDashoffset: 0 })
    return
  }

  const p0 = pts[0]!
  const reset = () => {
    lit.value = []
    gsap.set(trail.value, { strokeDasharray: total, strokeDashoffset: total, opacity: 1 })
  }
  const pop = (i: number) => {
    lit.value = [...lit.value, i]
    gsap.fromTo(dots[i]!, { scale: 1 }, { keyframes: [{ scale: 1.16, duration: 0.16, ease: 'power2.out' }, { scale: 1, duration: 0.45, ease: 'back.out(3)' }] })
  }

  tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, paused: true, onRepeat: reset })
  reset()
  // Masuk dari kiri ke langkah pertama.
  tl.fromTo(plane.value, { x: p0.x - 34, y: p0.y + 10, rotation: -18, opacity: 0, scale: 0.6 }, { x: p0.x, y: p0.y, rotation: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
    .call(() => pop(0))

  let done = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!, z = pts[i + 1]!
    const dx = z.x - a.x, dy = z.y - a.y
    const len = Math.hypot(dx, dy)
    // Normal tegak lurus arah terbang; lengkungan selalu ke "atas" (atau ke kanan saat vertikal).
    const nx = dy / len, ny = -dx / len
    const amp = Math.min(22, len * 0.12)
    const start = done
    const proxy = { t: 0 }
    tl.to(proxy, {
      t: 1, duration: 1.25, ease: 'sine.inOut',
      onUpdate: () => {
        const t = proxy.t
        const off = amp * Math.sin(Math.PI * t)
        const x = a.x + dx * t + nx * off
        const y = a.y + dy * t + ny * off
        const dOff = amp * Math.PI * Math.cos(Math.PI * t)
        const angle = Math.atan2(dy + ny * dOff, dx + nx * dOff) * 180 / Math.PI
        gsap.set(plane.value, { x, y, rotation: angle })
        gsap.set(trail.value, { strokeDashoffset: total - (start + len * t) })
      },
    }, '+=0.35')
      .call(() => pop(i + 1))
    done += len
  }

  // Lepas landas dan menghilang, lalu jejak memudar sebelum mengulang.
  const last = pts[pts.length - 1]!
  tl.to(plane.value, { x: last.x + 46, y: last.y - 30, rotation: -32, opacity: 0, scale: 0.7, duration: 0.7, ease: 'power2.in' }, '+=0.5')
    .to(trail.value, { opacity: 0.25, duration: 0.6 }, '+=0.3')

  st?.kill()
  st = ScrollTrigger.create({ trigger: el, start: 'top 90%', end: 'bottom top', onToggle: (s) => (s.isActive ? tl?.play() : tl?.pause()) })
  if (st.isActive) tl.play()
}

function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(build, 200)
}

onMounted(() => {
  build()
  document.fonts?.ready.then(build)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  tl?.kill()
  st?.kill()
  clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div ref="box" class="dx-flight">
    <svg ref="svg" class="dx-flight__svg" aria-hidden="true">
      <path ref="base" class="dx-flight__base" />
      <path ref="trail" class="dx-flight__trail" />
    </svg>

    <div v-for="(s, i) in steps" :key="s.title" class="dx-flight__item">
      <span class="dx-flight__dot" :class="{ 'is-on': lit.includes(i) }"><ApIcon :name="s.icon" /></span>
      <div class="dx-flight__txt">
        <small>Langkah {{ i + 1 }}</small>
        <b>{{ s.title }}</b>
        <p class="dx-caption">{{ s.text }}</p>
      </div>
    </div>

    <span ref="plane" class="dx-flight__plane" aria-hidden="true">
      <svg viewBox="0 0 28 28"><path class="is-wing" d="M3 5 26 14 3 23 8.5 14z" /><path class="is-under" d="M8.5 14 3 23 13.5 16.2z" /><path class="is-fold" d="M8.5 14H26" /></svg>
    </span>
  </div>
</template>
