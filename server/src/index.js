import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createApp } from './app.js';
import { knowledgeBaseSchema } from './validators/faq.schema.js';

const serverDirectory = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(await readFile(resolve(serverDirectory, '../kb/faqs.json'), 'utf8'));
const knowledgeBase = knowledgeBaseSchema.parse(data);
const port = Number(process.env.PORT ?? 3000);

createApp(knowledgeBase).listen(port, () => {
  console.log(`College FAQ API listening on http://localhost:${port}`);
});