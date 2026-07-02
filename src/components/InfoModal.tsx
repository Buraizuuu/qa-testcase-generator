import { useState, useEffect } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  defaultTab?: 'about' | 'docs'
}

type Tab = 'about' | 'docs'

export default function InfoModal({ open, onClose, defaultTab = 'about' }: Props) {
  const [tab, setTab] = useState<Tab>(defaultTab)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Sync tab when defaultTab changes (e.g. opening from menu)
  useEffect(() => { if (open) setTab(defaultTab) }, [open, defaultTab])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-title"
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="flex gap-1" role="tablist">
            {(['about', 'docs'] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize min-h-[36px] ${
                  tab === t
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t === 'about' ? 'About' : 'Docs & Setup'}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6" role="tabpanel">
          {tab === 'about' ? <AboutTab /> : <DocsTab />}
        </div>
      </div>
    </div>
  )
}

// ── About ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    title: 'Senior QA reasoning',
    desc: 'Applies BVA, EP, decision tables, risk-based testing',
    icon: (
      <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
  },
  {
    title: '10+ test categories',
    desc: 'Functional, negative, boundary, security, accessibility & more',
    icon: (
      <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: '6 export formats',
    desc: 'Excel, Azure DevOps, Jira/Xray, TestRail, Markdown, CSV',
    icon: (
      <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    title: 'Provider agnostic',
    desc: 'Works with Ollama, Gemini, OpenRouter, OpenAI, Azure',
    icon: (
      <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
]

function AboutTab() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 id="info-title" className="text-xl font-bold text-slate-100">QA Assist</h2>
          <p className="text-sm text-slate-400 mt-0.5">AI-powered Test Case Generator</p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-800">v1.0.0</span>
        </div>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed">
        QA Assist is a personal productivity tool that uses AI to generate production-quality software test cases
        from user stories, acceptance criteria, or plain requirements. It thinks and reasons like a Senior QA
        Engineer — performing risk analysis, identifying gaps, and covering functional, negative, boundary,
        security, accessibility, integration, and performance scenarios.
      </p>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0" aria-hidden="true">
              {f.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">{f.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Creator */}
      <div className="border-t border-slate-800 pt-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Creator</p>
        <a
          href="https://bryle-briones.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-800 hover:border-slate-600 hover:bg-slate-800/70 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            BB
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Bryle Briones</p>
            <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors truncate">bryle-briones.vercel.app</p>
          </div>
          <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>

      {/* Tech stack */}
      <div className="border-t border-slate-800 pt-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Built with</p>
        <div className="flex flex-wrap gap-2">
          {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'SheetJS', 'Ollama / OpenRouter / Gemini'].map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 bg-slate-800 text-slate-400 rounded-md border border-slate-700">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Docs ──────────────────────────────────────────────────────────────────────

function DocsTab() {
  return (
    <div className="space-y-8 text-sm">
      <Section title="How It Works">
        <p className="text-slate-400 leading-relaxed">
          QA Assist sends your requirements to an AI model with a carefully engineered system prompt that
          instructs it to reason like a Senior QA Engineer. The model performs requirement analysis,
          identifies risks and gaps, then generates structured test cases covering all relevant testing
          dimensions. The response is returned as structured JSON and rendered into an interactive UI
          with filtering and multi-format export.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {[
            ['1', 'You enter a feature name + requirements / acceptance criteria'],
            ['2', 'Select testing scope (functional, security, boundary, etc.)'],
            ['3', 'AI analyzes requirements, identifies gaps, generates test cases'],
            ['4', 'Review test cases in the tabbed output panel'],
            ['5', 'Export to Azure DevOps, Jira, TestRail, Excel, or Markdown'],
          ].map(([n, text]) => (
            <div key={n} className="flex gap-3 items-start">
              <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-900/60 text-blue-300 text-xs font-bold">{n}</span>
              <span className="text-slate-300">{text}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="🦙 Ollama (Free · Fully Local)">
        <p className="text-slate-400 leading-relaxed mb-3">
          Run AI completely offline on your machine. No API key, no internet required after setup.
        </p>
        <Steps steps={[
          { label: 'Install Ollama', code: '# Download from https://ollama.com\n# Windows: run the installer\n# macOS:   brew install ollama' },
          { label: 'Start Ollama server', code: 'ollama serve' },
          { label: 'Pull a model', code: '# Recommended for QA (good reasoning, 4.7GB)\nollama pull llama3.2\n\n# Already installed (smaller, faster)\nollama pull qwen2.5-coder:3b\n\n# Best quality (requires ~8GB RAM)\nollama pull llama3.1:8b' },
          { label: 'Configure in Settings', code: 'Provider: Ollama\nModel:    llama3.2\n(no API key needed)' },
        ]} />
        <Tip text="llama3.2 gives the best balance of quality and speed for test case generation. qwen2.5-coder:3b works but was designed for code, not QA writing." />
      </Section>

      <Section title="🌐 OpenRouter (Free tier available)">
        <p className="text-slate-400 leading-relaxed mb-3">
          OpenRouter proxies 200+ models including Claude, GPT-4, and Gemini. Free models available with no credit card.
        </p>
        <Steps steps={[
          { label: 'Create account', code: '# Go to https://openrouter.ai\n# Sign up with GitHub or Google' },
          { label: 'Get API key', code: '# Dashboard → Keys → Create Key\n# Starts with: sk-or-...' },
          { label: 'Configure in Settings', code: 'Provider: OpenRouter\nModel:    anthropic/claude-sonnet-4-5\n\n# Free models (no credits needed):\n# google/gemma-2-9b-it:free\n# mistralai/mistral-7b-instruct:free' },
        ]} />
        <Tip text="For best QA results use anthropic/claude-sonnet-4-5. For free tier use google/gemma-2-9b-it:free — quality is lower but it works." />
      </Section>

      <Section title="✨ Google Gemini (Free tier)">
        <p className="text-slate-400 leading-relaxed mb-3">
          Gemini has a generous free tier (1,500 requests/day on Flash). No credit card required.
        </p>
        <Steps steps={[
          { label: 'Get API key', code: '# Go to https://aistudio.google.com\n# Click "Get API key" → Create API key' },
          { label: 'Configure in Settings', code: 'Provider: Google Gemini\nModel:    gemini-2.0-flash\nAPI Key:  AIza...' },
        ]} />
      </Section>

      <Section title="🔵 Azure OpenAI">
        <p className="text-slate-400 leading-relaxed mb-3">
          If your company has an Azure OpenAI deployment, use it here.
        </p>
        <Steps steps={[
          { label: 'Get connection details from your Azure portal', code: '# Azure Portal → your OpenAI resource\n# Keys and Endpoint → copy Key 1\n# Deployments → note your deployment name' },
          { label: 'Configure in Settings', code: 'Provider: Azure OpenAI\nBase URL: https://{resource}.openai.azure.com/openai/deployments/{deployment}\nModel:    gpt-4o  (your deployment name)\nAPI Key:  your-azure-key-1' },
        ]} />
      </Section>

      <Section title="Understanding the Output">
        <p className="text-slate-400 leading-relaxed mb-4">
          After generation, the right panel shows four tabs and a filterable test case table.
        </p>
        <div className="space-y-3 mb-4">
          {[
            {
              tab: 'Overview',
              color: 'bg-slate-700 text-slate-300',
              desc: 'High-level summary of the analysis: requirement summary, extracted business rules, identified assumptions, missing requirements the AI flagged (gaps to clarify with your PO/BA), and a risk assessment table showing which areas are High / Medium / Low risk.',
            },
            {
              tab: 'Scenarios',
              color: 'bg-blue-900/60 text-blue-300',
              desc: 'The high-level test scenarios before they are expanded into detailed test cases. Useful for a quick review of coverage and for sharing with developers early. Each scenario maps to a testing category (Functional, Security, etc.).',
            },
            {
              tab: 'Test Cases',
              color: 'bg-blue-900/60 text-blue-300',
              desc: 'The full detailed test case table. Each row includes ID, title, category, priority, severity, and automation flag. Click any row to expand it and see preconditions, test data, step-by-step instructions, and expected result. Use the search box and dropdowns to filter by category, priority, or automation suitability.',
            },
            {
              tab: 'Coverage',
              color: 'bg-slate-700 text-slate-300',
              desc: 'The acceptance criteria → test case traceability matrix. Each acceptance criterion from your requirements is mapped to the test case IDs that cover it. Also includes regression impact areas and automation recommendations with justification per test case.',
            },
          ].map(({ tab, color, desc }) => (
            <div key={tab} className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
              <p className="flex items-center gap-2 mb-1.5">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${color}`}>{tab}</span>
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
          <p className="text-sm font-medium text-slate-200 mb-1">What is the "Automate?" column?</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Automate?</strong> = Automation Candidate. The AI evaluates each test case and flags whether it is worth automating.{' '}
            <span className="text-green-400 font-medium">Yes</span> means the test is deterministic, stable, and high-value — good ROI to automate.{' '}
            <span className="text-slate-500 font-medium">No</span> means the test is better suited for manual execution (e.g. exploratory, subjective UX checks, one-off scenarios).
            Use the <em>Automation Candidates</em> filter in the Test Cases tab to isolate them, and the Coverage tab for per-case justification.
          </p>
        </div>
      </Section>

      <Section title="Common Issues">
        <div className="space-y-3">
          {[
            {
              problem: '"Generation Failed — Failed to parse response as JSON"',
              cause: 'The model returned text outside the JSON (preamble, explanation, or markdown fences). Usually happens with small local models.',
              fix: 'Switch to a larger model. For Ollama: llama3.2 (4.7GB) is the minimum recommended. qwen2.5-coder:3b is too small for reliable structured output. For free cloud: use gemini-2.0-flash or openrouter\'s google/gemma-2-9b-it:free.',
            },
            {
              problem: '"Model \'x\' not found in Ollama"',
              cause: 'The model name in Settings doesn\'t match any model you\'ve pulled.',
              fix: 'Run ollama list to see installed models. Pull the one you want: ollama pull llama3.2. Then update the Model field in Settings to match exactly.',
            },
            {
              problem: '"API key not set" / shows Offline with no key entered',
              cause: 'Remote providers (OpenRouter, Gemini, OpenAI, Azure) require an API key before a connection can be established.',
              fix: 'Open Settings → paste your API key. The status indicator re-checks automatically when you close Settings.',
            },
            {
              problem: '"Ollama not running" / Offline on Ollama provider',
              cause: 'The Ollama server is not running on your machine.',
              fix: 'Open a terminal and run: ollama serve. Keep the terminal open while using QA Assist. On Windows, Ollama may already be running in the system tray after installation.',
            },
            {
              problem: 'Test cases are shallow or missing categories',
              cause: 'The model is too small to follow the full system prompt reliably, or the testing scope is too narrow.',
              fix: 'Use a smarter model (llama3.2, gemini-2.0-flash, claude-sonnet-4-5). Also make sure you\'ve selected all relevant scope checkboxes in the input panel.',
            },
            {
              problem: 'Response cuts off mid-generation',
              cause: 'The model hit its max token limit before finishing the JSON.',
              fix: 'Reduce the scope (uncheck some test categories) to generate fewer test cases, or switch to a model with a larger context window.',
            },
          ].map(({ problem, cause, fix }) => (
            <details key={problem} className="group bg-slate-800/50 rounded-lg border border-slate-800 overflow-hidden">
              <summary className="flex items-center justify-between px-3 py-2.5 cursor-pointer text-sm font-medium text-slate-200 hover:text-white list-none">
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  {problem}
                </span>
                <svg className="w-4 h-4 text-slate-500 shrink-0 ml-2 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-3 pb-3 space-y-2 border-t border-slate-700/50 pt-2.5">
                <p className="text-xs text-slate-400"><span className="text-slate-500 font-medium">Why: </span>{cause}</p>
                <p className="text-xs text-slate-300"><span className="text-green-400 font-medium">Fix: </span>{fix}</p>
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section title="Export Formats">
        <div className="space-y-2">
          {[
            ['Excel (.xlsx)', 'Full export with 5 sheets: Test Cases, Overview, Risk Assessment, Coverage Matrix, Automation Recommendations'],
            ['Azure DevOps CSV', 'Import into Azure Test Plans. Work Item Type = Test Case, with priority mapping (Critical→1, High→2...)'],
            ['Jira / Xray CSV', 'Import via Xray CSV importer. Issue Type = Test, with step actions and expected results'],
            ['TestRail CSV', 'Import via TestRail CSV importer. Includes section hierarchy, type, priority, preconditions'],
            ['Markdown', 'Full report in Markdown: summary, business rules, test cases table, coverage matrix'],
            ['Generic CSV', 'All fields in a flat CSV — useful for custom import mappings or spreadsheet analysis'],
          ].map(([name, desc]) => (
            <div key={name} className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
              <p className="font-medium text-slate-200">{name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-base font-semibold text-slate-100 mb-3">{title}</h3>
      {children}
    </section>
  )
}

function Steps({ steps }: { steps: { label: string; code: string }[] }) {
  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <div key={i}>
          <p className="text-xs font-semibold text-slate-400 mb-1.5">
            <span className="text-blue-500 mr-1.5">{i + 1}.</span>{s.label}
          </p>
          <pre className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
            {s.code}
          </pre>
        </div>
      ))}
    </div>
  )
}

function Tip({ text }: { text: string }) {
  return (
    <div className="mt-3 flex gap-2 px-3 py-2.5 bg-amber-950/30 border border-amber-900/50 rounded-lg">
      <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
      <p className="text-xs text-amber-300/80 leading-relaxed">{text}</p>
    </div>
  )
}
