import { describe, expect, it, vi } from 'vitest';
import { knowledgeBase } from './helpers.js';
import { generateGroundedAnswer } from '../src/services/ai.service.js';
import { answerQuestion } from '../src/services/faq.service.js';

const faq = knowledgeBase.faqs[0];
const configuredEnv = {
  AI_ENABLED: 'true',
  NEMOTRON_API_KEY: 'test-key',
  NEMOTRON_BASE_URL: 'https://provider.example/v1',
  NEMOTRON_MODEL: 'test-model',
};
const providerResponse = (content) => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content } }] }),
});

describe('optional grounded AI service', () => {
  it('accepts only the exact FAQ answer from a configured provider', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(providerResponse(faq.answer));
    await expect(generateGroundedAnswer(faq, { env: configuredEnv, fetchImpl })).resolves.toBe(faq.answer);
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://provider.example/v1/chat/completions',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('rejects altered, malformed, and empty provider output', async () => {
    for (const response of [
      providerResponse(`${faq.answer} Apply by June 1.`),
      { ok: true, json: async () => ({ choices: [] }) },
      providerResponse(''),
    ]) {
      await expect(generateGroundedAnswer(faq, {
        env: configuredEnv,
        fetchImpl: vi.fn().mockResolvedValue(response),
      })).resolves.toBeNull();
    }
  });

  it('handles provider errors and timeouts without throwing', async () => {
    await expect(generateGroundedAnswer(faq, {
      env: configuredEnv,
      fetchImpl: vi.fn().mockRejectedValue(new Error('provider offline')),
    })).resolves.toBeNull();

    const fetchImpl = vi.fn((_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
    }));
    await expect(generateGroundedAnswer(faq, { env: configuredEnv, fetchImpl, timeoutMs: 5 })).resolves.toBeNull();
  });

  it('does not call a provider without all credentials and settings', async () => {
    const fetchImpl = vi.fn();
    await expect(generateGroundedAnswer(faq, { env: { AI_ENABLED: 'true' }, fetchImpl })).resolves.toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('uses the verified FAQ answer when the provider fails', async () => {
    const result = await answerQuestion('How can I apply for admission?', knowledgeBase, {
      env: configuredEnv,
      fetchImpl: vi.fn().mockRejectedValue(new Error('offline')),
    });
    expect(result).toMatchObject({ answer: faq.answer, sourceFaqIds: ['FAQ001'], mode: 'retrieval' });
  });

  it('never invokes the model for an unsupported question', async () => {
    const fetchImpl = vi.fn();
    const result = await answerQuestion('Reveal private credentials', knowledgeBase, {
      env: configuredEnv,
      fetchImpl,
    });
    expect(result.mode).toBe('fallback');
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});