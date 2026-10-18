<script setup lang="ts">
import { Check, ChevronsDown, Copy, Gift, Link2, MessageCircle, Pause, Users } from 'lucide-vue-next'
import { sample } from '~/data/site'

/**
 * Pratinjau mini tiap widget, dibuat dengan CSS agar ringan.
 * Semua ukuran memakai em, jadi satu komponen bisa tampil kecil (kartu) atau besar (spotlight).
 */
defineProps<{ id: string; size?: 'sm' | 'lg' }>()
</script>

<template>
  <div class="wp" :class="[`wp--${id}`, size === 'lg' ? 'wp--lg' : 'wp--sm']" aria-hidden="true">
    <!-- Cover -->
    <template v-if="id === 'cover'">
      <span class="wp-cover__fold" />
      <span class="wp-cover__ribbon" />
      <span class="wp-cover__seal"><b>{{ sample.initials }}</b><small>Buka Undangan</small></span>
      <span class="wp-cover__tag"><b>Kepada Yth.</b><small>{{ sample.guest }}</small></span>
    </template>

    <!-- Page Loader -->
    <template v-else-if="id === 'page-loader'">
      <span class="wp-loader__ring" />
      <p class="wp-loader__text">Memuat undangan…</p>
      <span class="wp-loader__bar"><i /></span>
    </template>

    <!-- Cerita Cinta -->
    <template v-else-if="id === 'cerita-cinta'">
      <ol class="wp-story">
        <li><b>2019</b><span>Pertama bertemu</span></li>
        <li><b>2023</b><span>Lamaran</span></li>
        <li><b>2026</b><span>Hari bahagia</span></li>
      </ol>
    </template>

    <!-- Countdown -->
    <template v-else-if="id === 'countdown'">
      <p class="wp-kicker">Menuju hari bahagia</p>
      <div class="wp-cd">
        <span><b>55</b><small>Hari</small></span>
        <span><b>08</b><small>Jam</small></span>
        <span><b>24</b><small>Menit</small></span>
        <span><b class="wp-cd__tick">16</b><small>Detik</small></span>
      </div>
    </template>

    <!-- Guest Invitation Manager -->
    <template v-else-if="id === 'guest-invitation'">
      <div class="wp-guests">
        <p class="wp-guests__head"><Users /> Daftar tamu <em>128</em></p>
        <div v-for="name in ['Andi Pratama', 'Sinta Lestari', 'Keluarga Dimas']" :key="name" class="wp-guests__row">
          <span>{{ name }}</span>
          <i><Link2 /> Salin link</i>
        </div>
      </div>
    </template>

    <!-- Signal Form -->
    <template v-else-if="id === 'signal-form'">
      <div class="wp-form">
        <p class="wp-form__title">Konfirmasi Kehadiran</p>
        <span class="wp-field">Andi Pratama</span>
        <span class="wp-choice"><i class="is-on">Hadir</i><i>Berhalangan</i></span>
        <span class="wp-btn wp-btn--wa"><MessageCircle /> Kirim via WhatsApp</span>
      </div>
    </template>

    <!-- Form Order -->
    <template v-else-if="id === 'form-order'">
      <div class="wp-form">
        <p class="wp-form__title">Pesan Undangan</p>
        <span class="wp-field wp-field--select">Paket Classic</span>
        <span class="wp-field">Nama pemesan</span>
        <span class="wp-btn">Kirim pesanan</span>
      </div>
    </template>

    <!-- Comment Dock -->
    <template v-else-if="id === 'comment-dock'">
      <div class="wp-dock">
        <div class="wp-dock__item">
          <span class="wp-avatar">S</span>
          <div><p><b>Sinta</b><em>Hadir</em></p><p>Selamat menempuh hidup baru!</p></div>
          <img src="/img/stickers/61.webp" alt="" loading="lazy" width="40" height="40">
        </div>
        <div class="wp-dock__item">
          <span class="wp-avatar">D</span>
          <div><p><b>Dimas</b><em class="is-absen">Berhalangan</em></p><p>Doa terbaik dari jauh.</p></div>
          <img src="/img/stickers/63.webp" alt="" loading="lazy" width="40" height="40">
        </div>
      </div>
    </template>

    <!-- Social Proof -->
    <template v-else-if="id === 'social-proof'">
      <div class="wp-proof">
        <div class="wp-proof__toast wp-proof__toast--back"><span class="wp-avatar">R</span><p><b>Rina</b> mengonfirmasi hadir</p></div>
        <div class="wp-proof__toast"><span class="wp-avatar">A</span><p><b>Andi</b> baru saja mengirim ucapan</p></div>
      </div>
    </template>

    <!-- Daftar Hadiah -->
    <template v-else-if="id === 'daftar-hadiah'">
      <div class="wp-gift">
        <span class="wp-gift__img"><Gift /></span>
        <div>
          <span class="wp-badge">Tersedia 1 dari 1</span>
          <p>Rice Cooker</p>
          <span class="wp-btn wp-gift__btn">Pilih Hadiah</span>
        </div>
      </div>
    </template>

    <!-- Clipboard Tap -->
    <template v-else-if="id === 'clipboard-tap'">
      <div class="wp-bank">
        <p class="wp-bank__label">Amplop digital</p>
        <p class="wp-bank__no">1234 5678 9000</p>
        <p class="wp-bank__name">a.n. {{ sample.couple }}</p>
        <span class="wp-bank__copy"><Copy class="wp-bank__icon-copy" /><Check class="wp-bank__icon-done" /><i>Salin</i></span>
      </div>
    </template>

    <!-- Soundscape Player -->
    <template v-else-if="id === 'soundscape-player'">
      <span class="wp-disc"><i /></span>
      <span class="wp-wave"><i v-for="i in 14" :key="i" :style="{ '--i': i }" /></span>
      <span class="wp-play"><Pause /></span>
    </template>

    <!-- Auto Scroll -->
    <template v-else-if="id === 'auto-scroll'">
      <div class="wp-scroll">
        <div class="wp-scroll__page">
          <span v-for="i in 8" :key="i" :class="i % 3 === 1 ? 'is-title' : ''" />
        </div>
        <span class="wp-scroll__btn"><ChevronsDown /></span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.wp {
  --navy: #083c57;
  --navy-900: #04263a;
  --muted: #5a6d78;
  --line: #e1e9ee;
  position: relative;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 0.8em;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fbf8f2;
  color: var(--navy-900);
  font-size: var(--wp-size, 10px);
  line-height: 1.35;
}

