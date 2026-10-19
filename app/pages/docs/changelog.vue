<script setup lang="ts">
/**
 * Changelog: riwayat rilis ApeironKit (data/changelog.ts).
 * Kartu rilis terbaru di atas, filter jenis perubahan, lalu timeline per versi yang
 * garisnya terisi mengikuti gulir; titik versi "pop" dan isi kartu muncul bergantian.
 */
import { releases, latest, changeTypes, releaseId, releaseDate, type ChangeType } from '~/data/changelog'
import { docs } from '~/data/docs'
import { loadDocsGsap, prefersReducedMotion } from '~/composables/useDocsGsap'
import { useDocsInk } from '~/composables/useDocsInk'

definePageMeta({ layout: 'docs', pageTransition: { name: 'dx-page', mode: 'out-in' } })
useSeoMeta({
  title: 'Changelog · Dokumentasi ApeironKit',
  description: `Riwayat pembaruan ApeironKit: widget baru, peningkatan fitur, perbaikan, dan performa. Versi terbaru v${latest.version}.`,
})

const order: ChangeType[] = ['baru', 'peningkatan', 'perbaikan', 'performa']
const filter = ref<ChangeType | 'semua'>('semua')
const tabs = computed(() => [
  { key: 'semua' as const, label: 'Semua', n: releases.reduce((a, r) => a + r.changes.length, 0) },
  ...order.map((t) => ({ key: t, label: t === 'baru' ? 'Baru' : changeTypes[t].label, n: releases.reduce((a, r) => a + r.changes.filter((c) => c.type === t).length, 0) })),
].filter((t) => t.n > 0))

const widgetOf = (slug?: string) => (slug ? docs.find((d) => d.slug === slug) : undefined)
const groupsOf = (r: (typeof releases)[number]) =>
  order
    .filter((t) => filter.value === 'semua' || filter.value === t)
    .map((t) => ({ type: t, meta: changeTypes[t], items: r.changes.filter((c) => c.type === t) }))
    .filter((g) => g.items.length)
const shown = computed(() => releases.filter((r) => groupsOf(r).length))

const latestCounts = order.map((t) => ({ type: t, meta: changeTypes[t], n: latest.changes.filter((c) => c.type === t).length })).filter((x) => x.n)

const root = ref<HTMLElement | null>(null)
const seg = ref<HTMLElement | null>(null)
useDocsInk(seg, () => filter.value)
let ctx: { revert: () => void } | null = null
let busy = false
// Animasi masuk per rilis (dipicu gulir); diselesaikan dulu saat filter diganti.
let reveals: { progress: (v: number) => unknown; scrollTrigger?: { kill: () => void } }[] = []

