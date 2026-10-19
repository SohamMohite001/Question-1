# Architecture

## Data flow

`client/src/services/api.js` calls the same-origin `/api` routes. The Vite development server proxies these requests to Express. The server loads and validates `server/kb/faqs.json` at startup; no database or runtime FAQ editing is used.

For an ask request, Express validates and trims the input, then `faq.service.js` calls the independent deterministic retrieval service. Retrieval normalizes punctuation/case, tokenizes, removes stop words, applies a small synonym map, scores FAQ question/keyword overlap, and sorts deterministically. Exact question matches are accepted directly. Other matches must exceed the configured threshold and beat the next candidate by the ambiguity margin. Unsupported or ambiguous requests receive the fixed fallback and do not invoke AI.

When all optional provider settings are present and AI is enabled, `ai.service.js` receives only the selected FAQ. It uses an abort timeout and accepts only an exact copy of the stored FAQ answer. Provider failures or altered responses fall back to that stored answer. This makes model output unable to add college-specific facts.

## Trust boundaries

- FAQ JSON and user questions are treated as untrusted data, not as instructions.
- The client renders plain text through React; it does not inject HTML.
- Provider credentials are read only on the backend.
- CORS is limited to configured local client origins; JSON size and ask-request rate are bounded.
- Client-facing unexpected errors do not include stack traces.

## Main modules

- `server/src/validators`: knowledge-base and request schemas.
- `server/src/services/retrieval.service.js`: Express-independent matching and abstention.
- `server/src/services/faq.service.js`: retrieval, optional grounded AI, and response contract.
- `server/src/services/ai.service.js`: optional provider adapter and fallback constant.
- `server/src/routes/faq.routes.js`: FAQ endpoints.
- `client/src/components`: chat layout, messages, suggestions, and composer.
- `server/scripts`: validation and generated Markdown export.