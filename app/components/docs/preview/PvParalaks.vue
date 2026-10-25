<script setup lang="ts">
/**
 * Pratinjau Paralaks 2.5D: bingkai berisi layer latar (Z −800), tengah (Z −300), subjek (Z 0),
 * dan depan (Z 200). Kamera berpindah tiga adegan berulang seperti saat tamu menggulir, jadi tiap
 * layer bergeser dengan kecepatan berbeda sesuai kedalamannya. Ukuran layer dikompensasi
 * (seperti "Jaga Ukuran Asli Layer") sehingga di adegan awal semuanya tampil seukuran aslinya.
 */
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const P = computed(() => Math.max(600, Number(props.s.persp) || 1000))
const depths = { far: -800, mid: -300, near: 200 }
const keep = (z: number) => `translateZ(${z}px) scale(${(P.value - z) / P.value})`

// Posisi kamera di akhir tiap adegan (zoom dalam satuan perspektif agar aman di semua nilai).
const scenes = [
  { z: 0, x: 0, y: 0, rx: 0, ry: 0 },
  { z: 0.32, x: 4, y: -4, rx: 0, ry: -7 },
  { z: 0.55, x: -3, y: 6, rx: 5, ry: 4 },
]
// Urutan: diam, bergerak, diam, bergerak, diam, kembali ke awal.
const plan = [
  { from: 0, to: 0, d: 900 }, { from: 0, to: 1, d: 1700 }, { from: 1, to: 1, d: 1500 },
  { from: 1, to: 2, d: 1700 }, { from: 2, to: 2, d: 1700 }, { from: 2, to: 0, d: 1100 },
]
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const cam = ref({ ...scenes[0]! })
const scene = ref(0)
let raf = 0
let start = 0
const total = plan.reduce((n, p) => n + p.d, 0)

function frame(now: number) {
  if (!start) start = now
  let t = (now - start) % total
  for (const p of plan) {
    if (t > p.d) { t -= p.d; continue }
    const k = ease(t / p.d)
    const a = scenes[p.from]!, b = scenes[p.to]!
    cam.value = { z: lerp(a.z, b.z, k), x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), rx: lerp(a.rx, b.rx, k), ry: lerp(a.ry, b.ry, k) }
    scene.value = p.from === p.to ? p.from : k > 0.5 ? p.to : p.from
    break
  }
  raf = requestAnimationFrame(frame)
}
const world = computed(() => {
  const c = cam.value
  return `translateZ(${c.z * P.value}px) translate(${-c.x}%, ${-c.y}%) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`
})

const paused = inject<Ref<boolean>>('dxPaused', ref(false))
function play() { cancelAnimationFrame(raf); start = 0; raf = requestAnimationFrame(frame) }
watch(paused, (p) => (p ? cancelAnimationFrame(raf) : play()))
onMounted(() => { if (!paused.value) play() })
onBeforeUnmount(() => cancelAnimationFrame(raf))

// Judul dipecah sesuai Pembagian Teks dan muncul berurutan mulai adegan 2.
const title = 'Raka & Nadia'
const units = computed(() => {
  const mode = props.s.split
  if (mode === 'Huruf') return title.split('').map((c) => (c === ' ' ? ' ' : c))
  if (mode === 'Baris') return [title]
  return title.split(' ').map((w, i, a) => (i < a.length - 1 ? `${w} ` : w))
})
const revealed = computed(() => scene.value >= 1)

// Partikel di berbagai kedalaman; posisi tetap (bukan acak) agar render server dan browser sama.
const particles = computed(() => Array.from({ length: Number(props.s.particles) || 0 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
  return { left: `${r(1) * 100}%`, top: `${r(2) * 100}%`, z: Math.round(-600 + r(3) * 700), delay: `${-r(4) * 6}s`, size: 3 + Math.round(r(5) * 4) }
}))
</script>