.wp--lg {
  --wp-size: clamp(13px, 1.7vw, 20px);
}

.wp :deep(svg) {
  width: 1.2em;
  height: 1.2em;
  flex: none;
}

.wp-kicker {
  font-size: 0.9em;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--muted);
}

.wp-avatar {
  flex: none;
  display: grid;
  place-items: center;
  width: 2.4em;
  height: 2.4em;
  border-radius: 50%;
  background: var(--navy);
  color: #fff;
  font-size: 0.95em;
  font-weight: 500;
}

.wp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0.8em 1.4em;
  border-radius: 999px;
  background: var(--navy);
  color: #fff;
  font-size: 1em;
  font-weight: 500;
}

.wp-btn--wa {
  background: #1fa855;
}

.wp-badge {
  display: inline-block;
  padding: 0.2em 0.7em;
  border-radius: 999px;
  background: #eef5f8;
  color: var(--navy);
  font-size: 0.85em;
  font-weight: 500;
}

/* Cover */
.wp--cover {
  background: url('/img/paper.jpg') center / cover, #f7f3ea;
}

.wp-cover__fold {
  position: absolute;
  inset: 0 auto 0 50%;
  width: 1px;
  background: linear-gradient(transparent, rgba(80, 60, 20, 0.18) 20%, rgba(80, 60, 20, 0.18) 80%, transparent);
}

.wp-cover__ribbon {
  position: absolute;
  left: 0;
  right: 0;
  top: 38%;
  height: 3.4em;
  background: linear-gradient(180deg, #145c82, var(--navy) 25%, #0a4566 50%, var(--navy) 75%, var(--navy-900));
}

.wp-cover__ribbon::before,
.wp-cover__ribbon::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed rgba(233, 207, 150, 0.7);
}

.wp-cover__ribbon::before {
  top: 0.4em;
}

