<script setup lang="ts">
// Pratinjau Form Order: form bertahap dengan progres, draft otomatis, dan kirim ke MDUNDIG.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const steps = [
  { name: 'Mempelai', fields: [['Nama mempelai pria', 'Raka Pratama'], ['Nama mempelai wanita', 'Nadia Putri']] },
  { name: 'Acara', fields: [['Tanggal akad', '12 Desember 2026'], ['Lokasi', 'Gedung Sasana, Bandung']] },
  { name: 'Paket', fields: [['Paket undangan', 'Premium'], ['Catatan', 'Tema navy & emas']] },
]
const cur = ref(0)
const done = ref(false)
function next() {
  if (cur.value < steps.length - 1) cur.value++
  else { done.value = true; setTimeout(() => { done.value = false; cur.value = 0 }, 2400) }
}
watch(() => props.focus, (f) => {
  done.value = false
  cur.value = f === 'submit' ? 2 : f === 'fields' ? 1 : 0
})
</script>

<template>
  <div class="pv pv-fo" :class="{ 'is-sticky': s.sticky }">
    <div class="pv-fo__head">
      <b>Form Pemesanan</b>
      <span class="pv-fo__conn" data-f="connect"><i></i>MDUNDIG</span>
    </div>

    <ol class="pv-fo__steps" data-f="steps">
      <li v-for="(st, i) in steps" :key="st.name" :class="{ 'is-on': i === cur, 'is-done': i < cur || done }">
        <span>{{ i + 1 }}</span>{{ st.name }}
      </li>
      <i class="pv-fo__bar" :style="{ transform: `scaleX(${done ? 1 : cur / (steps.length - 1)})` }" aria-hidden="true"></i>
    </ol>

    <div class="pv-fo__body" data-f="fields">
      <Transition name="pv-slide" mode="out-in">
        <div v-if="done" key="done" class="pv-fo__done">
          <span class="pv-fo__done-ico"><svg viewBox="0 0 24 24"><path d="M4 7h16v11H4z M4 7l8 6 8-6" /></svg></span>
          <b>Pesanan terkirim</b>
          <small>Tercatat di dashboard MDUNDIG</small>
        </div>
        <div v-else :key="cur" class="pv-fo__fields">
          <label v-for="[l, v] in steps[cur]!.fields" :key="l" class="pv-field"><small>{{ l }}</small><input :value="v" type="text" readonly></label>
        </div>
      </Transition>
      <p v-if="s.draft && !done" class="pv-fo__draft">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" /></svg>
        Draft tersimpan otomatis
      </p>
    </div>

    <div class="pv-fo__nav">
      <button type="button" class="is-ghost" :disabled="cur === 0 || done" @click="cur--">Kembali</button>
      <button type="button" :disabled="done" data-f="submit" @click="next">{{ cur === steps.length - 1 ? 'Kirim Pesanan' : 'Lanjut' }}</button>
    </div>
  </div>
</template>

<style scoped>
.pv-fo { position: relative; display: flex; flex-direction: column; gap: 12px; padding: 16px 14px; background: #f6f8fa; }
.pv-fo__head { display: flex; align-items: center; justify-content: space-between; }
.pv-fo__head b { font-size: 14px; font-weight: 500; color: var(--dx-navy); }
.pv-fo__conn { display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 999px; background: var(--dx-gold-soft); color: #7a5a26; font-size: 9.5px; }
.pv-fo__conn i { width: 6px; height: 6px; border-radius: 50%; background: var(--dx-sand); }
.pv-fo__steps { position: relative; list-style: none; margin: 0; padding: 0 0 8px; display: grid; grid-template-columns: repeat(3, 1fr); border-radius: 10px; }
.pv-fo__steps::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 3px; border-radius: 3px; background: #e3eaef; }
.pv-fo__bar { position: absolute; left: 0; right: 0; bottom: 0; z-index: 1; height: 3px; border-radius: 3px; background: var(--dx-navy); transform-origin: left; transition: transform .5s cubic-bezier(.2, .8, .2, 1); }
.pv-fo__steps li { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--dx-muted); transition: color .3s; }
.pv-fo__steps li span { display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; border: 1px solid var(--dx-line-strong); font-size: 9.5px; transition: background .3s, color .3s, border-color .3s; }
.pv-fo__steps li.is-on { color: var(--dx-navy); }
.pv-fo__steps li.is-on span, .pv-fo__steps li.is-done span { background: var(--dx-navy); border-color: var(--dx-navy); color: #fff; }
.pv-fo__body { flex: 1; display: grid; align-content: start; gap: 10px; padding: 12px; border-radius: 14px; background: #fff; border: 1px solid var(--dx-line); min-height: 170px; }
.pv-fo__fields { display: grid; gap: 9px; }
.pv-fo__draft { display: flex; align-items: center; gap: 5px; margin: 0; font-size: 9.5px; color: #7a5a26; }
.pv-fo__draft svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
.pv-fo__done { display: grid; justify-items: center; gap: 4px; padding: 18px 0; text-align: center; }
.pv-fo__done-ico { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: var(--dx-gold-soft); color: #7a5a26; margin-bottom: 4px; }
.pv-fo__done-ico svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linejoin: round; }
.pv-fo__done b { font-size: 13px; font-weight: 500; color: var(--dx-navy); }
.pv-fo__done small { font-size: 10px; color: var(--dx-muted); }
.pv-fo__nav { display: grid; grid-template-columns: 1fr 1.5fr; gap: 8px; }
.is-sticky .pv-fo__nav { position: sticky; bottom: 0; padding: 10px 0 0; background: linear-gradient(transparent, #f6f8fa 30%); }
.pv-fo__nav button { padding: 10px; border: 0; border-radius: 10px; background: var(--dx-navy); color: #fff; font: inherit; font-size: 11.5px; cursor: pointer; }
.pv-fo__nav button:disabled { opacity: .45; cursor: default; }
.pv-fo__nav .is-ghost { background: #eef2f5; color: var(--dx-ink); }
.pv-slide-enter-active, .pv-slide-leave-active { transition: transform .35s cubic-bezier(.2, .8, .2, 1), opacity .35s; }
.pv-slide-enter-from { transform: translateX(16px); opacity: 0; }
.pv-slide-leave-to { transform: translateX(-16px); opacity: 0; }
</style>
