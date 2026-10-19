<script setup lang="ts">
// Pratinjau Aktivitas: popup bukti sosial yang bergantian di sudut halaman penjualan.
const props = defineProps<{ s: Record<string, any>; focus?: string | null; live?: boolean }>()

const feed = [
  { name: 'Dewi', product: 'Paket Premium', when: '2 menit lalu' },
  { name: 'Arif', product: 'Undangan Rustic', when: '8 menit lalu' },
  { name: 'Salsa', product: 'Paket Gold', when: '15 menit lalu' },
]
const i = ref(0)
const show = ref(true)
let id: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  id = setInterval(() => {
    show.value = false
    setTimeout(() => { i.value = (i.value + 1) % feed.length; show.value = true }, 450)
  }, 3200)
})
onBeforeUnmount(() => clearInterval(id))

const item = computed(() => feed[i.value]!)
const text = computed(() => String(props.s.format || '').replace(/\{name\}/g, item.value.name).replace(/\{product\}/g, item.value.product))
const pos = computed(() => ({ 'Atas Kanan': 'tr', 'Atas Kiri': 'tl', 'Bawah Kanan': 'br' } as Record<string, string>)[props.s.pos] ?? 'bl')
</script>

<template>
  <div class="pv pv-sp">
    <div class="pv-sp__page" aria-hidden="true">
      <span class="pv-sp__nav"><i></i><i></i></span>
      <span class="pv-sp__eyebrow">Jasa Undangan Digital</span>
      <b>Undangan elegan, siap dalam sehari</b>
      <i class="pv-sp__line"></i><i class="pv-sp__line is-short"></i>
      <span class="pv-sp__cta">Pesan Sekarang</span>
      <span class="pv-sp__grid"><i></i><i></i><i></i><i></i></span>
    </div>

    <Transition name="pv-toast">
      <div v-if="show" :key="i" class="pv-sp__pop" :class="`at-${pos}`" data-f="popup pos data">
        <span class="pv-sp__av">{{ item.name[0] }}</span>
        <span class="pv-sp__txt" data-f="format">
          <b>{{ text }}</b>
          <small>{{ item.when }}</small>
        </span>
        <span class="pv-sp__x" aria-hidden="true">×</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pv-sp { position: relative; overflow: hidden; background: #fff; }
.pv-sp__page { display: grid; justify-items: center; gap: 8px; padding: 18px 18px 0; text-align: center; }
.pv-sp__nav { justify-self: stretch; display: flex; justify-content: space-between; margin-bottom: 14px; }
.pv-sp__nav i { width: 46px; height: 8px; border-radius: 4px; background: #e3eaef; }
.pv-sp__nav i + i { width: 22px; }
.pv-sp__eyebrow { font-size: 9.5px; letter-spacing: .18em; text-transform: uppercase; color: #9a7b4f; }
.pv-sp__page b { font-size: 19px; font-weight: 500; line-height: 1.25; color: var(--dx-navy); }
.pv-sp__line { width: 90%; height: 7px; border-radius: 4px; background: #eef2f5; }
.pv-sp__line.is-short { width: 60%; }
.pv-sp__cta { margin: 6px 0 14px; padding: 9px 16px; border-radius: 999px; background: var(--dx-navy); color: #fff; font-size: 11px; }
.pv-sp__grid { justify-self: stretch; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.pv-sp__grid i { height: 92px; border-radius: 12px; background: linear-gradient(140deg, #eef5f8, #f7efe1); }

.pv-sp__pop { position: absolute; z-index: 2; display: flex; align-items: center; gap: 8px; width: calc(100% - 28px); max-width: 250px; padding: 9px 10px; border-radius: 14px; background: #fff; border: 1px solid var(--dx-line); }
.at-bl { left: 14px; bottom: 16px; }
.at-br { right: 14px; bottom: 16px; }
.at-tl { left: 14px; top: 16px; }
.at-tr { right: 14px; top: 16px; }
.pv-sp__av { display: grid; place-items: center; flex: none; width: 32px; height: 32px; border-radius: 10px; background: var(--dx-navy); color: #e9d3a8; font-size: 12px; }
.pv-sp__txt { min-width: 0; flex: 1; }
.pv-sp__txt b { display: block; font-size: 10.5px; font-weight: 500; line-height: 1.35; color: var(--dx-ink); }
.pv-sp__txt small { font-size: 9px; color: var(--dx-muted); }
.pv-sp__x { color: var(--dx-muted); font-size: 14px; line-height: 1; align-self: flex-start; }
.pv-toast-enter-active { transition: transform .5s cubic-bezier(.2, .9, .25, 1.2), opacity .4s; }
.pv-toast-leave-active { transition: transform .35s ease-in, opacity .3s; }
.pv-toast-enter-from { transform: translateY(14px) scale(.96); opacity: 0; }
.at-tl.pv-toast-enter-from, .at-tr.pv-toast-enter-from { transform: translateY(-14px) scale(.96); }
.pv-toast-leave-to { transform: scale(.96); opacity: 0; }
</style>
