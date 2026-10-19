<script setup lang="ts">
/**
 * Halaman satu widget (gaya dashboard MDUNDIG): fitur, kelebihan & batasan, cara pakai
 * (scroll dua panel: langkah di kiri, pratinjau menempel di kanan), penjelasan pengaturan,
 * checklist, dan masalah umum.
 */
import { docs, docBySlug, categories, controlTypes } from '~/data/docs'
import { loadDocsGsap, prefersReducedMotion } from '~/composables/useDocsGsap'

definePageMeta({ layout: 'docs', key: (r) => String(r.params.slug) })

const route = useRoute()
const doc = docBySlug(String(route.params.slug))
if (!doc) throw createError({ statusCode: 404, statusMessage: 'Widget tidak ditemukan', fatal: true })
const d = doc!

useSeoMeta({
  title: `${d.title} · Dokumentasi ApeironKit`,
  description: `${d.tagline} Fitur, kelebihan, batasan, cara pakai, dan penjelasan pengaturan widget ${d.title}.`,
})

const idx = docs.indexOf(d)
const prev = docs[(idx - 1 + docs.length) % docs.length]!
const next = docs[(idx + 1) % docs.length]!
const catLabel = categories.find((c) => c.key === d.cat)?.label ?? ''
const controlCount = d.content.reduce((n, g) => n + g.items.length, 0)
const features = d.features ?? []
const limits = d.limits ?? []

const facts = [
  { icon: 'layers', label: 'Kategori', value: catLabel },
  { icon: d.mdundig ? 'plug' : 'send', label: 'Data', value: d.dest ?? 'Tidak menyimpan data' },
  { icon: 'sparkle', label: 'Fitur', value: `${features.length} fitur utama` },
  { icon: 'wrench', label: 'Pengaturan', value: `${d.content.length} Konten · ${d.style.length} Gaya` },
]

const sections = [
  { id: 'fitur', label: 'Fitur' },
  { id: 'kelebihan', label: 'Kelebihan & batasan' },
  { id: 'cara-pakai', label: 'Cara pakai' },
  { id: 'pengaturan', label: 'Pengaturan' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'masalah', label: 'Masalah umum' },
]
const activeSec = ref('fitur')

// Nilai awal pratinjau di panggung "cara pakai".
const state = reactive<Record<string, any>>(Object.fromEntries(d.knobs.map((k) => [k.key, k.value])))
const step = ref(0)

/* ---------- Pengaturan: tab + grup yang bisa dibuka-tutup ---------- */
const tab = ref<'konten' | 'gaya' | 'lanjutan'>(route.query.tab === 'gaya' ? 'gaya' : 'konten')
const tabs = [
  { key: 'konten', label: 'Konten', n: d.content.length },
  { key: 'gaya', label: 'Gaya', n: d.style.length },
  { key: 'lanjutan', label: 'Lanjutan', n: 0 },
] as const
const openGroups = ref<Set<number>>(new Set([0]))
function toggleGroup(i: number) {
  const s = new Set(openGroups.value)
  s.has(i) ? s.delete(i) : s.add(i)
  openGroups.value = s
}
const highlight = ref(String(route.query.c ?? ''))

// Buka/tutup grup dengan tinggi yang dianimasikan GSAP.
async function onEnter(el: Element, done: () => void) {
  const { gsap } = await loadDocsGsap()
  gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: prefersReducedMotion() ? 0 : 0.4, ease: 'power3.out', onComplete: done, clearProps: 'height' })
}
async function onLeave(el: Element, done: () => void) {
  const { gsap } = await loadDocsGsap()
  gsap.to(el, { height: 0, opacity: 0, duration: prefersReducedMotion() ? 0 : 0.28, ease: 'power2.inOut', onComplete: done })
}

