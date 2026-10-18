<script setup lang="ts">
import { content as c } from '~/data/content'
import sealRaw from '~/assets/svg/seal-medallion.svg?raw'
import tagRaw from '~/assets/svg/guest-tag.svg?raw'

const h = c.hero
// Warna ornamen Cover Classic disesuaikan dengan brand (#083C57 + emas).
const sealVars = {
  'seal-color-light': '#145c82',
  'seal-color': '#083c57',
  'seal-color-dark': '#03202f',
  'seal-ring-light': '#0f4d6e',
  'seal-ring': '#062f46',
  'seal-ring-dark': '#021a27',
}
</script>

<template>
  <section class="ap-hero" data-hero>
    <div class="ap-hero__bg" aria-hidden="true">
      <span class="ap-orb ap-orb--a" data-speed="0.7"></span>
      <span class="ap-orb ap-orb--b" data-speed="0.85"></span>
      <span class="ap-grid-lines"></span>
    </div>

    <div class="ap-container ap-hero__inner">
      <div class="ap-hero__copy">
        <h1 class="ap-hero__title" data-split-hero>{{ h.title }}</h1>
        <p class="ap-hero__lead">{{ h.lead }}</p>
        <div class="ap-hero__actions" data-hero-fade>
          <a class="ap-btn ap-btn--light" :href="c.links.buy" data-magnetic>Beli Sekarang <ApIcon name="arrow" /></a>
          <a class="ap-btn ap-btn--outline-light" :href="c.links.demo" target="_blank" rel="noopener" data-cursor="Chat"><ApIcon name="chat" /> Minta Demo</a>
        </div>
        <p class="ap-hero__note" data-hero-fade><span><ApIcon name="layout" /> Native Elementor</span><span><ApIcon name="code" /> Tanpa coding</span><span><ApIcon name="refresh" /> Update rutin</span></p>
      </div>

      <div class="ap-hero__stage" data-tilt-stage>
        <div class="ap-gate-wrap" data-tilt-target>
          <div class="ap-gate" data-gate style="--paper: url('/img/bg.webp')">
            <!-- Isi undangan (terlihat setelah pintu terbuka) -->
            <div class="ap-gate__inside" data-gate-inside>
              <p class="ap-gate__kicker">The Wedding of</p>
              <p class="ap-gate__names" data-gate-names>{{ h.couple }}</p>
              <p class="ap-gate__date">{{ h.date }}</p>
              <div class="ap-countdown" data-countdown="2026-12-12T09:00:00+07:00">
                <div><strong data-cd="d">00</strong><span>Hari</span></div>
                <div><strong data-cd="h">00</strong><span>Jam</span></div>
                <div><strong data-cd="m">00</strong><span>Menit</span></div>
                <div><strong data-cd="s">00</strong><span>Detik</span></div>
              </div>
              <button class="ap-gate__close" type="button" data-gate-close data-cursor="Tutup">Tutup sampul</button>
            </div>

            <!-- Pintu kiri & kanan -->
            <div class="ap-gate__door ap-gate__door--l" data-gate-door="l">
              <div class="ap-gate__face ap-gate__face--front"><span class="ap-gate__ribbon"></span><span class="ap-gate__shine" data-glare></span></div>
              <div class="ap-gate__face ap-gate__face--back"></div>
            </div>
            <div class="ap-gate__door ap-gate__door--r" data-gate-door="r">
              <div class="ap-gate__face ap-gate__face--front"><span class="ap-gate__ribbon"></span><span class="ap-gate__shine" data-glare></span></div>
              <div class="ap-gate__face ap-gate__face--back"></div>
            </div>

            <!-- Segel + label tamu -->
            <button class="ap-gate__seal" type="button" data-gate-open data-cursor="Buka" aria-label="Buka undangan">
              <span class="ap-gate__seal-glow" aria-hidden="true"></span>
              <ApInlineSvg :raw="sealRaw" :vars="sealVars" extra-class="ap-gate__seal-svg" />
              <span class="ap-gate__seal-text"><b>{{ h.initials }}</b><small>Buka Undangan</small></span>
            </button>
            <div class="ap-gate__tag" data-gate-tag>
              <span class="ap-gate__string" aria-hidden="true"></span>
              <div class="ap-gate__tag-card">
                <ApInlineSvg :raw="tagRaw" extra-class="ap-gate__tag-svg" />
                <span class="ap-gate__tag-text"><b>Kepada Yth.</b><small>{{ h.guest }}</small></span>
              </div>
            </div>
          </div>
          <span class="ap-gate__shadow" aria-hidden="true"></span>
          <!-- Chip menempel di tepi kartu, ikut miring bersama kartu -->
          <div class="ap-chip ap-chip--a" data-chip data-depth="40"><ApIcon name="chat" /> RSVP ke WhatsApp <b>+12</b></div>
          <div class="ap-chip ap-chip--b" data-chip data-depth="70"><ApIcon name="music" /> Musik diputar</div>
          <div class="ap-chip ap-chip--c" data-chip data-depth="55"><ApIcon name="gift" /> Hadiah dipilih</div>
          <div class="ap-chip ap-chip--d" data-chip data-depth="30"><ApIcon name="heart" /> 248 ucapan</div>
        </div>

        <p class="ap-hero__hint" data-hero-fade>Klik segel untuk membuka ✦</p>
      </div>
    </div>

    <div class="ap-marquee" aria-label="Daftar widget">
      <div class="ap-marquee__track" data-marquee>
        <template v-for="i in 2" :key="i">
          <span v-for="item in c.marquee" :key="item" class="ap-marquee__item" :aria-hidden="i > 1 ? 'true' : undefined">{{ item }}</span>
        </template>
      </div>
    </div>
  </section>
</template>