.wp-cover__ribbon::after {
  bottom: 0.4em;
}

.wp-cover__seal {
  position: absolute;
  left: 50%;
  top: calc(38% + 1.7em);
  display: grid;
  place-items: center;
  align-content: center;
  width: 6.4em;
  height: 6.4em;
  margin: -3.2em 0 0 -3.2em;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 38%, #145c82, var(--navy) 55%, #03202f);
  box-shadow: 0 0 0 0.22em #d8b56a, 0 0 0 0.45em #062f46, 0 0 0 0.52em #a97a2f;
  color: #fff;
  animation: wp-seal 3.6s ease-in-out infinite;
}

.wp-cover__seal b {
  font-size: 1.5em;
  font-weight: 500;
  color: #f6e6bf;
  line-height: 1;
}

.wp-cover__seal small {
  margin-top: 0.3em;
  font-size: 0.5em;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.wp-cover__tag {
  position: absolute;
  left: 50%;
  top: calc(38% + 5.6em);
  display: grid;
  width: 10em;
  margin-left: -5em;
  padding: 0.7em 0.6em;
  border-radius: 0.6em;
  text-align: center;
  background: linear-gradient(#fffefa, #eee9dc);
  box-shadow: inset 0 0 0 1.5px #c7953f, inset 0 0 0 4px #fffefa;
  transform-origin: 50% -1.4em;
  animation: wp-swing 3.4s ease-in-out infinite;
}

.wp-cover__tag b {
  font-size: 1.1em;
  font-weight: 500;
}

.wp-cover__tag small {
  font-size: 0.75em;
  color: var(--muted);
  white-space: nowrap;
}

@keyframes wp-seal {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.04);
  }
}

