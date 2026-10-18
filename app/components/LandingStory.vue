<script setup lang="ts">
import { content as c } from '~/data/content'
</script>

<template>
  <section class="ap-story" data-story aria-label="Masalah yang kami selesaikan">
    <div class="ap-story__pin">
      <div class="ap-container ap-story__inner">
        <p v-for="(line, i) in c.story" :key="i" class="ap-story__line" :class="{ 'is-answer': i === c.story.length - 1 }" data-story-line>{{ line }}</p>
      </div>
      <div class="ap-story__progress" aria-hidden="true"><span data-story-progress></span></div>
    </div>
  </section>
</template>