// Ganti filter: timeline memudar keluar, isi berganti, lalu poin-poin masuk bergantian.
async function setFilter(k: ChangeType | 'semua') {
  if (k === filter.value || busy) return
  const list = root.value?.querySelector<HTMLElement>('[data-cl-list]')
  if (!list || prefersReducedMotion()) { filter.value = k; return }
  busy = true
  const { gsap, ScrollTrigger } = await loadDocsGsap()
  reveals.forEach((t) => { t.scrollTrigger?.kill(); t.progress(1) })
  reveals = []
  await gsap.to(list, { opacity: 0, y: 10, duration: 0.18, ease: 'power2.in' })
  filter.value = k
  await nextTick()
  gsap.set(list, { opacity: 1, y: 0 })
  gsap.fromTo(list.querySelectorAll('.dx-cl__card, .dx-cl__node'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power3.out', clearProps: 'opacity,transform' })
  gsap.fromTo(list.querySelectorAll('.dx-cl__change'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.025, delay: 0.1, clearProps: 'opacity,transform' })
  ScrollTrigger.refresh()
  busy = false
}

onMounted(async () => {
  const { gsap, ScrollTrigger } = await loadDocsGsap()
  if (location.hash) document.querySelector(location.hash)?.scrollIntoView({ block: 'start' })
  if (prefersReducedMotion() || !root.value) return
  ctx = gsap.context(() => {
    const tl = gsap.timeline()
    tl.from('[data-cl-fade]', { y: 12, opacity: 0, duration: 0.5, stagger: 0.06 })
      .from('[data-cl-hero]', { y: 20, opacity: 0, scale: 0.98, duration: 0.6 }, '-=0.3')
      .from('[data-cl-digit]', { yPercent: 110, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'back.out(2)' }, '-=0.35')
      .from('[data-cl-hero-fade]', { y: 10, opacity: 0, duration: 0.45, stagger: 0.06 }, '-=0.4')
      .from('[data-cl-stat]', { y: 14, opacity: 0, duration: 0.45, stagger: 0.07 }, '-=0.35')
    gsap.utils.toArray<HTMLElement>('[data-cl-count]').forEach((el) => {
      const o = { v: 0 }
      tl.to(o, { v: Number(el.dataset.clCount), duration: 0.9, ease: 'power2.out', onUpdate: () => (el.textContent = String(Math.round(o.v))) }, '<0.05')
    })

    // Garis timeline terisi mengikuti gulir.
    gsap.fromTo('[data-cl-fill]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-cl-list]', start: 'top 70%', end: 'clamp(bottom 70%)', scrub: 0.4 } })

    // Tiap rilis: titik versi pop, kartu masuk dari kanan, poin muncul bergantian.
    gsap.utils.toArray<HTMLElement>('.dx-cl__item').forEach((item) => {
      const t = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 82%', once: true } })
      reveals.push(t)
      t.from(item.querySelector('.dx-cl__node'), { scale: 0, duration: 0.5, ease: 'back.out(3)' })
        .fromTo(item.querySelector('.dx-cl__pulse'), { scale: 0.6, opacity: 0.8 }, { scale: 2.4, opacity: 0, duration: 0.8, ease: 'power2.out' }, '<0.1')
        .from(item.querySelector('.dx-cl__card'), { x: 24, opacity: 0, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,transform' }, '<')
        .from(item.querySelectorAll('.dx-cl__change'), { x: -10, opacity: 0, duration: 0.4, stagger: 0.04, clearProps: 'opacity,transform' }, '-=0.35')
    })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div ref="root" class="dx-page">
    <div class="dx-pagehead" data-cl-fade>
      <div>
        <h1>Changelog</h1>
        <p class="dx-caption">Semua pembaruan ApeironKit: widget baru, peningkatan fitur, perbaikan, dan performa.</p>
      </div>
      <span class="dx-badge dx-badge--brand"><ApIcon name="refresh" /> Versi terbaru v{{ latest.version }}</span>
    </div>

    <!-- Rilis terbaru -->
    <section class="dx-card dx-clhero" data-cl-hero>
      <div class="dx-clhero__main">
        <span class="dx-clhero__eyebrow" data-cl-hero-fade>Rilis terbaru · {{ releaseDate(latest.date, true) }}</span>
        <p class="dx-clhero__version" :aria-label="`Versi ${latest.version}`">
          <span class="dx-clhero__v" aria-hidden="true">v</span>
          <span v-for="(ch, i) in latest.version.split('')" :key="i" class="dx-clhero__digit" aria-hidden="true"><span data-cl-digit>{{ ch }}</span></span>
        </p>
        <h2 data-cl-hero-fade>{{ latest.title }}</h2>
        <p class="dx-caption" data-cl-hero-fade>{{ latest.summary }}</p>
        <a :href="`#${releaseId(latest.version)}`" class="dx-btn dx-btn--secondary dx-btn--sm" data-cl-hero-fade><ApIcon name="arrow" /> Lihat detail rilis</a>
      </div>
      <div class="dx-clhero__side">
        <div v-for="x in latestCounts" :key="x.type" class="dx-clstat" data-cl-stat>
          <span class="dx-tint" :class="`dx-tint--${x.meta.tone}`"><ApIcon :name="x.meta.icon" /></span>
          <span><b :data-cl-count="x.n">{{ x.n }}</b><small>{{ x.meta.label }}</small></span>
        </div>
        <p class="dx-clhero__how" data-cl-stat><ApIcon name="plug" /> Versi baru muncul otomatis di Dashboard WordPress › Plugin. Klik <b>Perbarui sekarang</b>, pengaturan widget tetap aman.</p>
      </div>
    </section>

    <!-- Filter -->
    <div class="dx-sectionhead" data-cl-fade>
      <div>
        <h2>Riwayat rilis</h2>
        <p class="dx-caption">{{ releases.length }} rilis, terbaru di atas.</p>
      </div>
      <div ref="seg" class="dx-seg has-ink" role="tablist" aria-label="Filter jenis perubahan">
        <i class="dx-ink" aria-hidden="true"></i>
        <button v-for="t in tabs" :key="t.key" type="button" role="tab" :class="{ 'is-on': filter === t.key }" :aria-selected="filter === t.key" @click="setFilter(t.key)">
          {{ t.label }} <span>{{ t.n }}</span>
        </button>
      </div>
    </div>

    <!-- Timeline -->
    <ol class="dx-cl" data-cl-list>
      <i class="dx-cl__rail" aria-hidden="true"><i data-cl-fill></i></i>
      <li v-for="(r, ri) in shown" :id="releaseId(r.version)" :key="r.version" class="dx-cl__item">
        <span class="dx-cl__node" :class="{ 'is-latest': ri === 0 && filter === 'semua' }" aria-hidden="true"><i class="dx-cl__pulse"></i></span>
        <article class="dx-card dx-cl__card">
          <header class="dx-cl__head">
            <span class="dx-cl__ver">v{{ r.version }}</span>
            <div class="dx-cl__titles">
              <h3>{{ r.title }}</h3>
              <time class="dx-caption" :datetime="r.date">{{ releaseDate(r.date, true) }}</time>
            </div>
            <span v-if="r.version === latest.version" class="dx-badge dx-badge--gold">Terbaru</span>
          </header>
          <p class="dx-cl__summary">{{ r.summary }}</p>
          <div v-for="g in groupsOf(r)" :key="g.type" class="dx-cl__group">
            <p class="dx-cl__glabel"><span class="dx-tint" :class="`dx-tint--${g.meta.tone}`"><ApIcon :name="g.meta.icon" /></span>{{ g.meta.label }}<span class="dx-cl__gcount">{{ g.items.length }}</span></p>
            <ul>
              <li v-for="c in g.items" :key="c.text" class="dx-cl__change">
                <span class="dx-cl__text">{{ c.text }}</span>
                <NuxtLink v-if="widgetOf(c.widget)" :to="`/docs/${c.widget}`" class="dx-cl__widget">
                  <DocsIcon :k="widgetOf(c.widget)!.key" /> {{ widgetOf(c.widget)!.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </article>
      </li>
    </ol>
  </div>
</template>
