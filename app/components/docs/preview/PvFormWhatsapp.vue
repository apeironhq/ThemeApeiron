<script setup lang="ts">
// Pratinjau Form WhatsApp: isian form langsung menyusun pesan dari format bertoken.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const options = ['Hadir', 'Tidak Hadir', 'Masih Ragu']
const message = computed(() =>
  String(props.s.template || '')
    .replace(/\[nama\]/gi, props.s.name || '…')
    .replace(/\[konfirmasi\]/gi, String(props.s.attend || '…').toLowerCase())
    .replace(/\[jumlah\]/gi, String(props.s.guests ?? 1)),
)
const sent = ref(false)
let t: ReturnType<typeof setTimeout> | undefined
function send() { sent.value = true; clearTimeout(t); t = setTimeout(() => (sent.value = false), 2200) }
function step(d: number) { props.s.guests = Math.min(5, Math.max(1, Number(props.s.guests || 1) + d)) }
onBeforeUnmount(() => clearTimeout(t))
</script>

<template>
  <div class="pv pv-wa">
    <div class="pv-wa__form" data-f="fields">
      <b class="pv-wa__title">Konfirmasi Kehadiran</b>
      <label class="pv-field"><small>Nama</small><input v-model="s.name" type="text"></label>
      <div class="pv-field" data-f="attend">
        <small>Konfirmasi</small>
        <div class="pv-wa__pills">
          <button v-for="o in options" :key="o" type="button" :class="{ 'is-on': s.attend === o }" @click="s.attend = o">{{ o }}</button>
        </div>
      </div>
      <div class="pv-field">
        <small>Jumlah Tamu</small>
        <div class="pv-wa__step"><button type="button" @click="step(-1)">−</button><b>{{ s.guests }}</b><button type="button" @click="step(1)">+</button></div>
      </div>
      <button type="button" class="pv-wa__send" @click="send">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" /></svg>
        {{ sent ? 'Membuka WhatsApp…' : 'Kirim via WhatsApp' }}
      </button>
    </div>

    <div class="pv-wa__chat">
      <div class="pv-wa__to" data-f="number">
        <span class="pv-wa__avatar">RN</span>
        <span><b>Raka &amp; Nadia</b><small>+62 812-3456-789</small></span>
      </div>
      <div class="pv-wa__bubble" :class="{ 'is-sent': sent }" data-f="message">
        <Transition name="pv-fade" mode="out-in"><p :key="message">{{ message }}</p></Transition>
        <small>12.30</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pv-wa { display: flex; flex-direction: column; gap: 12px; padding: 20px 22px; background: #f5f7f9; }
.pv-wa__form { display: grid; gap: 10px; padding: 14px; border-radius: 14px; background: #fff; border: 1px solid var(--dx-line); }
.pv-wa__title { font-size: 14px; font-weight: 500; color: var(--dx-navy); }
.pv-wa__pills { display: flex; gap: 5px; flex-wrap: wrap; }
.pv-wa__pills button { padding: 6px 9px; border-radius: 999px; border: 1px solid var(--dx-line); background: #fff; font: inherit; font-size: 10.5px; color: var(--dx-ink); cursor: pointer; transition: background .25s, color .25s, border-color .25s; }
.pv-wa__pills button.is-on { background: var(--dx-navy); border-color: var(--dx-navy); color: #fff; }
.pv-wa__step { display: inline-flex; align-items: center; gap: 12px; padding: 4px; border-radius: 999px; border: 1px solid var(--dx-line); width: max-content; }
.pv-wa__step button { width: 26px; height: 26px; border-radius: 50%; border: 0; background: var(--dx-navy-50); color: var(--dx-navy); font: inherit; font-size: 15px; cursor: pointer; }
.pv-wa__step b { min-width: 14px; text-align: center; font-weight: 500; font-size: 13px; }
.pv-wa__send { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 10px; border: 0; border-radius: 10px; background: var(--dx-navy); color: #fff; font: inherit; font-size: 12px; cursor: pointer; }
.pv-wa__send svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; }

.pv-wa__chat { display: grid; gap: 8px; padding: 10px; border-radius: 14px; background: #e9eff3; }
.pv-wa__to { display: flex; align-items: center; gap: 8px; padding: 4px; border-radius: 10px; }
.pv-wa__avatar { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--dx-navy); color: #e9d3a8; font-size: 10px; }
.pv-wa__to b { display: block; font-size: 11.5px; font-weight: 500; }
.pv-wa__to small { font-size: 10px; color: var(--dx-muted); }
.pv-wa__bubble { justify-self: end; max-width: 92%; padding: 9px 11px 6px; border-radius: 12px 12px 4px 12px; background: #fff; color: var(--dx-ink); border: 1px solid #dbe6ec; transition: transform .4s cubic-bezier(.2, .8, .2, 1); }
.pv-wa__bubble.is-sent { transform: translateY(-3px); border-color: var(--dx-navy); }
.pv-wa__bubble p { margin: 0; font-size: 11px; line-height: 1.5; white-space: pre-line; }
.pv-wa__bubble small { display: block; text-align: right; font-size: 9px; color: var(--dx-muted); margin-top: 2px; }
</style>
