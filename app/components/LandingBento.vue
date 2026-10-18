<script setup lang="ts">
import { content as c } from '~/data/content'

const b = c.bento
const apkWidgets = [['layers', 'Sampul'], ['clock', 'Countdown'], ['users', 'RSVP'], ['music', 'Musik'], ['chat', 'Ucapan'], ['gift', 'Daftar Hadiah'], ['heart', 'Cerita Cinta'], ['copy', 'Amplop'], ['tag', 'Nama Tamu'], ['mail', 'Form Order'], ['refresh', 'Auto Scroll'], ['sparkle', 'Page Loader'], ['zap', 'Social Proof']]
const guests = ['AP', 'SN', 'DM', 'RK', 'NL', 'BY']
</script>

<template>
  <section class="ap-section ap-bento" data-bento>
    <div class="ap-container">
      <header class="ap-head ap-head--center">
        <h2 class="ap-title" data-split>{{ b.title }}</h2>
        <p class="ap-lead" data-reveal>{{ b.lead }}</p>
      </header>

      <div class="ap-bento__grid">
        <!-- A: semua widget menyatu -->
        <article class="ap-card ap-card--a" data-card>
          <div class="ap-card__art ap-art-connect" data-art-connect>
            <div class="ap-art-connect__rail">
              <div class="ap-art-connect__track" data-connect-track>
                <template v-for="k in 2" :key="k">
                  <span v-for="w in apkWidgets" :key="w[1]" class="ap-pill" :aria-hidden="k > 1 ? 'true' : undefined"><ApIcon :name="w[0]" /> {{ w[1] }}</span>
                </template>
              </div>
            </div>
            <svg class="ap-art-connect__lines" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
              <path data-draw d="M50 0 C50 40, 200 30, 200 90" />
              <path data-draw d="M150 0 C150 40, 200 40, 200 90" />
              <path data-draw d="M250 0 C250 40, 200 40, 200 90" />
              <path data-draw d="M350 0 C350 40, 200 30, 200 90" />
            </svg>
            <span class="ap-node"><ApIcon name="sparkle" /> ApeironKit</span>
            <div class="ap-art-connect__status">
              <ApIcon name="sparkle" />
              <span data-typing="Menyusun undangan Raka &amp; Nadia… selesai dalam 10 menit.">&nbsp;</span>
            </div>
          </div>
          <h3>Satu plugin, semua kebutuhan</h3>
          <p>13 widget yang saling melengkapi, tanpa perlu menumpuk banyak plugin berbeda.</p>
        </article>

        <!-- B: dashboard -->
        <article class="ap-card ap-card--b" data-card>
          <div class="ap-card__art ap-art-dash">
            <div class="ap-dash">
              <div class="ap-dash__head">
                <span class="ap-dash__logo"><ApIcon name="heart" /></span>
                <div><b>Undangan Raka &amp; Nadia</b><small>raka-nadia.undangan.id</small></div>
                <nav><span class="is-on">RSVP</span><span>Ucapan</span><span>Tamu</span></nav>
              </div>
              <div class="ap-dash__body">
                <div class="ap-dash__chart">
                  <small>Konfirmasi hadir</small>
                  <p class="ap-dash__num"><b data-count="248">0</b> <span class="ap-badge">+32%</span></p>
                  <svg viewBox="0 0 300 90" preserveAspectRatio="none" aria-hidden="true">
                    <defs><linearGradient id="apArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#083C57" stop-opacity=".18" /><stop offset="1" stop-color="#083C57" stop-opacity="0" /></linearGradient></defs>
                    <path class="ap-dash__area" d="M0 80 C40 75, 60 62, 100 58 S160 40, 200 36 S260 14, 300 10 V90 H0Z" fill="url(#apArea)" />
                    <path class="ap-dash__line" data-draw d="M0 80 C40 75, 60 62, 100 58 S160 40, 200 36 S260 14, 300 10" />
                    <path class="ap-dash__line ap-dash__line--soft" data-draw d="M0 86 C50 84, 80 76, 120 72 S190 62, 230 56 S280 44, 300 40" />
                  </svg>
                </div>
                <div class="ap-dash__side">
                  <small>Kehadiran</small>
                  <p class="ap-dash__num"><b data-count="82">0</b>%</p>
                  <div class="ap-dash__bars"><i data-bar style="--w:82%"></i><i data-bar style="--w:18%"></i></div>
                  <div class="ap-dash__legend"><span>Hadir</span><span>Berhalangan</span></div>
                </div>
              </div>
            </div>
          </div>
          <h3>Pantau semuanya di satu tempat</h3>
          <p>RSVP, ucapan, dan daftar tamu terkumpul rapi. Klien bisa memantau tanpa bertanya terus.</p>
        </article>

        <!-- C: tamu personal -->
        <article class="ap-card ap-card--c" data-card>
          <div class="ap-card__art ap-art-orbit">
            <div class="ap-orbit" data-orbit>
              <span class="ap-orbit__ring"></span><span class="ap-orbit__ring"></span><span class="ap-orbit__ring"></span>
              <span v-for="(initial, i) in guests" :key="initial" class="ap-orbit__guest" :style="{ '--a': i * 60 + 'deg' }"><b>{{ initial }}</b></span>
              <span class="ap-orbit__core"><ApIcon name="users" /></span>
            </div>
          </div>
          <h3>Nama tamu personal</h3>
          <p>Setiap tamu mendapat link sendiri dengan namanya tampil di sampul.</p>
        </article>

        <!-- D: alur otomatis -->
        <article class="ap-card ap-card--d" data-card>
          <div class="ap-card__art ap-art-flow">
            <svg viewBox="0 0 300 200" aria-hidden="true">
              <path id="apFlowPath" data-draw d="M40 40 H150 V100 H260 V160 H90" />
              <circle class="ap-flow__dot" r="4" data-flow-dot />
            </svg>
            <span class="ap-pill ap-flow__n1"><ApIcon name="users" /> Tamu buka link</span>
            <span class="ap-pill ap-flow__n2"><ApIcon name="mail" /> Isi RSVP</span>
            <span class="ap-pill ap-flow__n3"><ApIcon name="chat" /> Ucapan tampil</span>
            <span class="ap-pill ap-flow__n4"><ApIcon name="layers" /> Rekap klien</span>
          </div>
          <h3>Alur RSVP otomatis</h3>
          <p>Dari tamu membuka link sampai rekap kehadiran, semuanya berjalan sendiri.</p>
        </article>

        <!-- E: lisensi -->
        <article class="ap-card ap-card--e" data-card>
          <div class="ap-card__art ap-art-shield">
            <svg class="ap-art-shield__circuit" viewBox="0 0 300 200" aria-hidden="true">
              <path data-draw d="M0 60 H70 L90 80 H120" /><path data-draw d="M300 60 H230 L210 80 H180" />
              <path data-draw d="M0 150 H80 L100 130 H120" /><path data-draw d="M300 150 H220 L200 130 H180" />
            </svg>
            <div class="ap-art-shield__icon" data-shield><ApIcon name="shield" /></div>
          </div>
          <h3>Lisensi &amp; pembaruan aman</h3>
          <p>Aktivasi lisensi resmi dengan pembaruan rutin langsung dari dashboard WordPress.</p>
        </article>
      </div>

      <div class="ap-stats">
        <div v-for="s in c.stats" :key="s.label" class="ap-stat" data-reveal>
          <p class="ap-stat__num"><b :data-count="s.value">0</b>{{ s.suffix }}</p>
          <p class="ap-stat__label">{{ s.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
