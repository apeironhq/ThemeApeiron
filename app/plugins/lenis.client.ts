import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Scroll halus dengan Lenis, disinkronkan ke ticker GSAP agar ScrollTrigger
 * membaca posisi scroll yang sama. Dimatikan jika pengguna meminta reduced motion.
 */
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let lenis: Lenis | null = null

  if (!reduceMotion) {
    lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: { offset: -72 } })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis?.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  // Font Ubuntu memengaruhi tinggi teks; hitung ulang posisi trigger setelah font siap.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())

  return {
    provide: { lenis }
  }
})
