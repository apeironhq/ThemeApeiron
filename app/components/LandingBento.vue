<script setup lang="ts">
/**
 * Fitur unggulan sebagai satu jalur animasi: garis vertikal terisi mengikuti gulir,
 * tiap fitur punya ilustrasi bebas (tanpa kartu kotak). Animasi di assets/js/features.js.
 */
import { content as c } from '~/data/content'
import { widgets } from '~/data/widgets'
import { releases } from '~/data/changelog'

const b = c.bento
// Empat rilis terakhir, lama ke baru, untuk animasi nomor versi yang naik.
const versions = releases.slice(0, 4).map((r) => r.version).reverse()
const pad = (n: number) => String(n).padStart(2, '0')
const svgAttrs = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }

// Semua ikon widget di dua cincin orbit mengelilingi inti ApeironKit; ±40% di cincin dalam,
// sisanya di luar, jadi tata letaknya ikut menyesuaikan saat widget bertambah.
const innerCount = Math.round(widgets.length * 0.4)
const outerCount = widgets.length - innerCount
const orbit = widgets.map((w, i) => {
  const inner = i < innerCount
  const n = inner ? innerCount : outerCount
  const k = inner ? i : i - innerCount
  const r = inner ? 88 : 148
  const a = (k / n) * Math.PI * 2 - Math.PI / 2 + (inner ? 0 : Math.PI / n)
  return { ...w, style: { left: `${200 + r * Math.cos(a) - 22}px`, top: `${160 + r * Math.sin(a) - 22}px` } }
})

const wishes = [
  { ava: 'S', name: 'Sinta', tag: 'Hadir', text: 'Selamat menempuh hidup baru!', sticker: '61' },
  { ava: 'D', name: 'Dimas', tag: 'Berhalangan', text: 'Doa terbaik dari jauh.', sticker: '' },
  { ava: 'R', name: 'Rina', tag: 'Hadir', text: 'Serasi banget, bahagia selalu.', sticker: '97' },
  { ava: 'A', name: 'Andi', tag: 'Hadir', text: 'Sakinah, mawaddah, warahmah.', sticker: '' },
]
</script>

