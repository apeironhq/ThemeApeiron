<script setup lang="ts">
import { content as c } from '~/data/content'
</script>

<template>
  <section class="ap-cta" data-cta>
    <div class="ap-cta__bg" aria-hidden="true"><span class="ap-orb ap-orb--a"></span><span class="ap-orb ap-orb--b"></span></div>
    <div class="ap-container ap-cta__inner">
      <!-- Ornamen: dua cincin pernikahan bertaut, diapit garis & berlian emas -->
      <svg class="ap-cta__rings" viewBox="0 0 240 60" aria-hidden="true" data-cta-rings>
        <path class="is-line" data-orn-line="l" d="M82 30 H12" />
        <path class="is-line" data-orn-line="r" d="M158 30 H228" />
        <path class="is-fill" data-orn-gem d="M90 26.5 93.5 30 90 33.5 86.5 30z" />
        <path class="is-fill" data-orn-gem d="M150 26.5 153.5 30 150 33.5 146.5 30z" />
        <circle data-orn-ring cx="112" cy="31" r="13" />
        <circle data-orn-ring cx="128" cy="31" r="13" />
        <path class="is-fill" data-orn-stone d="M128 11.5 131.5 15 128 18.5 124.5 15z" />
        <path class="is-spark" data-orn-spark d="M146 9v7M142.5 12.5h7" />
      </svg>
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
