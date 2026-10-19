<script setup lang="ts">
// Panel kontrol demo "Coba langsung": mengubah state yang sama dengan yang dibaca pratinjau.
import type { DocKnob } from '~/data/docs'

const props = defineProps<{ knobs: DocKnob[]; s: Record<string, any> }>()
const emit = defineEmits<{ reset: [] }>()
const set = (k: string, v: unknown) => (props.s[k] = v)
</script>

<template>
  <div class="dx-knobs">
    <div class="dx-knobs__head">
      <span><ApIcon name="wrench" /> Pengaturan demo</span>
      <button type="button" class="dx-knobs__reset" @click="emit('reset')"><ApIcon name="refresh" /> Atur ulang</button>
    </div>

    <div v-for="k in knobs" :key="k.key" class="dx-knob" :class="`dx-knob--${k.type}`">
      <template v-if="k.type === 'toggle'">
        <span class="dx-knob__label">{{ k.label }}</span>
        <button type="button" role="switch" class="dx-switch" :class="{ 'is-on': s[k.key] }" :aria-checked="!!s[k.key]" :aria-label="k.label" @click="set(k.key, !s[k.key])"><i></i></button>
      </template>

      <template v-else-if="k.type === 'select'">
        <span class="dx-knob__label">{{ k.label }}</span>
        <div class="dx-seg" :class="{ 'is-many': (k.options?.length ?? 0) > 3 }">
          <button v-for="o in k.options" :key="o" type="button" :class="{ 'is-on': s[k.key] === o }" @click="set(k.key, o)">{{ o }}</button>
        </div>
      </template>

      <template v-else-if="k.type === 'range'">
        <span class="dx-knob__label">{{ k.label }} <b>{{ s[k.key] }}{{ k.unit ?? '' }}</b></span>
        <input type="range" class="dx-range" :min="k.min" :max="k.max" :step="k.step" :value="s[k.key]" :aria-label="k.label" :style="{ '--p': `${((Number(s[k.key]) - (k.min ?? 0)) / ((k.max ?? 100) - (k.min ?? 0))) * 100}%` }" @input="set(k.key, Number(($event.target as HTMLInputElement).value))">
      </template>

      <label v-else class="dx-knob__field">
        <span class="dx-knob__label">{{ k.label }}</span>
        <textarea v-if="k.type === 'textarea'" rows="3" :value="s[k.key]" @input="set(k.key, ($event.target as HTMLTextAreaElement).value)"></textarea>
        <input v-else :type="k.type === 'datetime' ? 'datetime-local' : 'text'" :value="s[k.key]" @input="set(k.key, ($event.target as HTMLInputElement).value)">
      </label>
    </div>
  </div>
</template>
