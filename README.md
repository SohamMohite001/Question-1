# AI-Powered College Department FAQ

A practical project that turns a structured FAQ JSON file into a small department chatbot. The initial dataset contains 35 illustrative FAQs in seven categories. **All college-specific content is sample information and has not been verified by an institution.** Replace it with approved information before real use.

## Features

- React and Vite chat interface with live FAQ suggestions, loading/error states, retry, clear chat, and mobile layout.
- Express REST API with Zod request and knowledge-base validation.
- Deterministic FAQ retrieval with normalization, keyword matching, ranking, a minimum relevance threshold, and ambiguity abstention.
- Fixed fallback response when no FAQ is a reliable match.
- Optional server-side Nemotron-compatible chat-completions provider. The provider is disabled by default and cannot answer questions without a retrieved FAQ.
- Offline Vitest and Supertest tests.

## Stack and layout

- Frontend: React 18, Vite 6, Tailwind CSS 3, JavaScript ES modules.
- Backend: Node.js, Express 4, Zod, express-rate-limit.
- Knowledge base: JSON; generated Markdown is not separately maintained.
- Tests: Vitest and Supertest.

```text
D:\GenAI
|-- client\                 React app and Vite configuration
|-- server\                 Express API, services, tests and FAQ JSON
|-- docs\                   FAQ export and project documentation
|-- .gitignore
`-- README.md
```

## Prerequisites

- Windows 10/11 and PowerShell
- Node.js 20 or newer and npm
- A modern browser

## Install and run

Open two PowerShell terminals.

Terminal 1, backend:

```powershell
Set-Location D:\GenAI\server
npm install
npm start
```

Terminal 2, frontend:

```powershell
Set-Location D:\GenAI\client
npm install
npm run dev
```

Open <http://localhost:5173>. Vite proxies `/api` to the backend at `http://localhost:3000`.

## Data commands and tests

Run from `D:\GenAI\server`:

```powershell
npm run validate:kb
npm run generate:faq-doc
npm test
npm run test:live
```

Run the production frontend build from `D:\GenAI\client`:

```powershell
npm run build
```

`npm run test:live` expects the backend to already be running at `http://localhost:3000` and checks ten real HTTP scenarios.

Edit `server/kb/faqs.json`, then validate it and regenerate `docs/college-faqs.md`. The JSON is the sole FAQ source of truth. The schema requires at least 25 entries, valid unique FAQ IDs, non-empty fields, valid keywords, and one of the seven declared categories.

## API examples

```powershell
Invoke-RestMethod http://localhost:3000/api/health
Invoke-RestMethod http://localhost:3000/api/faq/list
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/faq/ask -ContentType 'application/json' -Body '{"question":"How can I apply for admission?"}'
```

See [docs/api.md](docs/api.md) for response contracts and failure behavior.

## Optional Nemotron provider

The app works without AI credentials. To enable a compatible OpenAI-style chat-completions provider, copy `server/.env.example` to `server/.env`, then fill in the provider's documented endpoint, model identifier, and API key:

```text
AI_ENABLED=true
NEMOTRON_API_KEY=your-provider-key
NEMOTRON_BASE_URL=provider-documented-base-url
NEMOTRON_MODEL=provider-documented-model-id
```

Do not put secrets in client configuration or commit `.env`. The provider is called only after retrieval finds one unambiguous FAQ. Its answer is accepted only if it exactly matches that FAQ's answer; otherwise the stored FAQ answer is returned. No live provider credentials were configured for this project, so live AI behavior is not claimed as verified.

## Troubleshooting

- If the chat cannot reach the service, confirm the server is listening on port 3000 and the Vite dev server is running on 5173.
- If a port is occupied, stop the process using it or change `PORT` in the backend environment and update `client/vite.config.js` proxy target accordingly.
- If a question receives the fallback, check whether the FAQ actually contains a sufficiently specific question or keyword. Ambiguous queries intentionally abstain.
- After changing FAQ JSON, run validation before starting the server; invalid data prevents startup.

## Limitations and safety

- Answers are only as accurate and current as the supplied knowledge base. Current admissions dates, fees, eligibility, contacts, and employment statistics must come from verified institutional sources.
- Retrieval is deterministic lexical matching, not semantic search; unusual paraphrases can receive the fallback.
- The optional provider is a formatting aid, not an authority. It is tightly checked against the stored answer.
- The public FAQ listing is read-only. There is no admin interface, database, authentication, or production deployment configuration.
- The API limits ask requests to 30 per minute per IP and caps JSON bodies at 16 KB.

## Sample-data disclaimer

**SAMPLE DATA — NOT VERIFIED COLLEGE INFORMATION**. This is a classroom demonstration dataset, not official institutional guidance.