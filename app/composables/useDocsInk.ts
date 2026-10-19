/**
 * Indikator aktif yang meluncur (tab, bilah section, menu sidebar).
 * Wadah berisi satu elemen `.dx-ink` dan item aktif bertanda `.is-on` / `.is-active`;
 * setiap kali `source()` berubah, indikator digeser GSAP ke item aktif.
 */
import { loadDocsGsap, prefersReducedMotion } from './useDocsGsap'

export function useDocsInk(container: Ref<HTMLElement | null>, source: () => unknown, selector = '.is-on') {
  let first = true

  async function update() {
    const box = container.value
    const ink = box?.querySelector<HTMLElement>(':scope > .dx-ink')
    const on = box?.querySelector<HTMLElement>(selector)
    if (!box || !ink) return
    const { gsap } = await loadDocsGsap()
    if (!on) { gsap.to(ink, { opacity: 0, duration: 0.2 }); return }
    const props = { x: on.offsetLeft, y: on.offsetTop, width: on.offsetWidth, height: on.offsetHeight, opacity: 1 }
    if (first || prefersReducedMotion()) gsap.set(ink, props)
    else gsap.to(ink, { ...props, duration: 0.45, ease: 'power3.out', overwrite: true })
    first = false
  }

  const onResize = () => { first = true; update() }
  watch(source, () => nextTick(update))
  onMounted(() => {
    nextTick(update)
    // Font web bisa mengubah lebar item setelah dimuat.
    document.fonts?.ready.then(() => { first = true; update() })
    window.addEventListener('resize', onResize)
  })
  onBeforeUnmount(() => window.removeEventListener('resize', onResize))
  return { update }
}
