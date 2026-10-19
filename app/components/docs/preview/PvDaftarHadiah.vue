<script setup lang="ts">
// Pratinjau Daftar Hadiah: pilih hadiah → isi formulir di popup → kapasitas berkurang & tercatat di MDUNDIG.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const gifts = reactive([
  { name: 'Set Panci Keramik', cat: 'Dapur', left: 2, total: 2, tone: 'a' },
  { name: 'Rice Cooker Digital', cat: 'Dapur', left: 1, total: 1, tone: 'b' },
  { name: 'Sprei Katun Premium', cat: 'Kamar', left: 3, total: 3, tone: 'c' },
  { name: 'Lampu Tidur Rotan', cat: 'Kamar', left: 2, total: 2, tone: 'd' },
])
const pick = ref<number | null>(null)
const guest = ref('Budi Santoso')
const toast = ref(false)
let t: ReturnType<typeof setTimeout> | undefined

function confirm() {
  const g = pick.value === null ? null : gifts[pick.value]
  if (g && g.left > 0) g.left--
  pick.value = null
  toast.value = true
  clearTimeout(t)
  t = setTimeout(() => (toast.value = false), 2200)
}
// Langkah "tamu mereservasi" membuka popup sebagai contoh.
watch(() => props.focus, (f) => { if (f === 'reserve') setTimeout(() => (pick.value = 0), 300); else pick.value = null })
onBeforeUnmount(() => clearTimeout(t))
</script>

<template>
  <div class="pv pv-dh">
    <div class="pv-dh__head">
      <b>Hadiah Pernikahan</b>
      <span class="pv-dh__conn" data-f="connect"><i></i>Terhubung ke MDUNDIG</span>
    </div>

    <div class="pv-dh__grid" :class="[`cols-${s.cols}`, { 'is-h': s.layout === 'Horizontal' }]" data-f="grid items">
      <article v-for="(g, i) in gifts" :key="g.name" class="pv-dh__card" :class="{ 'is-out': g.left === 0 }">
        <span class="pv-dh__img" :class="`tone-${g.tone}`" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0" /></svg>
        </span>
        <div class="pv-dh__body">
          <small>{{ g.cat }}</small>
          <b>{{ g.name }}</b>
          <span class="pv-dh__left">{{ g.left ? `Tersisa ${g.left} dari ${g.total}` : 'Sudah direservasi' }}</span>
          <button type="button" :disabled="!g.left" data-f="reserve" @click="pick = i">{{ g.left ? 'Pilih Hadiah' : 'Penuh' }}</button>
        </div>
      </article>
    </div>

    <Transition name="pv-pop">
      <div v-if="pick !== null" class="pv-dh__modal" @click.self="pick = null">
        <div class="pv-dh__sheet" data-f="reserve">
          <b>{{ gifts[pick]!.name }}</b>
          <small>Isi nama untuk mereservasi hadiah ini</small>
          <label class="pv-field"><small>Nama pengirim</small><input v-model="guest" type="text"></label>
          <div class="pv-dh__actions">
            <button type="button" class="is-ghost" @click="pick = null">Batal</button>
            <button type="button" @click="confirm">Konfirmasi</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="pv-fade">
      <div v-if="toast" class="pv-dh__toast">Reservasi tercatat di MDUNDIG</div>
    </Transition>
  </div>
</template>

<style scoped>
.pv-dh { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 14px 12px; background: #f6f8fa; overflow: hidden; }
.pv-dh__head { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.pv-dh__head b { font-size: 14px; font-weight: 500; color: var(--dx-navy); }
.pv-dh__conn { display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 999px; background: var(--dx-gold-soft); color: #7a5a26; font-size: 9.5px; }
.pv-dh__conn i { width: 6px; height: 6px; border-radius: 50%; background: var(--dx-sand); animation: pv-blink 1.6s ease-in-out infinite; }
@keyframes pv-blink { 50% { opacity: .3; } }
.pv-dh__grid { display: grid; gap: 8px; border-radius: 12px; }
.pv-dh__grid.cols-2 { grid-template-columns: 1fr 1fr; }
.pv-dh__card { display: flex; flex-direction: column; border-radius: 12px; background: #fff; border: 1px solid var(--dx-line); overflow: hidden; transition: opacity .3s; }
.pv-dh__grid.is-h .pv-dh__card { flex-direction: row; }
.pv-dh__card.is-out { opacity: .6; }
.pv-dh__img { display: grid; place-items: center; height: 64px; color: rgba(8, 60, 87, .45); }
.pv-dh__grid.is-h .pv-dh__img { width: 64px; height: auto; flex: none; }
.cols-1:not(.is-h) .pv-dh__img { height: 84px; }
.pv-dh__img svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.5; }
.tone-a { background: linear-gradient(140deg, #efe2cb, #f7efe1); }
.tone-b { background: linear-gradient(140deg, #dbe9f0, #eef5f8); }
.tone-c { background: linear-gradient(140deg, #f3ead8, #fbf6ec); }
.tone-d { background: linear-gradient(140deg, #e3edf2, #f4f8fa); }
.pv-dh__body { display: grid; gap: 2px; padding: 8px; min-width: 0; }
.pv-dh__body small { font-size: 9px; color: var(--dx-muted); text-transform: uppercase; letter-spacing: .08em; }
.pv-dh__body b { font-size: 11px; font-weight: 500; line-height: 1.3; }
.pv-dh__left { font-size: 9.5px; color: #7a5a26; }
.pv-dh__body button { margin-top: 4px; padding: 6px; border: 0; border-radius: 8px; background: var(--dx-navy); color: #fff; font: inherit; font-size: 10px; cursor: pointer; }
.pv-dh__body button:disabled { background: #e3eaef; color: var(--dx-muted); cursor: default; }
.pv-dh__modal { position: absolute; inset: 0; display: flex; align-items: flex-end; background: rgba(4, 38, 58, .35); }
.pv-dh__sheet { width: 100%; display: grid; gap: 8px; padding: 16px 14px 18px; border-radius: 18px 18px 0 0; background: #fff; }
.pv-dh__sheet > b { font-size: 14px; font-weight: 500; color: var(--dx-navy); }
.pv-dh__sheet > small { font-size: 10.5px; color: var(--dx-muted); }
.pv-dh__actions { display: grid; grid-template-columns: 1fr 1.4fr; gap: 6px; }
.pv-dh__actions button { padding: 9px; border-radius: 10px; border: 0; background: var(--dx-navy); color: #fff; font: inherit; font-size: 11.5px; cursor: pointer; }
.pv-dh__actions .is-ghost { background: #eef2f5; color: var(--dx-ink); }
.pv-dh__toast { position: absolute; left: 12px; right: 12px; bottom: 14px; padding: 10px 12px; border-radius: 12px; background: var(--dx-navy); color: #fff; font-size: 11px; text-align: center; }
.pv-pop-enter-active, .pv-pop-leave-active { transition: background .35s; }
.pv-pop-enter-active .pv-dh__sheet, .pv-pop-leave-active .pv-dh__sheet { transition: transform .45s cubic-bezier(.2, .8, .2, 1); }
.pv-pop-enter-from, .pv-pop-leave-to { background: transparent; }
.pv-pop-enter-from .pv-dh__sheet, .pv-pop-leave-to .pv-dh__sheet { transform: translateY(100%); }
</style>
