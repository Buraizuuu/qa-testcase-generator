import { useState, useEffect } from 'react'
import {
  PROVIDER_PRESETS,
  loadProviderConfig,
  saveProviderConfig,
  type ProviderConfig,
  type ProviderPresetId,
} from '../lib/client'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SettingsModal({ open, onClose }: Props) {
  const [config, setConfig] = useState<ProviderConfig>(loadProviderConfig)
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      setConfig(loadProviderConfig())
      setSaved(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const preset = PROVIDER_PRESETS.find((p) => p.id === config.provider)

  function selectPreset(id: ProviderPresetId) {
    const p = PROVIDER_PRESETS.find((x) => x.id === id)!
    setConfig((prev) => ({
      provider: id,
      baseUrl: p.baseUrl,
      apiKey: prev.provider === id ? prev.apiKey : '',
      model: p.defaultModel,
    }))
  }

  function update(patch: Partial<ProviderConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }))
  }

  function handleSave() {
    saveProviderConfig(config)
    setSaved(true)
    setTimeout(() => onClose(), 600)
  }

  const canSave = config.baseUrl.trim().length > 0 && config.model.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 id="settings-title" className="text-base font-semibold text-slate-100">AI Provider Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close settings"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Provider tiles */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Provider</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROVIDER_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectPreset(p.id)}
                  className={`flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-colors min-h-[44px] ${
                    config.provider === p.id
                      ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  <span className="text-sm font-medium">{p.label}</span>
                </button>
              ))}
              <button
                onClick={() => update({ provider: 'custom' })}
                className={`flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-colors min-h-[44px] ${
                  config.provider === 'custom'
                    ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                <span className="text-sm font-medium">Custom</span>
              </button>
            </div>
          </div>

          {/* Note */}
          {preset?.note && (
            <div className="flex gap-2 px-3 py-2.5 bg-blue-950/40 border border-blue-900/60 rounded-lg">
              <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p className="text-xs text-blue-300 leading-relaxed">{preset.note}</p>
            </div>
          )}

          {/* Base URL (custom / azure) */}
          {(config.provider === 'custom' || config.provider === 'azure') && (
            <div>
              <label htmlFor="base-url" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Base URL
              </label>
              <input
                id="base-url"
                type="url"
                value={config.baseUrl}
                onChange={(e) => update({ baseUrl: e.target.value })}
                placeholder="https://your-endpoint/v1"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Model
            </label>
            <input
              id="model"
              type="text"
              value={config.model}
              onChange={(e) => update({ model: e.target.value })}
              placeholder={preset?.modelPlaceholder ?? 'model-name'}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="api-key" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              {preset?.apiKeyLabel ?? 'API Key'}
              {preset?.apiKeyOptional && <span className="ml-1 text-slate-600 normal-case font-normal">(optional)</span>}
            </label>
            <div className="relative">
              <input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => update({ apiKey: e.target.value })}
                placeholder={preset?.apiKeyPlaceholder ?? 'your-api-key'}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-200 min-w-[32px] min-h-[32px] flex items-center justify-center"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-600">Stored in browser localStorage only.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors min-h-[44px]"
          >
            {saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
