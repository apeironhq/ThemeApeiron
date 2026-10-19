<script setup lang="ts">
/**
 * Memilih pratinjau widget sesuai slug. Tiap pratinjau dimuat sebagai chunk sendiri,
 * jadi halaman sebuah widget hanya mengunduh demonya sendiri.
 */
const props = defineProps<{ slug: string; s: Record<string, any>; focus?: string | null; live?: boolean }>()

const map: Record<string, () => Promise<any>> = {
  'sampul': () => import('./preview/PvSampul.vue'),
  'hitung-mundur': () => import('./preview/PvHitungMundur.vue'),
  'tombol-audio': () => import('./preview/PvTombolAudio.vue'),
  'form-whatsapp': () => import('./preview/PvFormWhatsapp.vue'),
  'ucapan-tamu': () => import('./preview/PvUcapanTamu.vue'),
  'daftar-hadiah': () => import('./preview/PvDaftarHadiah.vue'),
  'manajemen-tamu': () => import('./preview/PvManajemenTamu.vue'),
  'tombol-salin': () => import('./preview/PvTombolSalin.vue'),
  'cerita-cinta': () => import('./preview/PvCeritaCinta.vue'),
  'form-order': () => import('./preview/PvFormOrder.vue'),
  'aktivitas': () => import('./preview/PvAktivitas.vue'),
  'gulir-otomatis': () => import('./preview/PvGulirOtomatis.vue'),
  'pemuat-halaman': () => import('./preview/PvPemuatHalaman.vue'),
}
const comp = computed(() => (map[props.slug] ? defineAsyncComponent(map[props.slug]!) : null))
</script>

<template>
  <component :is="comp" v-if="comp" :s="s" :focus="focus" :live="live" />
</template>
