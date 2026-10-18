<script setup lang="ts">
import { content as c } from '~/data/content'
</script>

<template>
  <section class="ap-cta" data-cta>
    <div class="ap-cta__bg" aria-hidden="true"><span class="ap-orb ap-orb--a"></span><span class="ap-orb ap-orb--b"></span></div>
    <div class="ap-container ap-cta__inner">
      <svg class="ap-cta__ornament" viewBox="0 0 200 60" aria-hidden="true"><path data-draw d="M10 50 C 50 10, 80 10, 100 30 C 120 10, 150 10, 190 50" /></svg>
      <h2 class="ap-cta__title" data-split>{{ c.cta.title }}</h2>
      <p class="ap-cta__lead" data-reveal>{{ c.cta.lead }}</p>
      <div class="ap-cta__actions" data-reveal>
        <a class="ap-btn ap-btn--light ap-btn--lg" :href="c.links.buy" data-magnetic>Beli Sekarang <ApIcon name="arrow" /></a>
        <a class="ap-btn ap-btn--outline-light ap-btn--lg" :href="c.links.demo" target="_blank" rel="noopener" data-cursor="Chat"><ApIcon name="chat" /> Minta Demo</a>
        <a class="ap-btn ap-btn--text-light" :href="c.links.live" data-cursor="Lihat">Lihat contoh undangan <ApIcon name="arrow" /></a>
      </div>
    </div>
  </section>
</template>
