<script setup lang="ts">
import { FileCode2, LayoutDashboard, LayoutTemplate, Link2, MessageCircle, Type } from 'lucide-vue-next'
import { sample } from '~/data/site'
import { useGsap } from '~/composables/useGsap'

const root = ref<HTMLElement | null>(null)

// Ukuran CSS minified asli dari plugin ApeironKit 1.5.5.
const assets = [
  { name: 'Countdown', size: '3,2 KB' },
  { name: 'Clipboard Tap', size: '5,7 KB' },
  { name: 'Signal Form', size: '10,2 KB' },
  { name: 'Soundscape', size: '11,6 KB' }
]

const controls = [
  { label: 'Warna aksen', value: '#083C57', swatch: true },
  { label: 'Font judul', value: 'Ubuntu · 300' },
  { label: 'Animasi masuk', value: 'Fade up · 0,8 dtk' }
]

useGsap(root, ({ gsap, ScrollTrigger }) => {
  // Kartu bento muncul bergelombang sesuai urutan masuk viewport.
  gsap.set('[data-bento]', { autoAlpha: 0, y: 50 })
  ScrollTrigger.batch('[data-bento]', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 1, ease: 'expo.out', overwrite: true })
  })

  // Visual di dalam kartu bergerak sedikit lebih lambat dari kartunya (parallax halus).
  gsap.utils.toArray<HTMLElement>('[data-bento-visual]').forEach((visual) => {
    gsap.fromTo(
      visual,
      { yPercent: 8 },
      {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: true }
      }
    )
  })

  // Baris kontrol Elementor menyala bergantian.
  const rows = gsap.utils.toArray<HTMLElement>('[data-control-row]')
  const tl = gsap.timeline({ repeat: -1, scrollTrigger: { trigger: '[data-bento-editor]', start: 'top 85%', toggleActions: 'play pause resume pause' } })
  rows.forEach((row) => {
    tl.to(row, { backgroundColor: 'rgba(8,60,87,0.07)', borderColor: 'rgba(8,60,87,0.45)', duration: 0.4 })
      .to(row, { backgroundColor: 'rgba(8,60,87,0)', borderColor: 'rgba(225,233,238,1)', duration: 0.4 }, '+=1.1')
  })
})
</script>

