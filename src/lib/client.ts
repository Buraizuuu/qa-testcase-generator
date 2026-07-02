import type { GenerationResult, GenerateOptions } from './types'
import { SYSTEM_PROMPT, buildUserPrompt } from './systemPrompt'

// ── Provider config ───────────────────────────────────────────────────────────

export interface ProviderConfig {
  provider: ProviderPresetId | 'custom'
  baseUrl: string
  apiKey: string
  model: string
}

export type ProviderPresetId = 'openrouter' | 'ollama' | 'gemini' | 'openai' | 'azure'

export interface ProviderPreset {
  id: ProviderPresetId
  label: string
  baseUrl: string
  defaultModel: string
  modelPlaceholder: string
  apiKeyLabel: string
  apiKeyPlaceholder: string
  apiKeyOptional?: boolean
  note?: string
}

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-sonnet-4-5',
    modelPlaceholder: 'anthropic/claude-sonnet-4-5',
    apiKeyLabel: 'OpenRouter API Key',
    apiKeyPlaceholder: 'sk-or-...',
    note: 'Free tier available. Get a key at openrouter.ai — use google/gemma-2-9b-it:free for zero cost.',
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-2.0-flash',
    modelPlaceholder: 'gemini-2.0-flash',
    apiKeyLabel: 'Gemini API Key',
    apiKeyPlaceholder: 'AIza...',
    note: 'Free tier with generous limits. Get a key at aistudio.google.com.',
  },
  {
    id: 'ollama',
    label: 'Ollama (Local)',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'qwen2.5-coder:3b',
    modelPlaceholder: 'qwen2.5-coder:3b',
    apiKeyLabel: 'API Key',
    apiKeyPlaceholder: 'ollama',
    apiKeyOptional: true,
    note: 'Runs fully offline. Pull a model first: ollama pull llama3.2 (recommended) or use an already-installed model.',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
    modelPlaceholder: 'gpt-4o',
    apiKeyLabel: 'OpenAI API Key',
    apiKeyPlaceholder: 'sk-...',
  },
  {
    id: 'azure',
    label: 'Azure OpenAI',
    baseUrl: '',
    defaultModel: 'gpt-4o',
    modelPlaceholder: 'gpt-4o (deployment name)',
    apiKeyLabel: 'Azure API Key',
    apiKeyPlaceholder: 'your-azure-key',
    note: 'Base URL format: https://{resource}.openai.azure.com/openai/deployments/{deployment}',
  },
]

// ── Persistence ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'qa_assist_provider'

export function loadProviderConfig(): ProviderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ProviderConfig
  } catch { /* ignore */ }
  const preset = PROVIDER_PRESETS[0]
  return { provider: preset.id, baseUrl: preset.baseUrl, apiKey: '', model: preset.defaultModel }
}

export function saveProviderConfig(config: ProviderConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

// ── Ollama models ─────────────────────────────────────────────────────────────

export async function fetchOllamaModels(): Promise<string[]> {
  const res = await fetch('http://localhost:11434/api/tags')
  if (!res.ok) throw new Error(`Ollama returned ${res.status}`)
  const json = await res.json() as { models?: { name: string }[] }
  return (json.models ?? []).map((m) => m.name)
}

// ── Connection check ─────────────────────────────────────────────────────────

export type ConnectionStatus = 'checking' | 'online' | 'offline' | 'unconfigured'

export async function checkConnection(signal?: AbortSignal): Promise<{ status: ConnectionStatus; detail: string }> {
  const config = loadProviderConfig()

  if (!config.baseUrl) return { status: 'unconfigured', detail: 'No provider configured' }

  try {
    // Ollama exposes /api/tags without auth — prefer it over /v1/models
    if (config.provider === 'ollama') {
      const res = await fetch('http://localhost:11434/api/tags', { signal })
      if (!res.ok) return { status: 'offline', detail: `Ollama returned ${res.status}` }
      const json = await res.json() as { models?: { name: string }[] }
      const models = json.models ?? []
      const hasModel = models.some((m) => m.name === config.model || m.name.startsWith(config.model.split(':')[0]))
      if (!hasModel && models.length > 0) {
        return { status: 'online', detail: `Connected — model '${config.model}' not pulled. Run: ollama pull ${config.model}` }
      }
      return { status: 'online', detail: `Connected · ${models.length} model${models.length !== 1 ? 's' : ''} available` }
    }

    // Remote providers require an API key — flag missing key before even hitting the network
    const preset = PROVIDER_PRESETS.find((p) => p.id === config.provider)
    const keyRequired = !preset?.apiKeyOptional
    if (keyRequired && !config.apiKey.trim()) {
      return { status: 'offline', detail: 'API key not set — open Settings to add your key' }
    }

    // For all other OpenAI-compatible providers, call GET /models
    const isAzure = config.provider === 'azure'
    const url = `${config.baseUrl.replace(/\/$/, '')}/models`
    const headers: Record<string, string> = {
      ...(isAzure
        ? { 'api-key': config.apiKey }
        : config.apiKey
          ? { Authorization: `Bearer ${config.apiKey}` }
          : {}),
    }
    const res = await fetch(url, { method: 'GET', headers, signal })
    if (res.status === 401) return { status: 'offline', detail: 'Invalid API key — check your key in Settings' }
    if (!res.ok) return { status: 'offline', detail: `Server returned ${res.status}` }
    return { status: 'online', detail: 'Connected' }
  } catch (err) {
    if ((err as Error).name === 'AbortError') return { status: 'checking', detail: 'Checking...' }
    const msg = (err as Error).message ?? ''
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) {
      return { status: 'offline', detail: config.provider === 'ollama' ? 'Ollama not running — start with: ollama serve' : 'Cannot reach server' }
    }
    return { status: 'offline', detail: msg }
  }
}