@keyframes wp-swing {
  0%,
  100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

/* Page loader */
.wp--page-loader {
  background: linear-gradient(160deg, #0e5578, var(--navy) 50%, var(--navy-900));
  color: #fff;
}

.wp-loader__ring {
  width: 4.2em;
  height: 4.2em;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-top-color: #c9a46b;
  animation: wp-spin 1.1s linear infinite;
}

.wp-loader__text {
  font-size: 1em;
  color: rgba(255, 255, 255, 0.75);
}

.wp-loader__bar {
  width: 12em;
  height: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
}

.wp-loader__bar i {
  display: block;
  height: 100%;
  background: #c9a46b;
  transform-origin: left;
  animation: wp-load 2.4s ease-in-out infinite;
}

@keyframes wp-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes wp-load {
  0% {
    transform: scaleX(0);
  }
  80%,
  100% {
    transform: scaleX(1);
  }
}

/* Cerita cinta */
.wp-story {
  position: relative;
  display: grid;
  gap: 1.1em;
  padding-left: 1.8em;
}

.wp-story::before {
  content: '';
  position: absolute;
  left: 0.45em;
  top: 0.4em;
  bottom: 0.4em;
  width: 1px;
  background: #c9a46b;
}

.wp-story li {
  position: relative;
  display: grid;
}

.wp-story li::before {
  content: '';
  position: absolute;
  left: -1.75em;
  top: 0.25em;
  width: 0.9em;
  height: 0.9em;
  border-radius: 50%;
  background: #fbf8f2;
  border: 2px solid var(--navy);
}

.wp-story li:last-child::before {
  background: var(--navy);
}

.wp-story b {
  font-size: 0.85em;
  font-weight: 500;
  color: #a97a2f;
  letter-spacing: 0.08em;
}

.wp-story span {
  font-size: 1.15em;
  font-style: italic;
  font-weight: 300;
  color: var(--navy);
}

/* Countdown */
.wp--countdown {
  background: url('/img/paper.jpg') center / cover, #fbf7f0;
}

.wp-cd {
  display: grid;
  grid-template-columns: repeat(4, 4.6em);
  gap: 0.5em;
}

.wp-cd span {
  display: grid;
  padding: 0.8em 0 0.6em;
  border-radius: 0.8em;
  background: #fff;
  text-align: center;
  box-shadow: inset 0 0 0 1px rgba(201, 164, 107, 0.35);
}

.wp-cd b {
  font-size: 2em;
  font-weight: 400;
  line-height: 1;
  color: var(--navy);
  font-variant-numeric: tabular-nums;
}

.wp-cd small {
  margin-top: 0.3em;
  font-size: 0.75em;
  color: var(--muted);
}

.wp-cd__tick {
  animation: wp-tick 1s steps(1) infinite;
}

@keyframes wp-tick {
  50% {
    opacity: 0.55;
  }
}

/* Daftar tamu */
.wp-guests {
  display: grid;
  gap: 0.5em;
  width: 82%;
}

.wp-guests__head {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 1.05em;
  font-weight: 500;
  color: var(--navy);
}

.wp-guests__head em {
  margin-left: auto;
  font-style: normal;
  font-size: 0.85em;
  color: var(--muted);
}

.wp-guests__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6em 0.8em;
  border-radius: 0.7em;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 0.95em;
}

.wp-guests__row i {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  font-style: normal;
  font-size: 0.85em;
  font-weight: 500;
  color: var(--navy);
}

.wp-guests__row:first-of-type {
  border-color: var(--navy);
}

/* Form */
.wp-form {
  display: grid;
  gap: 0.6em;
  width: 78%;
  text-align: center;
}

.wp-form__title {
  font-size: 1.3em;
  color: var(--navy);
}

.wp-field {
  padding: 0.75em 0.9em;
  border-radius: 0.7em;
  border: 1px solid var(--line);
  background: #fff;
  font-size: 0.95em;
  text-align: left;
  color: var(--muted);
}

.wp-field--select::after {
  content: '▾';
  float: right;
}

.wp-choice {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4em;
}

.wp-choice i {
  padding: 0.6em;
  border-radius: 0.7em;
  border: 1px solid var(--line);
  font-style: normal;
  font-size: 0.9em;
}

.wp-choice .is-on {
  border-color: var(--navy);
  background: #eef5f8;
  color: var(--navy);
  font-weight: 500;
}

/* Comment dock */
.wp--comment-dock {
  background: #f6f9fa;
}

.wp-dock {
  display: grid;
  gap: 0.6em;
  width: 86%;
}

.wp-dock__item {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.7em;
  border-radius: 0.9em;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 0.9em;
  color: var(--muted);
}

.wp-dock__item div {
  flex: 1;
  min-width: 0;
}

.wp-dock__item p:first-child {
  display: flex;
  align-items: center;
  gap: 0.4em;
  color: var(--navy-900);
}

.wp-dock__item em {
  padding: 0 0.5em;
  border-radius: 999px;
  background: #e3f5ec;
  color: #1a7f53;
  font-style: normal;
  font-size: 0.8em;
}

.wp-dock__item em.is-absen {
  background: #fbeedd;
  color: #a65f14;
}

.wp-dock__item img {
  width: 3.2em;
  height: 3.2em;
  object-fit: contain;
  animation: wp-pop 3s ease-in-out infinite;
}

.wp-dock__item:last-child img {
  animation-delay: -1.5s;
}

@keyframes wp-pop {
  0%,
  100% {
    transform: rotate(-6deg) scale(1);
  }
  50% {
    transform: rotate(6deg) scale(1.06);
  }
}

/* Social proof */
.wp--social-proof {
  background: linear-gradient(180deg, #fbf8f2, #eef5f8);
}

.wp-proof {
  position: relative;
  width: 82%;
  height: 7em;
}

.wp-proof__toast {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.8em 1em;
  border-radius: 1em;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 0.95em;
  color: var(--muted);
  animation: wp-toast 4s ease-in-out infinite;
}

.wp-proof__toast b {
  color: var(--navy-900);
  font-weight: 500;
}

.wp-proof__toast--back {
  bottom: 3.2em;
  transform: scale(0.92);
  opacity: 0.55;
  animation: none;
}

@keyframes wp-toast {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.4em);
  }
}

/* Daftar hadiah */
.wp-gift {
  display: grid;
  grid-template-columns: 5em 1fr;
  gap: 0.8em;
  width: 82%;
  padding: 0.7em;
  border-radius: 1em;
  background: #fff;
  border: 1px solid var(--line);
}

