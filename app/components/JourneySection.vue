<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { Check, Gift, Layers, MessageCircle, Play, Sparkles } from 'lucide-vue-next'
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'
import { journey } from '~/data/content'
import { sample } from '~/data/site'
import { nextOccurrence, useGsap } from '~/composables/useGsap'

const root = ref<HTMLElement | null>(null)
const pin = ref<HTMLElement | null>(null)
const fitBox = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const pillList = ref<HTMLElement | null>(null)

const current = ref(0)
const giftTaken = ref(false)
const total = journey.length

const now = useNow({ interval: 1000 })
const target = nextOccurrence(sample.eventDate)
const countdown = computed(() => {
  const diff = Math.max(0, target - now.value.getTime())
  return [
    Math.floor(diff / 864e5),
    Math.floor((diff / 36e5) % 24),
    Math.floor((diff / 6e4) % 60),
    Math.floor((diff / 1e3) % 60)
  ].map((n) => String(n).padStart(2, '0'))
})

let trigger: ScrollTriggerType | undefined
let goTo: ((index: number) => void) | undefined

const { $lenis } = useNuxtApp()

/** Klik penanda adegan: gulir ke posisi adegan tersebut (atau ganti langsung tanpa animasi). */
function selectScene(index: number) {
  if (!trigger) {
    current.value = index
    return
  }
  const position = trigger.start + ((index + 0.5) / total) * (trigger.end - trigger.start)
  if ($lenis) $lenis.scrollTo(position, { duration: 1.2 })
  else window.scrollTo({ top: position, behavior: 'smooth' })
}

