const API_ROOT = '/api';

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(`${API_ROOT}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'content-type': 'application/json', ...options.headers },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.error ?? `Request failed (${response.status}).`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The request took too long. Please try again.');
    if (error instanceof TypeError) throw new Error('Could not reach the FAQ service. Check that the backend is running.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function fetchFaqs() {
  return request('/faq/list');
}

export function askQuestion(question) {
  return request('/faq/ask', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
}