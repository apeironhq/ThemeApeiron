<script setup lang="ts">
import { content as c } from '~/data/content'
</script>

<template>
  <section class="ap-section ap-audience">
    <div class="ap-container">
      <header class="ap-head">
        <h2 class="ap-title" data-split>Dibuat untuk bisnis yang hidup dari undangan.</h2>
      </header>
      <div class="ap-audience__grid">
        <article v-for="(a, i) in c.audience" :key="a.tag" class="ap-audience__card" :class="{ 'is-dark': i > 0 }" data-tilt data-reveal>
          <span class="ap-tag">{{ a.tag }}</span>
          <h3>{{ a.title }}</h3>
          <ul>
            <li v-for="p in a.points" :key="p[1]"><ApListItem :item="p" /></li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
