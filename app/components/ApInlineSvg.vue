<script setup lang="ts">
// SVG ornamen Cover Classic, ditanam inline seperti apeiron_inline_svg() di tema WordPress.
const props = defineProps<{ raw: string; vars?: Record<string, string>; extraClass?: string }>()

const parsed = computed(() => {
  const open = props.raw.match(/<svg\b([^>]*)>/)
  const attrs = open?.[1] ?? ''
  const attr = (n: string) => attrs.match(new RegExp(`(?:^|\\s)${n}="([^"]*)"`))?.[1] ?? ''
  const start = (open?.index ?? 0) + (open?.[0].length ?? 0)
  return {
    viewBox: attr('viewBox'),
    cls: [attr('class'), props.extraClass].filter(Boolean).join(' '),
    inner: props.raw.slice(start, props.raw.lastIndexOf('</svg>')),
  }
})
const style = computed(() => Object.entries(props.vars ?? {}).map(([k, v]) => `--${k}:${v};`).join(''))
</script>

<template>
  <svg :class="parsed.cls" :style="style || undefined" xmlns="http://www.w3.org/2000/svg" :viewBox="parsed.viewBox" aria-hidden="true" focusable="false" v-html="parsed.inner" />
</template>
