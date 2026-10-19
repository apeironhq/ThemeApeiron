<script setup lang="ts">
/**
 * Beranda dokumentasi: banner, angka ringkas, mulai cepat, lalu kartu 13 widget
 * dengan filter kategori (transisi GSAP Flip).
 */
import { docs, categories, type DocCategory } from '~/data/docs'
import { loadDocsGsap, prefersReducedMotion } from '~/composables/useDocsGsap'

definePageMeta({ layout: 'docs' })
useSeoMeta({
  title: 'Dokumentasi Widget · ApeironKit',
  description: 'Panduan lengkap 13 widget ApeironKit untuk Elementor: kelebihan, cara pakai langkah demi langkah, demo interaktif, dan penjelasan setiap pengaturan.',
})

const searchOpen = useState('dx-search', () => false)
const filter = ref<DocCategory | 'semua'>('semua')
const counts = computed(() => Object.fromEntries(categories.map((c) => [c.key, c.key === 'semua' ? docs.length : docs.filter((d) => d.cat === c.key).length])))
const catLabel = (k: string) => categories.find((c) => c.key === k)?.label ?? ''
const visible = (cat: DocCategory) => filter.value === 'semua' || filter.value === cat

const title = 'Panduan 13 widget ApeironKit'
const stats = [
  { n: 13, label: 'Widget siap pakai', icon: 'layout' },
  { n: 4, label: 'Kategori kebutuhan', icon: 'layers' },
  { n: 2, label: 'Terhubung ke MDUNDIG', icon: 'plug' },
  { n: 0, label: 'Baris kode yang perlu ditulis', icon: 'code' },
]
const quick = [
  { icon: 'plug', title: 'Pasang plugin', text: 'Plugin › Tambah Baru › Unggah Plugin, pilih apeiron-kit.zip, lalu Aktifkan.' },
  { icon: 'key', title: 'Aktifkan lisensi', text: 'Buka menu ApeironKit › Lisensi, tempel kode dari email pembelian.' },
  { icon: 'cursor', title: 'Seret widget', text: 'Di editor Elementor, cari kategori ApeironKit dan seret widget ke halaman.' },
]
// Ikon yang melayang di banner.
const orbit = ['cover', 'countdown', 'audio', 'form', 'comment', 'registry', 'manager', 'copy']

const root = ref<HTMLElement | null>(null)
let ctx: { revert: () => void } | null = null
let flipApi: Awaited<ReturnType<typeof loadDocsGsap>> | null = null

async function setFilter(k: DocCategory | 'semua') {
  if (k === filter.value) return
  const cards = root.value?.querySelectorAll('[data-dx-card]')
  if (!flipApi || !cards || prefersReducedMotion()) { filter.value = k; return }
  const { gsap, Flip } = flipApi
  const state = Flip.getState(cards)
  filter.value = k
  await nextTick()
  Flip.from(state, {
    duration: 0.6, ease: 'power3.inOut', absolute: true, scale: true, nested: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.1 }),
    onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.3 }),
  })
}

// Hover kartu: bagian-bagian ikon bergerak bergantian.
function iconWiggle(e: MouseEvent) {
  if (!flipApi || prefersReducedMotion()) return
  const parts = (e.currentTarget as HTMLElement).querySelectorAll('.dx-wico > *')
  flipApi.gsap.fromTo(parts, { y: 2.5, opacity: 0.35 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, overwrite: true })
}

