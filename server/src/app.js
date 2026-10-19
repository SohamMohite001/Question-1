import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { createFaqRouter } from './routes/faq.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

export function createApp(knowledgeBase) {
  const app = express();
  const allowedOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173,http://localhost:4173')
    .split(',').map((origin) => origin.trim()).filter(Boolean);

  app.disable('x-powered-by');
  app.use(cors({ origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed.'));
  } }));
  app.use(express.json({ limit: '16kb' }));
  app.use('/api/faq/ask', rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false }));

  app.get('/api/health', (_request, response) => {
    response.json({ success: true, status: 'ok' });
  });
  app.use('/api/faq', createFaqRouter(knowledgeBase));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}