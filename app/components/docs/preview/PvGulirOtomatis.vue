<script setup lang="ts">
// Pratinjau Gulir Otomatis: isi undangan bergulir sendiri; kecepatan bisa diubah lewat panel +/−.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const page = ref<HTMLElement | null>(null)
const view = ref<HTMLElement | null>(null)
const progress = ref(0)
let raf = 0
let y = 0
let last = 0
let hold = 0

function frame(t: number) {
  const dt = Math.min(64, t - (last || t))
  last = t
  const max = Math.max(1, (page.value?.scrollHeight ?? 0) - (view.value?.clientHeight ?? 0))
  if (props.s.run && !document.hidden) {
    const v = Number(props.s.speed || 40) * 0.0016 // px per ms
    if (props.s.mode === 'Scroll per Bagian') {
      // Bergerak per bagian lalu diam sejenak, seperti presentasi.
      if (hold > 0) hold -= dt
      else {
        const prev = Math.floor(y / 150)
        y += v * dt * 2.2
        if (Math.floor(y / 150) !== prev) { y = Math.floor(y / 150) * 150; hold = 900 }
      }
    } else y += v * dt
    if (y >= max) { y = 0; hold = 600 }
  }
  progress.value = y / max
  if (page.value) page.value.style.transform = `translate3d(0, ${-y}px, 0)`
  raf = requestAnimationFrame(frame)
}
const paused = inject<Ref<boolean>>('dxPaused', ref(false))
function play() { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame) }
watch(paused, (p) => (p ? cancelAnimationFrame(raf) : play()))
onMounted(() => { if (!paused.value) play() })
onBeforeUnmount(() => cancelAnimationFrame(raf))

const C = 2 * Math.PI * 17
function bump(d: number) { props.s.speed = Math.min(100, Math.max(5, Number(props.s.speed || 40) + d)) }
</script>

<template>
  <div ref="view" class="pv pv-as">
    <div ref="page" class="pv-as__page" aria-hidden="true">
      <section v-for="n in 6" :key="n" class="pv-as__sec" :class="`tone-${n % 3}`">
        <small>{{ ['Mempelai', 'Acara', 'Galeri', 'Cerita', 'Hadiah', 'Ucapan'][n - 1] }}</small>
        <i></i><i class="is-short"></i>
        <span v-if="n % 2" class="pv-as__img"></span>
      </section>
    </div>

    <span class="pv-as__hint" data-f="behavior">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v5M12 10V4a1.5 1.5 0 0 1 3 0v6M15 10V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L3.5 13a1.5 1.5 0 0 1 2.4-1.8L9 14" /></svg>
      Melambat saat tamu menggulir sendiri
    </span>

    <div class="pv-as__dock">
      <div class="pv-as__speed" data-f="speed">
        <button type="button" aria-label="Pelankan" @click="bump(-10)">−</button>
        <b>{{ s.speed }}%</b>
        <button type="button" aria-label="Percepat" @click="bump(10)">+</button>
      </div>
      <button type="button" class="pv-as__btn" data-f="button progress" :aria-label="s.run ? 'Jeda gulir' : 'Mulai gulir'" @click="s.run = !s.run">
        <svg class="pv-as__ring" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="17" />
          <circle cx="20" cy="20" r="17" class="is-fill" :stroke-dasharray="C" :stroke-dashoffset="C * (1 - progress)" />
        </svg>
        <svg v-if="s.run" class="pv-as__ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7v10M15 7v10" /></svg>
        <svg v-else class="pv-as__ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.pv-as { position: relative; overflow: hidden; background: #fbf8f2; }
.pv-as__page { will-change: transform; }
.pv-as__sec { display: grid; justify-items: center; gap: 7px; height: 150px; padding: 22px 26px; text-align: center; border-bottom: 1px solid #efe6d6; }
.pv-as__sec.tone-1 { background: #fff; }
.pv-as__sec.tone-2 { background: #f4f8fa; }
.pv-as__sec small { font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: #9a7b4f; }
.pv-as__sec i { width: 100%; height: 7px; border-radius: 4px; background: #e9e2d4; }
.pv-as__sec i.is-short { width: 65%; }
.pv-as__img { width: 100%; height: 52px; border-radius: 10px; background: linear-gradient(140deg, #dbe9f0, #efe2cb); }
.pv-as__hint { position: absolute; top: 22px; left: 22px; right: 22px; display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 10px; background: rgba(255, 255, 255, .94); border: 1px solid var(--dx-line); font-size: 10px; color: var(--dx-muted); }
.pv-as__hint svg { width: 14px; height: 14px; fill: none; stroke: var(--dx-navy); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.pv-as__dock { position: absolute; right: 22px; bottom: 22px; display: flex; align-items: center; gap: 8px; }
.pv-as__speed { display: flex; align-items: center; gap: 6px; padding: 4px; border-radius: 999px; background: #fff; border: 1px solid var(--dx-line); }
.pv-as__speed button { width: 24px; height: 24px; border-radius: 50%; border: 0; background: var(--dx-navy-50); color: var(--dx-navy); font: inherit; font-size: 14px; cursor: pointer; }
.pv-as__speed b { min-width: 30px; text-align: center; font-size: 10.5px; font-weight: 500; color: var(--dx-navy); }
.pv-as__btn { position: relative; display: grid; place-items: center; width: 46px; height: 46px; border: 0; border-radius: 50%; background: var(--dx-navy); cursor: pointer; }
.pv-as__ring { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.pv-as__ring circle { fill: none; stroke: rgba(255, 255, 255, .18); stroke-width: 2.4; }
.pv-as__ring .is-fill { stroke: var(--dx-sand); stroke-linecap: round; }
.pv-as__ico { position: relative; width: 18px; height: 18px; fill: none; stroke: #fff; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
</style>
