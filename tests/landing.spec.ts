import { test, expect, type Page } from '@playwright/test'

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 900

async function scrollToY(page: Page, y: number, settle = 900) {
  await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.waitForTimeout(settle)
}

async function scrollToSection(page: Page, selector: string, offset = 0, settle = 1200) {
  const top = await page.evaluate(
    ([sel, off]) => {
      const el = document.querySelector(sel as string)!
      return el.getBoundingClientRect().top + window.scrollY + (off as number)
    },
    [selector, offset]
  )
  await scrollToY(page, top, settle)
}

/** Posisi scroll di dalam section yang di-pin (progress 0..1). */
async function scrollIntoPin(page: Page, selector: string, progress: number, sceneCount: number) {
  const top = await page.evaluate((sel) => {
    const el = document.querySelector(sel)!
    return el.getBoundingClientRect().top + window.scrollY
  }, selector)
  const vh = page.viewportSize()!.height
  await scrollToY(page, top + vh * 0.75 * sceneCount * progress, 1600)
}

test.beforeEach(async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') errors.push(`${msg.type()}: ${msg.text()}`)
  })
  testInfo.annotations.push({ type: 'errors', description: '' })
  ;(page as Page & { __errors: string[] }).__errors = errors
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(2600)
})

test.afterEach(async ({ page }) => {
  const errors = (page as Page & { __errors: string[] }).__errors
  expect(errors, errors.join('\n')).toEqual([])
})

test('seluruh halaman: tanpa overflow horizontal dan screenshot tiap layar', async ({ page }, testInfo) => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const vh = page.viewportSize()!.height
  let shot = 0
  for (let y = 0; y < height; y += vh * 0.9) {
    await scrollToY(page, y, 1100)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, `overflow horizontal di y=${Math.round(y)}`).toBeLessThanOrEqual(0)
    await page.screenshot({ path: `tests/screenshots/${testInfo.project.name}/${String(shot++).padStart(2, '0')}.png` })
  }
})

test('hero: judul terpecah, sampul bisa dibuka dan ditutup', async ({ page }) => {
  const title = page.locator('h1')
  await expect(title).toHaveAttribute('aria-label', /Undangan digital yang dikenang/)

  const doorLeft = page.locator('[data-gate-door="l"]')
  await page.locator('[data-gate-seal]').click()
  await page.waitForTimeout(3200)
  const x = await doorLeft.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)
  expect(x).toBeLessThan(-50)
  await expect(page.locator('[data-gate-names]')).toHaveCSS('opacity', '1')
  await expect(page.locator('.ap-countdown strong').first()).not.toHaveText('')

  await page.getByRole('button', { name: 'Tutup sampul' }).click()
  await page.waitForTimeout(2600)
  const xBack = await doorLeft.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)
  expect(Math.abs(xBack)).toBeLessThan(1)
})

