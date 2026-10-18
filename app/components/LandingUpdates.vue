<script setup lang="ts">
import { content as c } from '~/data/content'
</script>

<template>
  <section class="ap-section ap-updates" id="pembaruan">
    <div class="ap-container ap-updates__inner">
      <header class="ap-head">
        <h2 class="ap-title" data-split>Plugin yang aktif dirawat, bukan ditinggal.</h2>
        <p class="ap-lead" data-reveal>Setiap rilis membawa widget baru, perbaikan, dan peningkatan performa. Semua perubahan tercatat di dokumentasi.</p>
        <a class="ap-btn ap-btn--ghost" :href="c.links.docs" data-reveal data-cursor="Baca"><ApIcon name="book" /> Buka Dokumentasi</a>
      </header>

      <!-- Daftar rilis berjalan otomatis (loop). Isinya diduplikasi agar sambungannya mulus. -->
      <div class="ap-timeline-viewport" data-timeline-loop data-approach>
        <div class="ap-timeline-track" data-timeline-track>
          <ol v-for="copy in 2" :key="copy" class="ap-timeline" :aria-hidden="copy > 1 ? 'true' : undefined">
            <li v-for="(u, i) in c.updates" :key="u.version" class="ap-timeline__item" :class="{ 'is-latest': i === 0 }">
              <div class="ap-timeline__meta">
                <span class="ap-version">v{{ u.version }}</span>
                <span v-if="i === 0" class="ap-badge">Terbaru</span>
                <time>{{ u.date }}</time>
              </div>
              <ul>
                <li v-for="item in u.items" :key="item[1]"><ApListItem :item="item" fallback="plus" /></li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>