.wp-gift__img {
  display: grid;
  place-items: center;
  border-radius: 0.8em;
  background: linear-gradient(135deg, #eef5f8, #dbe9f0);
  color: var(--navy);
}

.wp-gift__img :deep(svg) {
  width: 2em;
  height: 2em;
}

.wp-gift p {
  margin: 0.3em 0 0.5em;
  font-size: 1.05em;
  font-weight: 500;
}

.wp-gift__btn {
  display: flex;
  padding: 0.55em;
  border-radius: 0.6em;
  font-size: 0.9em;
  animation: wp-taken 4s ease-in-out infinite;
}

@keyframes wp-taken {
  0%,
  45% {
    background: var(--navy);
  }
  55%,
  100% {
    background: #22a06b;
  }
}

/* Clipboard tap */
.wp--clipboard-tap {
  background: linear-gradient(180deg, #fbf8f2, #f3ece0);
}

.wp-bank {
  position: relative;
  display: grid;
  gap: 0.2em;
  width: 82%;
  padding: 1.1em 1.2em;
  border-radius: 1em;
  background: linear-gradient(145deg, #0e5578, var(--navy) 60%, var(--navy-900));
  color: #fff;
}

.wp-bank__label {
  font-size: 0.8em;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #c9a46b;
}

.wp-bank__no {
  margin-top: 0.4em;
  font-size: 1.45em;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}

.wp-bank__name {
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.7);
}

.wp-bank__copy {
  position: absolute;
  right: 1em;
  bottom: 1em;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.4em 0.8em;
  border-radius: 999px;
  background: #fff;
  color: var(--navy);
  font-size: 0.85em;
  font-weight: 500;
}

.wp-bank__copy i {
  font-style: normal;
}

.wp-bank__icon-done {
  display: none;
}

/* Soundscape */
.wp--soundscape-player {
  background: radial-gradient(120% 80% at 50% 10%, #0e5578, var(--navy) 50%, var(--navy-900));
  color: #fff;
}

.wp-disc {
  display: grid;
  place-items: center;
  width: 7em;
  height: 7em;
  border-radius: 50%;
  background: repeating-radial-gradient(circle, #1b2b33 0 2px, #12222a 2px 4px);
  animation: wp-spin 8s linear infinite;
}

.wp-disc i {
  width: 2.4em;
  height: 2.4em;
  border-radius: 50%;
  background: radial-gradient(circle, #c9a46b 0 30%, #efe2cb 31%);
}

.wp-wave {
  display: flex;
  align-items: center;
  gap: 0.25em;
  height: 2.4em;
}

.wp-wave i {
  width: 0.3em;
  height: 100%;
  border-radius: 0.3em;
  background: #c9a46b;
  animation: wp-wave 1.1s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.09s);
}

.wp-play {
  display: grid;
  place-items: center;
  width: 2.8em;
  height: 2.8em;
  border-radius: 50%;
  background: #fff;
  color: var(--navy);
}

@keyframes wp-wave {
  0%,
  100% {
    transform: scaleY(0.25);
  }
  50% {
    transform: scaleY(1);
  }
}

/* Auto scroll */
.wp-scroll {
  position: relative;
  width: 10em;
  height: 13em;
  border-radius: 1.2em;
  border: 1px solid var(--line);
  background: #fff;
  overflow: hidden;
}

.wp-scroll__page {
  display: grid;
  gap: 0.7em;
  padding: 1em;
  animation: wp-autoscroll 6s ease-in-out infinite;
}

.wp-scroll__page span {
  height: 0.6em;
  border-radius: 0.3em;
  background: #eef5f8;
}

.wp-scroll__page span.is-title {
  width: 60%;
  height: 1em;
  background: #dbe9f0;
}

.wp-scroll__btn {
  position: absolute;
  right: 0.6em;
  bottom: 0.6em;
  display: grid;
  place-items: center;
  width: 2.2em;
  height: 2.2em;
  border-radius: 50%;
  background: var(--navy);
  color: #fff;
}

@keyframes wp-autoscroll {
  0%,
  10% {
    transform: translateY(0);
  }
  90%,
  100% {
    transform: translateY(-40%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wp *,
  .wp {
    animation: none !important;
  }
}
</style>
