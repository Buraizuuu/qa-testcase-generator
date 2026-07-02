import type { TestCase, GenerationResult } from './types'
import * as XLSX from 'xlsx'

// ── Helpers ──────────────────────────────────────────────────────────────────

function stepsText(steps: string[]): string {
  return steps.map((s, i) => `${i + 1}. ${s}`).join('\n')
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadText(content: string, filename: string, mimeType: string) {
  downloadBlob(new Blob([content], { type: mimeType }), filename)
}

// ── Markdown ──────────────────────────────────────────────────────────────────

export function exportMarkdown(result: GenerationResult, featureName: string) {
  const lines: string[] = [
    `# Test Cases — ${featureName}`,
    '',
    '## Requirement Summary',
    result.requirementSummary,
    '',
    '## Business Rules',
    ...result.businessRules.map((r) => `- ${r}`),
    '',
    '## Assumptions',
    ...result.assumptions.map((a) => `- ${a}`),
    '',
    '## Missing Requirements',
    ...result.missingRequirements.map((m) => `- ${m}`),
    '',
    '## Risk Assessment',
    ...result.riskAssessment.map((r) => `- **[${r.level}]** ${r.area}: ${r.description}`),
    '',
    '## Test Scenarios',
    ...result.testScenarios.map((s) => `- **${s.id}** (${s.category}): ${s.scenario}`),
    '',
    '## Test Cases',
    '',
    '| ID | Title | Category | Priority | Severity | Automation |',
    '|----|-------|----------|----------|----------|------------|',
    ...result.testCases.map(
      (tc) =>
        `| ${tc.id} | ${tc.title} | ${tc.category} | ${tc.priority} | ${tc.severity} | ${tc.automationCandidate ? 'Yes' : 'No'} |`
    ),
    '',
    ...result.testCases.flatMap((tc) => [
      `### ${tc.id}: ${tc.title}`,
      `**Objective:** ${tc.objective}`,
      `**Feature:** ${tc.feature}`,
      `**Category:** ${tc.category} | **Priority:** ${tc.priority} | **Severity:** ${tc.severity}`,
      `**Preconditions:** ${tc.preconditions}`,
      `**Test Data:** ${tc.testData}`,
      '',
      '**Steps:**',
      ...tc.steps.map((s, i) => `${i + 1}. ${s}`),
      '',
      `**Expected Result:** ${tc.expectedResult}`,
      `**Automation Candidate:** ${tc.automationCandidate ? 'Yes' : 'No'}`,
      tc.notes ? `**Notes:** ${tc.notes}` : '',
      '',
    ]),
    '## Coverage Matrix',
    '',
    '| Acceptance Criterion | Test Case IDs |',
    '|----------------------|---------------|',
    ...result.coverageMatrix.map((c) => `| ${c.criterion} | ${c.testCaseIds.join(', ')} |`),
    '',
    '## Regression Impact',
    ...result.regressionImpact.map((r) => `- ${r}`),
    '',
    '## Automation Recommendations',
    ...result.automationRecommendations.map(
      (a) => `- **${a.testCaseId}**: ${a.justification}`
    ),
  ]

  downloadText(lines.join('\n'), `${featureName}-test-cases.md`, 'text/markdown')
}

// ── Generic flat CSV ──────────────────────────────────────────────────────────

function toCsvRow(fields: string[]): string {
  return fields.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(',')
}

function toCsv(headers: string[], rows: string[][]): string {
  return [toCsvRow(headers), ...rows.map(toCsvRow)].join('\n')
}

export function exportCsv(testCases: TestCase[], featureName: string) {
  const headers = [
    'ID', 'Title', 'Objective', 'Feature', 'Requirement Ref', 'Category',
    'Priority', 'Severity', 'Preconditions', 'Test Data', 'Steps',
    'Expected Result', 'Automation Candidate', 'Notes',
  ]
  const rows = testCases.map((tc) => [
    tc.id, tc.title, tc.objective, tc.feature, tc.requirementRef,
    tc.category, tc.priority, tc.severity, tc.preconditions, tc.testData,
    stepsText(tc.steps), tc.expectedResult,
    tc.automationCandidate ? 'Yes' : 'No', tc.notes,
  ])
  downloadText(toCsv(headers, rows), `${featureName}-test-cases.csv`, 'text/csv')
}

// ── Azure DevOps ──────────────────────────────────────────────────────────────

export function exportAzureDevOps(testCases: TestCase[], featureName: string) {
  const headers = ['ID', 'Work Item Type', 'Title', 'Priority', 'Area Path', 'Steps', 'Expected Result', 'Description']
  const priorityMap: Record<string, string> = { Critical: '1', High: '2', Medium: '3', Low: '4' }
  const rows = testCases.map((tc) => [
    '',
    'Test Case',
    tc.title,
    priorityMap[tc.priority] ?? '3',
    featureName,
    stepsText(tc.steps),
    tc.expectedResult,
    `${tc.objective}\n\nPreconditions: ${tc.preconditions}\nTest Data: ${tc.testData}`,
  ])
  downloadText(toCsv(headers, rows), `${featureName}-azure-devops.csv`, 'text/csv')
}

// ── Jira / Xray ──────────────────────────────────────────────────────────────

export function exportJiraXray(testCases: TestCase[], featureName: string) {
  const headers = [
    'Issue Type', 'Summary', 'Description', 'Priority', 'Labels',
    'Test Type', 'Test Steps (Action)', 'Test Steps (Expected Result)',
  ]
  const priorityMap: Record<string, string> = { Critical: 'Highest', High: 'High', Medium: 'Medium', Low: 'Low' }
  const rows = testCases.map((tc) => [
    'Test',
    tc.title,
    `${tc.objective}\n\nPreconditions: ${tc.preconditions}\nTest Data: ${tc.testData}\nCategory: ${tc.category}`,
    priorityMap[tc.priority] ?? 'Medium',
    `${featureName} ${tc.category}`,
    'Manual',
    stepsText(tc.steps),
    tc.expectedResult,
  ])
  downloadText(toCsv(headers, rows), `${featureName}-jira-xray.csv`, 'text/csv')
}

// ── TestRail ──────────────────────────────────────────────────────────────────

export function exportTestRail(testCases: TestCase[], featureName: string) {
  const headers = [
    'Title', 'Section', 'Type', 'Priority', 'Estimate',
    'References', 'Preconditions', 'Steps', 'Expected Result',
  ]
  const priorityMap: Record<string, string> = { Critical: '1 - Critical', High: '2 - High', Medium: '3 - Medium', Low: '4 - Low' }
  const typeMap: Record<string, string> = {
    Functional: 'Functional', Negative: 'Negative', Boundary: 'Boundary Value Analysis',
    Integration: 'Integration', Security: 'Security', Accessibility: 'Accessibility', Performance: 'Performance',
  }
  const rows = testCases.map((tc) => [
    tc.title,
    `${featureName} / ${tc.category}`,
    typeMap[tc.category] ?? 'Other',
    priorityMap[tc.priority] ?? '3 - Medium',
    '',
    tc.requirementRef,
    tc.preconditions,
    stepsText(tc.steps),
    tc.expectedResult,
  ])
  downloadText(toCsv(headers, rows), `${featureName}-testrail.csv`, 'text/csv')
}

// ── Excel ─────────────────────────────────────────────────────────────────────

export function exportExcel(result: GenerationResult, featureName: string) {
  const wb = XLSX.utils.book_new()

  // Sheet 1: Test Cases
  const tcData = [
    ['ID', 'Title', 'Objective', 'Feature', 'Requirement Ref', 'Category',
     'Priority', 'Severity', 'Preconditions', 'Test Data', 'Steps',
     'Expected Result', 'Automation Candidate', 'Notes'],
    ...result.testCases.map((tc) => [
      tc.id, tc.title, tc.objective, tc.feature, tc.requirementRef,
      tc.category, tc.priority, tc.severity, tc.preconditions, tc.testData,
      stepsText(tc.steps), tc.expectedResult,
      tc.automationCandidate ? 'Yes' : 'No', tc.notes,
    ]),
  ]
  const ws1 = XLSX.utils.aoa_to_sheet(tcData)
  ws1['!cols'] = [
    { wch: 8 }, { wch: 50 }, { wch: 40 }, { wch: 20 }, { wch: 15 },
    { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 40 }, { wch: 30 },
    { wch: 60 }, { wch: 40 }, { wch: 12 }, { wch: 30 },
  ]
  XLSX.utils.book_append_sheet(wb, ws1, 'Test Cases')

  // Sheet 2: Overview
  const overviewData = [
    ['REQUIREMENT SUMMARY'],
    [result.requirementSummary],
    [],
    ['BUSINESS RULES'],
    ...result.businessRules.map((r) => [r]),
    [],
    ['ASSUMPTIONS'],
    ...result.assumptions.map((a) => [a]),
    [],
    ['MISSING REQUIREMENTS'],
    ...result.missingRequirements.map((m) => [m]),
  ]
  const ws2 = XLSX.utils.aoa_to_sheet(overviewData)
  ws2['!cols'] = [{ wch: 80 }]
  XLSX.utils.book_append_sheet(wb, ws2, 'Overview')

  // Sheet 3: Risk Assessment
  const riskData = [
    ['Area', 'Risk Level', 'Description'],
    ...result.riskAssessment.map((r) => [r.area, r.level, r.description]),
  ]
  const ws3 = XLSX.utils.aoa_to_sheet(riskData)
  ws3['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 60 }]
  XLSX.utils.book_append_sheet(wb, ws3, 'Risk Assessment')

  // Sheet 4: Coverage Matrix
  const coverageData = [
    ['Acceptance Criterion', 'Test Case IDs'],
    ...result.coverageMatrix.map((c) => [c.criterion, c.testCaseIds.join(', ')]),
  ]
  const ws4 = XLSX.utils.aoa_to_sheet(coverageData)
  ws4['!cols'] = [{ wch: 60 }, { wch: 30 }]
  XLSX.utils.book_append_sheet(wb, ws4, 'Coverage Matrix')

  // Sheet 5: Automation
  const autoData = [
    ['Test Case ID', 'Justification'],
    ...result.automationRecommendations.map((a) => [a.testCaseId, a.justification]),
  ]
  const ws5 = XLSX.utils.aoa_to_sheet(autoData)
  ws5['!cols'] = [{ wch: 12 }, { wch: 80 }]
  XLSX.utils.book_append_sheet(wb, ws5, 'Automation Recommendations')

  XLSX.writeFile(wb, `${featureName}-test-cases.xlsx`)
}
