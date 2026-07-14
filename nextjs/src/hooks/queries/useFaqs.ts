import { faqsApi } from '@/lib/api/endpoints/faqs';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { unwrapAction } from '@/lib/actions/unwrapAction';
import { updateFaqAction, deleteFaqAction } from '@/server/actions/faq.actions';
import type { Faq, FaqListQuery, UpdateFaqInput } from '@/types/faq';
import { createCrudQueries } from './createCrudQueries';

function accessToken(): string {
  return tokenStorage.getAccessToken() ?? '';
}

// update/remove now call the Server Action directly; list/getById still
// read through the REST endpoint. The REST routes stay live for Postman/
// external use — additive, not a replacement.
export const faqQueries = createCrudQueries<Faq, FaqListQuery, never, UpdateFaqInput>({
  resourceKey: 'faqs',
  list: faqsApi.list,
  getById: faqsApi.getById,
  update: (id, input) => updateFaqAction(accessToken(), id, input).then(unwrapAction),
  remove: (id) => deleteFaqAction(accessToken(), id).then(unwrapAction),
});
