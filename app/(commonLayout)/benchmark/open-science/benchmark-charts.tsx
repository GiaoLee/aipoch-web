'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  b1,
  b2,
  b3,
  b4,
  litqa,
  pf,
  sqa,
  filterRecords,
  matchDistractorRecords,
  type AgentGroup,
  type BenchmarkRecord,
  type SourceFilter
} from './benchmark-results'

const colors: Record<AgentGroup, string> = {
  aipoch: 'var(--bench-green)',
  codex: 'var(--bench-codex)',
  claude: 'var(--bench-claude)',
  react: 'var(--bench-react)',
  smol: 'var(--bench-smol)',
  asta: 'var(--bench-asta)',
  robo: 'var(--bench-robo)',
  prod: 'var(--bench-robo)',
  other: 'var(--bench-other)'
}
const names: Record<AgentGroup, string> = {
  aipoch: 'AIPOCH Open-Science',
  codex: 'Codex',
  claude: 'Claude Code',
  react: 'ReAct',
  smol: 'Smolagents Coder',
  asta: 'Asta',
  robo: 'RoboPhD',
  prod: 'research assistants',
  other: 'other agents'
}
const levels = [
  { id: 'B1', name: 'Full protocol', rows: b1, description: 'execute a complete, given protocol' },
  {
    id: 'B2',
    name: 'Methods only',
    rows: b2,
    description: 'organise specified methods into a pipeline'
  },
  { id: 'B3', name: 'Autonomous', rows: b3, description: 'choose and run methods autonomously' },
  {
    id: 'B4',
    name: 'With distractors',
    rows: b4,
    description: 'autonomous research with distractors'
  }
]

function sourceLabel(record: BenchmarkRecord) {
  if (record.source === 'local') return 'Local run'
  if (record.source === 'public') return 'Public leaderboard'
  if (record.id.startsWith('sqa-'))
    return record.source === 'val' ? 'Local validation, 100 questions' : 'Official test'
  if (record.source === 'test' && record.group === 'aipoch')
    return 'Local run on official test split, 75 questions'
  if (record.source === 'test')
    return `Public test, ${record.id.startsWith('pf-') ? 267 : 75} questions`
  return record.group === 'aipoch'
    ? `Local validation, ${record.id.startsWith('pf-') ? 66 : 10} questions`
    : 'Public validation'
}

function Detail({
  record,
  children,
  className,
  style,
  extra
}: {
  record: BenchmarkRecord
  children?: ReactNode
  className?: string
  style?: CSSProperties
  extra?: string
}) {
  const [open, setOpen] = useState(false)
  const label = `${record.system} · ${record.model}, score ${record.score}, ${sourceLabel(record)}${extra ? `, ${extra}` : ''}`
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={className}
          style={style}
          aria-label={label}
          onClick={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpen(false)
          }}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        sideOffset={12}
        collisionPadding={8}
        className="benchmark-tooltip max-w-[min(320px,calc(100vw-16px))] rounded-none bg-[#111] p-3 text-xs text-[#d8d5cc]"
      >
        <strong className="text-white">{record.system}</strong>
        <div className="my-1 break-words font-mono text-[11px] text-[#b5b3ac]">{record.model}</div>
        <div>
          Score: <b className="font-mono text-[#afd670]">{record.score}</b>
        </div>
        <div>{sourceLabel(record)}</div>
        {record.cost !== undefined && <div>Cost per question: ${record.cost.toFixed(3)}</div>}
        {record.date && (
          <div>
            {record.group === 'aipoch' ? 'Run' : 'Submitted'}: {record.date}
          </div>
        )}
        {extra && <div>{extra}</div>}
      </TooltipContent>
    </Tooltip>
  )
}

function Legend({
  groups,
  children,
  round = false
}: {
  groups: AgentGroup[]
  children?: ReactNode
  round?: boolean
}) {
  return (
    <div className={`legend${round ? ' legend-round' : ''}`}>
      {groups.map((group) => (
        <span key={group}>
          <i style={{ background: colors[group] }} />
          {names[group]}
        </span>
      ))}
      {children}
    </div>
  )
}
function ChartHeading({
  title,
  subtitle,
  children
}: {
  title: string
  subtitle: string
  children?: ReactNode
}) {
  return (
    <div className="ch-top">
      <div className="ch-title">{title}</div>
      <div className="ch-sub">{subtitle}</div>
      {children}
    </div>
  )
}
function Ticks({ max = 100, ticks = [0, 25, 50, 75, 100] }: { max?: number; ticks?: number[] }) {
  return (
    <div className="ticks" aria-hidden="true">
      {ticks.map((tick) => (
        <span key={tick} style={{ left: `${(tick / max) * 100}%` }}>
          {max < 1 ? tick.toFixed(1) : tick}
        </span>
      ))}
    </div>
  )
}

