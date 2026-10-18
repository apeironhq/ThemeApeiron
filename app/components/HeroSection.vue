<script setup lang="ts">
import { ArrowRight, Code, LayoutTemplate, MessageCircle, RefreshCw } from 'lucide-vue-next'
import { hero, marquee } from '~/data/content'
import { site } from '~/data/site'
import { useGsap } from '~/composables/useGsap'

const root = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const gate = ref<{ isOpen: boolean } | null>(null)

const notes = [
  { icon: LayoutTemplate, text: 'Native Elementor' },
  { icon: Code, text: 'Tanpa coding' },
  { icon: RefreshCw, text: 'Update rutin' }
]

useGsap(root, ({ gsap, ScrollTrigger, SplitText, finePointer }) => {
  // autoSplit memecah ulang baris saat font selesai dimuat atau lebar berubah;
  // animasi dibuat di onSplit dan dikembalikan agar GSAP bisa membersihkan/menyinkronkannya.
  SplitText.create(title.value!, {
    type: 'lines,words',
    mask: 'lines',
    autoSplit: true,
    onSplit: (self) => gsap.from(self.words, { yPercent: 110, duration: 1.2, stagger: 0.04, ease: 'expo.out', delay: 0.15 })
  })

  // Hero ditahan di tempat; section berikutnya meluncur menutupinya (transisi tanpa jeda).
  ScrollTrigger.create({ trigger: root.value, start: 'top top', end: 'bottom top', pin: true, pinSpacing: false })

  const intro = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } })
  intro
    .from('[data-hero-fade]', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.1 }, 0.55)
    .from(
      '[data-gate]',
      { autoAlpha: 0, y: 140, rotationX: 40, rotationZ: -8, scale: 0.86, transformPerspective: 1400, duration: 1.8, ease: 'expo.out' },
      0.3
    )
    .from('[data-gate-seal]', { scale: 0, rotation: -120, duration: 1.1, ease: 'back.out(1.6)' }, 1.0)
    .from('[data-gate-tag]', { rotation: 35, autoAlpha: 0, duration: 1.4, ease: 'elastic.out(1, 0.45)' }, 1.25)
    .from('[data-chip]', { autoAlpha: 0, scale: 0.6, y: 20, stagger: 0.12, duration: 0.8, ease: 'back.out(1.8)' }, 1.3)

  // Chip melayang pelan di tepi sampul.
  gsap.utils.toArray<HTMLElement>('[data-chip]').forEach((chip, i) => {
    gsap.to(chip, { yPercent: i % 2 ? 22 : -22, duration: 2.6 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.2 })
  })

  // Saat hero digulir keluar, panggung sampul mundur perlahan.
  gsap.to(stage.value, {
    yPercent: 12,
    scale: 0.92,
    autoAlpha: 0.4,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true }
  })
  gsap.to('[data-hero-copy]', {
    yPercent: -18,
    autoAlpha: 0.2,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true }
  })

  // Marquee berjalan terus, lebih cepat saat pengguna menggulir cepat.
  const loop = gsap.to(track.value, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 400)
      gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true })
      gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.25, ease: 'power2.out' })
    }
  })

  // Sampul miring halus dan kilau kertas mengikuti kursor.
  if (!finePointer || !stage.value) return

  const target = stage.value.querySelector<HTMLElement>('[data-tilt-target]')!
  gsap.set(target, { transformPerspective: 1400 })
  const rotateX = gsap.quickTo(target, 'rotationX', { duration: 1, ease: 'power3' })
  const rotateY = gsap.quickTo(target, 'rotationY', { duration: 1, ease: 'power3' })
  const glares = stage.value.querySelectorAll<HTMLElement>('[data-glare]')

  const onMove = (event: PointerEvent) => {
    const rect = stage.value!.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    rotateY((x - 0.5) * 14)
    rotateX(-(y - 0.5) * 10)
    glares.forEach((glare) => {
      glare.style.setProperty('--gx', `${x * 100}%`)
      glare.style.setProperty('--gy', `${y * 100}%`)
    })
  }
  const onLeave = () => {
    rotateX(0)
    rotateY(0)
  }

  stage.value.addEventListener('pointermove', onMove)
  stage.value.addEventListener('pointerleave', onLeave)

  return () => {
    stage.value?.removeEventListener('pointermove', onMove)
    stage.value?.removeEventListener('pointerleave', onLeave)
  }
})
</script>

<template>
  <section
    id="top"
    ref="root"
    class="relative flex min-h-svh flex-col overflow-hidden bg-[linear-gradient(180deg,#073650_0%,#062f46_55%,#052a3f_100%)] pt-[clamp(110px,18vh,170px)] text-white"
  >
    <div class="container-ap grid flex-1 items-center gap-10 pb-[clamp(28px,7vh,80px)] lg:grid-cols-[1.05fr_0.95fr]">
      <div data-hero-copy>
        <p data-hero-fade class="eyebrow !text-sand">{{ hero.eyebrow }}</p>

        <h1
          ref="title"
          class="mt-6 text-[clamp(40px,min(5.3vw,9.5vh),76px)] font-light leading-[1.04] tracking-[-0.03em]"
        >
          {{ hero.title }}
        </h1>

        <p data-hero-fade class="mt-[clamp(14px,2.8vh,26px)] max-w-[540px] text-base leading-relaxed text-white/70 sm:text-lg">
          {{ hero.lead }}
        </p>

        <div data-hero-fade class="mt-[clamp(18px,4vh,36px)] flex flex-wrap gap-3">
          <a
            v-magnetic
            href="#fitur"
            class="inline-flex h-[52px] items-center gap-2 rounded-full bg-white px-7 text-[15px] font-medium text-navy-900"
          >
            Lihat cara kerjanya
            <ArrowRight class="size-4" aria-hidden="true" />
          </a>
          <a
            v-magnetic
            :href="site.demoRequestUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/25 px-7 text-[15px] font-medium transition-colors hover:bg-white/10"
          >
            <MessageCircle class="size-4" aria-hidden="true" />
            Minta demo
          </a>
        </div>

        <ul data-hero-fade class="mt-[clamp(14px,2.8vh,28px)] flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/60">
          <li v-for="note in notes" :key="note.text" class="inline-flex items-center gap-2">
            <component :is="note.icon" class="size-4 text-sand" aria-hidden="true" />
            {{ note.text }}
          </li>
        </ul>
      </div>

      <div
        ref="stage"
        class="relative grid h-[600px] place-items-center lg:h-[clamp(380px,calc(100vh-230px),620px)]"
      >
        <CoverGate ref="gate" />
        <p class="absolute bottom-[2%] left-1/2 -translate-x-1/2 transition-opacity duration-500" :class="gate?.isOpen ? 'opacity-0' : 'opacity-100'">
          <span data-hero-fade class="block whitespace-nowrap text-xs tracking-[0.08em] text-white/55">
            Klik segel untuk membuka undangan ✦
          </span>
        </p>
      </div>
    </div>

    <div class="ap-marquee" aria-label="Daftar widget">
      <div ref="track" class="ap-marquee__track">
        <template v-for="copy in 2" :key="copy">
          <span v-for="item in marquee" :key="`${copy}-${item}`" class="ap-marquee__item" :aria-hidden="copy === 2 || undefined">
            {{ item }}
          </span>
        </template>
      </div>
    </div>
  </section>
</template>
