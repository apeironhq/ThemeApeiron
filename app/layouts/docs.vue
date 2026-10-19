<script setup lang="ts">
/**
 * Kerangka /docs: bilah atas (logo, pencarian Ctrl+K, tautan ke situs), isi halaman, dan kaki.
 * Layout ini tetap terpasang saat berpindah antar-widget, jadi navigasi terasa instan.
 */
import '~/assets/css/docs.css'

const searchOpen = useState('dx-search', () => false)
const isMac = ref(false)

function onKey(e: KeyboardEvent) {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? '')
  if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    searchOpen.value = !searchOpen.value
  } else if (e.key === '/' && !typing && !searchOpen.value) {
    e.preventDefault()
    searchOpen.value = true
  }
}

onMounted(() => {
  isMac.value = /Mac|iPhone|iPad/.test(navigator.platform)
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

useHead({ bodyAttrs: { class: 'dx-body' } })
</script>

<template>
  <div class="dx">
    <header class="dx-top">
      <div class="dx-top__in">
        <NuxtLink to="/docs" class="dx-brand" aria-label="Dokumentasi ApeironKit">
          <span class="dx-brand__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32"><path d="M16 3 4 29h5l7-16 7 16h5z" fill="currentColor" /><circle cx="16" cy="22" r="2.4" fill="currentColor" /></svg>
          </span>
          <span class="dx-brand__text">Apeiron<em>Kit</em></span>
          <span class="dx-brand__tag">Docs</span>
        </NuxtLink>

        <button class="dx-search-btn" type="button" aria-label="Cari dokumentasi" @click="searchOpen = true">
          <ApIcon name="search" />
          <span class="dx-search-btn__label">Cari widget atau pengaturan…</span>
          <kbd>{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
        </button>

        <nav class="dx-top__links">
          <a href="/" class="dx-link">Situs utama</a>
          <a href="/#harga" class="dx-btn dx-btn--navy dx-btn--sm">Beli</a>
        </nav>
      </div>
      <div class="dx-progress" aria-hidden="true"><i data-dx-progress></i></div>
    </header>

    <slot />

    <footer class="dx-foot">
      <div class="dx-wrap dx-foot__in">
        <span>© {{ new Date().getFullYear() }} ApeironKit · Plugin Elementor untuk undangan digital</span>
        <span class="dx-foot__links"><a href="/">Situs utama</a><NuxtLink to="/docs">Semua widget</NuxtLink></span>
      </div>
    </footer>

    <DocsSearch v-model:open="searchOpen" />
  </div>
</template>