export function BarChart({ kind }: { kind: 'litqa' | 'pf' | 'sqa' | 'b1' | 'b2' | 'b3' | 'b4' }) {
  const [filter, setFilter] = useState<SourceFilter>('all')
  const level = levels.find((level) => level.id.toLowerCase() === kind)
  const records =
    kind === 'litqa' ? litqa : kind === 'pf' ? pf : kind === 'sqa' ? sqa : (level?.rows ?? [])
  const title = level
    ? `ASI-Bench ${level.id}`
    : kind === 'litqa'
      ? 'LitQA2-FullText-Search'
      : kind === 'sqa'
        ? 'ScholarQA-CS2'
        : 'PaperFinding'
  const subtitle = level
    ? `${level.description} · score out of 100`
    : kind === 'litqa'
      ? 'recall@30, % of questions whose target paper is returned in the top 30'
      : kind === 'sqa'
        ? 'cited research answers · composite quality score, 0 to 1'
        : 'combined precision and coverage score, 0 to 1'
  const filters: [SourceFilter, string][] = level
    ? [
        ['all', 'All'],
        ['local', 'Local runs'],
        ['public', 'Public leaderboard']
      ]
    : [
        ['all', `All ${records.length}`],
        ['test', 'Official test'],
        ['val', 'Validation']
      ]
  const max = kind === 'pf' ? 0.5 : kind === 'sqa' ? 1 : 100
  const groups = [...new Set(records.map((record) => record.group))]
  return (
    <TooltipProvider>
      <section id={`ch-${kind}`} className="chart bar-chart" aria-label={`${title} comparison`}>
        <ChartHeading title={title} subtitle={subtitle}>
          <Legend groups={groups} />
          {filters.length > 0 && (
            <fieldset className="chips" aria-label={`${title} sources`}>
              {filters.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </fieldset>
          )}
        </ChartHeading>
        <div className="axis">
          <span />
          <Ticks
            max={max}
            ticks={
              kind === 'pf'
                ? [0, 0.1, 0.2, 0.3, 0.4, 0.5]
                : kind === 'sqa'
                  ? [0, 0.25, 0.5, 0.75, 1]
                  : undefined
            }
          />
          <span />
        </div>
        <div className="rows">
          {filterRecords(records, filter).map((record) => (
            <Detail
              key={record.id}
              record={record}
              className={`bar-row ${record.group === 'aipoch' ? 'me' : ''}`}
            >
              <span className="lab">
                <span className="agent-name">{record.system}</span>
                <em>
                  {kind === 'litqa'
                    ? record.model.split('/').at(-1)
                    : kind === 'pf'
                      ? record.model.split(' / ')[0] + (record.model.includes(' / ') ? ' +' : '')
                      : record.model}
                </em>
                {(record.source === 'local' ||
                  record.source === 'val' ||
                  record.group === 'aipoch') && <span className="tg">{record.source}</span>}
              </span>
              <span
                className="track"
                style={{ backgroundSize: `${kind === 'pf' ? 20 : 25}% 100%` }}
              >
                <span
                  className="bar"
                  style={{
                    width: `${(record.score / max) * 100}%`,
                    background: colors[record.group]
                  }}
                />
              </span>
              <span className="val">{record.score.toFixed(max <= 1 ? 4 : 2)}</span>
            </Detail>
          ))}
        </div>
      </section>
    </TooltipProvider>
  )
}

export function QueryTypes() {
  return (
    <div className="types">
      {[
        [
          'Semantic',
          48,
          0.3308,
          'Understands a research topic and finds papers whose content matches it.'
        ],
        ['Specific paper', 10, 0.8286, 'Pins down one particular paper from the clues given.'],
        ['Metadata', 8, 0.7359, 'Finds papers by author, year and other bibliographic fields.']
      ].map(([name, count, score, description]) => (
        <div className="type" key={name}>
          <div className="benchmark-score-ring">
            <svg width={84} height={84} viewBox="0 0 84 84" fill="none" aria-hidden="true">
              <circle cx={42} cy={42} r={36} stroke="var(--bench-line)" strokeWidth={7} />
              <circle
                className="ring-progress"
                cx={42}
                cy={42}
                r={36}
                pathLength={1}
                stroke="var(--bench-green)"
                strokeWidth={7}
                strokeLinecap="round"
                strokeDasharray={1}
                strokeDashoffset={1 - Number(score)}
                transform="rotate(-90 42 42)"
              />
            </svg>
            <span>{Number(score).toFixed(4).slice(1)}</span>
          </div>
          <div className="nm">{name}</div>
          <div className="ct">
            {count} questions · {Number(score).toFixed(4)}
          </div>
          <p>{description}</p>
        </div>
      ))}
    </div>
  )
}

export function GuidanceLadder() {
  return (
    <div className="ladder">
      {levels.map((level, index) => (
        <div className="step" key={level.id}>
          <div className="k">{level.id}</div>
          <div className="t">{level.name}</div>
          <ul>
            <li className="given">
              {index < 2 ? 'Background & goal' : 'Goal, data & constraints'}
            </li>
            <li className={index < 2 ? 'given' : 'withheld'}>Specified method</li>
            <li className={index === 0 ? 'given' : index === 3 ? 'added' : 'withheld'}>
              {index === 3 ? 'Irrelevant but true facts' : 'Formulas & full steps'}
            </li>
          </ul>
          <div className="s">
            {level.rows[0].score.toFixed(2)}
            <small>Open-Science score</small>
          </div>
        </div>
      ))}
    </div>
  )
}

export function GuidanceChart() {
  return (
    <TooltipProvider>
      <section className="chart" aria-label="ASI-Bench by guidance level">
        <ChartHeading title="ASI-Bench by guidance level" subtitle="task-quality score out of 100">
          <div className="legend legend-round">
            <span>
              <i style={{ background: colors.aipoch }} />
              AIPOCH Open-Science · GPT-6 Astra
            </span>
            <span>
              <i style={{ background: colors.codex }} />
              Codex · GPT-6 Astra (local)
            </span>
            <span>
              <i style={{ background: colors.other }} />
              best public record
            </span>
          </div>
        </ChartHeading>
        {levels.map((level) => {
          const ours = level.rows[0],
            codex = level.rows[1],
            best = level.rows.find((row) => row.source === 'public')
          if (!best) return null
          return (
            <div className="level-row" key={level.id}>
              <div className="gl">
                {level.id}
                <small>{level.name}</small>
              </div>
              <div className="track">
                <span
                  className="segment"
                  style={{ left: `${best.score}%`, width: `${ours.score - best.score}%` }}
                />
                {[best, codex, ours].map((record) => (
                  <Detail
                    key={record.id}
                    record={record}
                    className={`point ${record.group === 'aipoch' ? 'me' : ''}`}
                    style={{
                      left: `${record.score}%`,
                      background: record === best ? colors.other : colors[record.group]
                    }}
                  />
                ))}
                <span className="point-label" style={{ left: `${ours.score}%` }}>
                  {ours.score.toFixed(2)}
                </span>
              </div>
              <div className="delta">
                +{(ours.score - codex.score).toFixed(2)} <small>vs Codex</small>
              </div>
            </div>
          )
        })}
        <div className="level-axis">
          <span />
          <Ticks />
          <span />
        </div>
      </section>
    </TooltipProvider>
  )
}

/** Pack nearby points into alternating lanes, using the actual available plot width. */
function SwarmRow({
  records,
  label,
  subtitle,
  max,
  ticks,
  reference
}: {
  records: BenchmarkRecord[]
  label: string
  subtitle: string
  max: number
  ticks?: number[]
  reference?: number
}) {
  const plot = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(740)
  useEffect(() => {
    if (!plot.current) return
    const observer = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width))
    observer.observe(plot.current)
    return () => observer.disconnect()
  }, [])
  const placed: { record: BenchmarkRecord; x: number; y: number }[] = []
  for (const record of [...records].sort((a, b) => a.score - b.score)) {
    const x = (record.score / max) * width
    let lane = 0,
      y = 0
    while (placed.some((point) => Math.abs(point.x - x) < 13 && Math.abs(point.y - y) < 13)) {
      lane += 1
      y = (lane % 2 ? 1 : -1) * Math.ceil(lane / 2) * 13
    }
    placed.push({ record, x, y })
  }
  const height = Math.max(54, 2 * Math.max(...placed.map((point) => Math.abs(point.y))) + 32)
  const ours = records.find((record) => record.group === 'aipoch')
  if (!ours) return null
  return (
    <div className="swarm-row">
      <div className="gl">
        {label}
        <small>{subtitle}</small>
      </div>
      <div
        ref={plot}
        className="swarm-area"
        style={{ height, backgroundSize: `${ticks ? 100 / (ticks.length - 1) : 25}% 100%` }}
      >
        {reference !== undefined && (
          <span className="reference-line" style={{ left: `${(reference / max) * 100}%` }} />
        )}
        {placed.map(({ record, y }) => (
          <Detail
            key={record.id}
            record={record}
            className={`swarm-dot ${record.group === 'aipoch' ? 'me' : ''}`}
            style={{
              left: `${(record.score / max) * 100}%`,
              top: height / 2 + y,
              background:
                record.source === 'val'
                  ? record.group === 'aipoch'
                    ? 'var(--bench-validation)'
                    : '#fff'
                  : colors[record.group],
              borderColor:
                record.source === 'val'
                  ? record.group === 'aipoch'
                    ? 'var(--bench-green-ink)'
                    : record.group === 'other'
                      ? 'var(--bench-muted)'
                      : colors[record.group]
                  : '#fff'
            }}
          />
        ))}
      </div>
      <div className="val">
        {records
          .filter((record) => record.group === 'aipoch')
          .map((record) => (
            <span className="swarm-score" key={record.id}>
              {record.score.toFixed(max <= 1 ? 4 : 2)}
              {label === 'LitQA2' && (
                <small>{record.source === 'test' ? 'test' : 'validation'}</small>
              )}
            </span>
          ))}
        <small>{records.length} records</small>
      </div>
      {ticks && (
        <>
          <span />
          <Ticks max={max} ticks={ticks} />
          <span />
        </>
      )}
    </div>
  )
}

