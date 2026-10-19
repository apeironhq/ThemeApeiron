<script setup lang="ts">
// Pratinjau Ucapan Tamu: kirim ucapan baru, lengkap dengan badge kehadiran dan stiker.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

interface Item { id: number; name: string; text: string; attend: string; sticker: boolean; time: string }
const items = ref<Item[]>([
  { id: 1, name: 'Dimas', text: 'Barakallah, semoga lancar sampai hari H!', attend: 'Hadir', sticker: false, time: '5 menit lalu' },
  { id: 2, name: 'Laras', text: 'Ikut bahagia, maaf belum bisa datang ya.', attend: 'Tidak Hadir', sticker: true, time: '1 jam lalu' },
])
const summary = computed(() => ['Hadir', 'Tidak Hadir', 'Masih Ragu'].map((k) => ({ k, n: items.value.filter((i) => i.attend === k).length })))
let id = 3
function send() {
  if (!props.s.name || !props.s.message) return
  items.value.unshift({ id: id++, name: props.s.name, text: props.s.message, attend: props.s.attend, sticker: !!props.s.sticker, time: 'Baru saja' })
  if (items.value.length > 4) items.value.pop()
}
const initial = (n: string) => n.trim()[0]?.toUpperCase() ?? '?'
</script>

<template>
  <div class="pv pv-ut">
    <div class="pv-ut__form" data-f="form">
      <b class="pv-ut__title">Ucapan &amp; Doa</b>
      <div class="pv-ut__lock" data-f="lock">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
        Mengirim sebagai <b>{{ s.name || 'Tamu' }}</b> dari link ?to=
      </div>
      <textarea v-model="s.message" rows="2" aria-label="Ucapan"></textarea>
      <div class="pv-ut__row">
        <span class="pv-ut__sticker" :class="{ 'is-on': s.sticker }" data-f="sticker">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M9 14c1.5 1.5 4.5 1.5 6 0M9.5 10h.01M14.5 10h.01" /></svg>
          Stiker
        </span>
        <button type="button" class="pv-ut__send" @click="send">Kirim Ucapan</button>
      </div>
    </div>

    <div class="pv-ut__sum" data-f="list">
      <span v-for="x in summary" :key="x.k"><b>{{ x.n }}</b>{{ x.k }}</span>
    </div>

    <TransitionGroup name="pv-list" tag="ul" class="pv-ut__list" data-f="list">
      <li v-for="c in items" :key="c.id">
        <span class="pv-ut__av">{{ initial(c.name) }}</span>
        <div>
          <p class="pv-ut__meta"><b>{{ c.name }}</b><span class="pv-ut__badge" :class="`is-${c.attend === 'Hadir' ? 'yes' : c.attend === 'Tidak Hadir' ? 'no' : 'maybe'}`">{{ c.attend }}</span></p>
          <p class="pv-ut__text">{{ c.text }}</p>
          <span v-if="c.sticker" class="pv-ut__stk" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M20 33s-11-6.8-11-15.2A6.3 6.3 0 0 1 20 14a6.3 6.3 0 0 1 11 3.8C31 26.2 20 33 20 33z" /></svg></span>
          <small>{{ c.time }} · Balas</small>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.pv-ut { display: flex; flex-direction: column; gap: 10px; padding: 20px 22px; background: #fbf8f2; overflow: hidden; }
.pv-ut__form { display: grid; gap: 8px; padding: 12px; border-radius: 14px; background: #fff; border: 1px solid var(--dx-line); }
.pv-ut__title { font-size: 14px; font-weight: 500; color: var(--dx-navy); }
.pv-ut__lock { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 8px; background: var(--dx-navy-50); font-size: 10px; color: var(--dx-muted); }
.pv-ut__lock b { font-weight: 500; color: var(--dx-navy); }
.pv-ut__lock svg { width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 1.6; flex: none; }
.pv-ut textarea { width: 100%; resize: none; padding: 8px 10px; border-radius: 10px; border: 1px solid var(--dx-line); font: inherit; font-size: 11px; color: var(--dx-ink); background: #fff; }
.pv-ut__row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.pv-ut__sticker { display: inline-flex; align-items: center; gap: 5px; padding: 5px 9px; border-radius: 999px; border: 1px dashed var(--dx-line-strong); font-size: 10.5px; color: var(--dx-muted); }
.pv-ut__sticker.is-on { border-style: solid; border-color: var(--dx-sand); color: #7a5a26; background: var(--dx-gold-soft); }
.pv-ut__sticker svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
.pv-ut__send { padding: 7px 12px; border: 0; border-radius: 999px; background: var(--dx-navy); color: #fff; font: inherit; font-size: 11px; cursor: pointer; }
.pv-ut__sum { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; border-radius: 12px; }
.pv-ut__sum span { display: grid; justify-items: center; padding: 6px 4px; border-radius: 10px; background: #fff; border: 1px solid var(--dx-line); font-size: 9.5px; color: var(--dx-muted); }
.pv-ut__sum b { font-size: 15px; font-weight: 500; color: var(--dx-navy); }
.pv-ut__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; position: relative; border-radius: 12px; }
.pv-ut__list li { display: flex; gap: 8px; padding: 10px; border-radius: 12px; background: #fff; border: 1px solid var(--dx-line); }
.pv-ut__av { display: grid; place-items: center; flex: none; width: 28px; height: 28px; border-radius: 50%; background: var(--dx-navy-50); color: var(--dx-navy); font-size: 11px; font-weight: 500; }
.pv-ut__meta { display: flex; align-items: center; gap: 6px; margin: 0 0 2px; font-size: 11.5px; }
.pv-ut__meta b { font-weight: 500; }
.pv-ut__badge { padding: 1px 7px; border-radius: 999px; font-size: 9px; }
.pv-ut__badge.is-yes { background: var(--dx-gold-soft); color: #7a5a26; }
.pv-ut__badge.is-no { background: #eef2f5; color: var(--dx-muted); }
.pv-ut__badge.is-maybe { background: var(--dx-navy-50); color: var(--dx-navy); }
.pv-ut__text { margin: 0; font-size: 11px; line-height: 1.45; color: var(--dx-ink); }
.pv-ut__stk svg { width: 34px; height: 34px; margin-top: 4px; fill: #e7c9cf; stroke: #c98a95; stroke-width: 1.4; }
.pv-ut__list small { display: block; margin-top: 3px; font-size: 9.5px; color: var(--dx-muted); }
.pv-list-enter-active { transition: transform .5s cubic-bezier(.2, .8, .2, 1), opacity .5s; }
.pv-list-leave-active { transition: opacity .3s; position: absolute; }
.pv-list-move { transition: transform .5s cubic-bezier(.2, .8, .2, 1); }
.pv-list-enter-from { transform: translateY(-14px) scale(.97); opacity: 0; }
.pv-list-leave-to { opacity: 0; }
</style>
