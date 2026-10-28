import Link from 'next/link'
import { Button } from '@/components/ui/button'

const statistics = [
  ['100%', 'LitQA2-FullText-Search', '+20.0', 'over best public val. 80.0'],
  ['0.4554', 'PaperFinding', '+0.069', 'over best public val. 0.3862'],
  ['79.35', 'ASI-Bench B1 · full protocol', '+4.57', 'over Codex 74.78'],
  ['56.11', 'ASI-Bench B2 · methods only', '+0.02', 'over Codex 56.09'],
  ['59.67', 'ASI-Bench B3 · autonomous', '+1.55', 'over Codex 58.12'],
  ['59.46', 'ASI-Bench B4 · with distractors', '+4.01', 'over Codex 55.45']
]

export function BenchmarkHero() {
  return (
    <section className="benchmark-hero">
      <div className="hero-backdrop" aria-hidden="true">
        {/* biome-ignore lint/performance/noImgElement: Scale the shared artwork edge to edge, preserving its original proportions. */}
        <img src="/figma/audit/75fa7.png" width={1672} height={941} alt="" />
        <div />
      </div>
      <div className="hero-content">
        <h1>Open-Science Benchmarks</h1>
        <p className="tag">
          Explore AIPOCH Open-Science’s results across scientific benchmarks, with evaluation
          methods, configurations, and supporting evidence.
        </p>
        <div className="byline">
          <b>AIPOCH Research</b>
          <br />
          AIPOCH · October 2026
        </div>
        <div className="notice">
          <strong>How to read these results · 19 October 2026</strong>
          <br />
          Every AIPOCH score on this page comes from our own local evaluation runs. The
          &quot;rank&quot; in each chart orders the listed records by score; it is not an official
          leaderboard placement. On AstaBench our runs use the validation split, while most public
          entries use the test split, so cross-split gaps are indicative only. On ASI-Bench our
          primary comparison is Codex run locally with the same model on the same tasks; public
          leaderboard entries are shown for context.
        </div>
        <div className="hero-cta">
          <Button asChild className="hero-button">
            <Link href="/open-science/download">Download</Link>
          </Button>
          <Button asChild variant="outline" className="hero-button">
            <a
              href="https://github.com/aipoch/open-science"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
          <Button asChild variant="outline" className="hero-button">
            <a href="#method">Evaluation details</a>
          </Button>
        </div>
        <div className="stats">
          {statistics.map(([value, name, delta, comparison]) => (
            <div className="stat" key={name}>
              <div className="v">{value}</div>
              <div className="n">{name}</div>
              <div className="d">
                {delta} <span>{comparison}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
