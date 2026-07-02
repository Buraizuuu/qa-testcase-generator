import { useState } from 'react'
import type { GenerationResult } from '../lib/types'
import TestCaseTable from './TestCaseTable'
import ExportMenu from './ExportMenu'

interface Props {
  result: GenerationResult | null
  streamText: string
  isGenerating: boolean
  error: string | null
  featureName: string
  onCancel: () => void
  durationMs: number | null
}

function formatDuration(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`
}

type Tab = 'overview' | 'scenarios' | 'testcases' | 'coverage'

const RISK_COLORS = {
  High: 'text-red-400 bg-red-900/30 border-red-800',
  Medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  Low: 'text-green-400 bg-green-900/30 border-green-800',
}

export default function OutputPanel({ result, streamText, isGenerating, error, featureName, onCancel, durationMs }: Props) {
  const [tab, setTab] = useState<Tab>('overview')

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-red-900/40 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-slate-200 font-medium mb-2">Generation Failed</p>
        <p className="text-slate-400 text-sm max-w-sm">{error}</p>
        {streamText && (
          <details className="mt-4 w-full max-w-lg text-left">
            <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">Show raw output</summary>
            <pre className="mt-2 p-3 bg-slate-900 rounded-lg text-xs text-slate-400 overflow-auto max-h-64 whitespace-pre-wrap">{streamText}</pre>
          </details>
        )}
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col h-full">
        {/* Live stream */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
            <span className="text-sm text-slate-300 font-medium">Generating test cases...</span>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors min-h-[44px]"
          >
            Cancel
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-xs text-slate-500 font-mono whitespace-pre-wrap leading-relaxed">
            {streamText || 'Analyzing requirements...'}
          </pre>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
        </div>
        <h2 className="text-slate-300 font-semibold text-lg mb-2">Ready to Generate</h2>
        <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
          Enter your feature name and requirements on the left, then click Generate to produce comprehensive test cases.
        </p>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'scenarios', label: 'Scenarios', count: result.testScenarios.length },
    { id: 'testcases', label: 'Test Cases', count: result.testCases.length },
    { id: 'coverage', label: 'Coverage' },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar + Export */}
      <div className="flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <div className="flex" role="tablist" aria-label="Output sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${
                tab === t.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-blue-900/60 text-blue-300' : 'bg-slate-800 text-slate-500'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {durationMs !== null && (
            <span className="text-xs text-slate-500">Generated in {formatDuration(durationMs)}</span>
          )}
          <ExportMenu result={result} featureName={featureName} />
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5" role="tabpanel" aria-label={tab}>
        {tab === 'overview' && <OverviewTab result={result} />}
        {tab === 'scenarios' && <ScenariosTab result={result} />}
        {tab === 'testcases' && <TestCaseTable testCases={result.testCases} />}
        {tab === 'coverage' && <CoverageTab result={result} />}
      </div>
    </div>
  )
}

// ── Sub-tabs ──────────────────────────────────────────────────────────────────

function OverviewTab({ result }: { result: GenerationResult }) {
  const stats = [
    { label: 'Total Test Cases', value: result.testCases.length, color: 'text-blue-400' },
    { label: 'Automation Candidates', value: result.testCases.filter((t) => t.automationCandidate).length, color: 'text-green-400' },
    { label: 'High/Critical', value: result.testCases.filter((t) => t.priority === 'Critical' || t.priority === 'High').length, color: 'text-red-400' },
    { label: 'Risks Identified', value: result.riskAssessment.length, color: 'text-yellow-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-800/60 rounded-xl p-4 border border-slate-800">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Section title="Requirement Summary">
        <p className="text-slate-300 text-sm leading-relaxed">{result.requirementSummary}</p>
      </Section>

      <Section title="Business Rules">
        <ul className="space-y-2">
          {result.businessRules.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300">
              <span className="shrink-0 text-blue-500 mt-0.5">•</span>
              {r}
            </li>
          ))}
        </ul>
      </Section>

      {result.assumptions.length > 0 && (
        <Section title="Assumptions">
          <ul className="space-y-2">
            {result.assumptions.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm text-yellow-200/80">
                <span className="shrink-0 text-yellow-500 mt-0.5">⚠</span>
                {a}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {result.missingRequirements.length > 0 && (
        <Section title="Missing Requirements — Clarify with PO/BA">
          <ul className="space-y-2">
            {result.missingRequirements.map((m, i) => (
              <li key={i} className="flex gap-2 text-sm text-orange-300">
                <span className="shrink-0 text-orange-400 mt-0.5">?</span>
                {m}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Risk Assessment">
        <div className="space-y-2">
          {result.riskAssessment.map((r, i) => (
            <div key={i} className={`flex gap-3 items-start p-3 rounded-lg border ${RISK_COLORS[r.level]}`}>
              <span className="text-xs font-bold uppercase tracking-wider shrink-0 pt-0.5">{r.level}</span>
              <div>
                <p className="text-sm font-medium text-slate-200">{r.area}</p>
                <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {result.regressionImpact.length > 0 && (
        <Section title="Regression Impact">
          <ul className="space-y-1">
            {result.regressionImpact.map((r, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="shrink-0 text-slate-600 mt-0.5">→</span>
                {r}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}

function ScenariosTab({ result }: { result: GenerationResult }) {
  const categories = [...new Set(result.testScenarios.map((s) => s.category))]

  return (
    <div className="space-y-5">
      {categories.map((cat) => (
        <Section key={cat} title={cat}>
          <ul className="space-y-2">
            {result.testScenarios.filter((s) => s.category === cat).map((s) => (
              <li key={s.id} className="flex gap-3 text-sm">
                <span className="shrink-0 font-mono text-xs text-slate-500 pt-0.5">{s.id}</span>
                <span className="text-slate-300">{s.scenario}</span>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </div>
  )
}

function CoverageTab({ result }: { result: GenerationResult }) {
  return (
    <div className="space-y-5">
      <Section title="Acceptance Criteria Coverage">
        <div className="space-y-3">
          {result.coverageMatrix.map((c, i) => (
            <div key={i} className="p-3 bg-slate-800/60 rounded-lg border border-slate-800">
              <p className="text-sm text-slate-200 mb-2">{c.criterion}</p>
              <div className="flex flex-wrap gap-1.5">
                {c.testCaseIds.map((id) => (
                  <span key={id} className="text-xs font-mono px-2 py-0.5 bg-blue-900/40 text-blue-300 rounded border border-blue-800">
                    {id}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Automation Recommendations">
        <div className="space-y-2">
          {result.automationRecommendations.map((a, i) => (
            <div key={i} className="flex gap-3 text-sm p-3 bg-slate-800/40 rounded-lg">
              <span className="shrink-0 font-mono text-xs text-green-400 pt-0.5">{a.testCaseId}</span>
              <span className="text-slate-400">{a.justification}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-800">
        {title}
      </h3>
      {children}
    </section>
  )
}
