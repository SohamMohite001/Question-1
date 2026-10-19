import { describe, expect, it } from 'vitest';
import { knowledgeBase } from './helpers.js';
import { knowledgeBaseSchema } from '../src/validators/faq.schema.js';

describe('knowledge base schema', () => {
  it('accepts the sample dataset with at least 25 entries', () => {
    expect(knowledgeBaseSchema.parse(knowledgeBase).faqs.length).toBeGreaterThanOrEqual(25);
  });

  it('rejects duplicate IDs', () => {
    const duplicate = structuredClone(knowledgeBase);
    duplicate.faqs[1].id = duplicate.faqs[0].id;
    expect(knowledgeBaseSchema.safeParse(duplicate).success).toBe(false);
  });

  it('rejects missing fields and empty question or answer strings', () => {
    for (const mutate of [
      (faq) => { delete faq.answer; },
      (faq) => { faq.question = '  '; },
      (faq) => { faq.answer = ''; },
      (faq) => { faq.id = ''; },
    ]) {
      const invalid = structuredClone(knowledgeBase);
      mutate(invalid.faqs[0]);
      expect(knowledgeBaseSchema.safeParse(invalid).success).toBe(false);
    }
  });

  it('rejects undeclared categories and invalid keyword arrays', () => {
    const invalidCategory = structuredClone(knowledgeBase);
    invalidCategory.faqs[0].category = 'Unlisted';
    expect(knowledgeBaseSchema.safeParse(invalidCategory).success).toBe(false);

    const invalidKeywords = structuredClone(knowledgeBase);
    invalidKeywords.faqs[0].keywords = ['  '];
    expect(knowledgeBaseSchema.safeParse(invalidKeywords).success).toBe(false);
  });

  it('rejects fewer than 25 FAQs', () => {
    const tooSmall = structuredClone(knowledgeBase);
    tooSmall.faqs = tooSmall.faqs.slice(0, 24);
    expect(knowledgeBaseSchema.safeParse(tooSmall).success).toBe(false);
  });
});