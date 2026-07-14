import { requestItem, requestList, requestVoid } from '../request';
import type { ListResult } from '@/types/common';
import type { Faq, FaqListQuery, UpdateFaqInput } from '@/types/faq';

export const faqsApi = {
  list(query: FaqListQuery): Promise<ListResult<Faq>> {
    return requestList<Faq>({ url: '/faqs', method: 'GET', params: query });
  },

  getById(id: string): Promise<Faq> {
    return requestItem<Faq>({ url: `/faqs/${id}`, method: 'GET' });
  },

  update(id: string, input: UpdateFaqInput): Promise<Faq> {
    return requestItem<Faq>({ url: `/faqs/${id}`, method: 'PATCH', data: input });
  },

  remove(id: string): Promise<void> {
    return requestVoid({ url: `/faqs/${id}`, method: 'DELETE' });
  },
};
