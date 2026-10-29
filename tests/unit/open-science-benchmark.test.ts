import { describe, expect, test } from 'bun:test'
import {
  b1,
  b2,
  b3,
  b4,
  litqa,
  pf,
  sqa,
  filterRecords,
  matchDistractorRecords
} from '../../app/(commonLayout)/benchmark/open-science/benchmark-results'
import {
  benchmarkMetadata,
  benchmarkStructuredData
} from '../../app/(commonLayout)/benchmark/open-science/benchmark-metadata'

describe('Open-Science benchmark snapshot', () => {
  test('retains every supplied record, distinct submissions, and original score scales', () => {
    expect([litqa, pf, b1, b2, b3, b4].map((rows) => rows.length)).toEqual([31, 34, 24, 23, 23, 23])
    expect([litqa, pf, b1, b2, b3, b4].map((rows) => filterRecords(rows, 'all')[0].score)).toEqual([
      100, 0.4554, 79.35, 56.11, 59.67, 59.46
    ])
    expect(b1.filter((row) => row.model.startsWith('GPT-5.6 Sol'))).toHaveLength(2)
    for (const rows of [litqa, pf, b1, b2, b3, b4]) {
      expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length)
      expect(rows.every((row) => row.score >= 0 && row.score <= (rows === pf ? 1 : 100))).toBe(true)
    }
  })
  test('filters question splits strictly and retains ASI reference runs', () => {
    expect(filterRecords(litqa, 'test')).toHaveLength(27)
    expect(filterRecords(litqa, 'val')).toHaveLength(4)
    expect(filterRecords(b1, 'local')).toHaveLength(3)
    expect(filterRecords(b1, 'public')).toHaveLength(23)
    for (const rows of [b2, b3, b4]) {
      expect(filterRecords(rows, 'local')).toHaveLength(2)
      expect(filterRecords(rows, 'public')).toHaveLength(22)
    }
    expect(filterRecords(b1, 'public').filter((row) => row.group === 'aipoch')).toHaveLength(2)
  })
  test('includes the v8 test run and ScholarQA records with descending, non-mutating filters', () => {
    expect(sqa).toHaveLength(42)
    expect(filterRecords(sqa, 'test')).toHaveLength(41)
    expect(filterRecords(sqa, 'val')).toHaveLength(1)
    expect(filterRecords(litqa, 'test').filter((r) => r.group === 'aipoch')).toMatchObject([
      { score: 90.6667, source: 'test', date: '2026-10-23' }
    ])
    for (const rows of [litqa, pf, sqa, b1, b2, b3, b4]) {
      const ids = rows.map((r) => r.id)
      const sorted = filterRecords([...rows].reverse(), 'all')
      expect(sorted.map((r) => r.score)).toEqual(rows.map((r) => r.score).sort((a, b) => b - a))
      expect(rows.map((r) => r.id)).toEqual(ids)
    }
  })
  test('matches B3 and B4 by system and model, preserving signed changes', () => {
    const matches = matchDistractorRecords()
    expect(matches).toHaveLength(23)
    expect(matches.find((row) => row.group === 'aipoch')?.delta).toBeCloseTo(-0.21)
    expect(
      matches.find((row) => row.system === 'Codex' && row.model === 'GPT-6 Astra')?.delta
    ).toBeCloseTo(-2.67)
    expect(matches.find((row) => row.system === 'MiMo Code')?.delta).toBeCloseTo(2.61)
  })
  test('publishes the canonical Benchmark route and separates compilation from page modification', () => {
    expect(String(benchmarkMetadata.alternates?.canonical)).toEndWith('/benchmark/open-science')
    expect(benchmarkStructuredData()['@graph'][1]).toMatchObject({
      datePublished: '2026-10-19',
      dateModified: '2026-10-29T00:00:00.000Z'
    })
  })
})
