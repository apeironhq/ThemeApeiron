<script setup lang="ts">
/**
 * Beranda dokumentasi (gaya dashboard MDUNDIG): angka ringkas, mulai cepat,
 * dan kartu 13 widget dengan filter kategori (transisi GSAP Flip).
 */
import { docs, categories, type DocCategory } from '~/data/docs'
import { loadDocsGsap, prefersReducedMotion } from '~/composables/useDocsGsap'
import { useDocsInk } from '~/composables/useDocsInk'

definePageMeta({ layout: 'docs', pageTransition: { name: 'dx-page', mode: 'out-in' } })
useSeoMeta({
  title: 'Dokumentasi Widget · ApeironKit',
  description: 'Panduan 13 widget ApeironKit untuk Elementor: fitur, kelebihan, batasan, cara pakai, dan penjelasan setiap pengaturan.',
})

const searchOpen = useState('dx-search', () => false)
const filter = ref<DocCategory | 'semua'>('semua')
const counts = computed(() => Object.fromEntries(categories.map((c) => [c.key, c.key === 'semua' ? docs.length : docs.filter((d) => d.cat === c.key).length])))
const catLabel = (k: string) => categories.find((c) => c.key === k)?.label ?? ''
const visible = (cat: DocCategory) => filter.value === 'semua' || filter.value === cat

const featureCount = docs.reduce((n, d) => n + (d.features?.length ?? 0), 0)
const controlCount = docs.reduce((n, d) => n + d.content.reduce((m, g) => m + g.items.length, 0), 0)
const stats = [
  { n: docs.length, label: 'Widget siap pakai', icon: 'layout', cap: '4 kategori kebutuhan' },
  { n: featureCount, label: 'Fitur terdokumentasi', icon: 'sparkle', cap: 'Lengkap dengan batasannya' },
  { n: controlCount, label: 'Pengaturan utama', icon: 'wrench', cap: 'Nama sama dengan Elementor' },
  { n: docs.filter((d) => d.mdundig).length, label: 'Terhubung ke MDUNDIG', icon: 'plug', cap: 'Daftar Hadiah & Form Order' },
]
const quick = [
  { icon: 'plug', title: 'Pasang plugin', text: 'Plugin › Tambah Baru › Unggah Plugin, pilih apeiron-kit.zip, lalu Aktifkan.' },
  { icon: 'key', title: 'Aktifkan lisensi', text: 'Menu ApeironKit › Lisensi, tempel kode dari email pembelian.' },
  { icon: 'cursor', title: 'Seret widget', text: 'Di editor Elementor, buka kategori ApeironKit dan seret widget ke halaman.' },
]

const root = ref<HTMLElement | null>(null)
const seg = ref<HTMLElement | null>(null)
useDocsInk(seg, () => filter.value)
let ctx: { revert: () => void } | null = null
let api: Awaited<ReturnType<typeof loadDocsGsap>> | null = null

async function setFilter(k: DocCategory | 'semua') {
  if (k === filter.value) return
  const cards = root.value?.querySelectorAll('[data-dx-card]')
  if (!api || !cards || prefersReducedMotion()) { filter.value = k; return }
  const { gsap, Flip } = api
  const state = Flip.getState(cards)
  filter.value = k
  await nextTick()
  Flip.from(state, {
    duration: 0.5, ease: 'power3.inOut', absolute: true, scale: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.4, delay: 0.08 }),
    onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.25 }),
  })
}

function wiggle(e: MouseEvent) {
  if (!api || prefersReducedMotion()) return
  api.gsap.fromTo((e.currentTarget as HTMLElement).querySelectorAll('.dx-wico > *'), { y: 2, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, overwrite: true })
}

