import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { usePreferredReducedMotion } from '@vueuse/core'

gsap.registerPlugin(ScrollTrigger, SplitText)

export type GsapHelpers = {
  gsap: typeof gsap
  ScrollTrigger: typeof ScrollTrigger
  SplitText: typeof SplitText
  /** matchMedia GSAP: animasi per breakpoint otomatis dibersihkan saat breakpoint berubah. */
  mm: gsap.MatchMedia
  finePointer: boolean
}

export type GsapSetup = (helpers: GsapHelpers) => void | (() => void)

/**
 * Menjalankan animasi GSAP di dalam scope komponen dan membersihkannya saat komponen dilepas.
 * Jika pengguna meminta reduced motion, animasi dilewati dan konten tampil apa adanya.
 */
export function useGsap(scope: Ref<HTMLElement | null>, setup: GsapSetup) {
  const reducedMotion = usePreferredReducedMotion()
  let ctx: gsap.Context | undefined
  let mm: gsap.MatchMedia | undefined
  let cleanup: void | (() => void)

  onMounted(() => {
    if (reducedMotion.value === 'reduce' || !scope.value) return

    mm = gsap.matchMedia(scope.value)
    ctx = gsap.context(() => {
      cleanup = setup({
        gsap,
        ScrollTrigger,
        SplitText,
        mm: mm!,
        finePointer: window.matchMedia('(pointer: fine)').matches
      })
    }, scope.value)
  })

  onBeforeUnmount(() => {
    if (typeof cleanup === 'function') cleanup()
    mm?.revert()
    ctx?.revert()
  })
}

/** Hitung mundur yang berputar ke tahun berikutnya jika tanggal contoh sudah lewat. */
export function nextOccurrence(iso: string, now = Date.now()) {
  const date = new Date(iso)
  while (date.getTime() < now) date.setFullYear(date.getFullYear() + 1)
  return date.getTime()
}
