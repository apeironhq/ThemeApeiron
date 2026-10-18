<script setup lang="ts">
import { content as c } from '~/data/content'
</script>

<template>
  <header class="ap-nav" data-nav>
    <div class="ap-nav__inner">
      <ApLogo />

      <nav class="ap-nav__links" aria-label="Navigasi utama">
        <a v-for="item in c.nav" :key="item.href" :href="item.href">{{ item.label }}</a>
      </nav>

      <div class="ap-nav__cta">
        <a class="ap-btn ap-btn--ghost ap-btn--sm" :href="c.links.demo" target="_blank" rel="noopener" data-cursor="Chat">Minta Demo</a>
        <a class="ap-btn ap-btn--primary ap-btn--sm" :href="c.links.buy" data-magnetic>Beli Sekarang</a>
      </div>

      <button class="ap-nav__toggle" type="button" aria-label="Buka menu" aria-expanded="false" data-nav-toggle>
        <span></span><span></span>
      </button>
    </div>

    <div class="ap-nav__sheet" data-nav-sheet hidden>
      <a v-for="item in c.nav" :key="item.href" :href="item.href">{{ item.label }}</a>
      <a class="ap-btn ap-btn--primary" :href="c.links.buy">Beli Sekarang</a>
      <a class="ap-btn ap-btn--ghost" :href="c.links.demo" target="_blank" rel="noopener">Minta Demo</a>
    </div>
  </header>
</template>
