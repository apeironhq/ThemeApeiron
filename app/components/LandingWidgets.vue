<script setup lang="ts">
/**
 * 13 widget seperti tampil di panel Elementor (kategori "Apeiron Kit").
 * Kursor menyeret tile dari panel ke kanvas, lalu widget memperagakan fungsinya.
 * Animasinya ada di assets/js/widgets.js.
 */
import { widgets } from '~/data/widgets'

const pad = (n: number) => String(n).padStart(2, '0')
const svgAttrs = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }
</script>

<template>
  <section class="ap-section ap-wlib" id="widget" data-wlib>
    <div class="ap-container ap-wlib__inner" data-wlib-inner>
      <div class="ap-wlib__copy">
        <header class="ap-head">
          <h2 class="ap-title" data-split>13 widget, langsung muncul di panel Elementor.</h2>
          <p class="ap-lead" data-reveal>Seret widget dari panel ke halaman, lalu lihat langsung cara kerjanya. Semua diatur dari Elementor, tanpa kode.</p>
        </header>

        <div class="ap-wlib__stage" data-reveal>
          <!-- Kanvas: tempat widget "dilepas" dan memperagakan fungsinya -->
          <div class="ap-wlib__canvas" data-wlib-canvas aria-hidden="true">
            <div v-for="(w, i) in widgets" :key="w.key" class="ap-wlib__demo" :class="{ 'is-active': i === 0 }" data-wlib-demo :data-key="w.key">
              <WidgetDemo :k="w.key" />
            </div>
            <span class="ap-wlib__drop" data-wlib-drop><ApIcon name="plus" />Lepas widget di sini</span>
            <span class="wd-tap" data-wlib-tap></span>
          </div>

          <div class="ap-wlib__infos">
            <article v-for="(w, i) in widgets" :key="w.key" class="ap-wlib__info" :class="{ 'is-active': i === 0 }" data-wlib-info :data-key="w.key">
              <div class="ap-wlib__info-top">
                <span class="ap-wlib__chip" data-wlib-icon :data-key="w.key"><svg v-bind="svgAttrs" v-html="w.icon" /></span>
                <h3>{{ w.title }}</h3>
                <span class="ap-wlib__count"><b>{{ pad(i + 1) }}</b> / {{ widgets.length }}</span>
              </div>
              <p>{{ w.desc }}</p>
              <span v-if="w.dest" class="ap-wlib__dest"><ApIcon name="arrow" />{{ w.dest }}</span>
            </article>
          </div>
          <div class="ap-wlib__progress" aria-hidden="true"><i data-wlib-progress></i></div>
        </div>
      </div>

      <!-- Mockup panel widget Elementor -->
      <div class="ap-epanel" data-wlib-panel>
        <div class="ap-epanel__bar">
          <span class="ap-epanel__burger" aria-hidden="true"><i></i><i></i><i></i></span>
          <b>Elementor</b>
          <span class="ap-epanel__apps" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        </div>
        <div class="ap-epanel__tabs"><span class="is-on">Elemen</span><span>Global</span></div>
        <div class="ap-epanel__search"><ApIcon name="search" /><span>Cari Widget...</span></div>
        <p class="ap-epanel__cat"><i aria-hidden="true"></i>Apeiron Kit</p>
        <div class="ap-epanel__grid" role="list">
          <button v-for="(w, i) in widgets" :key="w.key" type="button" role="listitem" class="ap-epanel__tile" :class="{ 'is-active': i === 0 }" data-wlib-tile :data-key="w.key" :aria-label="`Lihat peragaan ${w.title}`">
            <span class="ap-epanel__ico" data-wlib-icon :data-key="w.key"><svg v-bind="svgAttrs" v-html="w.icon" /></span>
            <span class="ap-epanel__label">{{ w.title }}</span>
          </button>
        </div>
      </div>

      <!-- Kursor tur & tile yang sedang diseret (melintas dari panel ke kanvas) -->
      <span class="ap-wlib__ghost" data-wlib-ghost aria-hidden="true"></span>
      <span class="ap-epanel__cursor" data-wlib-cursor aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6z" /></svg></span>
    </div>
  </section>
</template>
