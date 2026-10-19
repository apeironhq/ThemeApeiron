/**
 * Indikator aktif yang meluncur (tab, bilah section, menu sidebar).
 * Wadah berisi satu elemen `.dx-ink` dan item aktif bertanda `.is-on` / `.is-active`;
 * setiap kali `source()` berubah, indikator digeser GSAP ke item aktif.
 *
 * Posisi diukur dengan getBoundingClientRect (presisi subpiksel), bukan offsetLeft/Width
 * yang dibulatkan dan bisa membuat indikator meleset setengah piksel.
 */
import { loadDocsGsap, prefersReducedMotion } from './useDocsGsap'

export function useDocsInk(container: Ref<HTMLElement | null>, source: () => unknown, selector = '.is-on') {
  let first = true

  function measure(box: HTMLElement, on: HTMLElement) {
    const b = box.getBoundingClientRect()
    const r = on.getBoundingClientRect()
    return {
      x: r.left - b.left - box.clientLeft + box.scrollLeft,
      y: r.top - b.top - box.clientTop + box.scrollTop,
      width: r.width,
      height: r.height,
    }
  }

  async function update() {
    const box = container.value
    const ink = box?.querySelector<HTMLElement>(':scope > .dx-ink')
    const on = box?.querySelector<HTMLElement>(selector)
    if (!box || !ink) return
    const { gsap } = await loadDocsGsap()
    if (!on) { gsap.to(ink, { opacity: 0, duration: 0.2 }); return }
    // autoRound: false — GSAP membulatkan lebar/tinggi ke piksel bulat secara bawaan.
    const props = { ...measure(box, on), opacity: 1, autoRound: false }
    if (first || prefersReducedMotion()) gsap.set(ink, props)
    else gsap.to(ink, { ...props, duration: 0.45, ease: 'power3.out', overwrite: true })
    first = false
  }

  const resync = () => { first = true; update() }
  watch(source, () => nextTick(update))
  onMounted(() => {
    nextTick(update)
    // Font web bisa mengubah lebar item setelah dimuat.
    document.fonts?.ready.then(resync)
    window.addEventListener('resize', resync)
  })
  onBeforeUnmount(() => window.removeEventListener('resize', resync))
  return { update: resync }
}
