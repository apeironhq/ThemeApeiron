<script setup lang="ts">
/**
 * Cara kerja: tiga langkah sebagai alur proses. Garis progres terisi dari langkah 1 ke 3,
 * kartu aktif terangkat dan memperagakan langkahnya. Animasi di assets/js/howto.js.
 */
import { content as c } from '~/data/content'
import { widgets } from '~/data/widgets'

const chips = ['± 2 menit', 'Tanpa kode', 'Link personal']
const svgAttrs = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }
const panelTiles = ['cover', 'countdown', 'audio', 'comment', 'registry', 'form'].map((k) => widgets.find((w) => w.key === k)!)
const guests = [['A', 'Bapak Andi', 'Andi'], ['S', 'Ibu Sari', 'Sari'], ['D', 'Sdr. Dimas', 'Dimas']]
</script>

<template>
  <section class="ap-section ap-steps ap-how" id="cara-kerja" data-howto>
    <DecoIcons set="steps" />
    <div class="ap-container">
      <header class="ap-head ap-head--center">
        <h2 class="ap-title" data-split>Tiga langkah, undangan siap dikirim.</h2>
        <p class="ap-lead" data-reveal>Dari plugin terpasang sampai link sampai di tangan tamu, semuanya bisa selesai di hari yang sama.</p>
      </header>

      <div class="ap-how__track" data-approach>
        <span class="ap-how__line" aria-hidden="true"><i data-how-line></i></span>

        <article v-for="(s, i) in c.steps" :key="s.title" class="ap-how__step" :class="{ 'is-on': i === 0 }" data-how-step>
          <span class="ap-how__node" data-how-node><b>{{ i + 1 }}</b><ApIcon name="check" /></span>

          <div class="ap-how__card">
            <div class="ap-how__art" aria-hidden="true">
              <!-- 1. Pasang plugin: layar Plugin WordPress -->
              <div v-if="i === 0" class="hw-wp" data-how-art="install">
                <div class="hw-wp__bar"><span class="hw-wp__logo">W</span><b>Plugin</b><span class="hw-wp__new">Tambah Baru</span></div>
                <div class="hw-wp__row">
                  <span class="hw-wp__ico"><svg viewBox="0 0 32 32"><path d="M16 3 4 29h5l7-16 7 16h5z" fill="currentColor" /><circle cx="16" cy="22" r="2.4" fill="currentColor" /></svg></span>
                  <p><b>ApeironKit</b><small>Versi 1.5.5 · Apeiron.ID</small></p>
                  <span class="hw-btn" data-activate><span class="hw-btn__a">Aktifkan</span><span class="hw-btn__b"><ApIcon name="check" /> Aktif</span></span>
                </div>
                <div class="hw-wp__lic" data-lic>
                  <ApIcon name="shield" />
                  <span class="hw-wp__key"><span data-key data-text="APK-7F2C-91XD"></span></span>
                  <i class="hw-ok" data-ok><ApIcon name="check" /></i>
                </div>
                <span class="hw-ready" data-ready><ApIcon name="layout" /> 13 widget siap di Elementor</span>
              </div>

              <!-- 2. Rancang di Elementor: seret widget, ganti warna -->
              <div v-else-if="i === 1" class="hw-ed" data-how-art="design">
                <div class="hw-ed__panel">
                  <span v-for="t in panelTiles" :key="t.key" class="hw-ed__tile" :data-tile="t.key"><svg v-bind="svgAttrs" v-html="t.icon" /></span>
                </div>
                <div class="hw-ed__page" data-page>
                  <p class="hw-ed__head" data-head>Raka &amp; Nadia</p>
                  <div class="hw-ed__slot" data-slot>
                    <div class="hw-ed__placed" data-placed><b>55</b><b>08</b><b>24</b><b>16</b></div>
                  </div>
                  <span class="hw-ed__sw"><i class="is-a" data-sw="#083c57"></i><i class="is-b" data-sw="#9a7339"></i><i class="is-c" data-sw="#b24a63"></i></span>
                </div>
                <span class="hw-ed__ghost" data-ghost></span>
                <span class="hw-cursor" data-cursor><svg viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6z" /></svg></span>
              </div>

              <!-- 3. Bagikan ke tamu: kirim link personal via WhatsApp -->
              <div v-else class="hw-share" data-how-art="share">
                <div v-for="g in guests" :key="g[0]" class="hw-guest" data-guest>
                  <span class="hw-ava">{{ g[0] }}</span>
                  <p><b>{{ g[1] }}</b><small>…/?to={{ g[2] }}</small></p>
                  <span class="hw-send" data-send><span class="hw-send__a"><ApIcon name="send" /> Kirim</span><span class="hw-send__b">Terkirim ✓✓</span></span>
                </div>
                <span class="hw-rsvp"><ApIcon name="chat" /> RSVP masuk <b data-rsvp>0</b></span>
              </div>
            </div>

            <div class="ap-how__body">
              <div class="ap-how__meta"><span>Langkah {{ i + 1 }}</span><em>{{ chips[i] }}</em></div>
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
