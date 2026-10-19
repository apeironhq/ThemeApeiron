<script setup lang="ts">
// Pratinjau Sampul (Cover Classic): dua panel gatefold, segel, kartu penerima, tombol buka.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const opened = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
const initials = computed(() => `${(props.s.first || 'R')[0]}${(props.s.second || 'N')[0]}`.toUpperCase())
const shrink = computed(() => props.s.anim === 'Menyusut ke Samping')

function toggle() {
  opened.value = !opened.value
  clearTimeout(timer)
  if (opened.value) timer = setTimeout(() => (opened.value = false), 2600)
}
// Saat langkah "atur cara membuka" disorot, sampul membuka sendiri sebagai contoh.
watch(() => props.focus, (f) => { if (f === 'open' && !opened.value) setTimeout(toggle, 350) })
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="pv pv-cover" :class="{ 'is-open': opened, 'is-shrink': shrink }">
    <div class="pv-cover__inside">
      <span class="pv-cover__hello">Selamat datang</span>
      <b>{{ s.first }} &amp; {{ s.second }}</b>
      <span class="pv-cover__lines"><i></i><i></i><i></i></span>
    </div>

    <div class="pv-cover__panel pv-cover__panel--l" aria-hidden="true"></div>
    <div class="pv-cover__panel pv-cover__panel--r" aria-hidden="true"></div>

    <div class="pv-cover__front">
      <div class="pv-cover__names" data-f="names">
        <span class="pv-cover__label">The Wedding of</span>
        <b>{{ s.first }}</b>
        <span class="pv-cover__amp">&amp;</span>
        <b>{{ s.second }}</b>
        <span class="pv-cover__date">Sabtu, 12 Desember 2026</span>
      </div>
      <span class="pv-cover__seal" aria-hidden="true"><span>{{ initials }}</span></span>
      <div class="pv-cover__card" data-f="guest">
        <small>Kepada Yth.</small>
        <b>{{ s.guest || 'Tamu Undangan' }}</b>
      </div>
      <button type="button" class="pv-cover__btn" data-f="open" @click="toggle">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v11H4z M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" /></svg>
        Buka Undangan
      </button>
    </div>
  </div>
</template>

<style scoped>
.pv-cover { position: relative; overflow: hidden; background: #f7f1e6; color: #3d2f1c; }
.pv-cover__inside { position: absolute; inset: 0; display: grid; place-content: center; gap: 8px; text-align: center; background: #fff; }
.pv-cover__hello { font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #9a7b4f; }
.pv-cover__inside b { font-size: 22px; font-weight: 500; color: var(--dx-navy); }
.pv-cover__lines { display: grid; gap: 6px; justify-items: center; margin-top: 8px; }
.pv-cover__lines i { display: block; height: 6px; width: 150px; border-radius: 4px; background: #eef2f5; }
.pv-cover__lines i:nth-child(2) { width: 110px; }
.pv-cover__lines i:nth-child(3) { width: 130px; }

.pv-cover__panel {
	position: absolute; top: 0; bottom: 0; width: 50%;
	background:
		radial-gradient(circle at 50% 50%, rgba(201, 164, 107, .32) 1.4px, transparent 1.6px) 0 0 / 18px 18px,
		linear-gradient(160deg, #fbf6ec, #f1e6d2);
	transition: transform 1s cubic-bezier(.7, 0, .2, 1);
}
.pv-cover__panel--l { left: 0; border-right: 1px solid rgba(201, 164, 107, .45); transform-origin: left center; }
.pv-cover__panel--r { right: 0; border-left: 1px solid rgba(201, 164, 107, .45); transform-origin: right center; }
.is-open .pv-cover__panel--l { transform: translateX(-100%); }
.is-open .pv-cover__panel--r { transform: translateX(100%); }
.is-open.is-shrink .pv-cover__panel--l,
.is-open.is-shrink .pv-cover__panel--r { transform: scaleX(0); }

.pv-cover__front {
	position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px;
	padding: 28px 22px; text-align: center; transition: opacity .45s ease, transform .6s ease;
}
.is-open .pv-cover__front { opacity: 0; transform: scale(.96); pointer-events: none; }
.pv-cover__names { display: grid; gap: 2px; padding: 10px 14px; border-radius: 14px; }
.pv-cover__label { font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: #9a7b4f; margin-bottom: 4px; }
.pv-cover__names b { font-size: 26px; font-weight: 500; line-height: 1.1; color: #2f2414; }
.pv-cover__amp { font-size: 15px; color: #b18a52; }
.pv-cover__date { font-size: 11px; color: #7c6a50; margin-top: 6px; }
.pv-cover__seal {
	display: grid; place-items: center; width: 54px; height: 54px; border-radius: 50%;
	background: var(--dx-navy); box-shadow: 0 0 0 4px #f7f1e6, 0 0 0 5px rgba(201, 164, 107, .7);
}
.pv-cover__seal span { color: #e9d3a8; font-size: 15px; font-weight: 500; letter-spacing: .06em; }
.pv-cover__card { width: 100%; max-width: 210px; padding: 10px 12px; border-radius: 12px; background: rgba(255, 255, 255, .78); border: 1px solid rgba(201, 164, 107, .4); display: grid; gap: 2px; }
.pv-cover__card small { font-size: 10px; color: #8d7757; }
.pv-cover__card b { font-size: 14px; font-weight: 500; color: #2f2414; }
.pv-cover__btn {
	display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border: 0; border-radius: 999px;
	background: var(--dx-navy); color: #fff; font: inherit; font-size: 12.5px; cursor: pointer;
}
.pv-cover__btn svg { width: 15px; height: 15px; }
</style>
