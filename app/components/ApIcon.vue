<script setup lang="ts">
import { icons, type IconName } from '~/data/icons'

const props = defineProps<{ name: IconName | string }>()
const path = computed(() => icons[props.name as IconName] ?? icons.sparkle)
</script>

<template>
  <svg class="ap-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" v-html="path" />
</template>
