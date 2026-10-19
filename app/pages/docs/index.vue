<script setup lang="ts">
/**
 * Beranda dokumentasi (gaya dashboard MDUNDIG): angka ringkas, mulai cepat,
 * dan kartu semua widget dengan filter kategori (transisi GSAP Flip).
 */
import { docs, categories, type DocCategory } from '~/data/docs'
import { loadDocsGsap, prefersReducedMotion } from '~/composables/useDocsGsap'
import { useDocsInk } from '~/composables/useDocsInk'
import { latest } from '~/data/changelog'

definePageMeta({ layout: 'docs', pageTransition: { name: 'dx-page', mode: 'out-in' } })
useSeoMeta({
  title: 'Dokumentasi Widget · ApeironKit',
  description: 'Panduan semua widget ApeironKit untuk Elementor: fitur, kelebihan, batasan, cara pakai, dan penjelasan setiap pengaturan.',
})

const searchOpen = useState('dx-search', () => false)
const filter = ref<DocCategory | 'semua'>('semua')
// Tab aktif berubah seketika saat diklik; filter kartu menyusul setelah animasi keluar.
const tabOn = ref<DocCategory | 'semua'>('semua')
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
useDocsInk(seg, () => tabOn.value)
let ctx: { revert: () => void } | null = null
let api: Awaited<ReturnType<typeof loadDocsGsap>> | null = null
let flipTl: { progress: (v: number) => unknown } | null = null
let seq = 0

async function setFilter(k: DocCategory | 'semua') {
  if (k === tabOn.value) return
  tabOn.value = k
  const cards = root.value?.querySelectorAll('[data-dx-card]')
  if (!api || !cards || prefersReducedMotion()) { filter.value = k; return }
  const { gsap, Flip } = api
  // Klik beruntun: selesaikan animasi sebelumnya dulu agar posisi kartu bersih.
  flipTl?.progress(1)
  const grid = root.value!.querySelector<HTMLElement>('.dx-grid')!
  gsap.killTweensOf(grid)
  gsap.set(grid, { clearProps: 'height' })
  const h0 = grid.offsetHeight
  const list = Array.from(cards) as HTMLElement[]
  const willShow = (el: HTMLElement) => k === 'semua' || docs.find((d) => d.slug === el.dataset.flipId)?.cat === k
  const my = ++seq
  // Kartu yang tetap tampil dipulihkan (bisa sedang memudar karena klik sebelumnya).
  gsap.killTweensOf(list)
  gsap.set(list.filter(willShow), { clearProps: 'opacity,scale,transform' })

  // 1) Kartu yang akan hilang memudar dulu, di tempatnya.
  const leaving = list.filter((el) => el.style.display !== 'none' && !willShow(el))
  if (leaving.length) await gsap.to(leaving, { opacity: 0, scale: 0.94, duration: 0.2, ease: 'power2.in' })
  if (my !== seq) return // ada klik yang lebih baru

  // 2) Sisanya berpindah dengan Flip. Selama Flip kartu dibuat absolute, jadi tinggi
  //    grid dikunci agar footer tidak ikut naik dan menabrak kartu.
  const state = Flip.getState(list)
  filter.value = k
  await nextTick()
  const h1 = grid.offsetHeight
  gsap.set(grid, { height: Math.max(h0, h1) })
  flipTl = Flip.from(state, {
    duration: 0.5, ease: 'power3.inOut', absolute: true, scale: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.4, delay: 0.1 }),
    // 3) Setelah kartu diam, tinggi grid menyesuaikan dengan halus.
    onComplete: () => {
      gsap.set(leaving, { clearProps: 'opacity,scale,transform' })
      gsap.to(grid, { height: h1, duration: 0.35, ease: 'power2.inOut', onComplete: () => gsap.set(grid, { clearProps: 'height' }) })
    },
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
    gsap.from('[data-dx-quick] .dx-flight__txt', { y: 14, opacity: 0, stagger: 0.1, duration: 0.5, scrollTrigger: { trigger: '[data-dx-quick]', start: 'top 88%' } })
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
        <p class="dx-caption">Fitur, kelebihan, batasan, cara pakai, dan semua pengaturan widget ApeironKit.</p>
      </div>
      <div class="dx-pagehead__actions">
        <NuxtLink to="/docs/changelog" class="dx-release">
          <span class="dx-release__dot" aria-hidden="true"></span>
          <b>v{{ latest.version }}</b><span class="dx-release__txt">{{ latest.title }}</span><ApIcon name="arrow" />
        </NuxtLink>
        <button type="button" class="dx-btn dx-btn--secondary" @click="searchOpen = true"><ApIcon name="search" /> Cari pengaturan</button>
      </div>
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
      <DocsFlight :steps="quick" data-dx-quick />
    </section>

    <section id="widget" class="dx-page">
      <div class="dx-sectionhead">
        <div>
          <h2>Semua widget</h2>
          <p class="dx-caption">Pilih widget untuk melihat fitur dan cara memakainya.</p>
        </div>
        <div ref="seg" class="dx-seg has-ink" role="tablist" aria-label="Filter kategori">
          <i class="dx-ink" aria-hidden="true"></i>
          <button
            v-for="c in categories" :key="c.key" type="button" role="tab" :class="{ 'is-on': tabOn === c.key }"
            :aria-selected="tabOn === c.key" @click="setFilter(c.key)"
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
