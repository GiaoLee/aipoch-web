import { expect, test } from '@playwright/test'

test.describe.configure({ timeout: 60000 })
test.beforeEach(async ({ page }) => {
  await page.goto('/benchmark/open-science')
  const reject = page.getByRole('button', { name: 'Reject non-essential', exact: true })
  // Consent mounts after hydration. A synchronous visibility check can miss it,
  // leaving the mobile banner over the chart when the test starts interacting.
  await reject.click()
  await expect(reject).not.toBeVisible()
})

test('renders the complete article, metadata, hero artwork, and score rings', async ({
  page
}, testInfo) => {
  await expect(page.getByRole('heading', { name: 'Open-Science Benchmarks' })).toBeVisible()
  await expect(page.locator('figure')).toHaveCount(17)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/benchmark\/open-science$/
  )
  await expect(page.locator('#ch-litqa .bar-row')).toHaveCount(31)
  await expect(page.locator('#ch-pf .bar-row')).toHaveCount(34)
  await expect(page.locator('#ch-b1 .bar-row')).toHaveCount(24)
  await expect(page.locator('.distractor-row')).toHaveCount(23)
  for (const img of await page.locator('main img').all()) {
    await expect
      .poll(() =>
        img.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
      )
      .toBe(true)
  }
  await expect(page.locator('.benchmark-score-ring svg')).toHaveCount(3)
  await page.screenshot({ path: testInfo.outputPath('benchmark-all.png'), fullPage: true })
  await page.getByRole('link', { name: 'Evaluation details', exact: true }).click()
  await expect(page).toHaveURL(/#method$/)
  await expect(page.getByRole('heading', { name: 'How we ran the evaluation' })).toBeInViewport()
})

test('chart filters remain independent and preserve reference rows', async ({ page }, testInfo) => {
  const b1 = page.locator('#ch-b1'),
    b2 = page.locator('#ch-b2'),
    litqa = page.locator('#ch-litqa')
  await b1.getByRole('button', { name: 'Local runs', exact: true }).click()
  await expect(b1.locator('.bar-row')).toHaveCount(3)
  await expect(b2.locator('.bar-row')).toHaveCount(23)
  await expect(b1.getByRole('button', { name: 'Local runs', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await b1.screenshot({ path: testInfo.outputPath('benchmark-local.png') })
  await b1.getByRole('button', { name: 'Public leaderboard', exact: true }).click()
  await expect(b1.locator('.bar-row')).toHaveCount(23)
  await expect(b1.locator('.bar-row.me')).toHaveCount(2)
  await b1.screenshot({ path: testInfo.outputPath('benchmark-public.png') })
  await b1.getByRole('button', { name: 'All', exact: true }).click()
  await expect(b1.locator('.bar-row')).toHaveCount(24)
  await litqa.getByRole('button', { name: 'Validation', exact: true }).click()
  await expect(litqa.locator('.bar-row')).toHaveCount(4)
  await litqa.getByRole('button', { name: 'Official test', exact: true }).click()
  await expect(litqa.locator('.bar-row')).toHaveCount(27)
  await expect(litqa.locator('.bar-row.me')).toHaveCount(1)
})

test('details work with keyboard, pointer, and tap, and close with Escape', async ({
  page,
  isMobile
}) => {
  const row = page.locator('#ch-pf .bar-row').first()
  await row.scrollIntoViewIfNeeded()
  if (isMobile) await row.tap()
  else await row.focus()
  await expect(page.getByRole('tooltip')).toContainText('deepseek-v4-flash')
  await expect(page.getByRole('tooltip')).toContainText('0.4554')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('tooltip')).toHaveCount(0)
  if (!isMobile) {
    await page.locator('h1').hover()
    await row.hover()
    await expect(page.getByRole('tooltip')).toContainText('Local validation, 66 questions')
  }
})

test('keeps responsive layouts inside the viewport and the submenu hidden', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.notice')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  for (const width of [2880, 1920, 1440, 1024, 981, 980, 768, 640, 390, 360, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
    for (const chart of ['#ch-sqa-zoom', '#ch-sqa-prod']) {
      const ticks = await page.locator(`${chart} .ticks span`).evaluateAll((labels) =>
        labels
          .filter((label) => getComputedStyle(label).display !== 'none')
          .map((label) => {
            const box = label.getBoundingClientRect()
            return { left: box.left, right: box.right }
          })
      )
      expect(ticks.length).toBeGreaterThanOrEqual(2)
      for (let i = 1; i < ticks.length; i++)
        expect(ticks[i].left).toBeGreaterThanOrEqual(ticks[i - 1].right)
    }
    const artwork = await page.locator('.hero-backdrop img').boundingBox()
    if (!artwork) throw new Error('Hero artwork must have a rendered box')
    expect(artwork.x).toBeCloseTo(0, 0)
    expect(artwork.width).toBeCloseTo(width, 0)
    expect(artwork.width / artwork.height).toBeCloseTo(1672 / 941, 2)
    const layout = await page.evaluate(() => {
      const bounds = (root: ParentNode, selector: string) => {
        const element = root.querySelector(selector)
        if (!element) throw new Error(`Missing layout element: ${selector}`)
        return element.getBoundingClientRect()
      }
      const cards = [...document.querySelectorAll('.step')].map((card) => ({
        top: card.getBoundingClientRect().top,
        score: bounds(card, '.s').top
      }))
      const tagsFit = [...document.querySelectorAll('.bar-row .tg')].every((tag) => {
        const box = tag.getBoundingClientRect()
        const labelElement = tag.closest('.lab')
        const row = tag.closest('.bar-row')
        if (!labelElement || !row) return false
        const label = labelElement.getBoundingClientRect()
        const plot = bounds(row, '.track')
        return (
          getComputedStyle(tag).display !== 'none' &&
          box.left >= label.left - 1 &&
          box.right <= label.right + 1 &&
          box.bottom <= label.bottom + 1 &&
          box.right < plot.left
        )
      })
      const b1 = bounds(document, '#ch-b1')
      const b2 = bounds(document, '#ch-b2')
      return {
        tagsFit,
        scoresAlign: cards.every((a) =>
          cards.every((b) => Math.abs(a.top - b.top) > 1 || Math.abs(a.score - b.score) < 1)
        ),
        pairAligns: Math.abs(b1.top - b2.top) < 1 && b2.left > b1.right
      }
    })
    expect(layout.tagsFit, `source badges at ${width}px`).toBe(true)
    expect(layout.scoresAlign, `guidance scores at ${width}px`).toBe(true)
    if (width > 980) expect(layout.pairAligns, `chart pair at ${width}px`).toBe(true)
  }
  await expect(page.locator('header a[href="/benchmark/medskillaudit"]')).toHaveCount(0)
  await expect(page.locator('header [data-testid="desktop-nav-trigger-benchmark"]')).toHaveCount(0)
})

