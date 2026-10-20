<script setup lang="ts">
import { content as c, orderLink } from '~/data/content'

// 49000 -> "49.000" (format rupiah tanpa bergantung pada Intl).
const num = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const off = (p: { price: number; was: number }) => Math.round((1 - p.price / p.was) * 100)
</script>

<template>
  <section class="ap-section ap-pricing" id="harga">
    <DecoIcons set="pricing" />
    <div class="ap-container">
      <header class="ap-head ap-head--center">
        <h2 class="ap-title" data-split>Satu lisensi, semua widget.</h2>
        <p class="ap-lead" data-reveal>Semua paket mendapat akses penuh ke seluruh widget. Bedanya hanya cara bayar dan lama masa pembaruan.</p>
      </header>
      <div class="ap-pricing__grid" data-approach>
        <article v-for="p in c.pricing" :key="p.name" class="ap-plan" :class="{ 'is-featured': p.featured }" data-spotlight data-reveal data-price-plan>
          <span v-if="p.badge" class="ap-plan__flag" :class="{ 'ap-plan__flag--soft': !p.featured }">{{ p.badge }}</span>
          <h3>{{ p.name }}</h3>
          <p class="ap-plan__desc">{{ p.desc }}</p>
          <div class="ap-plan__deal">
            <s class="ap-plan__was"><span class="ap-sr">Harga normal </span>Rp{{ num(p.was) }}<i aria-hidden="true" data-strike></i></s>
            <span class="ap-plan__off" data-off><ApIcon name="tag" /> Hemat {{ off(p) }}%</span>
          </div>
          <p class="ap-plan__price">
            <b><span class="ap-sr">Harga sekarang </span>Rp<span data-price :data-from="p.was" :data-to="p.price">{{ num(p.price) }}</span></b>
            <span>{{ p.period }}</span>
          </p>
          <ul>
            <li v-for="f in p.features" :key="f[1]"><ApListItem :item="f" /></li>
          </ul>
          <a class="ap-btn ap-btn--block" :class="p.featured ? 'ap-btn--light' : 'ap-btn--primary'" :href="orderLink(p)" target="_blank" rel="noopener" data-magnetic><ApIcon name="chat" /> Pilih Paket {{ p.name }}</a>
        </article>
      </div>
      <p class="ap-pricing__note" data-reveal>Butuh lisensi untuk banyak website? <a :href="c.links.demo" target="_blank" rel="noopener">Hubungi kami lewat WhatsApp</a>.</p>
    </div>
  </section>
</template>
