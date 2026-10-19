<script setup lang="ts">
// Ikon widget (SVG asli plugin dari data/widgets.ts); bagian wi-* bisa dianimasikan.
import { widgets } from '~/data/widgets'

const props = defineProps<{ k: string }>()
const svg = computed(() => widgets.find((w) => w.key === props.k)?.icon ?? '')
</script>

<template>
  <svg class="dx-wico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="svg" />
</template>