export function SwarmChart({ kind }: { kind: 'asta' | 'asi' }) {
  return (
    <TooltipProvider>
      <section
        className="chart"
        aria-label={`${kind === 'asta' ? 'AstaBench' : 'ASI-Bench'}: the whole field`}
      >
        <ChartHeading
          title={`${kind === 'asta' ? 'AstaBench' : 'ASI-Bench'}: the whole field`}
          subtitle={
            kind === 'asta'
              ? 'each dot is one record; each row has its own scale'
              : 'task-quality score out of 100; each dot is one record'
          }
        >
          <Legend
            round
            groups={
              kind === 'asta'
                ? ['aipoch', 'asta', 'react', 'smol', 'robo', 'prod', 'other']
                : ['aipoch', 'codex', 'claude', 'other']
            }
          >
            <span>
              <i className={kind === 'asta' ? 'legend-open' : 'legend-reference'} />
              {kind === 'asta' ? 'validation split' : 'local Codex · GPT-6 Astra'}
            </span>
          </Legend>
        </ChartHeading>
        {kind === 'asta' ? (
          <>
            <SwarmRow
              records={litqa}
              label="LitQA2"
              subtitle="recall@30, %"
              max={100}
              ticks={[0, 25, 50, 75, 100]}
            />
            <SwarmRow
              records={pf}
              label="PaperFinding"
              subtitle="score, 0–1"
              max={0.5}
              ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]}
            />
            <SwarmRow
              records={sqa}
              label="ScholarQA-CS2"
              subtitle="score, 0–1"
              max={1}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
            />
          </>
        ) : (
          levels.map((level, index) => (
            <SwarmRow
              key={level.id}
              records={level.rows}
              label={level.id}
              subtitle={level.name}
              max={100}
              reference={level.rows[1].score}
              ticks={index === 3 ? [0, 25, 50, 75, 100] : undefined}
            />
          ))
        )}
      </section>
    </TooltipProvider>
  )
}

