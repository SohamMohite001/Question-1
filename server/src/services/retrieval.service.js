const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'can', 'do', 'does', 'for', 'from', 'how', 'i', 'in',
  'is', 'it', 'me', 'of', 'on', 'or', 'the', 'to', 'what', 'when', 'where',
  'which', 'who', 'why', 'with', 'would', 'you', 'your', 'this', 'that', 'my',
  'please', 'tell', 'about', 'college',
]);

const TOKEN_ALIASES = new Map([
  ['admissions', 'admission'], ['applications', 'application'], ['fees', 'fee'],
  ['courses', 'course'], ['programmes', 'programme'], ['programs', 'program'],
  ['documents', 'document'], ['requirements', 'requirement'], ['examinations', 'exam'],
  ['examination', 'exam'], ['exams', 'exam'], ['results', 'result'],
  ['scholarships', 'scholarship'], ['placements', 'placement'], ['internships', 'internship'],
  ['deadlines', 'deadline'], ['years', 'year'], ['books', 'book'], ['labs', 'lab'],
  ['methods', 'method'], ['statistics', 'statistic'], ['dates', 'date'],
]);

export function normalizeQuestion(question) {
  return question.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

export function tokenize(question) {
  return normalizeQuestion(question)
    .split(' ')
    .filter((token) => token && !STOP_WORDS.has(token))
    .map((token) => TOKEN_ALIASES.get(token) ?? token);
}

function scoreCandidate(queryTokens, faq) {
  const searchableTokens = new Set(tokenize(`${faq.question} ${faq.keywords.join(' ')}`));
  const matchedTokens = queryTokens.filter((token) => searchableTokens.has(token));
  if (!matchedTokens.length) return 0;

  const queryCoverage = matchedTokens.length / queryTokens.length;
  const faqCoverage = matchedTokens.length / Math.min(searchableTokens.size, 8);
  return (queryCoverage * 0.75) + (faqCoverage * 0.25);
}

export function findRelevantFaq(question, faqs, {
  minimumScore = 0.32,
  ambiguityMargin = 0.08,
} = {}) {
  const normalizedQuestion = normalizeQuestion(question);
  const exactMatch = faqs.find((faq) => normalizeQuestion(faq.question) === normalizedQuestion);
  if (exactMatch) return { status: 'matched', faq: exactMatch, score: 1, exact: true };

  const queryTokens = [...new Set(tokenize(question))];
  if (!queryTokens.length) return { status: 'no-match', candidates: [] };

  const candidates = faqs
    .map((faq) => ({ faq, score: scoreCandidate(queryTokens, faq) }))
    .filter((candidate) => candidate.score >= minimumScore)
    .sort((left, right) => right.score - left.score || left.faq.id.localeCompare(right.faq.id));

  if (!candidates.length) return { status: 'no-match', candidates: [] };
  if (candidates.length > 1 && candidates[0].score - candidates[1].score <= ambiguityMargin) {
    return { status: 'ambiguous', candidates: candidates.slice(0, 3) };
  }
  return { status: 'matched', ...candidates[0], exact: false };
}