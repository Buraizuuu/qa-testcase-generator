export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
export type Severity = 'Critical' | 'Major' | 'Minor' | 'Trivial'
export type TestCategory =
  | 'Functional'
  | 'Negative'
  | 'Boundary'
  | 'Integration'
  | 'Security'
  | 'Accessibility'
  | 'Performance'

export interface RiskItem {
  area: string
  level: 'High' | 'Medium' | 'Low'
  description: string
}

export interface TestScenario {
  id: string
  scenario: string
  category: string
}

export interface TestCase {
  id: string
  title: string
  objective: string
  feature: string
  requirementRef: string
  category: TestCategory
  priority: Priority
  severity: Severity
  preconditions: string
  testData: string
  steps: string[]
  expectedResult: string
  automationCandidate: boolean
  notes: string
}

export interface CoverageItem {
  criterion: string
  testCaseIds: string[]
}

export interface AutomationRecommendation {
  testCaseId: string
  justification: string
}

export interface GenerationResult {
  requirementSummary: string
  businessRules: string[]
  assumptions: string[]
  missingRequirements: string[]
  riskAssessment: RiskItem[]
  testScenarios: TestScenario[]
  testCases: TestCase[]
  coverageMatrix: CoverageItem[]
  regressionImpact: string[]
  automationRecommendations: AutomationRecommendation[]
}

export type AppType =
  | 'Web Application'
  | 'Mobile App'
  | 'REST API'
  | 'Desktop App'
  | 'Microservice'
  | 'E-commerce'
  | 'SaaS Platform'

export type ExportFormat = 'azure-devops' | 'jira-xray' | 'testrail' | 'markdown' | 'excel' | 'csv'

export interface GenerateOptions {
  featureName: string
  requirements: string
  appType: AppType
  scope: {
    functional: boolean
    security: boolean
    accessibility: boolean
    performance: boolean
    integration: boolean
    boundary: boolean
  }
  additionalContext: string
}
