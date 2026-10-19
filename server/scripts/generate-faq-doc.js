import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { knowledgeBaseSchema } from '../src/validators/faq.schema.js';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const data = JSON.parse(await readFile(resolve(projectRoot, 'server/kb/faqs.json'), 'utf8'));
const knowledgeBase = knowledgeBaseSchema.parse(data);
const sections = knowledgeBase.metadata.categories.map((category) => {
  const faqs = knowledgeBase.faqs.filter((faq) => faq.category === category);
  const entries = faqs.map((faq) => `### ${faq.id}: ${faq.question}\n\n${faq.answer}`).join('\n\n');
  return `## ${category}\n\n${entries}`;
});
const document = `# ${knowledgeBase.metadata.title}\n\n> SAMPLE DATA — NOT VERIFIED COLLEGE INFORMATION\n\n${knowledgeBase.metadata.description}\n\n${sections.join('\n\n')}`;

await writeFile(resolve(projectRoot, 'docs/college-faqs.md'), `${document}\n`, 'utf8');
console.log(`Generated docs/college-faqs.md from ${knowledgeBase.faqs.length} FAQs.`);