<script setup lang="ts">
// Pratinjau Hitung Mundur: berdetak tiap detik menuju tanggal yang dipilih.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const now = ref<number | null>(null)
let id: ReturnType<typeof setInterval> | undefined
onMounted(() => { now.value = Date.now(); id = setInterval(() => (now.value = Date.now()), 1000) })
onBeforeUnmount(() => clearInterval(id))

// Tanpa tanggal pilihan, pakai 45 hari dari sekarang (dihitung di browser agar tidak beda dengan SSR).
const target = computed(() => {
  const t = props.s.date ? new Date(props.s.date).getTime() : NaN
  return Number.isFinite(t) ? t : (now.value ?? 0) + 45 * 864e5 + 6 * 36e5
})
const parts = computed(() => {
  if (now.value === null) return [{ k: 'Hari', v: '--' }, { k: 'Jam', v: '--' }, { k: 'Menit', v: '--' }, { k: 'Detik', v: '--' }]
  const d = Math.max(0, target.value - now.value) / 1000
  const pad = (n: number) => String(Math.floor(n)).padStart(2, '0')
  return [
    { k: 'Hari', v: pad(d / 86400) },
    { k: 'Jam', v: pad((d % 86400) / 3600) },
    { k: 'Menit', v: pad((d % 3600) / 60) },
    { k: 'Detik', v: pad(d % 60) },
  ]
})
const shown = computed(() => (props.s.seconds ? parts.value : parts.value.slice(0, 3)))
const done = computed(() => now.value !== null && target.value <= now.value)
const dateText = computed(() => {
  if (now.value === null) return 'Sabtu, 12 Desember 2026'
  return new Date(target.value).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})
</script>

<template>
  <div class="pv pv-cd">
    <span class="pv-cd__eyebrow">Menuju hari bahagia</span>
    <b class="pv-cd__names">Raka &amp; Nadia</b>

    <div class="pv-cd__timer" :class="{ 'is-vertical': s.dir === 'Vertikal' }" data-f="units style">
      <p v-if="done" class="pv-cd__done">Acara sedang berlangsung</p>
      <template v-for="(p, i) in shown" v-else :key="p.k">
        <span v-if="s.sep && i" class="pv-cd__sep" aria-hidden="true">:</span>
        <span class="pv-cd__box">
          <Transition name="pv-tick" mode="out-in"><b :key="p.v">{{ p.v }}</b></Transition>
          <small>{{ p.k }}</small>
        </span>
      </template>
    </div>

    <span class="pv-cd__date" data-f="date">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></svg>
      {{ dateText }}
    </span>
  </div>
</template>

<style scoped>
.pv-cd { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px 16px; text-align: center;
	background: radial-gradient(120% 70% at 50% 0%, #eef5f8, #fff 70%); }
.pv-cd__eyebrow { font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--dx-muted); }
.pv-cd__names { font-size: 24px; font-weight: 500; color: var(--dx-navy); }
.pv-cd__timer { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px; border-radius: 16px; }
.pv-cd__timer.is-vertical { flex-direction: column; }
.pv-cd__box { display: grid; place-items: center; width: 46px; padding: 9px 0 7px; border-radius: 12px; background: #fff; border: 1px solid var(--dx-line); }
.pv-cd__box b { font-size: 19px; font-weight: 500; color: var(--dx-navy); font-variant-numeric: tabular-nums; }
.pv-cd__box small { font-size: 10px; color: var(--dx-muted); }
.is-vertical .pv-cd__box { width: 74px; padding: 6px 0; }
.pv-cd__sep { font-size: 18px; color: var(--dx-sand); }
.is-vertical .pv-cd__sep { line-height: .6; }
.pv-cd__done { margin: 0; padding: 12px 16px; border-radius: 12px; background: var(--dx-gold-soft); color: #7a5a26; font-size: 13px; }
.pv-cd__date { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--dx-muted); padding: 6px 10px; border-radius: 999px; }
.pv-cd__date svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.6; }
.pv-tick-enter-active, .pv-tick-leave-active { transition: transform .28s cubic-bezier(.2, .8, .2, 1), opacity .28s; }
.pv-tick-enter-from { transform: translateY(-40%); opacity: 0; }
.pv-tick-leave-to { transform: translateY(40%); opacity: 0; }
</style>
