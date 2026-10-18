<script setup lang="ts">
import { content as c } from '~/data/content'

const all = c.testimonials
const half = Math.ceil(all.length / 2)
const rows = [all.slice(0, half), all.slice(half)]
</script>

<template>
  <section class="ap-section ap-testi">
    <div class="ap-container">
      <header class="ap-head ap-head--center">
        <h2 class="ap-title" data-split>Dipercaya para pembuat undangan.</h2>
      </header>
    </div>
    <div class="ap-testi__rows">
      <div v-for="(row, r) in rows" :key="r" class="ap-testi__row" data-testi-row :data-direction="r ? '1' : '-1'">
        <div class="ap-testi__track">
          <template v-for="copy in 3" :key="copy">
            <figure v-for="(t, i) in row" :key="i" class="ap-quote" :aria-hidden="copy > 1 ? 'true' : undefined">
              <blockquote>“{{ t.quote }}”</blockquote>
              <figcaption>
                <span class="ap-quote__avatar">{{ t.role.charAt(0) }}</span>
                <span><b>{{ t.name }}</b><small>{{ t.role }}</small></span>
              </figcaption>
            </figure>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
