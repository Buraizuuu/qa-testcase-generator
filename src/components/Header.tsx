import { useState, useRef, useEffect } from 'react'
import SettingsModal from './SettingsModal'
import StatusIndicator from './StatusIndicator'
import InfoModal from './InfoModal'

type InfoTab = 'about' | 'docs'

export default function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [infoTab, setInfoTab] = useState<InfoTab>('about')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function openInfo(tab: InfoTab) {
    setInfoTab(tab)
    setInfoOpen(true)
    setMenuOpen(false)
  }

  function handleSettingsClose() {
    setSettingsOpen(false)
    window.dispatchEvent(new StorageEvent('storage', { key: 'qa_assist_provider' }))
  }

  return (
    <>
      <header className="flex items-center justify-between h-14 px-6 border-b border-slate-800 bg-slate-950 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600" aria-hidden="true">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75h6M9 12h6M9 17.25h3.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 3.75h13.5A1.5 1.5 0 0120.25 5.25v13.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-100 leading-none">QA Assist</h1>
            <p className="text-xs text-slate-500 mt-0.5 leading-none">Test Case Generator</p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <StatusIndicator />

          {/* ··· menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-9 h-9 min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              aria-label="More options"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden"
                role="menu"
              >
                <button
                  onClick={() => openInfo('about')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 transition-colors text-left min-h-[44px]"
                  role="menuitem"
                >
                  <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  About this project
                </button>

                <button
                  onClick={() => openInfo('docs')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 transition-colors text-left min-h-[44px]"
                  role="menuitem"
                >
                  <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  Docs &amp; Setup guide
                </button>

                <div className="my-1 border-t border-slate-700/60" role="separator" />

                <button
                  onClick={() => { setSettingsOpen(true); setMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 transition-colors text-left min-h-[44px]"
                  role="menuitem"
                >
                  <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <SettingsModal open={settingsOpen} onClose={handleSettingsClose} />
      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} defaultTab={infoTab} />
    </>
  )
}
