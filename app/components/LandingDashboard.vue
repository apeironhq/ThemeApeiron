<script setup lang="ts">
/**
 * Mockup dashboard MDUNDIG (data Daftar Hadiah & Form Order).
 * Warna, font (Ubuntu), border, dan bayangan mengikuti mdundig.vercel.app. Data di sini contoh.
 */
import { content as c } from '~/data/content'

const d = c.dashboard
const kpis = [
  ['blue', 'book', 'Total undangan', 24, '+3 baru', 'L40 26 L58 25 L70 12 L90 8'],
  ['orange', 'gift', 'Hadiah aktif', 128, '+12 baru', 'L45 26 L62 26 L76 10 L90 14'],
  ['purple', 'check', 'Reservasi terkonfirmasi', 86, '+5 baru', 'L48 26 L62 26 L74 8 L90 22'],
  ['pink', 'globe', 'Website terhubung', 6, '3 token aktif', 'L50 26 L66 26 L76 10 L90 10'],
] as const
</script>

<template>
  <section class="ap-section ap-dash3d" data-dash3d>
    <div class="ap-container">
      <header class="ap-head ap-head--center">
        <h2 class="ap-title" data-split>{{ d.title }}</h2>
        <p class="ap-lead" data-reveal>{{ d.lead }}</p>
      </header>

      <!-- Ke mana data tiap widget pergi: hanya Daftar Hadiah & Form Order yang masuk MDUNDIG. -->
      <div class="ap-flowmap" aria-label="Alur data widget">
        <div v-for="f in d.flow" :key="f.widget" class="ap-flowmap__item" :class="{ 'is-mdundig': f.mdundig }" data-reveal>
          <div class="ap-flowmap__from">
            <span class="ap-ico-chip"><ApIcon :name="f.icon" /></span>
            <span><b>{{ f.widget }}</b><small>{{ f.what }}</small></span>
          </div>
          <span class="ap-flowmap__wire" aria-hidden="true"><i></i></span>
          <div class="ap-flowmap__to"><ApIcon :name="f.toIcon" />{{ f.to }}</div>
        </div>
      </div>
    </div>

    <div class="ap-dash3d__scene">
      <div class="ap-dash3d__screen ap-md" data-dash3d-screen>
        <aside class="ap-md__side">
          <div class="ap-md__brand">
            <span class="ap-md__logo"><ApIcon name="mail" /></span>
            <span><b>MDUNDIG</b><small>Manajemen Data Undangan Digital</small></span>
          </div>
          <p class="ap-md__label">Data</p>
          <nav>
            <span class="is-on" data-app-nav="0"><ApIcon name="layout" />Ringkasan</span>
            <span data-app-nav="1"><ApIcon name="gift" />Daftar Hadiah</span>
            <span data-app-nav="2"><ApIcon name="book" />Order Undangan</span>
            <span><ApIcon name="calendar" />Kalender Acara</span>
          </nav>
          <p class="ap-md__label">Pengaturan</p>
          <nav>
            <span><ApIcon name="globe" />Website</span>
            <span><ApIcon name="plug" />Koneksi</span>
            <span><ApIcon name="chat" />Pesan WhatsApp</span>
          </nav>
        </aside>

        <div class="ap-md__main">
          <!-- Top bar versi mobile, seperti MDUNDIG saat dibuka di HP -->
          <div class="ap-md__mbar">
            <span class="ap-md__burger" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="ap-md__logo ap-md__logo--sm"><ApIcon name="mail" /></span>
            <b>MDUNDIG</b>
            <span class="ap-md__bell"><ApIcon name="sparkle" /><em>3</em></span>
            <span class="ap-md__avatar">A</span>
          </div>
          <div class="ap-md__top">
            <div>
              <h4 class="ap-md__title" data-app-title>Ringkasan</h4>
              <p class="ap-md__sub" data-app-sub>Halo, admin. Ringkasan seluruh data platform.</p>
            </div>
            <div class="ap-md__tabs">
              <span class="is-on" data-app-tab="0">Ringkasan</span>
              <span data-app-tab="1">Daftar Hadiah</span>
              <span data-app-tab="2">Order</span>
            </div>
          </div>

          <div class="ap-md__panels">
            <!-- Ringkasan -->
            <div class="ap-md__panel" data-app-panel data-title="Ringkasan" data-sub="Halo, admin. Ringkasan seluruh data platform.">
              <div class="ap-md__kpis">
                <div v-for="k in kpis" :key="k[2]" class="ap-md__card ap-md__kpi" :class="`is-${k[0]}`">
                  <p class="ap-md__kpi-head"><span class="ap-md__chip"><ApIcon :name="k[1]" /></span>{{ k[2] }}</p>
                  <div class="ap-md__kpi-row">
                    <div><b :data-count="k[3]">0</b><small>{{ k[4] }} <em>vs 7 hari</em></small></div>
                    <svg class="ap-md__spark" viewBox="0 0 90 30" preserveAspectRatio="none" aria-hidden="true"><path :d="`M0 26 ${k[5]} V30 H0Z`" class="ap-md__spark-area" /><path :d="`M0 26 ${k[5]}`" class="ap-md__spark-line" /></svg>
                  </div>
                </div>
              </div>
              <div class="ap-md__split">
                <div class="ap-md__card">
                  <p class="ap-md__card-title">Hadiah terpopuler</p>
                  <div class="ap-md__row"><span class="ap-md__chip is-neutral"><ApIcon name="gift" /></span><p><b>Rice Cooker</b><small>Raka &amp; Nadia</small></p><span class="ap-md__meta">3 reservasi</span></div>
                  <div class="ap-md__row"><span class="ap-md__chip is-neutral"><ApIcon name="layers" /></span><p><b>Set Piring</b><small>Fajar &amp; Intan</small></p><span class="ap-md__meta">2 reservasi</span></div>
                </div>
                <div class="ap-md__card ap-md__donut-card">
                  <p class="ap-md__card-title">Status reservasi</p>
                  <div class="ap-md__donut" style="--p: 92"><span><b>92%</b><small>Terkonfirmasi</small></span></div>
                </div>
              </div>
            </div>

            <!-- Daftar Hadiah -->
            <div class="ap-md__panel" data-app-panel data-title="Daftar Hadiah" data-sub="Undangan tercatat otomatis saat widget Daftar Hadiah pertama kali dibuka.">
              <div class="ap-md__card ap-md__table">
                <div class="ap-md__thead"><span>Judul undangan</span><span>Hadiah</span><span>Reservasi</span><span>Akses pelanggan</span></div>
                <div class="ap-md__tr"><b>Raka &amp; Nadia</b><span>12</span><span>9</span><em class="ap-md__badge is-blue"><i></i>Ada akses</em></div>
                <div class="ap-md__tr"><b>Fajar &amp; Intan</b><span>8</span><span>5</span><em class="ap-md__badge is-blue"><i></i>Ada akses</em></div>
                <div class="ap-md__tr"><b>Bima &amp; Ayu</b><span>10</span><span>2</span><em class="ap-md__badge"><i></i>Tanpa akses</em></div>
              </div>
            </div>

            <!-- Order Undangan -->
            <div class="ap-md__panel" data-app-panel data-title="Order Undangan" data-sub="Pesanan undangan dari widget Form Order dan input manual.">
              <div class="ap-md__card ap-md__table">
                <div class="ap-md__thead"><span>Pemesan</span><span>Paket</span><span>Website</span><span>Status</span></div>
                <div class="ap-md__tr"><b>Rio &amp; Salsa</b><span>Premium</span><span>Apeiron.ID</span><em class="ap-md__badge is-blue"><i></i>Baru</em></div>
                <div class="ap-md__tr"><b>Fajar &amp; Intan</b><span>Classic</span><span>Apeiron.ID</span><em class="ap-md__badge is-orange"><i></i>Diproses</em></div>
                <div class="ap-md__tr"><b>Bima &amp; Ayu</b><span>Premium</span><span>Studio.ID</span><em class="ap-md__badge is-green"><i></i>Selesai</em></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifikasi melayang -->
      <div class="ap-dash3d__float ap-dash3d__float--a" data-dash-float data-depth="1.6">
        <span class="ap-md__chip is-purple"><ApIcon name="check" /></span>
        <span><b>Reservasi terkonfirmasi</b>Rice Cooker · Andi P.</span>
      </div>
      <div class="ap-dash3d__float ap-dash3d__float--b" data-dash-float data-depth="1.2">
        <span class="ap-md__chip is-blue"><ApIcon name="book" /></span>
        <span><b>Order undangan baru</b>Rio &amp; Salsa · Premium</span>
      </div>
      <div class="ap-dash3d__float ap-dash3d__float--c" data-dash-float data-depth="2">
        <span class="ap-md__chip is-pink"><ApIcon name="globe" /></span>
        <span><b>Website terhubung</b>Token aktif · tersinkron</span>
      </div>
    </div>
  </section>
</template>