onMounted(async () => {
  api = await loadDocsGsap()
  const { gsap, ScrollTrigger } = api
  if (prefersReducedMotion() || !root.value) return
  ctx = gsap.context(() => {
    const tl = gsap.timeline()
    tl.from('[data-dx-fade]', { y: 12, opacity: 0, duration: 0.5, stagger: 0.06 })
      .from('[data-dx-stat]', { y: 16, opacity: 0, duration: 0.5, stagger: 0.06 }, '-=0.3')
    gsap.utils.toArray<HTMLElement>('[data-dx-count]').forEach((el) => {
      const o = { v: 0 }
      tl.to(o, { v: Number(el.dataset.dxCount), duration: 1, ease: 'power2.out', onUpdate: () => (el.textContent = String(Math.round(o.v))) }, '<0.04')
    })
    gsap.from('[data-dx-quick] > *', { y: 16, opacity: 0, stagger: 0.08, duration: 0.5, scrollTrigger: { trigger: '[data-dx-quick]', start: 'top 88%' } })
    gsap.from('[data-dx-quick-line]', { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'power2.inOut', scrollTrigger: { trigger: '[data-dx-quick]', start: 'top 88%' } })
    ScrollTrigger.batch('[data-dx-card]', {
      start: 'top 94%', once: true,
      onEnter: (els) => gsap.from(els, { y: 22, opacity: 0, duration: 0.5, stagger: 0.04, clearProps: 'transform,opacity' }),
    })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div ref="root" class="dx-page">
    <div class="dx-pagehead" data-dx-fade>
      <div>
        <h1>Dokumentasi Widget</h1>
        <p class="dx-caption">Fitur, kelebihan, batasan, cara pakai, dan semua pengaturan 13 widget ApeironKit.</p>
      </div>
      <button type="button" class="dx-btn dx-btn--secondary" @click="searchOpen = true"><ApIcon name="search" /> Cari pengaturan</button>
    </div>

    <div class="dx-kpis">
      <div v-for="(s, i) in stats" :key="s.label" class="dx-card dx-kpi" data-dx-stat>
        <div class="dx-kpi__top">
          <span class="dx-tint" :class="`dx-tint--${i % 4}`"><ApIcon :name="s.icon" /></span>
          <span class="dx-kpi__label">{{ s.label }}</span>
        </div>
        <b class="dx-kpi__value" :data-dx-count="s.n">{{ s.n }}</b>
        <span class="dx-caption">{{ s.cap }}</span>
      </div>
    </div>

    <section class="dx-card">
      <div class="dx-card__head">
        <div>
          <h2>Mulai cepat</h2>
          <p class="dx-caption">Tiga langkah sebelum memakai widget mana pun.</p>
        </div>
      </div>
      <div class="dx-quick" data-dx-quick>
        <i class="dx-quick__line" data-dx-quick-line aria-hidden="true"></i>
        <div v-for="(q, i) in quick" :key="q.title" class="dx-quick__item">
          <span class="dx-quick__num">{{ i + 1 }}</span>
          <div>
            <b>{{ q.title }}</b>
            <p class="dx-caption">{{ q.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="widget" class="dx-card">
      <div class="dx-card__head">
        <div>
          <h2>Semua widget</h2>
          <p class="dx-caption">Pilih widget untuk melihat fitur dan cara memakainya.</p>
        </div>
        <div ref="seg" class="dx-seg has-ink" role="tablist" aria-label="Filter kategori">
          <i class="dx-ink" aria-hidden="true"></i>
          <button
            v-for="c in categories" :key="c.key" type="button" role="tab" :class="{ 'is-on': filter === c.key }"
            :aria-selected="filter === c.key" @click="setFilter(c.key)"
          >
            {{ c.label }} <span>{{ counts[c.key] }}</span>
          </button>
        </div>
      </div>

      <div class="dx-grid">
        <NuxtLink
          v-for="d in docs" v-show="visible(d.cat)" :key="d.slug" :to="`/docs/${d.slug}`" class="dx-wcard"
          :data-flip-id="d.slug" data-dx-card @mouseenter="wiggle"
        >
          <span class="dx-wcard__top">
            <span class="dx-tint dx-tint--0 dx-wcard__ico"><DocsIcon :k="d.key" /></span>
            <span class="dx-wcard__go" aria-hidden="true"><ApIcon name="arrow" /></span>
          </span>
          <b class="dx-wcard__title">{{ d.title }}</b>
          <span class="dx-wcard__text">{{ d.tagline }}</span>
          <span class="dx-wcard__meta">
            <span class="dx-badge dx-badge--dot">{{ catLabel(d.cat) }}</span>
            <span class="dx-badge"><ApIcon name="sparkle" /> {{ d.features?.length ?? 0 }} fitur</span>
            <span v-if="d.mdundig" class="dx-badge dx-badge--gold"><ApIcon name="plug" /> MDUNDIG</span>
          </span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