<template>
  <div class="pv pv-px" :class="{ 'is-idle': s.idle }" :style="{ perspective: `${P}px` }">
    <div class="pv-px__world" :style="{ transform: world }" data-f="depth camera">
      <span class="pv-px__layer is-far" :style="{ transform: keep(depths.far) }"><i class="pv-px__sun"></i><i class="pv-px__arch"></i></span>
      <span class="pv-px__layer is-mid" :style="{ transform: keep(depths.mid) }"><i class="pv-px__hill is-a"></i><i class="pv-px__hill is-b"></i></span>
      <span v-for="(p, i) in particles" :key="i" class="pv-px__pt" :style="{ left: p.left, top: p.top, transform: `translateZ(${p.z}px)` }">
        <i :style="{ width: `${p.size}px`, height: `${p.size}px`, animationDelay: p.delay }"></i>
      </span>
      <span class="pv-px__layer is-near" :style="{ transform: keep(depths.near) }"><i class="pv-px__leaf is-l"></i><i class="pv-px__leaf is-r"></i></span>
    </div>

    <div class="pv-px__text" data-f="text">
      <small>The Wedding of</small>
      <b :class="{ 'is-in': revealed }"><span v-for="(u, i) in units" :key="`${s.split}-${i}`" :style="{ transitionDelay: revealed ? `${i * (units.length > 6 ? 45 : 110)}ms` : '0ms' }">{{ u }}</span></b>
      <em :class="{ 'is-in': revealed }">Sabtu, 12 Desember 2026</em>
    </div>

    <div class="pv-px__depth" data-f="depth" aria-hidden="true">
      <span><i class="is-far"></i>Latar <b>Z −800</b></span>
      <span><i class="is-mid"></i>Tengah <b>Z −300</b></span>
      <span><i class="is-sub"></i>Subjek <b>Z 0</b></span>
      <span><i class="is-near"></i>Depan <b>Z 200</b></span>
    </div>

    <span class="pv-px__scene" data-f="camera" aria-hidden="true">
      Adegan {{ scene + 1 }}<i v-for="n in 3" :key="n" :class="{ 'is-on': n - 1 <= scene }"></i>
    </span>
    <span class="pv-px__hint" :class="{ 'is-on': scene === 1 }" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6" /></svg>Gulir untuk melanjutkan
    </span>
  </div>
</template>

