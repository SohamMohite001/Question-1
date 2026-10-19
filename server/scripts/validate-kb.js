import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { knowledgeBaseSchema } from '../src/validators/faq.schema.js';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const data = JSON.parse(await readFile(resolve(projectRoot, 'server/kb/faqs.json'), 'utf8'));
const result = knowledgeBaseSchema.safeParse(data);

if (!result.success) {
  console.error('Knowledge base validation failed:');
  console.error(result.error.issues);
  process.exitCode = 1;
} else {
  console.log(`Knowledge base valid: ${result.data.faqs.length} FAQs across ${result.data.metadata.categories.length} categories (sample data).`);
}