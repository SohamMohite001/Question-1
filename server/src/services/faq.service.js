import { FALLBACK_ANSWER, generateGroundedAnswer } from './ai.service.js';
import { findRelevantFaq } from './retrieval.service.js';

export async function answerQuestion(question, knowledgeBase, {
  env = process.env,
  fetchImpl = globalThis.fetch,
} = {}) {
  const result = findRelevantFaq(question, knowledgeBase.faqs);
  if (result.status !== 'matched') {
    return {
      success: true,
      answer: FALLBACK_ANSWER,
      sourceFaqIds: [],
      answeredFromKnowledgeBase: false,
      mode: 'fallback',
    };
  }

  const aiAnswer = await generateGroundedAnswer(result.faq, { env, fetchImpl });
  return {
    success: true,
    answer: aiAnswer ?? result.faq.answer,
    sourceFaqIds: [result.faq.id],
    answeredFromKnowledgeBase: true,
    mode: aiAnswer ? 'ai' : 'retrieval',
  };
}