test('the first pointer click works during entrance motion', async ({ page, isMobile }) => {
  const figure = page.locator('figure').filter({ has: page.locator('#ch-b1') })
  await expect(figure).toHaveAttribute('data-benchmark-reveal', 'pending')
  // Freeze a real entrance halfway through so this test cannot pass merely by
  // waiting for motion to end, as locator.click()/tap() normally would.
  await figure.evaluate((element) => {
    const observer = new MutationObserver(() => {
      const entrance = element.getAnimations()[0]
      if (!entrance) return
      entrance.pause()
      entrance.currentTime = 300
      observer.disconnect()
    })
    observer.observe(element, { attributes: true, attributeFilter: ['data-benchmark-reveal'] })
  })
  const filter = page.locator('#ch-b1').getByRole('button', { name: 'Local runs', exact: true })
  await filter.evaluate((button) => button.scrollIntoView({ block: 'center' }))
  await expect(figure).toHaveAttribute('data-benchmark-reveal', 'shown')
  expect(await figure.evaluate((element) => element.getAnimations()[0]?.playState)).toBe('paused')
  const box = await filter.boundingBox()
  if (!box) throw new Error('Source filter must have a rendered box')
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  if (isMobile) await page.touchscreen.tap(x, y)
  else await page.mouse.click(x, y)
  await expect(filter).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('#ch-b1 .bar-row')).toHaveCount(3)
  await expect.poll(() => figure.evaluate((element) => element.getAnimations().length)).toBe(0)
})

test('server renders the benchmark content without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(`${baseURL}/benchmark/open-science`)
  await expect(page.getByRole('heading', { name: 'Open-Science Benchmarks' })).toBeVisible()
  await expect(page.locator('#ch-b1 .bar-row')).toHaveCount(24)
  await expect(page.locator('#ch-pf .bar-row').first()).toContainText('0.4554')
  await expect(page.locator('figure').last()).toHaveCSS('opacity', '1')
  await expect(page.locator('.ring-progress').first()).toHaveAttribute(
    'stroke-dashoffset',
    '0.6692'
  )
  await context.close()
})

test('reveals upcoming charts once and draws their bars on entry', async ({ page }) => {
  const figure = page.locator('figure').filter({ has: page.locator('#ch-litqa') })
  await expect(figure).toHaveAttribute('data-benchmark-reveal', 'pending')
  await figure.scrollIntoViewIfNeeded()
  await expect(figure).toHaveAttribute('data-benchmark-reveal', 'shown')
  expect(
    await figure
      .locator('.bar')
      .first()
      .evaluate((bar) =>
        bar
          .getAnimations()
          .some((animation) =>
            (animation.effect as KeyframeEffect)
              .getKeyframes()
              .some((frame) => frame.transform === 'scaleX(0)')
          )
      )
  ).toBe(true)
  await expect
    .poll(() => figure.evaluate((node) => node.getAnimations({ subtree: true }).length))
    .toBe(0)
  await page.locator('h1').scrollIntoViewIfNeeded()
  await figure.scrollIntoViewIfNeeded()
  // Hover transitions may run under a stationary pointer after scrolling; only entrance animations must stay finished.
  expect(
    await figure.evaluate(
      (node) =>
        node
          .getAnimations({ subtree: true })
          .filter((animation) => !(animation instanceof CSSTransition)).length
    )
  ).toBe(0)
})

