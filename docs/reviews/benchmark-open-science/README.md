# Open-Science Benchmark implementation — 20 October 2026

Based on `origin/main` at `169eafe`, on branch `codex/benchmark-open-science`.

## Behavior

- The top-level Benchmark link opens `/benchmark/open-science` on desktop and mobile. The defined Benchmark submenu includes Open-Science and MedSkillAudit but stays hidden.
- MedSkillAudit moved to `/benchmark/medskillaudit`. Its content and assets are unchanged. Homepage links, canonical metadata, structured data, and sitemap use the new URL.
- `/medskillaudit` permanently redirects to the new route. The pre-existing `/benchmark` redirect still reaches MedSkillAudit through that compatibility route; `next.config.ts` is unchanged.
- The new page implements Figma's All board and independent chart source states. It includes 14 figures, all supplied records, source filters that retain AIPOCH references, keyboard/pointer/touch details, responsive plots and tables, and server-rendered content.
- Benchmark records and article copy come from the supplied HTML snapshot, compiled 19 October 2026. Layout, typography, hero copy, and background follow the final Figma design. The v7 follow-up below updates chart colors and motion from the newer supplied HTML. No benchmark API was invented or added.

## Design and assets

Figma file: `6zS3GvT25svG6reU1oFKVi`. Boards: All `2823:173`, Local runs `2830:3776`, Public leaderboard `2830:7181`.

The existing `/figma/audit/75fa7.png` exactly matches the supplied Figma hero asset (SHA-1 `7a7bb577e046390c8022bb1779cb72a031dd5754`). Following the responsive review, it fills the viewport width and preserves its original 1672 × 941 proportions, matching MedSkillAudit's edge-aligned artwork. The v7 follow-up renders score-driven inline SVG rings with the same 84 × 84 geometry so their strokes can animate; the original downloaded SVG files remain unchanged. Navigation and footer reuse the existing shared components.

## Sitemap

`OPEN_SCIENCE_BENCHMARK_LAST_MODIFIED`, `MEDSKILLAUDIT_PAGE_LAST_MODIFIED`, and `COMMON_LAYOUT_LAST_MODIFIED` are explicitly `2026-10-20`. Shared navigation changes affect every local URL already emitted by `app/sitemap.ts`, including skill/blog detail pages, guide pages, and use-case overview/replay pages. Newer authoritative dates still win. Product release and article publication dates are unchanged, and Wiki dates remain independent.

`sitemap-impact.csv` enumerates concrete canonical URLs from the public sitemap retrieved on 20 October 2026, plus the new page, with their expected dates after the shared navigation change. This is an impact inventory, not a production deployment or a replacement for dynamic content sources. `/medskillaudit` and `/benchmark` are excluded redirect URLs. Existing private, noindex, community, leaderboard, and standalone presentation exclusions remain intact.

Unit sitemap tests verify new and moved URLs, shared-layout dates, preservation of newer API timestamps and unchanged Wiki dates, and excluded routes. A focused real mock-server integration test additionally verifies rendered SSR pages and XML sitemap entries.

## Validation

- `bun run test:unit`: 465 passed, 0 failed.
- `bun run typecheck`: passed.
- Focused Biome lint on the new page, changed navigation, metadata, sitemap, and relevant tests: passed.
- `bun run test:e2e tests/e2e/open-science-benchmark.spec.ts tests/e2e/medskillaudit.spec.ts tests/e2e/scroll-restoration.spec.ts --workers=2 --reporter=line`: 25 passed, 3 intentionally skipped, 2 initially timed out. The newly added legacy URL test passed after waiting for DOM content rather than the external demonstration video. Aggregate verified cases: 26 passed, 3 skipped, 1 unresolved pre-existing test.
- The remaining existing mobile full-document scroll-restoration test timed out twice in its homepage `beforeEach`, waiting for the page `load` event, before its scroll assertions. It was not weakened or changed beyond updating the moved route expectations elsewhere in the file.
- All 10 new benchmark browser cases passed across desktop and mobile: complete content/assets, independent filters, reference preservation, keyboard/touch details, Escape dismissal, no horizontal page overflow at 1440/1024/768/390/320, hidden submenu, and JavaScript-disabled SSR.
- `bun run test:mock --test-name-pattern 'renders server data, linked details and sitemap'`: 1 passed, 44 filtered out, 0 failed. The new and moved pages returned 200, sitemap dates matched, and the legacy URL remained excluded. No API contracts changed; existing mock handlers are sufficient.
- `bun run lint`: fails on 15 existing errors and 65 warnings in unrelated files, including annotation hook dependencies, UI primitives, static overview HTML, and leaderboard service code. No validation settings were changed.
- `git diff --check`: passed.

