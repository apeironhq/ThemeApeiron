<script setup lang="ts">
/**
 * Kerangka /docs bergaya dashboard MDUNDIG: sidebar berisi semua widget per kategori,
 * bilah atas 60px dengan pencarian (Ctrl+K), lalu isi halaman.
 * Layout ini tetap terpasang saat berpindah antar-widget, jadi navigasi terasa instan.
 */
import '~/assets/css/docs.css'
import { docs, categories } from '~/data/docs'

const route = useRoute()
const searchOpen = useState('dx-search', () => false)
const sideOpen = ref(false)
const isMac = ref(false)

const groups = categories.filter((c) => c.key !== 'semua').map((c) => ({ ...c, items: docs.filter((d) => d.cat === c.key) }))
const isActive = (path: string) => route.path === path

function onKey(e: KeyboardEvent) {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? '')
  if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    searchOpen.value = !searchOpen.value
  } else if (e.key === '/' && !typing && !searchOpen.value) {
    e.preventDefault()
    searchOpen.value = true
  } else if (e.key === 'Escape') sideOpen.value = false
}

watch(() => route.path, () => (sideOpen.value = false))
watch(sideOpen, (v) => document.documentElement.classList.toggle('dx-lock', v))

onMounted(() => {
  isMac.value = /Mac|iPhone|iPad/.test(navigator.platform)
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('dx-lock')
})

useHead({ bodyAttrs: { class: 'dx-body' } })
</script>

<template>
  <div class="dx">
    <div v-if="sideOpen" class="dx-overlay" aria-hidden="true" @click="sideOpen = false" />

    <aside class="dx-side" :class="{ 'is-open': sideOpen }" aria-label="Navigasi dokumentasi">
      <div class="dx-side__brand">
        <span class="dx-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32"><path d="M16 3 4 29h5l7-16 7 16h5z" fill="currentColor" /><circle cx="16" cy="22" r="2.4" fill="currentColor" /></svg>
        </span>
        <span class="dx-side__name">
          <strong>ApeironKit</strong>
          <small>Dokumentasi Widget</small>
        </span>
        <button type="button" class="dx-side__close" aria-label="Tutup menu" @click="sideOpen = false"><ApIcon name="plus" /></button>
      </div>

      <nav class="dx-side__nav">
        <p class="dx-nav-label">Mulai</p>
        <NuxtLink to="/docs" class="dx-nav-item" :class="{ 'is-active': isActive('/docs') }" :aria-current="isActive('/docs') ? 'page' : undefined">
          <ApIcon name="layout" /><span>Ringkasan</span><span class="dx-nav-count">{{ docs.length }}</span>
        </NuxtLink>

        <template v-for="g in groups" :key="g.key">
          <p class="dx-nav-label dx-nav-label--gap">{{ g.label }}</p>
          <NuxtLink
            v-for="d in g.items" :key="d.slug" :to="`/docs/${d.slug}`" class="dx-nav-item"
            :class="{ 'is-active': isActive(`/docs/${d.slug}`) }" :aria-current="isActive(`/docs/${d.slug}`) ? 'page' : undefined"
          >
            <DocsIcon :k="d.key" /><span>{{ d.title }}</span>
            <span v-if="d.mdundig" class="dx-nav-dot" title="Terhubung ke MDUNDIG" aria-label="Terhubung ke MDUNDIG"></span>
          </NuxtLink>
        </template>
      </nav>

      <div class="dx-side__foot">
        <a href="/" class="dx-nav-item"><ApIcon name="globe" /><span>Situs utama</span></a>
      </div>
    </aside>

    <div class="dx-main">
      <header class="dx-top">
        <button type="button" class="dx-burger" aria-label="Buka menu" @click="sideOpen = true">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <NuxtLink to="/docs" class="dx-top__logo" aria-label="Dokumentasi ApeironKit">
          <span class="dx-mark dx-mark--sm" aria-hidden="true">
            <svg viewBox="0 0 32 32"><path d="M16 3 4 29h5l7-16 7 16h5z" fill="currentColor" /><circle cx="16" cy="22" r="2.4" fill="currentColor" /></svg>
          </span>
        </NuxtLink>
        <button class="dx-search-btn" type="button" aria-label="Cari dokumentasi" @click="searchOpen = true">
          <ApIcon name="search" />
          <span class="dx-search-btn__label">Cari widget, fitur, atau pengaturan…</span>
          <kbd>{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
        </button>
        <a href="/#harga" class="dx-btn dx-btn--primary dx-btn--sm dx-top__buy">Beli</a>
        <div class="dx-progress" aria-hidden="true"><i data-dx-progress></i></div>
      </header>

      <div class="dx-scroll">
        <slot />
        <footer class="dx-foot">
          <span>© {{ new Date().getFullYear() }} ApeironKit · Plugin Elementor untuk undangan digital</span>
          <span class="dx-foot__links"><a href="/">Situs utama</a><NuxtLink to="/docs">Semua widget</NuxtLink></span>
        </footer>
      </div>
    </div>

    <DocsSearch v-model:open="searchOpen" />
  </div>
</template>