test('header: tersembunyi saat scroll turun, muncul saat scroll naik', async ({ page }) => {
  const header = page.locator('header')
  await scrollToY(page, 1600)
  await scrollToY(page, 2400)
  await expect.poll(() => header.evaluate((el) => el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(1)
  await scrollToY(page, 2100)
  await expect.poll(() => header.evaluate((el) => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(-1)
})

test('story: kata menyala mengikuti scroll', async ({ page }) => {
  const lastWord = page.locator('.story-word').last()
  await expect(lastWord).toBeAttached()
  const before = Number(await lastWord.evaluate((el) => getComputedStyle(el).opacity))
  const top = await page.evaluate(() => {
    const el = document.querySelectorAll('section')[1]!
    return el.getBoundingClientRect().top + window.scrollY
  })
  await scrollToY(page, top + page.viewportSize()!.height * 1.75, 2200)
  const after = Number(await lastWord.evaluate((el) => getComputedStyle(el).opacity))
  expect(before).toBeLessThan(0.5)
  expect(after).toBeGreaterThan(0.9)
})

test('fitur: adegan berganti mengikuti scroll dan klik penanda', async ({ page }) => {
  const current = page.locator('#fitur [aria-current="step"]')
  await scrollIntoPin(page, '#fitur', 0.05, 6)
  await expect(current).toHaveText('Sampul')
  await scrollIntoPin(page, '#fitur', 0.45, 6)
  await expect(current).toHaveText('Musik')
  await scrollIntoPin(page, '#fitur', 0.95, 6)
  await expect(current).toHaveText('Daftar Hadiah')
  await expect(page.locator('.ap-gift').first()).toHaveClass(/is-taken/, { timeout: 4000 })

  await page.locator('#fitur').getByRole('button', { name: 'RSVP' }).click()
  await page.waitForTimeout(2000)
  await expect(current).toHaveText('RSVP')

  const phone = await page.locator('.ap-phone').boundingBox()
  expect(phone!.y + phone!.height).toBeLessThanOrEqual(page.viewportSize()!.height + 2)
})

test('widget: carousel tombol, klik kartu, autoplay, dan drag', async ({ page }) => {
  await scrollToSection(page, '#widget', 0, 1500)
  const counter = page.locator('#widget [aria-live="polite"]').first()
  const spotlight = page.locator('#widget h3').first()
  await expect(counter).toContainText('01')
  await expect(spotlight).toHaveText('Cover')

  await page.getByRole('button', { name: 'Widget berikutnya' }).click()
  await expect(counter).toContainText('02', { timeout: 3000 })
  await expect(spotlight).toHaveText('Page Loader')

  await page.getByRole('button', { name: 'Widget sebelumnya' }).click()
  await expect(counter).toContainText('01', { timeout: 3000 })

  await page.getByRole('button', { name: 'Lihat Countdown' }).click()
  await expect(counter).toContainText('04', { timeout: 3000 })
  await expect(spotlight).toHaveText('Countdown')

  // Autoplay: tanpa interaksi, widget maju sendiri (4,5 detik per widget).
  await page.mouse.move(5, 5)
  await expect(counter).toContainText('05', { timeout: 8000 })

  // Drag ke kiri memindahkan carousel ke widget berikutnya.
  const track = page.locator('#widget [role="list"]')
  const box = (await track.boundingBox())!
  const y = box.y + box.height / 2
  const startX = box.x + box.width * 0.7
  const before = (await counter.textContent())!.trim()
  if (isMobile(page)) {
    await page.touchscreen.tap(startX, y)
    await track.evaluate((el, [sx, sy]) => {
      const fire = (type: string, x: number) =>
        el.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: sy, pointerType: 'touch', isPrimary: true }))
      fire('pointerdown', sx)
      for (let i = 1; i <= 10; i++) fire('pointermove', sx - i * 28)
      fire('pointerup', sx - 280)
    }, [startX, y])
  } else {
    await page.mouse.move(startX, y)
    await page.mouse.down()
    await page.mouse.move(startX - 160, y, { steps: 8 })
    await page.mouse.move(startX - 320, y, { steps: 8 })
    await page.mouse.up()
  }
  await page.waitForTimeout(1800)
  await expect(counter).not.toHaveText(before)
})

test('keunggulan, FAQ, dan CTA tampil serta berfungsi', async ({ page }) => {
  await scrollToSection(page, '#keunggulan', -200, 1600)
  const cards = page.locator('#keunggulan article')
  await expect(cards).toHaveCount(6)
  await scrollToSection(page, '#keunggulan', 600, 1600)
  await expect(cards.first()).toHaveCSS('opacity', '1')

  await scrollToSection(page, '#faq', -100, 1400)
  const second = page.locator('#faq button[aria-expanded]').nth(1)
  await second.click()
  await expect(second).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#faq-panel-1')).toBeVisible()

  await scrollToSection(page, '#kontak', -100, 2200)
  await expect(page.locator('#kontak h2')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Dapatkan lisensi' }).last()).toHaveAttribute('href', 'https://portal-apeiron.web.id/')
  await expect(page.locator('#kontak form')).toHaveCount(0)
})

test('harga dan testimoni tidak tampil tanpa data asli', async ({ page }) => {
  await expect(page.locator('#harga')).toHaveCount(0)
  await expect(page.locator('#testimoni')).toHaveCount(0)
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('konten tetap tampil tanpa animasi', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('h1 [aria-hidden]')).toHaveCount(0)
    await scrollToSection(page, '#widget', 0, 600)
    await expect(page.locator('#widget h3').first()).toHaveText('Cover')
    await page.getByRole('button', { name: 'Widget berikutnya' }).click()
    await expect(page.locator('#widget h3').first()).toHaveText('Page Loader')
    await expect(page.locator('html')).not.toHaveClass(/lenis/)
  })
})
