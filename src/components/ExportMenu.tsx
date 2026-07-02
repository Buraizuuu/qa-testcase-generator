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

type ExportId = 'excel' | 'markdown' | 'csv' | 'azure-devops' | 'jira-xray' | 'testrail'

interface Option {
  id: ExportId
  label: string
  sublabel: string
  icon: React.ReactNode
  accent: string
}

// ── SVG icons — consistent 1.75px stroke, 16×16 viewBox ──────────────────────

const IconExcel = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
    <rect x="1" y="1" width="14" height="14" rx="2.5" fill="#166534" />
    <path d="M4 5l2.5 3L4 11M8.5 5H12M8.5 8H11M8.5 11H12" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconMarkdown = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
    <rect x="1" y="1" width="14" height="14" rx="2.5" fill="#1e3a5f" />
    <path d="M3 5.5v5M3 8h2.5l1.5-2v4M10 10.5V5.5l1.5 2 1.5-2v5" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconCSV = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
    <rect x="1" y="1" width="14" height="14" rx="2.5" fill="#374151" />
    <path d="M4 5h8M4 8h8M4 11h5" stroke="#9ca3af" strokeWidth="1.25" strokeLinecap="round"/>
    <path d="M4 6.5v1" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6.5 6.5v1" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 6.5v1" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const IconAzure = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
    <rect x="1" y="1" width="14" height="14" rx="2.5" fill="#0078d4" />
    <path d="M4.5 11L7 5l2 3.5L11.5 5" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 11h10" stroke="white" strokeWidth="1.25" strokeLinecap="round"/>
  </svg>
)

const IconJira = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
    <rect x="1" y="1" width="14" height="14" rx="2.5" fill="#0052cc" />
    <path d="M8 3.5L5 6.5l3 3 3-3L8 3.5z" fill="white" opacity="0.6"/>
    <path d="M8 6.5L5 9.5l3 3 3-3L8 6.5z" fill="white"/>
  </svg>
)

const IconTestRail = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
    <rect x="1" y="1" width="14" height="14" rx="2.5" fill="#65a30d" />
    <path d="M4 8.5l2.5 2.5L12 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const OPTIONS: Option[] = [
  {
    id: 'excel',
    label: 'Excel (.xlsx)',
    sublabel: 'Full export — all sheets',
    icon: <IconExcel />,
    accent: 'hover:bg-green-900/20',
  },
  {
    id: 'markdown',
    label: 'Markdown (.md)',
    sublabel: 'Documentation-ready',
    icon: <IconMarkdown />,
    accent: 'hover:bg-blue-900/20',
  },
  {
    id: 'csv',
    label: 'Generic CSV',
    sublabel: 'All fields, flat format',
    icon: <IconCSV />,
    accent: 'hover:bg-slate-700/50',
  },
  {
    id: 'azure-devops',
    label: 'Azure DevOps',
    sublabel: 'Test Plans import format',
    icon: <IconAzure />,
    accent: 'hover:bg-sky-900/20',
  },
  {
    id: 'jira-xray',
    label: 'Jira / Xray',
    sublabel: 'Xray import format',
    icon: <IconJira />,
    accent: 'hover:bg-blue-900/20',
  },
  {
    id: 'testrail',
    label: 'TestRail',
    sublabel: 'TestRail import format',
    icon: <IconTestRail />,
    accent: 'hover:bg-lime-900/20',
  },
]

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
      case 'excel':        exportExcel(result, slug); break
      case 'markdown':     exportMarkdown(result, slug); break
      case 'csv':          exportCsv(result.testCases, slug); break
      case 'azure-devops': exportAzureDevOps(result.testCases, slug); break
      case 'jira-xray':    exportJiraXray(result.testCases, slug); break
      case 'testrail':     exportTestRail(result.testCases, slug); break
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2 px-3.5 py-2 min-h-[44px]
          text-sm font-medium rounded-lg border transition-all
          ${open
            ? 'bg-slate-700 border-slate-600 text-slate-100 shadow-lg'
            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600 hover:text-slate-100'
          }
        `}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Export test cases"
      >
        <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <span>Export</span>
        <svg
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-56 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-20 overflow-hidden"
          role="menu"
          aria-label="Export options"
        >
          <div className="px-3 pt-2.5 pb-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Export as</p>
          </div>

          <div className="p-1.5 space-y-0.5">
            {OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleExport(opt.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors text-left min-h-[44px] ${opt.accent}`}
                role="menuitem"
              >
                <span className="shrink-0">{opt.icon}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-slate-200 leading-tight">{opt.label}</span>
                  <span className="block text-xs text-slate-500 leading-tight mt-0.5">{opt.sublabel}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
