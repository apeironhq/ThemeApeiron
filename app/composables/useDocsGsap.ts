/**
 * GSAP untuk /docs: dimuat di browser saja, sekali, lalu dipakai ulang antar-halaman.
 * Setiap halaman membungkus animasinya dalam gsap.context() dan merevert saat unmount,
 * jadi ScrollTrigger tidak menumpuk ketika berpindah widget.
 */
type GsapBundle = {
  gsap: typeof import('gsap').gsap
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
  Flip: typeof import('gsap/Flip').Flip
}

let loading: Promise<GsapBundle> | null = null

export function loadDocsGsap(): Promise<GsapBundle> {
  if (!loading) {
    loading = Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/Flip')]).then(
      ([{ gsap }, { ScrollTrigger }, { Flip }]) => {
        gsap.registerPlugin(ScrollTrigger, Flip)
        gsap.defaults({ ease: 'power3.out', duration: 0.7 })
        return { gsap, ScrollTrigger, Flip }
      },
    )
  }
  return loading
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
