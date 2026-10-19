<script setup lang="ts">
// Pratinjau Manajemen Tamu: nama tamu → link pribadi ?to= dan pesan dari template ucapan.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const templates: Record<string, string> = {
  Formal: 'Tanpa mengurangi rasa hormat, perkenankan kami mengundang *[nama]* untuk menghadiri acara kami.\n\n[link-undangan]',
  Muslim: 'Assalamualaikum Warahmatullahi Wabarakatuh. Perkenankan kami mengundang *[nama]* untuk menghadiri acara kami.\n\n[link-undangan]',
}
const rows = computed(() =>
  String(props.s.names || '').split('\n').map((n) => n.trim()).filter(Boolean).slice(0, 5)
    .map((name) => ({ name, url: `${String(props.s.link || '').replace(/\/$/, '')}?to=${encodeURIComponent(name)}` })),
)
const open = ref<number | null>(null)
const copied = ref<number | null>(null)
const msg = computed(() => {
  const r = open.value === null ? null : rows.value[open.value]
  return r ? (templates[props.s.tpl] ?? templates.Formal!).replace('[nama]', r.name).replace('[link-undangan]', r.url) : ''
})
function copy(i: number) { copied.value = i; setTimeout(() => copied.value === i && (copied.value = null), 1400) }
watch(() => props.focus, (f) => { open.value = f === 'template' && rows.value.length ? 0 : null })
</script>

<template>
  <div class="pv pv-gm">
    <div class="pv-gm__form" data-f="form">
      <b class="pv-gm__title">Kirim Undangan</b>
      <label class="pv-field"><small>Link Undangan</small><input v-model="s.link" type="text"></label>
      <label class="pv-field" data-f="names"><small>Nama Tamu</small><textarea v-model="s.names" rows="3"></textarea></label>
      <div class="pv-field" data-f="template">
        <small>Template Ucapan</small>
        <div class="pv-gm__tpl">
          <button v-for="k in ['Formal', 'Muslim']" :key="k" type="button" :class="{ 'is-on': s.tpl === k }" @click="s.tpl = k">{{ k }}</button>
        </div>
      </div>
    </div>

    <div class="pv-gm__table" data-f="share">
      <div class="pv-gm__th"><span>No</span><span>Nama</span><span>Aksi</span></div>
      <TransitionGroup name="pv-list">
        <div v-for="(r, i) in rows" :key="r.name" class="pv-gm__tr">
          <span>{{ i + 1 }}</span>
          <span class="pv-gm__name"><b>{{ r.name }}</b><small>?to={{ encodeURIComponent(r.name) }}</small></span>
          <span class="pv-gm__act">
            <button type="button" :aria-label="`Salin link ${r.name}`" @click="copy(i)">
              <svg v-if="copied === i" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              <svg v-else viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>
            </button>
            <button type="button" class="is-send" :aria-label="`Kirim ke ${r.name}`" @click="open = i"><svg viewBox="0 0 24 24"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" /></svg></button>
          </span>
        </div>
      </TransitionGroup>
    </div>

    <Transition name="pv-pop">
      <div v-if="open !== null" class="pv-gm__modal" @click.self="open = null">
        <div class="pv-gm__sheet">
          <small>Pesan untuk {{ rows[open]?.name }}</small>
          <p>{{ msg }}</p>
          <button type="button" @click="open = null">Kirim via WhatsApp</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pv-gm { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 14px 12px; background: #f6f8fa; overflow: hidden; }
.pv-gm__form { display: grid; gap: 8px; padding: 12px; border-radius: 14px; background: #fff; border: 1px solid var(--dx-line); }
.pv-gm__title { font-size: 14px; font-weight: 500; color: var(--dx-navy); }
.pv-gm textarea { resize: none; }
.pv-gm__tpl { display: flex; gap: 6px; }
.pv-gm__tpl button { flex: 1; padding: 6px; border-radius: 8px; border: 1px solid var(--dx-line); background: #fff; font: inherit; font-size: 10.5px; cursor: pointer; transition: background .25s, color .25s, border-color .25s; }
.pv-gm__tpl button.is-on { background: var(--dx-navy); border-color: var(--dx-navy); color: #fff; }
.pv-gm__table { border-radius: 12px; background: #fff; border: 1px solid var(--dx-line); overflow: hidden; }
.pv-gm__th, .pv-gm__tr { display: grid; grid-template-columns: 22px 1fr auto; align-items: center; gap: 6px; padding: 7px 10px; font-size: 10.5px; }
.pv-gm__th { background: var(--dx-navy-50); color: var(--dx-muted); font-size: 9.5px; }
.pv-gm__tr + .pv-gm__tr { border-top: 1px solid var(--dx-line); }
.pv-gm__name { min-width: 0; }
.pv-gm__name b { display: block; font-weight: 500; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pv-gm__name small { display: block; font-size: 9px; color: var(--dx-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pv-gm__act { display: flex; gap: 4px; }
.pv-gm__act button { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; border: 1px solid var(--dx-line); background: #fff; color: var(--dx-navy); cursor: pointer; }
.pv-gm__act button.is-send { background: var(--dx-navy); border-color: var(--dx-navy); color: #fff; }
.pv-gm__act svg { width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.pv-gm__modal { position: absolute; inset: 0; display: flex; align-items: flex-end; background: rgba(4, 38, 58, .35); }
.pv-gm__sheet { width: 100%; display: grid; gap: 8px; padding: 14px; border-radius: 18px 18px 0 0; background: #fff; }
.pv-gm__sheet small { font-size: 10px; color: var(--dx-muted); }
.pv-gm__sheet p { margin: 0; padding: 10px; border-radius: 10px; background: #eef4f7; font-size: 10.5px; line-height: 1.5; white-space: pre-line; word-break: break-all; }
.pv-gm__sheet button { padding: 9px; border: 0; border-radius: 10px; background: var(--dx-navy); color: #fff; font: inherit; font-size: 11.5px; cursor: pointer; }
.pv-list-enter-active, .pv-list-leave-active { transition: transform .4s cubic-bezier(.2, .8, .2, 1), opacity .4s; }
.pv-list-enter-from, .pv-list-leave-to { transform: translateX(-10px); opacity: 0; }
.pv-pop-enter-active, .pv-pop-leave-active { transition: background .35s; }
.pv-pop-enter-active .pv-gm__sheet, .pv-pop-leave-active .pv-gm__sheet { transition: transform .45s cubic-bezier(.2, .8, .2, 1); }
.pv-pop-enter-from, .pv-pop-leave-to { background: transparent; }
.pv-pop-enter-from .pv-gm__sheet, .pv-pop-leave-to .pv-gm__sheet { transform: translateY(100%); }
</style>
