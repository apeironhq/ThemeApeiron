<script setup lang="ts">
// Pratinjau Cerita Cinta: timeline scrapbook dengan penanda bergerak dan animasi masuk card.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const stories = [
  { year: '2019', title: 'Pertama Bertemu', text: 'Sapaan singkat di perpustakaan kampus.', tone: 'a' },
  { year: '2023', title: 'Lamaran', text: 'Dua keluarga bertemu dan bersepakat.', tone: 'b' },
  { year: '2026', title: 'Menikah', text: 'Awal cerita baru kami berdua.', tone: 'c' },
]
const line = computed(() => ({ 'Ribbon Trail': 'ribbon', 'Journey Icon': 'journey' } as Record<string, string>)[props.s.line] ?? 'doodle')
const anim = computed(() => ({ 'Fade In': 'fade', 'Slide Up': 'up', 'Slide Alternating': 'alt', 'Zoom In': 'zoom' } as Record<string, string>)[props.s.anim] ?? 'none')
// Ganti key agar animasi masuk diputar ulang saat pilihan berubah.
const replay = ref(0)
watch(() => [props.s.anim, props.s.line], () => replay.value++)
</script>

<template>
  <div class="pv pv-cc">
    <span class="pv-cc__eyebrow">Our Story</span>
    <b class="pv-cc__title">Cerita Kami</b>

    <div :key="replay" class="pv-cc__tl" :class="[`line-${line}`, `anim-${anim}`]" data-f="skin">
      <svg class="pv-cc__path" viewBox="0 0 20 400" preserveAspectRatio="none" aria-hidden="true" data-f="timeline">
        <path v-if="line === 'doodle'" d="M10 0 C 18 40, 2 70, 10 110 S 18 180, 10 220 S 2 290, 10 330 S 18 380, 10 400" />
        <path v-else d="M10 0 V400" />
      </svg>
      <span class="pv-cc__marker" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
      </span>

      <article v-for="(st, i) in stories" :key="st.year" class="pv-cc__card" :class="{ 'is-right': i % 2 }" :style="{ '--i': i }" data-f="stories">
        <span class="pv-cc__photo" :class="`tone-${st.tone}`" data-f="photo"><i class="pv-cc__tape" aria-hidden="true"></i></span>
        <small>{{ st.year }}</small>
        <b>{{ st.title }}</b>
        <p>{{ st.text }}</p>
        <span v-if="line === 'journey'" class="pv-cc__dot" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg></span>
      </article>
    </div>
  </div>
</template>

<style scoped>
.pv-cc { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 20px 12px; background: #fbf6ec; overflow: hidden; }
.pv-cc__eyebrow { font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: #9a7b4f; }
.pv-cc__title { font-size: 20px; font-weight: 500; color: var(--dx-navy); margin-bottom: 10px; }
.pv-cc__tl { position: relative; width: 100%; display: grid; gap: 12px; padding: 4px 0; border-radius: 12px; }
.pv-cc__path { position: absolute; left: 50%; top: 0; width: 20px; height: 100%; transform: translateX(-50%); overflow: visible; }
.pv-cc__path path { fill: none; stroke: #c9a46b; stroke-width: 1.6; stroke-dasharray: 5 5; vector-effect: non-scaling-stroke; }
.line-ribbon .pv-cc__path path { stroke-width: 5; stroke-dasharray: none; stroke: #e5cfa5; }
.line-journey .pv-cc__path path { stroke: rgba(8, 60, 87, .25); stroke-dasharray: 2 6; stroke-linecap: round; stroke-width: 2.4; }
.pv-cc__marker { position: absolute; left: 50%; top: 0; z-index: 2; display: grid; place-items: center; width: 22px; height: 22px; margin-left: -11px; border-radius: 50%; background: var(--dx-navy); color: #e9d3a8; animation: pv-walk 6s ease-in-out infinite; }
.pv-cc__marker svg { width: 12px; height: 12px; fill: currentColor; }
@keyframes pv-walk { 0%, 8% { top: 0; } 50% { top: calc(100% - 22px); } 92%, 100% { top: 0; } }
.pv-cc__card { position: relative; width: calc(50% - 18px); display: grid; gap: 2px; padding: 8px; border-radius: 6px; background: #fff; border: 1px solid #eadfcb; transform: rotate(-1.2deg); }
.pv-cc__card.is-right { justify-self: end; transform: rotate(1.2deg); }
.pv-cc__photo { position: relative; height: 54px; border-radius: 3px; margin-bottom: 4px; }
.tone-a { background: linear-gradient(140deg, #dbe9f0, #efe2cb); }
.tone-b { background: linear-gradient(140deg, #efe2cb, #f6dfe3); }
.tone-c { background: linear-gradient(140deg, #e3edf2, #f3ead8); }
.pv-cc__tape { position: absolute; top: -6px; left: 50%; width: 30px; height: 10px; margin-left: -15px; background: rgba(201, 164, 107, .45); transform: rotate(-4deg); }
.pv-cc__card small { font-size: 9px; color: #9a7b4f; }
.pv-cc__card b { font-size: 11.5px; font-weight: 500; color: var(--dx-navy); }
.pv-cc__card p { margin: 0; font-size: 9.5px; line-height: 1.4; color: var(--dx-muted); }
.pv-cc__dot { position: absolute; top: 24px; right: -29px; display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 1px solid #e5cfa5; color: #c98a95; }
.is-right .pv-cc__dot { right: auto; left: -29px; }
.pv-cc__dot svg { width: 10px; height: 10px; fill: currentColor; }

.anim-fade .pv-cc__card { animation: pv-fade-in .8s calc(var(--i) * .25s) both; }
.anim-up .pv-cc__card { animation: pv-up .8s calc(var(--i) * .25s) cubic-bezier(.2, .8, .2, 1) both; }
.anim-alt .pv-cc__card { animation: pv-left .8s calc(var(--i) * .25s) cubic-bezier(.2, .8, .2, 1) both; }
.anim-alt .pv-cc__card.is-right { animation-name: pv-right; }
.anim-zoom .pv-cc__card { animation: pv-zoom .8s calc(var(--i) * .25s) cubic-bezier(.2, .8, .2, 1) both; }
@keyframes pv-fade-in { from { opacity: 0; } }
@keyframes pv-up { from { opacity: 0; translate: 0 24px; } }
@keyframes pv-left { from { opacity: 0; translate: -30px 0; } }
@keyframes pv-right { from { opacity: 0; translate: 30px 0; } }
@keyframes pv-zoom { from { opacity: 0; scale: .8; } }
</style>
