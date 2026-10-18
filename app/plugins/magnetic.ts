import { gsap } from 'gsap'

type MagneticEl = HTMLElement & { _magneticCleanup?: () => void }

/**
 * v-magnetic: tombol sedikit "tertarik" ke arah kursor.
 * Hanya aktif untuk mouse/trackpad dan tanpa reduced motion.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<MagneticEl, number | undefined>('magnetic', {
    getSSRProps: () => ({}),

    mounted(el, binding) {
      const finePointer = window.matchMedia('(pointer: fine)').matches
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!finePointer || reduceMotion) return

      const strength = binding.value ?? 0.3
      const toX = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
      const toY = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        toX((event.clientX - rect.left - rect.width / 2) * strength)
        toY((event.clientY - rect.top - rect.height / 2) * strength)
      }

      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: true })
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      el._magneticCleanup = () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
        gsap.killTweensOf(el)
      }
    },

    unmounted(el) {
      el._magneticCleanup?.()
    }
  })
})