<template>
  <section class="ap-section ap-feat" data-feat>
    <DecoIcons set="features" />
    <div class="ap-container">
      <header class="ap-head ap-head--center">
        <h2 class="ap-title" data-split>{{ b.title }}</h2>
        <p class="ap-lead" data-reveal>{{ b.lead }}</p>
      </header>

      <div class="ap-feat__track" data-feat-track>
        <span class="ap-feat__rail" aria-hidden="true"><i data-feat-rail></i></span>

        <article v-for="(f, i) in b.features" :key="f.art" class="ap-feat__row" :class="{ 'is-flip': i % 2 === 1 }" data-feat-row>
          <span class="ap-feat__node" data-feat-node aria-hidden="true">{{ pad(i + 1) }}</span>

          <div class="ap-feat__art" data-feat-fit>
            <div class="ap-feat__stage" :data-feat-art="f.art" aria-hidden="true">
              <!-- 1. Semua widget mengorbit inti ApeironKit -->
              <template v-if="f.art === 'all'">
                <span class="ap-orb3__ring is-in"></span>
                <span class="ap-orb3__ring is-out"></span>
                <div class="ap-orb3__spin" data-orb-spin>
                  <span v-for="w in orbit" :key="w.key" class="ap-orb3__ico" :style="w.style" data-orb-ico :data-title="w.title">
                    <span class="ap-orb3__ico-in" data-orb-upright><svg v-bind="svgAttrs" v-html="w.icon" /></span>
                  </span>
                </div>
                <div class="ap-orb3__core" data-orb-core>
                  <svg viewBox="0 0 32 32"><path d="M16 3 4 29h5l7-16 7 16h5z" fill="currentColor" /><circle cx="16" cy="22" r="2.4" fill="currentColor" /></svg>
                  <b>ApeironKit</b>
                </div>
                <span class="ap-orb3__label" data-orb-label>{{ widgets.length }} widget</span>
              </template>

              <!-- 2. Ucapan mengalir + cincin kehadiran -->
              <template v-else-if="f.art === 'wish'">
                <div class="ap-wish__feed" data-wish-feed>
                  <div class="ap-wish__list" data-wish-list>
                    <div v-for="m in wishes" :key="m.name" class="ap-wish__msg">
                      <span class="ap-wish__ava">{{ m.ava }}</span>
                      <div>
                        <p><b>{{ m.name }}</b><em :class="{ 'is-absen': m.tag !== 'Hadir' }">{{ m.tag }}</em></p>
                        <p>{{ m.text }}</p>
                      </div>
                      <img v-if="m.sticker" :src="`/img/stickers/${m.sticker}.webp`" alt="" loading="lazy">
                    </div>
                  </div>
                </div>
                <div class="ap-wish__gauge">
                  <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" /><circle cx="60" cy="60" r="50" data-wish-ring /></svg>
                  <p><span class="ap-wish__num"><b data-wish-pct>0</b>%</span><small>Hadir</small></p>
                </div>
              </template>

              <!-- 3. Link tamu diketik, label nama ikut berganti -->
              <template v-else-if="f.art === 'guest'">
                <div class="ap-gtag__url"><ApIcon name="globe" /><span>raka-nadia.id/?to=</span><b data-gtag-param></b><i class="ap-gtag__caret"></i></div>
                <span class="ap-gtag__string"></span>
                <div class="ap-gtag__card" data-gtag-card>
                  <small>Kepada Yth.</small>
                  <b data-gtag-name>Bapak Andi Pratama</b>
                  <span>di tempat</span>
                </div>
              </template>

              <!-- 4. Pesawat kertas terbang dari form ke WhatsApp -->
              <template v-else-if="f.art === 'rsvp'">
                <svg class="ap-rsvp3__svg" viewBox="0 0 400 320"><path class="ap-rsvp3__path" data-rsvp-path d="M92 236 C 150 120, 240 300, 306 118" /></svg>
                <div class="ap-rsvp3__form" data-rsvp-form>
                  <span class="ap-rsvp3__ico"><ApIcon name="mail" /></span>
                  <p><b>Andi Pratama</b><span>2 orang · <em>Hadir</em></span></p>
                </div>
                <span class="ap-rsvp3__plane" data-rsvp-plane><svg viewBox="0 0 24 24"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" /></svg></span>
                <div class="ap-rsvp3__wa" data-rsvp-wa>
                  <p class="ap-rsvp3__wa-head"><ApIcon name="chat" />WhatsApp mempelai</p>
                  <div class="ap-rsvp3__bubble">
                    <p>Halo, saya Andi. Konfirmasi: Hadir (2 orang).</p>
                    <small>09.41 · <i class="tk" data-rsvp-ticks><span class="tk__a">Terkirim</span><span class="tk__b">Dibaca</span></i></small>
                  </div>
                </div>
              </template>

              <!-- 5. Perisai lisensi + versi yang terus naik -->
              <template v-else>
                <svg class="ap-lic__ring" viewBox="0 0 220 220" data-lic-ring><circle cx="110" cy="110" r="100" /><circle cx="110" cy="110" r="78" /></svg>
                <div class="ap-lic__shield" data-lic-shield>
                  <ApIcon name="shield" />
                  <span class="ap-lic__ok" data-lic-ok><ApIcon name="badge" /></span>
                </div>
                <div class="ap-lic__ver" data-lic-ver>
                  <div class="ap-lic__ver-track" data-lic-track>
                    <span v-for="v in versions" :key="v">v{{ v }}</span>
                  </div>
                  <em data-lic-badge>Terbaru</em>
                </div>
                <span class="ap-lic__chip" data-lic-chip><ApIcon name="refresh" />Pembaruan otomatis</span>
              </template>
            </div>
          </div>

          <div class="ap-feat__text" data-feat-text>
            <h3>{{ f.title }}</h3>
            <p>{{ f.text }}</p>
          </div>
        </article>
      </div>

      <div class="ap-stats" data-approach>
        <div v-for="s in c.stats" :key="s.label" class="ap-stat" data-reveal>
          <p class="ap-stat__num"><b :data-count="s.value">0</b>{{ s.suffix }}</p>
          <p class="ap-stat__label">{{ s.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
