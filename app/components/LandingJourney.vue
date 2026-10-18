<script setup lang="ts">
import { content as c } from '~/data/content'

const steps = c.journey
const h = c.hero
const paper = "--paper: url('/img/bg.jpg')"
const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <section class="ap-journey" id="fitur" data-journey>
    <div class="ap-journey__pin">
      <div class="ap-container ap-journey__inner">
        <div class="ap-journey__copy">
          <div class="ap-journey__captions">
            <article v-for="(s, i) in steps" :key="s.key" class="ap-journey__caption" :class="{ 'is-active': i === 0 }" data-journey-caption>
              <span class="ap-journey__num">{{ pad(i + 1) }}<i class="ap-sep" aria-hidden="true"></i>{{ s.label }}</span>
              <h2>{{ s.title }}</h2>
              <p>{{ s.text }}</p>
            </article>
          </div>
          <ol class="ap-journey__dots" aria-hidden="true">
            <li v-for="(s, i) in steps" :key="s.key" :class="{ 'is-active': i === 0 }" data-journey-dot>{{ s.label }}</li>
          </ol>
          <div class="ap-journey__bar" aria-hidden="true"><span data-journey-bar></span></div>
        </div>

        <div class="ap-journey__stage" data-journey-stage>
          <div class="ap-journey__fit" data-journey-fit>
          <!-- Panel ala Elementor -->
          <div class="ap-editor" aria-hidden="true">
            <div class="ap-editor__bar"><span></span><span></span><span></span><b>Edit Widget</b></div>
            <div class="ap-editor__tabs"><span class="is-on">Konten</span><span>Gaya</span><span>Lanjutan</span></div>
            <div v-for="(s, i) in steps" :key="s.key" class="ap-editor__row" :class="{ 'is-active': i === 0 }" data-journey-control>
              <label>{{ s.control }}</label>
              <div class="ap-editor__field">{{ s.value }}<i></i></div>
            </div>
            <div class="ap-editor__publish">Perbarui</div>
          </div>

          <!-- Mockup HP -->
          <div class="ap-phone" aria-hidden="true">
            <div class="ap-phone__notch"></div>
            <div class="ap-phone__screen">
              <!-- 1. Cover Classic -->
              <div class="ap-screen ap-screen--cover is-active" data-journey-screen :style="paper">
                <span class="ap-mini-gate__fold"></span>
                <span class="ap-mini-gate__ribbon"></span>
                <span class="ap-mini-gate__seal"><b>{{ h.initials }}</b><small>Buka Undangan</small></span>
                <span class="ap-mini-gate__string"></span>
                <span class="ap-mini-gate__tag"><b>Kepada Yth.</b><small>{{ h.guest }}</small></span>
              </div>

              <!-- 2. Countdown -->
              <div class="ap-screen ap-screen--countdown" data-journey-screen :style="paper">
                <p class="ap-screen__kicker">Menuju hari bahagia</p>
                <p class="ap-screen__names">{{ h.couple }}</p>
                <div class="ap-screen__cd"><b>55</b><b>08</b><b>24</b><b>16</b></div>
                <div class="ap-screen__cd-l"><span>Hari</span><span>Jam</span><span>Menit</span><span>Detik</span></div>
                <p class="ap-screen__small">{{ h.date }}<br>Gedung Sasana, Bandung</p>
              </div>

              <!-- 3. Soundscape -->
              <div class="ap-screen ap-screen--music" data-journey-screen>
                <div class="ap-screen__disc"><span></span></div>
                <p class="ap-screen__song">Akad · Instrumental</p>
                <div class="ap-screen__wave"><i v-for="i in 18" :key="i" :style="{ '--i': i - 1 }"></i></div>
                <div class="ap-screen__player"><span>1:24</span><b><ApIcon name="play" /></b><span>3:40</span></div>
              </div>

              <!-- 4. Signal Form (RSVP via WhatsApp) -->
              <div class="ap-screen ap-screen--rsvp" data-journey-screen>
                <p class="ap-screen__title">Konfirmasi Kehadiran</p>
                <label class="ap-screen__label">Nama Tamu</label>
                <div class="ap-screen__input">Andi Pratama</div>
                <label class="ap-screen__label">Jumlah Tamu</label>
                <div class="ap-screen__stepper"><span>−</span><b>2</b><span>+</span></div>
                <label class="ap-screen__label">Ucapan</label>
                <div class="ap-screen__input ap-screen__input--area">Semoga sakinah, mawaddah, warahmah 🤍</div>
                <span class="ap-screen__btn ap-screen__btn--wa"><ApIcon name="chat" /> Kirim via WhatsApp</span>
                <span class="ap-screen__toast ap-screen__toast--wa"><ApIcon name="check" /> WhatsApp terbuka</span>
              </div>

              <!-- 5. Comment Dock (ucapan + stiker) -->
              <div class="ap-screen ap-screen--comment" data-journey-screen>
                <div class="ap-dock__head"><b>Ucapan &amp; Doa</b><span>248 ucapan</span></div>
                <div class="ap-dock__pills"><span class="is-hadir"><i></i>Hadir 182</span><span class="is-absen"><i></i>Berhalangan 41</span></div>
                <div class="ap-dock__item" data-dock-item>
                  <span class="ap-dock__avatar">S</span>
                  <div class="ap-dock__body"><p><b>Sinta</b><em class="is-hadir">Hadir</em></p><p>Selamat menempuh hidup baru, kalian serasi banget!</p><img src="/img/stickers/61.webp" alt="" loading="lazy"><small>2 menit lalu · Balas</small></div>
                </div>
                <div class="ap-dock__item" data-dock-item>
                  <span class="ap-dock__avatar">D</span>
                  <div class="ap-dock__body"><p><b>Dimas</b><em class="is-absen">Berhalangan</em></p><p>Maaf belum bisa datang, doa terbaik dari jauh.</p><img src="/img/stickers/97.webp" alt="" loading="lazy"><small>5 menit lalu · Balas</small></div>
                </div>
                <div class="ap-dock__reply" data-dock-item>
                  <span class="ap-dock__avatar ap-dock__avatar--couple">R&amp;N</span>
                  <div class="ap-dock__body"><p><b>Raka &amp; Nadia</b><em class="is-couple">Mempelai</em></p><p>Terima kasih atas doanya, Sinta!</p></div>
                </div>
              </div>

              <!-- 6. Daftar Hadiah -->
              <div class="ap-screen ap-screen--registry" data-journey-screen>
                <p class="ap-screen__title">Hadiah Pernikahan</p>
                <div class="ap-gift" data-gift>
                  <span class="ap-gift__img"><ApIcon name="gift" /></span>
                  <div><span class="ap-gift__badge"><ApIcon name="gift" /> Tersedia <b data-gift-stock>1 dari 1</b></span><p>Rice Cooker</p><span class="ap-gift__btn" data-gift-btn>Pilih Hadiah</span></div>
                </div>
                <div class="ap-gift">
                  <span class="ap-gift__img ap-gift__img--b"><ApIcon name="layers" /></span>
                  <div><span class="ap-gift__badge"><ApIcon name="gift" /> Tersedia <b>2 dari 2</b></span><p>Set Piring</p><span class="ap-gift__btn">Pilih Hadiah</span></div>
                </div>
                <div class="ap-gift">
                  <span class="ap-gift__img ap-gift__img--c"><ApIcon name="sparkle" /></span>
                  <div><span class="ap-gift__badge"><ApIcon name="gift" /> Tersedia <b>1 dari 1</b></span><p>Blender</p><span class="ap-gift__btn">Pilih Hadiah</span></div>
                </div>
                <span class="ap-screen__toast"><ApIcon name="check" /> Hadiah dipesan · tercatat di dashboard</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
