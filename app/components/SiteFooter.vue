<script setup lang="ts">
import { site } from '~/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="pb-10">
    <div class="container-ap">
    <div class="flex flex-col gap-8 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-3">
        <span class="grid size-9 place-items-center rounded-lg bg-navy text-sm font-medium text-white">A</span>
        <div>
          <p class="font-medium">Apeiron</p>
          <p class="text-sm text-muted">{{ site.tagline }}</p>
        </div>
      </div>

      <nav class="flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted" aria-label="Footer">
        <a href="#fitur" class="hover:text-ink">Fitur</a>
        <a href="#widget" class="hover:text-ink">Widget</a>
        <a href="#keunggulan" class="hover:text-ink">Keunggulan</a>
        <a href="#faq" class="hover:text-ink">FAQ</a>
        <a :href="site.portalUrl" target="_blank" rel="noopener" class="hover:text-ink">Portal</a>
        <a :href="site.whatsappUrl" target="_blank" rel="noopener" class="hover:text-ink">WhatsApp</a>
        <a :href="site.telegramUrl" target="_blank" rel="noopener" class="hover:text-ink">Telegram</a>
      </nav>
    </div>
    </div>
    <p class="container-ap mt-8 text-xs text-muted">© {{ year }} Apeiron. Semua hak dilindungi.</p>
  </footer>
</template>
