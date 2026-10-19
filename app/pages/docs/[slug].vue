<script setup lang="ts">
/**
 * Halaman satu widget: kelebihan, cara pakai (scroll dua panel: langkah di kiri, pratinjau
 * menempel di kanan), demo interaktif, penjelasan pengaturan, checklist, dan masalah umum.
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
  description: `${d.tagline} Panduan pemakaian, demo interaktif, dan penjelasan pengaturan widget ${d.title}.`,
})

const idx = docs.indexOf(d)
const prev = docs[(idx - 1 + docs.length) % docs.length]!
const next = docs[(idx + 1) % docs.length]!
const catLabel = categories.find((c) => c.key === d.cat)?.label ?? ''
const words = [d.intro, ...d.perks.map((p) => p.text), ...d.steps.map((s) => s.text), ...d.content.flatMap((g) => g.items.map((i) => i[1])), ...d.tips.map((t) => t.a)].join(' ').split(/\s+/).length
const minutes = Math.max(2, Math.round(words / 160))
const controlCount = d.content.reduce((n, g) => n + g.items.length, 0)

const sections = [
  { id: 'kelebihan', label: 'Kelebihan', icon: 'sparkle' },
  { id: 'cara-pakai', label: 'Cara pakai', icon: 'cursor' },
  { id: 'coba', label: 'Coba langsung', icon: 'play' },
  { id: 'pengaturan', label: 'Pengaturan', icon: 'wrench' },
  { id: 'checklist', label: 'Checklist', icon: 'badge' },
  { id: 'masalah', label: 'Masalah umum', icon: 'headset' },
]
const activeSec = ref('kelebihan')

/* ---------- State demo: dipakai bersama oleh panggung "cara pakai" dan "coba langsung" ---------- */
const defaults = () => Object.fromEntries(d.knobs.map((k) => [k.key, k.value]))
const state = reactive<Record<string, any>>(defaults())
const resetState = () => Object.assign(state, defaults())
const step = ref(0)

/* ---------- Pengaturan: tab + grup yang bisa dibuka-tutup ---------- */
const tab = ref<'konten' | 'gaya' | 'lanjutan'>(route.query.tab === 'gaya' ? 'gaya' : 'konten')
const tabs = [
  { key: 'konten', label: 'Konten', n: d.content.length },
  { key: 'gaya', label: 'Gaya', n: d.style.length },
  { key: 'lanjutan', label: 'Lanjutan', n: 0 },
] as const
const tabEls = ref<HTMLElement[]>([])
const inkTick = ref(0) // dihitung ulang saat ukuran layar berubah
const ink = computed(() => {
  void inkTick.value
  const i = tabs.findIndex((t) => t.key === tab.value)
  const el = tabEls.value[i]
  return el ? { transform: `translateX(${el.offsetLeft}px)`, width: `${el.offsetWidth}px` } : {}
})
const openGroups = ref<Set<number>>(new Set([0]))
function toggleGroup(i: number) {
  const s = new Set(openGroups.value)
  s.has(i) ? s.delete(i) : s.add(i)
  openGroups.value = s
}
const highlight = ref(String(route.query.c ?? ''))

// Buka/tutup grup dengan tinggi yang dianimasikan GSAP (lebih halus dari CSS height).
async function onEnter(el: Element, done: () => void) {
  const { gsap } = await loadDocsGsap()
  gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: prefersReducedMotion() ? 0 : 0.45, ease: 'power3.out', onComplete: done, clearProps: 'height' })
}
async function onLeave(el: Element, done: () => void) {
  const { gsap } = await loadDocsGsap()
  gsap.to(el, { height: 0, opacity: 0, duration: prefersReducedMotion() ? 0 : 0.32, ease: 'power2.inOut', onComplete: done })
}

/* ---------- Checklist: tersimpan di browser pengunjung ---------- */
const checked = ref<boolean[]>(d.checklist.map(() => false))
const doneCount = computed(() => checked.value.filter(Boolean).length)
const ringC = 2 * Math.PI * 22
const storeKey = `dx-check-${d.slug}`
watch(checked, (v) => { try { localStorage.setItem(storeKey, JSON.stringify(v)) } catch {} }, { deep: true })