export function DistractorChart() {
  return (
    <TooltipProvider>
      <section className="chart" aria-label="Effect of distractors, B3 to B4">
        <ChartHeading
          title="Effect of distractors, B3 → B4"
          subtitle="score out of 100; change on the right"
        >
          <div className="legend legend-round">
            <span>
              <i className="legend-open" />
              B3 autonomous
            </span>
            <span>
              <i style={{ background: '#6b6b66' }} />
              B4 with distractors
            </span>
            <span>
              <i style={{ background: colors.aipoch }} />
              AIPOCH Open-Science
            </span>
          </div>
        </ChartHeading>
        <div className="axis distractor-axis">
          <span />
          <Ticks max={70} ticks={[0, 10, 20, 30, 40, 50, 60, 70]} />
          <span />
        </div>
        {matchDistractorRecords().map((record) => (
          <Detail
            key={record.id}
            record={record}
            extra={`B3: ${record.previousScore.toFixed(2)}; change: ${record.delta.toFixed(2)}`}
            className={`distractor-row ${record.group === 'aipoch' ? 'me' : ''}`}
          >
            <span className="lab">
              {record.system}
              <em> · {record.model}</em>
            </span>
            <span className="track" style={{ backgroundSize: `${100 / 7}% 100%` }}>
              <span
                className="segment"
                style={{
                  left: `${(Math.min(record.previousScore, record.score) / 70) * 100}%`,
                  width: `${(Math.abs(record.delta) / 70) * 100}%`
                }}
              />
              <span
                className="dumbbell open"
                style={{ left: `${(record.previousScore / 70) * 100}%` }}
              />
              <span className="dumbbell" style={{ left: `${(record.score / 70) * 100}%` }} />
            </span>
            <span className={`val ${record.delta < 0 ? 'negative' : 'positive'}`}>
              {record.delta > 0 ? '+' : ''}
              {record.delta.toFixed(2)}
            </span>
          </Detail>
        ))}
      </section>
    </TooltipProvider>
  )
}