<template>
  <section id="keunggulan" ref="root" class="scroll-mt-20 py-[clamp(80px,12vw,140px)]">
    <div class="container-ap">
      <SectionHeading
        eyebrow="Keunggulan"
        title="Dibuat serius untuk detail yang dilihat tamu, dan alur kerja yang Anda jalani."
        lead="Bukan sekadar kumpulan widget. Setiap bagian ApeironKit dirancang agar cepat dipakai, mudah diatur, dan ringan saat dibuka."
      />

      <div class="mt-14 grid gap-4 md:grid-cols-6">
        <!-- Native Elementor -->
        <article data-bento class="bento md:col-span-4">
          <div class="bento__copy">
            <span class="bento__icon"><LayoutTemplate aria-hidden="true" /></span>
            <h3 class="bento__title">Native Elementor, tanpa belajar ulang.</h3>
            <p class="bento__text">Setiap widget punya tab Konten dan Gaya seperti widget Elementor lainnya. Tim Anda langsung paham sejak hari pertama.</p>
          </div>
          <div data-bento-visual data-bento-editor class="bento__visual mt-8 grid gap-2 rounded-2xl border border-line bg-paper p-4 sm:max-w-[420px]">
            <div class="flex gap-1 rounded-lg bg-soft p-1 text-xs">
              <span class="flex-1 rounded-md bg-surface py-1.5 text-center font-medium text-ink">Konten</span>
              <span class="flex-1 py-1.5 text-center text-muted">Gaya</span>
              <span class="flex-1 py-1.5 text-center text-muted">Lanjutan</span>
            </div>
            <div v-for="control in controls" :key="control.label" data-control-row class="rounded-xl border border-line px-3 py-2">
              <p class="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">{{ control.label }}</p>
              <p class="mt-1 flex items-center gap-2 text-[13px] text-ink">
                <i v-if="control.swatch" class="size-3.5 rounded bg-navy" />
                {{ control.value }}
              </p>
            </div>
          </div>
        </article>

        <!-- Tipografi -->
        <article data-bento class="bento md:col-span-2">
          <div class="bento__copy">
            <span class="bento__icon"><Type aria-hidden="true" /></span>
            <h3 class="bento__title">Tipografi yang benar-benar mengikuti pengaturan.</h3>
            <p class="bento__text">Kontrol Typography Elementor langsung mengatur font yang tampil di undangan.</p>
          </div>
          <div data-bento-visual class="bento__visual mt-8 flex items-end justify-between rounded-2xl bg-navy px-5 py-6 text-white">
            <span class="type-cycle text-[44px] leading-none">Aa</span>
            <span class="grid gap-1 text-right text-[11px] text-white/60">
              <span>300</span><span>400</span><span>500</span>
            </span>
          </div>
        </article>

        <!-- Nama tamu personal -->
        <article data-bento class="bento md:col-span-2">
          <div class="bento__copy">
            <span class="bento__icon"><Link2 aria-hidden="true" /></span>
            <h3 class="bento__title">Nama tamu tampil personal.</h3>
            <p class="bento__text">Guest Invitation Manager membuat link khusus per tamu. Namanya otomatis muncul di sampul.</p>
          </div>
          <div data-bento-visual class="bento__visual mt-8 grid gap-3">
            <p class="truncate rounded-xl border border-line bg-paper px-3 py-2.5 text-[12px] text-muted">
              undangan.id/?to=<span class="text-ink">Andi+Pratama</span>
            </p>
            <div class="rounded-xl border border-sand/50 bg-[#fbf8f2] px-4 py-3 text-center text-navy-900">
              <p class="text-[11px] text-[#5a6d78]">Kepada Yth.</p>
              <p class="mt-0.5 text-[15px] font-medium">{{ sample.guest }}</p>
            </div>
          </div>
        </article>

        <!-- RSVP WhatsApp -->
        <article data-bento class="bento md:col-span-2">
          <div class="bento__copy">
            <span class="bento__icon"><MessageCircle aria-hidden="true" /></span>
            <h3 class="bento__title">RSVP langsung ke WhatsApp.</h3>
            <p class="bento__text">Signal Form mengirim nama dan jumlah tamu dengan format pesan yang rapi.</p>
          </div>
          <div data-bento-visual class="bento__visual mt-8 rounded-2xl bg-[#e7f5ec] p-4">
            <p class="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[#d4f5dc] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-[#14532d]">
              <b class="font-medium">Konfirmasi Kehadiran</b><br>
              Nama: Andi Pratama<br>
              Jumlah: 2 orang<br>
              Status: Hadir
            </p>
          </div>
        </article>

        <!-- Ringan -->
        <article data-bento class="bento md:col-span-2">
          <div class="bento__copy">
            <span class="bento__icon"><FileCode2 aria-hidden="true" /></span>
            <h3 class="bento__title">Ringan dibuka di HP tamu.</h3>
            <p class="bento__text">Aset dipisah per widget dalam versi minified, jadi halaman hanya memuat yang dipakai.</p>
          </div>
          <ul data-bento-visual class="bento__visual mt-8 divide-y divide-line rounded-2xl border border-line">
            <li v-for="asset in assets" :key="asset.name" class="flex items-center justify-between px-4 py-2.5 text-[13px]">
              <span class="text-muted">{{ asset.name }}</span>
              <span class="tabular-nums text-ink">{{ asset.size }}</span>
            </li>
          </ul>
        </article>

        <!-- Dashboard -->
        <article data-bento class="bento md:col-span-6 md:grid md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-10">
          <div class="bento__copy">
            <span class="bento__icon"><LayoutDashboard aria-hidden="true" /></span>
            <h3 class="bento__title">Hadiah dan pesanan tercatat rapi di dashboard MDUNDIG.</h3>
            <p class="bento__text">
              Setiap reservasi Daftar Hadiah dan pesanan dari Form Order otomatis masuk ke dashboard, lengkap dengan status.
            </p>
          </div>
          <div data-bento-visual class="bento__visual mt-8 overflow-hidden rounded-2xl border border-line md:mt-0">
            <div class="grid grid-cols-[1.4fr_1fr_0.8fr] bg-soft px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              <span>Hadiah</span><span>Tamu</span><span class="text-right">Status</span>
            </div>
            <div
              v-for="row in [
                { item: 'Rice Cooker', guest: 'Sinta', status: 'Dipesan' },
                { item: 'Set Piring', guest: 'Dimas', status: 'Dipesan' },
                { item: 'Blender', guest: '—', status: 'Tersedia' }
              ]"
              :key="row.item"
              class="grid grid-cols-[1.4fr_1fr_0.8fr] border-t border-line px-4 py-3 text-[13px]"
            >
              <span class="text-ink">{{ row.item }}</span>
              <span class="text-muted">{{ row.guest }}</span>
              <span class="text-right">
                <i
                  class="rounded-full px-2 py-0.5 text-[11px] not-italic font-medium"
                  :class="row.status === 'Dipesan' ? 'bg-[#e3f5ec] text-[#1a7f53]' : 'bg-soft text-accent'"
                >{{ row.status }}</i>
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bento {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  padding: clamp(24px, 3vw, 36px);
  transition: border-color 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.bento:hover {
  border-color: color-mix(in srgb, var(--color-accent) 35%, transparent);
}

.bento__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--color-soft);
  color: var(--color-accent);
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.bento:hover .bento__icon {
  transform: rotate(-8deg) scale(1.08);
}

.bento__icon svg {
  width: 20px;
  height: 20px;
}

.bento__title {
  margin-top: 22px;
  font-size: clamp(19px, 1.7vw, 22px);
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}

.bento__text {
  margin-top: 10px;
  max-width: 460px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-muted);
}

.bento__visual {
  will-change: transform;
}

.type-cycle {
  font-weight: 300;
  animation: type-cycle 3.6s steps(1) infinite;
}

@keyframes type-cycle {
  0% {
    font-weight: 300;
  }
  33% {
    font-weight: 400;
  }
  66% {
    font-weight: 500;
  }
}

@media (prefers-reduced-motion: reduce) {
  .type-cycle {
    animation: none;
  }
}
</style>