/* ---------- Checklist: tersimpan di browser pengunjung ---------- */
const checked = ref<boolean[]>(d.checklist.map(() => false))
const doneCount = computed(() => checked.value.filter(Boolean).length)
const storeKey = `dx-check-${d.slug}`
watch(checked, (v) => { try { localStorage.setItem(storeKey, JSON.stringify(v)) } catch {} }, { deep: true })

const advanced = [
  { i: 'layout', t: 'Tata letak', x: 'Margin, padding, lebar, dan posisi widget.' },
  { i: 'zap', t: 'Efek gerak', x: 'Animasi masuk dan efek scroll dari Elementor.' },
  { i: 'globe', t: 'Responsif', x: 'Sembunyikan widget di desktop, tablet, atau HP.' },
  { i: 'code', t: 'CSS ID & kelas', x: 'Penanda untuk CSS kustom atau aksi Sampul.' },
]

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(history.state, '', `#${id}`)
}

const root = ref<HTMLElement | null>(null)
const secbar = ref<HTMLElement | null>(null)
let ctx: { revert: () => void } | null = null

watch(activeSec, (id) => {
  const chip = secbar.value?.querySelector<HTMLElement>(`[data-sec="${id}"]`)
  if (chip && secbar.value) secbar.value.scrollTo({ left: chip.offsetLeft - secbar.value.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' })
})

onMounted(async () => {
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey) || 'null')
    if (Array.isArray(saved) && saved.length === d.checklist.length) checked.value = saved
  } catch {}

  // Datang dari pencarian: buka grup berisi pengaturan itu lalu sorot barisnya.
  if (highlight.value) {
    const gi = d.content.findIndex((g) => g.items.some((it) => it[0] === highlight.value))
    if (gi >= 0) {
      tab.value = 'konten'
      openGroups.value = new Set([gi])
      await nextTick()
      setTimeout(() => document.querySelector(`[data-c="${CSS.escape(highlight.value)}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250)
    }
  }

  const { gsap, ScrollTrigger } = await loadDocsGsap()
  const bar = document.querySelector<HTMLElement>('[data-dx-progress]')

  ctx = gsap.context(() => {
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { if (bar) bar.style.transform = `scaleX(${s.progress})` } })
    sections.forEach((sec) => {
      ScrollTrigger.create({ trigger: `#${sec.id}`, start: 'top 40%', end: 'bottom 40%', onToggle: (s) => s.isActive && (activeSec.value = sec.id) })
    })

    // Langkah aktif mengikuti posisi gulir. Di layar sempit panggung menempel di atas,
    // jadi garis pemicunya diletakkan di bawah panggung.
    const line = () => (window.innerWidth <= 900 ? 76 : 55)
    gsap.utils.toArray<HTMLElement>('[data-dx-step]').forEach((el, i) => {
      ScrollTrigger.create({ trigger: el, start: () => `top ${line()}%`, end: () => `bottom ${line()}%`, onToggle: (s) => s.isActive && (step.value = i) })
    })
    gsap.fromTo('[data-dx-steps-fill]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-dx-steps]', start: () => `top ${line()}%`, end: () => `bottom ${line()}%`, scrub: 0.4 } })

    if (prefersReducedMotion()) return

    gsap.timeline()
      .from('[data-dx-head-ico]', { scale: 0.7, opacity: 0, duration: 0.6, ease: 'back.out(2)' })
      .from('[data-dx-head-ico] .dx-wico > *', { y: 3, opacity: 0, stagger: 0.05, duration: 0.4 }, '-=0.35')
      .from('[data-dx-head-fade]', { y: 10, opacity: 0, stagger: 0.05, duration: 0.45 }, '-=0.45')
      .from('[data-dx-fact]', { y: 12, opacity: 0, stagger: 0.05, duration: 0.45 }, '-=0.3')

    ScrollTrigger.batch('[data-dx-feat]', {
      start: 'top 92%', once: true,
      onEnter: (els) => {
        gsap.from(els, { y: 16, opacity: 0, stagger: 0.04, duration: 0.45, clearProps: 'transform,opacity' })
        gsap.from(els.map((e) => e.querySelector('.dx-tint')), { scale: 0.4, rotation: -15, stagger: 0.04, duration: 0.5, ease: 'back.out(2.4)', delay: 0.08 })
      },
    })
    ScrollTrigger.batch('[data-dx-reveal]', {
      start: 'top 92%', once: true,
      onEnter: (els) => gsap.from(els, { y: 18, opacity: 0, stagger: 0.05, duration: 0.5, clearProps: 'transform,opacity' }),
    })
    gsap.from('[data-dx-scrolly-stage]', { y: 30, opacity: 0, duration: 0.7, scrollTrigger: { trigger: '[data-dx-scrolly-stage]', start: 'top 88%' } })
  }, root.value!)
})