## Local acceptance and operational scope

The existing `bun run dev:mock` launcher serves Web at `http://127.0.0.1:3202` and its state adapter at `http://127.0.0.1:3203`. A final check against this persistent mock session verified desktop filters, mobile navigation, zero page overflow, zero browser page errors, and the legacy HTTP 308 redirect. No environment files, package/runtime settings, Next configuration, Docker, workflows, proxy settings, or host configuration were changed. The page-level redirect is part of the explicitly requested route migration. Nothing was pushed or deployed.

## Chart detail follow-up — 20 October 2026

Compared every chart family with the supplied HTML and the previously retrieved high-fidelity Figma All board contexts. Restored chart encodings from the HTML while retaining the final Figma layout and palette:

| Figures | Verification and changes |
| --- | --- |
| 1, 14: summary tables | Existing rules and text colors retained; no plot marks required. |
| 2–3, 9–12: ranked bars | Restored segmented vertical grids. Percentage charts use 25-point intervals; PaperFinding uses 0.1 intervals on its 0–0.5 axis. Filters retain the grid. |
| 4: query-type rings | Existing three Figma SVG assets retained and verified loaded. |
| 5: AstaBench swarm | Restored grids for both independent scales, round legends, outlined validation legend, and the subtle green validation marker fill. |
| 6: guidance ladder | Existing supplied/withheld/added indicators and strikethroughs retained. |
| 7: guidance comparison | Restored quarter-scale grids and round legends; connectors use the Figma border color. |
| 8: ASI-Bench swarm | Restored quarter-scale grids and a real dashed blue legend swatch matching all four Codex reference lines. |
| 13: distractor comparison | Restored 10-point grids, outlined/filled legends, green AIPOCH connectors, and canvas-colored hollow markers. |

Figma color corrections include RoboPhD `#b91c1c`, other records `#6b6b66` at 65% alpha, green foreground `#607a32`, negative changes `#915600`, positive changes `#607a32`, and grid/connector lines `#e7e5de`. Existing green, blue, orange, yellow, brown, and dark-green series fills match the All board.

Validation for this follow-up: `bun run typecheck`, focused Biome lint, and 12 benchmark/sitemap unit tests passed. Direct Playwright checks against the running mock environment passed on desktop and Pixel 5: all 14 figures, all 10 numeric chart panels, grid scales, all source filters, four dashed references, legend styles, key colors, tooltips, image loading, and absence of page errors/horizontal overflow. Screenshots were inspected for each chart family. No new API or operational configuration changes were needed.

Only `/benchmark/open-science` is affected by this follow-up. Its persistent `OPEN_SCIENCE_BENCHMARK_LAST_MODIFIED` remains the actual same-day date `2026-10-20`; sitemap tests confirm this value and preservation of unrelated dates and exclusions.

## Card backgrounds and ring frame — 20 October 2026

Added a `#f7f7f5` rectangular background and the existing light-gray border to all three query-type cards and all four guidance cards, including mobile layouts. Preserved typography, series colors, SVG assets, and zero corner radius. Renamed the ring wrapper to `benchmark-score-ring`: the previous `ring` class collided with Tailwind's ring utility and introduced a black box shadow around the SVG.

Desktop (1440px) and mobile (390px) browser checks confirmed all seven card backgrounds/borders, zero corner radius, no ring box shadow, unchanged 84px assets, and no horizontal overflow. Desktop screenshots were visually inspected. TypeScript, focused Biome lint, 12 benchmark/sitemap unit tests, and diff whitespace checks passed. The affected URL and persistent modification date remain `/benchmark/open-science` and `2026-10-20`. No protected configuration changed.

## Responsive navigation and hero follow-up — 20 October 2026

Based on `origin/main` at `9b8f151` after PR #41 merged:

- Remove the mobile Docs link's horizontal inset so its text aligns with the primary navigation links. Download retains its button padding.
- Make the benchmark explanation panel transparent so its rectangular background no longer obscures the hero artwork.
- Replace the fixed 1920px image width with viewport-width sizing and the original aspect ratio, matching the existing MedSkillAudit shell. Both image edges remain aligned with the page while the content retains its centered maximum width.

