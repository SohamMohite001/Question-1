import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const serverDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const knowledgeBase = JSON.parse(await readFile(resolve(serverDirectory, 'kb/faqs.json'), 'utf8'));