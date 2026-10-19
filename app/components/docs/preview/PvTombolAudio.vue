<script setup lang="ts">
// Pratinjau Tombol Audio: tombol mengambang dengan efek saat diputar dan kartu "sedang diputar".
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const fx = computed(() => ({ 'Cincin Berputar': 'spin', 'Denyut Cincin': 'pulse', 'Ketukan': 'beat', 'Cahaya Halus': 'glow' } as Record<string, string>)[props.s.effect] ?? 'none')
function toggle() { props.s.playing = !props.s.playing }
</script>

<template>
  <div class="pv pv-au" :class="[`fx-${fx}`, { 'is-playing': s.playing, 'is-left': s.side === 'Kiri' }]">
    <div class="pv-au__page" aria-hidden="true">
      <span class="pv-au__eyebrow">Akad &amp; Resepsi</span>
      <b>Raka &amp; Nadia</b>
      <i></i><i></i><i class="is-short"></i>
      <span class="pv-au__photo"></span>
      <i></i><i class="is-short"></i>
    </div>

    <div class="pv-au__source" data-f="source">
      <span class="pv-au__src-ico"><svg viewBox="0 0 24 24"><path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></svg></span>
      <span><small>File Audio</small><b>a-thousand-years.mp3</b></span>
    </div>

    <div class="pv-au__now" data-f="play">
      <span class="pv-au__eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span>{{ s.playing ? 'Musik diputar setelah Buka Undangan' : 'Musik dijeda' }}</span>
    </div>

    <button type="button" class="pv-au__btn" data-f="effect" :aria-label="s.playing ? 'Jeda musik' : 'Putar musik'" @click="toggle">
      <span class="pv-au__ring" aria-hidden="true"></span>
      <svg v-if="s.playing" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12" /></svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6.5v11l9-5.5z" fill="currentColor" /></svg>
    </button>
  </div>
</template>

<style scoped>
.pv-au { position: relative; overflow: hidden; background: #fbf8f2; }
.pv-au__page { display: grid; justify-items: center; gap: 8px; padding: 30px 26px; text-align: center; }
.pv-au__eyebrow { font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: #9a7b4f; }
.pv-au__page b { font-size: 22px; font-weight: 500; color: var(--dx-navy); margin-bottom: 6px; }
.pv-au__page i { display: block; width: 100%; height: 7px; border-radius: 4px; background: #ece6da; }
.pv-au__page i.is-short { width: 70%; }
.pv-au__photo { width: 100%; height: 120px; border-radius: 14px; margin: 6px 0; background: linear-gradient(140deg, #e8dcc6, #d9e6ee); }

.pv-au__source { position: absolute; top: 14px; left: 14px; right: 14px; display: flex; align-items: center; gap: 10px; padding: 9px 11px; border-radius: 12px; background: #fff; border: 1px solid var(--dx-line); }
.pv-au__source small { display: block; font-size: 9.5px; color: var(--dx-muted); }
.pv-au__source b { font-size: 11.5px; font-weight: 500; color: var(--dx-ink); }
.pv-au__src-ico { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; background: var(--dx-navy-50); color: var(--dx-navy); }
.pv-au__src-ico svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.6; }

.pv-au__now { position: absolute; left: 14px; bottom: 22px; right: 80px; display: flex; align-items: center; gap: 8px; padding: 9px 11px; border-radius: 12px; background: var(--dx-navy); color: #fff; font-size: 10.5px; line-height: 1.3; }
.is-left .pv-au__now { left: 80px; right: 14px; }
.pv-au__eq { display: flex; align-items: flex-end; gap: 2px; height: 14px; flex: none; }
.pv-au__eq i { width: 3px; height: 30%; border-radius: 2px; background: var(--dx-sand); }
.is-playing .pv-au__eq i { animation: pv-eq .9s ease-in-out infinite alternate; }
.pv-au__eq i:nth-child(2) { animation-delay: -.3s !important; }
.pv-au__eq i:nth-child(3) { animation-delay: -.6s !important; }
.pv-au__eq i:nth-child(4) { animation-delay: -.15s !important; }
@keyframes pv-eq { to { height: 100%; } }

.pv-au__btn { position: absolute; right: 18px; bottom: 18px; display: grid; place-items: center; width: 48px; height: 48px; border: 0; border-radius: 50%; background: #fff; color: var(--dx-navy); cursor: pointer; border: 1px solid var(--dx-line); }
.is-left .pv-au__btn { right: auto; left: 18px; }
.pv-au__btn svg { position: relative; width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
.pv-au__ring { position: absolute; inset: -4px; border-radius: 50%; border: 2px solid rgba(8, 60, 87, .14); }
.is-playing.fx-spin .pv-au__ring { border-color: rgba(8, 60, 87, .12); border-top-color: var(--dx-sand); animation: pv-spin 1.6s linear infinite; }
.is-playing.fx-pulse .pv-au__ring { border-color: var(--dx-sand); animation: pv-pulse 1.6s ease-out infinite; }
.is-playing.fx-beat .pv-au__btn { animation: pv-beat .8s ease-in-out infinite; }
.is-playing.fx-glow .pv-au__ring { border-color: rgba(201, 164, 107, .6); animation: pv-glow 2s ease-in-out infinite; }
@keyframes pv-spin { to { transform: rotate(360deg); } }
@keyframes pv-pulse { from { transform: scale(1); opacity: 1; } to { transform: scale(1.5); opacity: 0; } }
@keyframes pv-beat { 0%, 100% { transform: scale(1); } 30% { transform: scale(1.08); } }
@keyframes pv-glow { 0%, 100% { opacity: .35; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
</style>
