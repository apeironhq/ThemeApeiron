<script setup lang="ts">
/**
 * Pencarian cepat (Ctrl+K / ⌘K / "/"): widget, nama pengaturan, grup Gaya, dan masalah umum.
 * Indeks dibuat sekali dari data/docs.ts, pencarian berjalan sepenuhnya di browser.
 */
import { docs } from '~/data/docs'

const open = defineModel<boolean>('open', { default: false })
const q = ref('')
const active = ref(0)
const input = ref<HTMLInputElement | null>(null)
const list = ref<HTMLElement | null>(null)

interface Entry { kind: string; title: string; sub: string; to: string; icon: string; hay: string }

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const index: Entry[] = docs.flatMap((d) => {
  const base = `/docs/${d.slug}`
  const rows: Entry[] = [{ kind: 'Widget', title: d.title, sub: d.tagline, to: base, icon: d.key, hay: norm(`${d.title} ${d.tagline}`) }]
  for (const f of d.features ?? []) rows.push({ kind: 'Fitur', title: f.title, sub: `${d.title} › ${f.text}`, to: `${base}#fitur`, icon: d.key, hay: norm(`${f.title} ${f.text} ${d.title} fitur`) })
  for (const g of d.content) {
    for (const [label, desc] of g.items) {
      rows.push({ kind: 'Pengaturan', title: label, sub: `${d.title} › ${g.title}`, to: `${base}?c=${encodeURIComponent(label)}#pengaturan`, icon: d.key, hay: norm(`${label} ${desc} ${d.title} ${g.title}`) })
    }
  }
  for (const s of d.style) rows.push({ kind: 'Gaya', title: s, sub: `${d.title} › tab Gaya`, to: `${base}?tab=gaya#pengaturan`, icon: d.key, hay: norm(`${s} gaya style ${d.title}`) })
  for (const t of d.tips) rows.push({ kind: 'Masalah', title: t.q, sub: d.title, to: `${base}#masalah`, icon: d.key, hay: norm(`${t.q} ${t.a} ${d.title}`) })
  return rows
})

const results = computed(() => {
  const terms = norm(q.value.trim()).split(/\s+/).filter(Boolean)
  if (!terms.length) return index.filter((e) => e.kind === 'Widget')
  const scored: { e: Entry; s: number }[] = []
  for (const e of index) {
    if (!terms.every((t) => e.hay.includes(t))) continue
    const title = norm(e.title)
    let s = e.kind === 'Widget' ? 30 : e.kind === 'Pengaturan' || e.kind === 'Fitur' ? 10 : 5
    for (const t of terms) s += title.startsWith(t) ? 20 : title.includes(t) ? 10 : 0
    scored.push({ e, s })
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, 40).map((x) => x.e)
})

watch(results, () => (active.value = 0))
watch(open, async (v) => {
  document.documentElement.classList.toggle('dx-lock', v)
  if (v) {
    q.value = ''
    await nextTick()
    input.value?.focus()
  }
})

function go(e?: Entry) {
  if (!e) return
  open.value = false
  navigateTo(e.to)
}

function onKey(ev: KeyboardEvent) {
  if (ev.key === 'Escape') open.value = false
  else if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
    ev.preventDefault()
    const n = results.value.length
    if (!n) return
    active.value = (active.value + (ev.key === 'ArrowDown' ? 1 : -1) + n) % n
    nextTick(() => list.value?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' }))
  } else if (ev.key === 'Enter') go(results.value[active.value])
}

// Sorot bagian judul yang cocok dengan kata kunci.
function mark(text: string) {
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
  const terms = q.value.trim().split(/\s+/).filter((t) => t.length > 1)
  if (!terms.length) return esc(text)
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return esc(text).replace(re, '<mark>$1</mark>')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dx-modal">
      <div v-if="open" class="dx-search" role="dialog" aria-modal="true" aria-label="Cari dokumentasi" @click.self="open = false" @keydown="onKey">
        <div class="dx-search__panel">
          <label class="dx-search__field">
            <ApIcon name="search" />
            <input ref="input" v-model="q" type="search" placeholder="Cari widget, fitur, pengaturan, atau masalah…" autocomplete="off" spellcheck="false">
            <kbd @click="open = false">Esc</kbd>
          </label>

          <div ref="list" class="dx-search__list">
            <p v-if="!q" class="dx-search__hint">Semua widget</p>
            <button
              v-for="(e, i) in results" :key="e.to + e.title" type="button" class="dx-search__item" :class="{ 'is-active': i === active }"
              @mousemove="active = i" @click="go(e)"
            >
              <span class="dx-search__ico"><DocsIcon :k="e.icon" /></span>
              <span class="dx-search__txt">
                <b v-html="mark(e.title)" />
                <small>{{ e.sub }}</small>
              </span>
              <span class="dx-search__kind">{{ e.kind }}</span>
            </button>
            <p v-if="q && !results.length" class="dx-search__empty">Tidak ada hasil untuk “{{ q }}”. Coba kata lain, misalnya “warna”, “WhatsApp”, atau “tamu”.</p>
          </div>

          <div class="dx-search__foot">
            <span><kbd>↑</kbd><kbd>↓</kbd> pilih</span>
            <span><kbd>Enter</kbd> buka</span>
            <span><kbd>Esc</kbd> tutup</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
