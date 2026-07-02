import { useState } from 'react'
import type { GenerateOptions, AppType } from '../lib/types'
import ConfirmDialog from './ConfirmDialog'

interface Props {
  opts: GenerateOptions
  onChange: (opts: GenerateOptions) => void
  onGenerate: () => void
  onClear: () => void
  isGenerating: boolean
}

const APP_TYPES: AppType[] = [
  'Web Application',
  'Mobile App',
  'REST API',
  'Desktop App',
  'Microservice',
  'E-commerce',
  'SaaS Platform',
]

const SCOPE_LABELS: Record<keyof GenerateOptions['scope'], string> = {
  functional: 'Functional',
  security: 'Security',
  accessibility: 'Accessibility',
  performance: 'Performance',
  integration: 'Integration',
  boundary: 'Boundary',
}

export default function InputPanel({ opts, onChange, onGenerate, onClear, isGenerating }: Props) {
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)

  function update<K extends keyof GenerateOptions>(key: K, value: GenerateOptions[K]) {
    onChange({ ...opts, [key]: value })
  }

  function toggleScope(key: keyof GenerateOptions['scope']) {
    onChange({ ...opts, scope: { ...opts.scope, [key]: !opts.scope[key] } })
  }

  const canGenerate = opts.featureName.trim().length > 0 && opts.requirements.trim().length > 10

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Feature name */}
        <div>
          <label htmlFor="feature-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Feature Name <span className="text-red-400" aria-label="required">*</span>
          </label>
          <input
            id="feature-name"
            type="text"
            value={opts.featureName}
            onChange={(e) => update('featureName', e.target.value)}
            placeholder="e.g. User Login, Checkout Flow, Password Reset"
            className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Requirements / User Story / Acceptance Criteria <span className="text-red-400" aria-label="required">*</span>
          </label>
          <div className="flex gap-2 px-3 py-2.5 mb-2 bg-blue-950/40 border border-blue-900/60 rounded-lg">
            <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-xs text-blue-300 leading-relaxed">
              Output quality tracks input quality. A one-line prompt gets generic coverage — list concrete
              acceptance criteria, field names, and business rules to get test cases you'd actually trust.
            </p>
          </div>
          <textarea
            id="requirements"
            value={opts.requirements}
            onChange={(e) => update('requirements', e.target.value)}
            placeholder={`As a registered user, I want to log into the application so that I can access my account.\n\nAcceptance Criteria:\n- AC1: User can log in with valid email and password\n- AC2: Invalid credentials show an error message\n- AC3: Account locks after 5 failed attempts\n- AC4: User can reset their password via email`}
            rows={10}
            className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none font-mono leading-relaxed"
          />
          <p className="mt-1 text-xs text-slate-600">
            {opts.requirements.length} characters
          </p>
        </div>

        {/* App type */}
        <div>
          <label htmlFor="app-type" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Application Type
          </label>
          <div className="relative">
            <select
              id="app-type"
              value={opts.appType}
              onChange={(e) => update('appType', e.target.value as AppType)}
              className="w-full appearance-none bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 pr-9 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[44px] cursor-pointer"
            >
              {APP_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Testing scope */}
        <div>
          <fieldset>
            <legend className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Testing Scope
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SCOPE_LABELS) as (keyof GenerateOptions['scope'])[]).map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition-colors min-h-[44px]"
                >
                  <input
                    type="checkbox"
                    checked={opts.scope[key]}
                    onChange={() => toggleScope(key)}
                    className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-slate-300">{SCOPE_LABELS[key]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Additional context */}
        <div>
          <label htmlFor="context" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Additional Context <span className="text-slate-600 normal-case font-normal">(optional)</span>
          </label>
          <textarea
            id="context"
            value={opts.additionalContext}
            onChange={(e) => update('additionalContext', e.target.value)}
            placeholder="Tech stack, existing bugs, constraints, out-of-scope items..."
            rows={3}
            className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          />
        </div>

        {/* Generate / Clear buttons */}
        <div className="flex gap-2">
          <button
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors min-h-[44px]"
            aria-busy={isGenerating}
          >
            {isGenerating ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Generate Test Cases
              </>
            )}
          </button>
          <button
            onClick={() => setConfirmClearOpen(true)}
            className="px-4 py-3 text-sm font-semibold text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors min-h-[44px]"
          >
            Clear
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear all fields?"
        message="This will reset the form and discard any generated test cases. This can't be undone."
        confirmLabel="Clear"
        onConfirm={() => { setConfirmClearOpen(false); onClear() }}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  )
}
