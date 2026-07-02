import { useState } from 'react'
import type { TestCase, Priority, TestCategory } from '../lib/types'

interface Props {
  testCases: TestCase[]
}

const PRIORITY_COLORS: Record<Priority, string> = {
  Critical: 'bg-red-900/50 text-red-300 border-red-800',
  High: 'bg-orange-900/50 text-orange-300 border-orange-800',
  Medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-800',
  Low: 'bg-slate-800 text-slate-400 border-slate-700',
}

const CATEGORY_COLORS: Record<TestCategory, string> = {
  Functional: 'bg-blue-900/50 text-blue-300 border-blue-800',
  Negative: 'bg-red-900/30 text-red-400 border-red-900',
  Boundary: 'bg-purple-900/50 text-purple-300 border-purple-800',
  Integration: 'bg-teal-900/50 text-teal-300 border-teal-800',
  Security: 'bg-rose-900/50 text-rose-300 border-rose-800',
  Accessibility: 'bg-green-900/50 text-green-300 border-green-800',
  Performance: 'bg-amber-900/50 text-amber-300 border-amber-800',
}

const ALL_CATEGORIES: TestCategory[] = [
  'Functional', 'Negative', 'Boundary', 'Integration', 'Security', 'Accessibility', 'Performance',
]

const ALL_PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low']

export default function TestCaseTable({ testCases }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<TestCategory | 'All'>('All')
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All')
  const [filterAutomation, setFilterAutomation] = useState<'All' | 'Yes' | 'No'>('All')
  const [search, setSearch] = useState('')

  const filtered = testCases.filter((tc) => {
    if (filterCategory !== 'All' && tc.category !== filterCategory) return false
    if (filterPriority !== 'All' && tc.priority !== filterPriority) return false
    if (filterAutomation === 'Yes' && !tc.automationCandidate) return false
    if (filterAutomation === 'No' && tc.automationCandidate) return false
    if (search) {
      const q = search.toLowerCase()
      return tc.title.toLowerCase().includes(q) || tc.id.toLowerCase().includes(q) || tc.objective.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search test cases..."
          className="flex-1 min-w-[180px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search test cases"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as TestCategory | 'All')}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          aria-label="Filter by category"
        >
          <option value="All">All Categories</option>
          {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as Priority | 'All')}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          aria-label="Filter by priority"
        >
          <option value="All">All Priorities</option>
          {ALL_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filterAutomation}
          onChange={(e) => setFilterAutomation(e.target.value as 'All' | 'Yes' | 'No')}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          aria-label="Filter by automation candidate"
        >
          <option value="All">All</option>
          <option value="Yes">Automation Candidates</option>
          <option value="No">Manual Only</option>
        </select>
      </div>

      <p className="text-xs text-slate-500">
        Showing {filtered.length} of {testCases.length} test cases
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-sm" role="grid" aria-label="Test cases">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="text-left px-3 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">ID</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Category</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Priority</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Severity</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Auto</th>
              <th className="px-3 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tc) => (
              <>
                <tr
                  key={tc.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/40 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(expandedId === tc.id ? null : tc.id)}
                  role="row"
                  aria-expanded={expandedId === tc.id}
                >
                  <td className="px-3 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">{tc.id}</td>
                  <td className="px-3 py-3 text-slate-200 max-w-[280px]">
                    <span className="line-clamp-2">{tc.title}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${CATEGORY_COLORS[tc.category]}`}>
                      {tc.category}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${PRIORITY_COLORS[tc.priority]}`}>
                      {tc.priority}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-400 text-xs whitespace-nowrap">{tc.severity}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {tc.automationCandidate ? (
                      <span className="text-green-400 text-xs">Yes</span>
                    ) : (
                      <span className="text-slate-600 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <svg
                      className={`w-4 h-4 text-slate-500 transition-transform ${expandedId === tc.id ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </td>
                </tr>

                {expandedId === tc.id && (
                  <tr key={`${tc.id}-detail`} className="bg-slate-900/60">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Objective</p>
                          <p className="text-slate-300">{tc.objective}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Preconditions</p>
                          <p className="text-slate-300">{tc.preconditions}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Test Data</p>
                          <p className="text-slate-300 font-mono text-xs">{tc.testData}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Requirement Ref</p>
                          <p className="text-slate-300">{tc.requirementRef || '—'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Test Steps</p>
                          <ol className="space-y-1.5">
                            {tc.steps.map((step, i) => (
                              <li key={i} className="flex gap-3 text-slate-300">
                                <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-slate-700 text-xs text-slate-400 font-mono">
                                  {i + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Expected Result</p>
                          <p className="text-slate-200 bg-slate-800/60 rounded-lg px-3 py-2">{tc.expectedResult}</p>
                        </div>
                        {tc.notes && (
                          <div className="md:col-span-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Notes</p>
                            <p className="text-slate-400 text-xs">{tc.notes}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">
            No test cases match your filters.
          </div>
        )}
      </div>
    </div>
  )
}
