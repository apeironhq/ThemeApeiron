<script setup lang="ts">
import { content as c } from '~/data/content'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="ap-footer">
    <div class="ap-container ap-footer__inner">
      <div>
        <ApLogo light />
        <p>Plugin Elementor untuk undangan digital yang modern dan profesional.</p>
      </div>
      <nav aria-label="Tautan footer">
        <a v-for="item in c.nav" :key="item.href" :href="item.href">{{ item.label }}</a>
        <a :href="c.links.docs">Dokumentasi</a>
      </nav>
    </div>
    <div class="ap-container ap-footer__bottom">
      <span>© {{ year }} Apeiron.ID. Hak cipta dilindungi.</span>
      <span>Dibuat dengan ApeironKit &amp; GSAP</span>
    </div>
  </footer>
</template>
