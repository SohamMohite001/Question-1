import { z } from 'zod';

export const FAQ_CATEGORIES = [
  'Admissions',
  'Courses and Eligibility',
  'Fees and Scholarships',
  'Examinations',
  'Library and Facilities',
  'Placements and Career Support',
  'Department Contact and Student Support',
];

const nonEmptyString = z.string().trim().min(1);

export const faqSchema = z.object({
  id: z.string().regex(/^FAQ\d{3,}$/),
  category: z.enum(FAQ_CATEGORIES),
  question: nonEmptyString,
  answer: nonEmptyString,
  keywords: z.array(nonEmptyString).min(1),
});

export const metadataSchema = z.object({
  title: nonEmptyString,
  dataType: z.literal('sample'),
  verified: z.literal(false),
  description: nonEmptyString,
  categories: z.array(z.enum(FAQ_CATEGORIES)).min(1),
});

export const knowledgeBaseSchema = z.object({
  metadata: metadataSchema,
  faqs: z.array(faqSchema).min(25),
}).superRefine((knowledgeBase, context) => {
  const seenIds = new Set();
  for (const [index, faq] of knowledgeBase.faqs.entries()) {
    if (seenIds.has(faq.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['faqs', index, 'id'],
        message: `Duplicate FAQ id: ${faq.id}`,
      });
    }
    seenIds.add(faq.id);
  }

  const declaredCategories = new Set(knowledgeBase.metadata.categories);
  for (const [index, faq] of knowledgeBase.faqs.entries()) {
    if (!declaredCategories.has(faq.category)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['faqs', index, 'category'],
        message: `Category is not declared in metadata: ${faq.category}`,
      });
    }
  }
});