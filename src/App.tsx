import { useState, useRef, useCallback } from 'react'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import OutputPanel from './components/OutputPanel'
import { generateTestCases, loadProviderConfig } from './lib/client'
import type { GenerateOptions, GenerationResult } from './lib/types'

const DEFAULT_OPTS: GenerateOptions = {
  featureName: '',
  requirements: '',
  appType: 'Web Application',
  scope: {
    functional: true,
    security: false,
    accessibility: false,
    performance: false,
    integration: false,
    boundary: false,
  },
  additionalContext: '',
}

export default function App() {
  const [opts, setOpts] = useState<GenerateOptions>(DEFAULT_OPTS)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [streamText, setStreamText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const handleGenerate = useCallback(async () => {
    const cfg = loadProviderConfig()
    if (!cfg.baseUrl) {
      setError('No provider configured. Open Settings (top right) to choose a provider.')
      return
    }

    abortRef.current = new AbortController()
    setIsGenerating(true)
    setError(null)
    setResult(null)
    setStreamText('')

    try {
      const data = await generateTestCases(opts, setStreamText, abortRef.current.signal)
      setResult(data)
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setStreamText('')
      } else {
        setError((err as Error).message ?? 'An unexpected error occurred.')
      }
    } finally {
      setIsGenerating(false)
    }
  }, [opts])

  function handleCancel() {
    abortRef.current?.abort()
    setIsGenerating(false)
    setStreamText('')
  }

  function handleClear() {
    abortRef.current?.abort()
    setOpts(DEFAULT_OPTS)
    setResult(null)
    setStreamText('')
    setIsGenerating(false)
    setError(null)
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Input panel — 40% */}
        <aside
          className="w-full md:w-[40%] md:max-w-[480px] border-r border-slate-800 flex flex-col overflow-hidden shrink-0"
          aria-label="Input panel"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/50">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Requirements</h2>
          </div>
          <InputPanel
            opts={opts}
            onChange={setOpts}
            onGenerate={handleGenerate}
            onClear={handleClear}
            isGenerating={isGenerating}
          />
        </aside>

        {/* Output panel — 60% */}
        <main
          className="hidden md:flex flex-col flex-1 overflow-hidden"
          aria-label="Output panel"
          aria-live="polite"
          aria-atomic="false"
        >
          <OutputPanel
            result={result}
            streamText={streamText}
            isGenerating={isGenerating}
            error={error}
            featureName={opts.featureName}
            onCancel={handleCancel}
          />
        </main>
      </div>

      {/* Mobile output (below input, scrollable) */}
      <div className="md:hidden border-t border-slate-800 flex-1 overflow-auto" aria-live="polite">
        {(isGenerating || result || error) && (
          <OutputPanel
            result={result}
            streamText={streamText}
            isGenerating={isGenerating}
            error={error}
            featureName={opts.featureName}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  )
}
