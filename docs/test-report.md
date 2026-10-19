# Test Report

## Automated checks

Executed locally on 2026-10-19 with no live AI credentials:

- `server`: `npm test` — **29 tests passed, 4 test files passed**.
- `server`: `npm run test:live` — **10/10 live API scenarios passed**, including health, 35-FAQ listing, six specific answers, a paraphrase, unsupported input, prompt injection, and ambiguity abstention.
- `server`: `npm run validate:kb` — **35 FAQs valid across 7 categories**.
- `client`: `npm run build` — **passed** with Vite 6.4.4.
- `npm audit --omit=dev` — **0 production dependency vulnerabilities** in both server and client. Install-time audit summaries reported development/transitive findings: server six (3 moderate, 1 high, 2 critical), client seven (2 moderate, 5 high). No forced upgrades were applied.
- Browser: app loaded, backend-connected status and FAQ suggestions appeared, Enter submission returned FAQ001, a suggestion returned FAQ002, Clear chat reset the conversation, and a 395px CSS viewport had no horizontal overflow.

The automated tests cover schema constraints, retrieval normalization/ranking/ambiguity, API validation and fallback, provider output validation, provider failure/timeout, and no model call for unsupported prompts.

## Live and browser checks

Detailed cases and actual results are recorded in [manual-test-plan.md](manual-test-plan.md). Live provider verification is not applicable without provider credentials; the AI adapter is covered with mocked responses.

## Scope

These checks establish classroom-demo behavior only. They do not verify that sample content matches a real college, nor do they establish production security, institutional approval, or live Nemotron access.