/* ---------- Navigasi antar-section ---------- */
function goTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(history.state, '', `#${id}`)
}

const root = ref<HTMLElement | null>(null)
const secbar = ref<HTMLElement | null>(null)
let ctx: { revert: () => void } | null = null

watch(activeSec, (id) => {
  // Bilah section di HP ikut menggeser chip yang aktif ke tengah.
  const chip = secbar.value?.querySelector<HTMLElement>(`[data-sec="${id}"]`)
  if (chip && secbar.value) secbar.value.scrollTo({ left: chip.offsetLeft - secbar.value.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' })
})

function wiggle(e: MouseEvent) {
  if (prefersReducedMotion()) return
  loadDocsGsap().then(({ gsap }) => gsap.fromTo((e.currentTarget as HTMLElement).querySelectorAll('.dx-wico > *'), { y: 2.5, opacity: 0.35 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, overwrite: true }))
}

const onResize = () => inkTick.value++

onMounted(async () => {
  window.addEventListener('resize', onResize)
  inkTick.value++
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
  const rail = root.value?.querySelector<HTMLElement>('[data-dx-rail-fill]')

  ctx = gsap.context(() => {
    // Progres baca di bilah atas dan di daftar isi.
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (s) => {
        if (bar) bar.style.transform = `scaleX(${s.progress})`
        if (rail) rail.style.transform = `scaleY(${s.progress})`
      },
    })

    sections.forEach((sec) => {
      ScrollTrigger.create({ trigger: `#${sec.id}`, start: 'top 45%', end: 'bottom 45%', onToggle: (s) => s.isActive && (activeSec.value = sec.id) })
    })

    // Langkah aktif mengikuti posisi gulir; pratinjau di panel kanan ikut menyorot bagiannya.
    // Di layar sempit panggung menempel di atas, jadi garis pemicunya diletakkan di bawah panggung.
    const line = () => (window.innerWidth <= 900 ? 76 : 58)
    gsap.utils.toArray<HTMLElement>('[data-dx-step]').forEach((el, i) => {
      ScrollTrigger.create({ trigger: el, start: () => `top ${line()}%`, end: () => `bottom ${line()}%`, onToggle: (s) => s.isActive && (step.value = i) })
    })
    gsap.fromTo('[data-dx-steps-fill]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-dx-steps]', start: () => `top ${line()}%`, end: () => `bottom ${line()}%`, scrub: 0.4 } })

    if (prefersReducedMotion()) return

    gsap.timeline()
      .from('[data-dx-head-ico]', { scale: 0.6, rotation: -12, opacity: 0, duration: 0.8, ease: 'back.out(2)' })
      .from('[data-dx-head-ico] .dx-wico > *', { y: 4, opacity: 0, stagger: 0.06, duration: 0.5 }, '-=0.45')
      .from('[data-dx-word]', { yPercent: 110, opacity: 0, stagger: 0.06, duration: 0.7 }, '-=0.6')
      .from('[data-dx-head-fade]', { y: 14, opacity: 0, stagger: 0.07, duration: 0.6 }, '-=0.45')

    gsap.utils.toArray<HTMLElement>('[data-dx-sechead]').forEach((el) => {
      gsap.from(el.children, { y: 22, opacity: 0, stagger: 0.08, duration: 0.7, scrollTrigger: { trigger: el, start: 'top 86%' } })
    })
    ScrollTrigger.batch('[data-dx-perk]', {
      start: 'top 88%', once: true,
      onEnter: (els) => {
        gsap.from(els, { y: 30, opacity: 0, stagger: 0.08, duration: 0.7, clearProps: 'transform,opacity' })
        gsap.from(els.map((e) => e.querySelector('.dx-perk__ico')), { scale: 0, rotation: -20, stagger: 0.08, duration: 0.7, ease: 'back.out(2.4)', delay: 0.15 })
      },
    })
    ScrollTrigger.batch('[data-dx-reveal]', {
      start: 'top 90%', once: true,
      onEnter: (els) => gsap.from(els, { y: 24, opacity: 0, stagger: 0.06, duration: 0.6, clearProps: 'transform,opacity' }),
    })
    // Panggung "cara pakai" masuk dengan sedikit kemiringan 3D, lalu tegak.
    gsap.from('[data-dx-scrolly-stage]', { rotationY: -14, rotationX: 6, y: 40, opacity: 0, duration: 1, transformPerspective: 1200, scrollTrigger: { trigger: '[data-dx-scrolly-stage]', start: 'top 85%' } })
  }, root.value!)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  ctx?.revert()
  const bar = document.querySelector<HTMLElement>('[data-dx-progress]')
  if (bar) bar.style.transform = 'scaleX(0)'
})