onMounted(async () => {
  flipApi = await loadDocsGsap()
  const { gsap } = flipApi
  if (prefersReducedMotion() || !root.value) return
  ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('[data-dx-banner]', { clipPath: 'inset(8% 6% 8% 6% round 28px)', opacity: 0, duration: 0.9 })
      .from('[data-dx-word]', { yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.06 }, '-=0.55')
      .from('[data-dx-fade]', { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
      .from('[data-dx-orbit] > *', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'back.out(2)' }, '-=0.6')
      .from('[data-dx-stat]', { y: 22, opacity: 0, duration: 0.6, stagger: 0.07 }, '-=0.5')

    // Angka statistik menghitung naik.
    gsap.utils.toArray<HTMLElement>('[data-dx-count]').forEach((el) => {
      const end = Number(el.dataset.dxCount)
      const o = { v: 0 }
      tl.to(o, { v: end, duration: 1.1, ease: 'power2.out', onUpdate: () => (el.textContent = String(Math.round(o.v))) }, '<0.05')
    })

    // Ikon banner melayang pelan; berhenti saat banner tidak terlihat.
    const floats = gsap.utils.toArray<HTMLElement>('[data-dx-orbit] > *').map((el, i) =>
      gsap.to(el, { y: i % 2 ? 9 : -9, rotation: i % 2 ? 4 : -4, duration: 2.6 + (i % 3) * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.15 }),
    )
    flipApi!.ScrollTrigger.create({ trigger: '[data-dx-banner]', start: 'top bottom', end: 'bottom top', onToggle: (s) => floats.forEach((t) => (s.isActive ? t.resume() : t.pause())) })

    // Mulai cepat: garis penghubung tergambar, lalu kartu muncul bergantian.
    gsap.timeline({ scrollTrigger: { trigger: '[data-dx-quick]', start: 'top 82%' } })
      .from('[data-dx-quick-line]', { scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'power2.inOut' })
      .from('[data-dx-quick-card]', { y: 26, opacity: 0, stagger: 0.12 }, 0.1)

    gsap.from('[data-dx-libhead] > *', { y: 20, opacity: 0, stagger: 0.08, scrollTrigger: { trigger: '[data-dx-libhead]', start: 'top 85%' } })
    flipApi!.ScrollTrigger.batch('[data-dx-card]', {
      start: 'top 92%', once: true,
      onEnter: (els) => gsap.from(els, { y: 34, opacity: 0, scale: 0.97, duration: 0.7, stagger: 0.06, clearProps: 'transform,opacity' }),
    })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <main ref="root" class="dx-home">
    <section class="dx-wrap dx-hero">
      <div class="dx-banner" data-dx-banner>
        <div class="dx-banner__copy">
          <span class="dx-eyebrow dx-eyebrow--light" data-dx-fade><ApIcon name="book" /> Dokumentasi</span>
          <h1 class="dx-banner__title" :aria-label="title">
            <span v-for="(w, i) in title.split(' ')" :key="i" class="dx-word" aria-hidden="true"><span data-dx-word>{{ w }}</span></span>
          </h1>
          <p class="dx-banner__lead" data-dx-fade>Pilih widget untuk melihat kelebihannya, cara pakai langkah demi langkah, demo yang bisa dicoba, dan penjelasan setiap pengaturan di panel Elementor.</p>
          <div class="dx-banner__actions" data-dx-fade>
            <button type="button" class="dx-btn dx-btn--light" @click="searchOpen = true"><ApIcon name="search" /> Cari pengaturan</button>
            <a href="#widget" class="dx-btn dx-btn--ghost-light">Lihat semua widget <ApIcon name="arrow" /></a>
          </div>
        </div>
        <div class="dx-banner__orbit" data-dx-orbit aria-hidden="true">
          <span v-for="(k, i) in orbit" :key="k" class="dx-orb" :class="`dx-orb--${i + 1}`"><DocsIcon :k="k" /></span>
        </div>
      </div>

      <div class="dx-stats">
        <div v-for="s in stats" :key="s.label" class="dx-stat" data-dx-stat>
          <span class="dx-stat__ico"><ApIcon :name="s.icon" /></span>
          <b :data-dx-count="s.n">{{ s.n }}</b>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </section>

    <section class="dx-wrap dx-quick" data-dx-quick>
      <div class="dx-sechead">
        <span class="dx-eyebrow">Mulai cepat</span>
        <h2>Tiga langkah sebelum memakai widget</h2>
      </div>
      <div class="dx-quick__row">
        <i class="dx-quick__line" data-dx-quick-line aria-hidden="true"></i>
        <div v-for="(s, i) in quick" :key="s.title" class="dx-quick__card" data-dx-quick-card>
          <span class="dx-quick__num">{{ i + 1 }}</span>
          <span class="dx-quick__ico"><ApIcon :name="s.icon" /></span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </div>
      </div>
    </section>

    <section id="widget" class="dx-wrap dx-lib">
      <div class="dx-lib__head" data-dx-libhead>
        <div class="dx-sechead">
          <span class="dx-eyebrow">Widget</span>
          <h2>Pilih widget yang ingin dipelajari</h2>
        </div>
        <div class="dx-chips" role="tablist" aria-label="Filter kategori">
          <button
            v-for="c in categories" :key="c.key" type="button" role="tab" class="dx-chip" :class="{ 'is-on': filter === c.key }"
            :aria-selected="filter === c.key" @click="setFilter(c.key)"
          >
            {{ c.label }} <span>{{ counts[c.key] }}</span>
          </button>
        </div>
      </div>

      <div class="dx-grid">
        <NuxtLink
          v-for="d in docs" v-show="visible(d.cat)" :key="d.slug" :to="`/docs/${d.slug}`" class="dx-card"
          :data-flip-id="d.slug" data-dx-card @mouseenter="iconWiggle"
        >
          <span class="dx-card__top">
            <span class="dx-card__ico"><DocsIcon :k="d.key" /></span>
            <span class="dx-card__cat">{{ catLabel(d.cat) }}</span>
          </span>
          <b class="dx-card__title">{{ d.title }}</b>
          <span class="dx-card__text">{{ d.tagline }}</span>
          <span class="dx-card__foot">
            <span v-if="d.dest" class="dx-badge" :class="{ 'dx-badge--gold': d.mdundig }"><ApIcon :name="d.mdundig ? 'plug' : 'send'" /> {{ d.dest }}</span>
            <span v-else class="dx-badge"><ApIcon name="layers" /> {{ d.content.length }} grup pengaturan</span>
            <span class="dx-card__go" aria-hidden="true"><ApIcon name="arrow" /></span>
          </span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
