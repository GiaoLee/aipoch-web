import { expect, test } from '@playwright/test'

test.describe.configure({ timeout: 60000 })
test.beforeEach(async ({ page }) => {
  await page.goto('/benchmark/open-science')
  const reject = page.getByRole('button', { name: 'Reject non-essential', exact: true })
  if (await reject.isVisible()) await reject.click()
})

test('renders the complete article, metadata, hero artwork, and score rings', async ({
  page
}, testInfo) => {
  await expect(page.getByRole('heading', { name: 'AIPOCH Open-Science Benchmarks' })).toBeVisible()
  await expect(page.locator('figure')).toHaveCount(14)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/benchmark\/open-science$/
  )
  await expect(page.locator('#ch-litqa .bar-row')).toHaveCount(30)
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
  await litqa.getByRole('button', { name: 'Public test', exact: true }).click()
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
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
  }
  await expect(page.locator('header a[href="/benchmark/medskillaudit"]')).toHaveCount(0)
  await expect(page.locator('header [data-testid="desktop-nav-trigger-benchmark"]')).toHaveCount(0)
})

test('server renders the benchmark content without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(`${baseURL}/benchmark/open-science`)
  await expect(page.getByRole('heading', { name: 'AIPOCH Open-Science Benchmarks' })).toBeVisible()
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
  expect(await chart.evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0)
  await expect(chart.locator('.bar-row')).toHaveCount(23)
})