/** Zoomed dots preserve the truncated axis; assistant lollipops use the full score scale. */
export function ScholarComparison({ zoom = false }: { zoom?: boolean }) {
  const records = filterRecords(
    sqa.filter((r) => (zoom ? r.score >= 0.866 : r.group === 'aipoch' || r.group === 'prod')),
    'all'
  )
  const min = zoom ? 0.84 : 0
  const max = zoom ? 0.94 : 1
  const ticks = zoom ? [0.84, 0.86, 0.88, 0.9, 0.92, 0.94] : [0, 0.25, 0.5, 0.75, 1]
  const position = (value: number) => `${((value - min) / (max - min)) * 100}%`
  return (
    <TooltipProvider>
      <section
        id={zoom ? 'ch-sqa-zoom' : 'ch-sqa-prod'}
        className="chart scholar-comparison"
        aria-label={zoom ? 'ScholarQA-CS2: top of the field' : 'ScholarQA-CS2: research assistants'}
      >
        <ChartHeading
          title={zoom ? 'ScholarQA-CS2: top of the field' : 'ScholarQA-CS2: research assistants'}
          subtitle={
            zoom
              ? 'Zoomed axis · 0.84–0.94 · validation vs official test'
              : 'Full scale · 0–1 · validation vs official test'
          }
        >
          <Legend round groups={[...new Set(records.map((r) => r.group))]} />
        </ChartHeading>
        <div className="axis">
          <span />
          <div className="ticks" aria-hidden="true">
            {ticks.map((t) => (
              <span key={t} style={{ left: position(t) }}>
                {t}
              </span>
            ))}
          </div>
          <span />
        </div>
        {records.map((record) => (
          <Detail
            key={record.id}
            record={record}
            className={`bar-row ${record.group === 'aipoch' ? 'me' : ''}`}
            extra={
              zoom && record.group === 'aipoch'
                ? '+0.0097 vs best official test; different question splits'
                : undefined
            }
          >
            <span className="lab">
              <span className="agent-name">{record.system}</span>
              <em>{record.model}</em>
              {record.source === 'val' && <span className="tg">val</span>}
            </span>
            <span className="track" style={{ backgroundSize: `${100 / (ticks.length - 1)}% 100%` }}>
              {!zoom && (
                <span
                  className="scholar-stem"
                  style={{ width: position(record.score), background: colors[record.group] }}
                />
              )}
              {zoom && record.group === 'aipoch' && (
                <span
                  className="scholar-gap"
                  style={{ left: position(0.9192), width: `${(0.0097 / (max - min)) * 100}%` }}
                />
              )}
              <span
                className="scholar-dot"
                style={{
                  left: position(record.score),
                  background:
                    record.source === 'val' ? 'var(--bench-validation)' : colors[record.group],
                  borderColor:
                    record.source === 'val' ? 'var(--bench-green-ink)' : colors[record.group]
                }}
              />
            </span>
            <span className="val">{record.score.toFixed(4)}</span>
          </Detail>
        ))}
      </section>
    </TooltipProvider>
  )
}
