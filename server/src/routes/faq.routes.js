import { Router } from 'express';
import { answerQuestion } from '../services/faq.service.js';
import { askQuestionSchema } from '../validators/ask.schema.js';

export function createFaqRouter(knowledgeBase) {
  const router = Router();

  router.get('/list', (_request, response) => {
    response.json({
      success: true,
      faqCount: knowledgeBase.faqs.length,
      metadata: knowledgeBase.metadata,
      faqs: knowledgeBase.faqs,
    });
  });

  router.post('/ask', async (request, response, next) => {
    const parsed = askQuestionSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({
        success: false,
        error: 'Invalid question. Provide a non-empty question of at most 500 characters.',
      });
      return;
    }

    try {
      response.json(await answerQuestion(parsed.data.question, knowledgeBase));
    } catch (error) {
      next(error);
    }
  });

  return router;
}