<script setup lang="ts">
defineProps<{ light?: boolean }>()
</script>

<template>
  <a class="ap-logo" :class="{ 'ap-logo--light': light }" href="/" aria-label="ApeironKit">
    <span class="ap-logo__mark" aria-hidden="true">
      <svg viewBox="0 0 32 32"><path d="M16 3 4 29h5l7-16 7 16h5z" fill="currentColor" /><circle cx="16" cy="22" r="2.4" fill="currentColor" /></svg>
    </span>
    <span class="ap-logo__text">Apeiron<em>Kit</em></span>
  </a>
</template>