const typeLabel = (t: string) => controlTypes[t] ?? t
</script>

<template>
  <main ref="root" class="dx-page">
    <nav ref="secbar" class="dx-secbar" aria-label="Bagian halaman">
      <button v-for="s in sections" :key="s.id" type="button" class="dx-secbar__chip" :class="{ 'is-on': activeSec === s.id }" :data-sec="s.id" @click="goTo(s.id)">{{ s.label }}</button>
    </nav>

    <div class="dx-wrap dx-page__grid">
      <article class="dx-article">
        <nav class="dx-crumb" aria-label="Breadcrumb" data-dx-head-fade>
          <NuxtLink to="/docs">Docs</NuxtLink><span aria-hidden="true">/</span><span>{{ catLabel }}</span><span aria-hidden="true">/</span><b>{{ d.title }}</b>
        </nav>

        <header class="dx-head">
          <span class="dx-head__ico" data-dx-head-ico @mouseenter="wiggle"><DocsIcon :k="d.key" /></span>
          <div class="dx-head__copy">
            <h1 class="dx-head__title" :aria-label="d.title">
              <span v-for="(w, i) in d.title.split(' ')" :key="i" class="dx-word" aria-hidden="true"><span data-dx-word>{{ w }}</span></span>
            </h1>
            <p class="dx-head__tag" data-dx-head-fade>{{ d.tagline }}</p>
            <div class="dx-head__meta" data-dx-head-fade>
              <span class="dx-badge"><ApIcon name="layers" /> {{ catLabel }}</span>
              <span v-if="d.dest" class="dx-badge" :class="{ 'dx-badge--gold': d.mdundig }"><ApIcon :name="d.mdundig ? 'plug' : 'send'" /> {{ d.dest }}</span>
              <span class="dx-badge"><ApIcon name="wrench" /> {{ controlCount }} pengaturan utama</span>
              <span class="dx-badge"><ApIcon name="clock" /> {{ minutes }} menit baca</span>
            </div>
          </div>
        </header>
        <p class="dx-intro" data-dx-head-fade>{{ d.intro }}</p>

        <!-- Kelebihan -->
        <section id="kelebihan" class="dx-sec">
          <div class="dx-sechead" data-dx-sechead>
            <span class="dx-eyebrow">Kelebihan</span>
            <h2>Kenapa memakai {{ d.title }}</h2>
          </div>
          <div class="dx-perks">
            <div v-for="p in d.perks" :key="p.title" class="dx-perk" data-dx-perk>
              <span class="dx-perk__ico"><ApIcon :name="p.icon" /></span>
              <b>{{ p.title }}</b>
              <p>{{ p.text }}</p>
            </div>
          </div>
        </section>

        <!-- Cara pakai: dua panel -->
        <section id="cara-pakai" class="dx-sec">
          <div class="dx-sechead" data-dx-sechead>
            <span class="dx-eyebrow">Cara pakai</span>
            <h2>{{ d.steps.length }} langkah memasang {{ d.title }}</h2>
            <p>Gulir pelan-pelan. Pratinjau di samping menyorot bagian yang sedang dibahas.</p>
          </div>
          <div class="dx-scrolly">
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
            <div class="dx-scrolly__stage">
              <div class="dx-scrolly__pin" data-dx-scrolly-stage>
                <DocsStage :slug="d.slug" :s="state" :focus="d.steps[step]?.focus" :caption="d.steps[step]?.title" :step="step" :total="d.steps.length" />
              </div>
            </div>
          </div>
        </section>

        <!-- Coba langsung -->
        <section id="coba" class="dx-sec">
          <div class="dx-sechead" data-dx-sechead>
            <span class="dx-eyebrow">Coba langsung</span>
            <h2>Ubah nilainya, lihat hasilnya</h2>
            <p>Demo ini meniru perilaku widget. Pratinjau juga bisa diklik.</p>
          </div>
          <div class="dx-play" data-dx-reveal>
            <DocsKnobs :knobs="d.knobs" :s="state" @reset="resetState" />
            <DocsStage :slug="d.slug" :s="state" live />
          </div>
        </section>

        <!-- Pengaturan -->
        <section id="pengaturan" class="dx-sec">
          <div class="dx-sechead" data-dx-sechead>
            <span class="dx-eyebrow">Pengaturan</span>
            <h2>Penjelasan setiap pengaturan</h2>
            <p>Nama di bawah ini sama persis dengan yang tampil di panel Elementor.</p>
          </div>

          <div class="dx-tabs" role="tablist" data-dx-reveal>
            <button
              v-for="t in tabs" :key="t.key" ref="tabEls" type="button" role="tab" class="dx-tab" :class="{ 'is-on': tab === t.key }"
              :aria-selected="tab === t.key" @click="tab = t.key"
            >
              {{ t.label }}<span v-if="t.n">{{ t.n }}</span>
            </button>
            <i class="dx-tabs__ink" :style="ink" aria-hidden="true"></i>
          </div>

          <Transition name="dx-swap" mode="out-in">
            <div v-if="tab === 'konten'" key="konten" class="dx-groups">
              <div v-for="(g, gi) in d.content" :key="g.title" class="dx-group" :class="{ 'is-open': openGroups.has(gi) }" data-dx-reveal>
                <button type="button" class="dx-group__head" :aria-expanded="openGroups.has(gi)" @click="toggleGroup(gi)">
                  <span class="dx-group__ico"><ApIcon name="layout" /></span>
                  <b>{{ g.title }}</b>
                  <span class="dx-group__n">{{ g.items.length }}</span>
                  <span class="dx-group__chev" aria-hidden="true"><ApIcon name="plus" /></span>
                </button>
                <Transition :css="false" @enter="onEnter" @leave="onLeave">
                  <div v-if="openGroups.has(gi)" class="dx-group__body">
                    <div v-for="[label, desc, type] in g.items" :key="label" class="dx-ctl" :class="{ 'is-flash': highlight === label }" :data-c="label">
                      <div class="dx-ctl__name"><b>{{ label }}</b><span class="dx-type">{{ typeLabel(type) }}</span></div>
                      <p>{{ desc }}</p>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <div v-else-if="tab === 'gaya'" key="gaya" class="dx-style">
              <p class="dx-note"><ApIcon name="palette" /> Setiap bagian di tab Gaya bisa diatur warna, tipografi, jarak, sudut, border, dan bayangannya, termasuk keadaan hover.</p>
              <div class="dx-style__grid">
                <span v-for="(s, i) in d.style" :key="s" class="dx-style__item" data-dx-reveal><i>{{ String(i + 1).padStart(2, '0') }}</i>{{ s }}</span>
              </div>
            </div>

            <div v-else key="lanjutan" class="dx-style">
              <p class="dx-note"><ApIcon name="layers" /> Tab Lanjutan adalah tab bawaan Elementor dan sama untuk semua widget.</p>
              <div class="dx-adv">
                <div v-for="a in [
                  { i: 'layout', t: 'Tata letak', x: 'Margin, padding, lebar, dan posisi widget.' },
                  { i: 'zap', t: 'Efek gerak', x: 'Animasi masuk dan efek scroll dari Elementor.' },
                  { i: 'globe', t: 'Responsif', x: 'Sembunyikan widget di desktop, tablet, atau HP.' },
                  { i: 'code', t: 'CSS ID & kelas', x: 'Penanda untuk CSS kustom atau aksi Sampul.' },
                ]" :key="a.t" class="dx-adv__item" data-dx-reveal
                >
                  <span class="dx-perk__ico"><ApIcon :name="a.i" /></span>
                  <b>{{ a.t }}</b>
                  <p>{{ a.x }}</p>
                </div>
              </div>
            </div>
          </Transition>
        </section>

        <!-- Checklist -->
        <section id="checklist" class="dx-sec">
          <div class="dx-sechead" data-dx-sechead>
            <span class="dx-eyebrow">Checklist</span>
            <h2>Sebelum undangan dibagikan</h2>
            <p>Centang yang sudah selesai. Progres tersimpan di browser ini.</p>
          </div>
          <div class="dx-check" data-dx-reveal>
            <div class="dx-check__ring" :class="{ 'is-done': doneCount === d.checklist.length }">
              <svg viewBox="0 0 50 50" aria-hidden="true">
                <circle cx="25" cy="25" r="22" />
                <circle cx="25" cy="25" r="22" class="is-fill" :stroke-dasharray="ringC" :stroke-dashoffset="ringC * (1 - doneCount / d.checklist.length)" />
              </svg>
              <b>{{ doneCount }}/{{ d.checklist.length }}</b>
            </div>
            <ul class="dx-check__list">
              <li v-for="(c, i) in d.checklist" :key="c">
                <label class="dx-check__item" :class="{ 'is-on': checked[i] }">
                  <input v-model="checked[i]" type="checkbox">
                  <span class="dx-check__box" aria-hidden="true"><ApIcon name="check" /></span>
                  {{ c }}
                </label>
              </li>
            </ul>
          </div>
        </section>

        <!-- Masalah umum -->
        <section id="masalah" class="dx-sec">
          <div class="dx-sechead" data-dx-sechead>
            <span class="dx-eyebrow">Masalah umum</span>
            <h2>Kalau ada yang tidak sesuai</h2>
          </div>
          <div class="dx-faq">
            <details v-for="t in d.tips" :key="t.q" class="dx-faq__item" data-dx-reveal>
              <summary><span class="dx-faq__ico"><ApIcon name="headset" /></span>{{ t.q }}<span class="dx-faq__chev" aria-hidden="true"><ApIcon name="plus" /></span></summary>
              <p>{{ t.a }}</p>
            </details>
          </div>
        </section>

        <nav class="dx-pager" aria-label="Widget lain">
          <NuxtLink :to="`/docs/${prev.slug}`" class="dx-pager__link" @mouseenter="wiggle">
            <small><ApIcon name="arrow" class="is-flip" /> Sebelumnya</small>
            <span><DocsIcon :k="prev.key" /> {{ prev.title }}</span>
          </NuxtLink>
          <NuxtLink :to="`/docs/${next.slug}`" class="dx-pager__link is-next" @mouseenter="wiggle">
            <small>Berikutnya <ApIcon name="arrow" /></small>
            <span>{{ next.title }} <DocsIcon :k="next.key" /></span>
          </NuxtLink>
        </nav>
      </article>

      <aside class="dx-rail" aria-label="Daftar isi">
        <div class="dx-rail__in">
          <span class="dx-rail__title">Di halaman ini</span>
          <div class="dx-toc">
            <i class="dx-toc__track" aria-hidden="true"><i data-dx-rail-fill></i></i>
            <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" class="dx-toc__link" :class="{ 'is-on': activeSec === s.id }" @click.prevent="goTo(s.id)">
              <ApIcon :name="s.icon" /> {{ s.label }}
            </a>
          </div>
          <div class="dx-rail__card">
            <span class="dx-rail__title">Checklist</span>
            <div class="dx-rail__bar"><i :style="{ transform: `scaleX(${doneCount / d.checklist.length})` }"></i></div>
            <small>{{ doneCount }} dari {{ d.checklist.length }} selesai</small>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>
