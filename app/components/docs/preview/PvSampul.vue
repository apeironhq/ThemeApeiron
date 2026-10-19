<script setup lang="ts">
/**
 * Pratinjau Sampul — desain Cover Classic yang sama dengan hero situs utama:
 * dua pintu kertas berpita navy, segel medali, dan label tamu menggantung.
 * Segel bisa diklik untuk membuka pintu (3D), lalu menutup lagi.
 */
import sealRaw from '~/assets/svg/seal-medallion.svg?raw'
import tagRaw from '~/assets/svg/guest-tag.svg?raw'

const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const sealVars = {
  'seal-color-light': '#145c82',
  'seal-color': '#083c57',
  'seal-color-dark': '#03202f',
  'seal-ring-light': '#0f4d6e',
  'seal-ring': '#062f46',
  'seal-ring-dark': '#021a27',
}
const opened = ref(false)
let t: ReturnType<typeof setTimeout> | undefined
const initials = computed(() => `${(props.s.first || 'R')[0]}${(props.s.second || 'N')[0]}`.toUpperCase())

function toggle() {
  clearTimeout(t)
  opened.value = !opened.value
  if (opened.value) t = setTimeout(() => (opened.value = false), 2800)
}
// Tiap langkah memperlihatkan bagian yang dibahas: isi (pintu terbuka), label tamu, atau segel.
watch(() => props.focus, (f) => {
  clearTimeout(t)
  opened.value = f === 'names'
  if (f === 'open') t = setTimeout(toggle, 900)
})
onBeforeUnmount(() => clearTimeout(t))
</script>