// ── Streaming fetch ───────────────────────────────────────────────────────────

export async function generateTestCases(
  opts: GenerateOptions,
  onChunk: (text: string) => void,
  signal: AbortSignal
): Promise<GenerationResult> {
  const config = loadProviderConfig()

  if (!config.baseUrl) throw new Error('No API endpoint configured. Open Settings to configure a provider.')
  if (!config.model) throw new Error('No model configured. Open Settings to set a model name.')

  const isAzure = config.provider === 'azure'
  const url = `${config.baseUrl.replace(/\/$/, '')}/chat/completions`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(isAzure
      ? { 'api-key': config.apiKey }
      : config.apiKey
        ? { Authorization: `Bearer ${config.apiKey}` }
        : {}),
  }

  // OpenRouter requires these for rate limiting compliance
  if (config.provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin
    headers['X-Title'] = 'QA Assist'
  }

  const body = JSON.stringify({
    model: config.model,
    stream: true,
    max_tokens: 8000,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: buildUserPrompt({
          featureName: opts.featureName,
          requirements: opts.requirements,
          appType: opts.appType,
          scope: opts.scope,
          additionalContext: opts.additionalContext,
        }),
      },
    ],
  })

  const res = await fetch(url, { method: 'POST', headers, body, signal })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    let message = `API error ${res.status}`
    try {
      const json = JSON.parse(text)
      message = json?.error?.message ?? json?.message ?? message
    } catch { message = text || message }
    // Friendlier messages for common Ollama errors
    if (config.provider === 'ollama' && message.toLowerCase().includes('not found')) {
      message = `Model '${config.model}' not found in Ollama. Run: ollama pull ${config.model}`
    }
    if (res.status === 401) message = 'Invalid API key. Check your key in Settings.'
    if (res.status === 429) message = 'Rate limit hit. Wait a moment and try again.'
    throw new Error(message)
  }

  if (!res.body) throw new Error('No response body from API.')

  // Read SSE stream
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let raw = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') continue
      try {
        const chunk = JSON.parse(data)
        const delta = chunk?.choices?.[0]?.delta?.content
        if (typeof delta === 'string') {
          raw += delta
          onChunk(raw)
        }
      } catch { /* skip malformed chunks */ }
    }
  }

  // Parse JSON response — try progressively looser extractions before failing
  const text = raw.trim()

  // 1. Direct parse (ideal path)
  try { return normalizeResult(JSON.parse(text)) } catch { /* fall through */ }

  // 2. Strip markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fenceMatch) {
    try { return normalizeResult(JSON.parse(fenceMatch[1])) } catch { /* fall through */ }
  }

  // 3. Extract outermost {...} — handles preamble/postamble text from small models
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try { return normalizeResult(JSON.parse(text.slice(start, end + 1))) } catch { /* fall through */ }
  }

  throw new Error('Failed to parse response as JSON. The model returned unexpected output. Try a larger/smarter model.')
}

// Smaller/local models often omit fields — default them so the UI never crashes on `undefined.length`.
function normalizeResult(data: Partial<GenerationResult>): GenerationResult {
  return {
    requirementSummary: data.requirementSummary ?? '',
    businessRules: data.businessRules ?? [],
    assumptions: data.assumptions ?? [],
    missingRequirements: data.missingRequirements ?? [],
    riskAssessment: data.riskAssessment ?? [],
    testScenarios: data.testScenarios ?? [],
    testCases: data.testCases ?? [],
    coverageMatrix: data.coverageMatrix ?? [],
    regressionImpact: data.regressionImpact ?? [],
    automationRecommendations: data.automationRecommendations ?? [],
  }
}
