import { faqsApi } from '@/lib/api/endpoints/faqs';
import type { Faq, FaqListQuery, UpdateFaqInput } from '@/types/faq';
import { createCrudQueries } from './createCrudQueries';

export const faqQueries = createCrudQueries<Faq, FaqListQuery, never, UpdateFaqInput>({
  resourceKey: 'faqs',
  list: faqsApi.list,
  getById: faqsApi.getById,
  update: faqsApi.update,
  remove: faqsApi.remove,
});
