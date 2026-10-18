<script setup lang="ts">
/**
 * Peragaan mini satu widget di kanvas section "13 widget".
 * Markup statis; gerakannya dimainkan oleh assets/js/widgets.js (demos[key]).
 */
import { content as c } from '~/data/content'

defineProps<{ k: string }>()
const h = c.hero
</script>

<template>
  <!-- Hitung Mundur -->
  <div v-if="k === 'countdown'" class="wd wd--paper">
    <p class="wd-k">Menuju hari bahagia</p>
    <p class="wd-names">{{ h.couple }}</p>
    <div class="wd-cd">
      <div><b data-cd="d">55</b><span>Hari</span></div>
      <div><b data-cd="h">08</b><span>Jam</span></div>
      <div><b data-cd="m">24</b><span>Menit</span></div>
      <div><b data-cd="s">16</b><span>Detik</span></div>
    </div>
    <p class="wd-small">{{ h.date }}</p>
  </div>

  <!-- Tombol Audio -->
  <div v-else-if="k === 'audio'" class="wd wd--paper">
    <div class="wd-player" data-player>
      <span class="wd-disc" data-disc><i></i></span>
      <div class="wd-player__meta">
        <b>Akad</b><small>Instrumental · 3:40</small>
        <div class="wd-wave"><i v-for="n in 16" :key="n"></i></div>
      </div>
      <span class="wd-play" data-play><ApIcon name="play" /><span class="wd-pause"><i></i><i></i></span></span>
    </div>
    <p class="wd-small">Lagu mulai saat tamu membuka sampul</p>
  </div>

  <!-- Form WhatsApp -->
  <div v-else-if="k === 'form'" class="wd wd--white">
    <p class="wd-title">Konfirmasi Kehadiran</p>
    <label class="wd-label">Nama tamu</label>
    <div class="wd-input"><span data-typed data-text="Andi Pratama"></span><i class="wd-caret"></i></div>
    <div class="wd-row">
      <span class="wd-pill is-on">Hadir</span><span class="wd-pill">Berhalangan</span>
      <span class="wd-qty">− <b data-qty>1</b> +</span>
    </div>
    <span class="wd-btn wd-btn--wa" data-send><ApIcon name="chat" /> Kirim via WhatsApp</span>
    <div class="wd-toast wd-toast--wa" data-toast><ApIcon name="check" /> Terkirim ke WhatsApp mempelai</div>
  </div>

  <!-- Form Order -->
  <div v-else-if="k === 'order'" class="wd wd--white">
    <div class="wd-steps"><span data-st class="is-on">1</span><i><b data-bar></b></i><span data-st>2</span><i><b data-bar></b></i><span data-st>3</span></div>
    <div class="wd-panes">
      <div class="wd-pane is-on" data-pane><label class="wd-label">Mempelai</label><div class="wd-input">Raka &amp; Nadia</div></div>
      <div class="wd-pane" data-pane><label class="wd-label">Tanggal acara</label><div class="wd-input">12 Desember 2026</div></div>
      <div class="wd-pane" data-pane><label class="wd-label">Paket</label><div class="wd-input wd-input--on">Premium · semua widget</div></div>
    </div>
    <span class="wd-btn" data-next>Lanjut</span>
    <div class="wd-toast" data-toast><ApIcon name="check" /> Pesanan masuk dashboard MDUNDIG</div>
  </div>

  <!-- Tombol Salin -->
  <div v-else-if="k === 'copy'" class="wd wd--paper">
    <div class="wd-bank">
      <span class="wd-bank__chip"></span>
      <small>Nomor rekening</small>
      <b data-num>1234 5678 90</b>
      <small>a.n. Raka Pratama</small>
    </div>
    <span class="wd-copy" data-copy><span class="wd-copy__a"><ApIcon name="copy" /> Salin nomor</span><span class="wd-copy__b"><ApIcon name="check" /> Tersalin!</span></span>
  </div>

  <!-- Ucapan Tamu: ucapan masuk lalu dibalas mempelai -->
  <div v-else-if="k === 'comment'" class="wd wd--white wd--top">
    <div class="wd-dock__head"><b>Ucapan &amp; Doa</b><span><b data-count>247</b> ucapan</span></div>
    <div class="wd-cmt" data-c1>
      <span class="wd-ava">S</span>
      <div>
        <p><b>Sinta</b><em>Hadir</em></p>
        <p>Selamat menempuh hidup baru, kalian serasi banget!</p>
        <img src="/img/stickers/61.webp" alt="" data-sticker>
        <span class="wd-reply-link" data-replybtn>Balas</span>
      </div>
    </div>
    <div class="wd-cmt is-reply" data-c2>
      <span class="wd-ava is-couple">R&amp;N</span>
      <div>
        <p><b>{{ h.couple }}</b><em class="is-couple">Mempelai</em></p>
        <p><span data-typed data-text="Terima kasih doanya, Sinta! 🤍"></span><i class="wd-caret"></i></p>
      </div>
    </div>
  </div>

  <!-- Manajemen Tamu -->
  <div v-else-if="k === 'manager'" class="wd wd--paper wd--top">
    <div class="wd-url"><ApIcon name="globe" /><span>/raka-nadia/?to=</span><b data-typed data-text="Bapak+Andi"></b><i class="wd-caret"></i></div>
    <span class="wd-string"></span>
    <div class="wd-tag" data-tag><small>Kepada Yth.</small><b data-name>Nama Tamu</b><span>di tempat</span></div>
  </div>

  <!-- Gulir Otomatis -->
  <div v-else-if="k === 'scroll'" class="wd wd--paper wd--clip">
    <div class="wd-scroll" data-track>
      <template v-for="n in 2" :key="n">
        <div class="wd-sec"><small>The Wedding of</small><b>{{ h.couple }}</b></div>
        <div class="wd-sec"><i class="wd-photo"></i><p>Raka Pratama</p><small>Putra Bapak Hendra</small></div>
        <div class="wd-sec"><i class="wd-photo is-b"></i><p>Nadia Putri</p><small>Putri Bapak Surya</small></div>
        <div class="wd-sec"><small>Akad Nikah</small><p>{{ h.date }}</p></div>
      </template>
    </div>
    <span class="wd-speed" data-speed><ApIcon name="refresh" /><b data-speed-v>1×</b></span>
  </div>

  <!-- Aktivitas (social proof) -->
  <div v-else-if="k === 'activity'" class="wd wd--white wd--clip">
    <div class="wd-skel"><i class="is-hero"></i><i></i><i class="is-short"></i><span><i></i><i></i><i></i></span></div>
    <div class="wd-pop" data-pop>
      <span class="wd-ava" data-pop-ava>A</span>
      <p><b data-pop-name>Andi dari Bandung</b><span data-pop-text>baru saja memesan Paket Premium</span><small>2 menit lalu</small></p>
    </div>
  </div>

  <!-- Pemuat Halaman -->
  <div v-else-if="k === 'loader'" class="wd wd--paper wd--clip">
    <div class="wd-page" data-page><small>The Wedding of</small><b>{{ h.couple }}</b><span>{{ h.date }}</span></div>
    <div class="wd-loader" data-loader>
      <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" /><circle cx="60" cy="60" r="50" data-ring /></svg>
      <span>{{ h.initials }}</span>
      <p><b data-pct>0</b>%</p>
    </div>
  </div>

  <!-- Sampul -->
  <div v-else-if="k === 'cover'" class="wd wd--cover">
    <div class="wd-cover__inside" data-inside><small>The Wedding of</small><b>{{ h.couple }}</b><span>{{ h.date }}</span></div>
    <span class="wd-cover__door is-l" data-door></span>
    <span class="wd-cover__door is-r" data-door></span>
    <span class="wd-cover__seal" data-seal><b>{{ h.initials }}</b><small>Buka</small></span>
    <span class="wd-cover__tag" data-ctag><small>Kepada Yth.</small><b>{{ h.guest }}</b></span>
  </div>

  <!-- Cerita Cinta -->
  <div v-else-if="k === 'story'" class="wd wd--paper wd--top">
    <div class="wd-tl">
      <i class="wd-tl__line"><b data-line></b></i>
      <div v-for="m in [['2019', 'Pertama bertemu', 'heart'], ['2023', 'Mulai serius', 'sparkle'], ['2026', 'Lamaran', 'gift']]" :key="m[0]" class="wd-tl__item" data-item>
        <span class="wd-tl__dot"><ApIcon :name="m[2]" /></span>
        <div><small>{{ m[0] }}</small><b>{{ m[1] }}</b></div>
      </div>
    </div>
  </div>

  <!-- Daftar Hadiah -->
  <div v-else-if="k === 'registry'" class="wd wd--white wd--top">
    <p class="wd-title">Hadiah Pernikahan</p>
    <div class="wd-gift" data-gift>
      <span class="wd-gift__img"><ApIcon name="gift" /></span>
      <div><b>Rice Cooker</b><span class="wd-badge" data-badge>Tersedia <b data-stock>1 dari 1</b></span><span class="wd-btn wd-btn--sm" data-pick>Pilih Hadiah</span></div>
    </div>
    <div class="wd-gift">
      <span class="wd-gift__img is-b"><ApIcon name="layers" /></span>
      <div><b>Set Piring</b><span class="wd-badge">Tersedia <b>2 dari 2</b></span><span class="wd-btn wd-btn--sm">Pilih Hadiah</span></div>
    </div>
    <div class="wd-toast" data-toast><ApIcon name="check" /> Hadiah dipesan · tercatat di MDUNDIG</div>
  </div>
</template>