Validation: TypeScript, focused Biome lint, 30 navbar/benchmark/sitemap unit tests, and diff whitespace checks passed. Browser checks at 320, 390, 768, 1440, 1920, 2560, and 2880px verified image edge alignment and proportions, transparent panel fill, no horizontal overflow, and mobile Docs/Blog text alignment. Shared mobile navigation was also verified on `/` and `/benchmark/medskillaudit` after full page load. Screenshots are omitted from this PR.

The hero affects `/benchmark/open-science`; shared mobile navigation affects the same common-layout URLs enumerated in `sitemap-impact.csv`. Their persistent page and shared-layout dates already equal the actual modification date, `2026-10-20`, so no timestamp change is needed. Sitemap tests continue to preserve newer authoritative dates, independent Wiki dates, and excluded routes. No API contracts or protected operational configuration changed.

## v7 palette and motion — 20 October 2026

Applied the supplied `aipoch-benchmark-v7.html` chart palette: AIPOCH `#AFD670`, Codex `#759EB8`, Claude Code `#D08A62`, ReAct `#D3B46A`, Smolagents `#A99CC8`, Asta `#B9A58A`, RoboPhD `#CF8FA9`, and other agents `#C9C6BD`. Updated validation markers, score indicators, level labels, tooltips, and positive/negative deltas to the same reference. Preserved the approved layout, fonts, rectangular cards, chart grids, and dashed reference lines.

All hover background fills use AIPOCH gray `#F2F1EC`, including the six summary cells, chart rows, source filters, and hero buttons. Swarm points enlarge on hover/focus. Upcoming article blocks reveal once while scrolling; bars grow, rings draw, and comparison marks fade in with the reference durations and stagger. Keyboard focus settles the containing block before interaction. Reduced-motion preferences disable motion, including when changed during the session, and server-rendered content remains visible without JavaScript.

Validation:

- `bun run typecheck` and focused Biome lint: passed.
- Benchmark and sitemap unit tests: 12 passed.
- `bun run test:e2e tests/e2e/open-science-benchmark.spec.ts --workers=2 --trace=on --reporter=line`: 16 passed across desktop and mobile. An earlier run had one mobile filter failure; three targeted repetitions and the final full run passed after settling entrance motion on focus.
- Direct browser checks also verified ring animation, all changed series colors, gray hover fills, swarm enlargement, one-time reveals, reduced-motion cancellation, and no page errors.
- `git diff --check`: passed.

Only `https://aipoch.com/benchmark/open-science` changes in this follow-up. Its persistent `OPEN_SCIENCE_BENCHMARK_LAST_MODIFIED` remains `2026-10-20`, already the actual same-day modification date. Sitemap tests verify that date, preserve unrelated timestamps, and retain redirect exclusions. No API contracts, dependencies, protected operational configuration, or other pages changed. This follow-up was validated locally before inclusion in PR #42 at the user's request.

## Numeric alignment and chart labels — 21 October 2026

Georgia's installed font has no lining-numeral substitution and renders old-style digits with differing heights. Summary and guidance scores now use Times New Roman's lining numerals, preserving serif styling and existing sizes. Ranked bar labels put the system name on its own line and allow model text to wrap; source badges remain visible and unbroken at desktop and mobile widths. Label growth stays inside the original grid column, preserving aligned plot origins and the desktop two-chart layout.

Validation: TypeScript, focused Biome lint, 12 benchmark/sitemap unit tests, and diff whitespace checks passed. Direct browser checks at 1920, 1440, 1024, 390, and 320px verified every source badge fits its label and stays before the plot, no horizontal page overflow, and side-by-side B1/B2 charts at desktop widths. Browser font measurements confirmed lining numeral heights, and chart rendering was visually inspected. No page errors occurred.

Only `/benchmark/open-science` is affected. `OPEN_SCIENCE_BENCHMARK_LAST_MODIFIED` is now `2026-10-21`; metadata and sitemap tests verify the new date while unrelated dates remain unchanged. No protected operational configuration or API contracts changed. This follow-up is included in PR #42 at the user's request; no screenshots are included.


## PR #42 final validation — 21 October 2026

Consolidated the responsive, v7, and typography/label follow-ups into the existing PR. Removed screenshot changes from the final diff and screenshot embeds from the PR description. Final regression testing exposed an intermittent mobile filter click during entrance motion; pointer interaction now waits until the 600ms entrance completes, while keyboard focus can settle the animation immediately. The one-time reveal test excludes hover CSS transitions from its entrance-animation assertion. No validation configuration was changed.

Final checks: TypeScript and focused Biome lint passed; 30 navbar/benchmark/sitemap unit tests and all 16 desktop/mobile benchmark browser cases passed.
