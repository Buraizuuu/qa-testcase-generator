# QA Assist — AI Test Case Generator

> Generate production-quality test cases from user stories and acceptance criteria using AI.

Built by **Bryle Briones** · QA Engineer @ UCG

---

## What it does

QA Assist takes your feature requirements and generates comprehensive test cases the way a Senior QA Engineer would — not just happy paths, but negative scenarios, boundary values, risk areas, missing requirement gaps, and a full coverage matrix.

**Output includes:**
- Requirement summary & business rules
- Identified gaps (missing requirements to clarify with PO/BA)
- Risk assessment (High / Medium / Low per area)
- High-level test scenarios
- Detailed test cases with steps, test data, preconditions, expected results
- Acceptance criteria → test case coverage matrix
- Regression impact analysis
- Automation recommendations with justification

**Testing techniques applied automatically:**
Boundary Value Analysis · Equivalence Partitioning · Decision Table Testing · State Transition · Error Guessing · Risk-Based Testing · Positive & Negative Testing

---

## Screenshots

> Coming soon

---

## Quick start

### Prerequisites

- [Node.js 18+](https://nodejs.org)
- An AI provider (see [Provider Setup](#provider-setup) below)

### Install & run

```bash
git clone https://github.com/Buraizuuu/qa-testcase-generator.git
cd qa-testcase-generator
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

On first launch, click the **⋯ menu → Settings** and configure your AI provider.

---

## Provider Setup

QA Assist works with any OpenAI-compatible API endpoint. No Anthropic account required.

### 🦙 Ollama — Free, fully local (recommended for privacy)

```bash
# 1. Install Ollama — https://ollama.com
# 2. Start the server
ollama serve

# 3. Pull a model
ollama pull llama3.2          # recommended (4.7GB, good reasoning)
ollama pull qwen2.5-coder:3b  # smaller alternative (1.9GB, faster)
ollama pull llama3.1:8b       # best quality (requires ~8GB RAM)
```

**Settings:** Provider = `Ollama` · Model = `llama3.2` · No API key needed.

---

### ✨ Google Gemini — Free tier (1,500 req/day)

1. Go to [aistudio.google.com](https://aistudio.google.com) → **Get API key**
2. **Settings:** Provider = `Google Gemini` · Model = `gemini-2.0-flash` · Paste key

---

### 🌐 OpenRouter — Access Claude, GPT-4, Gemini from one API

1. Sign up at [openrouter.ai](https://openrouter.ai) → Dashboard → Keys → Create Key
2. **Settings:** Provider = `OpenRouter` · Model = `anthropic/claude-sonnet-4-5`

Free models: `google/gemma-2-9b-it:free` · `mistralai/mistral-7b-instruct:free`

---

### 🔵 Azure OpenAI

**Settings:**
- Provider = `Azure OpenAI`
- Base URL = `https://{resource}.openai.azure.com/openai/deployments/{deployment}`
- Model = your deployment name (e.g. `gpt-4o`)
- API Key = your Azure key

---

## Export formats

| Format | Use case |
|--------|----------|
| **Excel (.xlsx)** | Full export with 5 sheets — test cases, overview, risk, coverage, automation |
| **Azure DevOps CSV** | Import into Azure Test Plans |
| **Jira / Xray CSV** | Import via Xray CSV importer |
| **TestRail CSV** | Import via TestRail CSV importer |
| **Markdown** | Documentation, wikis, PR descriptions |
| **Generic CSV** | Custom import mappings, spreadsheet analysis |

---

## Testing scope

Select which test categories to include in generation:

| Scope | What it covers |
|-------|----------------|
| **Functional** | Happy paths, business rules, user flows |
| **Negative** | Invalid inputs, error handling, permission failures |
| **Boundary** | Min/max values, null/empty, special characters |
| **Integration** | API interactions, database, external services |
| **Security** | Auth, authorization, injection, session handling |
| **Accessibility** | WCAG, keyboard navigation, screen readers, ARIA |
| **Performance** | Load, concurrency, timeouts, large datasets |

---

## Tech stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v3
- **AI:** Provider-agnostic OpenAI-compatible fetch client
- **Exports:** SheetJS (Excel), native CSV, Markdown
- **State:** React hooks + localStorage (no backend)

---

## Privacy

- API keys are stored in **browser localStorage only** — never sent to any server other than your configured AI provider
- No analytics, no telemetry, no data collection
- When using Ollama, all data stays on your local machine

---

## Contributing

Issues and PRs welcome. For major changes, open an issue first to discuss.

---

## License

MIT © Bryle Briones