<style scoped>
.pv-px { position: relative; overflow: hidden; background: linear-gradient(180deg, #f6efe2 0%, #fbf7f0 52%, #eef5f8 100%); }
.pv-px__world { position: absolute; inset: 0; transform-style: preserve-3d; will-change: transform; }
.pv-px__layer { position: absolute; inset: -6%; display: block; transform-style: preserve-3d; }
.pv-px__layer i { position: absolute; display: block; }
.pv-px__sun { left: 50%; top: 14%; width: 120px; height: 120px; margin-left: -60px; border-radius: 50%; background: radial-gradient(circle, #f1d7a4, rgba(241, 215, 164, 0) 70%); }
.pv-px__arch { left: 50%; bottom: 34%; width: 150px; height: 190px; margin-left: -75px; border: 1.5px solid rgba(8, 60, 87, .2); border-bottom: 0; border-radius: 75px 75px 0 0; }
.pv-px__hill { bottom: 0; height: 170px; border-radius: 50% 50% 0 0; }
.pv-px__hill.is-a { left: -25%; width: 95%; background: #dbe9f0; }
.pv-px__hill.is-b { right: -20%; width: 90%; height: 140px; background: #cddfe8; }
.pv-px__leaf { bottom: -6%; width: 150px; height: 200px; background: radial-gradient(ellipse at 50% 100%, #9fbfce 0 44%, transparent 45%), radial-gradient(ellipse at 28% 78%, #c9a46b 0 20%, transparent 21%), radial-gradient(ellipse at 72% 70%, #e9d6b0 0 14%, transparent 15%); transform-origin: 50% 100%; }
.pv-px__leaf.is-l { left: -40px; rotate: 16deg; }
.pv-px__leaf.is-r { right: -40px; rotate: -16deg; scale: -1 1; }
.is-idle .pv-px__leaf.is-l { animation: pv-px-sway 4.2s ease-in-out infinite; }
.is-idle .pv-px__leaf.is-r { animation: pv-px-sway-r 4.8s ease-in-out infinite; }
.is-idle .pv-px__sun { animation: pv-px-breathe 5s ease-in-out infinite; }
@keyframes pv-px-sway { 50% { rotate: 22deg; } }
@keyframes pv-px-sway-r { 50% { rotate: -22deg; } }
@keyframes pv-px-breathe { 50% { scale: 1.12; } }
.pv-px__pt { position: absolute; display: block; }
.pv-px__pt i { display: block; border-radius: 50%; background: radial-gradient(circle, #f6e3bb 40%, rgba(243, 220, 174, 0) 72%); animation: pv-px-float 6s ease-in-out infinite; }
@keyframes pv-px-float { 50% { translate: 6px -14px; opacity: .55; } }

.pv-px__text { position: absolute; left: 22px; right: 22px; top: 30%; display: grid; justify-items: center; gap: 6px; text-align: center; }
.pv-px__text small { font-size: 9.5px; letter-spacing: .28em; text-transform: uppercase; color: var(--dx-muted); }
.pv-px__text b { display: block; font-size: 26px; font-weight: 500; line-height: 1.15; color: var(--dx-navy); }
.pv-px__text b span { display: inline-block; opacity: 0; translate: 0 14px; transition: opacity .5s ease, translate .6s cubic-bezier(.2, .8, .2, 1); }
.pv-px__text b.is-in span { opacity: 1; translate: 0 0; }
.pv-px__text em { font-style: normal; font-size: 11px; color: var(--dx-muted); opacity: 0; transition: opacity .6s ease .4s; }
.pv-px__text em.is-in { opacity: 1; }

.pv-px__depth { position: absolute; left: 22px; bottom: 58px; display: grid; gap: 4px; padding: 8px 10px; border-radius: 10px; background: rgba(255, 255, 255, .9); border: 1px solid var(--dx-line); font-size: 9.5px; color: var(--dx-muted); }
.pv-px__depth span { display: flex; align-items: center; gap: 6px; }
.pv-px__depth b { margin-left: auto; padding-left: 8px; font-weight: 500; color: var(--dx-navy); }
.pv-px__depth i { width: 8px; height: 8px; border-radius: 2px; }
.pv-px__depth .is-far { background: #f1d7a4; }
.pv-px__depth .is-mid { background: #cddfe8; }
.pv-px__depth .is-sub { background: var(--dx-navy); }
.pv-px__depth .is-near { background: #9fbfce; }

.pv-px__scene { position: absolute; top: 22px; right: 22px; display: flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 999px; background: rgba(255, 255, 255, .9); border: 1px solid var(--dx-line); font-size: 10px; font-weight: 500; color: var(--dx-navy); }
.pv-px__scene i { width: 5px; height: 5px; border-radius: 50%; background: var(--dx-line); transition: background .3s; }
.pv-px__scene i:first-of-type { margin-left: 4px; }
.pv-px__scene i.is-on { background: var(--dx-navy); }
.pv-px__hint { position: absolute; left: 50%; bottom: 22px; display: inline-flex; align-items: center; gap: 5px; padding: 6px 11px; border-radius: 999px; background: rgba(255, 255, 255, .92); border: 1px solid var(--dx-line); font-size: 10px; color: var(--dx-navy); white-space: nowrap; translate: -50% 8px; opacity: 0; transition: opacity .4s, translate .4s; }
.pv-px__hint.is-on { opacity: 1; translate: -50% 0; }
.pv-px__hint svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; animation: pv-px-nudge 1.4s ease-in-out infinite; }
@keyframes pv-px-nudge { 50% { translate: 0 3px; } }
</style>
