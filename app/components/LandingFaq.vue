<script setup lang="ts">
import { content as c } from '~/data/content'

const icons = ['layout', 'code', 'tag', 'refresh', 'chat'] // ikon per pertanyaan, urut sesuai daftar FAQ
</script>

<template>
  <section class="ap-section ap-faq" id="faq">
    <div class="ap-container ap-faq__inner">
      <header class="ap-head ap-head--center">
        <h2 class="ap-title" data-split>Pertanyaan yang sering diajukan.</h2>
        <p class="ap-lead" data-reveal>Jawaban singkat untuk hal yang paling sering ditanyakan jasa undangan dan agency.</p>
      </header>

      <div class="ap-faq__list">
        <details v-for="(f, i) in c.faq" :key="f.q" class="ap-faq__item" data-reveal>
          <summary>
            <span class="ap-ico-chip"><ApIcon :name="icons[i % icons.length]!" /></span>
            <span class="ap-faq__q">{{ f.q }}</span>
            <span class="ap-faq__icon"><ApIcon name="plus" /></span>
          </summary>
          <div class="ap-faq__body"><p>{{ f.a }}</p></div>
        </details>
      </div>

      <div class="ap-side-card ap-side-card--help" data-reveal>
        <span class="ap-ico-chip"><ApIcon name="headset" /></span>
        <p><b>Masih ada pertanyaan?</b>Tim kami siap membantu lewat WhatsApp, atau baca panduan lengkap di dokumentasi.</p>
        <div class="ap-side-card__actions">
          <a class="ap-btn ap-btn--primary ap-btn--sm" :href="c.links.demo" target="_blank" rel="noopener"><ApIcon name="chat" /> Tanya via WhatsApp</a>
          <a class="ap-btn ap-btn--ghost ap-btn--sm" :href="c.links.docs"><ApIcon name="book" /> Dokumentasi</a>
        </div>
      </div>
    </div>
  </section>
</template>
