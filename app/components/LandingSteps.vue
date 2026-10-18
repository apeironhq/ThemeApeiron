<script setup lang="ts">
import { content as c } from '~/data/content'
</script>

<template>
  <section class="ap-section ap-steps" id="cara-kerja" data-steps>
    <DecoIcons set="steps" />
    <div class="ap-container">
      <header class="ap-head ap-head--center">
        <h2 class="ap-title" data-split>Tiga langkah, undangan siap dikirim.</h2>
      </header>
      <div class="ap-steps__track" data-approach>
        <svg class="ap-steps__line" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
          <path data-steps-line d="M0 20 C 160 0, 340 40, 500 20 S 840 0, 1000 20" />
        </svg>
        <article v-for="(s, i) in c.steps" :key="s.title" class="ap-step" data-step>
          <div class="ap-step__art" :class="`ap-step__art--${i}`" :data-step-art="i" aria-hidden="true">
            <template v-if="i === 0">
              <!-- Pasang plugin: steker masuk soket, tombol aktif menyala -->
              <svg class="ap-plug" viewBox="0 0 120 90">
                <rect class="ap-plug__socket" x="40" y="8" width="40" height="22" rx="6" />
                <path class="ap-plug__hole" d="M54 16v6M66 16v6" />
                <g class="ap-plug__body" data-plug>
                  <path class="ap-plug__pins" d="M54 30v8M66 30v8" />
                  <rect class="ap-plug__head" x="46" y="38" width="28" height="18" rx="6" />
                  <path class="ap-plug__cord" d="M60 56v10c0 8 -14 6 -14 14" />
                </g>
                <path class="ap-plug__spark" data-spark d="M34 18h-8M86 18h8M38 6l-5 -4M82 6l5 -4" />
              </svg>
              <span class="ap-toggle" data-toggle><i></i></span>
              <span class="ap-step__status" data-status>Aktif</span>
            </template>
            <template v-else-if="i === 1">
              <!-- Rancang: kursor menyeret blok, warna berubah -->
              <div class="ap-canvas">
                <span class="ap-canvas__bar"></span>
                <span class="ap-canvas__slot"></span>
                <span class="ap-canvas__block" data-block></span>
                <span class="ap-canvas__sw"><i class="is-a" data-swatch></i><i class="is-b"></i><i class="is-c"></i></span>
                <span class="ap-canvas__cursor" data-cursor-art><ApIcon name="cursor" /></span>
              </div>
            </template>
            <template v-else>
              <!-- Bagikan: pesawat kertas terbang ke tamu -->
              <svg class="ap-send" viewBox="0 0 120 90">
                <path class="ap-send__trail" data-trail d="M14 70 C 40 70, 50 30, 96 24" />
                <g class="ap-send__plane" data-plane><path d="M0 -8 L18 0 L0 8 L4 0 Z" /></g>
              </svg>
              <span class="ap-send__guests"><i>A</i><i>S</i><i>D</i></span>
              <span class="ap-step__status ap-step__status--count" data-sent>+3 tamu</span>
            </template>
          </div>
          <span class="ap-step__num">{{ i + 1 }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
          <!-- Penghubung vertikal ke langkah berikutnya (tampil di HP) -->
          <svg v-if="i < c.steps.length - 1" class="ap-step__link" viewBox="0 0 24 64" aria-hidden="true"><path data-step-link d="M12 2 C 3 20, 21 42, 12 60" /><circle class="ap-step__link-dot" data-step-link-dot cx="12" cy="60" r="3.5" /></svg>
        </article>
      </div>
    </div>
  </section>
</template>