useGsap(root, ({ gsap, ScrollTrigger, finePointer }) => {
  const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = root.value!) => scope.querySelector<T>(sel)!
  const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = root.value!) =>
    Array.from(scope.querySelectorAll<T>(sel))

  const captions = $$('[data-caption]')
  const screens = $$('[data-screen]')
  const fields = $$('[data-field-text]')

  gsap.set(captions, { autoAlpha: 0, y: 30 })
  gsap.set(screens, { autoAlpha: 0 })
  gsap.set([captions[0], screens[0]], { autoAlpha: 1, y: 0 })

  // Skala panggung agar selalu muat di tinggi layar (laptop pendek, HP).
  const fit = () => {
    if (!fitBox.value || !stage.value) return
    gsap.set(stage.value, { scale: 1 })
    const scale = Math.min(
      1,
      fitBox.value.clientWidth / stage.value.offsetWidth,
      fitBox.value.clientHeight / stage.value.offsetHeight
    )
    gsap.set(stage.value, { scale })
  }
  fit()
  ScrollTrigger.addEventListener('refreshInit', fit)

  const typeField = (index: number) => {
    const node = fields[index]
    if (!node) return
    const full = journey[index]!.value
    const proxy = { n: 0 }
    gsap.to(proxy, {
      n: full.length,
      duration: Math.min(1, full.length * 0.04),
      ease: 'none',
      onUpdate: () => {
        node.textContent = full.slice(0, Math.round(proxy.n))
      }
    })
  }

  const sceneExtras = (index: number) => {
    const screen = screens[index]!
    switch (journey[index]!.key) {
      case 'cover':
        gsap.fromTo($('.ap-mini__seal', screen), { scale: 0.4, rotation: -90 }, { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.2 })
        gsap.fromTo($('.ap-mini__ribbon', screen), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out' })
        break
      case 'countdown':
        gsap.fromTo($$('.ap-screen__cd b', screen), { rotationX: -90, autoAlpha: 0 }, { rotationX: 0, autoAlpha: 1, stagger: 0.08, ease: 'back.out(1.6)', delay: 0.2 })
        break
      case 'music':
        gsap.fromTo($('.ap-screen__disc', screen), { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.2, ease: 'expo.out' })
        break
      case 'rsvp': {
        const button = $('.ap-screen__btn--wa', screen)
        gsap
          .timeline({ delay: 0.5 })
          .fromTo($$('.ap-screen__input, .ap-screen__stepper', screen), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.5 })
          .fromTo($('.ap-screen__toast', screen), { autoAlpha: 0, y: 12 }, { autoAlpha: 0, y: 12, duration: 0.01 }, 0)
          .to(button, { scale: 0.94, duration: 0.15, ease: 'power2.in' }, '+=0.2')
          .to(button, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
          .to($('.ap-screen__toast', screen), { autoAlpha: 1, y: 0, ease: 'back.out(2)' }, '-=0.3')
        break
      }
      case 'comment':
        gsap.fromTo($$('[data-dock-item]', screen), { autoAlpha: 0, y: 24, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.18, duration: 0.7, delay: 0.25 })
        gsap.fromTo($$('.ap-dock__body img', screen), { scale: 0, rotation: -25 }, { scale: 1, rotation: 0, stagger: 0.18, duration: 0.8, ease: 'back.out(2.4)', delay: 0.55 })
        break
      case 'registry': {
        giftTaken.value = false
        const button = $('[data-gift-btn]', screen)
        gsap
          .timeline({ delay: 0.3 })
          .fromTo($$('.ap-gift', screen), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 })
          .set($('.ap-screen__toast', screen), { autoAlpha: 0, y: 12 }, 0)
          .to(button, { scale: 0.93, duration: 0.15 }, '+=0.35')
          .add(() => {
            giftTaken.value = true
          })
          .to(button, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
          .to($('.ap-screen__toast', screen), { autoAlpha: 1, y: 0, ease: 'back.out(2)' }, '-=0.35')
        break
      }
    }
  }

  goTo = (index: number) => {
    if (index === current.value) return
    const dir = index > current.value ? 1 : -1
    const prev = current.value
    current.value = index

    gsap.to(captions[prev]!, { autoAlpha: 0, y: -24 * dir, duration: 0.5, ease: 'power2.in', overwrite: true })
    gsap.fromTo(captions[index]!, { autoAlpha: 0, y: 32 * dir }, { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.3, ease: 'expo.out', overwrite: true })

    gsap.to(screens[prev]!, { autoAlpha: 0, scale: 0.94, filter: 'blur(4px)', duration: 0.5, ease: 'power2.in', overwrite: true })
    gsap.fromTo(
      screens[index]!,
      { autoAlpha: 0, scale: 1.05, filter: 'blur(4px)' },
      { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, delay: 0.2, ease: 'expo.out', overwrite: true }
    )

    typeField(index)
    sceneExtras(index)

    // Di HP, penanda adegan berada di baris yang bisa digeser: jaga yang aktif tetap terlihat.
    const pills = pillList.value
    const pill = pills?.children[index] as HTMLElement | undefined
    if (pills && pill && pills.scrollWidth > pills.clientWidth) {
      pills.scrollTo({ left: pill.offsetLeft - (pills.clientWidth - pill.offsetWidth) / 2, behavior: 'smooth' })
    }
    gsap.fromTo('.ap-phone', { rotationY: -10 * dir, transformPerspective: 1200 }, { rotationY: 0, duration: 1.4, ease: 'elastic.out(1, 0.55)' })
  }

  // Adegan berganti mengikuti progres scroll saat section di-pin.
  trigger = ScrollTrigger.create({
    trigger: root.value,
    pin: pin.value,
    start: 'top top',
    end: () => `+=${window.innerHeight * 0.75 * total}`,
    anticipatePin: 1,
    onUpdate: (self) => goTo?.(Math.min(total - 1, Math.floor(self.progress * total * 0.999)))
  })

  gsap.fromTo(
    '[data-journey-bar]',
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top top', end: () => `+=${window.innerHeight * 0.75 * total}`, scrub: 0.5 }
    }
  )

  // Panel editor dan HP masuk dengan kedalaman 3D.
  gsap.from('.ap-editor', {
    x: -80,
    rotationY: 25,
    autoAlpha: 0,
    transformPerspective: 1200,
    scrollTrigger: { trigger: root.value, start: 'top 75%', end: 'top top', scrub: 1 }
  })
  gsap.from('.ap-phone', {
    y: 140,
    rotationX: 22,
    transformPerspective: 1200,
    scrollTrigger: { trigger: root.value, start: 'top 95%', end: 'top top', scrub: 1 }
  })

  sceneExtras(0)

  if (!finePointer || !fitBox.value) {
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', fit)
      trigger = undefined
    }
  }

  // Panggung miring halus mengikuti kursor.
  const tiltTarget = fitBox.value
  gsap.set(tiltTarget, { transformPerspective: 1600 })
  const rotateX = gsap.quickTo(tiltTarget, 'rotationX', { duration: 1, ease: 'power3' })
  const rotateY = gsap.quickTo(tiltTarget, 'rotationY', { duration: 1, ease: 'power3' })
  const onMove = (event: PointerEvent) => {
    rotateY((event.clientX / window.innerWidth - 0.5) * 10)
    rotateX(-(event.clientY / window.innerHeight - 0.5) * 6)
  }
  const onLeave = () => {
    rotateX(0)
    rotateY(0)
  }
  root.value!.addEventListener('pointermove', onMove)
  root.value!.addEventListener('pointerleave', onLeave)

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', fit)
    root.value?.removeEventListener('pointermove', onMove)
    root.value?.removeEventListener('pointerleave', onLeave)
    trigger = undefined
  }
})
</script>

