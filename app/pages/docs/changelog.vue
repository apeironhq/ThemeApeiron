<script setup lang="ts">
/**
 * Changelog: riwayat rilis ApeironKit (data/changelog.ts).
 * Kartu rilis terbaru (versi bergulir ala odometer + tumpukan perubahan yang berganti sendiri),
 * filter jenis perubahan, lalu timeline per versi: garis terisi mengikuti gulir, titik versi
 * menyala saat dilewati, dan kartu "dipindai" garis tipis saat muncul.
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

type GsapApi = Awaited<ReturnType<typeof loadDocsGsap>>
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

const latestCounts = order
  .map((t) => ({ type: t, meta: changeTypes[t], n: latest.changes.filter((c) => c.type === t).length }))
  .filter((x) => x.n)
  .map((x) => ({ ...x, share: Math.round((x.n / latest.changes.length) * 100) }))
const maxCount = Math.max(...latestCounts.map((x) => x.n))
const versionChars = latest.version.split('')
const isDigit = (ch: string) => /\d/.test(ch)

// Tumpukan "yang baru": kartu teratas berganti tiap beberapa detik.
const stack = latest.changes.map((c) => ({ ...c, meta: changeTypes[c.type], w: widgetOf(c.widget) }))
const stackIdx = ref(0)
const pad = (n: number) => String(n).padStart(2, '0')
const STACK_MS = 3.4

const root = ref<HTMLElement | null>(null)
const seg = ref<HTMLElement | null>(null)
useDocsInk(seg, () => filter.value)
let api: GsapApi | null = null
let ctx: { revert: () => void } | null = null
let busy = false
// Animasi masuk per rilis (dipicu gulir); diselesaikan dulu saat filter diganti.
let reveals: { progress: (v: number) => unknown; scrollTrigger?: { kill: () => void } }[] = []
let nodeSts: { kill: () => void }[] = []
let timer: { pause: () => unknown; resume: () => unknown; kill: () => void } | null = null
let stackSt: { kill: () => void } | null = null
let hovering = false
let onScreen = true

function layoutStack(instant = false) {
  if (!api || !root.value) return
  const { gsap } = api
  const cards = gsap.utils.toArray<HTMLElement>('.dx-clstack__card', root.value)
  const n = cards.length
  cards.forEach((el, i) => {
    const rel = (i - stackIdx.value + n) % n
    const props = rel === n - 1
      ? { y: -30, scale: 1.02, opacity: 0, zIndex: 5 }
      : rel < 3
        ? { y: rel * 16, scale: 1 - rel * 0.04, opacity: 1 - rel * 0.3, zIndex: 4 - rel }
        : { y: 40, scale: 0.85, opacity: 0, zIndex: 0 }
    gsap.set(el, { zIndex: props.zIndex })
    if (instant || (rel > 3 && rel !== n - 1)) gsap.set(el, props)
    else gsap.to(el, { ...props, duration: 0.65, ease: 'power3.inOut', overwrite: true })
  })
}
function runTimer() {
  if (!api) return
  timer?.kill()
  timer = api.gsap.fromTo('[data-cl-timer]', { scaleX: 0 }, { scaleX: 1, duration: STACK_MS, ease: 'none', onComplete: () => stepStack(1) })
  if (hovering || !onScreen) timer.pause()
}
function stepStack(d: number) {
  stackIdx.value = (stackIdx.value + d + stack.length) % stack.length
  layoutStack()
  if (!prefersReducedMotion()) runTimer()
}

// Titik versi menyala saat dilewati; yang sedang dibaca berdenyut.
function bindNodes() {
  if (!api || !root.value) return
  const { ScrollTrigger } = api
  nodeSts.forEach((s) => s.kill())
  nodeSts = []
  root.value.querySelectorAll<HTMLElement>('.dx-cl__item').forEach((item) => {
    const node = item.querySelector('.dx-cl__node')!
    nodeSts.push(
      ScrollTrigger.create({ trigger: item, start: 'top 62%', end: 'max', toggleClass: { targets: node, className: 'is-reached' } }),
      ScrollTrigger.create({ trigger: item, start: 'top 62%', end: 'bottom 62%', toggleClass: { targets: node, className: 'is-current' } }),
    )
  })
}

// Ganti filter: timeline memudar keluar, isi berganti, lalu poin-poin masuk bergantian.
async function setFilter(k: ChangeType | 'semua') {
  if (k === filter.value || busy) return
  const list = root.value?.querySelector<HTMLElement>('[data-cl-list]')
  if (!list || !api || prefersReducedMotion()) { filter.value = k; await nextTick(); bindNodes(); return }
  busy = true
  const { gsap, ScrollTrigger } = api
  reveals.forEach((t) => { t.scrollTrigger?.kill(); t.progress(1) })
  reveals = []
  await gsap.to(list, { opacity: 0, y: 10, duration: 0.18, ease: 'power2.in' })
  filter.value = k
  await nextTick()
  gsap.set(list, { opacity: 1, y: 0 })
  gsap.fromTo(list.querySelectorAll('.dx-cl__card, .dx-cl__node'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power3.out', clearProps: 'opacity,transform' })
  gsap.fromTo(list.querySelectorAll('.dx-cl__change'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.025, delay: 0.1, clearProps: 'opacity,transform' })
  bindNodes()
  ScrollTrigger.refresh()
  busy = false
}

// Sorot angka: segmen bergelombang dan cincin digambar ulang.
function waveStat(e: MouseEvent) {
  if (!api || prefersReducedMotion()) return
  const el = e.currentTarget as HTMLElement
  api.gsap.fromTo(el.querySelectorAll('.dx-clstat__segs i.is-on'), { y: 0 }, { keyframes: { y: [0, -4, 0] }, duration: 0.45, stagger: 0.05, ease: 'power1.inOut', overwrite: true })
  const ring = el.querySelector<SVGCircleElement>('[data-cl-ring]')
  if (ring) api.gsap.fromTo(ring, { strokeDasharray: '0 100' }, { strokeDasharray: `${ring.dataset.share} 100`, duration: 0.8, ease: 'power3.out', overwrite: true })
}

function onStackEnter() { hovering = true; timer?.pause() }
function onStackLeave() { hovering = false; if (onScreen) timer?.resume() }

onMounted(async () => {
  api = await loadDocsGsap()
  const { gsap, ScrollTrigger } = api
  if (location.hash) document.querySelector(location.hash)?.scrollIntoView({ block: 'start' })
  layoutStack(true)
  bindNodes()
  if (prefersReducedMotion() || !root.value) return
  ctx = gsap.context(() => {
    const tl = gsap.timeline()
    tl.from('[data-cl-fade]', { y: 12, opacity: 0, duration: 0.5, stagger: 0.06 })
      .from('[data-cl-hero]', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
      .from('[data-cl-hero-fade]', { y: 10, opacity: 0, duration: 0.45, stagger: 0.06 }, '-=0.35')
      // Odometer: tiap angka berputar dua putaran lalu berhenti di nilainya.
      .from('[data-cl-odo]', { marginTop: '0em', duration: 1.5, stagger: 0.14, ease: 'power3.out' }, '<0.1')
      .from('[data-cl-sep]', { opacity: 0, y: 6, duration: 0.4, stagger: 0.1 }, '<0.3')
      .from('.dx-clstack__card', { y: 36, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, '<')
    tl.add(() => { layoutStack(true); runTimer() })

    // Strip angka: cincin persentase tergambar, angka bergulir, segmen (satu per perubahan) muncul berurutan.
    const st = gsap.timeline({ scrollTrigger: { trigger: '.dx-clhero__side', start: 'top 92%', once: true }, delay: 0.5 })
    st.from('[data-cl-stat]', { y: 14, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' })
      .from('.dx-clstat__ico', { scale: 0.4, rotate: -90, duration: 0.7, stagger: 0.1, ease: 'back.out(2)' }, '<')
      .from('[data-cl-ring]', { strokeDasharray: '0 100', duration: 1.2, stagger: 0.12, ease: 'power3.inOut' }, '<0.15')
      .from('[data-cl-odo-s]', { marginTop: '0em', duration: 1.3, stagger: 0.12, ease: 'power3.out' }, '<')
      .from('.dx-clstat__segs i', { scaleX: 0, opacity: 0, duration: 0.4, stagger: 0.035, ease: 'back.out(3)' }, '<0.2')
      .from('.dx-clstat em', { opacity: 0, x: -6, duration: 0.4, stagger: 0.1 }, '-=0.4')
      .add(() => root.value?.querySelector('.dx-clhero__side')?.classList.add('is-live'))

    // Tumpukan berhenti saat tidak terlihat.
    stackSt = ScrollTrigger.create({
      trigger: '[data-cl-hero]', start: 'top bottom', end: 'bottom top',
      onToggle: (s) => { onScreen = s.isActive; if (!onScreen) timer?.pause(); else if (!hovering) timer?.resume() },
    })

    // Garis timeline terisi mengikuti gulir.
    gsap.fromTo('[data-cl-fill]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-cl-list]', start: 'top 62%', end: 'clamp(bottom 62%)', scrub: 0.4 } })

    // Tiap rilis: titik pop, kartu masuk, garis pindai melintas, poin muncul bergantian.
    gsap.utils.toArray<HTMLElement>('.dx-cl__item').forEach((item) => {
      const t = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 92%', once: true } })
      reveals.push(t)
      t.from(item.querySelector('.dx-cl__node'), { scale: 0, duration: 0.5, ease: 'back.out(3)' })
        .fromTo(item.querySelector('.dx-cl__pulse'), { scale: 0.6, opacity: 0.8 }, { scale: 2.6, opacity: 0, duration: 0.9, ease: 'power2.out' }, '<0.1')
        .from(item.querySelector('.dx-cl__card'), { x: 24, opacity: 0, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,transform' }, '<')
        .fromTo(item.querySelector('.dx-cl__sweep'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.55, ease: 'power2.inOut' }, '<0.15')
        .to(item.querySelector('.dx-cl__sweep'), { scaleX: 0, transformOrigin: '100% 50%', duration: 0.5, ease: 'power2.in' })
        .from(item.querySelector('.dx-cl__ver'), { scale: 0.6, opacity: 0, duration: 0.45, ease: 'back.out(2.5)' }, '<-0.6')
        .from(item.querySelectorAll('.dx-cl__glabel .dx-tint'), { scale: 0, rotate: -30, duration: 0.45, stagger: 0.08, ease: 'back.out(2.5)' }, '<0.1')
        .from(item.querySelectorAll('.dx-cl__change'), { x: -10, opacity: 0, duration: 0.4, stagger: 0.04, clearProps: 'opacity,transform' }, '<0.05')
    })
  }, root.value)
})
onBeforeUnmount(() => {
  timer?.kill()
  stackSt?.kill()
  nodeSts.forEach((s) => s.kill())
  ctx?.revert()
})
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
        <div class="dx-clhero__copy">
          <span class="dx-clhero__eyebrow" data-cl-hero-fade><i class="dx-clhero__live" aria-hidden="true"></i>Rilis terbaru · {{ releaseDate(latest.date, true) }}</span>
          <p class="dx-clhero__version" :aria-label="`Versi ${latest.version}`">
            <span class="dx-clhero__v" aria-hidden="true" data-cl-sep>v</span>
            <span v-for="(ch, i) in versionChars" :key="i" class="dx-clhero__digit" aria-hidden="true">
              <span v-if="isDigit(ch)" class="dx-odo" data-cl-odo :style="{ marginTop: `-${10 + Number(ch)}em` }">
                <span v-for="k in 20" :key="k">{{ (k - 1) % 10 }}</span>
              </span>
              <span v-else data-cl-sep>{{ ch }}</span>
            </span>
          </p>
          <h2 data-cl-hero-fade>{{ latest.title }}</h2>
          <p class="dx-caption" data-cl-hero-fade>{{ latest.summary }}</p>
          <a :href="`#${releaseId(latest.version)}`" class="dx-btn dx-btn--secondary dx-btn--sm" data-cl-hero-fade><ApIcon name="arrow" /> Lihat detail rilis</a>
        </div>

        <div class="dx-clstack" @mouseenter="onStackEnter" @mouseleave="onStackLeave">
          <p class="dx-clstack__head">
            <span>Yang baru di v{{ latest.version }}</span>
            <span class="dx-clstack__count"><b>{{ pad(stackIdx + 1) }}</b> / {{ pad(stack.length) }}</span>
          </p>
          <div class="dx-clstack__deck" role="button" tabindex="0" aria-label="Perubahan berikutnya" @click="stepStack(1)" @keydown.enter.prevent="stepStack(1)">
            <div v-for="(c, i) in stack" :key="i" class="dx-clstack__card" :class="{ 'is-top': i === stackIdx }" :title="c.text" :aria-hidden="i !== stackIdx">
              <span class="dx-tint" :class="`dx-tint--${c.meta.tone}`"><ApIcon :name="c.meta.icon" /></span>
              <span class="dx-clstack__txt">
                <small>{{ c.meta.label }}<template v-if="c.w"> · {{ c.w.title }}</template></small>
                <span>{{ c.text }}</span>
              </span>
            </div>
          </div>
          <div class="dx-clstack__foot">
            <span class="dx-clstack__timer" aria-hidden="true"><i data-cl-timer></i></span>
            <button type="button" class="dx-clstack__nav" aria-label="Sebelumnya" @click="stepStack(-1)"><ApIcon name="arrow" class="is-flip" /></button>
            <button type="button" class="dx-clstack__nav" aria-label="Berikutnya" @click="stepStack(1)"><ApIcon name="arrow" /></button>
          </div>
        </div>
      </div>

      <div class="dx-clhero__side">
        <div v-for="x in latestCounts" :key="x.type" class="dx-clstat" :class="`dx-clstat--${x.meta.tone}`" data-cl-stat @mouseenter="waveStat">
          <span class="dx-clstat__ico">
            <svg class="dx-clstat__ring" viewBox="0 0 48 48" aria-hidden="true">
              <circle class="is-track" cx="24" cy="24" r="22" pathLength="100" />
              <circle class="is-val" cx="24" cy="24" r="22" pathLength="100" :style="{ strokeDasharray: `${x.share} 100` }" :data-share="x.share" data-cl-ring />
            </svg>
            <ApIcon :name="x.meta.icon" />
          </span>
          <span class="dx-clstat__body">
            <span class="dx-clstat__row">
              <b class="dx-clstat__num" :aria-label="String(x.n)">
                <span v-for="(ch, i) in String(x.n).split('')" :key="i" class="dx-clhero__digit" aria-hidden="true">
                  <span class="dx-odo" data-cl-odo-s :style="{ marginTop: `-${10 + Number(ch)}em` }"><span v-for="k in 20" :key="k">{{ (k - 1) % 10 }}</span></span>
                </span>
              </b>
              <small>{{ x.meta.label }}</small>
              <em>{{ x.share }}%</em>
            </span>
            <span class="dx-clstat__segs" aria-hidden="true"><i v-for="k in maxCount" :key="k" :class="{ 'is-on': k <= x.n }"></i></span>
          </span>
        </div>
        <p class="dx-clhero__how" data-cl-stat>
          <ApIcon name="plug" />
          <span>Versi baru muncul otomatis di Dashboard WordPress › Plugin. Klik <b>Perbarui sekarang</b>, pengaturan widget tetap aman.</span>
        </p>
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
      <li v-for="r in shown" :id="releaseId(r.version)" :key="r.version" class="dx-cl__item">
        <span class="dx-cl__node" aria-hidden="true"><i class="dx-cl__pulse"></i></span>
        <article class="dx-card dx-cl__card">
          <i class="dx-cl__sweep" aria-hidden="true"></i>
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
