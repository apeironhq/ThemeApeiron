<script setup lang="ts">
import { content as c } from '~/data/content'
</script>

<template>
  <section class="ap-section ap-pricing" id="harga">
    <DecoIcons set="pricing" />
    <div class="ap-container">
      <header class="ap-head ap-head--center">
        <h2 class="ap-title" data-split>Satu lisensi, semua widget.</h2>
        <p class="ap-lead" data-reveal>Semua paket mendapat akses penuh ke seluruh widget. Bedanya hanya jumlah situs dan prioritas dukungan.</p>
      </header>
      <div class="ap-pricing__grid" data-approach>
        <article v-for="p in c.pricing" :key="p.name" class="ap-plan" :class="{ 'is-featured': p.featured }" data-spotlight data-reveal>
          <span v-if="p.featured" class="ap-plan__flag">Paling populer</span>
          <h3>{{ p.name }}</h3>
          <p class="ap-plan__desc">{{ p.desc }}</p>
          <p class="ap-plan__price"><b>{{ p.price }}</b><span>{{ p.period }}</span></p>
          <ul>
            <li v-for="f in p.features" :key="f[1]"><ApListItem :item="f" /></li>
          </ul>
          <a class="ap-btn ap-btn--block" :class="p.featured ? 'ap-btn--light' : 'ap-btn--primary'" :href="c.links.buy" data-magnetic>Pilih {{ p.name }}</a>
        </article>
      </div>
      <p class="ap-pricing__note" data-reveal>Butuh paket khusus? <a :href="c.links.demo" target="_blank" rel="noopener">Hubungi kami lewat WhatsApp</a>.</p>
    </div>
  </section>
</template>
