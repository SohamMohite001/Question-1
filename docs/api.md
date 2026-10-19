# API

Base URL for local backend calls: `http://localhost:3000`. In the Vite client, the same routes are available under `/api`.

## `GET /api/health`

Returns HTTP 200 while the server is running:

```json
{"success":true,"status":"ok"}
```

## `GET /api/faq/list`

Returns HTTP 200 and the actual dataset, including count and sample metadata:

```json
{
  "success": true,
  "faqCount": 35,
  "metadata": {"dataType":"sample","verified":false},
  "faqs": [{"id":"FAQ001","category":"Admissions","question":"...","answer":"...","keywords":["..."]}]
}
```

## `POST /api/faq/ask`

Content type is `application/json`. `question` must be a trimmed, non-empty string of at most 500 characters; unknown body properties are rejected.

```json
{"question":"How can I apply for admission?"}
```

Matched retrieval response:

```json
{
  "success": true,
  "answer": "Review the college's official admission instructions and submit an application through the process it specifies. This sample FAQ does not provide an application link or dates.",
  "sourceFaqIds": ["FAQ001"],
  "answeredFromKnowledgeBase": true,
  "mode": "retrieval"
}
```

Unsupported or ambiguous questions return HTTP 200 because the request was processed successfully, but `answeredFromKnowledgeBase` is false, `sourceFaqIds` is empty, and `mode` is `fallback` with this fixed answer:

> Sorry, I couldn't find this information in the available college FAQ knowledge base. Please contact the college department for assistance.

Invalid ask payloads and malformed JSON return HTTP 400. Unknown routes return 404. Oversized JSON returns 413. Unexpected server failures return a generic 500 response. Ask requests are rate-limited to 30 per minute per IP.