<template>
  <section id="fitur" ref="root" class="bg-[linear-gradient(180deg,var(--color-paper),var(--color-soft))]">
    <div ref="pin" class="grid min-h-svh items-center pb-8 pt-[88px] lg:pb-14 lg:pt-[100px]">
      <div class="container-ap grid grid-cols-[minmax(0,1fr)] items-center gap-6 min-[900px]:grid-cols-[0.9fr_1.1fr] min-[900px]:gap-14">
        <div class="min-w-0">
          <!-- Semua caption ditumpuk di satu sel grid, jadi tingginya mengikuti caption terpanjang. -->
          <div class="grid">
            <article
              v-for="(step, index) in journey"
              :key="step.key"
              data-caption
              class="[grid-area:1/1]"
              :class="index === current ? 'visible opacity-100' : 'invisible opacity-0'"
              :aria-hidden="index !== current"
            >
              <span class="inline-flex items-center gap-2.5 text-[13px] font-medium tracking-[0.06em] text-accent">
                {{ String(index + 1).padStart(2, '0') }}
                <i class="size-1 rounded-full bg-current" aria-hidden="true" />
                {{ step.label }}
              </span>
              <h2 class="mt-3 text-[clamp(26px,4.2vw,54px)] font-normal leading-[1.08] tracking-[-0.02em] min-[900px]:mt-4">
                {{ step.title }}
              </h2>
              <p class="mt-3 max-w-[480px] text-sm leading-relaxed text-muted sm:text-[clamp(16px,1.4vw,18px)] min-[900px]:mt-4">
                {{ step.text }}
              </p>
            </article>
          </div>

          <ol
            ref="pillList"
            class="relative -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] min-[900px]:mx-0 min-[900px]:mt-6 min-[900px]:flex-wrap min-[900px]:overflow-visible min-[900px]:px-0"
            aria-label="Pilih fitur"
          >
            <li v-for="(step, index) in journey" :key="step.key">
              <button
                type="button"
                class="whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-500"
                :class="index === current ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface text-muted hover:text-ink'"
                :aria-current="index === current ? 'step' : undefined"
                @click="selectScene(index)"
              >
                {{ step.label }}
              </button>
            </li>
          </ol>

          <div class="mt-5 h-0.5 max-w-[440px] overflow-hidden rounded bg-line" aria-hidden="true">
            <span data-journey-bar class="block h-full origin-left scale-x-0 bg-accent" />
          </div>
        </div>

        <div
          ref="fitBox"
          class="flex h-[max(300px,calc(100svh-440px))] justify-center min-[900px]:h-[min(620px,calc(100svh-150px))]"
          aria-hidden="true"
        >
          <div ref="stage" class="ap-stage">
            <!-- Panel ala Elementor -->
            <div class="ap-editor">
              <div class="ap-editor__bar"><span /><span /><span /><b>Edit Widget</b></div>
              <div class="ap-editor__tabs"><span class="is-on">Konten</span><span>Gaya</span><span>Lanjutan</span></div>
              <div v-for="(step, index) in journey" :key="step.key" class="ap-editor__row" :class="{ 'is-active': index === current }">
                <label>{{ step.control }}</label>
                <div class="ap-editor__field"><span data-field-text>{{ step.value }}</span><i /></div>
              </div>
              <div class="ap-editor__publish">Perbarui</div>
            </div>

            <!-- Mockup HP -->
            <div class="ap-phone">
              <div class="ap-phone__notch" />
              <div class="ap-phone__screen">
                <!-- 1. Cover Classic -->
                <div data-screen class="ap-screen ap-screen--cover" :class="{ 'is-current': current === 0 }">
                  <span class="ap-mini__fold" />
                  <span class="ap-mini__ribbon" />
                  <span class="ap-mini__seal"><b>{{ sample.initials }}</b><small>Buka Undangan</small></span>
                  <span class="ap-mini__string" />
                  <span class="ap-mini__tag"><b>Kepada Yth.</b><small>{{ sample.guest }}</small></span>
                </div>

                <!-- 2. Countdown -->
                <div data-screen class="ap-screen ap-screen--countdown" :class="{ 'is-current': current === 1 }">
                  <p class="ap-screen__kicker">Menuju hari bahagia</p>
                  <p class="ap-screen__names">{{ sample.couple }}</p>
                  <ClientOnly>
                    <div class="ap-screen__cd"><b v-for="(unit, i) in countdown" :key="i">{{ unit }}</b></div>
                    <template #fallback><div class="ap-screen__cd"><b v-for="i in 4" :key="i">00</b></div></template>
                  </ClientOnly>
                  <div class="ap-screen__cd-l"><span>Hari</span><span>Jam</span><span>Menit</span><span>Detik</span></div>
                  <p class="ap-screen__small">{{ sample.dateLabel }}<br>{{ sample.venue }}</p>
                </div>

                <!-- 3. Soundscape Player -->
                <div data-screen class="ap-screen ap-screen--music" :class="{ 'is-current': current === 2 }">
                  <div class="ap-screen__disc"><span /></div>
                  <p class="ap-screen__song">Akad · Instrumental</p>
                  <div class="ap-screen__wave"><i v-for="i in 18" :key="i" :style="{ '--i': i }" /></div>
                  <div class="ap-screen__player"><span>1:24</span><b><Play class="size-4" /></b><span>3:40</span></div>
                </div>

                <!-- 4. Signal Form (RSVP via WhatsApp) -->
                <div data-screen class="ap-screen ap-screen--rsvp" :class="{ 'is-current': current === 3 }">
                  <p class="ap-screen__title">Konfirmasi Kehadiran</p>
                  <span class="ap-screen__label">Nama Tamu</span>
                  <div class="ap-screen__input">Andi Pratama</div>
                  <span class="ap-screen__label">Jumlah Tamu</span>
                  <div class="ap-screen__stepper"><span>−</span><b>2</b><span>+</span></div>
                  <span class="ap-screen__label">Ucapan</span>
                  <div class="ap-screen__input ap-screen__input--area">Semoga sakinah, mawaddah, warahmah 🤍</div>
                  <span class="ap-screen__btn ap-screen__btn--wa"><MessageCircle /> Kirim via WhatsApp</span>
                  <span class="ap-screen__toast"><Check /> WhatsApp terbuka</span>
                </div>

                <!-- 5. Comment Dock (ucapan + stiker) -->
                <div data-screen class="ap-screen ap-screen--comment" :class="{ 'is-current': current === 4 }">
                  <div class="ap-dock__head"><b>Ucapan &amp; Doa</b><span>248 ucapan</span></div>
                  <div class="ap-dock__pills">
                    <span class="is-hadir"><i />Hadir 182</span>
                    <span class="is-absen"><i />Berhalangan 41</span>
                  </div>
                  <div class="ap-dock__item" data-dock-item>
                    <span class="ap-dock__avatar">S</span>
                    <div class="ap-dock__body">
                      <p><b>Sinta</b><em class="is-hadir">Hadir</em></p>
                      <p>Selamat menempuh hidup baru, kalian serasi banget!</p>
                      <img src="/img/stickers/61.webp" alt="" loading="lazy" width="38" height="38">
                      <small>2 menit lalu · Balas</small>
                    </div>
                  </div>
                  <div class="ap-dock__item" data-dock-item>
                    <span class="ap-dock__avatar">D</span>
                    <div class="ap-dock__body">
                      <p><b>Dimas</b><em class="is-absen">Berhalangan</em></p>
                      <p>Maaf belum bisa datang, doa terbaik dari jauh.</p>
                      <img src="/img/stickers/97.webp" alt="" loading="lazy" width="38" height="38">
                      <small>5 menit lalu · Balas</small>
                    </div>
                  </div>
                  <div class="ap-dock__reply" data-dock-item>
                    <span class="ap-dock__avatar ap-dock__avatar--couple">R&amp;N</span>
                    <div class="ap-dock__body">
                      <p><b>Raka &amp; Nadia</b><em class="is-couple">Mempelai</em></p>
                      <p>Terima kasih atas doanya, Sinta!</p>
                    </div>
                  </div>
                </div>

                <!-- 6. Daftar Hadiah -->
                <div data-screen class="ap-screen ap-screen--registry" :class="{ 'is-current': current === 5 }">
                  <p class="ap-screen__title">Hadiah Pernikahan</p>
                  <div class="ap-gift" :class="{ 'is-taken': giftTaken }">
                    <span class="ap-gift__img"><Gift /></span>
                    <div>
                      <span class="ap-gift__badge">Tersedia <b>{{ giftTaken ? '0 dari 1' : '1 dari 1' }}</b></span>
                      <p>Rice Cooker</p>
                      <span class="ap-gift__btn" data-gift-btn>{{ giftTaken ? 'Dipilih' : 'Pilih Hadiah' }}</span>
                    </div>
                  </div>
                  <div class="ap-gift">
                    <span class="ap-gift__img ap-gift__img--b"><Layers /></span>
                    <div>
                      <span class="ap-gift__badge">Tersedia <b>2 dari 2</b></span>
                      <p>Set Piring</p>
                      <span class="ap-gift__btn">Pilih Hadiah</span>
                    </div>
                  </div>
                  <div class="ap-gift">
                    <span class="ap-gift__img ap-gift__img--c"><Sparkles /></span>
                    <div>
                      <span class="ap-gift__badge">Tersedia <b>1 dari 1</b></span>
                      <p>Blender</p>
                      <span class="ap-gift__btn">Pilih Hadiah</span>
                    </div>
                  </div>
                  <span class="ap-screen__toast"><Check /> Hadiah dipesan · tercatat di dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