<template>
  <div class="pv pv-cover">
    <div class="pv-gate" :class="{ 'is-open': opened }" style="--paper: url('/img/bg.webp')" data-f="frame">
      <div class="pv-gate__inside">
        <p class="pv-gate__kicker">The Wedding of</p>
        <div class="pv-gate__names" data-f="names">
          <p>{{ s.first }} &amp; {{ s.second }}</p>
          <small>Sabtu, 12 Desember 2026</small>
        </div>
        <div class="pv-gate__cd">
          <span><b>45</b>Hari</span><span><b>06</b>Jam</span><span><b>12</b>Menit</span><span><b>30</b>Detik</span>
        </div>
      </div>

      <div class="pv-gate__door is-l"><div class="pv-gate__face is-front"><i class="pv-gate__ribbon"></i></div><div class="pv-gate__face is-back"></div></div>
      <div class="pv-gate__door is-r"><div class="pv-gate__face is-front"><i class="pv-gate__ribbon"></i></div><div class="pv-gate__face is-back"></div></div>

      <button type="button" class="pv-gate__seal" aria-label="Buka undangan" data-f="open" @click="toggle">
        <ApInlineSvg :raw="sealRaw" :vars="sealVars" extra-class="pv-gate__seal-svg" />
        <span class="pv-gate__seal-text"><b>{{ initials }}</b><small>Buka Undangan</small></span>
      </button>

      <div class="pv-gate__tag" data-f="guest">
        <ApInlineSvg :raw="tagRaw" extra-class="pv-gate__tag-svg" />
        <span class="pv-gate__tag-text"><b>Kepada Yth.</b><small>{{ s.guest || 'Tamu Undangan' }}</small></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pv-cover { display: grid; place-items: center; background: radial-gradient(120% 80% at 50% 20%, #fbf8f1, #efe7d8); }
.pv-gate { --w: 228px; position: relative; width: var(--w); aspect-ratio: 3 / 4.25; perspective: 900px; transform-style: preserve-3d; border-radius: 14px; }

.pv-gate__inside { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 22px 16px; border-radius: 14px; background: var(--paper) center / cover, #fbf8f1; text-align: center; color: #04263a; }
.pv-gate__inside::before { content: ""; position: absolute; inset: 8px; border: 1px solid rgba(201, 164, 107, .5); border-radius: 9px; pointer-events: none; }
.pv-gate__kicker { margin: 0; font-size: 8px; letter-spacing: .3em; text-transform: uppercase; color: #5a6d78; }
.pv-gate__names { display: grid; gap: 4px; margin: 8px 0 4px; padding: 4px 8px; border-radius: 8px; }
.pv-gate__names p { margin: 0; font-size: 22px; font-style: italic; line-height: 1.05; color: #083c57; }
.pv-gate__names small { font-size: 9px; color: #5a6d78; }
.pv-gate__cd { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; width: 100%; margin-top: 10px; }
.pv-gate__cd span { display: grid; padding: 6px 0 5px; border-radius: 8px; background: rgba(255, 255, 255, .75); border: 1px solid rgba(201, 164, 107, .35); font-size: 7px; color: #5a6d78; }
.pv-gate__cd b { font-size: 15px; font-weight: 400; line-height: 1; color: #083c57; }

.pv-gate__door { position: absolute; top: 0; bottom: 0; width: 50%; transform-style: preserve-3d; transition: transform 1.1s cubic-bezier(.65, 0, .25, 1); }
.pv-gate__door.is-l { left: 0; transform-origin: left center; }
.pv-gate__door.is-r { right: 0; transform-origin: right center; }
.is-open .pv-gate__door.is-l { transform: rotateY(-108deg); }
.is-open .pv-gate__door.is-r { transform: rotateY(108deg); }
.pv-gate__face { position: absolute; inset: 0; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden; background: var(--paper) center / cover, #f7f3ea; }
.is-l .pv-gate__face.is-front { border-radius: 14px 0 0 14px; background-position: left center; box-shadow: inset -8px 0 14px -12px rgba(60, 40, 10, .35); }
.is-r .pv-gate__face.is-front { border-radius: 0 14px 14px 0; background-position: right center; box-shadow: inset 8px 0 14px -12px rgba(60, 40, 10, .35); }
.pv-gate__face.is-back { transform: rotateY(180deg); background: linear-gradient(90deg, #ece5d6, #f6f1e6); }
.is-l .pv-gate__face.is-back { border-radius: 0 14px 14px 0; }
.is-r .pv-gate__face.is-back { border-radius: 14px 0 0 14px; }
.pv-gate__ribbon { position: absolute; left: 0; right: 0; top: 50%; height: 36px; margin-top: -18px; background: linear-gradient(180deg, #145c82 0%, #083c57 22%, #0a4566 50%, #083c57 78%, #04263a 100%); }
.pv-gate__ribbon::before, .pv-gate__ribbon::after { content: ""; position: absolute; left: 0; right: 0; border-top: 1px dashed rgba(233, 207, 150, .75); }
.pv-gate__ribbon::before { top: 5px; }
.pv-gate__ribbon::after { bottom: 5px; }

.pv-gate__seal { position: absolute; left: 50%; top: 50%; z-index: 4; width: 74px; height: 74px; margin: -37px 0 0 -37px; padding: 0; border: 0; border-radius: 50%; background: none; color: #fff; cursor: pointer; transition: opacity .4s, transform .5s cubic-bezier(.2, .8, .2, 1); }
.pv-gate__seal-svg { position: absolute; inset: -16%; width: 132%; height: 132%; }
.pv-gate__seal-text { position: relative; display: grid; place-items: center; align-content: center; gap: 1px; height: 100%; }
.pv-gate__seal-text b { font-size: 17px; font-weight: 400; line-height: 1; color: #f6e6bf; }
.pv-gate__seal-text small { font-size: 6.5px; font-weight: 500; letter-spacing: .03em; color: #fff; }
.is-open .pv-gate__seal { opacity: 0; transform: scale(.8); pointer-events: none; }

.pv-gate__tag { position: absolute; left: 50%; top: calc(50% + 22px); z-index: 3; width: 112px; margin-left: -56px; border-radius: 8px; transition: opacity .4s, transform .5s cubic-bezier(.2, .8, .2, 1); pointer-events: none; }
.pv-gate__tag-svg { display: block; width: 100%; height: auto; }
.pv-gate__tag-text { position: absolute; inset: 40% 13% 17% 13%; display: grid; place-items: center; align-content: center; gap: 1px; text-align: center; color: #04263a; }
.pv-gate__tag-text b { font-size: 10px; font-weight: 400; line-height: 1.1; }
.pv-gate__tag-text small { font-size: 7px; font-weight: 500; white-space: nowrap; }
.is-open .pv-gate__tag { opacity: 0; transform: translateY(12px); }
</style>
