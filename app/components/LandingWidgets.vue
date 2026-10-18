<script setup lang="ts">
/**
 * 13 widget di dalam tampilan editor Elementor: panel widget di kiri, halaman di kanan.
 * Kursor menyeret tile ke halaman, widget terpilih (garis seleksi + label Edit),
 * lalu memperagakan fungsinya. Animasinya ada di assets/js/widgets.js.
 */
import { widgets } from '~/data/widgets'

const pad = (n: number) => String(n).padStart(2, '0')
const svgAttrs = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }
</script>

<template>
  <section class="ap-section ap-wlib" id="widget" data-wlib>
    <DecoIcons set="widgets" />
    <div class="ap-container">
      <header class="ap-head ap-head--center">
        <h2 class="ap-title" data-split>13 widget, langsung muncul di panel Elementor.</h2>
        <p class="ap-lead" data-reveal>Seret widget dari panel ke halaman, lalu lihat langsung cara kerjanya. Semua diatur dari Elementor, tanpa kode.</p>
      </header>

      <div class="ap-ed" data-wlib-inner data-approach data-approach-end="top 58%">
        <!-- Top bar editor -->
        <div class="ap-ed__bar">
          <span class="ap-ed__brand"><span class="ap-epanel__burger" aria-hidden="true"><i></i><i></i><i></i></span><b>Elementor</b></span>
          <span class="ap-ed__page"><ApIcon name="layout" />Undangan Raka &amp; Nadia</span>
          <span class="ap-ed__actions"><span class="ap-ed__ghostbtn">Pratinjau</span><span class="ap-ed__save">Perbarui</span></span>
        </div>

        <div class="ap-ed__body">
          <!-- Panel widget -->
          <aside class="ap-epanel" data-wlib-panel>
            <div class="ap-epanel__tabs"><span class="is-on">Elemen</span><span>Global</span></div>
            <div class="ap-epanel__search"><ApIcon name="search" /><span>Cari Widget...</span></div>
            <p class="ap-epanel__cat"><i aria-hidden="true"></i>Apeiron Kit</p>
            <div class="ap-epanel__grid" role="list">
              <button v-for="(w, i) in widgets" :key="w.key" type="button" role="listitem" class="ap-epanel__tile" :class="{ 'is-active': i === 0 }" data-wlib-tile :data-key="w.key" :aria-label="`Lihat peragaan ${w.title}`">
                <span class="ap-epanel__ico" data-wlib-icon :data-key="w.key"><svg v-bind="svgAttrs" v-html="w.icon" /></span>
                <span class="ap-epanel__label">{{ w.title }}</span>
              </button>
            </div>
          </aside>

          <!-- Halaman yang sedang disunting -->
          <div class="ap-ed__page-area">
            <div class="ap-wlib__canvas" data-wlib-canvas aria-hidden="true">
              <div class="ap-wlib__slot" data-wlib-slot>
                <span class="ap-wlib__edit" data-wlib-edit><ApIcon name="wrench" /><b data-wlib-edit-name>Edit Hitung Mundur</b></span>
                <div v-for="(w, i) in widgets" :key="w.key" class="ap-wlib__demo" :class="{ 'is-active': i === 0 }" data-wlib-demo :data-key="w.key">
                  <WidgetDemo :k="w.key" />
                </div>
                <span class="ap-wlib__drop" data-wlib-drop><span><ApIcon name="plus" /></span>Lepas widget di sini</span>
                <span class="wd-tap" data-wlib-tap></span>
              </div>
            </div>

            <div class="ap-wlib__infos">
              <div class="ap-wlib__progress" aria-hidden="true"><i data-wlib-progress></i></div>
              <article v-for="(w, i) in widgets" :key="w.key" class="ap-wlib__info" :class="{ 'is-active': i === 0 }" data-wlib-info :data-key="w.key">
                <span class="ap-wlib__chip" data-wlib-icon :data-key="w.key"><svg v-bind="svgAttrs" v-html="w.icon" /></span>
                <div>
                  <h3>{{ w.title }}<span class="ap-wlib__count"><b>{{ pad(i + 1) }}</b> / {{ widgets.length }}</span></h3>
                  <p>{{ w.desc }}</p>
                  <span v-if="w.dest" class="ap-wlib__dest"><ApIcon name="arrow" />{{ w.dest }}</span>
                </div>
              </article>
            </div>
          </div>
        </div>


        <!-- Kursor tur & tile yang sedang diseret -->
        <span class="ap-wlib__ghost" data-wlib-ghost aria-hidden="true"></span>
        <span class="ap-epanel__cursor" data-wlib-cursor aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6z" /></svg></span>
      </div>
    </div>
  </section>
</template>
