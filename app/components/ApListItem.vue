<script setup lang="ts">
// Isi <li> berikon: menerima [ikon, teks] atau teks biasa (ikon default).
const props = withDefaults(defineProps<{ item: [string, string] | string; fallback?: string }>(), { fallback: 'sparkle' })
const parts = computed(() => (Array.isArray(props.item) ? props.item : [props.fallback, props.item]))
</script>

<template><span class="ap-ico-chip"><ApIcon :name="parts[0]" /></span><span>{{ parts[1] }}</span></template>