onBeforeUnmount(() => {
  ctx?.revert()
  const bar = document.querySelector<HTMLElement>('[data-dx-progress]')
  if (bar) bar.style.transform = 'scaleX(0)'
})

const typeLabel = (t: string) => controlTypes[t] ?? t
</script>

<template>
  <div ref="root" class="dx-page dx-page--widget">
    <header class="dx-whead">
      <span class="dx-tint dx-tint--0 dx-whead__ico" data-dx-head-ico><DocsIcon :k="d.key" /></span>
      <div class="dx-whead__copy">
        <nav class="dx-crumb" aria-label="Breadcrumb" data-dx-head-fade>
          <NuxtLink to="/docs">Docs</NuxtLink><span aria-hidden="true">/</span><span>{{ catLabel }}</span>
        </nav>
        <h1 data-dx-head-fade>{{ d.title }}</h1>
        <p class="dx-caption" data-dx-head-fade>{{ d.tagline }}</p>
      </div>
      <div class="dx-whead__nav" data-dx-head-fade>
        <NuxtLink :to="`/docs/${prev.slug}`" class="dx-btn dx-btn--secondary dx-btn--icon dx-btn--sm" :aria-label="`Sebelumnya: ${prev.title}`"><ApIcon name="arrow" class="is-flip" /></NuxtLink>
        <NuxtLink :to="`/docs/${next.slug}`" class="dx-btn dx-btn--secondary dx-btn--icon dx-btn--sm" :aria-label="`Berikutnya: ${next.title}`"><ApIcon name="arrow" /></NuxtLink>
      </div>
    </header>

    <div class="dx-facts">
      <div v-for="(f, i) in facts" :key="f.label" class="dx-card dx-fact" data-dx-fact>
        <span class="dx-tint" :class="`dx-tint--${i % 4}`"><ApIcon :name="f.icon" /></span>
        <span class="dx-fact__txt"><small>{{ f.label }}</small><b>{{ f.value }}</b></span>
      </div>
    </div>

    <nav ref="secbar" class="dx-secbar" aria-label="Bagian halaman">
      <button v-for="s in sections" :key="s.id" type="button" class="dx-secbar__item" :class="{ 'is-on': activeSec === s.id }" :data-sec="s.id" @click="goTo(s.id)">{{ s.label }}</button>
    </nav>

    <p class="dx-alert" data-dx-head-fade><ApIcon name="book" />{{ d.intro }}</p>

    <!-- Fitur -->
    <section id="fitur" class="dx-card dx-sec">
      <div class="dx-card__head">
        <div>
          <h2>Fitur</h2>
          <p class="dx-caption">{{ features.length }} fitur utama {{ d.title }}.</p>
        </div>
      </div>
      <div class="dx-feats">
        <div v-for="(f, i) in features" :key="f.title" class="dx-feat" data-dx-feat>
          <span class="dx-tint" :class="`dx-tint--${i % 4}`"><ApIcon :name="f.icon" /></span>
          <div>
            <b>{{ f.title }}</b>
            <p class="dx-caption">{{ f.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Kelebihan & batasan -->
    <section id="kelebihan" class="dx-sec dx-pros">
      <div class="dx-card" data-dx-reveal>
        <div class="dx-card__head">
          <div>
            <h2>Kelebihan</h2>
            <p class="dx-caption">Alasan memakai {{ d.title }}.</p>
          </div>
          <span class="dx-badge dx-badge--brand"><ApIcon name="thumb-up" /> {{ d.perks.length }}</span>
        </div>
        <ul class="dx-list">
          <li v-for="p in d.perks" :key="p.title">
            <span class="dx-list__ico is-pro"><ApIcon :name="p.icon" /></span>
            <div><b>{{ p.title }}</b><p class="dx-caption">{{ p.text }}</p></div>
          </li>
        </ul>
      </div>
      <div class="dx-card" data-dx-reveal>
        <div class="dx-card__head">
          <div>
            <h2>Batasan</h2>
            <p class="dx-caption">Hal yang perlu diketahui sebelum memakai.</p>
          </div>
          <span class="dx-badge dx-badge--warn"><ApIcon name="thumb-down" /> {{ limits.length }}</span>
        </div>
        <ul class="dx-list">
          <li v-for="l in limits" :key="l">
            <span class="dx-list__ico is-con"><ApIcon name="shield" /></span>
            <div><p>{{ l }}</p></div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Cara pakai: dua panel -->
    <section id="cara-pakai" class="dx-card dx-sec">
      <div class="dx-card__head">
        <div>
          <h2>Cara pakai</h2>
          <p class="dx-caption">{{ d.steps.length }} langkah. Gulir pelan-pelan; pratinjau menyorot bagian yang sedang dibahas.</p>
        </div>
      </div>
      <div class="dx-scrolly">
        <div class="dx-scrolly__stage">
          <div class="dx-scrolly__pin" data-dx-scrolly-stage>
            <DocsStage :slug="d.slug" :s="state" :focus="d.steps[step]?.focus" :caption="d.steps[step]?.title" :step="step" :total="d.steps.length" />
          </div>
        </div>
        <ol class="dx-steps" data-dx-steps>
          <i class="dx-steps__rail" aria-hidden="true"><i data-dx-steps-fill></i></i>
          <li v-for="(s, i) in d.steps" :key="s.title" class="dx-step" :class="{ 'is-on': step === i, 'is-past': i < step }" data-dx-step>
            <span class="dx-step__num">{{ i + 1 }}</span>
            <div class="dx-step__body">
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Pengaturan -->
    <section id="pengaturan" class="dx-card dx-sec">
      <div class="dx-card__head">
        <div>
          <h2>Pengaturan</h2>
          <p class="dx-caption">{{ controlCount }} pengaturan utama. Nama sama persis dengan panel Elementor.</p>
        </div>
        <div class="dx-seg" role="tablist" aria-label="Tab pengaturan">
          <button v-for="t in tabs" :key="t.key" type="button" role="tab" :class="{ 'is-on': tab === t.key }" :aria-selected="tab === t.key" @click="tab = t.key">
            {{ t.label }}<span v-if="t.n">{{ t.n }}</span>
          </button>
        </div>
      </div>

      <Transition name="dx-swap" mode="out-in">
        <div v-if="tab === 'konten'" key="konten" class="dx-groups">
          <div v-for="(g, gi) in d.content" :key="g.title" class="dx-group" :class="{ 'is-open': openGroups.has(gi) }">
            <button type="button" class="dx-group__head" :aria-expanded="openGroups.has(gi)" @click="toggleGroup(gi)">
              <b>{{ g.title }}</b>
              <span class="dx-badge">{{ g.items.length }}</span>
              <span class="dx-group__chev" aria-hidden="true"><ApIcon name="plus" /></span>
            </button>
            <Transition :css="false" @enter="onEnter" @leave="onLeave">
              <div v-if="openGroups.has(gi)" class="dx-group__body">
                <div v-for="[label, desc, type] in g.items" :key="label" class="dx-ctl" :class="{ 'is-flash': highlight === label }" :data-c="label">
                  <div class="dx-ctl__name"><b>{{ label }}</b><span class="dx-badge">{{ typeLabel(type) }}</span></div>
                  <p class="dx-caption">{{ desc }}</p>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <div v-else-if="tab === 'gaya'" key="gaya" class="dx-tabpane">
          <p class="dx-alert dx-alert--flat"><ApIcon name="palette" />Setiap bagian bisa diatur warna, tipografi, jarak, sudut, border, dan bayangannya, termasuk keadaan hover.</p>
          <div class="dx-style">
            <span v-for="(s, i) in d.style" :key="s" class="dx-style__item"><i>{{ String(i + 1).padStart(2, '0') }}</i>{{ s }}</span>
          </div>
        </div>

        <div v-else key="lanjutan" class="dx-tabpane">
          <p class="dx-alert dx-alert--flat"><ApIcon name="layers" />Tab Lanjutan adalah tab bawaan Elementor dan sama untuk semua widget.</p>
          <div class="dx-feats dx-feats--flat">
            <div v-for="(a, i) in advanced" :key="a.t" class="dx-feat">
              <span class="dx-tint" :class="`dx-tint--${i % 4}`"><ApIcon :name="a.i" /></span>
              <div><b>{{ a.t }}</b><p class="dx-caption">{{ a.x }}</p></div>
            </div>
          </div>
        </div>
      </Transition>
    </section>

    <!-- Checklist & masalah umum -->
    <div class="dx-pros">
      <section id="checklist" class="dx-card dx-sec" data-dx-reveal>
        <div class="dx-card__head">
          <div>
            <h2>Checklist</h2>
            <p class="dx-caption">Tersimpan di browser ini.</p>
          </div>
          <span class="dx-badge" :class="{ 'dx-badge--gold': doneCount === d.checklist.length }">{{ doneCount }}/{{ d.checklist.length }}</span>
        </div>
        <div class="dx-meter"><i :style="{ transform: `scaleX(${doneCount / d.checklist.length})` }"></i></div>
        <ul class="dx-check">
          <li v-for="(c, i) in d.checklist" :key="c">
            <label class="dx-check__item" :class="{ 'is-on': checked[i] }">
              <input v-model="checked[i]" type="checkbox">
              <span class="dx-check__box" aria-hidden="true"><ApIcon name="check" /></span>
              {{ c }}
            </label>
          </li>
        </ul>
      </section>

      <section id="masalah" class="dx-card dx-sec" data-dx-reveal>
        <div class="dx-card__head">
          <div>
            <h2>Masalah umum</h2>
            <p class="dx-caption">Kalau ada yang tidak sesuai.</p>
          </div>
        </div>
        <div class="dx-faq">
          <details v-for="t in d.tips" :key="t.q" class="dx-disclosure">
            <summary>{{ t.q }}<span class="dx-group__chev" aria-hidden="true"><ApIcon name="plus" /></span></summary>
            <p class="dx-caption">{{ t.a }}</p>
          </details>
        </div>
      </section>
    </div>

    <nav class="dx-pager" aria-label="Widget lain">
      <NuxtLink :to="`/docs/${prev.slug}`" class="dx-card dx-pager__link">
        <small><ApIcon name="arrow" class="is-flip" /> Sebelumnya</small>
        <span><DocsIcon :k="prev.key" /> {{ prev.title }}</span>
      </NuxtLink>
      <NuxtLink :to="`/docs/${next.slug}`" class="dx-card dx-pager__link is-next">
        <small>Berikutnya <ApIcon name="arrow" /></small>
        <span>{{ next.title }} <DocsIcon :k="next.key" /></span>
      </NuxtLink>
    </nav>
  </div>
</template>
