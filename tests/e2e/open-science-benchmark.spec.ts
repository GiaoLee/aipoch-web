import { expect, test } from '@playwright/test'

test.describe.configure({ timeout: 60000 })
test.beforeEach(async ({ page }) => {
  await page.goto('/benchmark/open-science')
  const reject = page.getByRole('button', { name: 'Reject non-essential', exact: true })
  if (await reject.isVisible()) await reject.click()
})

test('renders the complete article, metadata, and local Figma assets', async ({
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
  await context.close()
})
