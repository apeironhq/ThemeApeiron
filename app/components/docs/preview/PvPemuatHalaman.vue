<script setup lang="ts">
// Pratinjau Pemuat Halaman: progres 0–100%, teks berurutan, lalu animasi keluar.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const pct = ref(0)
const leaving = ref(false)
let raf = 0
let start = 0
let wait: ReturnType<typeof setTimeout> | undefined

function run() {
  cancelAnimationFrame(raf)
  clearTimeout(wait)
  leaving.value = false
  pct.value = 0
  start = performance.now()
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / 2600)
    pct.value = Math.round((1 - Math.pow(1 - p, 2.2)) * 100)
    if (p < 1) raf = requestAnimationFrame(tick)
    else {
      wait = setTimeout(() => { leaving.value = true; wait = setTimeout(run, 2200) }, 450)
    }
  }
  raf = requestAnimationFrame(tick)
}
const paused = inject<Ref<boolean>>('dxPaused', ref(false))
onMounted(run)
watch(paused, (v) => { if (v) { cancelAnimationFrame(raf); clearTimeout(wait) } else run() })
onBeforeUnmount(() => { cancelAnimationFrame(raf); clearTimeout(wait) })
watch(() => [props.s.style, props.focus], run)

const style = computed(() => String(props.s.style || 'Default').toLowerCase())
const C = 2 * Math.PI * 34
</script>

<template>
  <div class="pv pv-pl">
    <div class="pv-pl__site" aria-hidden="true">
      <span>Raka &amp; Nadia</span>
      <i></i><i class="is-short"></i>
    </div>

    <div class="pv-pl__overlay" :class="{ 'is-leaving': leaving }" data-f="exit">
      <div class="pv-pl__art" :class="`is-${style}`" data-f="style timing">
        <svg v-if="style === 'default'" viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r="34" class="is-track" />
          <circle cx="40" cy="40" r="34" class="is-fill" :stroke-dasharray="C" :stroke-dashoffset="C * (1 - pct / 100)" />
        </svg>
        <span v-else-if="style === 'coffee'" class="pv-pl__cup" aria-hidden="true">
          <span class="pv-pl__liquid" :style="{ height: `${pct}%` }"></span>
          <i class="pv-pl__handle"></i>
          <i class="pv-pl__steam"></i><i class="pv-pl__steam is-2"></i>
        </span>
        <span v-else class="pv-pl__water" aria-hidden="true">
          <span class="pv-pl__wave" :style="{ transform: `translateY(${100 - pct}%)` }"></span>
        </span>
        <b v-if="s.pct" class="pv-pl__pct">{{ pct }}%</b>
      </div>
      <div class="pv-pl__text" data-f="text">
        <small>Bismillah</small>
        <b>{{ s.name || 'Raka & Nadia' }}</b>
        <span>Memuat undangan…</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pv-pl { position: relative; overflow: hidden; background: #fff; }
.pv-pl__site { display: grid; justify-items: center; gap: 8px; padding: 60px 26px; }
.pv-pl__site span { font-size: 22px; font-weight: 500; color: var(--dx-navy); }
.pv-pl__site i { width: 100%; height: 7px; border-radius: 4px; background: #eef2f5; }
.pv-pl__site i.is-short { width: 60%; }
.pv-pl__overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; background: radial-gradient(110% 80% at 50% 30%, #0e5578, var(--dx-navy) 55%, #04263a); color: #fff; transition: transform .9s cubic-bezier(.7, 0, .2, 1), opacity .6s; }
.pv-pl__overlay.is-leaving { transform: translateY(-100%); }
.pv-pl__art { position: relative; display: grid; place-items: center; width: 96px; height: 96px; border-radius: 50%; }
.pv-pl__art svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.pv-pl__art circle { fill: none; stroke-width: 3; }
.pv-pl__art .is-track { stroke: rgba(255, 255, 255, .14); }
.pv-pl__art .is-fill { stroke: var(--dx-sand); stroke-linecap: round; }
.pv-pl__pct { position: absolute; font-size: 16px; font-weight: 500; font-variant-numeric: tabular-nums; }
.is-coffee .pv-pl__pct, .is-water .pv-pl__pct { color: #fff; text-shadow: 0 1px 2px rgba(0, 0, 0, .25); }
.pv-pl__cup { position: relative; width: 64px; height: 58px; margin-top: 14px; border: 2px solid #e9d3a8; border-top: 0; border-radius: 0 0 16px 16px; overflow: visible; }
.pv-pl__liquid { position: absolute; left: 2px; right: 2px; bottom: 2px; max-height: calc(100% - 4px); border-radius: 0 0 12px 12px; background: #b8875a; transition: height .2s linear; }
.pv-pl__handle { position: absolute; right: -16px; top: 10px; width: 14px; height: 22px; border: 2px solid #e9d3a8; border-left: 0; border-radius: 0 10px 10px 0; }
.pv-pl__steam { position: absolute; left: 22px; top: -22px; width: 3px; height: 16px; border-radius: 3px; background: rgba(255, 255, 255, .5); animation: pv-steam 1.8s ease-in-out infinite; }
.pv-pl__steam.is-2 { left: 36px; animation-delay: -.9s; }
@keyframes pv-steam { 0% { transform: translateY(6px) scaleY(.6); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-6px) scaleY(1); opacity: 0; } }
.pv-pl__water { position: relative; width: 96px; height: 96px; border-radius: 50%; border: 2px solid rgba(233, 211, 168, .8); overflow: hidden; }
.pv-pl__wave { position: absolute; inset: 0; transition: transform .2s linear; }
.pv-pl__wave::before { content: ""; position: absolute; left: -50%; top: -8px; width: 200%; height: 200%; border-radius: 42%; background: rgba(201, 164, 107, .75); animation: pv-wave 4s linear infinite; }
@keyframes pv-wave { to { transform: rotate(360deg); } }
.pv-pl__text { display: grid; justify-items: center; gap: 4px; padding: 6px 10px; border-radius: 12px; text-align: center; }
.pv-pl__text small { font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: #e9d3a8; }
.pv-pl__text b { font-size: 20px; font-weight: 500; }
.pv-pl__text span { font-size: 11px; opacity: .75; }
</style>
