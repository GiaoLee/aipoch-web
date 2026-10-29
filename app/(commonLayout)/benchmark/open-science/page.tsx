import { JsonLd } from '@/components/json-ld'
import { BenchmarkHero } from './benchmark-hero'
import { BenchmarkMotion } from './benchmark-motion'
import {
  BarChart,
  QueryTypes,
  GuidanceLadder,
  GuidanceChart,
  SwarmChart,
  ScholarComparison,
  DistractorChart
} from './benchmark-charts'
import { benchmarkMetadata, benchmarkStructuredData } from './benchmark-metadata'
import { RecordsTable } from './benchmark-records'
import './benchmark.css'

export const metadata = benchmarkMetadata

export default function OpenScienceBenchmarkPage() {
  return (
    <BenchmarkMotion>
      <JsonLd data={benchmarkStructuredData()} />
      <article>
        <BenchmarkHero />
        <div className="col">
          <h2>{'Benchmarks for agentic scientific research'}</h2>
          <p>
            {'AIPOCH Open-Science has completed '}
            <strong>{'seven tests on two scientific-agent benchmarks'}</strong>
            {
              '. Together they cover the main stages of research work: locating the papers a question depends on, assembling a complete literature set, turning that literature into a cited answer, executing a given research protocol, choosing methods autonomously, and staying on course when the task description is padded with irrelevant information.'
            }
          </p>
          <p>
            {
              'Open-Science posts the highest score, or shares it, on every one of the seven tests among the records we compiled. The table below states what each number is compared against, so a same-question comparison is never confused with a cross-split one. Each test is then described in terms of what it measures, how we ran it, and what the number does and does not mean, followed by every comparison record in full.'
            }
            <sup>
              <a href="#n1">{'1'}</a>
            </sup>
          </p>
        </div>
        <figure>
          <div className="chart">
            <div className="ch-top">
              <div>
                <div className="ch-title">{'Seven tests at a glance'}</div>
                <div className="ch-sub">
                  {'what each test asks, and what our number is compared against'}
                </div>
              </div>
            </div>
            <div className="tbl-wrap" style={{ border: 0, padding: 0, background: 'none' }}>
              <table className="tbl glance">
                <thead>
                  <tr>
                    <th>{'Test'}</th>
                    <th>{'Capability'}</th>
                    <th>{'Open-Science'}</th>
                    <th>{'Compared with'}</th>
                    <th>{'Margin'}</th>
                    <th>{'Basis'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{'LitQA2 · official test'}</td>
                    <td>{'Find the paper that answers a research question'}</td>
                    <td className="m">{'90.67% (68/75)'}</td>
                    <td>{'Asta Paper Finder, Asta v0 · 90.67%'}</td>
                    <td className="tie">{'Tied 1st'}</td>
                    <td>
                      <span className="bdg same">{'Same split'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{'LitQA2 · validation'}</td>
                    <td>{'Same task, 10-question validation split'}</td>
                    <td className="m">{'100% (10/10)'}</td>
                    <td>{'Asta Paper Finder · 80%'}</td>
                    <td className="tie">{'+20.0 pts'}</td>
                    <td>
                      <span className="bdg same">{'Same split'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{'PaperFinding'}</td>
                    <td>{'Retrieve an accurate, complete set of papers for a request'}</td>
                    <td className="m">{'0.4554 (66 q.)'}</td>
                    <td>{'Best public validation · 0.3862'}</td>
                    <td className="tie">{'+0.0692'}</td>
                    <td>
                      <span className="bdg same">{'Same split'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{'ScholarQA-CS2'}</td>
                    <td>{'Answer a research question with a cited synthesis of the literature'}</td>
                    <td className="m">{'0.9289 (100 q.)'}</td>
                    <td>{'Asta Scholar QA (w/ tables) · 0.9192'}</td>
                    <td className="tie">{'+0.0097'}</td>
                    <td>
                      <span className="bdg cross">{'Cross-split'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{'ASI-Bench B1'}</td>
                    <td>{'Execute a complete, given research protocol'}</td>
                    <td className="m">{'79.35'}</td>
                    <td>{'Codex · GPT-6 Astra · 74.78'}</td>
                    <td className="tie">{'+4.57'}</td>
                    <td>
                      <span className="bdg model">{'Same model · local'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{'ASI-Bench B2'}</td>
                    <td>{'Turn specified methods into a working pipeline'}</td>
                    <td className="m">{'56.11'}</td>
                    <td>{'Codex · GPT-6 Astra · 56.09'}</td>
                    <td className="tie">{'+0.02'}</td>
                    <td>
                      <span className="bdg model">{'Same model · local'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{'ASI-Bench B3'}</td>
                    <td>{'Choose and run research methods autonomously'}</td>
                    <td className="m">{'59.67'}</td>
                    <td>{'Codex · GPT-6 Astra · 58.12'}</td>
                    <td className="tie">{'+1.55'}</td>
                    <td>
                      <span className="bdg model">{'Same model · local'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{'ASI-Bench B4'}</td>
                    <td>{'Research autonomously despite distracting information'}</td>
                    <td className="m">{'59.46'}</td>
                    <td>{'Codex · GPT-6 Astra · 55.45'}</td>
                    <td className="tie">{'+4.01'}</td>
                    <td>
                      <span className="bdg model">{'Same model · local'}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="basis-key">
              <span>
                <span className="bdg same">{'Same split'}</span>
                {' our run and the comparison answer the same questions'}
              </span>
              <span>
                <span className="bdg cross">{'Cross-split'}</span>
                {' our validation run against official test records; a reference comparison'}
              </span>
              <span>
                <span className="bdg model">{'Same model · local'}</span>
                {' Codex run locally with the same model on the same tasks'}
              </span>
            </div>
          </div>
          <figcaption>
            <b>{'Figure 1.'}</b>
            {
              'Seven tests, eight results. Each row names the record we compare against and the basis of that comparison.'
            }
          </figcaption>
        </figure>
        <div className="col">
          <h2>{'AstaBench: literature search and synthesis'}</h2>
          <p>
            {
              'AstaBench, from Ai2, spans literature understanding, code execution, data analysis and scientific discovery across 11 sub-benchmarks and more than 2,400 samples. We ran three of its literature-understanding tasks: two retrieval tasks that test whether an agent can find the work a research question depends on, and ScholarQA-CS2, which tests whether it can turn that literature into a cited answer.'
            }
          </p>
          <p>
            {"The LitQA2 test-split run uses Open-Science's "}
            <strong>{'literature-retrieval agent'}</strong>
            {
              ", a plugin built on the workbench's own literature tooling: reference resolution and metadata enrichment, open-access full-text retrieval, full-text search across the papers it reads, and citation discovery through Semantic Scholar. It is the same Literature Library a researcher uses inside the app."
            }
          </p>
        </div>
        <div className="pair">
          <section className="cell">
            <div className="cell-text">
              <h3>{'LitQA2-FullText-Search'}</h3>
              <p>
                {
                  'The agent receives a research question and must find the paper that contains the answer. A question counts as solved when the target paper appears among the top 30 results returned, so the metric, recall@30, measures how well the agent locates literature. We report two runs: one on the '
                }
                <strong>{'official 75-question test split'}</strong>
                {
                  ', the same questions every published test record answers, and an earlier three-repeat run on the 10-question validation split.'
                }
              </p>
              <p>
                {'On the test split, Open-Science with GPT-6 Astra finds the target paper for '}
                <strong>{'68 of 75 questions (90.67%)'}</strong>
                {'. That '}
                <strong>{'ties the highest score'}</strong>
                {
                  " among the 26 published test records, held by Ai2's purpose-built search systems Asta Paper Finder and Asta v0, and is 4 points above the strongest general-purpose agent baseline, ReAct with Claude Opus 4.6 or Sonnet 4.6 (86.67%). On the validation split it finds all 10 targets (100%), 20 points above the best public validation record (80%). Recall@30 measures whether the target paper was found; it is not question-answering accuracy."
                }
              </p>
            </div>
            <figure>
              <BarChart kind="litqa" />
              <figcaption>
                <b>{'Figure 2.'}</b>
                {
                  'Every LitQA2-FullText-Search record we compiled. The chart opens on All, ordered by score. The Test view compares Open-Science with the 26 published records on the same 75 questions; Validation shows the four 10-question validation records. Hover a bar for models, cost per question and date.'
                }
              </figcaption>
            </figure>
          </section>
          <section className="cell">
            <div className="cell-text">
              <h3>{'PaperFinding'}</h3>
              <p>
                {
                  'PaperFinding asks for a set of papers that satisfies a request: a research topic, clues pointing to a specific paper, or metadata such as author and year. The score combines the precision and coverage of the returned set, which makes it closer to real literature gathering than single-paper lookup. We ran the '
                }
                <strong>{'66-question validation split'}</strong>
                {
                  ': 48 semantic, 10 specific-paper and 8 metadata queries. The public records below use a separate 267-question test split.'
                }
              </p>
              <p>
                {'Open-Science scores '}
                <strong>{'0.4554'}</strong>
                {
                  ' out of 1. That is about 0.069 above the best public validation result we compiled (0.3862) and 0.015 above the top public test record, RoboPhD (2) at 0.4403. Because the validation and test splits contain different questions, the second gap should not be read as a same-split lead.'
                }
              </p>
            </div>
            <figure>
              <BarChart kind="pf" />
              <figcaption>
                <b>{'Figure 3.'}</b>
                {
                  "Open-Science's local validation result and all 33 public test records. Different submissions from the same system are kept as separate rows; hover a bar for models and submission date."
                }
              </figcaption>
            </figure>
          </section>
        </div>
        <div className="col">
          <p>
            {
              'Broken down by query type, specific-paper and metadata queries are already strong. Semantic queries, which make up most of the split, are where the most headroom remains.'
            }
          </p>
        </div>
        <figure>
          <div className="chart">
            <div className="ch-top">
              <div className="ch-title">PaperFinding by query type</div>
              <div className="ch-sub">
                Open-Science score per query type, validation split, 66 questions
              </div>
            </div>
            <QueryTypes />
          </div>
          <figcaption>
            <b>{'Figure 4.'}</b>
            {'Score by query type. Ring fill is the score out of 1.'}
          </figcaption>
        </figure>
        <div className="col">
          <h3 id="sqa">{'ScholarQA-CS2: a cited answer to a research question'}</h3>
          <p>
            {
              'ScholarQA-CS2 gives the agent a research question and asks for a written answer built from the literature: find the relevant papers, synthesise the evidence, and back each claim with an accurate citation. The grader combines four quality measures into one composite score out of 1, rewarding answers that cover the key points, cite sources that actually support the claims attached to them, and draw no conclusions beyond the evidence. We ran Open-Science with DeepSeek v4-flash locally on the '
            }
            <strong>{'100-question validation split'}</strong>
            {'.'}
          </p>
          <p>
            {'Open-Science scores '}
            <strong>{'0.9289'}</strong>
            {
              ', the highest value among the 42 records we compiled. The best official test record, Asta Scholar QA (w/ tables), scores 0.9192, a numerical gap of 0.0097, just under one point on a 100-point scale. Because our run uses the validation split and the official records use the test split, we present this as a reference comparison rather than a head-to-head ranking. The score is a composite quality measure, not the share of questions answered completely correctly.'
            }
          </p>
        </div>
        <div className="split2">
          <figure>
            <BarChart kind="sqa" />
            <figcaption>
              <b>{'Figure 5.'}</b>
              {
                "Open-Science's validation result and all 41 official ScholarQA-CS2 test records. Separate submissions from the same system are kept as separate rows; hover a bar for the model."
              }
            </figcaption>
          </figure>
          <div className="stack">
            <figure>
              <ScholarComparison zoom />
              <figcaption>
                <b>{'Figure 6.'}</b>
                {
                  'The top of the field on a zoomed axis that starts at 0.84, so the gaps between leading records are visible. Two records tie at 0.8663.'
                }
              </figcaption>
            </figure>
            <figure>
              <ScholarComparison />
              <figcaption>
                <b>{'Figure 7.'}</b>
                {
                  'Open-Science alongside the named research assistants in the official records, on the full 0–1 scale. Open-Science is scored on the validation split, the others on the official test split.'
                }
              </figcaption>
            </figure>
            <div className="callout-block">
              <div className="chart callout">
                <div className="ch-title">{'How to read 0.9289'}</div>
                <div className="big">
                  {'0.9289'}
                  <small>{'+0.0097'}</small>
                </div>
                <dl>
                  <dt>{'A composite quality score'}</dt>
                  <dd>
                    {
                      'Four quality measures combined into one score out of 1. It is not the percentage of questions answered completely correctly.'
                    }
                  </dd>
                  <dt>{'100 validation questions, local run'}</dt>
                  <dd>
                    {
                      'Open-Science with DeepSeek v4-flash, evaluated locally and not yet submitted to the official leaderboard.'
                    }
                  </dd>
                  <dt>{'Official records use the test split'}</dt>
                  <dd>
                    {
                      'Different questions, so the 0.0097 gap over Asta Scholar QA (w/ tables) is a reference comparison.'
                    }
                  </dd>
                </dl>
              </div>
              <div className="chart-caption">
                ScholarQA-CS2 measures cited-answer quality; the gap to official test records is a
                cross-split reference, not a head-to-head lead.
              </div>
            </div>
          </div>
        </div>
        <figure>
          <SwarmChart kind="asta" />
          <figcaption>
            <b>{'Figure 8.'}</b>
            {
              'Where Open-Science sits in each AstaBench field. Every dot is one listed record; open dots use the validation split, filled dots the test split. The LitQA2 row shows both Open-Science runs: 90.67% on the official test split and 100% on validation. Hover a dot for details.'
            }
          </figcaption>
        </figure>
        <details className="records">
          <summary>
            {'LitQA2-FullText-Search · official test records '}
            <small>{'27 records with models, cost per question, date and official logs'}</small>
          </summary>
          <div className="tbl-wrap">
            <RecordsTable kind="litqa" />
          </div>
          <div className="tnote">
            {
              'Ranks follow the published records; tied scores share a rank. The cost of the local Open-Science run was not standardized against the published setup, so this table does not support a cost-efficiency comparison.'
            }
          </div>
        </details>
        <details className="records">
          <summary>
            {'ScholarQA-CS2 · all records '}
            <small>{'42 records: Open-Science validation and 41 official test records'}</small>
          </summary>
          <div className="tbl-wrap">
            <RecordsTable kind="sqa" />
          </div>
          <div className="tnote">
            {
              'Open-Science is scored on the 100-question validation split; all other records on the official test split. Where the official record leaves the model field empty it is shown as not disclosed.'
            }
          </div>
        </details>
        <div className="col">
          <h2>{'ASI-Bench: research execution'}</h2>
          <p>
            {
              'ASI-Bench contains 60 project-level research tasks across 11 disciplines. Each task is a small research project: the agent has to process data, write and run code, and deliver results that can be checked. Levels B1 to B4 keep the same task and progressively withdraw guidance, so the gap between levels shows how much an agent depends on being told what to do.'
            }
          </p>
          <p>
            {
              'All ASI-Bench scores are task-quality scores out of 100, not the share of tasks fully correct. Our runs use the locally available task set while the public leaderboard uses the official one, so our '
            }
            <strong>
              {'primary comparison is Codex run locally with the same model (GPT-6 Astra)'}
            </strong>
            {', with public leaderboard records as secondary context.'}
          </p>
        </div>
        <figure>
          <div className="chart">
            <div className="ch-top">
              <div className="ch-title">Four levels of guidance</div>
              <div className="ch-sub">what the task statement gives the agent at each level</div>
            </div>
            <GuidanceLadder />
          </div>
          <figcaption>
            <b>{'Figure 9.'}</b>
            {
              "The ASI-Bench guidance levels. Blue squares are given, open squares are withheld, orange squares are distractors added. Scores are Open-Science's."
            }
          </figcaption>
        </figure>
        <figure>
          <GuidanceChart />
          <figcaption>
            <b>{'Figure 10.'}</b>
            {
              "Open-Science, Codex run locally with the same model, and the best public leaderboard record at each level. Numbers to the right are Open-Science's lead over local Codex."
            }
          </figcaption>
        </figure>
        <figure>
          <SwarmChart kind="asi" />
          <figcaption>
            <b>{'Figure 11.'}</b>
            {
              'The full ASI-Bench field at each level. Every dot is one record; the dashed line marks local Codex with GPT-6 Astra. Hover a dot for details.'
            }
          </figcaption>
        </figure>
        <div className="pair quad">
          <section className="cell">
            <div className="cell-text">
              <h3>{'B1: execute a complete protocol'}</h3>
              <p>
                {
                  'The task gives the research background, the specified method, the formulas and every step. The agent has to implement the protocol as a running program, compute the results and deliver them. B1 asks whether an agent can actually do the work once the route is fully mapped out. We ran three local repetitions; the reported score covers 59 scored tasks, since one of the 60 standard tasks was excluded after a grader fault.'
                }
              </p>
              <p>
                {'Open-Science with GPT-6 Astra scores '}
                <strong>{'79.35'}</strong>
                {
                  ', 4.57 above Codex with the same model (74.78) and 7.06 above the best public record (Claude Code with Claude Opus 5, 72.29). A second Open-Science run with DeepSeek v4-flash scores 69.64 and is kept in the chart.'
                }
              </p>
            </div>
            <figure>
              <BarChart kind="b1" />
              <figcaption>
                <b>{'Figure 12.'}</b>
                {
                  'All 24 B1 records. Repeated records for the same system and model are labelled record 1 and record 2.'
                }
              </figcaption>
            </figure>
          </section>
          <section className="cell">
            <div className="cell-text">
              <h3>{'B2: organise specified methods into a pipeline'}</h3>
              <p>
                {
                  'The methods and constraints stay in the task, but the step-by-step plan is removed. The agent decides what to do first, how the methods connect and which implementation details to fill in, and must end with a pipeline that runs. We ran three local repetitions; the number of scored tasks was not recorded separately for this level.'
                }
              </p>
              <p>
                {'Open-Science scores '}
                <strong>{'56.11'}</strong>
                {' against 56.09 for local Codex, effectively '}
                <strong>{'parity'}</strong>
                {'. Both sit well above the best public record, Codex with GPT-5.6 Sol at 49.57.'}
              </p>
            </div>
            <figure>
              <BarChart kind="b2" />
              <figcaption>
                <b>{'Figure 13.'}</b>
                {'All 23 B2 records.'}
              </figcaption>
            </figure>
          </section>
          <section className="cell">
            <div className="cell-text">
              <h3>{'B3: choose the research method'}</h3>
              <p>
                {
                  'Only the research goal, input data, constraints and deliverables remain; no method is specified. The agent must select an appropriate approach, design the workflow, run the analysis and validate the results. Open-Science and local Codex each completed three runs over all 60 tasks, and both scores are three-run means.'
                }
              </p>
              <p>
                {'Open-Science scores '}
                <strong>{'59.67'}</strong>
                {
                  ', 1.55 above local Codex (58.12) and 8.07 above the best public record (51.60). It is also higher than our own B2 score: without being told the method, the agent did slightly better than when handed one.'
                }
              </p>
            </div>
            <figure>
              <BarChart kind="b3" />
              <figcaption>
                <b>{'Figure 14.'}</b>
                {'All 23 B3 records.'}
              </figcaption>
            </figure>
          </section>
          <section className="cell">
            <div className="cell-text">
              <h3>{'B4: autonomous research with distractors'}</h3>
              <p>
                {
                  'B4 takes the B3 task and adds information that is factually correct but not needed to complete it. The agent must pick out what matters and keep the extra background from pulling the research off course. As in B3, both agents completed three runs over 60 tasks and we report the means.'
                }
              </p>
              <p>
                {'Open-Science scores '}
                <strong>{'59.46'}</strong>
                {', 4.01 above local Codex (55.45) and 9.05 above the best public record (50.41).'}
              </p>
            </div>
            <figure>
              <BarChart kind="b4" />
              <figcaption>
                <b>{'Figure 15.'}</b>
                {'All 23 B4 records.'}
              </figcaption>
            </figure>
          </section>
        </div>
        <div className="col">
          <p>
            {'Adding distractors cost Open-Science '}
            <strong>{'0.21 points'}</strong>
            {
              ' on average (59.67 to 59.46), against 2.67 points for local Codex (58.12 to 55.45). Across the field, most entries move by a few points in either direction. A near-flat mean says the two levels behave alike on average in this run; it does not mean that no individual task was affected.'
            }
          </p>
        </div>
        <figure>
          <DistractorChart />
          <figcaption>
            <b>{'Figure 16.'}</b>
            {
              'B3 to B4 for every entry that appears at both levels, ordered by B4 score. Open circles are B3, filled circles B4; the right column is the change.'
            }
          </figcaption>
        </figure>
        <div className="col" id="method">
          <h2>{'How we ran the evaluation'}</h2>
          <p>
            {
              'Each benchmark runs with its own tasks, grader and metric, and we report each in that metric rather than converting to a common scale. AIPOCH runs were repeated where noted and the reported value is the stated mean or result; the table below lists the exact scope of each run.'
            }
          </p>
        </div>
        <figure>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>{'Test'}</th>
                  <th>{'Model'}</th>
                  <th>{'Split / scope'}</th>
                  <th>{'Runs'}</th>
                  <th>{'Metric'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{'LitQA2 · official test'}</td>
                  <td>{'GPT-6 Astra, literature-retrieval agent'}</td>
                  <td>{'Official test, 75 questions'}</td>
                  <td>{'Local, 23 Oct 2026'}</td>
                  <td>{'recall@30'}</td>
                </tr>
                <tr>
                  <td>{'LitQA2 · validation'}</td>
                  <td>{'DeepSeek v4-flash'}</td>
                  <td>{'Validation, 10 questions'}</td>
                  <td>{'3 local'}</td>
                  <td>{'recall@30'}</td>
                </tr>
                <tr>
                  <td>{'PaperFinding'}</td>
                  <td>{'DeepSeek v4-flash'}</td>
                  <td>{'Validation, 66 questions (48 / 10 / 8)'}</td>
                  <td>{'Local'}</td>
                  <td>{'Combined score, 0–1'}</td>
                </tr>
                <tr>
                  <td>{'ScholarQA-CS2'}</td>
                  <td>{'DeepSeek v4-flash'}</td>
                  <td>{'Validation, 100 questions'}</td>
                  <td>{'Local'}</td>
                  <td>{'Composite quality score, 0–1'}</td>
                </tr>
                <tr>
                  <td>{'ASI-Bench B1'}</td>
                  <td>{'GPT-6 Astra'}</td>
                  <td>{'59 of 60 tasks scored'}</td>
                  <td>{'3 local'}</td>
                  <td>{'Task quality, 0–100'}</td>
                </tr>
                <tr>
                  <td>{'ASI-Bench B2'}</td>
                  <td>{'GPT-6 Astra'}</td>
                  <td>{'Local task set'}</td>
                  <td>{'3 local'}</td>
                  <td>{'Task quality, 0–100'}</td>
                </tr>
                <tr>
                  <td>{'ASI-Bench B3'}</td>
                  <td>{'GPT-6 Astra'}</td>
                  <td>{'60 tasks per run'}</td>
                  <td>{'3 local, mean'}</td>
                  <td>{'Task quality, 0–100'}</td>
                </tr>
                <tr>
                  <td>{'ASI-Bench B4'}</td>
                  <td>{'GPT-6 Astra'}</td>
                  <td>{'60 tasks per run'}</td>
                  <td>{'3 local, mean'}</td>
                  <td>{'Task quality, 0–100'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <figcaption>
            <b>{'Figure 17.'}</b>
            {
              'Scope of every AIPOCH run reported on this page. Local Codex baselines on ASI-Bench B1–B4 used the same model and task set.'
            }
          </figcaption>
        </figure>
        <div className="col">
          <h2>{'What the results say'}</h2>
          <p>
            <strong>{'Literature retrieval.'}</strong>
            {
              ' On the official LitQA2 test split, Open-Science matches the best published score and leads every general-purpose agent baseline. It performs strongly on specific-paper and metadata lookups in PaperFinding; semantic topic search, the largest share of that split, is the clearest area for improvement.'
            }
          </p>
          <p>
            <strong>{'Literature synthesis.'}</strong>
            {
              " On ScholarQA-CS2, Open-Science's cited answers score 0.9289, the highest value among the records we compiled, above the official records of research assistants such as SciSpace Deep Review, Elicit, FutureHouse Crow and OpenAI Deep Research. Our run uses the validation split and theirs the test split."
            }
          </p>
          <p>
            <strong>{'Research execution.'}</strong>
            {
              ' The lead is largest where the work is most concrete (B1, +4.57) and where the task is most cluttered (B4, +4.01). On B2 the two harnesses are level, which tells us that turning a list of methods into a working pipeline is where our harness adds least today.'
            }
          </p>
          <p>
            <strong>{'Same model, different harness.'}</strong>
            {
              ' On ASI-Bench, Open-Science and Codex ran the same model on the same tasks, so the gap between them reflects the harness rather than the model.'
            }
          </p>
          <h2>{'Availability'}</h2>
          <p>
            {
              "Open-Science is AIPOCH's open-source harness for scientific research: model-agnostic, auditable and yours to run. Install the "
            }
            <a href="/open-science/download">{'desktop app'}</a>
            {', read the '}
            <a href="/docs/">{'documentation'}</a>
            {', or browse the source on '}
            <a href="https://github.com/aipoch/open-science">{'GitHub'}</a>
            {'. Medical research skills for the agent are available in the '}
            <a href="/agent-skills/list">{'Skills Hub'}</a>
            {', and every skill can be audited before deployment with '}
            <a href="/benchmark/medskillaudit">{'MedSkillAudit'}</a>
            {'.'}
          </p>
          <div className="notes">
            <h4>{'Notes'}</h4>
            <ol>
              <li id="n1">
                {
                  'All AIPOCH Open-Science scores are local evaluation results, compiled on 19 October 2026 (PaperFinding, ASI-Bench, LitQA2 validation) and 26 October 2026 (LitQA2 test, ScholarQA-CS2). None has been submitted to an official leaderboard. The order of rows in each chart follows the listed scores and is not an official ranking. Comparison records are reproduced as compiled in our internal summaries, including separate submissions from the same system.'
                }
              </li>
              <li id="n2">
                {
                  "AstaBench: the LitQA2-FullText-Search test run (23 October 2026) used Open-Science's literature-retrieval agent with GPT-6 Astra on the official 75-question test split and is compared with the 26 published test records. Validation runs: LitQA2 (10 questions, three local repeats), PaperFinding (66 questions) and ScholarQA-CS2 (100 questions). Published PaperFinding and ScholarQA-CS2 references mostly use test splits, so cross-split differences are for reference only. Best public validation results cited: LitQA2-FullText-Search 0.80 (Asta Paper Finder); PaperFinding 0.3862. The cost of local runs was not standardized, so no cost-efficiency comparison is made."
                }
              </li>
              <li id="n3">
                {
                  'ASI-Bench: AIPOCH and the local Codex baseline use the locally available task set; public leaderboard records use the official evaluation set. B1 excludes one task after a grader fault (59 scored). B3 and B4 report three-run means over 60 tasks for both agents.'
                }
              </li>
            </ol>
            <h4>{'Citation'}</h4>
            <pre>
              {
                '@misc{aipoch2026openscience,\n  title        = {AIPOCH Open-Science: Benchmark Results on AstaBench and ASI-Bench},\n  author       = {{AIPOCH Research}},\n  year         = {2026},\n  month        = oct,\n  organization = {AIPOCH},\n  howpublished = {\\url{https://github.com/aipoch/open-science}}\n}'
              }
            </pre>
          </div>
        </div>
      </article>
    </BenchmarkMotion>
  )
}
