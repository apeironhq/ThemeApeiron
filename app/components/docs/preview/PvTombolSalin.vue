<script setup lang="ts">
// Pratinjau Tombol Salin: benar-benar menyalin ke clipboard, lalu label berganti pesan berhasil.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const state = ref<'idle' | 'ok' | 'fail'>('idle')
let t: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(String(props.s.value || ''))
    state.value = props.s.value ? 'ok' : 'fail'
  } catch { state.value = 'fail' }
  clearTimeout(t)
  t = setTimeout(() => (state.value = 'idle'), 1800)
}
// Langkah "pesan feedback" memperlihatkan keadaan berhasil.
watch(() => props.focus, (f) => {
  clearTimeout(t)
  state.value = f === 'feedback' ? 'ok' : 'idle'
})
onBeforeUnmount(() => clearTimeout(t))
</script>

<template>
  <div class="pv pv-cp">
    <b class="pv-cp__title">Amplop Digital</b>
    <p class="pv-cp__lead">Doa restu Anda adalah hadiah terindah. Jika ingin memberi tanda kasih, silakan melalui:</p>

    <div class="pv-cp__card">
      <span class="pv-cp__chip" aria-hidden="true"></span>
      <span class="pv-cp__src" data-f="source">Teks Manual</span>
      <span class="pv-cp__bank">Bank BCA</span>
      <b class="pv-cp__num" data-f="value">{{ s.value || '—' }}</b>
      <span class="pv-cp__owner">a.n. Raka Pratama</span>
    </div>

    <button type="button" class="pv-cp__btn" :class="`is-${state}`" data-f="button feedback" @click="copy">
      <span class="pv-cp__ico" aria-hidden="true">
        <svg v-if="state === 'ok'" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        <svg v-else viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>
      </span>
      <Transition name="pv-fade" mode="out-in">
        <span :key="state">{{ state === 'ok' ? (s.done || 'Tersalin!') : state === 'fail' ? 'Gagal menyalin' : (s.label || 'Salin') }}</span>
      </Transition>
    </button>
    <small class="pv-cp__hint">Coba klik, lalu tempel di mana saja.</small>
  </div>
</template>

<style scoped>
.pv-cp { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 22px 24px; text-align: center; background: #fbf8f2; }
.pv-cp__title { font-size: 18px; font-weight: 500; color: var(--dx-navy); }
.pv-cp__lead { margin: 0; font-size: 11px; line-height: 1.55; color: var(--dx-muted); }
.pv-cp__card { position: relative; width: 100%; display: grid; justify-items: start; gap: 4px; padding: 18px 16px; border-radius: 16px; text-align: left; color: #fff;
	background: radial-gradient(120% 120% at 100% 0%, #0e5578, var(--dx-navy) 60%, #04263a); }
.pv-cp__chip { width: 30px; height: 22px; border-radius: 5px; background: linear-gradient(135deg, #e9d3a8, #c9a46b); margin-bottom: 8px; }
.pv-cp__src { position: absolute; top: 16px; right: 14px; padding: 3px 8px; border-radius: 999px; background: rgba(255, 255, 255, .12); font-size: 9px; }
.pv-cp__bank { font-size: 10px; opacity: .75; letter-spacing: .08em; text-transform: uppercase; }
.pv-cp__num { font-size: 20px; font-weight: 500; letter-spacing: .06em; padding: 2px 4px; margin-left: -4px; border-radius: 6px; }
.pv-cp__owner { font-size: 10.5px; opacity: .8; }
.pv-cp__btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; border: 1px solid var(--dx-navy); background: #fff; color: var(--dx-navy); font: inherit; font-size: 12.5px; cursor: pointer; transition: background .3s, color .3s, transform .3s; }
.pv-cp__btn.is-ok { background: var(--dx-navy); color: #fff; transform: scale(1.03); }
.pv-cp__btn.is-fail { border-color: #b4535d; color: #b4535d; }
.pv-cp__ico { display: grid; }
.pv-cp__ico svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.pv-cp__hint { font-size: 10px; color: var(--dx-muted); }
</style>
