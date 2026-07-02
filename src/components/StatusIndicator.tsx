import { useState, useEffect, useCallback, useRef } from 'react'
import { checkConnection, loadProviderConfig, PROVIDER_PRESETS, type ConnectionStatus } from '../lib/client'

const DOT: Record<ConnectionStatus, string> = {
  checking:     'bg-slate-500 animate-pulse',
  online:       'bg-green-400',
  offline:      'bg-red-500',
  unconfigured: 'bg-slate-600',
}

const LABEL: Record<ConnectionStatus, string> = {
  checking:     'Checking...',
  online:       'Online',
  offline:      'Offline',
  unconfigured: 'Not configured',
}

const TEXT: Record<ConnectionStatus, string> = {
  checking:     'text-slate-400',
  online:       'text-green-400',
  offline:      'text-red-400',
  unconfigured: 'text-slate-500',
}

export default function StatusIndicator() {
  const [status, setStatus] = useState<ConnectionStatus>('checking')
  const [detail, setDetail] = useState('Checking...')
  const [showTooltip, setShowTooltip] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const ping = useCallback(async () => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setStatus('checking')
    const result = await checkConnection(abortRef.current.signal)
    setStatus(result.status)
    setDetail(result.detail)
  }, [])

  // Ping on mount
  useEffect(() => {
    ping()
    return () => abortRef.current?.abort()
  }, [ping])

  // Re-ping when localStorage changes (Settings saved in another tab or same page)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'qa_assist_provider') ping()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [ping])

  const config = loadProviderConfig()
  const preset = PROVIDER_PRESETS.find((p) => p.id === config.provider)
  const providerLabel = preset?.label ?? 'Custom'

  return (
    <div className="relative flex items-center">
      <button
        onClick={ping}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px]"
        aria-label={`Provider status: ${LABEL[status]}. Click to recheck.`}
      >
        {/* Dot with ping animation when online */}
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          {status === 'online' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${DOT[status]}`} />
        </span>

        <span className={`text-xs font-medium hidden sm:block ${TEXT[status]}`}>
          {providerLabel}
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          role="tooltip"
          className="absolute right-0 top-full mt-1 z-30 w-64 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg shadow-xl"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`relative flex h-2 w-2 shrink-0`} aria-hidden="true">
              {status === 'online' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${DOT[status]}`} />
            </span>
            <span className={`text-xs font-semibold ${TEXT[status]}`}>{LABEL[status]}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{detail}</p>
          {config.model && (
            <p className="text-xs text-slate-600 mt-1 font-mono">{config.model}</p>
          )}
          <p className="text-xs text-slate-600 mt-1.5">Click to recheck</p>
        </div>
      )}
    </div>
  )
}
