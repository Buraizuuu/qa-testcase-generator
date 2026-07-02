import { useState, useRef, useEffect } from 'react'
import type { GenerationResult } from '../lib/types'
import {
  exportMarkdown,
  exportCsv,
  exportAzureDevOps,
  exportJiraXray,
  exportTestRail,
  exportExcel,
} from '../lib/exporters'

interface Props {
  result: GenerationResult
  featureName: string
}

const OPTIONS = [
  { id: 'excel', label: 'Excel (.xlsx)', sublabel: 'Full export — all sheets', icon: '📊' },
  { id: 'markdown', label: 'Markdown (.md)', sublabel: 'Documentation-ready', icon: '📝' },
  { id: 'csv', label: 'Generic CSV', sublabel: 'All fields, flat format', icon: '📋' },
  { id: 'azure-devops', label: 'Azure DevOps CSV', sublabel: 'Test Plans import format', icon: '🔵' },
  { id: 'jira-xray', label: 'Jira / Xray CSV', sublabel: 'Xray import format', icon: '🟠' },
  { id: 'testrail', label: 'TestRail CSV', sublabel: 'TestRail import format', icon: '🟢' },
] as const

type ExportId = typeof OPTIONS[number]['id']

export default function ExportMenu({ result, featureName }: Props) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const slug = featureName.replace(/\s+/g, '-').toLowerCase() || 'test-cases'

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleExport(id: ExportId) {
    setOpen(false)
    switch (id) {
      case 'excel': exportExcel(result, slug); break
      case 'markdown': exportMarkdown(result, slug); break
      case 'csv': exportCsv(result.testCases, slug); break
      case 'azure-devops': exportAzureDevOps(result.testCases, slug); break
      case 'jira-xray': exportJiraXray(result.testCases, slug); break
      case 'testrail': exportTestRail(result.testCases, slug); break
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors min-h-[44px]"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 py-1"
          role="menu"
          aria-label="Export options"
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleExport(opt.id)}
              className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-slate-700/60 transition-colors text-left min-h-[44px]"
              role="menuitem"
            >
              <span className="text-base mt-0.5" aria-hidden="true">{opt.icon}</span>
              <span>
                <span className="block text-sm text-slate-200">{opt.label}</span>
                <span className="block text-xs text-slate-500">{opt.sublabel}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