test('uses the v7 palette and gray hover fills', async ({ page, isMobile }) => {
  await expect(
    page.locator('#ch-b1 .legend span').filter({ hasText: 'Claude Code' }).locator('i')
  ).toHaveCSS('background-color', 'rgb(208, 138, 98)')
  await expect(
    page.locator('#ch-pf .legend span').filter({ hasText: 'RoboPhD' }).locator('i')
  ).toHaveCSS('background-color', 'rgb(207, 143, 169)')
  if (!isMobile) {
    for (const selector of ['.stat', '#ch-litqa .bar-row', '.level-row', '.distractor-row']) {
      const target = page.locator(selector).first()
      await target.hover()
      await expect(target).toHaveCSS('background-color', 'rgb(242, 241, 236)')
    }
  }
})

test('reduced motion keeps every section and chart immediately readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('[data-benchmark-reveal="pending"]')).toHaveCount(0)
  await page.reload()
  await expect(page.locator('figure').last()).toHaveCSS('opacity', '1')
  const chart = page.locator('#ch-b4')
  await chart.scrollIntoViewIfNeeded()
  await expect(chart.locator('.bar-row').first()).toHaveCSS('transition-duration', '0s')
  expect(await chart.evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0)
  await expect(chart.locator('.bar-row')).toHaveCount(23)
})

test('v8 rankings default to All, sort by score, and expose complete source records', async ({
  page
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const kind of ['litqa', 'pf', 'sqa', 'b1', 'b2', 'b3', 'b4']) {
    const chart = page.locator(`#ch-${kind}`)
    const first = chart.locator('.chips button').first()
    await expect(first).toHaveText(/^All/)
    await expect(first).toHaveAttribute('aria-pressed', 'true')
    const scores = await chart.locator('.bar-row .val').allTextContents()
    expect(scores.map(Number)).toEqual(scores.map(Number).sort((a, b) => b - a))
  }
  const scholar = page.locator('#ch-sqa')
  await expect(scholar.locator('.bar-row')).toHaveCount(42)
  await scholar.getByRole('button', { name: 'Official test', exact: true }).click()
  await expect(scholar.locator('.bar-row')).toHaveCount(41)
  await expect(scholar.locator('.bar-row.me')).toHaveCount(0)
  await scholar.getByRole('button', { name: 'Validation', exact: true }).click()
  await expect(scholar.locator('.bar-row')).toHaveCount(1)
  await expect(scholar.locator('.bar-row')).toContainText('0.9289')
  await expect(page.locator('#ch-sqa-zoom .bar-row')).toHaveCount(13)
  await expect(page.locator('#ch-sqa-prod .bar-row')).toHaveCount(10)
  await page.locator('details').first().locator('summary').click()
  await expect(page.locator('#tbl-litqa tbody tr')).toHaveCount(27)
  await expect(page.locator('#tbl-litqa tbody tr').first()).toContainText('T1')
  await expect(page.locator('#tbl-litqa tbody tr').first()).toContainText('68/75')
  await expect(page.locator('#tbl-litqa a').first()).toHaveAttribute(
    'href',
    /^https:\/\/huggingface.co\/datasets\/allenai\/asta-bench-submissions\//
  )
  await page.locator('details').nth(1).locator('summary').click()
  await expect(page.locator('#tbl-sqa tbody tr')).toHaveCount(42)
  await expect(page.locator('#tbl-sqa tbody tr').first()).toContainText('Validation, 100 q.')
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true)
})

test('eight summary cells retain every internal divider on desktop and mobile', async ({
  page
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.stat')).toHaveCount(8)
  for (const [width, columns] of [
    [1440, 4],
    [980, 2],
    [390, 2]
  ]) {
    await page.setViewportSize({ width, height: 900 })
    const styles = await page.locator('.stat').evaluateAll((cells) =>
      cells.map((cell) => {
        const css = getComputedStyle(cell)
        return { right: css.borderRightWidth, bottom: css.borderBottomWidth }
      })
    )
    styles.forEach((style, i) => {
      expect(style.right).toBe((i + 1) % columns === 0 ? '0px' : '1px')
      expect(style.bottom).toBe(i < 8 - columns ? '1px' : '0px')
    })
  }
})
