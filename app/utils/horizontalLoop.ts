import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

gsap.registerPlugin(Draggable, InertiaPlugin)

export interface HorizontalLoopConfig {
  speed?: number
  paused?: boolean
  repeat?: number
  center?: boolean | Element
  draggable?: boolean
  paddingRight?: number
  onChange?: (item: HTMLElement, index: number) => void
  onDragStart?: () => void
  onDragEnd?: () => void
}

export interface HorizontalLoop extends gsap.core.Timeline {
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween | gsap.core.Timeline
  next: (vars?: gsap.TweenVars) => gsap.core.Tween | gsap.core.Timeline
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween | gsap.core.Timeline
  current: () => number
  closestIndex: (setCurrent?: boolean) => number
  draggable?: Draggable
  destroy: () => void
}

/**
 * Carousel tak berujung berbasis timeline GSAP.
 * Diadaptasi dari helper resmi GSAP "Seamless horizontal loop"
 * (https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop), ditambah tipe dan pembersihan.
 */
export function horizontalLoop(targets: HTMLElement[], config: HorizontalLoopConfig = {}): HorizontalLoop {
  const items = targets
  const onChange = config.onChange
  let lastIndex = 0

  const tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: 'none' },
    onUpdate: onChange
      ? () => {
          const i = loop.closestIndex()
          if (lastIndex !== i) {
            lastIndex = i
            onChange(items[i]!, i)
          }
        }
      : undefined,
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100)
    }
  }) as HorizontalLoop
  const loop = tl

  const length = items.length
  const startX = items[0]!.offsetLeft
  const times: number[] = []
  const widths: number[] = []
  const spaceBefore: number[] = []
  const xPercents: number[] = []
  let curIndex = 0
  let indexIsDirty = false
  const center = config.center
  const pixelsPerSecond = (config.speed || 1) * 100
  const snap = gsap.utils.snap(1)
  let timeOffset = 0
  const container = (center && center !== true ? center : items[0]!.parentNode) as HTMLElement
  let totalWidth = 0
  let timeWrap: (value: number) => number = (v) => v
  let proxy: HTMLElement | undefined

  const getTotalWidth = () =>
    items[length - 1]!.offsetLeft +
    (xPercents[length - 1]! / 100) * widths[length - 1]! -
    startX +
    spaceBefore[0]! +
    items[length - 1]!.offsetWidth * (gsap.getProperty(items[length - 1]!, 'scaleX') as number) +
    (config.paddingRight || 0)

  const populateWidths = () => {
    let b1 = container.getBoundingClientRect()
    let b2: DOMRect
    items.forEach((el, i) => {
      widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px') as string)
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, 'x', 'px') as string) / widths[i]!) * 100 + (gsap.getProperty(el, 'xPercent') as number)
      )
      b2 = el.getBoundingClientRect()
      spaceBefore[i] = b2.left - (i ? b1.right : b1.left)
      b1 = b2
    })
    gsap.set(items, { xPercent: (i: number) => xPercents[i]! })
    totalWidth = getTotalWidth()
  }

  const populateOffsets = () => {
    timeOffset = center ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth : 0
    if (center) {
      times.forEach((_, i) => {
        times[i] = timeWrap(tl.labels[`label${i}`]! + (tl.duration() * widths[i]!) / 2 / totalWidth - timeOffset)
      })
    }
  }

  const getClosest = (values: number[], value: number, wrap: number) => {
    let i = values.length
    let closest = 1e10
    let index = 0
    while (i--) {
      let d = Math.abs(values[i]! - value)
      if (d > wrap / 2) d = wrap - d
      if (d < closest) {
        closest = d
        index = i
      }
    }
    return index
  }

  const populateTimeline = () => {
    tl.clear()
    for (let i = 0; i < length; i++) {
      const item = items[i]!
      const curX = (xPercents[i]! / 100) * widths[i]!
      const distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0]!
      const distanceToLoop = distanceToStart + widths[i]! * (gsap.getProperty(item, 'scaleX') as number)
      tl.to(item, { xPercent: snap(((curX - distanceToLoop) / widths[i]!) * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
        .fromTo(
          item,
          { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]!) * 100) },
          {
            xPercent: xPercents[i]!,
            duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false
          },
          distanceToLoop / pixelsPerSecond
        )
        .add(`label${i}`, distanceToStart / pixelsPerSecond)
      times[i] = distanceToStart / pixelsPerSecond
    }
    timeWrap = gsap.utils.wrap(0, tl.duration())
  }

  const refresh = (deep?: boolean) => {
    const progress = tl.progress()
    tl.progress(0, true)
    populateWidths()
    if (deep) populateTimeline()
    populateOffsets()
    if (deep && tl.draggable) tl.time(times[curIndex]!, true)
    else tl.progress(progress, true)
  }

  const onResize = () => refresh(true)

  gsap.set(items, { x: 0 })
  populateWidths()
  populateTimeline()
  populateOffsets()
  window.addEventListener('resize', onResize)

  function toIndex(index: number, vars: gsap.TweenVars = {}) {
    if (Math.abs(index - curIndex) > length / 2) index += index > curIndex ? -length : length
    const newIndex = gsap.utils.wrap(0, length, index)
    let time = times[newIndex]!
    if (time > tl.time() !== index > curIndex && index !== curIndex) {
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }
    if (time < 0 || time > tl.duration()) {
      vars.modifiers = { time: timeWrap }
    }
    curIndex = newIndex
    vars.overwrite = true
    if (proxy) gsap.killTweensOf(proxy)
    return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars)
  }

  tl.toIndex = (index, vars) => toIndex(index, vars)
  tl.closestIndex = (setCurrent) => {
    const index = getClosest(times, tl.time(), tl.duration())
    if (setCurrent) {
      curIndex = index
      indexIsDirty = false
    }
    return index
  }
  tl.current = () => (indexIsDirty ? tl.closestIndex(true) : curIndex)
  tl.next = (vars) => toIndex(tl.current() + 1, vars)
  tl.previous = (vars) => toIndex(tl.current() - 1, vars)
  tl.progress(1, true).progress(0, true)

  if (config.draggable) {
    proxy = document.createElement('div')
    const wrap = gsap.utils.wrap(0, 1)
    let ratio = 0
    let startProgress = 0
    let lastSnap = 0
    let initChangeX = 0
    let draggable: Draggable
    const align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio))
    const syncIndex = () => tl.closestIndex(true)

    draggable = Draggable.create(proxy, {
      trigger: items[0]!.parentNode as Element,
      type: 'x',
      inertia: true,
      // Kartu berupa tombol: tetap bisa di-drag, dan klik biasa tetap berfungsi.
      dragClickables: true,
      minimumMovement: 6,
      overshootTolerance: 0,
      onPressInit(this: Draggable) {
        const x = this.x
        gsap.killTweensOf(tl)
        tl.pause()
        startProgress = tl.progress()
        refresh()
        ratio = 1 / totalWidth
        initChangeX = startProgress / -ratio - x
        gsap.set(proxy!, { x: startProgress / -ratio })
      },
      onDragStart: () => config.onDragStart?.(),
      onDrag: align,
      onThrowUpdate: align,
      snap(this: Draggable, value: number) {
        if (Math.abs(startProgress / -ratio - this.x) < 10) return lastSnap + initChangeX
        const time = -(value * ratio) * tl.duration()
        const wrappedTime = timeWrap(time)
        const snapTime = times[getClosest(times, wrappedTime, tl.duration())]!
        let dif = snapTime - wrappedTime
        if (Math.abs(dif) > tl.duration() / 2) dif += dif < 0 ? tl.duration() : -tl.duration()
        lastSnap = (time + dif) / tl.duration() / -ratio
        return lastSnap
      },
      onRelease() {
        syncIndex()
        if (draggable.isThrowing) indexIsDirty = true
        // Dilepas tanpa lemparan: onThrowComplete tidak terpanggil, jadi akhiri drag di sini.
        gsap.delayedCall(0.05, () => {
          if (!draggable.isThrowing) config.onDragEnd?.()
        })
      },
      onThrowComplete: () => {
        syncIndex()
        config.onDragEnd?.()
      }
    })[0]!
    tl.draggable = draggable
  }

  tl.closestIndex(true)
  lastIndex = curIndex
  onChange?.(items[curIndex]!, curIndex)

  tl.destroy = () => {
    window.removeEventListener('resize', onResize)
    tl.draggable?.kill()
    tl.kill()
  }

  return tl
}
